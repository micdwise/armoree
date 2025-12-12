-- Create Projectile Types Reference Table
CREATE TABLE reference_projectile_types (
    projectile_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert Initial Projectile Types
INSERT INTO reference_projectile_types (name) VALUES 
('FMJ'),
('JHP'),
('HP'),
('Ball'),
('AP'),
('Tracer'),
('Frangible'),
('Match');
