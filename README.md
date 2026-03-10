# ⛏️ Oh Mine OpenClaw

> 极简主义多 Agent 编排 — 3 个 Agent，3 个模式，装完就用

## 快速开始

### 安装

```bash
openclaw plugins install ~/.openclaw/workspace/plugins/oh-mine-openclaw
```

### 使用

```bash
# 快速模式 — 直接执行
/mine-fast 修复这个 bug

# 平衡模式 — 规划 + 执行
/mine-balanced 加个新功能

# 彻底模式 — 规划 + 执行 + 审查
/mine-thorough 重构这个模块
```

## 特性

- 🎯 **3 个 Agent**: Planner (规划), Worker (执行), Reviewer (审查)
- 🚀 **3 个模式**: fast, balanced, thorough
- ⚙️ **灵活配置**: 自定义每个 Agent 的模型和参数
- 💾 **零配置启动**: 自动检测可用模型

## 配置

查看配置：
```bash
/mine-config
```

修改模型：
```bash
/mine-set planner model claude-sonnet-4-5
```

重置配置：
```bash
/mine-reset
```

## 对比 oh-my-openclaw

| oh-my-openclaw | oh-mine-openclaw |
|----------------|------------------|
| 11 个 Agent | 3 个 Agent |
| 复杂配置 | 零配置 |
| 多步骤工作流 | 一键完成 |
| 适合大项目 | 适合日常任务 |

## License

MIT
