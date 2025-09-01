/**
 * Service Worker for background sync and offline support
 */

const CACHE_NAME = 'todo-app-v1';
const SYNC_TAG = 'todo-background-sync';

// Assets to cache for offline functionality
const ASSETS_TO_CACHE = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching essential assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then(response => {
            // Cache successful GET requests
            if (request.method === 'GET' && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/') || createOfflineResponse();
            }
            
            throw error;
          });
      })
  );
});

// Handle API requests with offline support
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && response.ok) {
      const responseClone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    console.log('API request failed, checking cache:', request.url);
    
    // Try to serve from cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log('Serving API response from cache');
        return cachedResponse;
      }
    }
    
    // For non-GET requests when offline, register for background sync
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      await registerBackgroundSync(request);
      return createSyncResponse();
    }
    
    throw error;
  }
}

// Background sync event
self.addEventListener('sync', event => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === SYNC_TAG) {
    event.waitUntil(performBackgroundSync());
  }
});

// Register background sync
async function registerBackgroundSync(request) {
  try {
    // Store the failed request for later retry
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(),
      timestamp: Date.now()
    };
    
    await storeFailedRequest(requestData);
    
    // Register for background sync
    await self.registration.sync.register(SYNC_TAG);
    
    console.log('Registered background sync for failed request');
  } catch (error) {
    console.error('Failed to register background sync:', error);
  }
}

// Perform background sync
async function performBackgroundSync() {
  console.log('Performing background sync...');
  
  try {
    const failedRequests = await getFailedRequests();
    
    for (const requestData of failedRequests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        if (response.ok) {
          await removeFailedRequest(requestData);
          console.log('Successfully synced request:', requestData.url);
        } else {
          console.error('Sync request failed:', response.status, requestData.url);
        }
      } catch (error) {
        console.error('Error syncing request:', error, requestData.url);
        // Keep the request for next sync attempt
      }
    }
    
    // Notify the main app about sync completion
    await notifyMainApp('sync-completed');
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Storage functions for failed requests
async function storeFailedRequest(requestData) {
  const db = await openDB();
  const transaction = db.transaction(['failed_requests'], 'readwrite');
  const store = transaction.objectStore('failed_requests');
  await store.add(requestData);
}

async function getFailedRequests() {
  const db = await openDB();
  const transaction = db.transaction(['failed_requests'], 'readonly');
  const store = transaction.objectStore('failed_requests');
  return await store.getAll();
}

async function removeFailedRequest(requestData) {
  const db = await openDB();
  const transaction = db.transaction(['failed_requests'], 'readwrite');
  const store = transaction.objectStore('failed_requests');
  
  // Find and delete the matching request
  const requests = await store.getAll();
  const index = requests.findIndex(req => 
    req.url === requestData.url && 
    req.timestamp === requestData.timestamp
  );
  
  if (index !== -1) {
    await store.delete(index);
  }
}

// IndexedDB helper
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('todo-sw-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('failed_requests')) {
        db.createObjectStore('failed_requests', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Notify main application
async function notifyMainApp(type, data = {}) {
  const clients = await self.clients.matchAll();
  
  clients.forEach(client => {
    client.postMessage({
      type,
      data,
      timestamp: Date.now()
    });
  });
}

// Create offline response
function createOfflineResponse() {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Todo App - Offline</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          padding: 2rem;
          color: #374151;
        }
        .offline-message {
          max-width: 400px;
          margin: 0 auto;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="offline-message">
        <div class="icon">📱</div>
        <h1>You're Offline</h1>
        <p>Your changes have been saved locally and will sync when you're back online.</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
    `,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    }
  );
}

// Create response for sync requests
function createSyncResponse() {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Request queued for background sync',
      synced: false
    }),
    {
      status: 202, // Accepted
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'Your todos have been synchronized',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'todo-sync',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View Todos'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Todo App', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker script loaded');