import {
    RunStreamEvent,
    MessageStreamEvent,
    ErrorEvent,
    DoneEvent,
    MessageDeltaChunk,
    MessageDeltaTextContent,
  } from '@azure/ai-projects';
  import { AIProjectsClient } from '@azure/ai-projects';
  import { Response } from 'express';
  
  export async function streamAgentResponse({
    client,
    res,
    agentId,
    message,
  }: {
    client: AIProjectsClient;
    res: Response;
    agentId: string;
    message: string;
  }) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.flushHeaders();
  
    const thread = await client.agents.createThread();
    await client.agents.createMessage(thread.id, { role: 'user', content: message });
  
    const stream = await client.agents.createRun(thread.id, agentId).stream();
  
    for await (const eventMessage of stream) {
      switch (eventMessage.event) {
        case MessageStreamEvent.ThreadMessageDelta: {
          const delta = eventMessage.data as MessageDeltaChunk;
          delta.delta.content.forEach((part) => {
            if (part.type === 'text') {
              const text = (part as MessageDeltaTextContent).text?.value || '';
              res.write(`data: ${text}\n\n`);
            }
          });
          break;
        }
        case RunStreamEvent.ThreadRunCompleted:
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
  }
  