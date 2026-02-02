-- 快速修复：添加缺失的字段（如果还没有执行完整更新）

-- 1. 检查并添加 interaction_order 字段
ALTER TABLE participants
  ADD COLUMN IF NOT EXISTS interaction_order TEXT;

-- 2. 如果字段已存在但没有约束，添加约束
DO $$
BEGIN
  -- 检查约束是否存在
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'participants_interaction_order_check'
  ) THEN
    ALTER TABLE participants
      ADD CONSTRAINT participants_interaction_order_check 
      CHECK (interaction_order IN ('human_first', 'ai_first'));
  END IF;
END $$;

-- 3. 检查并添加 ai_reasoner 字段
ALTER TABLE participants
  ADD COLUMN IF NOT EXISTS ai_reasoner TEXT;

-- 4. 如果字段已存在但没有约束，添加约束
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'participants_ai_reasoner_check'
  ) THEN
    ALTER TABLE participants
      ADD CONSTRAINT participants_ai_reasoner_check 
      CHECK (ai_reasoner IN ('on', 'off'));
  END IF;
END $$;

-- 5. 更新 group_counter 表（如果字段不存在）
ALTER TABLE group_counter
  ADD COLUMN IF NOT EXISTS group1_human_first_reasoner_off INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group2_human_first_reasoner_on INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group3_ai_first_reasoner_off INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group4_ai_first_reasoner_on INTEGER DEFAULT 0;

-- 6. 确保 group_counter 有初始数据
INSERT INTO group_counter (id) 
VALUES (1) 
ON CONFLICT (id) DO UPDATE SET
  group1_human_first_reasoner_off = COALESCE(group_counter.group1_human_first_reasoner_off, 0),
  group2_human_first_reasoner_on = COALESCE(group_counter.group2_human_first_reasoner_on, 0),
  group3_ai_first_reasoner_off = COALESCE(group_counter.group3_ai_first_reasoner_off, 0),
  group4_ai_first_reasoner_on = COALESCE(group_counter.group4_ai_first_reasoner_on, 0);
