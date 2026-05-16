// apps/api/src/services/plugin/registry.ts
export interface Plugin {
  id: string;
  hooks: Record<string, Function>;
}

const registry: Map<string, Plugin> = new Map();

export const registerPlugin = (plugin: Plugin) => {
  registry.set(plugin.id, plugin);
};

export const getPlugins = () => Array.from(registry.values());
