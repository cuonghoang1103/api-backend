SELECT current_database() AS db, current_user AS who, split_part(version(), ' ', 2) AS pg_version;
\dt
