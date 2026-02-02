-- 第一步：检查 participants 表的 participant_id 类型
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'participants' 
  AND column_name = 'participant_id';

-- 第二步：检查 pretest_data 表的 participant_id 类型（如果表存在）
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'pretest_data' 
  AND column_name = 'participant_id';

-- 第三步：如果 participants.participant_id 是 text 类型，需要先修复它
-- 执行以下 SQL（取消注释）：

-- ALTER TABLE participants 
--   ALTER COLUMN participant_id TYPE UUID USING participant_id::uuid;

-- 第四步：删除并重建 pretest_data 表（确保类型匹配）
DROP TABLE IF EXISTS pretest_data CASCADE;

CREATE TABLE pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pretest_participant_id ON pretest_data(participant_id);
