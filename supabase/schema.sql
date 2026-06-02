-- 1. Criação da tabela de Logs de Treino para Progressive Overload
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL,
    weight NUMERIC NOT NULL,
    reps INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    date TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT workout_logs_reps_check CHECK (reps > 0),
    CONSTRAINT workout_logs_weight_check CHECK (weight >= 0)
);

-- Índices essenciais para consultas do histórico da última sessão
CREATE INDEX idx_workout_logs_user_exercise ON public.workout_logs (user_id, exercise_id, date DESC);

-- Setup de Row Level Security (RLS) para a tabela pública
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read their own workout logs" 
    ON public.workout_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs" 
    ON public.workout_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);


-- 2. Alteração na tabela `exercises` (assumindo a sua existência)
-- Se só usas Mock, estas alterações servem para quando a migrares para DB
ALTER TABLE IF EXISTS public.exercises
ADD COLUMN IF NOT EXISTS rest_time_compound INTEGER DEFAULT 120,
ADD COLUMN IF NOT EXISTS rest_time_isolation INTEGER DEFAULT 60;
