CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('admin', 'usuario');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE modality_type AS ENUM ('Parapente', 'Asa Delta');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE level_type AS ENUM (
    'Aluno',
    'Iniciante',
    'Intermediario',
    'Avancado',
    'Instrutor'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE card_status AS ENUM ('ativo', 'inativo');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  type user_type NOT NULL DEFAULT 'usuario',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS member_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  modality modality_type NOT NULL,
  level level_type NOT NULL,
  annuity_valid_until DATE NOT NULL,
  blood_type VARCHAR(4) NOT NULL,
  emergency_contact_name VARCHAR(160) NOT NULL,
  emergency_contact_phone VARCHAR(30) NOT NULL,
  health_plan VARCHAR(160) NOT NULL DEFAULT 'Nao possui',
  photo_url TEXT,
  status card_status NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_member_cards_user_id ON member_cards(user_id);

ALTER TABLE member_cards
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(80) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin inicial:
-- E-mail: admin@carteirinha.local
-- Senha: admin123
INSERT INTO users (name, email, password_hash, type)
VALUES (
  'Administrador',
  'admin@carteirinha.local',
  '$2a$10$F.Vz278NhWphAw3wAeFcxOPBQpwHNWRRs0rAqw5sRccpp9DokM.om',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
