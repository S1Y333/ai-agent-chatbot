import express from 'express';
import dotenv from 'dotenv';
import { createAgent } from './services/agentBuilder';
import bodyParser from 'body-parser';
import { chatAgent } from './services/chatAgent';
import { streamAgentResponse } from './services/streamAgent';
import { aiClient } from './utils/aiClient';
import cors from 'cors';
import { Request, Response } from 'express';
// import multer from 'multer';

// const upload = multer({ storage: multer.memoryStorage() });


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// define filesearch tool
const fileSearchTool = {
  type: "function", // REQUIRED
  function: {
    name: "search_files",
    description: "Search the uploaded knowledge files for relevant information.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query text to find inside the uploaded files.",
        },
      },
      required: ["query"],
    },
  },
};




//start the chat 
app.post('/chat-stream', async (req: Request, res: Response) => {
  const { agentId, message } = req.body;
  await streamAgentResponse({ client: aiClient, res, agentId, message });
});

app.post('/create-agent', async (req, res) => {
  const { model, name, instructions } = req.body;

  if (!model || !name || !instructions) {
    return res.status(400).json({ error: 'Model, name, and instructions are required.' });
  } 

  try {
    const agent = await createAgent(model, name, instructions);
    return res.status(201).json(agent);
  } catch (error) {
    console.error('Error creating agent:', error);
    return res.status(500).json({ error: 'Failed to create agent.' });
  }

});

// add knowledge files to the agent
// app.post('/add-knowledge-files', upload.array('files'), async (req, res) => {
//   const agentId = req.body.agentId;
//   const files = req.files as Express.Multer.File[];

//   if (!agentId || !files || files.length === 0) {
//     return res.status(400).json({ error: 'agentId and at least one file are required' });
//   }

//   try {
//     // Convert multer files to Azure-compatible format
//     const formattedFiles = files.map((file) => ({
//       content: file.buffer,            // Buffer content
//       contentType: file.mimetype,       // e.g., 'text/plain', 'application/pdf'
//       name: file.originalname,          // File name
//     }));

//     await aiClient.agents.knowledge.addKnowledgeFiles(agentId, formattedFiles);

//     res.json({ message: '✅ Knowledge files added to agent!' });
//   } catch (error: any) {
//     console.error('❌ Failed to add knowledge files:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// add filesearch tool, next step: add any tool to the agent
app.post ('/add-filesearch', async (req, res) => {
  const { agentId } = req.body;

  if (!agentId) {
    return res.status(400).json({ error: 'agentId is required' });
  }

  try {
    await aiClient.agents.updateAgent(agentId, {
      tools: [fileSearchTool],
    });

    res.json({ message: '✅ File search tool added to agent!' });
  } catch (error: any) {
    console.error('❌ Failed to add tool:', error.message);
    res.status(500).json({ error: error.message });
  }
  

});


app.get('/', (_req, res) => {
  res.send('Hello from TypeScript backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
