// Service Worker Registration Utility
export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  private updateCallbacks: ((registration: ServiceWorkerRegistration) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      this.init();
    }
  }

  private async init() {
    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', this.registration);

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true;
              this.notifyUpdateCallbacks();
            }
          });
        }
      });

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed - page will reload');
        window.location.reload();
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // Check if app is online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Get current registration
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  // Check if update is available
  hasUpdate(): boolean {
    return this.updateAvailable;
  }

  // Update service worker
  async update(): Promise<void> {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Subscribe to update notifications
  onUpdate(callback: (registration: ServiceWorkerRegistration) => void): () => void {
    this.updateCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  private notifyUpdateCallbacks() {
    if (this.registration) {
      this.updateCallbacks.forEach(callback => callback(this.registration!));
    }
  }

  // Send message to service worker
  async sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!navigator.serviceWorker.controller) {
        reject(new Error('No service worker controller'));
        return;
      }

      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      messageChannel.port1.onmessageerror = (event) => {
        reject(new Error('Message error'));
      };

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
  }
}

// Create singleton instance
export const swManager = new ServiceWorkerManager();

// React hook for using service worker
export function useServiceWorker() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [hasUpdate, setHasUpdate] = React.useState(swManager.hasUpdate());

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = swManager.onUpdate(() => {
      setHasUpdate(true);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  return {
    isOnline,
    hasUpdate,
    update: () => swManager.update(),
    registration: swManager.getRegistration()
  };
}

// Import React for the hook
import React from 'react';
