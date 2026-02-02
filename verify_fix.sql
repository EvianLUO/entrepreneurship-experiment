-- ============================================
-- 验证修复是否成功
-- ============================================

-- 1. 检查所有表是否已创建
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('participants', 'pretest_data', 'task_data', 'posttest_data', 'group_counter')
ORDER BY table_name;

-- 应该返回 5 行：
-- group_counter
-- participants
-- posttest_data
-- pretest_data
-- task_data


-- 2. 检查 participants 表的 participant_id 类型
SELECT 
  column_name, 
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name = 'participants' 
  AND column_name = 'participant_id';

-- 应该显示：
-- column_name: participant_id
-- data_type: uuid
-- column_default: gen_random_uuid()


-- 3. 检查 pretest_data 表结构
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'pretest_data'
ORDER BY ordinal_position;

-- 应该显示：
-- id (bigint, NOT NULL)
-- participant_id (uuid, NOT NULL)
-- data (jsonb, NOT NULL)
-- created_at (timestamp with time zone, nullable)


-- 4. 检查外键约束是否已创建
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('pretest_data', 'task_data', 'posttest_data');

-- 应该返回 3 行，显示所有外键关系


-- 5. 检查 group_counter 表是否有初始数据
SELECT * FROM group_counter;

-- 应该返回 1 行，id=1，所有计数为 0
