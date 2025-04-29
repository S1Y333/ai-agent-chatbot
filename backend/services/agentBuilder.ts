import { AIProjectsClient } from '@azure/ai-projects';
import { DefaultAzureCredential } from '@azure/identity';
import { aiClient } from '../utils/aiClient';

export async function createAgent(
  model: string,
  name: string,
  instructions: string
): Promise<{ id: string; name: string }> {
  try {
    const agent = await aiClient.agents.createAgent(model, {
      name,
      instructions,
    });

    console.log(`✅ Created agent, ID: ${agent.id}`);
    return { id: agent.id ?? 'unknown-id', name: agent.name ?? 'unknown-name' };
  } catch (error: any) {
    console.error('❌ Error creating agent:', error.message);
    throw error;
  }
}
