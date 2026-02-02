# 部署前检查清单

在部署之前，请确认以下事项：

## ✅ 代码准备

- [ ] 代码已测试通过，本地运行正常
- [ ] 所有功能（问卷、AI对话、数据保存）都已测试
- [ ] 代码已提交到 Git（推荐推送到 GitHub）

## ✅ 数据库准备

- [ ] Supabase 数据库已创建所有必要的表
  - [ ] `participants` 表
  - [ ] `pretest_data` 表
  - [ ] `task_data` 表
  - [ ] `posttest_data` 表
  - [ ] `group_counter` 表（已初始化）
- [ ] 数据库连接信息已记录
- [ ] 已测试数据库写入功能

## ✅ API 密钥准备

记录以下密钥信息（部署时需要配置环境变量）：

- [ ] Supabase URL: `https://cvjhbvypxjgpwtanoegn.supabase.co`
- [ ] Supabase Anon Key: `sb_publishable_XrCdbdSm-xcXPa0DLp20vQ_6uxn-fGQ`
- [ ] DeepSeek API Key: `sk-a4f7b39761b84aee8bfff2bd5897ae7c`
- [ ] 讯飞星火 API 密钥（如果使用）

## ✅ 部署平台准备

### 如果使用 Vercel：
- [ ] 已注册 Vercel 账号（可用 GitHub 登录）
- [ ] 已准备好 GitHub 仓库

### 如果使用 Netlify：
- [ ] 已注册 Netlify 账号
- [ ] 已准备好 GitHub 仓库

### 如果使用自建服务器：
- [ ] 服务器已安装 Node.js 18+
- [ ] 已配置域名和 SSL 证书（推荐）
- [ ] 已安装 PM2 或其他进程管理工具

## ✅ 部署后测试

部署完成后，请测试：

- [ ] 主页可以正常访问
- [ ] Study 1 和 Study 2 入口正常
- [ ] 前测问卷可以正常填写和提交
- [ ] AI 对话功能正常
- [ ] 任务页面功能正常
- [ ] 后测问卷可以正常填写和提交
- [ ] 数据正常保存到 Supabase（在 Supabase 控制台检查）

## ✅ 安全检查

- [ ] 已检查 API 密钥是否正确配置
- [ ] 已确认敏感信息不会泄露到前端代码
- [ ] 已设置 Supabase Row Level Security（可选但推荐）

## 快速部署命令（Vercel CLI）

如果您已安装 Vercel CLI，可以使用命令行快速部署：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

## 需要帮助？

如果遇到问题，请查看：
1. [详细部署指南](./DEPLOYMENT.md)
2. Vercel/Netlify 的官方文档
3. 项目的 GitHub Issues（如果有）
