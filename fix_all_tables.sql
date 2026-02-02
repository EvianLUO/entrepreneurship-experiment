-- 完整修复脚本：确保所有表的 participant_id 类型一致

-- ============================================
-- 步骤1：检查并修复 participants 表
-- ============================================

-- 如果 participants.participant_id 是 text 类型，先转换为 UUID
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'participants' 
      AND column_name = 'participant_id' 
      AND data_type = 'text'
  ) THEN
    -- 先删除所有外键约束
    ALTER TABLE IF EXISTS pretest_data DROP CONSTRAINT IF EXISTS pretest_data_participant_id_fkey;
    ALTER TABLE IF EXISTS task_data DROP CONSTRAINT IF EXISTS task_data_participant_id_fkey;
    ALTER TABLE IF EXISTS posttest_data DROP CONSTRAINT IF EXISTS posttest_data_participant_id_fkey;
    
    -- 转换 participants.participant_id 为 UUID
    ALTER TABLE participants 
      ALTER COLUMN participant_id TYPE UUID USING participant_id::uuid;
    
    -- 确保有默认值
    ALTER TABLE participants 
      ALTER COLUMN participant_id SET DEFAULT gen_random_uuid();
  END IF;
END $$;

-- ============================================
-- 步骤2：删除并重建 pretest_data 表
-- ============================================
DROP TABLE IF EXISTS pretest_data CASCADE;

CREATE TABLE pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pretest_participant_id ON pretest_data(participant_id);

-- ============================================
-- 步骤3：删除并重建 task_data 表
-- ============================================
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

-- ============================================
-- 步骤4：删除并重建 posttest_data 表
-- ============================================
DROP TABLE IF EXISTS posttest_data CASCADE;

CREATE TABLE posttest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posttest_participant_id ON posttest_data(participant_id);
