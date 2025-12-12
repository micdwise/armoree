-- 1. Create the personnel Table
CREATE TABLE personnel (
    personnel_id SERIAL8 PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    badge_number VARCHAR(50) UNIQUE NOT NULL,
    unit_id INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined DATE
);

-- 2. Create the firearm Table
CREATE TABLE firearm (
    firearm_id SERIAL8 PRIMARY KEY,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    caliber_gauge VARCHAR(50),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    asset_tag VARCHAR(50) UNIQUE,
    acquisition_date DATE NOT NULL,
    current_status VARCHAR(50) NOT NULL,
    current_location_id INT
);

-- 3. Create the current_assignment Table (Linking personnel and firearm)
CREATE TABLE current_assignment (
    assignment_id SERIAL8 PRIMARY KEY,

    -- Foreign Key to firearm
    firearm_id INT NOT NULL,
    FOREIGN KEY (firearm_id) REFERENCES firearm(firearm_id),
    UNIQUE (firearm_id),

    -- Foreign Key to personnel
    personnel_id INT NOT NULL,
    FOREIGN KEY (personnel_id) REFERENCES personnel(personnel_id),

    assignment_date DATE NOT NULL,
    expected_return_date DATE,
    condition_on_issue VARCHAR(50)
);

-- Defines organizational groups (e.g., SWAT, Patrol, Training Division)
CREATE TABLE unit (
    unit_id SERIAL8 PRIMARY KEY,
    unit_name VARCHAR(100) UNIQUE NOT NULL,
    commander_id INT -- FK to personnel(personnel_id)
);

-- Defines physical locations where assets are stored (Vault 1, Display Case A, Ammo Bunker)
CREATE TABLE location (
    location_id SERIAL8 PRIMARY KEY,
    location_name VARCHAR(100) UNIQUE NOT NULL,
    security_level INT NOT NULL
);

-- Add the FK to personnel for the previously created tables
ALTER TABLE personnel ADD CONSTRAINT fk_personnel_unit
FOREIGN KEY (unit_id) REFERENCES unit(unit_id);

ALTER TABLE firearm ADD CONSTRAINT fk_firearm_location
FOREIGN KEY (current_location_id) REFERENCES location(location_id);

-- Defines the types of training required
CREATE TABLE training_course (
    course_id SERIAL8 PRIMARY KEY,
    course_name VARCHAR(100) UNIQUE NOT NULL,
    required_recurrence VARCHAR(50), -- e.g., 'annual', 'biennial'
    expiration_period_days INT NOT NULL -- Used to calculate date_expires
);

-- Records specific completion dates for each person/course
CREATE TABLE personnel_training (
    training_record_id SERIAL8 PRIMARY KEY,
    personnel_id INT NOT NULL,
    FOREIGN KEY (personnel_id) REFERENCES personnel(personnel_id),

    course_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES training_course(course_id),

    date_completed DATE NOT NULL,
    date_expires DATE NOT NULL, -- Calculated field (date_completed + expiration_period_days)
    score_achieved DECIMAL(5, 2),
    instructor_id INT -- FK to personnel(personnel_id)
);

-- Defines the proactive service schedule based on time/usage
CREATE TABLE service_schedule (
    schedule_id SERIAL8 PRIMARY KEY,
    firearm_id INT NOT NULL UNIQUE,
    FOREIGN KEY (firearm_id) REFERENCES firearm(firearm_id),

    service_interval_rounds INT, -- e.g., service every 5000 rounds
    service_interval_months INT, -- e.g., service every 12 months
    last_service_date DATE,
    next_due_date DATE -- Calculated field for reporting
);

-- Records the history of all maintenance events
CREATE TABLE maintenance_log (
    log_id SERIAL8 PRIMARY KEY,
    firearm_id INT NOT NULL,
    FOREIGN KEY (firearm_id) REFERENCES firearm(firearm_id),

    date_performed DATE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'routine_cleaning', 'repair', 'inspection'
    armorer_id INT NOT NULL,
    FOREIGN KEY (armorer_id) REFERENCES personnel(personnel_id),

    problem_reported TEXT,
    work_performed TEXT
);

-- Records spare parts consumed during maintenance
CREATE TABLE parts_used (
    part_used_id SERIAL8 PRIMARY KEY,
    log_id INT NOT NULL,
    FOREIGN KEY (log_id) REFERENCES maintenance_log(log_id),

    part_name VARCHAR(100) NOT NULL,
    part_number VARCHAR(50),
    quantity_used INT NOT NULL
);

-- Records round expenditure and operational use
CREATE TABLE usage_log (
    usage_id SERIAL8 PRIMARY KEY,
    firearm_id INT NOT NULL,
    FOREIGN KEY (firearm_id) REFERENCES firearm(firearm_id),

    date_used DATE NOT NULL,
    rounds_fired INT NOT NULL,
    personnel_id INT NOT NULL,
    FOREIGN KEY (personnel_id) REFERENCES personnel(personnel_id),
    ammo_id INT -- FK to ammunition_inventory(ammo_id)
);

-- Tracking consumable ammunition
CREATE TABLE ammunition_inventory (
    ammo_id SERIAL8 PRIMARY KEY,
    caliber_gauge VARCHAR(50) NOT NULL,
    projectile_type VARCHAR(50) NOT NULL,
    lot_number VARCHAR(100) NOT NULL, -- CRITICAL for recalls
    manufacturer VARCHAR(100),
    quantity_on_hand INT NOT NULL,
    min_stock_level INT,
    storage_location_id INT NOT NULL,
    FOREIGN KEY (storage_location_id) REFERENCES location(location_id)
);

-- Tracking general parts, tools, and non-ammo supplies
CREATE TABLE general_supply_inventory (
    supply_id SERIAL8 PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    part_number VARCHAR(50),
    quantity_on_hand INT NOT NULL,
    min_stock_level INT,
    storage_location_id INT NOT NULL,
    FOREIGN KEY (storage_location_id) REFERENCES location(location_id)
);

-- Complete the relationship for usage_log
ALTER TABLE usage_log ADD CONSTRAINT fk_usage_ammo
FOREIGN KEY (ammo_id) REFERENCES ammunition_inventory(ammo_id);

CREATE TABLE disposal_log (
    disposal_id SERIAL8 PRIMARY KEY,
    firearm_id INT NOT NULL UNIQUE, -- Unique because a firearm is disposed of only once
    FOREIGN KEY (firearm_id) REFERENCES firearm(firearm_id),

    date_disposed DATE NOT NULL,
    disposal_method VARCHAR(50) NOT NULL, -- 'destruction', 'transfer_to_agency', 'stolen'
    recipient_entity VARCHAR(100),
    authorization_document_ref VARCHAR(100),
    armorer_id INT NOT NULL,
    FOREIGN KEY (armorer_id) REFERENCES personnel(personnel_id)
);

ALTER TABLE unit ADD CONSTRAINT fk_unit_commander
FOREIGN KEY (commander_id) REFERENCES personnel(personnel_id);

-- Assuming personnel and location tables already exist

-- 1. Create the security_asset Table
CREATE TABLE security_asset (
    asset_id SERIAL8 PRIMARY KEY,
    asset_name VARCHAR(100) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    location_access INT NOT NULL,
    FOREIGN KEY (location_access) REFERENCES location(location_id),
    status VARCHAR(50) NOT NULL,
    date_issued DATE NOT NULL,
    last_audit_date DATE
);

-- 2. Create the asset_custody Table
CREATE TABLE asset_custody (
    custody_id SERIAL8 PRIMARY KEY,
    asset_id INT NOT NULL,
    FOREIGN KEY (asset_id) REFERENCES security_asset(asset_id),
    personnel_id serial8 NOT NULL,
    FOREIGN KEY (personnel_id) REFERENCES personnel(personnel_id),
    date_issued_to_person DATE NOT NULL,
    date_returned_from_person DATE,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (asset_id, is_current)
);

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

CREATE TABLE reference_projectile_types (
    projectile_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
