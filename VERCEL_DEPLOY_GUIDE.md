# Vercel 部署详细步骤指南

本指南将一步一步教您如何使用 Vercel 部署实验平台。

## 📋 前置准备

在开始之前，请确保：
- ✅ 您的代码已经在本地测试通过
- ✅ 您有一个 GitHub 账号（如果没有，请先注册：https://github.com）

---

## 第一步：将代码推送到 GitHub

### 1.1 初始化 Git 仓库（如果还没有）

打开终端，进入项目目录：

```bash
cd "/Users/eviane/Desktop/人工智能 创业/entrepreneurship-experiment"
```

检查是否已有 Git 仓库：
```bash
git status
```

如果显示 "not a git repository"，则初始化：
```bash
git init
```

### 1.2 创建 .gitignore 文件（如果还没有）

确保 `.gitignore` 文件存在，并且包含以下内容（通常已经存在）：
- `node_modules/`
- `.env`
- `.next/`
- 等等

### 1.3 添加并提交代码

```bash
# 添加所有文件
git add .

# 提交代码
git commit -m "准备部署到 Vercel"
```

### 1.4 在 GitHub 创建新仓库

1. 访问 https://github.com
2. 点击右上角的 **"+"** 按钮，选择 **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `entrepreneurship-experiment`（或您喜欢的名字）
   - **Description**: 创业决策实验平台（可选）
   - **Visibility**: 选择 **Public** 或 **Private**（都可以）
   - **不要**勾选 "Initialize this repository with a README"（因为您已经有代码了）
4. 点击 **"Create repository"**

### 1.5 推送代码到 GitHub

GitHub 会显示推送代码的指令，复制并执行：

```bash
# 添加远程仓库（将 YOUR_USERNAME 替换为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/entrepreneurship-experiment.git

# 重命名分支为 main
git branch -M main

# 推送代码
git push -u origin main
```

**注意**：如果提示输入用户名和密码，请使用 GitHub 的 Personal Access Token 作为密码（不是您的 GitHub 密码）。

---

## 第二步：登录 Vercel

### 2.1 访问 Vercel 官网

打开浏览器，访问：https://vercel.com

### 2.2 注册/登录账号

1. 点击右上角的 **"Sign Up"** 或 **"Log In"**
2. 选择 **"Continue with GitHub"**（推荐，最简单）
3. 授权 Vercel 访问您的 GitHub 账号
4. 完成登录

---

## 第三步：导入项目到 Vercel

### 3.1 创建新项目

1. 登录后，您会看到 Vercel 的 Dashboard
2. 点击 **"Add New..."** 按钮
3. 选择 **"Project"**

### 3.2 导入 GitHub 仓库

1. 在 "Import Git Repository" 页面，您会看到您的 GitHub 仓库列表
2. 找到并点击您的 `entrepreneurship-experiment` 仓库
3. 如果没看到，点击 **"Adjust GitHub App Permissions"** 授权访问所有仓库

### 3.3 配置项目设置

在项目配置页面，您会看到以下设置：

#### Framework Preset
- ✅ 应该自动检测为 **"Next.js"**，无需修改

#### Root Directory
- ✅ 保持默认 `./`（项目根目录）

#### Build and Output Settings
- **Build Command**: `npm run build`（默认，无需修改）
- **Output Directory**: `.next`（默认，无需修改）
- **Install Command**: `npm install`（默认，无需修改）

#### Environment Variables（重要！）

点击 **"Environment Variables"** 展开，添加以下环境变量：

**变量 1：**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://cvjhbvypxjgpwtanoegn.supabase.co`
- **Environment**: 选择所有（Production, Preview, Development）

**变量 2：**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ`
- **Environment**: 选择所有（Production, Preview, Development）

**变量 3：**
- **Name**: `DEEPSEEK_API_KEY`
- **Value**: `sk-a4f7b39761b84aee8bfff2bd5897ae7c`
- **Environment**: 选择所有（Production, Preview, Development）

**变量 4（可选，如果使用讯飞星火）：**
- **Name**: `SPARK_APPID`
- **Value**: `0b2b6799`
- **Environment**: 选择所有

**变量 5（可选）：**
- **Name**: `SPARK_API_KEY`
- **Value**: `NjIzOTIwN2ExYzkwNGFiYThkYjk5YjI2`
- **Environment**: 选择所有

**变量 6（可选）：**
- **Name**: `SPARK_API_SECRET`
- **Value**: `5c96cf4d4387d85262435f1f42867518`
- **Environment**: 选择所有

**注意**：由于当前代码使用硬编码密钥，如果您暂时不想修改代码，可以**暂时不添加**这些环境变量。但建议后续改为使用环境变量以提高安全性。

### 3.4 部署项目

1. 确认所有设置正确
2. 点击页面底部的 **"Deploy"** 按钮
3. 等待部署过程（通常需要 1-3 分钟）

---

## 第四步：等待部署完成

### 4.1 查看部署进度

部署过程中，您会看到：
- ✅ Building（构建中）
- ✅ Installing dependencies（安装依赖）
- ✅ Building application（构建应用）
- ✅ Deploying（部署中）

### 4.2 部署成功

部署完成后，您会看到：
- ✅ **"Congratulations!"** 消息
- ✅ 一个部署 URL，例如：`https://entrepreneurship-experiment.vercel.app`

---

## 第五步：测试部署的网站

### 5.1 访问网站

1. 点击部署 URL，或复制 URL 在浏览器中打开
2. 您应该看到实验平台的主页

### 5.2 功能测试清单

请逐一测试以下功能：

- [ ] **主页显示正常**
  - 标题和描述正确显示
  - Study 1 和 Study 2 按钮可见

- [ ] **Study 1 测试**
  - 点击 "进入 Study 1" 按钮
  - 欢迎页和知情同意页正常显示
  - 前测问卷可以填写和提交
  - AI 对话功能正常（如果适用）
  - 任务页面正常
  - 后测问卷可以填写和提交
  - 致谢页正常显示

- [ ] **Study 2 测试**
  - 点击 "进入 Study 2" 按钮
  - 重复上述测试步骤

- [ ] **数据保存测试**
  - 完成一个完整的实验流程
  - 登录 Supabase 控制台（https://supabase.com/dashboard）
  - 检查 `participants` 表是否有新数据
  - 检查 `pretest_data`、`task_data`、`posttest_data` 表是否有数据

### 5.3 如果遇到问题

如果测试时发现问题：

1. **查看 Vercel 日志**
   - 在 Vercel Dashboard 中，点击项目
   - 进入 "Deployments" 标签
   - 点击最新的部署
   - 查看 "Build Logs" 和 "Function Logs"

2. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签中的错误信息

3. **检查环境变量**
   - 在 Vercel 项目设置中，确认环境变量已正确配置

---

## 第六步：配置自定义域名（可选）

### 6.1 添加域名

1. 在 Vercel 项目页面，点击 **"Settings"** 标签
2. 点击左侧菜单的 **"Domains"**
3. 输入您的域名（例如：`experiment.yourdomain.com`）
4. 点击 **"Add"**

### 6.2 配置 DNS

按照 Vercel 的提示，在您的域名提供商处配置 DNS 记录：
- 添加 CNAME 记录
- 或添加 A 记录（根据 Vercel 的提示）

### 6.3 等待 DNS 生效

DNS 配置通常需要几分钟到几小时生效。Vercel 会自动检测并配置 SSL 证书。

---

## 第七步：分享链接给参与者

### 7.1 获取分享链接

部署完成后，您会获得一个 Vercel 提供的 URL，例如：
```
https://entrepreneurship-experiment.vercel.app
```

### 7.2 分享链接

将这个链接分享给您的实验参与者：
- 通过邮件发送
- 在社交媒体上发布
- 在实验招募页面提供链接

### 7.3 监控数据收集

定期检查 Supabase 数据库：
1. 登录 Supabase Dashboard
2. 进入您的项目
3. 在 "Table Editor" 中查看数据
4. 或使用 SQL Editor 查询数据

---

## 🔄 更新部署

当您修改代码后，Vercel 会自动重新部署：

### 自动部署（推荐）

1. 在本地修改代码
2. 提交并推送到 GitHub：
   ```bash
   git add .
   git commit -m "更新说明"
   git push
   ```
3. Vercel 会自动检测到代码更新并重新部署
4. 在 Vercel Dashboard 中可以看到新的部署

### 手动重新部署

如果需要手动触发部署：
1. 在 Vercel Dashboard 中，进入项目
2. 点击 "Deployments" 标签
3. 点击右上角的 "Redeploy" 按钮

---

## 📊 查看部署统计

在 Vercel Dashboard 中，您可以：
- 查看访问量统计
- 查看部署历史
- 查看函数调用次数
- 查看带宽使用情况

---

## ⚠️ 常见问题

### Q1: 部署失败怎么办？

**A:** 检查以下几点：
1. 查看 Vercel 的构建日志，找到错误信息
2. 确认 `package.json` 中的依赖都正确
3. 确认代码没有语法错误
4. 尝试在本地运行 `npm run build` 看是否有错误

### Q2: 网站可以访问，但功能不正常？

**A:** 检查：
1. 浏览器控制台的错误信息
2. 环境变量是否正确配置
3. Supabase 连接是否正常
4. API 密钥是否有效

### Q3: 如何回退到之前的版本？

**A:** 
1. 在 Vercel Dashboard 中，进入 "Deployments"
2. 找到之前的成功部署
3. 点击右侧的 "..." 菜单
4. 选择 "Promote to Production"

### Q4: 如何查看实时日志？

**A:**
1. 在 Vercel Dashboard 中，进入项目
2. 点击 "Deployments" 标签
3. 点击最新的部署
4. 查看 "Function Logs" 标签

---

## 🎉 完成！

恭喜！您的实验平台已经成功部署到 Vercel。现在您可以：
- ✅ 分享链接给参与者
- ✅ 开始收集实验数据
- ✅ 在 Supabase 中查看和分析数据

如有任何问题，请查看 Vercel 官方文档：https://vercel.com/docs
