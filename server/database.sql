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

CREATE TABLE firearms (
  id SERIAL PRIMARY KEY,
  manufacturer varchar(15),
  model varchar(15),
  caliber varchar (5),
  purchase_date int,
  serial_number varchar(15),
);

ALTER TABLE firearms OWNER TO armoree;
