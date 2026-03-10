# ⛏️ Oh Mine OpenClaw

> **Minimalist Multi-Agent Orchestration Plugin** — 3 Agents, 3 Modes, Ready to Use

[![OpenClaw Plugin](https://img.shields.io/badge/OpenClaw-Plugin-blue)](https://openclaw.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/toller892/oh-mine-openclaw)](https://github.com/toller892/oh-mine-openclaw/stargazers)

**[🇨 中文文档](README_CN.md)** | **[🇺🇸 English](README.md)**

---

## 🎯 Why You Need This

Tired of complex multi-agent systems? 11 agents, 50 config options, 3 pages of documentation...

**Oh Mine OpenClaw says: Enough!**

- ✅ **Just 3 Agents**: Planner, Worker, Reviewer
- ✅ **Just 3 Modes**: fast, balanced, thorough
- ✅ **Zero Config**: Install and use, auto model selection
- ✅ **Fully Customizable**: Change models with one command

> 🤔 **vs oh-my-openclaw**: It has 11 agents for big projects. You have 3 agents for daily tasks.

---

## 🚀 Quick Start

### Installation

#### Option 1: Install from GitHub (Recommended) ✅ Tested

```bash
openclaw plugins install github:toller892/oh-mine-openclaw
openclaw gateway restart
```

#### Option 2: Install from Local Path

```bash
git clone https://github.com/toller892/oh-mine-openclaw.git
cd oh-mine-openclaw
npm install
openclaw plugins install .
openclaw gateway restart
```

#### Option 3: Install from npm (Coming Soon)

```bash
openclaw plugins install oh-mine-openclaw
```

### Usage

```bash
# Fast Mode — Worker executes directly
/mine-fast Fix this null pointer exception

# Balanced Mode — Planner + Worker
/mine-balanced Add user login with GitHub OAuth support

# Thorough Mode — Full pipeline: Planner → Worker → Reviewer
/mine-thorough Refactor this module for better maintainability
```

### Example Output

```
⛏️ oh-mine [balanced]

**[planner]**: Analyzing task... Suggest 3 steps: 1. Create login API 2. Integrate GitHub OAuth 3. Add session management

**[worker]**: Executing... Completed changes:
- src/auth/github.ts (new)
- src/routes/login.ts (modified)
- Config added to .env.example

Tests: Local tests passed, awaiting deployment verification
```

---

## ⚙️ Configuration

### View Current Config

```bash
/mine-config
```

### Change Agent Models

```bash
# Use cheaper model for Planner
/mine-set planner model qwen3.5

# Use best model for Worker
/mine-set worker model claude-opus-4-6

# Use mid-tier model for Reviewer
/mine-set reviewer model claude-sonnet-4-5
```

### Adjust Temperature

```bash
# More creative Planner
/mine-set planner temperature 0.8

# More stable Worker
/mine-set worker temperature 0.2
```

### Reset Config

```bash
/mine-reset
```

### Config File

Saved at `~/.openclaw/mine-config.json`:

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

## 🎭 Agent Roles

| Agent | Role | Recommended Temp | Best For |
|-------|------|------------------|----------|
| **Planner** 🧠 | Task breakdown, planning, strategy | 0.7 (creative) | Complex task analysis |
| **Worker** 👷 | Execution, coding, file changes | 0.3 (stable) | All execution tasks |
| **Reviewer** 👀 | Code review, finding issues, suggestions | 0.2 (strict) | Quality checks |

---

## 🎯 Use Cases

### ✅ Perfect for Oh Mine

- Daily bug fixes
- Small feature development
- Code reviews
- Rapid prototyping
- Learning/exploration tasks

### ❌ Might Need More Complex System

- Large-scale refactoring
- Multi-team collaboration
- 10+ step complex workflows
- Need specialized agents (frontend, backend, DB, etc.)

---

## 💡 Pro Tips

### 1. Mix Models (Save Money)

```json
{
  "agents": {
    "planner": { "model": "qwen3.5" },      // Cheap for planning
    "worker": { "model": "claude-opus-4-6" }, // Best for execution
    "reviewer": { "model": "qwen3.5" }      // Cheap for review
  }
}
```

### 2. Custom Mode Flows

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

### 3. Auto Model Selection

Set `"model": "auto"` and the plugin auto-detects your configured providers:
- Claude available → Use Claude
- Qwen available → Use Qwen
- CRS available → Use CRS

---

## 📊 Comparison

| Feature | Oh Mine | Oh My OpenClaw | Other Frameworks |
|---------|---------|----------------|------------------|
| Agent Count | 3 | 11 | 5-20+ |
| Config Complexity | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Learning Curve | 5 min | 1 hour | Half day |
| Best For | Daily tasks | Big projects | Enterprise |
| Token Usage | Low | Medium | High |

---

## 🛠️ Development

### Local Development

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

### Project Structure

```
oh-mine-openclaw/
├── index.ts                 # Plugin entry point
├── openclaw.plugin.json     # Plugin configuration
├── package.json
├── tsconfig.json
├── README.md                 # English documentation
├── README_CN.md              # Chinese documentation
├── CONTRIBUTING.md           # Contributing guide
├── LICENSE                   # MIT License
├── config/
│   └── default-config.json  # Default config template
└── skills/
    └── SKILL.md             # Skill documentation
```

---

## 🤝 Contributing

Issues and PRs are welcome!

### Want to Add a Feature?

1. Fork this repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Want to Report a Bug?

Just open an Issue with:
- Bug description
- Expected behavior
- Environment info (OpenClaw version, OS, etc.)

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

MIT License — Use it freely, just give us a ⭐️

---

## 🙏 Acknowledgments

- [OpenClaw](https://openclaw.ai) — Powerful AI assistant framework
- [oh-my-openclaw](https://github.com/happycastle114/oh-my-openclaw) — Inspiration
- [Claude](https://claude.ai) — Helped write the code

---

## 📮 Contact

- **GitHub**: [@toller892](https://github.com/toller892)
- **OpenClaw Community**: [Discord](https://discord.gg/clawd)

---

<div align="center">

**Find it useful? Give us a ⭐️ Star!**

Made with ❤️ by Tony

</div>
