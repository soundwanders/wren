import { openDatabaseSync, __mockDb } from 'expo-sqlite';
import { runMigrations, getSchemaVersion } from '../migrations';

jest.mock('expo-sqlite');

describe('runMigrations', () => {
  let db: ReturnType<typeof openDatabaseSync>;

  beforeEach(() => {
    db = openDatabaseSync('test.db');
  });

  it('runs migration 1 and sets schema_version to 1', () => {
    runMigrations(db);
    expect(getSchemaVersion(db)).toBe(1);
  });

  it('creates all required tables', () => {
    runMigrations(db);
    const tableNames = __mockDb.getTableNames();
    expect(tableNames).toContain('meta');
    expect(tableNames).toContain('photos');
    expect(tableNames).toContain('tags');
    expect(tableNames).toContain('photo_tags');
    expect(tableNames).toContain('albums');
    expect(tableNames).toContain('album_photos');
  });

  it('is idempotent — running twice does not change schema_version', () => {
    runMigrations(db);
    runMigrations(db);
    expect(getSchemaVersion(db)).toBe(1);
  });

  it('sets schema_version = 1 in meta table', () => {
    runMigrations(db);
    expect(__mockDb.getMetaValue('schema_version')).toBe('1');
  });
});
