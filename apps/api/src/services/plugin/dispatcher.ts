// apps/api/src/services/plugin/dispatcher.ts
import { Queue } from 'bullmq';
import { getPlugins } from './registry';

const queue = new Queue('plugin-hooks', { connection: { host: 'localhost', port: 6379 } });

export const dispatch = async (event: string, payload: any) => {
  const plugins = getPlugins();
  for (const plugin of plugins) {
    if (plugin.hooks[event]) {
      await queue.add('plugin-hook', { pluginId: plugin.id, event, payload });
    }
  }
};
