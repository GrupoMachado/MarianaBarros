CREATE TABLE muscle_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    icone_name TEXT
);

CREATE TABLE muscles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES muscle_groups(id) ON DELETE CASCADE,
    nome TEXT NOT NULL
);

CREATE TABLE muscle_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    muscle_id UUID REFERENCES muscles(id) ON DELETE CASCADE,
    nome TEXT NOT NULL
);

CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID REFERENCES muscle_areas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    nivel TEXT,
    sets_reps TEXT,
    duracao_minutos INTEGER,
    video_url TEXT,
    thumbnail_url TEXT,
    is_enabled BOOLEAN DEFAULT true
);


CREATE TABLE nutriscan_upsell_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('yes', 'no')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE nutriscan_upsell_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own events" ON nutriscan_upsell_events
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own events" ON nutriscan_upsell_events
FOR SELECT USING (auth.uid() = user_id);

