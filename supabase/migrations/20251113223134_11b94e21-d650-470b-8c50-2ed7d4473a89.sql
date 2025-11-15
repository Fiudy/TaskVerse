-- Create enum for user types
CREATE TYPE user_type AS ENUM ('aluno', 'professor');

-- Create enum for mission status
CREATE TYPE mission_status AS ENUM ('pendente', 'entregue', 'aprovada');

-- Create enum for submission status
CREATE TYPE submission_status AS ENUM ('aguardando', 'aprovada');

-- Create enum for subject types
CREATE TYPE subject_type AS ENUM ('matematica', 'portugues', 'ciencias', 'historia', 'geografia');

-- Create usuarios (users) table
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo user_type NOT NULL,
  login TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create missoes (missions) table
CREATE TABLE public.missoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  pontos_xp INTEGER NOT NULL DEFAULT 10,
  status mission_status NOT NULL DEFAULT 'pendente',
  materia subject_type NOT NULL,
  criado_por UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create entregas (submissions) table
CREATE TABLE public.entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_missao UUID REFERENCES public.missoes(id) ON DELETE CASCADE NOT NULL,
  id_aluno UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  texto_entrega TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'aguardando',
  data_entrega TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(id_missao, id_aluno)
);

-- Enable RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usuarios
CREATE POLICY "Users can view all users" ON public.usuarios
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON public.usuarios
  FOR UPDATE USING (true);

-- RLS Policies for missoes
CREATE POLICY "Anyone can view missions" ON public.missoes
  FOR SELECT USING (true);

CREATE POLICY "Professors can create missions" ON public.missoes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Professors can update missions" ON public.missoes
  FOR UPDATE USING (true);

CREATE POLICY "Professors can delete missions" ON public.missoes
  FOR DELETE USING (true);

-- RLS Policies for entregas
CREATE POLICY "Anyone can view submissions" ON public.entregas
  FOR SELECT USING (true);

CREATE POLICY "Students can create submissions" ON public.entregas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Students can update their submissions" ON public.entregas
  FOR UPDATE USING (true);

-- Insert default users
INSERT INTO public.usuarios (nome, tipo, login, senha) VALUES
  ('Aluno Demo', 'aluno', 'aluno', 'aluno@123'),
  ('Professor Demo', 'professor', 'professor', 'professor@123');

-- Get professor ID for missions
DO $$
DECLARE
  professor_id UUID;
BEGIN
  SELECT id INTO professor_id FROM public.usuarios WHERE login = 'professor';

  -- Insert pre-defined missions for Matemática
  INSERT INTO public.missoes (titulo, descricao, pontos_xp, materia, criado_por) VALUES
    ('Soma Simples', 'Resolva: 25 + 37', 10, 'matematica', professor_id),
    ('Área do Triângulo', 'Calcule a área de um triângulo de base 8cm e altura 5cm.', 15, 'matematica', professor_id),
    ('Múltiplos de 6', 'Escreva os múltiplos de 6 até 60.', 10, 'matematica', professor_id),
    ('Expressão Matemática', 'Resolva a expressão: (12 + 8) × 3', 15, 'matematica', professor_id),
    ('Velocidade Média', 'Um trem percorre 180 km em 3h. Qual é sua velocidade média?', 20, 'matematica', professor_id);

  -- Insert pre-defined missions for Português
  INSERT INTO public.missoes (titulo, descricao, pontos_xp, materia, criado_por) VALUES
    ('Sujeito e Predicado', 'Encontre o sujeito e o predicado da frase: "O gato dorme no sofá."', 10, 'portugues', professor_id),
    ('Verbo Transitivo', 'Explique a diferença entre verbo transitivo e intransitivo.', 15, 'portugues', professor_id),
    ('Correção Gramatical', 'Reescreva a frase "Eles foi embora" corretamente.', 10, 'portugues', professor_id),
    ('Tipo de Oração', 'Classifique o tipo de oração: "Se chover, não sairemos."', 15, 'portugues', professor_id),
    ('Redação sobre Amizade', 'Escreva um pequeno texto com o tema "Amizade".', 20, 'portugues', professor_id);

  -- Insert pre-defined missions for Ciências
  INSERT INTO public.missoes (titulo, descricao, pontos_xp, materia, criado_por) VALUES
    ('Sistema Respiratório', 'Qual é a função do sistema respiratório?', 10, 'ciencias', professor_id),
    ('Seres Autótrofos', 'O que são seres autótrofos?', 15, 'ciencias', professor_id),
    ('Ciclo da Água', 'Explique o ciclo da água.', 15, 'ciencias', professor_id),
    ('Energia Renovável', 'Cite 3 exemplos de fontes de energia renovável.', 10, 'ciencias', professor_id),
    ('Fotossíntese', 'O que é fotossíntese?', 20, 'ciencias', professor_id);

  -- Insert pre-defined missions for História
  INSERT INTO public.missoes (titulo, descricao, pontos_xp, materia, criado_por) VALUES
    ('Dom Pedro I', 'Quem foi Dom Pedro I?', 10, 'historia', professor_id),
    ('Independência do Brasil', 'O que foi a Independência do Brasil?', 15, 'historia', professor_id),
    ('Revolução Industrial', 'Explique o que foi a Revolução Industrial.', 20, 'historia', professor_id),
    ('Escravidão no Brasil', 'Qual a importância da escravidão na formação do Brasil colonial?', 20, 'historia', professor_id),
    ('Tiradentes', 'Quem foi Tiradentes?', 10, 'historia', professor_id);

  -- Insert pre-defined missions for Geografia
  INSERT INTO public.missoes (titulo, descricao, pontos_xp, materia, criado_por) VALUES
    ('O que é Continente', 'O que é um continente?', 10, 'geografia', professor_id),
    ('Biomas Brasileiros', 'Quais são os principais biomas brasileiros?', 15, 'geografia', professor_id),
    ('Latitude e Longitude', 'O que é latitude e longitude?', 15, 'geografia', professor_id),
    ('Fronteiras do Brasil', 'Cite os países que fazem fronteira com o Brasil.', 10, 'geografia', professor_id),
    ('Clima Tropical', 'O que é clima tropical?', 10, 'geografia', professor_id);
END $$;