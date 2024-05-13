## PSQL Learnings

To run the schema script on db
`psql -v ON_ERROR_STOP=1 -1 -h localhost -p 5432 -f ~/personal/lc-scraper/schema.sql "leetcode"`

----

https://www.postgresql.org/docs/current/sql-insert.html
- supporting clauses of insert statement
  - `returning`
  - `on conflict`
    - `on conflict do update`

----

Describing a table
\d+ tablename

-----

Don't use double quotes in postgres

- this is wrong
```sql
SELECT most_recent_slug_id FROM fetch_cursor
WHERE usecase = "some_usecase"
```

-----

node library - postgres.js (`postgres` on npm)

- this doesn't work
```js
const result = await sql`
SELECT most_recent_slug_id FROM fetch_cursor
WHERE usecase = '${this.cursor_usecase_id}'
`;
```
- but this does
  - when i use single quotes node is unable to figure out the type of the variable and throws this error `PostgresError: could not determine data type of parameter $1`
```js
const result = await sql`
SELECT most_recent_slug_id FROM fetch_cursor
WHERE usecase = ${this.cursor_usecase_id}
`;
```

-----

alter column - change type and drop the not null constraint

- to drop the constraint
```sql
ALTER TABLE mytable
  ALTER COLUMN col TYPE character varying(15),
  ALTER COLUMN col DROP NOT NULL
```

- to set the constraint
```sql
ALTER TABLE mytable
  ALTER COLUMN col TYPE character varying(15),
  ALTER COLUMN col SET NOT NULL
```

----

deleting rows

- `truncate` is a faster way to remove all rows from the database
- `using` clause exists in delete

---

permissions

- permissions are also granular at the clause level
- `DELETE` query needs a `delete` permission but if you plan to use the `USING` clause in delete, we need to have the `SELECT` statement.

---

postgresql dump - https://www.postgresql.org/docs/current/backup-dump.html

- `pg_dump "leetcode" > dump.sql`
  - again the concept of permissions
    - it must have read access to all tables that you want to back up, so in order to back up the entire database you almost always have to run it as a database superuser. (If you do not have sufficient privileges to back up the entire database, you can still back up portions of the database to which you do have access using options such as -n schema or -t table.)
