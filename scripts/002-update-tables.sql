-- Update game_sessions table to match new schema
ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS current_round INTEGER DEFAULT 1;
ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS started_at TIMESTAMP DEFAULT NOW();
ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS time_remaining INTEGER;

-- Create index for faster active session queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_agent ON game_sessions(agent_username);
