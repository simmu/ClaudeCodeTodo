// Offline utility functions for PWA

/**
 * Check if the browser is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Register service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registration successful with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      return null;
    }
  }
  return null;
};

/**
 * Listen for online/offline events
 */
export const setupOfflineListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log('App is online');
    onOnline();
  };

  const handleOffline = () => {
    console.log('App is offline');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Check if app is running as PWA
 */
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

/**
 * Show install prompt for PWA
 */
export const installPWA = (deferredPrompt: any | null): void => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  }
};

/**
 * Show notification (if permission granted)
 */
export const showNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, options);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission;
  }
  return 'denied';
};