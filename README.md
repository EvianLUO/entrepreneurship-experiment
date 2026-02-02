# 创业决策实验平台

这是一个基于 Next.js 14 的心理学实验平台，用于研究人机交互顺序对创业者效果逻辑决策的影响。

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (数据库)
- 讯飞星火大模型 API (AI对话)

## 安装与运行

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问 `http://localhost:3000`

## 数据库设置

需要在 Supabase 中创建以下数据表：

### 1. participants 表
```sql
CREATE TABLE participants (
  participant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_version TEXT NOT NULL CHECK (study_version IN ('study1', 'study2')),
  group_condition TEXT NOT NULL CHECK (group_condition IN ('ai_first', 'human_first')),
  task_analyzability TEXT CHECK (task_analyzability IN ('high', 'low')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. pretest_data 表
```sql
CREATE TABLE pretest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. task_data 表
```sql
CREATE TABLE task_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id),
  preliminary_plan TEXT,
  final_plan TEXT NOT NULL,
  chat_log JSONB NOT NULL,
  phase1_duration INTEGER,
  phase2_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. posttest_data 表
```sql
CREATE TABLE posttest_data (
  id BIGSERIAL PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES participants(participant_id),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. group_counter 表（用于分组均衡）
```sql
CREATE TABLE group_counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  ai_first INTEGER DEFAULT 0,
  human_first INTEGER DEFAULT 0,
  high_analyzability INTEGER DEFAULT 0,
  low_analyzability INTEGER DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

-- 插入初始记录
INSERT INTO group_counter (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
```

## 实验流程

### Study 1（单因素2水平）
- 自变量：人机交互顺序（先AI后人 vs 先人后AI）
- 使用中等任务可分析性情境

### Study 2（2×2设计）
- 自变量1：人机交互顺序（先AI后人 vs 先人后AI）
- 自变量2：任务可分析性（高 vs 低）

## 实验步骤

1. **欢迎页+知情同意**：显示实验说明和知情同意书
2. **前测问卷**：收集基本信息、GenAI依赖量表、认知需求量表
3. **情境阅读页**：显示创业情境材料和任务要求
4. **任务执行页**：根据分组显示不同界面（先AI后人组或先人后AI组）
5. **后测问卷**：Brettel效果逻辑量表
6. **结束致谢页**：显示感谢语

## 功能特性

- ✅ 自动分组均衡（基于 group_counter 表）
- ✅ 断点续答功能（使用 localStorage）
- ✅ 实时AI对话（WebSocket连接星火API）
- ✅ 完整数据记录（所有问卷和任务数据）
- ✅ 响应式设计（支持电脑和平板）

## 部署到生产环境

想要让其他人访问您的实验平台并收集数据？请查看 **[部署指南](./DEPLOYMENT.md)**。

部署指南包含：
- Vercel 部署步骤（推荐，最简单）
- 环境变量配置
- 其他部署方案（Netlify、自建服务器）
- 安全建议
- 常见问题解答

## 注意事项

- 星火API密钥直接写在客户端代码中，仅用于实验环境
- 生产环境应将敏感信息移至环境变量
- 确保 Supabase 项目配置正确，且所有表已创建
