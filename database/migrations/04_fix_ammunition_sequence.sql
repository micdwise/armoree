-- Fix ammunition_inventory ammo_id sequence drift and ensure default is set
DO $$
BEGIN
    -- Create the sequence if missing and attach it to ammo_id
    IF NOT EXISTS (
        SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = 'ammunition_inventory_ammo_id_seq'
    ) THEN
        CREATE SEQUENCE ammunition_inventory_ammo_id_seq;
        ALTER SEQUENCE ammunition_inventory_ammo_id_seq OWNED BY ammunition_inventory.ammo_id;
        ALTER TABLE ammunition_inventory ALTER COLUMN ammo_id SET DEFAULT nextval('ammunition_inventory_ammo_id_seq');
    END IF;

    -- Align the sequence with the current max id to avoid duplicate key errors
    PERFORM setval(
        'ammunition_inventory_ammo_id_seq',
        COALESCE((SELECT MAX(ammo_id) FROM ammunition_inventory), 0)
    );
END;
$$;
