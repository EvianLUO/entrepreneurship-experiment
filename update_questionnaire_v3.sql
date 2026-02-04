-- 更新问卷系统数据库结构 v3
-- 执行前请备份数据！

-- 说明：
-- 1. 删除认知需求量表相关字段（如果之前有单独存储）
-- 2. 添加行业字段
-- 3. 添加ESE量表字段（ese_1 到 ese_19）
-- 4. 添加AI素养量表字段（ai_literacy_1 到 ai_literacy_12）
-- 5. 添加任务投入度字段（task_involvement_1 到 task_involvement_4）
-- 6. 添加操纵检验字段（manip_check_1 到 manip_check_4）

-- 注意：pretest_data 和 posttest_data 表使用 JSONB 存储，所以不需要修改表结构
-- 这些字段会直接存储在 JSONB 的 data 字段中

-- 如果需要从 JSONB 中提取字段进行分析，可以使用以下查询示例：
-- SELECT 
--   participant_id,
--   data->>'industry' as industry,
--   data->>'ese_1' as ese_1,
--   ...
-- FROM pretest_data;

-- 对于 posttest_data：
-- SELECT 
--   participant_id,
--   data->>'task_involvement_1' as task_involvement_1,
--   data->>'manip_check_1' as manip_check_1,
--   ...
-- FROM posttest_data;

-- 如果需要创建视图方便查询，可以使用以下SQL：

-- 创建前测数据视图（包含新字段）
CREATE OR REPLACE VIEW pretest_data_view AS
SELECT 
  id,
  participant_id,
  created_at,
  data->>'A1' as A1,
  data->>'A2' as A2,
  data->>'A3' as A3,
  data->>'A4' as A4,
  data->>'A5' as A5,
  data->>'industry' as industry,
  data->>'A6' as A6,
  data->>'A7' as A7,
  data->>'A8' as A8,
  data->>'A9' as A9,
  data->>'A10' as A10,
  data->>'A11' as A11,
  data->>'A12' as A12,
  data->>'G1' as G1,
  data->>'G2' as G2,
  data->>'G3' as G3,
  data->>'G4' as G4,
  data->>'G5' as G5,
  data->>'G6' as G6,
  data->>'G7' as G7,
  data->>'G8' as G8,
  data->>'G9' as G9,
  data->>'G10' as G10,
  data->>'G11' as G11,
  data->>'G12' as G12,
  data->>'ese_1' as ese_1,
  data->>'ese_2' as ese_2,
  data->>'ese_3' as ese_3,
  data->>'ese_4' as ese_4,
  data->>'ese_5' as ese_5,
  data->>'ese_6' as ese_6,
  data->>'ese_7' as ese_7,
  data->>'ese_8' as ese_8,
  data->>'ese_9' as ese_9,
  data->>'ese_10' as ese_10,
  data->>'ese_11' as ese_11,
  data->>'ese_12' as ese_12,
  data->>'ese_13' as ese_13,
  data->>'ese_14' as ese_14,
  data->>'ese_15' as ese_15,
  data->>'ese_16' as ese_16,
  data->>'ese_17' as ese_17,
  data->>'ese_18' as ese_18,
  data->>'ese_19' as ese_19,
  data->>'ai_literacy_1' as ai_literacy_1,
  data->>'ai_literacy_2' as ai_literacy_2,
  data->>'ai_literacy_3' as ai_literacy_3,
  data->>'ai_literacy_4' as ai_literacy_4,
  data->>'ai_literacy_5' as ai_literacy_5,
  data->>'ai_literacy_6' as ai_literacy_6,
  data->>'ai_literacy_7' as ai_literacy_7,
  data->>'ai_literacy_8' as ai_literacy_8,
  data->>'ai_literacy_9' as ai_literacy_9,
  data->>'ai_literacy_10' as ai_literacy_10,
  data->>'ai_literacy_11' as ai_literacy_11,
  data->>'ai_literacy_12' as ai_literacy_12,
  data  -- 保留完整JSONB数据
FROM pretest_data;

-- 创建后测数据视图（包含新字段）
CREATE OR REPLACE VIEW posttest_data_view AS
SELECT 
  id,
  participant_id,
  created_at,
  data->>'task_involvement_1' as task_involvement_1,
  data->>'task_involvement_2' as task_involvement_2,
  data->>'task_involvement_3' as task_involvement_3,
  data->>'task_involvement_4' as task_involvement_4,
  data->>'manip_check_1' as manip_check_1,
  data->>'manip_check_2' as manip_check_2,
  data->>'manip_check_3' as manip_check_3,
  data->>'manip_check_4' as manip_check_4,
  data->>'B1' as B1,
  data->>'B2' as B2,
  data->>'B3' as B3,
  data->>'B4' as B4,
  data->>'B5' as B5,
  data->>'B6' as B6,
  data->>'B7' as B7,
  data->>'B8' as B8,
  data  -- 保留完整JSONB数据
FROM posttest_data;

-- 完成！
-- 注意：由于使用JSONB存储，字段会自动支持，无需修改表结构
-- 视图仅用于方便查询和分析
