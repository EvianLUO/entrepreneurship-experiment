-- 直接修复：确保 participants.participant_id 是 UUID 类型
-- 然后重建所有相关表

-- 步骤1：删除所有外键约束（避免类型转换时的冲突）
ALTER TABLE IF EXISTS pretest_data DROP CONSTRAINT IF EXISTS pretest_data_participant_id_fkey;
ALTER TABLE IF EXISTS task_data DROP CONSTRAINT IF EXISTS task_data_participant_id_fkey;
ALTER TABLE IF EXISTS posttest_data DROP CONSTRAINT IF EXISTS posttest_data_participant_id_fkey;

-- 步骤2：如果 participants.participant_id 是 text，转换为 UUID
-- （如果已经是 UUID，这步会报错但可以忽略）
DO $$
BEGIN
  ALTER TABLE participants 
    ALTER COLUMN participant_id TYPE UUID USING participant_id::uuid;
EXCEPTION
  WHEN OTHERS THEN
    -- 如果已经是 UUID 类型，忽略错误
    NULL;
END $$;

-- 步骤3：确保有默认值
ALTER TABLE participants 
  ALTER COLUMN participant_id SET DEFAULT gen_random_uuid();

-- 步骤4：删除并重建 pretest_data
DROP TABLE IF EXISTS pretest_data CASCADE;

CREATE TABLE pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pretest_participant_id ON pretest_data(participant_id);

-- 步骤5：删除并重建 task_data
DROP TABLE IF EXISTS task_data CASCADE;

CREATE TABLE task_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  preliminary_plan TEXT,
  final_plan TEXT NOT NULL,
  chat_log JSONB NOT NULL,
  phase1_duration INTEGER,
  phase2_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_participant_id ON task_data(participant_id);

-- 步骤6：删除并重建 posttest_data
DROP TABLE IF EXISTS posttest_data CASCADE;

CREATE TABLE posttest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posttest_participant_id ON posttest_data(participant_id);
