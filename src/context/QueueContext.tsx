import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { QueueToken, Counter, Service, StaffProfile, InAppNotification } from '../types';
import { StorageAPI, subscribeToQueueUpdates } from '../lib/storage';
import { SoundEffects } from '../lib/soundEffects';
import { useAuth } from './AuthContext';

interface QueueContextType {
  tokens: QueueToken[];
  counters: Counter[];
  services: Service[];
  staff: StaffProfile[];
  notifications: InAppNotification[];
  myActiveToken: QueueToken | null;
  refreshQueue: () => void;
  generateToken: (params: {
    branchId: string;
    serviceId: string;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    entryChannel?: 'portal' | 'kiosk' | 'qr_code' | 'receptionist';
    isAppointment?: boolean;
    priority?: 'normal' | 'emergency' | 'accessibility';
  }) => { success: boolean; token?: QueueToken; error?: string };
  callNext: (staffId: string, counterId: string) => { success: boolean; token?: QueueToken; error?: string };
  startServing: (tokenId: string) => { success: boolean; token?: QueueToken; error?: string };
  completeService: (tokenId: string) => { success: boolean; error?: string };
  markMissed: (tokenId: string) => { success: boolean; error?: string };
  requestRecovery: (tokenId: string) => { success: boolean; message: string };
  requestDelay: (tokenId: string, minutes?: number) => { success: boolean };
  cancelToken: (tokenId: string) => { success: boolean; error?: string };
  markNotificationRead: (id: string) => void;
  resetDemoData: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentOrg, user } = useAuth();
  const orgId = currentOrg?.id || 'org-apollo-1';

  const [tokens, setTokens] = useState<QueueToken[]>(() => StorageAPI.getTokens(orgId));
  const [counters, setCounters] = useState<Counter[]>(() => StorageAPI.getCounters(orgId));
  const [services, setServices] = useState<Service[]>(() => StorageAPI.getServices(orgId));
  const [staff, setStaff] = useState<StaffProfile[]>(() => StorageAPI.getStaff(orgId));
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => StorageAPI.getNotifications(user?.id));

  const refreshQueue = useCallback(() => {
    if (!orgId) return;
    setTokens(StorageAPI.getTokens(orgId));
    setCounters(StorageAPI.getCounters(orgId));
    setServices(StorageAPI.getServices(orgId));
    setStaff(StorageAPI.getStaff(orgId));
    setNotifications(StorageAPI.getNotifications(user?.id));
  }, [orgId, user?.id]);

  // Subscribe to real-time events across windows and actions
  useEffect(() => {
    refreshQueue();

    const unsubscribe = subscribeToQueueUpdates((event) => {
      refreshQueue();

      // Audio notification if token is called for public display or customer
      if (event.type === 'TOKEN_CALLED') {
        const payload = event.payload as { token: QueueToken; counter: Counter };
        if (payload?.token && payload?.counter) {
          SoundEffects.speakAnnouncement(payload.token.token_number, payload.counter.counter_number);
        }
      } else if (event.type === 'TOKEN_CREATED') {
        SoundEffects.playSuccess();
      }
    });

    // Also listen to window storage sync
    const handleStorageSync = () => {
      refreshQueue();
    };
    window.addEventListener('qless_realtime_sync', handleStorageSync);

    return () => {
      unsubscribe();
      window.removeEventListener('qless_realtime_sync', handleStorageSync);
    };
  }, [orgId, refreshQueue]);

  // Find customer's active token
  const myActiveToken = tokens.find(t => 
    (t.customer_id === user?.id || t.customer_email === user?.email) &&
    ['waiting', 'approaching', 'called', 'serving', 'missed'].includes(t.status)
  ) || null;

  const generateToken = (params: {
    branchId: string;
    serviceId: string;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    entryChannel?: 'portal' | 'kiosk' | 'qr_code' | 'receptionist';
    isAppointment?: boolean;
    priority?: 'normal' | 'emergency' | 'accessibility';
  }) => {
    const res = StorageAPI.generateToken({
      organisationId: orgId,
      branchId: params.branchId,
      serviceId: params.serviceId,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail,
      customerId: user?.id,
      entryChannel: params.entryChannel || 'portal',
      isAppointment: params.isAppointment,
      priority: params.priority
    });
    refreshQueue();
    return res;
  };

  const callNext = (staffId: string, counterId: string) => {
    const res = StorageAPI.callNextToken(staffId, counterId);
    refreshQueue();
    return res;
  };

  const startServing = (tokenId: string) => {
    const res = StorageAPI.startServingToken(tokenId);
    refreshQueue();
    return res;
  };

  const completeService = (tokenId: string) => {
    const res = StorageAPI.completeService(tokenId);
    refreshQueue();
    return res;
  };

  const markMissed = (tokenId: string) => {
    const res = StorageAPI.markTokenMissed(tokenId);
    refreshQueue();
    return res;
  };

  const requestRecovery = (tokenId: string) => {
    const res = StorageAPI.requestTokenRecovery(tokenId);
    refreshQueue();
    return res;
  };

  const requestDelay = (tokenId: string, minutes: number = 10) => {
    const res = StorageAPI.requestExtraWaitingTime(tokenId, minutes);
    refreshQueue();
    return res;
  };

  const cancelToken = (tokenId: string) => {
    const res = StorageAPI.cancelToken(tokenId);
    refreshQueue();
    return res;
  };

  const markNotificationRead = (id: string) => {
    StorageAPI.markNotificationRead(id);
    refreshQueue();
  };

  const resetDemoData = () => {
    StorageAPI.resetDemoData();
    refreshQueue();
  };

  return (
    <QueueContext.Provider
      value={{
        tokens,
        counters,
        services,
        staff,
        notifications,
        myActiveToken,
        refreshQueue,
        generateToken,
        callNext,
        startServing,
        completeService,
        markMissed,
        requestRecovery,
        requestDelay,
        cancelToken,
        markNotificationRead,
        resetDemoData
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
