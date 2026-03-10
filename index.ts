/**
 * Oh Mine OpenClaw — 极简主义多 Agent 编排插件
 * 
 * 3 个 Agent：Planner, Worker, Reviewer
 * 3 个模式：fast, balanced, thorough
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
  modes: {
    fast: string[];
    balanced: string[];
    thorough: string[];
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
        modes: {
          fast: ['worker'],
          balanced: ['planner', 'worker'],
          thorough: ['planner', 'worker', 'reviewer'],
          ...userConfig.modes,
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
    modes: {
      fast: ['worker'],
      balanced: ['planner', 'worker'],
      thorough: ['planner', 'worker', 'reviewer'],
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
    modes: {
      ...existing.modes,
      ...config.modes,
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

/** 运行 Agent 链 */
async function runAgentChain(
  api: OpenClawPluginApi,
  chain: string[],
  task: string,
  config: MineConfig
): Promise<string> {
  let context = task;
  const results: string[] = [];
  
  for (const agentName of chain) {
    const agentConfig = config.agents[agentName as keyof typeof config.agents];
    if (!agentConfig) continue;
    
    const model = resolveModel(agentConfig.model, api);
    api.logger.info(`Running ${agentName} with model ${model}`);
    
    const response = await api.agent({
      message: context,
      model: model,
      temperature: agentConfig.temperature,
    });
    
    results.push(`**[${agentName}]**: ${response}`);
    context = response;
  }
  
  return results.join('\n\n');
}

export default function (api: OpenClawPluginApi) {
  api.logger.info('oh-mine-openclaw loaded');
  
  const config = loadConfig(api);
  
  // 注册 Gateway 方法
  api.registerGatewayMethod('mine.fast', async ({ params, respond }) => {
    const task = params?.text as string;
    if (!task) {
      respond(false, { error: 'Task is required' });
      return;
    }
    
    const result = await runAgentChain(api, config.modes.fast, task, config);
    respond(true, { result });
  });
  
  api.registerGatewayMethod('mine.balanced', async ({ params, respond }) => {
    const task = params?.text as string;
    if (!task) {
      respond(false, { error: 'Task is required' });
      return;
    }
    
    const result = await runAgentChain(api, config.modes.balanced, task, config);
    respond(true, { result });
  });
  
  api.registerGatewayMethod('mine.thorough', async ({ params, respond }) => {
    const task = params?.text as string;
    if (!task) {
      respond(false, { error: 'Task is required' });
      return;
    }
    
    const result = await runAgentChain(api, config.modes.thorough, task, config);
    respond(true, { result });
  });
  
  api.registerGatewayMethod('mine.config', ({ respond }) => {
    const configPath = getConfigPath(api);
    respond(true, {
      config,
      configPath,
    });
  });
  
  api.registerGatewayMethod('mine.set', ({ params, respond }) => {
    const agent = params?.agent as string;
    const prop = params?.property as string;
    const value = params?.value;
    
    if (!agent || !prop) {
      respond(false, { error: 'agent and property are required' });
      return;
    }
    
    saveConfig(api, {
      agents: {
        [agent]: { [prop]: value },
      } as any,
    });
    
    respond(true, { message: `Updated ${agent}.${prop} = ${value}` });
  });
}
