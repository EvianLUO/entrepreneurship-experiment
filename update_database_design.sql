-- 更新数据库结构以支持新的2×2实验设计
-- 执行前请备份数据！

-- 1. 更新 participants 表结构
ALTER TABLE participants 
  DROP COLUMN IF EXISTS group_condition,
  DROP COLUMN IF EXISTS task_analyzability;

ALTER TABLE participants
  ADD COLUMN IF NOT EXISTS decision_logic TEXT CHECK (decision_logic IN ('causation', 'effectuation')),
  ADD COLUMN IF NOT EXISTS ai_reasoner TEXT CHECK (ai_reasoner IN ('on', 'off'));

-- 2. 更新 group_counter 表结构
ALTER TABLE group_counter
  DROP COLUMN IF EXISTS ai_first,
  DROP COLUMN IF EXISTS human_first,
  DROP COLUMN IF EXISTS high_analyzability,
  DROP COLUMN IF EXISTS low_analyzability;

ALTER TABLE group_counter
  ADD COLUMN IF NOT EXISTS group1_causation_reasoner_off INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group2_causation_reasoner_on INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group3_effectuation_reasoner_off INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group4_effectuation_reasoner_on INTEGER DEFAULT 0;

-- 3. 确保 group_counter 有初始数据
INSERT INTO group_counter (id) 
VALUES (1) 
ON CONFLICT (id) DO UPDATE SET
  group1_causation_reasoner_off = COALESCE(group_counter.group1_causation_reasoner_off, 0),
  group2_causation_reasoner_on = COALESCE(group_counter.group2_causation_reasoner_on, 0),
  group3_effectuation_reasoner_off = COALESCE(group_counter.group3_effectuation_reasoner_off, 0),
  group4_effectuation_reasoner_on = COALESCE(group_counter.group4_effectuation_reasoner_on, 0);
