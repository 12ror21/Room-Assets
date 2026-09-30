// src/utils/db.ts
import type { AppData } from '@/types';

const DB_NAME = 'RoomAssetsDB';
const DB_VERSION = 1;
const STORE_NAME = 'data';

let db: IDBDatabase | null = null;

export function initDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export function saveData(data: AppData): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('DB not initialized'));
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, 'appData');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export function loadData(): Promise<AppData | null> {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('DB not initialized'));
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('appData');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}