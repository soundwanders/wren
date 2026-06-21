import { SQLiteDatabase } from 'expo-sqlite';

type Migration = {
  version: number;
  up: (db: SQLiteDatabase) => void;
};

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: (db) => {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS meta (
          key   TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS photos (
          id            TEXT PRIMARY KEY,
          asset_id      TEXT UNIQUE NOT NULL,
          uri           TEXT NOT NULL,
          thumbnail_uri TEXT NOT NULL,
          taken_at      INTEGER NOT NULL,
          imported_at   INTEGER NOT NULL,
          width         INTEGER NOT NULL,
          height        INTEGER NOT NULL,
          blurhash      TEXT
        );

        CREATE TABLE IF NOT EXISTS tags (
          id         TEXT PRIMARY KEY,
          label      TEXT NOT NULL,
          group_key  TEXT NOT NULL CHECK(group_key IN ('milestone','people','place')),
          is_custom  INTEGER NOT NULL DEFAULT 0,
          color      TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS photo_tags (
          photo_id  TEXT NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
          tag_id    TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
          tagged_at INTEGER NOT NULL,
          PRIMARY KEY (photo_id, tag_id)
        );

        CREATE TABLE IF NOT EXISTS albums (
          id             TEXT PRIMARY KEY,
          title          TEXT NOT NULL,
          cover_photo_id TEXT REFERENCES photos(id) ON DELETE SET NULL,
          created_at     INTEGER NOT NULL,
          updated_at     INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS album_photos (
          album_id TEXT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
          photo_id TEXT NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
          position INTEGER NOT NULL,
          PRIMARY KEY (album_id, photo_id)
        );

        CREATE INDEX IF NOT EXISTS idx_photos_taken_at    ON photos(taken_at DESC);
        CREATE INDEX IF NOT EXISTS idx_photo_tags_photo   ON photo_tags(photo_id);
        CREATE INDEX IF NOT EXISTS idx_photo_tags_tag     ON photo_tags(tag_id);
        CREATE INDEX IF NOT EXISTS idx_album_photos_album ON album_photos(album_id, position);
        CREATE INDEX IF NOT EXISTS idx_tags_group         ON tags(group_key, sort_order);
      `);
    },
  },
];

export function runMigrations(db: SQLiteDatabase): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const row = db.getFirstSync<{ value: string }>(`SELECT value FROM meta WHERE key = ?`, [
    'schema_version',
  ]);
  const currentVersion = row ? parseInt(row.value, 10) : 0;

  const pending = MIGRATIONS.filter((m) => m.version > currentVersion);
  if (pending.length === 0) return;

  db.withTransactionSync(() => {
    for (const migration of pending) {
      migration.up(db);
      db.runSync(`INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)`, [
        'schema_version',
        String(migration.version),
      ]);
    }
  });
}

export function getSchemaVersion(db: SQLiteDatabase): number {
  const row = db.getFirstSync<{ value: string }>(`SELECT value FROM meta WHERE key = ?`, [
    'schema_version',
  ]);
  return row ? parseInt(row.value, 10) : 0;
}
