import { openDatabaseSync, __mockDb } from 'expo-sqlite';
import { runMigrations } from '../migrations';
import { seedTags, EXPECTED_SEED_COUNT } from '../seed';

jest.mock('expo-sqlite');
jest.mock('react-native-get-random-values');

describe('seedTags', () => {
  let db: ReturnType<typeof openDatabaseSync>;

  beforeEach(() => {
    db = openDatabaseSync('test.db');
    runMigrations(db);
  });

  it(`inserts exactly ${EXPECTED_SEED_COUNT} tags (matches spec §6)`, () => {
    seedTags(db);
    expect(__mockDb.getTagCount()).toBe(EXPECTED_SEED_COUNT);
  });

  it('sets is_seeded = 1 in meta table', () => {
    seedTags(db);
    expect(__mockDb.getMetaValue('is_seeded')).toBe('1');
  });

  it('does not re-seed when called a second time', () => {
    seedTags(db);
    seedTags(db);
    expect(__mockDb.getTagCount()).toBe(EXPECTED_SEED_COUNT);
  });

  it('seed count is 66: 46 milestones + 9 people + 11 places', () => {
    expect(EXPECTED_SEED_COUNT).toBe(66);
  });
});
