import { AIProjectsClient } from '@azure/ai-projects';
import { DefaultAzureCredential } from '@azure/identity';
import dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env['AI_FOUNDRY_PROJECT_CONNECTION_STRING'] || '<project connection string>';

export const aiClient = AIProjectsClient.fromConnectionString(
  connectionString,
  new DefaultAzureCredential()
);
