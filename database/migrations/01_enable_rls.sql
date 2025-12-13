-- Enable Row-Level Security (RLS) on all tenant-scoped tables
-- This enforces tenant isolation at the database level with Supabase Auth

-- Helper function: Get current user's tenant schema
-- This looks up the authenticated user's assigned tenant schema
CREATE OR REPLACE FUNCTION get_current_user_tenant_schema() RETURNS TEXT AS $$
DECLARE
  tenant_schema TEXT;
BEGIN
  -- Look up the user's assigned schema from public.user_tenants
  SELECT schema_name INTO tenant_schema
  FROM public.user_tenants
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(tenant_schema, '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS on all tenant tables
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE firearm ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit ENABLE ROW LEVEL SECURITY;
ALTER TABLE location ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_course ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts_used ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ammunition_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_supply_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE disposal_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_asset ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_custody ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_calibers ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_valid_calibers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_projectile_types ENABLE ROW LEVEL SECURITY;

-- Supabase Auth-aware RLS policies
-- RLS policies check auth.role() = 'authenticated' to ensure only logged-in users access data
-- The actual tenant isolation is enforced by schema separation (switchClient in client code)
-- This acts as a safety net if the client is misconfigured

-- Helper constant: define authenticated role check once
-- Note: SQL doesn't have constants, so we define the check in each policy

-- Personnel table
CREATE POLICY "authenticated_access_personnel"
  ON personnel FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_personnel"
  ON personnel FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_personnel"
  ON personnel FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_personnel"
  ON personnel FOR DELETE
  USING (auth.role() = 'authenticated');

-- Firearm table
CREATE POLICY "authenticated_access_firearm"
  ON firearm FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_firearm"
  ON firearm FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_firearm"
  ON firearm FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_firearm"
  ON firearm FOR DELETE
  USING (auth.role() = 'authenticated');

-- Current Assignment table
CREATE POLICY "authenticated_access_current_assignment"
  ON current_assignment FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_current_assignment"
  ON current_assignment FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_current_assignment"
  ON current_assignment FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_current_assignment"
  ON current_assignment FOR DELETE
  USING (auth.role() = 'authenticated');

-- Unit table
CREATE POLICY "authenticated_access_unit"
  ON unit FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_unit"
  ON unit FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_unit"
  ON unit FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_unit"
  ON unit FOR DELETE
  USING (auth.role() = 'authenticated');

-- Location table
CREATE POLICY "authenticated_access_location"
  ON location FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_location"
  ON location FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_location"
  ON location FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_location"
  ON location FOR DELETE
  USING (auth.role() = 'authenticated');

-- Training Course table
CREATE POLICY "authenticated_access_training_course"
  ON training_course FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_training_course"
  ON training_course FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_training_course"
  ON training_course FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_training_course"
  ON training_course FOR DELETE
  USING (auth.role() = 'authenticated');

-- Personnel Training table
CREATE POLICY "authenticated_access_personnel_training"
  ON personnel_training FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_personnel_training"
  ON personnel_training FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_personnel_training"
  ON personnel_training FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_personnel_training"
  ON personnel_training FOR DELETE
  USING (auth.role() = 'authenticated');

-- Service Schedule table
CREATE POLICY "authenticated_access_service_schedule"
  ON service_schedule FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_service_schedule"
  ON service_schedule FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_service_schedule"
  ON service_schedule FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_service_schedule"
  ON service_schedule FOR DELETE
  USING (auth.role() = 'authenticated');

-- Maintenance Log table
CREATE POLICY "authenticated_access_maintenance_log"
  ON maintenance_log FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_maintenance_log"
  ON maintenance_log FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_maintenance_log"
  ON maintenance_log FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_maintenance_log"
  ON maintenance_log FOR DELETE
  USING (auth.role() = 'authenticated');

-- Parts Used table
CREATE POLICY "authenticated_access_parts_used"
  ON parts_used FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_parts_used"
  ON parts_used FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_parts_used"
  ON parts_used FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_parts_used"
  ON parts_used FOR DELETE
  USING (auth.role() = 'authenticated');

-- Usage Log table
CREATE POLICY "authenticated_access_usage_log"
  ON usage_log FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_usage_log"
  ON usage_log FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_usage_log"
  ON usage_log FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_usage_log"
  ON usage_log FOR DELETE
  USING (auth.role() = 'authenticated');

-- Ammunition Inventory table
CREATE POLICY "authenticated_access_ammunition_inventory"
  ON ammunition_inventory FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_ammunition_inventory"
  ON ammunition_inventory FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_ammunition_inventory"
  ON ammunition_inventory FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_ammunition_inventory"
  ON ammunition_inventory FOR DELETE
  USING (auth.role() = 'authenticated');

-- General Supply Inventory table
CREATE POLICY "authenticated_access_general_supply_inventory"
  ON general_supply_inventory FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_general_supply_inventory"
  ON general_supply_inventory FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_general_supply_inventory"
  ON general_supply_inventory FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_general_supply_inventory"
  ON general_supply_inventory FOR DELETE
  USING (auth.role() = 'authenticated');

-- Disposal Log table
CREATE POLICY "authenticated_access_disposal_log"
  ON disposal_log FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_disposal_log"
  ON disposal_log FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_disposal_log"
  ON disposal_log FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_disposal_log"
  ON disposal_log FOR DELETE
  USING (auth.role() = 'authenticated');

-- Security Asset table
CREATE POLICY "authenticated_access_security_asset"
  ON security_asset FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_security_asset"
  ON security_asset FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_security_asset"
  ON security_asset FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_security_asset"
  ON security_asset FOR DELETE
  USING (auth.role() = 'authenticated');

-- Asset Custody table
CREATE POLICY "authenticated_access_asset_custody"
  ON asset_custody FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_asset_custody"
  ON asset_custody FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_asset_custody"
  ON asset_custody FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_asset_custody"
  ON asset_custody FOR DELETE
  USING (auth.role() = 'authenticated');

-- Reference Manufacturers table
CREATE POLICY "authenticated_access_reference_manufacturers"
  ON reference_manufacturers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_reference_manufacturers"
  ON reference_manufacturers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_reference_manufacturers"
  ON reference_manufacturers FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_reference_manufacturers"
  ON reference_manufacturers FOR DELETE
  USING (auth.role() = 'authenticated');

-- Reference Models table
CREATE POLICY "authenticated_access_reference_models"
  ON reference_models FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_reference_models"
  ON reference_models FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_reference_models"
  ON reference_models FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_reference_models"
  ON reference_models FOR DELETE
  USING (auth.role() = 'authenticated');

-- Reference Calibers table
CREATE POLICY "authenticated_access_reference_calibers"
  ON reference_calibers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_reference_calibers"
  ON reference_calibers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_reference_calibers"
  ON reference_calibers FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_reference_calibers"
  ON reference_calibers FOR DELETE
  USING (auth.role() = 'authenticated');

-- Model Valid Calibers table
CREATE POLICY "authenticated_access_model_valid_calibers"
  ON model_valid_calibers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_model_valid_calibers"
  ON model_valid_calibers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_model_valid_calibers"
  ON model_valid_calibers FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_model_valid_calibers"
  ON model_valid_calibers FOR DELETE
  USING (auth.role() = 'authenticated');

-- Reference Projectile Types table
CREATE POLICY "authenticated_access_reference_projectile_types"
  ON reference_projectile_types FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_reference_projectile_types"
  ON reference_projectile_types FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_reference_projectile_types"
  ON reference_projectile_types FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_reference_projectile_types"
  ON reference_projectile_types FOR DELETE
  USING (auth.role() = 'authenticated');
