# Oh Mine OpenClaw 技能文档

## 概述

极简主义多 Agent 编排插件 — 3 个 Agent，3 个模式，装完就用。

## 安装

```bash
openclaw plugins install ~/.openclaw/workspace/plugins/oh-mine-openclaw
```

## 命令

### 工作流命令

| 命令 | 说明 | 流程 |
|------|------|------|
| `/mine-fast <任务>` | 快速模式 | Worker 直接执行 |
| `/mine-balanced <任务>` | 平衡模式 | Planner 规划 → Worker 执行 |
| `/mine-thorough <任务>` | 彻底模式 | Planner → Worker → Reviewer |

### 配置命令

| 命令 | 说明 |
|------|------|
| `/mine-config` | 查看当前配置 |
| `/mine-set <agent> <属性> <值>` | 修改配置 |
| `/mine-reset` | 重置为默认配置 |

## 配置

配置文件位于 `~/.openclaw/mine-config.json`

### 示例配置

```json
{
  "agents": {
    "planner": {
      "model": "claude-sonnet-4-5",
      "temperature": 0.7
    },
    "worker": {
      "model": "claude-opus-4-6",
      "temperature": 0.3
    },
    "reviewer": {
      "model": "qwen3.5",
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

### 模型配置

- `"auto"` — 自动选择（根据可用 provider）
- 具体模型名 — 如 `"claude-sonnet-4-5"`, `"qwen3.5"`

### 修改配置

```bash
# 修改 Planner 的模型
/mine-set planner model claude-haiku-4-5

# 修改 Worker 的温度
/mine-set worker temperature 0.5

# 查看配置
/mine-config

# 重置配置
/mine-reset
```

## Agent 角色

| Agent | 职责 | 推荐温度 |
|-------|------|----------|
| **Planner** | 拆解任务、给方案 | 0.7 (有创意) |
| **Worker** | 实际执行 | 0.3 (稳定) |
| **Reviewer** | 审查输出、找问题 | 0.2 (严格) |

## 使用示例

### 快速修复 bug

```
/mine-fast 修复这个空指针异常
```

### 开发新功能

```
/mine-balanced 加个用户登录功能，需要支持 GitHub OAuth
```

### 重构代码

```
/mine-thorough 重构这个模块，提高可维护性
```

## 输出格式

```
⛏️ oh-mine [balanced]

**[planner]**: 分析任务...建议分 3 步...

**[worker]**: 执行中...完成以下改动...

**[reviewer]**: 审查通过，发现 2 个小问题...
```

## 技巧

1. **简单任务用 fast** — 省时间省 token
2. **重要任务用 thorough** — 多一层审查更可靠
3. **混合用模型** — Planner/Reviewer 用便宜模型，Worker 用好模型
4. **自定义流程** — 可以修改 modes 来自定义流程

## 故障排除

### 命令不响应

检查插件是否加载：
```bash
openclaw plugins list
```

### 配置不生效

检查配置文件语法：
```bash
cat ~/.openclaw/mine-config.json | python3 -m json.tool
```

### 模型不可用

检查已配置的 provider：
```bash
openclaw config get models.providers
```
