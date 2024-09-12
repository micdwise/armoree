CREATE USER armoree WITH ENCRYPTED PASSWORD 'password';

CREATE DATABASE armoree OWNER armoree;

\c armoree;

CREATE TABLE ammunition (
  id SERIAL PRIMARY KEY,
  manufacturer varchar(15),
  brand varchar(15),
  caliber varchar (5),
  purchase_date int,
  lot_number varchar(15),
  qty integer
);

ALTER TABLE ammunition OWNER TO armoree;

INSERT INTO ammunition (
  manufacturer,
  brand,
  caliber,
  lot_number,
  qty
) VALUES (
  'American Eagle',
  'Super',
  '9mm',
  '12345',
  35
);

INSERT INTO ammunition (
  manufacturer,
  brand,
  caliber,
  lot_number,
  qty
) VALUES (
  'Hornady',
  'Critical Defens',
  '9mm',
  '8675309',
  100
);
