-- Consolidate integration tracking tables
-- Migrate data from dory_integrations to mochi_integrations
INSERT INTO mochi_integrations (platform, model, message_length, response_time_ms, success, error_message, options, created_at)
SELECT 
  platform,
  model,
  message_length,
  response_time_ms,
  success,
  error_message,
  options,
  timestamp as created_at
FROM dory_integrations
WHERE NOT EXISTS (
  SELECT 1 FROM mochi_integrations mi 
  WHERE mi.platform = dory_integrations.platform 
  AND mi.created_at = dory_integrations.timestamp
);

-- Drop the redundant dory_integrations table
DROP TABLE dory_integrations;

-- Add new unified function tracking columns to mochi_integrations
ALTER TABLE mochi_integrations 
ADD COLUMN IF NOT EXISTS function_category text,
ADD COLUMN IF NOT EXISTS orchestrated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS unified_version text;

-- Create index for better performance on recent queries
CREATE INDEX IF NOT EXISTS idx_mochi_integrations_recent 
ON mochi_integrations (created_at DESC, platform, success);

-- Create index for orchestration tracking
CREATE INDEX IF NOT EXISTS idx_mochi_integrations_orchestrated 
ON mochi_integrations (orchestrated, platform) WHERE orchestrated = true;