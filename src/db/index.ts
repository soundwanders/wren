import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('wren.db');

expo.execSync('PRAGMA journal_mode = WAL;');
expo.execSync('PRAGMA foreign_keys = ON;');

export const db = drizzle(expo, { schema });
export { expo as rawDb };
