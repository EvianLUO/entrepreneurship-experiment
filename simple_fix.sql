-- 简单修复方案：直接删除并重建所有表

-- 1. 删除所有外键约束
ALTER TABLE IF EXISTS pretest_data DROP CONSTRAINT IF EXISTS pretest_data_participant_id_fkey;
ALTER TABLE IF EXISTS task_data DROP CONSTRAINT IF EXISTS task_data_participant_id_fkey;
ALTER TABLE IF EXISTS posttest_data DROP CONSTRAINT IF EXISTS posttest_data_participant_id_fkey;

-- 2. 删除所有数据表
DROP TABLE IF EXISTS pretest_data CASCADE;
DROP TABLE IF EXISTS task_data CASCADE;
DROP TABLE IF EXISTS posttest_data CASCADE;

-- 3. 重建 pretest_data（确保 participant_id 是 UUID）
CREATE TABLE pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 重建 task_data
CREATE TABLE task_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL,
  preliminary_plan TEXT,
  final_plan TEXT NOT NULL,
  chat_log JSONB NOT NULL,
  phase1_duration INTEGER,
  phase2_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 重建 posttest_data
CREATE TABLE posttest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建外键约束（如果 participants.participant_id 是 UUID）
ALTER TABLE pretest_data 
  ADD CONSTRAINT pretest_data_participant_id_fkey 
  FOREIGN KEY (participant_id) 
  REFERENCES participants(participant_id) 
  ON DELETE CASCADE;

ALTER TABLE task_data 
  ADD CONSTRAINT task_data_participant_id_fkey 
  FOREIGN KEY (participant_id) 
  REFERENCES participants(participant_id) 
  ON DELETE CASCADE;

ALTER TABLE posttest_data 
  ADD CONSTRAINT posttest_data_participant_id_fkey 
  FOREIGN KEY (participant_id) 
  REFERENCES participants(participant_id) 
  ON DELETE CASCADE;

-- 7. 创建索引
CREATE INDEX IF NOT EXISTS idx_pretest_participant_id ON pretest_data(participant_id);
CREATE INDEX IF NOT EXISTS idx_task_participant_id ON task_data(participant_id);
CREATE INDEX IF NOT EXISTS idx_posttest_participant_id ON posttest_data(participant_id);
