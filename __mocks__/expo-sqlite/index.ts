/* Pure-JS in-memory mock of expo-sqlite for unit tests. */

interface Row {
  [col: string]: unknown;
}

class InMemoryDb {
  private tables: Record<string, Row[]> = {};
  readonly meta: Record<string, string> = {};

  exec(sql: string) {
    const re = /CREATE TABLE (?:IF NOT EXISTS )?(\w+)/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(sql)) !== null) {
      if (!this.tables[m[1]]) this.tables[m[1]] = [];
    }
  }

  run(sql: string, params: unknown[] = []) {
    if (/INSERT OR REPLACE INTO meta/i.test(sql)) {
      let key: string;
      let value: string;
      if (params.length === 2) {
        [key, value] = params as [string, string];
      } else if (params.length === 1) {
        const keyMatch = sql.match(/'([^']+)'/);
        key = keyMatch ? keyMatch[1] : '';
        value = params[0] as string;
      } else {
        const matches = [...sql.matchAll(/'([^']+)'/g)].map((x) => x[1]);
        [key, value] = matches;
      }
      if (key) {
        this.meta[key] = value;
        if (!this.tables['meta']) this.tables['meta'] = [];
        const idx = this.tables['meta'].findIndex((r) => r['key'] === key);
        if (idx >= 0) {
          this.tables['meta'][idx] = { key, value };
        } else {
          this.tables['meta'].push({ key, value });
        }
      }
      return;
    }

    if (/INSERT OR IGNORE INTO tags/i.test(sql) && params.length >= 5) {
      if (!this.tables['tags']) this.tables['tags'] = [];
      this.tables['tags'].push({
        id: params[0],
        label: params[1],
        group_key: params[2],
        is_custom: 0,
        color: params[3],
        sort_order: params[4],
      });
    }
  }

  getFirst<T>(sql: string, params: unknown[] = []): T | null {
    if (/SELECT value FROM meta WHERE key/i.test(sql)) {
      const key = params.length > 0 ? (params[0] as string) : (sql.match(/'([^']+)'/) ?? [])[1];
      if (!key) return null;
      const val = this.meta[key];
      return val !== undefined ? ({ value: val } as unknown as T) : null;
    }
    return null;
  }

  getAll<T>(_sql: string): T[] {
    return [];
  }

  getTableNames(): string[] {
    return Object.keys(this.tables);
  }

  getTagCount(): number {
    return (this.tables['tags'] ?? []).length;
  }

  getMetaValue(key: string): string | undefined {
    return this.meta[key];
  }

  reset() {
    for (const k of Object.keys(this.tables)) delete this.tables[k];
    for (const k of Object.keys(this.meta)) delete (this.meta as Record<string, string>)[k];
  }
}

const _db = new InMemoryDb();

export function openDatabaseSync(_name: string) {
  _db.reset();
  return {
    execSync(sql: string) {
      _db.exec(sql);
    },
    runSync(sql: string, params: unknown[] = []) {
      _db.run(sql, params);
    },
    getFirstSync<T>(sql: string, params: unknown[] = []): T | null {
      return _db.getFirst<T>(sql, params);
    },
    getAllSync<T>(_sql: string): T[] {
      return [];
    },
    withTransactionSync(task: () => void) {
      task();
    },
    prepareSync(sql: string) {
      return {
        executeSync(params: unknown[] = []) {
          _db.run(sql, params);
        },
        finalizeSync() {},
      };
    },
    _db,
  };
}

export { _db as __mockDb };
