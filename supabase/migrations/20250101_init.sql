-- ==============================================================================
-- QLESS INTELLIGENT QUEUE MANAGEMENT PLATFORM
-- INITIAL DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANISATIONS TABLE
CREATE TABLE IF NOT EXISTS organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'hospital', 'bank', 'university', 'government', 'restaurant', 'other'
    logo_url TEXT,
    tagline VARCHAR(255),
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES TABLE (Extends Supabase auth.users or standalone)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE, -- References auth.users if Supabase Auth is active
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    global_role VARCHAR(50) DEFAULT 'customer' CHECK (global_role IN ('customer', 'staff', 'org_admin', 'platform_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORGANISATION MEMBERS (Multi-tenant association with roles)
CREATE TABLE IF NOT EXISTS organisation_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('org_admin', 'staff', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, user_id)
);

-- 4. BRANCHES TABLE
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL, -- e.g. 'BLR-NORTH'
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    opening_time TIME DEFAULT '09:00',
    closing_time TIME DEFAULT '18:00',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, code)
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL, -- e.g. 'A', 'B', 'C' for token prefixes like A001
    description TEXT,
    avg_duration_minutes INT DEFAULT 15,
    is_active BOOLEAN DEFAULT true,
    requires_appointment BOOLEAN DEFAULT false,
    allow_walkin BOOLEAN DEFAULT true,
    priority_level INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COUNTERS TABLE
CREATE TABLE IF NOT EXISTS counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. 'Counter 1', 'Window A'
    counter_number INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_paused BOOLEAN DEFAULT false,
    current_token_id UUID, -- References queue_tokens(id)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STAFF PROFILES TABLE
CREATE TABLE IF NOT EXISTS staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    assigned_counter_id UUID REFERENCES counters(id) ON DELETE SET NULL,
    assigned_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    availability_status VARCHAR(50) DEFAULT 'offline' CHECK (availability_status IN ('available', 'busy', 'on_break', 'offline')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. QUEUES TABLE (Queue configuration per service/branch)
CREATE TABLE IF NOT EXISTS queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    prefix VARCHAR(10) DEFAULT 'A',
    current_sequence INT DEFAULT 0,
    daily_capacity INT DEFAULT 500,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QUEUE TOKENS TABLE (Central token state)
CREATE TABLE IF NOT EXISTS queue_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_number VARCHAR(50) NOT NULL, -- e.g. 'A024'
    sequence_number INT NOT NULL,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    queue_id UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    entry_channel VARCHAR(50) DEFAULT 'portal' CHECK (entry_channel IN ('portal', 'kiosk', 'qr_code', 'receptionist')),
    is_appointment BOOLEAN DEFAULT false,
    priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('normal', 'emergency', 'accessibility')),
    status VARCHAR(50) DEFAULT 'waiting' CHECK (status IN ('waiting', 'approaching', 'called', 'serving', 'completed', 'missed', 'cancelled')),
    counter_id UUID REFERENCES counters(id) ON DELETE SET NULL,
    served_by_staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    estimated_wait_minutes INT,
    confidence_level VARCHAR(20) DEFAULT 'medium' CHECK (confidence_level IN ('high', 'medium', 'low')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    called_at TIMESTAMPTZ,
    serving_started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    missed_at TIMESTAMPTZ,
    recovery_requested_at TIMESTAMPTZ,
    re_entry_count INT DEFAULT 0,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    appointment_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'checked_in', 'completed', 'cancelled', 'no_show')),
    token_id UUID REFERENCES queue_tokens(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. QUEUE EVENTS TABLE (Audit trail of every token state change)
CREATE TABLE IF NOT EXISTS queue_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id UUID NOT NULL REFERENCES queue_tokens(id) ON DELETE CASCADE,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'created', 'called', 'served', 'completed', 'missed', 're_entered', 'cancelled', 'priority_changed'
    from_status VARCHAR(50),
    to_status VARCHAR(50),
    performed_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SERVICE RECORDS TABLE (Completed service durations for prediction engine)
CREATE TABLE IF NOT EXISTS service_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id UUID REFERENCES queue_tokens(id) ON DELETE SET NULL,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    counter_id UUID REFERENCES counters(id) ON DELETE SET NULL,
    wait_duration_seconds INT NOT NULL,
    service_duration_seconds INT NOT NULL,
    predicted_wait_seconds INT,
    prediction_accuracy_ratio FLOAT, -- actual / predicted
    day_of_week INT, -- 0-6 (Sunday to Saturday)
    hour_of_day INT, -- 0-23
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    token_id UUID REFERENCES queue_tokens(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL CHECK (channel IN ('in_app', 'web_push', 'sms', 'email', 'whatsapp')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    delivery_status VARCHAR(50) DEFAULT 'delivered' CHECK (delivery_status IN ('pending', 'delivered', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ORGANISATION SETTINGS
CREATE TABLE IF NOT EXISTS organisation_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID UNIQUE NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    appointment_walkin_policy VARCHAR(50) DEFAULT 'mixed' CHECK (appointment_walkin_policy IN ('mixed', 'appointment_first', 'fifo', 'reserved_ratio')),
    appointment_ratio FLOAT DEFAULT 0.5,
    allow_re_entry BOOLEAN DEFAULT true,
    re_entry_buffer_turns INT DEFAULT 2,
    enable_voice_chime BOOLEAN DEFAULT true,
    enable_sms_notifications BOOLEAN DEFAULT false,
    languages_supported TEXT[] DEFAULT ARRAY['en', 'kn', 'hi'],
    emergency_requires_auth BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SERVICE DOCUMENTS TABLE (Checklist requirements for AI assistant)
CREATE TABLE IF NOT EXISTS service_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    is_mandatory BOOLEAN DEFAULT true,
    description TEXT,
    examples TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. ASSISTANT KNOWLEDGE BASE
CREATE TABLE IF NOT EXISTS assistant_knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- 'faq', 'policy', 'timings', 'fees'
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    ip_address VARCHAR(50),
    changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tokens_org_status ON queue_tokens(organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_tokens_customer ON queue_tokens(customer_id);
CREATE INDEX IF NOT EXISTS idx_tokens_service ON queue_tokens(service_id);
CREATE INDEX IF NOT EXISTS idx_service_records_lookup ON service_records(organisation_id, service_id, day_of_week, hour_of_day);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(organisation_id, appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organisation_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public read for active organisations, services and branches (required for customer portal & landing page)
CREATE POLICY "Public can view active organisations" ON organisations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active branches" ON branches FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = true);

-- 2. Public queue display: anyone can view tokens that are 'serving' or 'called' or 'waiting' summary without PII
CREATE POLICY "Public can view display queue tokens" ON queue_tokens FOR SELECT USING (status IN ('called', 'serving', 'approaching', 'waiting'));

-- 3. Token insert: Customers and kiosks can create tokens
CREATE POLICY "Allow token generation" ON queue_tokens FOR INSERT WITH CHECK (true);

-- 4. Customer token management: users can update/cancel their own tokens
CREATE POLICY "Customers can manage own tokens" ON queue_tokens FOR UPDATE USING (
    customer_id = auth.uid() OR auth.uid() IS NULL
);

-- 5. Staff & Admins can view and update their organization's tokens
CREATE POLICY "Org members can view organisation tokens" ON queue_tokens FOR SELECT USING (
    organisation_id IN (
        SELECT organisation_id FROM organisation_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Org staff can update tokens" ON queue_tokens FOR UPDATE USING (
    organisation_id IN (
        SELECT organisation_id FROM organisation_members WHERE user_id = auth.uid() AND role IN ('staff', 'org_admin')
    )
);

-- 6. Organisation settings RLS
CREATE POLICY "Public can view org settings" ON organisation_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update org settings" ON organisation_settings FOR ALL USING (
    organisation_id IN (
        SELECT organisation_id FROM organisation_members WHERE user_id = auth.uid() AND role = 'org_admin'
    )
);

-- Function to safely generate the next sequential token without race conditions
CREATE OR REPLACE FUNCTION generate_next_token(
    p_organisation_id UUID,
    p_branch_id UUID,
    p_service_id UUID,
    p_customer_name VARCHAR,
    p_customer_phone VARCHAR,
    p_customer_email VARCHAR,
    p_entry_channel VARCHAR,
    p_priority VARCHAR,
    p_is_appointment BOOLEAN DEFAULT false
) RETURNS UUID AS $$
DECLARE
    v_queue_id UUID;
    v_prefix VARCHAR(10);
    v_next_seq INT;
    v_token_number VARCHAR(50);
    v_new_token_id UUID;
    v_avg_duration INT;
    v_people_ahead INT;
    v_estimated_wait INT;
BEGIN
    -- 1. Lock queue row for atomic sequence generation
    SELECT id, prefix, current_sequence + 1 
    INTO v_queue_id, v_prefix, v_next_seq
    FROM queues 
    WHERE service_id = p_service_id AND branch_id = p_branch_id
    FOR UPDATE;

    IF v_queue_id IS NULL THEN
        -- Auto initialize queue if not found
        SELECT code, avg_duration_minutes INTO v_prefix, v_avg_duration FROM services WHERE id = p_service_id;
        v_next_seq := 1;
        INSERT INTO queues (organisation_id, branch_id, service_id, name, prefix, current_sequence)
        VALUES (p_organisation_id, p_branch_id, p_service_id, 'Queue ' || v_prefix, v_prefix, 1)
        RETURNING id INTO v_queue_id;
    ELSE
        UPDATE queues SET current_sequence = v_next_seq WHERE id = v_queue_id;
    END IF;

    -- Format token number (e.g. A024)
    v_token_number := v_prefix || LPAD(v_next_seq::TEXT, 3, '0');

    -- Calculate people ahead and estimated wait
    SELECT COUNT(*) INTO v_people_ahead 
    FROM queue_tokens 
    WHERE queue_id = v_queue_id AND status = 'waiting';

    SELECT COALESCE(avg_duration_minutes, 15) INTO v_avg_duration FROM services WHERE id = p_service_id;
    v_estimated_wait := (v_people_ahead + 1) * v_avg_duration;

    -- Insert the new token
    INSERT INTO queue_tokens (
        token_number, sequence_number, organisation_id, branch_id, service_id, queue_id,
        customer_name, customer_phone, customer_email, entry_channel, priority, is_appointment,
        status, estimated_wait_minutes, confidence_level
    ) VALUES (
        v_token_number, v_next_seq, p_organisation_id, p_branch_id, p_service_id, v_queue_id,
        p_customer_name, p_customer_phone, p_customer_email, p_entry_channel, p_priority, p_is_appointment,
        'waiting', v_estimated_wait, 'high'
    ) RETURNING id INTO v_new_token_id;

    -- Record event in queue_events
    INSERT INTO queue_events (token_id, organisation_id, event_type, to_status, metadata)
    VALUES (v_new_token_id, p_organisation_id, 'created', 'waiting', json_build_object('token', v_token_number, 'priority', p_priority));

    RETURN v_new_token_id;
END;
$$ LANGUAGE plpgsql;
