// Qless TypeScript Definitions

export type UserRole = 'customer' | 'staff' | 'org_admin' | 'platform_admin';

export type TokenStatus = 
  | 'waiting' 
  | 'approaching' 
  | 'called' 
  | 'serving' 
  | 'completed' 
  | 'missed' 
  | 'cancelled';

export type PriorityLevel = 'normal' | 'emergency' | 'accessibility';

export type StaffAvailability = 'available' | 'busy' | 'on_break' | 'offline';

export type EntryChannel = 'portal' | 'kiosk' | 'qr_code' | 'receptionist';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  global_role: UserRole;
  created_at: string;
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  type: 'hospital' | 'bank' | 'university' | 'government' | 'restaurant' | 'other';
  logo_url?: string;
  tagline: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  is_active: boolean;
  created_at: string;
}

export interface Branch {
  id: string;
  organisation_id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  is_active: boolean;
  opening_time: string;
  closing_time: string;
}

export interface Service {
  id: string;
  organisation_id: string;
  branch_id?: string;
  name: string;
  code: string; // Token prefix e.g. 'A', 'B'
  description: string;
  avg_duration_minutes: number;
  is_active: boolean;
  requires_appointment: boolean;
  allow_walkin: boolean;
  priority_level: number;
  required_documents?: string[];
}

export interface Counter {
  id: string;
  organisation_id: string;
  branch_id: string;
  name: string;
  counter_number: number;
  is_active: boolean;
  is_paused: boolean;
  current_token_id?: string | null;
  assigned_staff_id?: string | null;
}

export interface StaffProfile {
  id: string;
  user_id: string;
  organisation_id: string;
  branch_id?: string;
  assigned_counter_id?: string;
  assigned_service_id?: string;
  availability_status: StaffAvailability;
  full_name?: string;
  email?: string;
  counter_name?: string;
  service_name?: string;
}

export interface QueueToken {
  id: string;
  token_number: string;
  sequence_number: number;
  organisation_id: string;
  branch_id: string;
  service_id: string;
  queue_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  entry_channel: EntryChannel;
  is_appointment: boolean;
  priority: PriorityLevel;
  status: TokenStatus;
  counter_id?: string | null;
  counter_number?: number | null;
  served_by_staff_id?: string | null;
  estimated_wait_minutes: number;
  confidence_level: 'high' | 'medium' | 'low';
  joined_at: string;
  called_at?: string | null;
  serving_started_at?: string | null;
  completed_at?: string | null;
  missed_at?: string | null;
  re_entry_count?: number;
  service_name?: string;
  branch_name?: string;
  org_name?: string;
  delay_requested_minutes?: number;
}

export interface Appointment {
  id: string;
  organisation_id: string;
  branch_id: string;
  service_id: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  appointment_date: string;
  slot_time: string;
  status: 'scheduled' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';
  token_id?: string;
  notes?: string;
}

export interface ServiceRecord {
  id: string;
  token_id: string;
  organisation_id: string;
  branch_id: string;
  service_id: string;
  staff_id?: string;
  counter_id?: string;
  wait_duration_seconds: number;
  service_duration_seconds: number;
  predicted_wait_seconds: number;
  day_of_week: number;
  hour_of_day: number;
  created_at: string;
}

export interface OrganisationSettings {
  organisation_id: string;
  appointment_walkin_policy: 'mixed' | 'appointment_first' | 'fifo' | 'reserved_ratio';
  appointment_ratio: number;
  allow_re_entry: boolean;
  re_entry_buffer_turns: number;
  enable_voice_chime: boolean;
  enable_sms_notifications: boolean;
  languages_supported: string[];
  emergency_requires_auth: boolean;
}

export interface CrowdInsight {
  dayOfWeek: string;
  hourOfDay: number;
  hourLabel: string;
  averageWaitMinutes: number;
  customerVolume: number;
  crowdLevel: 'Low' | 'Moderate' | 'Peak' | 'Extreme';
}

export interface AdminRecommendation {
  id: string;
  type: 'warning' | 'info' | 'optimization' | 'urgent';
  title: string;
  description: string;
  impact: string;
  actionLabel?: string;
  metric?: string;
}

export interface InAppNotification {
  id: string;
  user_id?: string;
  organisation_id?: string;
  token_id?: string;
  title: string;
  message: string;
  channel: 'in_app' | 'web_push' | 'sms' | 'email';
  is_read: boolean;
  created_at: string;
}
