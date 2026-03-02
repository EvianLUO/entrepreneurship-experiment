-- 修复「Failed to create participant」
-- 在 Supabase 控制台 → SQL Editor 中新建查询，粘贴并运行本脚本

-- 1. participants 表：确保有 interaction_order 和 ai_reasoner 列（2×2 设计）
-- 若之前从未执行过 update_database_design_v2.sql，请先执行下面两行去掉旧列：
-- ALTER TABLE participants DROP COLUMN IF EXISTS group_condition;
-- ALTER TABLE participants DROP COLUMN IF EXISTS task_analyzability;

ALTER TABLE participants DROP COLUMN IF EXISTS group_condition;
ALTER TABLE participants DROP COLUMN IF EXISTS task_analyzability;
ALTER TABLE participants DROP COLUMN IF EXISTS decision_logic;

ALTER TABLE participants ADD COLUMN IF NOT EXISTS interaction_order TEXT CHECK (interaction_order IN ('human_first', 'ai_first'));
ALTER TABLE participants ADD COLUMN IF NOT EXISTS ai_reasoner TEXT CHECK (ai_reasoner IN ('on', 'off'));

-- 若上面 ADD COLUMN 报错「column already exists」，可忽略，说明列已在。
-- 若报错「constraint already exists」，可只执行：
-- ALTER TABLE participants ADD COLUMN IF NOT EXISTS interaction_order TEXT;
-- ALTER TABLE participants ADD COLUMN IF NOT EXISTS ai_reasoner TEXT;

-- 为已有数据补全
UPDATE participants SET interaction_order = 'human_first' WHERE interaction_order IS NULL;
UPDATE participants SET ai_reasoner = 'off' WHERE ai_reasoner IS NULL;

-- 2. group_counter 表：确保有 2×2 四列
ALTER TABLE group_counter ADD COLUMN IF NOT EXISTS group1_human_first_reasoner_off INTEGER DEFAULT 0;
ALTER TABLE group_counter ADD COLUMN IF NOT EXISTS group2_human_first_reasoner_on INTEGER DEFAULT 0;
ALTER TABLE group_counter ADD COLUMN IF NOT EXISTS group3_ai_first_reasoner_off INTEGER DEFAULT 0;
ALTER TABLE group_counter ADD COLUMN IF NOT EXISTS group4_ai_first_reasoner_on INTEGER DEFAULT 0;

-- 确保存在 id=1 的一行
INSERT INTO group_counter (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
