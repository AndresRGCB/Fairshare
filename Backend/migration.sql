BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> dc962a98db9c

INSERT INTO alembic_version (version_num) VALUES ('dc962a98db9c') RETURNING alembic_version.version_num;

-- Running upgrade dc962a98db9c -> 9d0dc321c8ed

UPDATE alembic_version SET version_num='9d0dc321c8ed' WHERE alembic_version.version_num = 'dc962a98db9c';

-- Running upgrade 9d0dc321c8ed -> de7b36673d80

UPDATE alembic_version SET version_num='de7b36673d80' WHERE alembic_version.version_num = '9d0dc321c8ed';

-- Running upgrade de7b36673d80 -> 688858a79e0a

UPDATE alembic_version SET version_num='688858a79e0a' WHERE alembic_version.version_num = 'de7b36673d80';

-- Running upgrade 688858a79e0a -> dd8a09faeb17

CREATE TABLE users (
    id SERIAL NOT NULL, 
    name VARCHAR NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_users_id ON users (id);

UPDATE alembic_version SET version_num='dd8a09faeb17' WHERE alembic_version.version_num = '688858a79e0a';

COMMIT;

