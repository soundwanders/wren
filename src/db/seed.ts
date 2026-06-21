import { SQLiteDatabase } from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

type SeedTag = { label: string; sort: number };

const MILESTONE_TAGS: SeedTag[] = [
  { label: 'Coming home', sort: 1 },
  { label: 'First smile', sort: 2 },
  { label: 'First laugh', sort: 3 },
  { label: 'First bath', sort: 4 },
  { label: 'Meeting the family', sort: 5 },
  { label: 'First outing', sort: 6 },
  { label: 'First food', sort: 10 },
  { label: 'First tooth', sort: 11 },
  { label: 'Started crawling', sort: 12 },
  { label: 'Pulled to standing', sort: 13 },
  { label: 'First steps', sort: 14 },
  { label: 'First words', sort: 15 },
  { label: 'First birthday', sort: 16 },
  { label: 'Sleeping through night', sort: 17 },
  { label: 'First haircut', sort: 20 },
  { label: 'Potty trained', sort: 21 },
  { label: 'First best friend', sort: 22 },
  { label: 'First day of daycare', sort: 23 },
  { label: 'Started talking lots', sort: 24 },
  { label: 'First imaginative play', sort: 25 },
  { label: 'First day of school', sort: 30 },
  { label: 'Lost first tooth', sort: 31 },
  { label: 'Learned to ride a bike', sort: 32 },
  { label: 'First sleepover', sort: 33 },
  { label: 'First sport or class', sort: 34 },
  { label: 'First performance', sort: 35 },
  { label: 'Learned to read', sort: 36 },
  { label: 'First pet', sort: 37 },
  { label: 'First school trip', sort: 40 },
  { label: 'First trophy or award', sort: 41 },
  { label: 'First time cooking', sort: 42 },
  { label: 'First phone or device', sort: 43 },
  { label: 'Learned to swim', sort: 44 },
  { label: 'First competition', sort: 45 },
  { label: 'Started a new hobby', sort: 46 },
  { label: 'First day of high school', sort: 50 },
  { label: 'First job', sort: 51 },
  { label: 'Learning to drive', sort: 52 },
  { label: 'Graduation', sort: 53 },
  { label: 'Birthday', sort: 60 },
  { label: 'Holiday', sort: 61 },
  { label: 'Family trip', sort: 62 },
  { label: 'Sick day', sort: 63 },
  { label: 'Just because', sort: 64 },
  { label: 'Silly moment', sort: 65 },
  { label: 'Proud moment', sort: 66 },
];

const PEOPLE_TAGS: SeedTag[] = [
  { label: 'Mom', sort: 1 },
  { label: 'Dad', sort: 2 },
  { label: 'Grandma', sort: 3 },
  { label: 'Grandpa', sort: 4 },
  { label: 'Sibling', sort: 5 },
  { label: 'Cousins', sort: 6 },
  { label: 'Friends', sort: 7 },
  { label: 'Teacher', sort: 8 },
  { label: 'Caregiver', sort: 9 },
];

const PLACE_TAGS: SeedTag[] = [
  { label: 'Home', sort: 1 },
  { label: 'Park', sort: 2 },
  { label: "Grandma's house", sort: 3 },
  { label: 'Daycare', sort: 4 },
  { label: 'School', sort: 5 },
  { label: 'Beach', sort: 6 },
  { label: "Doctor's office", sort: 7 },
  { label: 'Restaurant', sort: 8 },
  { label: 'On vacation', sort: 9 },
  { label: 'Backyard', sort: 10 },
  { label: 'Sports field', sort: 11 },
];

export const EXPECTED_SEED_COUNT = MILESTONE_TAGS.length + PEOPLE_TAGS.length + PLACE_TAGS.length;

export function seedTags(db: SQLiteDatabase): void {
  const row = db.getFirstSync<{ value: string }>(`SELECT value FROM meta WHERE key = ?`, [
    'is_seeded',
  ]);
  if (row?.value === '1') return;

  db.withTransactionSync(() => {
    const insertTag = db.prepareSync(
      `INSERT OR IGNORE INTO tags (id, label, group_key, is_custom, color, sort_order)
       VALUES (?, ?, ?, 0, ?, ?)`
    );

    for (const tag of MILESTONE_TAGS) {
      insertTag.executeSync([uuidv4(), tag.label, 'milestone', '#D4A857', tag.sort]);
    }
    for (const tag of PEOPLE_TAGS) {
      insertTag.executeSync([uuidv4(), tag.label, 'people', '#8A9B7E', tag.sort]);
    }
    for (const tag of PLACE_TAGS) {
      insertTag.executeSync([uuidv4(), tag.label, 'place', '#7B92AD', tag.sort]);
    }

    insertTag.finalizeSync();

    db.runSync(`INSERT OR REPLACE INTO meta (key, value) VALUES ('is_seeded', '1')`);
  });
}
