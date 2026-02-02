-- 更新数据库结构以支持新的2×2实验设计（人机顺序 × AI深度思考）
-- 执行前请备份数据！

-- 1. 更新 participants 表结构
ALTER TABLE participants 
  DROP COLUMN IF EXISTS group_condition,
  DROP COLUMN IF EXISTS task_analyzability,
  DROP COLUMN IF EXISTS decision_logic;

ALTER TABLE participants
  ADD COLUMN IF NOT EXISTS interaction_order TEXT CHECK (interaction_order IN ('human_first', 'ai_first')),
  ADD COLUMN IF NOT EXISTS ai_reasoner TEXT CHECK (ai_reasoner IN ('on', 'off'));

-- 2. 更新 group_counter 表结构
ALTER TABLE group_counter
  DROP COLUMN IF EXISTS ai_first,
  DROP COLUMN IF EXISTS human_first,
  DROP COLUMN IF EXISTS high_analyzability,
  DROP COLUMN IF EXISTS low_analyzability,
  DROP COLUMN IF EXISTS group1_causation_reasoner_off,
  DROP COLUMN IF EXISTS group2_causation_reasoner_on,
  DROP COLUMN IF EXISTS group3_effectuation_reasoner_off,
  DROP COLUMN IF EXISTS group4_effectuation_reasoner_on;

ALTER TABLE group_counter
  ADD COLUMN IF NOT EXISTS group1_human_first_reasoner_off INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group2_human_first_reasoner_on INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group3_ai_first_reasoner_off INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group4_ai_first_reasoner_on INTEGER DEFAULT 0;

-- 3. 确保 group_counter 有初始数据
INSERT INTO group_counter (id) 
VALUES (1) 
ON CONFLICT (id) DO UPDATE SET
  group1_human_first_reasoner_off = COALESCE(group_counter.group1_human_first_reasoner_off, 0),
  group2_human_first_reasoner_on = COALESCE(group_counter.group2_human_first_reasoner_on, 0),
  group3_ai_first_reasoner_off = COALESCE(group_counter.group3_ai_first_reasoner_off, 0),
  group4_ai_first_reasoner_on = COALESCE(group_counter.group4_ai_first_reasoner_on, 0);
