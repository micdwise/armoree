-- DANGER: This script wipes existing data to ensure a clean state for testing.
-- We use TRUNCATE ... RESTART IDENTITY CASCADE to clear tables and reset ID sequences to 1.

TRUNCATE TABLE
    asset_custody,
    security_asset,
    usage_log,
    parts_used,
    maintenance_log,
    service_schedule,
    current_assignment,
    personnel_training,
    firearm,
    personnel,
    unit,
    ammunition_inventory,
    training_course,
    location
RESTART IDENTITY CASCADE;

-- 1. Units (Explicit IDs to guarantee FK matches)
INSERT INTO unit (unit_id, unit_name) VALUES
(1, 'Patrol Division'),
(2, 'SWAT'),
(3, 'Training Division'),
(4, 'Investigations');

-- 2. Locations (Explicit IDs)
INSERT INTO location (location_id, location_name, security_level) VALUES
(1, 'Main Armory Vault', 5),
(2, 'Range Storage', 3),
(3, 'Patrol Ready Room', 4),
(4, 'Evidence Locker', 5);

-- 3. Personnel (Explicit IDs, referencing explicit Unit IDs)
INSERT INTO personnel (personnel_id, first_name, last_name, badge_number, unit_id, is_active, date_joined) VALUES
(1, 'John', 'Smith', '101', 1, TRUE, '2015-06-01'),
(2, 'Jane', 'Doe', '102', 2, TRUE, '2016-03-15'),
(3, 'Mike', 'Johnson', '103', 1, TRUE, '2018-01-20'),
(4, 'Sarah', 'Connor', '104', 2, TRUE, '2019-11-12'),
(5, 'Robert', 'Paulson', '105', 3, TRUE, '2010-05-05'),
(6, 'Alice', 'Wonder', '106', 4, TRUE, '2020-08-01');

-- Update Unit Commanders (Now that personnel exist)
UPDATE unit SET commander_id = 1 WHERE unit_id = 1;
UPDATE unit SET commander_id = 2 WHERE unit_id = 2;
UPDATE unit SET commander_id = 5 WHERE unit_id = 3;
UPDATE unit SET commander_id = 6 WHERE unit_id = 4;

-- 4. Training Courses (Explicit IDs)
INSERT INTO training_course (course_id, course_name, required_recurrence, expiration_period_days) VALUES
(1, 'Handgun Qualification', 'annual', 365),
(2, 'Rifle Qualification', 'annual', 365),
(3, 'Less Lethal Certification', 'biennial', 730);

-- 5. Personnel Training
INSERT INTO personnel_training (personnel_id, course_id, date_completed, date_expires, score_achieved, instructor_id) VALUES
(1, 1, CURRENT_DATE - 340, CURRENT_DATE + 25, 95.5, 5), -- Expires in 25 days (ALERT)
(3, 1, CURRENT_DATE - 350, CURRENT_DATE + 15, 88.0, 5), -- Expires in 15 days (ALERT)
(2, 1, CURRENT_DATE - 100, CURRENT_DATE + 265, 98.0, 5),
(2, 2, CURRENT_DATE - 100, CURRENT_DATE + 265, 99.0, 5),
(4, 2, CURRENT_DATE - 60, CURRENT_DATE + 305, 96.0, 5);

-- 6. Firearms (Explicit IDs)
INSERT INTO firearm (firearm_id, manufacturer, model, type, caliber_gauge, serial_number, asset_tag, acquisition_date, current_status, current_location_id) VALUES
(1, 'Glock', 'G17', 'Handgun', '9mm', 'GL-12345', 'AT-001', '2020-01-01', 'In Service', 3),
(2, 'Glock', 'G17', 'Handgun', '9mm', 'GL-12346', 'AT-002', '2020-01-01', 'In Service', 3),
(3, 'Glock', 'G17', 'Handgun', '9mm', 'GL-12347', 'AT-003', '2020-01-01', 'In Repair', 1),
(4, 'Colt', 'M4', 'Rifle', '5.56', 'CT-55501', 'AT-004', '2021-06-15', 'In Service', 1),
(5, 'Colt', 'M4', 'Rifle', '5.56', 'CT-55502', 'AT-005', '2021-06-15', 'Training Pool', 1),
(6, 'Remington', '870', 'Shotgun', '12 Gauge', 'RM-88801', 'AT-006', '2018-03-10', 'In Service', 2),
(7, 'Sig Sauer', 'P320', 'Handgun', '9mm', 'SIG-99901', 'AT-007', '2022-01-20', 'In Service', 3),
(8, 'Sig Sauer', 'P320', 'Handgun', '9mm', 'SIG-99902', 'AT-008', '2022-01-20', 'Retired', 1);

-- 7. Current Assignments
INSERT INTO current_assignment (firearm_id, personnel_id, assignment_date, condition_on_issue) VALUES
(1, 1, '2023-01-01', 'New'),
(2, 3, '2023-01-15', 'Good'),
(7, 2, '2023-02-01', 'New'),
(4, 4, '2023-03-01', 'Good');

-- 8. Service Schedule
INSERT INTO service_schedule (firearm_id, service_interval_rounds, service_interval_months, last_service_date, next_due_date) VALUES
(1, 5000, 12, '2023-01-01', CURRENT_DATE - 10), -- Overdue (ALERT)
(3, 5000, 12, '2023-05-01', CURRENT_DATE - 5),  -- Overdue (ALERT)
(2, 5000, 12, CURRENT_DATE - 30, CURRENT_DATE + 335),
(4, 3000, 6, CURRENT_DATE - 60, CURRENT_DATE + 120);

-- 9. Ammunition Inventory (Explicit IDs for Usage Log FK)
INSERT INTO ammunition_inventory (ammo_id, caliber_gauge, projectile_type, lot_number, manufacturer, quantity_on_hand, min_stock_level, storage_location_id) VALUES
(1, '9mm', 'FMJ', 'LOT-9-001', 'Federal', 15000, 5000, 1),
(2, '9mm', 'JHP', 'LOT-9-002', 'Speer', 800, 1000, 1), -- Low Stock (ALERT)
(3, '5.56', 'FMJ', 'LOT-556-001', 'Winchester', 2000, 3000, 2), -- Low Stock (ALERT)
(4, '12 Gauge', 'Slug', 'LOT-12-001', 'Remington', 200, 100, 2);

-- 10. Usage Logs
INSERT INTO usage_log (firearm_id, date_used, rounds_fired, personnel_id, ammo_id) VALUES
(4, CURRENT_DATE - 5, 200, 4, 3),
(4, CURRENT_DATE - 10, 300, 4, 3),
(4, CURRENT_DATE - 15, 500, 4, 3), -- High usage for ID 4
(5, CURRENT_DATE - 2, 100, 2, 3),
(1, CURRENT_DATE - 20, 50, 1, 1),
(1, CURRENT_DATE - 25, 50, 1, 1),
(2, CURRENT_DATE - 10, 150, 3, 1);

-- 11. Security Assets
INSERT INTO security_asset (asset_name, asset_type, location_access, status, date_issued, last_audit_date) VALUES
('Main Vault Key A', 'Physical Key', 1, 'issued', '2020-01-01', CURRENT_DATE - 10),
('Range Key Card', 'Key Card', 2, 'Lost', '2023-05-01', CURRENT_DATE - 20), -- Issue (ALERT)
('Armory Master Key', 'Physical Key', 1, 'Missing', '2023-06-01', CURRENT_DATE - 5), -- Issue (ALERT)
('Evidence Locker Key', 'Physical Key', 4, 'issued', '2021-01-01', CURRENT_DATE - 10);

-- Insert test data into maintenance_log
-- Assumes firearms with IDs 1, 3, 4 exist and personnel with ID 5 (Armorer) exists.
INSERT INTO maintenance_log (firearm_id, date_performed, type, armorer_id, problem_reported, work_performed) VALUES
(1, CURRENT_DATE - 30, 'routine_cleaning', 5, 'Scheduled quarterly maintenance', 'Field stripped, cleaned, lubricated, and function checked. No issues found.'),
(3, CURRENT_DATE - 60, 'repair', 5, 'Failure to eject reported by officer', 'Inspected extractor and ejector. Replaced worn extractor spring. Test fired 50 rounds without malfunction.'),
(4, CURRENT_DATE - 90, 'inspection', 5, 'Annual safety inspection', 'Detailed inspection of all components. Verified headspace and bore condition. Passed.'),
(1, CURRENT_DATE - 120, 'routine_cleaning', 5, 'Post-range cleaning', 'Standard cleaning after qualification.'),
(3, CURRENT_DATE - 5, 'repair', 5, 'Slide not locking back on empty', 'Replaced magazine catch spring. Pending test fire.');
