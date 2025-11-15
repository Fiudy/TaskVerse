-- Add email column to usuarios table
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS email text;

-- Add unique constraint to email (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_email_key'
    ) THEN
        ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_email_key UNIQUE (email);
    END IF;
END $$;

-- Update existing users with email
UPDATE public.usuarios SET email = login || '@sistema.com' WHERE email IS NULL;

-- Add origem column to missoes to differentiate custom from default missions
ALTER TABLE public.missoes ADD COLUMN IF NOT EXISTS origem text DEFAULT 'customizada';

-- Update existing pre-defined missions
UPDATE public.missoes SET origem = 'padrao' WHERE criado_por IS NULL;

-- Add dificuldade column to missoes
ALTER TABLE public.missoes ADD COLUMN IF NOT EXISTS dificuldade text DEFAULT 'media';

-- Create policy for inserting new users (public registration)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create new users' AND tablename = 'usuarios'
    ) THEN
        EXECUTE 'CREATE POLICY "Anyone can create new users" ON public.usuarios FOR INSERT WITH CHECK (true)';
    END IF;
END $$;