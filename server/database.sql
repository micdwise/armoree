CREATE ROLE armoree WITH ENCRYPTED PASSWORD 'password';

GRANT armoree TO session_user;

CREATE DATABASE armoree OWNER armoree;

\c armoree;

CREATE TABLE ammunition (
  id SERIAL PRIMARY KEY,
  manufacturer varchar(15),
  brand varchar(15),
  caliber varchar (5),
  purchase_date date,
  lot_number varchar(15),
  qty integer
);

ALTER TABLE ammunition OWNER TO armoree;

CREATE TABLE firearms (
  id SERIAL PRIMARY KEY,
  manufacturer varchar (15),
  model varchar (15),
  purchase_date date,
  caliber varchar (15),
  serial_number varchar (15)
);

ALTER TABLE firearms OWNER TO armoree;