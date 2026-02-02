-- 完整修复：先修复 participants 表，再重建其他表

-- ============================================
-- 第一部分：修复 participants 表
-- ============================================

-- 1. 删除所有外键约束
ALTER TABLE IF EXISTS pretest_data DROP CONSTRAINT IF EXISTS pretest_data_participant_id_fkey;
ALTER TABLE IF EXISTS task_data DROP CONSTRAINT IF EXISTS task_data_participant_id_fkey;
ALTER TABLE IF EXISTS posttest_data DROP CONSTRAINT IF EXISTS posttest_data_participant_id_fkey;

-- 2. 删除所有数据表（先删除依赖表）
DROP TABLE IF EXISTS pretest_data CASCADE;
DROP TABLE IF EXISTS task_data CASCADE;
DROP TABLE IF EXISTS posttest_data CASCADE;

-- 3. 检查并修复 participants.participant_id 类型
-- 如果 participants 表已存在且 participant_id 是 text，需要先转换
-- 注意：如果表中已有数据，需要确保所有 participant_id 都是有效的 UUID 格式

-- 如果 participants.participant_id 是 text 类型，执行：
-- ALTER TABLE participants ALTER COLUMN participant_id TYPE UUID USING participant_id::uuid;

-- 如果 participants.participant_id 已经是 UUID，跳过上一步

-- 确保有默认值
ALTER TABLE participants 
  ALTER COLUMN participant_id SET DEFAULT gen_random_uuid();

-- ============================================
-- 第二部分：重建所有数据表
-- ============================================

-- 4. 重建 pretest_data
CREATE TABLE pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 重建 task_data
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

-- 6. 重建 posttest_data
CREATE TABLE posttest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 创建索引
CREATE INDEX IF NOT EXISTS idx_pretest_participant_id ON pretest_data(participant_id);
CREATE INDEX IF NOT EXISTS idx_task_participant_id ON task_data(participant_id);
CREATE INDEX IF NOT EXISTS idx_posttest_participant_id ON posttest_data(participant_id);
