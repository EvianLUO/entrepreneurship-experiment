-- 检查 participants 表的 participant_id 列类型
SELECT 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'participants' 
  AND column_name = 'participant_id';
