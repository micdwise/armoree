-- Create Manufacturers Table
CREATE TABLE reference_manufacturers (
    manufacturer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Create Models Table
CREATE TABLE reference_models (
    model_id SERIAL PRIMARY KEY,
    manufacturer_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (manufacturer_id) REFERENCES reference_manufacturers(manufacturer_id) ON DELETE CASCADE,
    UNIQUE (manufacturer_id, name)
);

-- Create Calibers Table
CREATE TABLE reference_calibers (
    caliber_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Create Model Valid Calibers (Many-to-Many for Model -> Caliber)
CREATE TABLE model_valid_calibers (
    id SERIAL PRIMARY KEY,
    model_id INT NOT NULL,
    caliber_id INT NOT NULL,
    FOREIGN KEY (model_id) REFERENCES reference_models(model_id) ON DELETE CASCADE,
    FOREIGN KEY (caliber_id) REFERENCES reference_calibers(caliber_id) ON DELETE CASCADE,
    UNIQUE (model_id, caliber_id)
);

-- Insert Initial Manufacturers
INSERT INTO reference_manufacturers (name) VALUES 
('Smith & Wesson'),
('Colt'),
('Sig Sauer'),
('Remington');

-- Insert Initial Calibers
INSERT INTO reference_calibers (name) VALUES 
('9mm'),
('5.56'),
('.357');

-- Insert Initial Models
-- Sig Sauer Models
INSERT INTO reference_models (manufacturer_id, name) 
SELECT manufacturer_id, 'P320' FROM reference_manufacturers WHERE name = 'Sig Sauer';

INSERT INTO reference_models (manufacturer_id, name) 
SELECT manufacturer_id, 'P365' FROM reference_manufacturers WHERE name = 'Sig Sauer';

-- Remington Models
INSERT INTO reference_models (manufacturer_id, name) 
SELECT manufacturer_id, 'Super Blackhawk' FROM reference_manufacturers WHERE name = 'Remington';

-- Link Models to Calibers
-- Default mappings based on typical values (User can update later, this is initial seed)
-- P320 -> 9mm
INSERT INTO model_valid_calibers (model_id, caliber_id)
SELECT m.model_id, c.caliber_id
FROM reference_models m, reference_calibers c
WHERE m.name = 'P320' AND m.manufacturer_id = (SELECT manufacturer_id FROM reference_manufacturers WHERE name = 'Sig Sauer')
AND c.name = '9mm';

-- P365 -> 9mm
INSERT INTO model_valid_calibers (model_id, caliber_id)
SELECT m.model_id, c.caliber_id
FROM reference_models m, reference_calibers c
WHERE m.name = 'P365' AND m.manufacturer_id = (SELECT manufacturer_id FROM reference_manufacturers WHERE name = 'Sig Sauer')
AND c.name = '9mm';

-- Super Blackhawk -> .357
INSERT INTO model_valid_calibers (model_id, caliber_id)
SELECT m.model_id, c.caliber_id
FROM reference_models m, reference_calibers c
WHERE m.name = 'Super Blackhawk' AND m.manufacturer_id = (SELECT manufacturer_id FROM reference_manufacturers WHERE name = 'Remington')
AND c.name = '.357';
