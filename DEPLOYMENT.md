# 部署指南

本指南将帮助您将实验平台部署到生产环境，让其他人可以访问并参与实验。

## 推荐部署方案：Vercel（最简单）

Vercel 是 Next.js 官方推荐的部署平台，提供免费套餐，部署简单快速。

### 前置准备

1. **GitHub 账号**（如果没有，请先注册）
2. **Vercel 账号**（可以用 GitHub 账号登录）
3. **确保代码已推送到 GitHub**

### 部署步骤

#### 第一步：将代码推送到 GitHub

1. 在项目根目录初始化 Git（如果还没有）：
```bash
git init
git add .
git commit -m "Initial commit"
```

2. 在 GitHub 创建新仓库，然后推送代码：
```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

#### 第二步：在 Vercel 部署

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置环境变量**（重要！）
   
   在 "Environment Variables" 部分添加以下变量：
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://cvjhbvypxjgpwtanoegn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ
   DEEPSEEK_API_KEY=sk-a4f7b39761b84aee8bfff2bd5897ae7c
   SPARK_APPID=0b2b6799
   SPARK_API_KEY=NjIzOTIwN2ExYzkwNGFiYThkYjk5YjI2
   SPARK_API_SECRET=5c96cf4d4387d85262435f1f42867518
   ```
   
   **注意**：如果代码已改为使用环境变量，则必须添加这些变量。如果代码仍使用硬编码，可以暂时不添加。

4. **部署设置**
   - Framework Preset: Next.js（自动检测）
   - Root Directory: `./`（默认）
   - Build Command: `npm run build`（默认）
   - Output Directory: `.next`（默认）

5. **点击 "Deploy"**
   - Vercel 会自动构建和部署
   - 部署完成后会提供一个 URL，例如：`https://your-project.vercel.app`

#### 第三步：配置自定义域名（可选）

1. 在 Vercel 项目设置中，进入 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

### 部署后检查

1. **访问部署的网站**，测试以下功能：
   - 主页是否正常显示
   - 能否进入 Study 1 和 Study 2
   - 前测问卷能否正常提交
   - AI 对话功能是否正常
   - 数据是否正常保存到 Supabase

2. **检查 Supabase 数据库**
   - 登录 Supabase 控制台
   - 查看 `participants` 表是否有新数据
   - 确认数据正常保存

## 其他部署方案

### 方案二：Netlify

1. 访问 https://www.netlify.com
2. 使用 GitHub 登录
3. 点击 "New site from Git"
4. 选择仓库并配置构建命令：`npm run build`
5. 发布目录：`.next`
6. 添加环境变量（同上）

### 方案三：自建服务器

如果需要部署到自己的服务器：

1. **安装 Node.js**（版本 18+）
2. **构建项目**：
```bash
npm install
npm run build
```
3. **启动生产服务器**：
```bash
npm start
```
4. **使用 PM2 管理进程**（推荐）：
```bash
npm install -g pm2
pm2 start npm --name "experiment" -- start
pm2 save
pm2 startup
```

5. **配置 Nginx 反向代理**（可选）

## 安全建议

⚠️ **重要**：当前代码中 API 密钥是硬编码的，这在生产环境中存在安全风险。

### 建议的安全改进

1. **将 API 密钥改为环境变量**
   - 我已经创建了 `.env.example` 文件作为参考
   - 在部署时，将密钥添加到环境变量中
   - 不要将 `.env` 文件提交到 Git

2. **使用 Supabase Row Level Security (RLS)**
   - 在 Supabase 中配置行级安全策略
   - 限制数据库访问权限

3. **定期更换 API 密钥**
   - 如果密钥泄露，及时更换

## 数据收集

部署完成后，所有实验数据会自动保存到 Supabase 数据库中：

- **participants** 表：参与者信息
- **pretest_data** 表：前测问卷数据
- **task_data** 表：任务执行数据
- **posttest_data** 表：后测问卷数据

您可以在 Supabase 控制台中：
- 查看实时数据
- 导出数据为 CSV
- 使用 SQL 查询分析数据

## 常见问题

### Q: 部署后无法访问？
A: 检查环境变量是否正确配置，查看 Vercel 构建日志中的错误信息。

### Q: AI 对话功能不工作？
A: 确认 API 密钥环境变量已正确设置，检查网络请求是否被阻止。

### Q: 数据没有保存？
A: 检查 Supabase 连接配置，确认数据库表结构是否正确。

### Q: 如何更新部署？
A: 只需将代码推送到 GitHub，Vercel 会自动重新部署。

## 技术支持

如遇到问题，请检查：
1. Vercel 部署日志
2. 浏览器控制台错误
3. Supabase 数据库连接状态
