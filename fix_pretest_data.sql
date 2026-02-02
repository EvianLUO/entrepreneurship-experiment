-- 修复 pretest_data 表的 participant_id 类型不匹配问题

-- 方案1：如果 pretest_data 表还没有重要数据，直接重建（推荐）
DROP TABLE IF EXISTS pretest_data CASCADE;

CREATE TABLE pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pretest_participant_id ON pretest_data(participant_id);

-- 方案2：如果 pretest_data 表已有数据需要保留，使用以下步骤：
-- 步骤1：先删除外键约束（如果存在）
-- ALTER TABLE pretest_data DROP CONSTRAINT IF EXISTS pretest_data_participant_id_fkey;
-- 
-- 步骤2：创建一个临时列存储 UUID 类型
-- ALTER TABLE pretest_data ADD COLUMN participant_id_uuid UUID;
-- 
-- 步骤3：将 text 类型的 participant_id 转换为 UUID（如果格式正确）
-- UPDATE pretest_data SET participant_id_uuid = participant_id::uuid WHERE participant_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
-- 
-- 步骤4：删除旧的 text 列
-- ALTER TABLE pretest_data DROP COLUMN participant_id;
-- 
-- 步骤5：重命名新列为 participant_id
-- ALTER TABLE pretest_data RENAME COLUMN participant_id_uuid TO participant_id;
-- 
-- 步骤6：设置 NOT NULL 约束
-- ALTER TABLE pretest_data ALTER COLUMN participant_id SET NOT NULL;
-- 
-- 步骤7：创建外键约束
-- ALTER TABLE pretest_data ADD CONSTRAINT pretest_data_participant_id_fkey 
--   FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE;
-- 
-- 步骤8：创建索引
-- CREATE INDEX IF NOT EXISTS idx_pretest_participant_id ON pretest_data(participant_id);
