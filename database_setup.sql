-- 创业决策实验平台数据库设置脚本
-- 请在 Supabase SQL Editor 中执行以下SQL语句

-- 1. 创建 participants 表
CREATE TABLE IF NOT EXISTS participants (
  participant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_version TEXT NOT NULL CHECK (study_version IN ('study1', 'study2')),
  group_condition TEXT NOT NULL CHECK (group_condition IN ('ai_first', 'human_first')),
  task_analyzability TEXT CHECK (task_analyzability IN ('high', 'low')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 pretest_data 表
CREATE TABLE IF NOT EXISTS pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建 task_data 表
CREATE TABLE IF NOT EXISTS task_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  preliminary_plan TEXT,
  final_plan TEXT NOT NULL,
  chat_log JSONB NOT NULL,
  phase1_duration INTEGER,
  phase2_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建 posttest_data 表
CREATE TABLE IF NOT EXISTS posttest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建 group_counter 表（用于分组均衡）
CREATE TABLE IF NOT EXISTS group_counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  ai_first INTEGER DEFAULT 0,
  human_first INTEGER DEFAULT 0,
  high_analyzability INTEGER DEFAULT 0,
  low_analyzability INTEGER DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

-- 插入初始记录（如果不存在）
INSERT INTO group_counter (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_participants_study_version ON participants(study_version);
CREATE INDEX IF NOT EXISTS idx_participants_group_condition ON participants(group_condition);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS idx_pretest_participant_id ON pretest_data(participant_id);
CREATE INDEX IF NOT EXISTS idx_task_participant_id ON task_data(participant_id);
CREATE INDEX IF NOT EXISTS idx_posttest_participant_id ON posttest_data(participant_id);
