-- ============================================
-- 检查当前表的状态
-- ============================================

-- 检查哪些表已经存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('pretest_data', 'task_data', 'posttest_data')
ORDER BY table_name;

-- 如果 pretest_data 已存在，说明步骤6成功了
-- 继续执行步骤7（创建 task_data）


-- ============================================
-- 如果 task_data 表已存在，先删除再创建
-- ============================================
-- 如果步骤7报错说 task_data 已存在，执行：

DROP TABLE IF EXISTS task_data CASCADE;

-- 然后再执行步骤7的 CREATE TABLE task_data


-- ============================================
-- 如果 posttest_data 表已存在，先删除再创建
-- ============================================
-- 如果步骤8报错说 posttest_data 已存在，执行：

DROP TABLE IF EXISTS posttest_data CASCADE;

-- 然后再执行步骤8的 CREATE TABLE posttest_data
