import { openDatabaseSync, __mockDb } from 'expo-sqlite';
import { getItemAsync, __resetStore } from 'expo-secure-store';
import { runMigrations } from '../../db/migrations';
import { getOrCreateDeviceId } from '../deviceId';

jest.mock('expo-sqlite');
jest.mock('expo-secure-store');
jest.mock('react-native-get-random-values');

describe('getOrCreateDeviceId', () => {
  let db: ReturnType<typeof openDatabaseSync>;

  beforeEach(() => {
    __resetStore();
    db = openDatabaseSync('test.db');
    runMigrations(db);
  });

  it('generates a uuid v4 on first call', async () => {
    const id = await getOrCreateDeviceId(db);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('persists the id to secure store', async () => {
    const id = await getOrCreateDeviceId(db);
    const stored = await getItemAsync('wren_device_id');
    expect(stored).toBe(id);
  });

  it('writes device_id to meta table', async () => {
    const id = await getOrCreateDeviceId(db);
    expect(__mockDb.getMetaValue('device_id')).toBe(id);
  });

  it('returns the same id across simulated restarts', async () => {
    const first = await getOrCreateDeviceId(db);
    const second = await getOrCreateDeviceId(db);
    expect(second).toBe(first);
  });
});
