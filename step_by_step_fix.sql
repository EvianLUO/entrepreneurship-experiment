-- ============================================
-- 步骤1：删除所有外键约束
-- ============================================
-- 执行以下 SQL（复制粘贴到 Supabase SQL Editor）

ALTER TABLE IF EXISTS pretest_data DROP CONSTRAINT IF EXISTS pretest_data_participant_id_fkey;
ALTER TABLE IF EXISTS task_data DROP CONSTRAINT IF EXISTS task_data_participant_id_fkey;
ALTER TABLE IF EXISTS posttest_data DROP CONSTRAINT IF EXISTS posttest_data_participant_id_fkey;

-- 执行后应该显示：Success. No rows returned


-- ============================================
-- 步骤2：删除所有数据表
-- ============================================
-- 执行以下 SQL

DROP TABLE IF EXISTS pretest_data CASCADE;
DROP TABLE IF EXISTS task_data CASCADE;
DROP TABLE IF EXISTS posttest_data CASCADE;

-- 执行后应该显示：Success. No rows returned


-- ============================================
-- 步骤3：检查 participants 表的 participant_id 类型
-- ============================================
-- 执行以下 SQL，查看结果

SELECT 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'participants' 
  AND column_name = 'participant_id';

-- 查看结果中的 data_type：
-- 如果是 "uuid"，跳到步骤5
-- 如果是 "text" 或 "character varying"，继续执行步骤4


-- ============================================
-- 步骤4：转换 participants.participant_id 为 UUID 类型
-- ============================================
-- 只有在上一步检查出是 text 类型时才执行
-- 如果已经是 uuid 类型，跳过这一步

ALTER TABLE participants 
  ALTER COLUMN participant_id TYPE UUID USING participant_id::uuid;

-- 执行后应该显示：Success. No rows returned


-- ============================================
-- 步骤5：确保 participants.participant_id 有默认值
-- ============================================
-- 执行以下 SQL

ALTER TABLE participants 
  ALTER COLUMN participant_id SET DEFAULT gen_random_uuid();

-- 执行后应该显示：Success. No rows returned


-- ============================================
-- 步骤6：重建 pretest_data 表
-- ============================================
-- 执行以下 SQL

CREATE TABLE pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 执行后应该显示：Success. No rows returned


-- ============================================
-- 步骤7：重建 task_data 表
-- ============================================
-- 执行以下 SQL

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

-- 执行后应该显示：Success. No rows returned


-- ============================================
-- 步骤8：重建 posttest_data 表
-- ============================================
-- 执行以下 SQL

CREATE TABLE posttest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 执行后应该显示：Success. No rows returned


-- ============================================
-- 步骤9：创建索引（提高查询性能）
-- ============================================
-- 执行以下 SQL

CREATE INDEX idx_pretest_participant_id ON pretest_data(participant_id);
CREATE INDEX idx_task_participant_id ON task_data(participant_id);
CREATE INDEX idx_posttest_participant_id ON posttest_data(participant_id);

-- 执行后应该显示：Success. No rows returned


-- ============================================
-- 完成！
-- ============================================
-- 所有步骤执行完成后，刷新浏览器页面，再次提交前测问卷即可
