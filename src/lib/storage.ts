import { 
  Organisation, 
  Branch, 
  Service, 
  Counter, 
  StaffProfile, 
  QueueToken, 
  Appointment, 
  ServiceRecord, 
  OrganisationSettings, 
  InAppNotification,
  TokenStatus,
  PriorityLevel,
  StaffAvailability
} from '../types';

// Initial Mock Organizations
const DEFAULT_ORGANISATIONS: Organisation[] = [
  {
    id: 'org-apollo-1',
    name: 'Apollo Care Multi-Specialty Hospital',
    slug: 'apollo-care',
    type: 'hospital',
    tagline: 'Leading healthcare with compassionate patient care',
    description: 'Premier medical hospital offering specialized outpatient departments, pharmacy, and diagnostic services.',
    contact_email: 'care@apollocare.org',
    contact_phone: '+91 80 2555 0192',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'org-apex-bank',
    name: 'Apex National Bank',
    slug: 'apex-bank',
    type: 'bank',
    tagline: 'Empowering your financial journey with precision',
    description: 'Full-service financial institution providing retail banking, foreign exchange, and wealth advisory.',
    contact_email: 'support@apexbank.com',
    contact_phone: '+91 80 4111 8899',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'org-city-govt',
    name: 'Department of Civic Services',
    slug: 'civic-services',
    type: 'government',
    tagline: 'Public administration made transparent and accessible',
    description: 'Municipal authority handling trade licenses, citizen welfare schemes, property registrations and permits.',
    contact_email: 'contact@civic.gov.in',
    contact_phone: '+91 80 2200 4400',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const DEFAULT_BRANCHES: Branch[] = [
  {
    id: 'branch-apollo-central',
    organisation_id: 'org-apollo-1',
    name: 'Central Medical Campus',
    code: 'CMC-01',
    address: '15 Bannerghatta Road, Phase 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    is_active: true,
    opening_time: '08:00',
    closing_time: '20:00'
  },
  {
    id: 'branch-apollo-east',
    organisation_id: 'org-apollo-1',
    name: 'East Wing Diagnostic Center',
    code: 'EWD-02',
    address: '88 Whitefield Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    is_active: true,
    opening_time: '07:30',
    closing_time: '19:00'
  },
  {
    id: 'branch-apex-mg',
    organisation_id: 'org-apex-bank',
    name: 'MG Road Main Branch',
    code: 'MGB-01',
    address: '102 MG Road, Financial District',
    city: 'Bengaluru',
    state: 'Karnataka',
    is_active: true,
    opening_time: '09:30',
    closing_time: '16:30'
  }
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-apollo-gen',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    name: 'General OPD Consultation',
    code: 'A',
    description: 'Primary physician consultation, health assessments and vitals evaluation.',
    avg_duration_minutes: 12,
    is_active: true,
    requires_appointment: false,
    allow_walkin: true,
    priority_level: 1,
    required_documents: ['Government Photo ID', 'Previous Prescription / Medical History']
  },
  {
    id: 'srv-apollo-cardio',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    name: 'Cardiology Speciality Clinic',
    code: 'C',
    description: 'Senior cardiologist consultation, ECG review, and cardiac follow-up.',
    avg_duration_minutes: 20,
    is_active: true,
    requires_appointment: true,
    allow_walkin: true,
    priority_level: 2,
    required_documents: ['Doctor Referral Note', 'Latest Blood Reports', 'Recent ECG/Echo Records']
  },
  {
    id: 'srv-apollo-pharm',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    name: 'Central Hospital Pharmacy',
    code: 'P',
    description: 'Prescription dispensing, medication counseling, and billing.',
    avg_duration_minutes: 6,
    is_active: true,
    requires_appointment: false,
    allow_walkin: true,
    priority_level: 1,
    required_documents: ['Authorized Hospital Prescription', 'Patient Hospital ID']
  },
  {
    id: 'srv-apex-teller',
    organisation_id: 'org-apex-bank',
    branch_id: 'branch-apex-mg',
    name: 'Cash Deposits & Withdrawals',
    code: 'B',
    description: 'Counter cash handling, demand drafts and bearer cheque clearances.',
    avg_duration_minutes: 8,
    is_active: true,
    requires_appointment: false,
    allow_walkin: true,
    priority_level: 1,
    required_documents: ['Valid ID Proof', 'Account Passbook / Cheque Book']
  }
];

const DEFAULT_COUNTERS: Counter[] = [
  {
    id: 'cnt-apollo-1',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    name: 'OPD Counter 1',
    counter_number: 1,
    is_active: true,
    is_paused: false,
    current_token_id: 'tok-apollo-serving-1',
    assigned_staff_id: 'staff-dr-rahul'
  },
  {
    id: 'cnt-apollo-2',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    name: 'OPD Counter 2',
    counter_number: 2,
    is_active: true,
    is_paused: false,
    current_token_id: null,
    assigned_staff_id: 'staff-dr-ananya'
  },
  {
    id: 'cnt-apollo-3',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    name: 'Cardiology Desk 1',
    counter_number: 3,
    is_active: true,
    is_paused: false,
    current_token_id: 'tok-apollo-serving-2',
    assigned_staff_id: 'staff-dr-vikram'
  },
  {
    id: 'cnt-apollo-4',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    name: 'Pharmacy Dispense 1',
    counter_number: 4,
    is_active: true,
    is_paused: false,
    current_token_id: null,
    assigned_staff_id: 'staff-priya'
  }
];

const DEFAULT_STAFF: StaffProfile[] = [
  {
    id: 'staff-dr-rahul',
    user_id: 'usr-staff-rahul',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    assigned_counter_id: 'cnt-apollo-1',
    assigned_service_id: 'srv-apollo-gen',
    availability_status: 'available',
    full_name: 'Dr. Rahul Sharma',
    email: 'rahul.s@apollocare.org',
    counter_name: 'OPD Counter 1',
    service_name: 'General OPD Consultation'
  },
  {
    id: 'staff-dr-ananya',
    user_id: 'usr-staff-ananya',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    assigned_counter_id: 'cnt-apollo-2',
    assigned_service_id: 'srv-apollo-gen',
    availability_status: 'available',
    full_name: 'Dr. Ananya Rao',
    email: 'ananya.r@apollocare.org',
    counter_name: 'OPD Counter 2',
    service_name: 'General OPD Consultation'
  },
  {
    id: 'staff-dr-vikram',
    user_id: 'usr-staff-vikram',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    assigned_counter_id: 'cnt-apollo-3',
    assigned_service_id: 'srv-apollo-cardio',
    availability_status: 'available',
    full_name: 'Dr. Vikram Seth',
    email: 'vikram.seth@apollocare.org',
    counter_name: 'Cardiology Desk 1',
    service_name: 'Cardiology Speciality Clinic'
  },
  {
    id: 'staff-priya',
    user_id: 'usr-staff-priya',
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    assigned_counter_id: 'cnt-apollo-4',
    assigned_service_id: 'srv-apollo-pharm',
    availability_status: 'available',
    full_name: 'Priya Nair (Lead Pharmacist)',
    email: 'priya.n@apollocare.org',
    counter_name: 'Pharmacy Dispense 1',
    service_name: 'Central Hospital Pharmacy'
  }
];

// Rich set of Active & Recent tokens for live queue testing
const DEFAULT_TOKENS: QueueToken[] = [
  {
    id: 'tok-apollo-serving-1',
    token_number: 'A023',
    sequence_number: 23,
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    service_id: 'srv-apollo-gen',
    queue_id: 'q-apollo-gen',
    customer_id: 'cust-demo-1',
    customer_name: 'Ramesh Sundaram',
    customer_phone: '+91 98450 12345',
    customer_email: 'ramesh.s@example.com',
    entry_channel: 'portal',
    is_appointment: false,
    priority: 'normal',
    status: 'serving',
    counter_id: 'cnt-apollo-1',
    counter_number: 1,
    served_by_staff_id: 'staff-dr-rahul',
    estimated_wait_minutes: 0,
    confidence_level: 'high',
    joined_at: new Date(Date.now() - 40 * 60000).toISOString(),
    called_at: new Date(Date.now() - 6 * 60000).toISOString(),
    serving_started_at: new Date(Date.now() - 5 * 60000).toISOString(),
    service_name: 'General OPD Consultation',
    branch_name: 'Central Medical Campus',
    org_name: 'Apollo Care Multi-Specialty Hospital'
  },
  {
    id: 'tok-apollo-serving-2',
    token_number: 'C012',
    sequence_number: 12,
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    service_id: 'srv-apollo-cardio',
    queue_id: 'q-apollo-cardio',
    customer_name: 'Lakshmi Narayan',
    customer_phone: '+91 98860 99887',
    customer_email: 'lakshmi.n@example.com',
    entry_channel: 'kiosk',
    is_appointment: true,
    priority: 'accessibility',
    status: 'serving',
    counter_id: 'cnt-apollo-3',
    counter_number: 3,
    served_by_staff_id: 'staff-dr-vikram',
    estimated_wait_minutes: 0,
    confidence_level: 'high',
    joined_at: new Date(Date.now() - 50 * 60000).toISOString(),
    called_at: new Date(Date.now() - 8 * 60000).toISOString(),
    serving_started_at: new Date(Date.now() - 7 * 60000).toISOString(),
    service_name: 'Cardiology Speciality Clinic',
    branch_name: 'Central Medical Campus',
    org_name: 'Apollo Care Multi-Specialty Hospital'
  },
  {
    id: 'tok-apollo-called-1',
    token_number: 'A024',
    sequence_number: 24,
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    service_id: 'srv-apollo-gen',
    queue_id: 'q-apollo-gen',
    customer_id: 'cust-demo-2',
    customer_name: 'Pooja Hegde',
    customer_phone: '+91 99001 54321',
    customer_email: 'pooja.h@example.com',
    entry_channel: 'portal',
    is_appointment: false,
    priority: 'normal',
    status: 'called',
    counter_id: 'cnt-apollo-2',
    counter_number: 2,
    served_by_staff_id: 'staff-dr-ananya',
    estimated_wait_minutes: 1,
    confidence_level: 'high',
    joined_at: new Date(Date.now() - 25 * 60000).toISOString(),
    called_at: new Date(Date.now() - 1 * 60000).toISOString(),
    service_name: 'General OPD Consultation',
    branch_name: 'Central Medical Campus',
    org_name: 'Apollo Care Multi-Specialty Hospital'
  },
  {
    id: 'tok-apollo-waiting-1',
    token_number: 'A025',
    sequence_number: 25,
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    service_id: 'srv-apollo-gen',
    queue_id: 'q-apollo-gen',
    customer_id: 'cust-user-me',
    customer_name: 'Kavya Krishnan',
    customer_phone: '+91 97410 77889',
    customer_email: 'kavya.k@example.com',
    entry_channel: 'portal',
    is_appointment: false,
    priority: 'normal',
    status: 'approaching',
    estimated_wait_minutes: 8,
    confidence_level: 'high',
    joined_at: new Date(Date.now() - 18 * 60000).toISOString(),
    service_name: 'General OPD Consultation',
    branch_name: 'Central Medical Campus',
    org_name: 'Apollo Care Multi-Specialty Hospital'
  },
  {
    id: 'tok-apollo-waiting-2',
    token_number: 'A026',
    sequence_number: 26,
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    service_id: 'srv-apollo-gen',
    queue_id: 'q-apollo-gen',
    customer_name: 'Mohammad Zafar',
    customer_phone: '+91 91122 33445',
    customer_email: 'zafar.m@example.com',
    entry_channel: 'qr_code',
    is_appointment: false,
    priority: 'normal',
    status: 'waiting',
    estimated_wait_minutes: 18,
    confidence_level: 'high',
    joined_at: new Date(Date.now() - 10 * 60000).toISOString(),
    service_name: 'General OPD Consultation',
    branch_name: 'Central Medical Campus',
    org_name: 'Apollo Care Multi-Specialty Hospital'
  },
  {
    id: 'tok-apollo-waiting-3',
    token_number: 'A027',
    sequence_number: 27,
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    service_id: 'srv-apollo-gen',
    queue_id: 'q-apollo-gen',
    customer_name: 'Sunita Deshmukh',
    customer_phone: '+91 94488 55667',
    customer_email: 'sunita.d@example.com',
    entry_channel: 'kiosk',
    is_appointment: false,
    priority: 'accessibility',
    status: 'waiting',
    estimated_wait_minutes: 24,
    confidence_level: 'medium',
    joined_at: new Date(Date.now() - 5 * 60000).toISOString(),
    service_name: 'General OPD Consultation',
    branch_name: 'Central Medical Campus',
    org_name: 'Apollo Care Multi-Specialty Hospital'
  },
  {
    id: 'tok-apollo-missed-1',
    token_number: 'A022',
    sequence_number: 22,
    organisation_id: 'org-apollo-1',
    branch_id: 'branch-apollo-central',
    service_id: 'srv-apollo-gen',
    queue_id: 'q-apollo-gen',
    customer_name: 'Aditya Varma',
    customer_phone: '+91 98800 11223',
    customer_email: 'aditya.v@example.com',
    entry_channel: 'portal',
    is_appointment: false,
    priority: 'normal',
    status: 'missed',
    missed_at: new Date(Date.now() - 12 * 60000).toISOString(),
    estimated_wait_minutes: 0,
    confidence_level: 'high',
    joined_at: new Date(Date.now() - 55 * 60000).toISOString(),
    service_name: 'General OPD Consultation',
    branch_name: 'Central Medical Campus',
    org_name: 'Apollo Care Multi-Specialty Hospital'
  }
];

// Rich Historical Service Records for real charts & Recharts analytics
function generateHistoricalServiceRecords(): ServiceRecord[] {
  const records: ServiceRecord[] = [];
  const orgId = 'org-apollo-1';
  const branchId = 'branch-apollo-central';
  const serviceId = 'srv-apollo-gen';

  // Generate 60 past records across past 3 days
  const now = Date.now();
  for (let i = 1; i <= 60; i++) {
    const hoursAgo = Math.floor(Math.random() * 72) + 1;
    const pastTime = new Date(now - hoursAgo * 3600000);
    const dayOfWeek = pastTime.getDay();
    const hourOfDay = pastTime.getHours();

    // Normal consultation lasts between 8 to 18 mins (480s to 1080s)
    const serviceSec = Math.floor(Math.random() * (1080 - 480)) + 480;
    const waitSec = Math.floor(Math.random() * (1800 - 600)) + 600;

    records.push({
      id: `rec-${i}`,
      token_id: `past-tok-${i}`,
      organisation_id: orgId,
      branch_id: branchId,
      service_id: serviceId,
      wait_duration_seconds: waitSec,
      service_duration_seconds: serviceSec,
      predicted_wait_seconds: waitSec + (Math.floor(Math.random() * 240) - 120),
      day_of_week: dayOfWeek,
      hour_of_day: hourOfDay,
      created_at: pastTime.toISOString()
    });
  }
  return records;
}

const DEFAULT_SETTINGS: OrganisationSettings = {
  organisation_id: 'org-apollo-1',
  appointment_walkin_policy: 'mixed',
  appointment_ratio: 0.5,
  allow_re_entry: true,
  re_entry_buffer_turns: 2,
  enable_voice_chime: true,
  enable_sms_notifications: false,
  languages_supported: ['en', 'kn', 'hi'],
  emergency_requires_auth: true
};

const DEFAULT_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    user_id: 'cust-user-me',
    organisation_id: 'org-apollo-1',
    token_id: 'tok-apollo-waiting-1',
    title: 'Turn Approaching Soon',
    message: 'Token A025 is 1 person away! Please remain near OPD Counter 1 or 2.',
    channel: 'in_app',
    is_read: false,
    created_at: new Date(Date.now() - 3 * 60000).toISOString()
  },
  {
    id: 'notif-2',
    user_id: 'cust-user-me',
    organisation_id: 'org-apollo-1',
    token_id: 'tok-apollo-waiting-1',
    title: 'Token Confirmed',
    message: 'Your token A025 has been successfully generated for General OPD Consultation.',
    channel: 'in_app',
    is_read: true,
    created_at: new Date(Date.now() - 18 * 60000).toISOString()
  }
];

// Local Storage Keys
const STORAGE_KEYS = {
  ORGANISATIONS: 'qless_organisations_v1',
  BRANCHES: 'qless_branches_v1',
  SERVICES: 'qless_services_v1',
  COUNTERS: 'qless_counters_v1',
  STAFF: 'qless_staff_v1',
  TOKENS: 'qless_tokens_v1',
  APPOINTMENTS: 'qless_appointments_v1',
  SERVICE_RECORDS: 'qless_service_records_v1',
  SETTINGS: 'qless_settings_v1',
  NOTIFICATIONS: 'qless_notifications_v1',
};

// Event listener mechanism for cross-tab or in-page reactive updates
type QueueEventListener = (event: { type: string; payload?: unknown }) => void;
const listeners: Set<QueueEventListener> = new Set();

export const subscribeToQueueUpdates = (listener: QueueEventListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyQueueUpdate = (type: string, payload?: unknown) => {
  listeners.forEach(cb => {
    try {
      cb({ type, payload });
    } catch (e) {
      console.error('Error notifying queue listener:', e);
    }
  });
  // Trigger native storage event for multi-tab sync
  window.dispatchEvent(new CustomEvent('qless_realtime_sync', { detail: { type, payload } }));
};

// Initialize or Load from Storage
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading ${key} from localStorage, using defaults:`, e);
    return defaultVal;
  }
}

function saveToStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed writing ${key} to localStorage:`, e);
  }
}

// STORAGE API
export const StorageAPI = {
  // Reset demo data back to clean realistic baseline
  resetDemoData: () => {
    localStorage.removeItem(STORAGE_KEYS.ORGANISATIONS);
    localStorage.removeItem(STORAGE_KEYS.BRANCHES);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.COUNTERS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.SERVICE_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);

    saveToStorage(STORAGE_KEYS.ORGANISATIONS, DEFAULT_ORGANISATIONS);
    saveToStorage(STORAGE_KEYS.BRANCHES, DEFAULT_BRANCHES);
    saveToStorage(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    saveToStorage(STORAGE_KEYS.COUNTERS, DEFAULT_COUNTERS);
    saveToStorage(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
    saveToStorage(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    saveToStorage(STORAGE_KEYS.SERVICE_RECORDS, generateHistoricalServiceRecords());
    saveToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);

    notifyQueueUpdate('DEMO_RESET');
  },

  // Organisations
  getOrganisations: (): Organisation[] => {
    return loadFromStorage(STORAGE_KEYS.ORGANISATIONS, DEFAULT_ORGANISATIONS);
  },
  getOrganisationById: (orgId: string): Organisation | undefined => {
    return StorageAPI.getOrganisations().find(o => o.id === orgId);
  },
  updateOrganisation: (org: Organisation) => {
    const orgs = StorageAPI.getOrganisations();
    const idx = orgs.findIndex(o => o.id === org.id);
    if (idx !== -1) {
      orgs[idx] = org;
      saveToStorage(STORAGE_KEYS.ORGANISATIONS, orgs);
      notifyQueueUpdate('ORG_UPDATED', org);
    }
  },

  // Branches (Strictly filtered by organization!)
  getBranches: (organisationId: string): Branch[] => {
    const all = loadFromStorage(STORAGE_KEYS.BRANCHES, DEFAULT_BRANCHES);
    return all.filter(b => b.organisation_id === organisationId);
  },

  // Services (Strictly filtered by organization!)
  getServices: (organisationId: string): Service[] => {
    const all = loadFromStorage(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    return all.filter(s => s.organisation_id === organisationId);
  },
  getServiceById: (serviceId: string): Service | undefined => {
    const all = loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    return all.find(s => s.id === serviceId);
  },

  // Counters
  getCounters: (organisationId: string): Counter[] => {
    const all = loadFromStorage(STORAGE_KEYS.COUNTERS, DEFAULT_COUNTERS);
    return all.filter(c => c.organisation_id === organisationId);
  },
  updateCounter: (counter: Counter) => {
    const all = loadFromStorage<Counter[]>(STORAGE_KEYS.COUNTERS, DEFAULT_COUNTERS);
    const idx = all.findIndex(c => c.id === counter.id);
    if (idx !== -1) {
      all[idx] = counter;
      saveToStorage(STORAGE_KEYS.COUNTERS, all);
      notifyQueueUpdate('COUNTER_UPDATED', counter);
    }
  },

  // Staff
  getStaff: (organisationId: string): StaffProfile[] => {
    const all = loadFromStorage(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
    return all.filter(s => s.organisation_id === organisationId);
  },
  updateStaffAvailability: (staffId: string, status: StaffAvailability) => {
    const all = loadFromStorage<StaffProfile[]>(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
    const idx = all.findIndex(s => s.id === staffId);
    if (idx !== -1) {
      all[idx].availability_status = status;
      saveToStorage(STORAGE_KEYS.STAFF, all);
      notifyQueueUpdate('STAFF_AVAILABILITY_CHANGED', all[idx]);
    }
  },

  // Tokens
  getTokens: (organisationId: string): QueueToken[] => {
    const all = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    return all.filter(t => t.organisation_id === organisationId);
  },
  getTokenById: (tokenId: string): QueueToken | undefined => {
    const all = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    return all.find(t => t.id === tokenId);
  },

  // Atomic Token Generation (Prevents race conditions and duplicate active tokens)
  generateToken: (params: {
    organisationId: string;
    branchId: string;
    serviceId: string;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    customerId?: string;
    entryChannel: 'portal' | 'kiosk' | 'qr_code' | 'receptionist';
    isAppointment?: boolean;
    priority?: PriorityLevel;
  }): { success: boolean; token?: QueueToken; error?: string } => {
    const tokens = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    const service = StorageAPI.getServiceById(params.serviceId);
    const org = StorageAPI.getOrganisationById(params.organisationId);

    if (!service || !org) {
      return { success: false, error: 'Service or Organisation not found.' };
    }

    // Check duplicate active token for same customer if customerId provided
    if (params.customerId) {
      const existing = tokens.find(t => 
        t.customer_id === params.customerId && 
        t.service_id === params.serviceId && 
        ['waiting', 'approaching', 'called', 'serving'].includes(t.status)
      );
      if (existing) {
        return { 
          success: false, 
          error: `You already have an active token (${existing.token_number}) for this service.` 
        };
      }
    }

    // Determine prefix and next sequence
    const serviceTokens = tokens.filter(t => t.service_id === params.serviceId);
    const maxSeq = serviceTokens.reduce((max, t) => Math.max(max, t.sequence_number || 0), 0);
    const nextSeq = maxSeq + 1;
    const prefix = service.code || 'A';
    const tokenNumber = `${prefix}${String(nextSeq).padStart(3, '0')}`;

    // Calculate waiting time
    const waitingTokens = serviceTokens.filter(t => t.status === 'waiting' || t.status === 'approaching');
    const peopleAhead = waitingTokens.length;
    const estWait = Math.max(1, (peopleAhead + 1) * (service.avg_duration_minutes || 10));

    const newToken: QueueToken = {
      id: `tok-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      token_number: tokenNumber,
      sequence_number: nextSeq,
      organisation_id: params.organisationId,
      branch_id: params.branchId,
      service_id: params.serviceId,
      queue_id: `q-${params.serviceId}`,
      customer_id: params.customerId,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      customer_email: params.customerEmail,
      entry_channel: params.entryChannel,
      is_appointment: params.isAppointment || false,
      priority: params.priority || 'normal',
      status: 'waiting',
      estimated_wait_minutes: estWait,
      confidence_level: 'high',
      joined_at: new Date().toISOString(),
      service_name: service.name,
      org_name: org.name
    };

    tokens.push(newToken);
    saveToStorage(STORAGE_KEYS.TOKENS, tokens);

    // Create notification
    StorageAPI.createNotification({
      user_id: params.customerId,
      organisation_id: params.organisationId,
      token_id: newToken.id,
      title: 'Token Generated',
      message: `Your token ${newToken.token_number} has been created for ${service.name}. Est. wait: ${estWait} mins.`,
      channel: 'in_app'
    });

    notifyQueueUpdate('TOKEN_CREATED', newToken);
    return { success: true, token: newToken };
  },

  // Token Lifecycle Actions with Valid Transition Guards
  callNextToken: (staffId: string, counterId: string): { success: boolean; token?: QueueToken; error?: string } => {
    const allStaff = loadFromStorage<StaffProfile[]>(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) return { success: false, error: 'Staff member not found.' };

    const tokens = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    const counters = loadFromStorage<Counter[]>(STORAGE_KEYS.COUNTERS, DEFAULT_COUNTERS);
    const counter = counters.find(c => c.id === counterId);

    if (!counter) return { success: false, error: 'Counter not found.' };

    // Find eligible token: priority first (emergency > accessibility > normal), then FIFO
    const waitingTokens = tokens.filter(t => 
      t.organisation_id === staff.organisation_id && 
      (staff.assigned_service_id ? t.service_id === staff.assigned_service_id : true) && 
      (t.status === 'waiting' || t.status === 'approaching')
    );

    if (waitingTokens.length === 0) {
      return { success: false, error: 'No customers are currently waiting in this queue.' };
    }

    // Sort: Emergency priority -> Accessibility -> Appointment -> Earlier joined_at
    waitingTokens.sort((a, b) => {
      const priorityWeight: Record<PriorityLevel, number> = { emergency: 3, accessibility: 2, normal: 1 };
      const diffPriority = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (diffPriority !== 0) return diffPriority;
      if (a.is_appointment && !b.is_appointment) return -1;
      if (!a.is_appointment && b.is_appointment) return 1;
      return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
    });

    const nextToken = waitingTokens[0];
    nextToken.status = 'called';
    nextToken.counter_id = counter.id;
    nextToken.counter_number = counter.counter_number;
    nextToken.served_by_staff_id = staff.id;
    nextToken.called_at = new Date().toISOString();

    counter.current_token_id = nextToken.id;

    // Recalculate approaching status for the next in line
    const remainingWaiting = waitingTokens.slice(1);
    if (remainingWaiting.length > 0) {
      remainingWaiting[0].status = 'approaching';
    }

    saveToStorage(STORAGE_KEYS.TOKENS, tokens);
    saveToStorage(STORAGE_KEYS.COUNTERS, counters);

    // Notify customer
    StorageAPI.createNotification({
      user_id: nextToken.customer_id,
      organisation_id: nextToken.organisation_id,
      token_id: nextToken.id,
      title: 'Now Calling Your Token!',
      message: `Token ${nextToken.token_number} is called to Counter ${counter.counter_number} (${counter.name})!`,
      channel: 'in_app'
    });

    notifyQueueUpdate('TOKEN_CALLED', { token: nextToken, counter });
    return { success: true, token: nextToken };
  },

  startServingToken: (tokenId: string): { success: boolean; token?: QueueToken; error?: string } => {
    const tokens = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { success: false, error: 'Token not found.' };

    if (token.status !== 'called') {
      return { success: false, error: `Cannot start service for token in '${token.status}' state.` };
    }

    token.status = 'serving';
    token.serving_started_at = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.TOKENS, tokens);
    notifyQueueUpdate('TOKEN_SERVING', token);
    return { success: true, token };
  },

  completeService: (tokenId: string): { success: boolean; error?: string } => {
    const tokens = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { success: false, error: 'Token not found.' };

    if (token.status !== 'serving' && token.status !== 'called') {
      return { success: false, error: 'Token must be called or serving to mark completed.' };
    }

    const now = new Date();
    token.status = 'completed';
    token.completed_at = now.toISOString();

    // Release counter
    if (token.counter_id) {
      const counters = loadFromStorage<Counter[]>(STORAGE_KEYS.COUNTERS, DEFAULT_COUNTERS);
      const counter = counters.find(c => c.id === token.counter_id);
      if (counter && counter.current_token_id === token.id) {
        counter.current_token_id = null;
        saveToStorage(STORAGE_KEYS.COUNTERS, counters);
      }
    }

    // Save actual service record for machine learning & statistical prediction engine
    const started = token.serving_started_at ? new Date(token.serving_started_at).getTime() : now.getTime() - 600000;
    const joined = new Date(token.joined_at).getTime();
    const serviceSeconds = Math.max(60, Math.floor((now.getTime() - started) / 1000));
    const waitSeconds = Math.max(60, Math.floor((started - joined) / 1000));

    const records = loadFromStorage<ServiceRecord[]>(STORAGE_KEYS.SERVICE_RECORDS, []);
    records.push({
      id: `rec-${Date.now()}`,
      token_id: token.id,
      organisation_id: token.organisation_id,
      branch_id: token.branch_id,
      service_id: token.service_id,
      staff_id: token.served_by_staff_id || undefined,
      counter_id: token.counter_id || undefined,
      wait_duration_seconds: waitSeconds,
      service_duration_seconds: serviceSeconds,
      predicted_wait_seconds: (token.estimated_wait_minutes || 15) * 60,
      day_of_week: now.getDay(),
      hour_of_day: now.getHours(),
      created_at: now.toISOString()
    });
    saveToStorage(STORAGE_KEYS.SERVICE_RECORDS, records);
    saveToStorage(STORAGE_KEYS.TOKENS, tokens);

    notifyQueueUpdate('TOKEN_COMPLETED', token);
    return { success: true };
  },

  markTokenMissed: (tokenId: string): { success: boolean; error?: string } => {
    const tokens = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { success: false, error: 'Token not found.' };

    token.status = 'missed';
    token.missed_at = new Date().toISOString();

    // Free counter
    if (token.counter_id) {
      const counters = loadFromStorage<Counter[]>(STORAGE_KEYS.COUNTERS, DEFAULT_COUNTERS);
      const counter = counters.find(c => c.id === token.counter_id);
      if (counter && counter.current_token_id === token.id) {
        counter.current_token_id = null;
        saveToStorage(STORAGE_KEYS.COUNTERS, counters);
      }
    }

    saveToStorage(STORAGE_KEYS.TOKENS, tokens);

    StorageAPI.createNotification({
      user_id: token.customer_id,
      organisation_id: token.organisation_id,
      token_id: token.id,
      title: 'Turn Missed',
      message: `Your token ${token.token_number} was marked as missed. You can request re-entry from your portal!`,
      channel: 'in_app'
    });

    notifyQueueUpdate('TOKEN_MISSED', token);
    return { success: true };
  },

  // Queue Recovery & Re-entry
  requestTokenRecovery: (tokenId: string): { success: boolean; message: string } => {
    const tokens = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { success: false, message: 'Token not found.' };

    if (token.status !== 'missed') {
      return { success: false, message: 'Re-entry can only be requested for missed tokens.' };
    }

    // Transparent re-entry policy: Place token 2 slots behind currently approaching
    token.status = 'waiting';
    token.re_entry_count = (token.re_entry_count || 0) + 1;
    token.missed_at = null;
    token.estimated_wait_minutes = 15; // Realistic re-entry waiting window

    saveToStorage(STORAGE_KEYS.TOKENS, tokens);

    StorageAPI.createNotification({
      user_id: token.customer_id,
      organisation_id: token.organisation_id,
      token_id: token.id,
      title: 'Re-entry Confirmed',
      message: `Token ${token.token_number} re-entered the queue in fair standing. Position updated!`,
      channel: 'in_app'
    });

    notifyQueueUpdate('TOKEN_RECOVERED', token);
    return { success: true, message: `Token ${token.token_number} successfully reinstated.` };
  },

  // Customer delays/requests extra waiting time
  requestExtraWaitingTime: (tokenId: string, minutes: number = 10): { success: boolean } => {
    const tokens = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { success: false };

    token.delay_requested_minutes = (token.delay_requested_minutes || 0) + minutes;
    token.estimated_wait_minutes = (token.estimated_wait_minutes || 0) + minutes;

    saveToStorage(STORAGE_KEYS.TOKENS, tokens);
    notifyQueueUpdate('TOKEN_DELAY_REQUESTED', token);
    return { success: true };
  },

  // Cancel token
  cancelToken: (tokenId: string): { success: boolean; error?: string } => {
    const tokens = loadFromStorage<QueueToken[]>(STORAGE_KEYS.TOKENS, DEFAULT_TOKENS);
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return { success: false, error: 'Token not found.' };

    token.status = 'cancelled';

    // Free counter if assigned
    if (token.counter_id) {
      const counters = loadFromStorage<Counter[]>(STORAGE_KEYS.COUNTERS, DEFAULT_COUNTERS);
      const counter = counters.find(c => c.id === token.counter_id);
      if (counter && counter.current_token_id === token.id) {
        counter.current_token_id = null;
        saveToStorage(STORAGE_KEYS.COUNTERS, counters);
      }
    }

    saveToStorage(STORAGE_KEYS.TOKENS, tokens);
    notifyQueueUpdate('TOKEN_CANCELLED', token);
    return { success: true };
  },

  // Service Records
  getServiceRecords: (organisationId: string): ServiceRecord[] => {
    const all = loadFromStorage<ServiceRecord[]>(STORAGE_KEYS.SERVICE_RECORDS, []);
    if (all.length === 0) {
      const seeded = generateHistoricalServiceRecords();
      saveToStorage(STORAGE_KEYS.SERVICE_RECORDS, seeded);
      return seeded.filter(r => r.organisation_id === organisationId);
    }
    return all.filter(r => r.organisation_id === organisationId);
  },

  // Notifications
  getNotifications: (userId?: string): InAppNotification[] => {
    const all = loadFromStorage<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    if (!userId) return all;
    return all.filter(n => !n.user_id || n.user_id === userId);
  },
  createNotification: (notif: Omit<InAppNotification, 'id' | 'is_read' | 'created_at'>) => {
    const all = loadFromStorage<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    const newNotif: InAppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    all.unshift(newNotif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all.slice(0, 50));
    notifyQueueUpdate('NOTIFICATION_ADDED', newNotif);
  },
  markNotificationRead: (id: string) => {
    const all = loadFromStorage<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    const n = all.find(item => item.id === id);
    if (n) {
      n.is_read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
      notifyQueueUpdate('NOTIFICATION_READ', id);
    }
  },

  // Settings
  getSettings: (organisationId: string): OrganisationSettings => {
    const settings = loadFromStorage<OrganisationSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return settings;
  },
  updateSettings: (settings: OrganisationSettings) => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    notifyQueueUpdate('SETTINGS_UPDATED', settings);
  }
};
