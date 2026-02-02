-- ============================================
-- 最终验证：检查所有表是否正确创建
-- ============================================

-- 1. 检查所有表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('participants', 'pretest_data', 'task_data', 'posttest_data', 'group_counter')
ORDER BY table_name;

-- 应该返回 5 行


-- 2. 检查所有表的外键约束
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
  AND tc.table_name IN ('pretest_data', 'task_data', 'posttest_data')
ORDER BY tc.table_name;

-- 应该返回 3 行，显示所有外键关系都正确


-- 3. 检查 group_counter 表
SELECT * FROM group_counter;

-- 应该返回 1 行，id=1


-- 4. 测试插入数据（可选，用于验证）
-- 先创建一个测试 participant
INSERT INTO participants (study_version, group_condition, status)
VALUES ('study1', 'ai_first', 'in_progress')
RETURNING participant_id;

-- 使用返回的 participant_id 测试插入 pretest_data
-- INSERT INTO pretest_data (participant_id, data)
-- VALUES ('上面返回的 participant_id', '{"test": "data"}'::jsonb);

-- 如果插入成功，说明一切正常
