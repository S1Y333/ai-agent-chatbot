<!-- Start the app -->
npm install
npm run build
npm start

<!-- create an agent -->
http://localhost:8080/create-agent

# body parameters
 {
    "model": "gpt-4o",
    "name": "my-ai-agent-hackathon",
    "instructions": "You are a helpful AI assistant for a hackathon."
  }

<!-- Utilities -->

 Azure AI Foundry SDK

aiClient.ts ->  initialize the AIProjectsClient
chatAgent.ts -> send chat stream request directly 
streamAgent.ts -> reusable function to stream agent#   a i - a g e n t - c h a t b o t  
 