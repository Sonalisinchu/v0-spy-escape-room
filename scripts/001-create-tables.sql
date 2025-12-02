-- Create table for storing game sessions and results
CREATE TABLE IF NOT EXISTS game_sessions (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100),
  secret_key VARCHAR(100) UNIQUE,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed', 'timeout'
  round1_completed BOOLEAN DEFAULT FALSE,
  round2_completed BOOLEAN DEFAULT FALSE,
  round3_completed BOOLEAN DEFAULT FALSE,
  total_time_seconds INTEGER,
  hints_used INTEGER DEFAULT 0,
  attempts_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for registered agents (managed by host)
CREATE TABLE IF NOT EXISTS registered_agents (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_game_sessions_agent ON game_sessions(agent_name);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_registered_agents_username ON registered_agents(username);
