create table users(
    user_id serial PRIMARY KEY,
    user_name varchar(50) not null,
    user_password varchar(100) not null,
    user_role varchar(25) DEFAULT 'USER',
    email varchar(50),
    status varchar(15) DEFAULT 'INIT',
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp
);

create table auth(
    user_id integer REFERENCES users(user_id) ON DELETE CASCADE,
    verification_code varchar(50),
    auth_token varchar(500),
    token_expiry_time timestamp
);

create table metadata(
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(user_id) ON DELETE CASCADE,
    status varchar(15) DEFAULT 'INIT',
    create_time timestamp DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp
);

create table user_expense_data(
    metadata_id integer REFERENCES metadata(id) ON DELETE CASCADE,
    id integer,
    title varchar(50),
    amount real,
    category varchar(15),
    description varchar(100),
    entry_date bigint,
    PRIMARY KEY (metadata_id, id)
);