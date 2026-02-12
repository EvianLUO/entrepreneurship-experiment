-- 查询2×2实验设计中各组的样本量
-- 请在 Supabase SQL Editor 中执行此查询

-- 方法1：从 participants 表直接统计（推荐）
SELECT 
  interaction_order,
  ai_reasoner,
  COUNT(*) as sample_size,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress
FROM participants
WHERE study_version = 'study2'
GROUP BY interaction_order, ai_reasoner
ORDER BY 
  CASE interaction_order 
    WHEN 'human_first' THEN 1 
    WHEN 'ai_first' THEN 2 
  END,
  CASE ai_reasoner 
    WHEN 'off' THEN 1 
    WHEN 'on' THEN 2 
  END;

-- 方法2：按组别显示（更清晰）
SELECT 
  CASE 
    WHEN interaction_order = 'human_first' AND ai_reasoner = 'off' THEN '组1: 先人后AI + 普通模式'
    WHEN interaction_order = 'human_first' AND ai_reasoner = 'on' THEN '组2: 先人后AI + 深度思考模式'
    WHEN interaction_order = 'ai_first' AND ai_reasoner = 'off' THEN '组3: 先AI后人 + 普通模式'
    WHEN interaction_order = 'ai_first' AND ai_reasoner = 'on' THEN '组4: 先AI后人 + 深度思考模式'
  END as group_name,
  COUNT(*) as total_participants,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress
FROM participants
WHERE study_version = 'study2'
GROUP BY interaction_order, ai_reasoner
ORDER BY 
  CASE interaction_order 
    WHEN 'human_first' THEN 1 
    WHEN 'ai_first' THEN 2 
  END,
  CASE ai_reasoner 
    WHEN 'off' THEN 1 
    WHEN 'on' THEN 2 
  END;

-- 方法3：查看 group_counter 表中的计数（这是系统自动均衡分配的计数）
SELECT 
  '组1: 先人后AI + 普通模式' as group_name,
  group1_human_first_reasoner_off as count
FROM group_counter
WHERE id = 1
UNION ALL
SELECT 
  '组2: 先人后AI + 深度思考模式' as group_name,
  group2_human_first_reasoner_on as count
FROM group_counter
WHERE id = 1
UNION ALL
SELECT 
  '组3: 先AI后人 + 普通模式' as group_name,
  group3_ai_first_reasoner_off as count
FROM group_counter
WHERE id = 1
UNION ALL
SELECT 
  '组4: 先AI后人 + 深度思考模式' as group_name,
  group4_ai_first_reasoner_on as count
FROM group_counter
WHERE id = 1;
