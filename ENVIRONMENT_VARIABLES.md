# 环境变量说明

本文档列出了项目使用的所有环境变量。

## ⚠️ 当前状态

**重要提示**：当前项目中，所有 API 密钥和配置都是**硬编码**在代码中的。虽然这样可以立即部署使用，但存在安全风险。

建议在生产环境中将这些配置改为使用环境变量。

---

## 📋 环境变量列表

### 1. Supabase 配置（必需）

用于连接 Supabase 数据库，存储实验数据。

#### `NEXT_PUBLIC_SUPABASE_URL`
- **类型**: 公共环境变量（客户端可见）
- **用途**: Supabase 项目 URL
- **当前值**: `https://cvjhbvypxjgpwtanoegn.supabase.co`
- **使用位置**:
  - `lib/supabaseClient.ts` (客户端)
  - `app/api/participants/route.ts` (服务端)
  - `app/api/pretest/route.ts` (服务端)
  - `app/api/task/route.ts` (服务端)
  - `app/api/posttest/route.ts` (服务端)

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **类型**: 公共环境变量（客户端可见）
- **用途**: Supabase 匿名访问密钥
- **当前值**: `sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ`
- **使用位置**: 同上

**注意**: `NEXT_PUBLIC_` 前缀表示这些变量会在客户端代码中暴露，因此只能使用 Supabase 的匿名密钥（anon key），而不是服务端密钥（service role key）。

---

### 2. DeepSeek API 配置（必需）

用于 AI 对话功能，支持普通模式和深度思考模式。

#### `DEEPSEEK_API_KEY`
- **类型**: 服务端环境变量（仅服务端可见）
- **用途**: DeepSeek API 密钥，用于调用 AI 对话接口
- **当前值**: `sk-a4f7b39761b84aee8bfff2bd5897ae7c`
- **使用位置**: `app/api/chat/route.ts`

#### `DEEPSEEK_BASE_URL`（可选）
- **类型**: 服务端环境变量
- **用途**: DeepSeek API 基础 URL
- **当前值**: `https://api.deepseek.com`（硬编码）
- **使用位置**: `app/api/chat/route.ts`

---

### 3. 讯飞星火 API 配置（可选，当前未使用）

项目中有讯飞星火的代码，但当前使用的是 DeepSeek。如果将来要切换到讯飞星火，需要以下配置：

#### `SPARK_APPID`
- **类型**: 客户端环境变量
- **用途**: 讯飞星火应用 ID
- **当前值**: `0b2b6799`（硬编码）
- **使用位置**: `lib/sparkClient.ts`

#### `SPARK_API_KEY`
- **类型**: 客户端环境变量
- **用途**: 讯飞星火 API Key
- **当前值**: `NjIzOTIwN2ExYzkwNGFiYThkYjk5YjI2`（硬编码）
- **使用位置**: `lib/sparkClient.ts`

#### `SPARK_API_SECRET`
- **类型**: 客户端环境变量
- **用途**: 讯飞星火 API Secret
- **当前值**: `5c96cf4d4387d85262435f1f42867518`（硬编码）
- **使用位置**: `lib/sparkClient.ts`

---

## 🔧 如何配置环境变量

### 本地开发环境

在项目根目录创建 `.env.local` 文件（不要提交到 Git）：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://cvjhbvypxjgpwtanoegn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ

# DeepSeek API 配置
DEEPSEEK_API_KEY=sk-a4f7b39761b84aee8bfff2bd5897ae7c
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 讯飞星火 API 配置（可选）
SPARK_APPID=0b2b6799
SPARK_API_KEY=NjIzOTIwN2ExYzkwNGFiYThkYjk5YjI2
SPARK_API_SECRET=5c96cf4d4387d85262435f1f42867518
```

### Vercel 部署

在 Vercel 项目设置中：

1. 进入项目 → Settings → Environment Variables
2. 添加每个环境变量
3. 选择应用环境（Production, Preview, Development）
4. 保存并重新部署

### Netlify 部署

在 Netlify 项目设置中：

1. 进入 Site settings → Environment variables
2. 添加每个环境变量
3. 保存并重新部署

### 自建服务器

在服务器上创建 `.env` 文件，或在启动时设置环境变量：

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://cvjhbvypxjgpwtanoegn.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ"
export DEEPSEEK_API_KEY="sk-a4f7b39761b84aee8bfff2bd5897ae7c"
```

---

## 📝 环境变量命名规范

### Next.js 环境变量规则

1. **`NEXT_PUBLIC_` 前缀**
   - 表示变量会在客户端代码中暴露
   - 可以在浏览器中通过 `process.env.NEXT_PUBLIC_XXX` 访问
   - 只能用于不敏感的信息（如 Supabase 的匿名密钥）

2. **无前缀的环境变量**
   - 仅在服务端可用
   - 不会暴露到客户端代码
   - 用于敏感信息（如 API 密钥）

3. **环境文件优先级**（从高到低）
   - `.env.local`（本地开发，不提交到 Git）
   - `.env.development`（开发环境）
   - `.env.production`（生产环境）
   - `.env`（所有环境）

---

## 🔒 安全建议

1. **不要提交 `.env` 文件到 Git**
   - 已在 `.gitignore` 中配置
   - 使用 `.env.example` 作为模板

2. **使用不同的密钥用于不同环境**
   - 开发环境使用测试密钥
   - 生产环境使用正式密钥

3. **定期轮换 API 密钥**
   - 如果密钥泄露，及时更换

4. **使用 Supabase Row Level Security (RLS)**
   - 在 Supabase 中配置行级安全策略
   - 限制数据库访问权限

5. **监控 API 使用情况**
   - 定期检查 API 调用日志
   - 发现异常及时处理

---

## 🚀 当前部署状态

**当前代码使用硬编码配置，可以直接部署，无需配置环境变量。**

但为了安全，建议：
1. 将硬编码的配置改为环境变量
2. 在部署平台配置环境变量
3. 从代码中移除硬编码的密钥

---

## 📚 相关文件

- `lib/supabaseClient.ts` - Supabase 客户端配置
- `app/api/chat/route.ts` - DeepSeek API 配置
- `lib/sparkClient.ts` - 讯飞星火 API 配置（未使用）
- `app/api/participants/route.ts` - Supabase 服务端使用
- `app/api/pretest/route.ts` - Supabase 服务端使用
- `app/api/task/route.ts` - Supabase 服务端使用
- `app/api/posttest/route.ts` - Supabase 服务端使用
