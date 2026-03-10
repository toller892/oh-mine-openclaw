/**
 * Oh Mine OpenClaw — 极简主义多 Agent 编排 Skill
 * 
 * 3 个 Agent：Planner, Worker, Reviewer
 * 3 个模式：fast, balanced, thorough
 * 
 * 使用方式：
 *  直接发消息："用 mine-fast 模式：修复这个 bug"
 *  或者："用 mine-balanced：加个登录功能"
 */

import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import path from "node:path";
import fs from "node:fs";

interface AgentConfig {
  model: string;
  temperature: number;
}

interface MineConfig {
  agents: {
    planner: AgentConfig;
    worker: AgentConfig;
    reviewer: AgentConfig;
  };
}

/** 获取配置文件路径 */
function getConfigPath(api: OpenClawPluginApi): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '~';
  return path.join(homeDir, '.openclaw', 'mine-config.json');
}

/** 加载用户配置 */
function loadConfig(api: OpenClawPluginApi): MineConfig {
  const configPath = getConfigPath(api);
  
  try {
    if (fs.existsSync(configPath)) {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return {
        agents: {
          planner: { model: 'auto', temperature: 0.7, ...userConfig.agents?.planner },
          worker: { model: 'auto', temperature: 0.3, ...userConfig.agents?.worker },
          reviewer: { model: 'auto', temperature: 0.2, ...userConfig.agents?.reviewer },
        },
      };
    }
  } catch (e) {
    api.logger.warn(`Failed to load config: ${e}`);
  }
  
  return {
    agents: {
      planner: { model: 'auto', temperature: 0.7 },
      worker: { model: 'auto', temperature: 0.3 },
      reviewer: { model: 'auto', temperature: 0.2 },
    },
  };
}

/** 保存配置 */
function saveConfig(api: OpenClawPluginApi, config: Partial<MineConfig>): void {
  const configPath = getConfigPath(api);
  const existing = loadConfig(api);
  
  const merged: MineConfig = {
    agents: {
      planner: { ...existing.agents.planner, ...config.agents?.planner },
      worker: { ...existing.agents.worker, ...config.agents?.worker },
      reviewer: { ...existing.agents.reviewer, ...config.agents?.reviewer },
    },
  };
  
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(merged, null, 2));
}

/** 解析模型别名 */
function resolveModel(alias: string, api: OpenClawPluginApi): string {
  if (alias !== 'auto') return alias;
  
  const providers = (api.config as any)?.models?.providers || {};
  
  if (providers.claude || providers.anthropic) {
    return 'anthropic/claude-sonnet-4-5-20250929';
  }
  
  if (providers.qwen || providers.bailian) {
    return 'bailian/qwen3.5-plus';
  }
  
  if (providers.crs) {
    return 'crs/claude-opus-4-5-20251101';
  }
  
  return 'default';
}

export default function (api: OpenClawPluginApi) {
  api.logger.info('oh-mine-openclaw skill loaded');
  
  const config = loadConfig(api);
  
  // 注册配置查看工具
  api.registerTool({
    name: 'mine_config',
    description: 'View oh-mine configuration',
    parameters: {
      type: 'object',
      properties: {},
    },
    async execute() {
      const configPath = getConfigPath(api);
      return {
        content: [{
          type: 'text',
          text: `⛏️ oh-mine Config\n\nConfig file: ${configPath}\n\n` +
            `Agents:\n` +
            `- Planner: ${config.agents.planner.model} (temp: ${config.agents.planner.temperature})\n` +
            `- Worker: ${config.agents.worker.model} (temp: ${config.agents.worker.temperature})\n` +
            `- Reviewer: ${config.agents.reviewer.model} (temp: ${config.agents.reviewer.temperature})`,
        }],
      };
    },
  });
  
  // 注册配置修改工具
  api.registerTool({
    name: 'mine_set',
    description: 'Set oh-mine agent configuration',
    parameters: {
      type: 'object',
      properties: {
        agent: { type: 'string', enum: ['planner', 'worker', 'reviewer'] },
        property: { type: 'string', enum: ['model', 'temperature'] },
        value: { type: 'string' },
      },
      required: ['agent', 'property', 'value'],
    },
    async execute(_id, params) {
      const { agent, property, value } = params as any;
      
      const configValue = property === 'temperature' ? parseFloat(value) : value;
      
      saveConfig(api, {
        agents: {
          [agent]: { [property]: configValue },
        } as any,
      });
      
      return {
        content: [{
          type: 'text',
          text: `✅ Updated ${agent}.${property} = ${configValue}`,
        }],
      };
    },
  });
}
