# 数据库变量说明文档

本文档分行解释当前项目中所有数据库表及其字段/变量的含义。

---

## 一、participants（被试表）

每条记录代表一名参与实验的被试。

| 变量名 | 类型 | 含义 |
|--------|------|------|
| participant_id | UUID | 被试唯一标识，主键。 |
| study_version | TEXT | 实验版本，如 `'study1'` 或 `'study2'`。 |
| interaction_order | TEXT | 人机交互顺序：`'human_first'`（先人后AI）或 `'ai_first'`（先AI后人）。 |
| ai_reasoner | TEXT | AI 是否开启深度思考：`'on'` 或 `'off'`。 |
| status | TEXT | 进度状态：`'in_progress'`（进行中）或 `'completed'`（已完成）。 |
| created_at | TIMESTAMP WITH TIME ZONE | 被试创建时间（进入实验、同意知情同意后生成记录的时间）。 |

---

## 二、pretest_data（前测问卷数据表）

每条记录对应一名被试提交的一次前测问卷，问卷内容存在 `data` 的 JSON 里。

| 变量名 | 类型 | 含义 |
|--------|------|------|
| id | BIGSERIAL | 自增主键。 |
| participant_id | UUID | 所属被试，外键关联 participants。 |
| data | JSONB | 前测问卷全部题目答案，见下表「data 内字段」。 |
| created_at | TIMESTAMP WITH TIME ZONE | 前测提交时间。 |

### data（JSONB）内字段

| 变量名 | 含义 |
|--------|------|
| A1 | 创业次数。 |
| A2 | 总创业年限（年）。 |
| A3 | 创业阶段。 |
| A4 | 企业成立时间。 |
| A5 | 当前员工人数。 |
| A6 | 目前从事的行业（单选）；若选「其他」可能还有 A6_other。 |
| A7 | 从哪一年开始使用生成式人工智能。 |
| A8 | 平均每天使用生成式 AI 工具的频率。 |
| A9 | 平均每次使用生成式 AI 的时长。 |
| A10 | 注意力检查题（如选「香蕉」）。 |
| G1～G12 | GenAI 依赖量表 12 题（1～7 分）。 |

---

## 三、task_data（任务数据表）

每条记录对应一名被试提交的一次决策任务（含初步方案、最终方案、对话与阶段用时）。

| 变量名 | 类型 | 含义 |
|--------|------|------|
| id | BIGSERIAL | 自增主键。 |
| participant_id | UUID | 所属被试，外键关联 participants。 |
| preliminary_plan | TEXT | 初步方案正文（仅「先人后AI」组有；先AI后人组可为空）。 |
| final_plan | TEXT | 最终提交的方案正文。 |
| chat_log | JSONB | 与 AI 助手的对话记录（消息列表等）。 |
| phase1_duration | INTEGER | 任务阶段 1 的用时，单位：秒。先人后AI组=独立写初步方案阶段；先AI后人组=先使用 AI 并撰写方案阶段。 |
| phase2_duration | INTEGER | 任务阶段 2 的用时，单位：秒。先人后AI组=使用 AI 并提交最终方案阶段；先AI后人组=修改/定稿并提交最终方案阶段。 |
| created_at | TIMESTAMP WITH TIME ZONE | 任务提交时间。 |

---

## 四、posttest_data（后测问卷数据表）

每条记录对应一名被试提交的一次后测问卷，问卷内容存在 `data` 的 JSON 里。

| 变量名 | 类型 | 含义 |
|--------|------|------|
| id | BIGSERIAL | 自增主键。 |
| participant_id | UUID | 所属被试，外键关联 participants。 |
| data | JSONB | 后测问卷全部题目答案，见下表「data 内字段」。 |
| created_at | TIMESTAMP WITH TIME ZONE | 后测提交时间。 |

### data（JSONB）内字段

| 变量名 | 含义 |
|--------|------|
| task_involvement_1～4 | 任务投入度 4 题（1～7 分）。 |
| manip_check_1 | 人机顺序操纵检验（单选：先独立写再咨询 AI / 先咨询 AI 再独立写）。 |
| manip_check_2 | 独立思考程度（1～7）。 |
| manip_check_3 | AI 可解释性操纵检验（1～7，仅 Study2 有）。 |
| manip_check_4 | 对 AI 建议的理解程度（1～7，仅 Study2 有）。 |
| B1～B22 | 效果逻辑量表 22 题（1～7 分）。 |
| B9 | 性别。 |
| B10 | 年龄。 |
| B11 | 最高学历。 |

---

## 五、group_counter（分组计数表）

仅一行记录（id=1），用于 2×2 实验的均衡分组计数。

| 变量名 | 类型 | 含义 |
|--------|------|------|
| id | INTEGER | 主键，固定为 1。 |
| group1_human_first_reasoner_off | INTEGER | 已分配人数：先人后AI + 普通模式。 |
| group2_human_first_reasoner_on | INTEGER | 已分配人数：先人后AI + 深度思考模式。 |
| group3_ai_first_reasoner_off | INTEGER | 已分配人数：先AI后人 + 普通模式。 |
| group4_ai_first_reasoner_on | INTEGER | 已分配人数：先AI后人 + 深度思考模式。 |

---

## 补充说明：phase1_duration 与 phase2_duration

- **phase1_duration**：被试在**第一个任务阶段**的用时（秒）。  
  - 先人后AI：从进入「独立撰写初步方案」到点击「提交初步方案」的时长。  
  - 先AI后人：从进入任务到完成「先使用 AI 并撰写」这一段的时长。  

- **phase2_duration**：被试在**第二个任务阶段**的用时（秒）。  
  - 先人后AI：从看到初步方案、使用 AI，到提交最终方案的时长。  
  - 先AI后人：从第二阶段开始到提交最终方案的时长。  

两者均由前端在提交任务时计算并传入，单位一般为秒。
