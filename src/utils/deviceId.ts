import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import { SQLiteDatabase } from 'expo-sqlite';

const SECURE_STORE_KEY = 'wren_device_id';

export async function getOrCreateDeviceId(db: SQLiteDatabase): Promise<string> {
  const existing = await SecureStore.getItemAsync(SECURE_STORE_KEY);
  if (existing) {
    const row = db.getFirstSync<{ value: string }>(`SELECT value FROM meta WHERE key = ?`, [
      'device_id',
    ]);
    if (!row) {
      db.runSync(`INSERT OR REPLACE INTO meta (key, value) VALUES ('device_id', ?)`, [existing]);
    }
    return existing;
  }

  const newId = uuidv4();
  await SecureStore.setItemAsync(SECURE_STORE_KEY, newId);
  db.runSync(`INSERT OR REPLACE INTO meta (key, value) VALUES ('device_id', ?)`, [newId]);
  return newId;
}
