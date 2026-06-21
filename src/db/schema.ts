import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const meta = sqliteTable('meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const photos = sqliteTable('photos', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').unique().notNull(),
  uri: text('uri').notNull(),
  thumbnailUri: text('thumbnail_uri').notNull(),
  takenAt: integer('taken_at').notNull(),
  importedAt: integer('imported_at').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  blurhash: text('blurhash'),
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  groupKey: text('group_key').notNull(),
  isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
  color: text('color').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const photoTags = sqliteTable(
  'photo_tags',
  {
    photoId: text('photo_id')
      .notNull()
      .references(() => photos.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    taggedAt: integer('tagged_at').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.photoId, t.tagId] }) })
);

export const albums = sqliteTable('albums', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  coverPhotoId: text('cover_photo_id').references(() => photos.id, { onDelete: 'set null' }),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const albumPhotos = sqliteTable(
  'album_photos',
  {
    albumId: text('album_id')
      .notNull()
      .references(() => albums.id, { onDelete: 'cascade' }),
    photoId: text('photo_id')
      .notNull()
      .references(() => photos.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.albumId, t.photoId] }) })
);

export type Meta = typeof meta.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type PhotoTag = typeof photoTags.$inferSelect;
export type Album = typeof albums.$inferSelect;
export type AlbumPhoto = typeof albumPhotos.$inferSelect;
