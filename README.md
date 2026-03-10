# ⛏️ Oh Mine OpenClaw

> **极简主义多 Agent 编排插件** — 3 个 Agent，3 个模式，装完就用

[![OpenClaw Plugin](https://img.shields.io/badge/OpenClaw-Plugin-blue)](https://openclaw.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/toller892/oh-mine-openclaw)](https://github.com/toller892/oh-mine-openclaw/stargazers)

---

## 🎯 为什么需要这个？

你是否厌倦了复杂的多 Agent 系统？11 个 Agent、50 个配置项、3 页文档...

**Oh Mine OpenClaw 说：够了！**

- ✅ **3 个 Agent** 就够了：Planner（规划）、Worker（执行）、Reviewer（审查）
- ✅ **3 个模式** 任选：fast（快）、balanced（平衡）、thorough（彻底）
- ✅ **零配置启动**：装完就用，模型自动选择
- ✅ **灵活自定义**：想改模型？一行命令

> 🤔 **对比 oh-my-openclaw**：它有 11 个 Agent，适合大项目；你有 3 个 Agent，适合日常任务。

---

## 🚀 快速开始

### 安装

```bash
openclaw plugins install oh-mine-openclaw
```

### 使用

```bash
# 快速模式 — Worker 直接干
/mine-fast 修复这个空指针异常

# 平衡模式 — Planner 规划 + Worker 执行
/mine-balanced 加个用户登录功能，支持 GitHub OAuth

# 彻底模式 — Planner → Worker → Reviewer 全流程
/mine-thorough 重构这个模块，提高可维护性
```

### 输出示例

```
⛏️ oh-mine [balanced]

**[planner]**: 分析任务...建议分 3 步：1. 创建登录 API 2. 集成 GitHub OAuth 3. 添加 session 管理

**[worker]**: 执行中...完成以下改动：
- src/auth/github.ts (新增)
- src/routes/login.ts (修改)
- 配置项已添加到 .env.example

测试：本地测试通过，等待部署验证
```

---

## ⚙️ 配置

### 查看当前配置

```bash
/mine-config
```

### 修改 Agent 模型

```bash
# Planner 用便宜的模型
/mine-set planner model qwen3.5

# Worker 用最好的模型
/mine-set worker model claude-opus-4-6

# Reviewer 用中等模型
/mine-set reviewer model claude-sonnet-4-5
```

### 修改温度参数

```bash
# Planner 更有创意
/mine-set planner temperature 0.8

# Worker 更稳定
/mine-set worker temperature 0.2
```

### 重置配置

```bash
/mine-reset
```

### 配置文件

配置保存在 `~/.openclaw/mine-config.json`：

```json
{
  "agents": {
    "planner": {
      "model": "auto",
      "temperature": 0.7
    },
    "worker": {
      "model": "claude-opus-4-6",
      "temperature": 0.3
    },
    "reviewer": {
      "model": "auto",
      "temperature": 0.2
    }
  },
  "modes": {
    "fast": ["worker"],
    "balanced": ["planner", "worker"],
    "thorough": ["planner", "worker", "reviewer"]
  }
}
```

---

## 🎭 Agent 角色

| Agent | 职责 | 推荐温度 | 适合场景 |
|-------|------|----------|----------|
| **Planner** 🧠 | 拆解任务、给方案、规划步骤 | 0.7 (有创意) | 复杂任务分析 |
| **Worker** 👷 | 实际执行、写代码、改文件 | 0.3 (稳定) | 所有执行任务 |
| **Reviewer** 👀 | 审查输出、找问题、提建议 | 0.2 (严格) | 代码审查、质量检查 |

---

## 🎯 使用场景

### ✅ 适合用 Oh Mine

- 日常 bug 修复
- 小功能开发
- 代码审查
- 快速原型
- 学习/探索任务

### ❌ 可能需要更复杂的系统

- 大型重构项目
- 多团队协作
- 需要 10+ 步骤的复杂工作流
- 需要 specialized Agent（前端、后端、DB 等）

---

## 💡 进阶技巧

### 1. 混合用模型（省钱大法）

```json
{
  "agents": {
    "planner": { "model": "qwen3.5" },      // 规划用便宜的
    "worker": { "model": "claude-opus-4-6" }, // 执行用好的
    "reviewer": { "model": "qwen3.5" }      // 审查用便宜的
  }
}
```

### 2. 自定义模式流程

```json
{
  "modes": {
    "fast": ["worker"],
    "balanced": ["planner", "worker"],
    "thorough": ["planner", "worker", "reviewer"],
    "extreme": ["planner", "planner", "worker", "reviewer", "reviewer"]
  }
}
```

### 3. 模型自动选择

设置 `"model": "auto"`，插件会自动检测你配置的 provider：
- 有 Claude 用 Claude
- 有千问用千问
- 有 CRS 用 CRS

---

## 📊 对比其他多 Agent 系统

| 特性 | Oh Mine | Oh My OpenClaw | 其他框架 |
|------|---------|----------------|----------|
| Agent 数量 | 3 | 11 | 5-20+ |
| 配置复杂度 | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 学习曲线 | 5 分钟 | 1 小时 | 半天 |
| 适合场景 | 日常任务 | 大项目 | 企业级 |
| Token 消耗 | 低 | 中 | 高 |

---

## 🛠️ 开发

### 本地开发

```bash
# Clone
git clone https://github.com/toller892/oh-mine-openclaw.git
cd oh-mine-openclaw

# Install dependencies
npm install

# Install to OpenClaw
openclaw plugins install .

# Restart gateway
openclaw gateway restart
```

### 项目结构

```
oh-mine-openclaw/
├── index.ts                 # 插件入口
├── openclaw.plugin.json     # 插件配置
├── package.json
├── tsconfig.json
├── README.md
├── config/
│   └── default-config.json  # 默认配置模板
└── skills/
    └── SKILL.md             # 技能文档
```

---

## 🤝 贡献

欢迎提 Issue 和 PR！

### 想添加新功能？

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 想报告问题？

直接提 Issue，描述清楚：
- 问题现象
- 期望行为
- 环境信息（OpenClaw 版本、OS 等）

---

## 📄 License

MIT License — 想用就用，记得给个 ⭐️

---

## 🙏 致谢

- [OpenClaw](https://openclaw.ai) — 强大的 AI 助手框架
- [oh-my-openclaw](https://github.com/happycastle114/oh-my-openclaw) — 灵感来源
- [Claude](https://claude.ai) — 帮我写代码

---

## 📮 联系方式

- **GitHub**: [@toller892](https://github.com/toller892)
- **OpenClaw Community**: [Discord](https://discord.gg/clawd)

---

<div align="center">

**觉得有用？给个 ⭐️ Star 支持一下！**

Made with ❤️ by Tony

</div>
