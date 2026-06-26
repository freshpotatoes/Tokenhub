# TokenHub — API 中转站信息聚合平台

聚合国内外 API 中转站信息,提供模型支持、价格、口碑、运营状态的横向对比。
**不提供 API 销售或代理服务**,仅供信息参考。

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS
- **数据库**: 当前本地 Mock JSON → 预留 Supabase (PostgreSQL)
- **部署**: Vercel

## 本地启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器打开
# http://localhost:3000
```

## 项目结构

```
tokens/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页(列表+筛选)
│   ├── providers/[slug]/       # 站点详情页
│   ├── compare/                # 横向对比页
│   ├── submit/                 # 数据提交页
│   ├── api/monitor/            # 存活监控 API
│   ├── api/submit/             # 提交接收 API
│   ├── sitemap.ts              # Sitemap 生成
│   └── robots.ts               # robots.txt
├── components/
│   ├── Header.tsx              # 导航栏
│   ├── Footer.tsx              # 页脚(含免责声明)
│   ├── ProviderCard.tsx        # 中转站卡片
│   ├── FilterBar.tsx           # 筛选栏
│   ├── CompareTable.tsx        # 对比表格
│   ├── CompareProvider.tsx     # 对比选择 Context
│   ├── CompareFloatingBar.tsx  # 浮动对比栏
│   ├── StatusBadge.tsx         # 状态徽标
│   ├── ReputationScore.tsx     # 信誉评分
│   ├── RunawayRiskTag.tsx      # 跑路风险标签
│   └── Disclaimer.tsx          # 免责声明
├── lib/
│   ├── types.ts                # 类型定义
│   ├── db.ts                   # 数据读取层
│   ├── filters.ts              # 筛选/排序逻辑
│   └── monitor.ts              # 存活探测逻辑
├── data/
│   └── providers.json          # 10 条 Mock 数据
├── supabase/
│   └── schema.sql              # 建表 SQL
└── 配置文件...
```

## 功能列表 (MVP)

- [x] 首页列表 + 卡片展示
- [x] 多维度筛选(模型/支付/计费/状态/门槛/免费额度)
- [x] 价格排序(升序/降序)
- [x] 横向对比页(勾选→表格)
- [x] 站点详情页(完整字段+价格历史+社群)
- [x] 信誉评分 + 跑路风险
- [x] 站点存活监控探测逻辑
- [x] 用户信息提交表单
- [x] 全站免责声明
- [x] Sitemap + Robots.txt
- [x] 独立 Meta Title/Description

## 接入 Supabase

1. 在 [Supabase](https://supabase.com) 创建项目
2. 在 SQL Editor 中执行 `supabase/schema.sql`
3. 将 `.env.local.example` 复制为 `.env.local` 并填入 Supabase 凭据
4. 替换 `lib/db.ts` 中的数据读取逻辑(注释中有 TODO 指引)

## 部署到 Vercel

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
vercel

# 3. 设置 Cron Job 进行定时监控(需 Pro 计划)
# Vercel Dashboard → Settings → Cron Jobs
# 路径: /api/monitor  频率: */30 * * * *
```

## 免责声明

本站仅聚合公开信息,不提供任何 API 销售或代理服务,不对各中转站的真实性、稳定性、合规性负责。信息可能过时,请用户自行判断风险。
