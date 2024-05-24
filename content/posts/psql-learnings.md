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
- TRUNCATE cannot be used on a table that has foreign-key references from other tables, unless all such tables are also truncated in the same command. Checking validity in such cases would require table scans, and the whole point is not to do one. The CASCADE option can be used to automatically include all dependent tables — but be very careful when using this option, or else you might lose data you did not intend to! Note in particular that when the table to be truncated is a partition, siblings partitions are left untouched, but cascading occurs to all referencing tables and all their partitions with no distinction.

---

permissions

- permissions are also granular at the clause level
- `DELETE` query needs a `delete` permission but if you plan to use the `USING` clause in delete, we need to have the `SELECT` statement.

---

postgresql dump - https://www.postgresql.org/docs/current/backup-dump.html

- `pg_dump "leetcode" > dump.sql`
  - again the concept of permissions
    - it must have read access to all tables that you want to back up, so in order to back up the entire database you almost always have to run it as a database superuser. (If you do not have sufficient privileges to back up the entire database, you can still back up portions of the database to which you do have access using options such as -n schema or -t table.)

---

About peer authentication, psql auth, linux users

Linux users
- check in `/etc/passwd`
- when postgres is installed it adds a new user to the linux system with username `postgres`
- result of `cat /etc/passwd | grep postgres`
```
postgres:x:115:123:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash
```


https://www.postgresql.org/docs/current/auth-peer.html
- Peer Auth: obtaining the client's operating system user name from the kernel and using it as the allowed database user name


Usecase - 1

- trying to log into psql as `postgres` db user, but won't allow, since my username is `ubuntu`
```
ubuntu@ip-172-31-23-75:~$ psql -U postgres
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "postgres"
```

- works when i try doing with linux user `postgres` and db user `postgres`
  - a default mapping exists between the user `postgres`
```
ubuntu@ip-172-31-23-75:~$ sudo -u postgres psql -U postgres
could not change directory to "/home/ubuntu": Permission denied
psql (14.11 (Ubuntu 14.11-0ubuntu0.22.04.1))
Type "help" for help.

postgres=#
```

Usecase - 2

- Created a db user and a db password for a db and granted privileges

```sh
postgres=# CREATE USER kmanchukonda WITH PASSWORD 'kmanchukonda_db_pwd';
CREATE ROLE

postgres=# CREATE DATABASE leetcode;
CREATE DATABASE

postgres=# GRANT ALL PRIVILEGES ON DATABASE leetcode TO kmanchukonda;
GRANT
```

- Trying to login throws error
```
ubuntu@ip-172-31-23-75:~$ psql -U kmanchukonda
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "kmanchukonda"
```

- Instead of creating a linux user `kmanchukonda`, I can create a mapping in `pg_ident.conf` file
  - https://stackoverflow.com/a/69678738
- above didn't work `usecase 2` useless

Went ahead with https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04
- will have to figure out, the non root user, permissions etc.

---

ALTER TABLE table_name RENAME COLUMN old_name TO new_name