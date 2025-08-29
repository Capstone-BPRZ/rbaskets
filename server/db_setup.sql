CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS baskets (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  basket_path char(7)
);

CREATE TABLE IF NOT EXISTS requests (
  id serial PRIMARY KEY,
  basket_id integer NOT NULL REFERENCES baskets(id) ON DELETE CASCADE,
  received timestamp,
  method varchar(7),
  headers text,
  body_id text
);

INSERT INTO users (id) VALUES (1);

INSERT INTO baskets (user_id, basket_path) VALUES
(1, 'abcdefg'), (2, '1234567');

INSERT INTO requests (basket_id, received, method, headers, body_id) VALUES
(1, now(), 'GET', 'some headers 1', 'body id 1'),
(1, now(), 'POST', 'some headers 2', 'body id 2'),
(1, now(), 'PUT', 'some headers 3', 'body id 3'),
(2, now(), 'PATCH', 'some headers 4', 'body id 4'),
(2, now(), 'DELETE', 'some headers 5', 'body id 5');
