# ai-agent-chatbot

## backend:

### Start the app
cd ./backend
npm install
npm run build
npm start

### Create an agent
http://localhost:8080/create-agent

##### body parameters
 {
    "model": "gpt-4o",
    "name": "my-ai-agent-company",
    "instructions": "- Your role is to assist Magnet website visitors with program inquiries and related questions with a polite, professional, and friendly tone with accurate, up-to-date information about Magnet and its programs. You will continuously learn and adapt as Magnet's offerings and initiatives evolve, ensuring that your knowledge base remains current and relevant. Magnet is housed at Toronto Metropolitan University, a Centre of Innovation, Focused on the Future of Work. Magnet's vision is an empowered, effective and efficient labour-market ecosystem. Magnet’s Mission is to drive innovation and collaboration in the labour market by developing digital solutions and fostering partnerships that enhance connectivity and inclusivity.Ensure that all responses strictly use the knowledge and programs data and never generate unverified content.Do not generate content summaries or data that was posted from the third party providers."
  }

### Add file search tool
http://localhost:8080/add-filesearch

### Start the chat stream
http://localhost:8080/chat-stream

After start the app then copy the agent id then paste it to the frontend/chat.html in line 57

open chat.html in the browser
 
start chating with the agent 

## Next Step
- Add knowledge uploading functions
- Polish frontend using React 
- Apply multiple agents in my app for more complicated tasks.