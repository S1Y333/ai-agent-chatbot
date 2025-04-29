import { Request, Response } from 'express';
import {
  RunStreamEvent,
  MessageStreamEvent,
  ErrorEvent,
  DoneEvent,
  MessageDeltaChunk,
  MessageDeltaTextContent,
} from '@azure/ai-projects';
import { aiClient } from '../utils/aiClient'; 

export async function chatAgent(req: Request, res: Response) {
  const { agentId, message } = req.body;

  if (!agentId || !message) {
    return res.status(400).json({ error: 'agentId and message are required' });
  }

  try {
    // Set up SSE headers
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.flushHeaders();

    // Step 1: Create a thread
    const thread = await aiClient.agents.createThread();
   
    // Step 2: Send the user message
    await aiClient.agents.createMessage(thread.id, {
      role: 'user',
      content: message,
    });

    // Step 3: Create run and stream output
    const stream = await aiClient.agents.createRun(thread.id, agentId).stream();

    for await (const eventMessage of stream) {
      switch (eventMessage.event) {
        case MessageStreamEvent.ThreadMessageDelta: {
          const delta = eventMessage.data as MessageDeltaChunk;
          delta.delta.content.forEach((part) => {
            if (part.type === 'text') {
              const value = (part as MessageDeltaTextContent).text?.value || '';
              res.write(`data: ${value}\n\n`);
            }
          });
          break;
        }
        case RunStreamEvent.ThreadRunCompleted:
          console.log("Thread Run Completed");
          break;
        case DoneEvent.Done:
          res.write(`event: done\ndata: [DONE]\n\n`);
          res.end();
          break;
        case ErrorEvent.Error:
          res.write(`event: error\ndata: ${JSON.stringify(eventMessage.data)}\n\n`);
          res.end();
          break;
      }
    }
  } catch (err: any) {
    console.error('❌ Error in chatAgent:', err.message);
    res.write(`event: error\ndata: ${err.message}\n\n`);
    res.end();
  }
}

