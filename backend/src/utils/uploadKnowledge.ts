// src/utils/uploadKnowledge.ts
import { aiClient } from './aiClient'; // adjust path if needed
import * as fs from 'fs';
import * as path from 'path';

// const standards_file_path = "../instructions/knowledge.txt";

// export async function uploadKnowledgeFiles(agentId: string) {
//   try {
//        // 1. Upload the standards file
//        const standardsFilePath = path.join(__dirname, '..', 'instructions', 'knowledge.txt');

//        if (!fs.existsSync(standardsFilePath)) {
//          throw new Error(`The file ${standardsFilePath} does not exist.`);
//        }
   
//        const standardsFileBuffer = fs.readFileSync(standardsFilePath);
   
//        const uploadedFilePoller = await aiClient.agents.uploadFile({
         
//          name: 'knowledge.txt',
//          content: standardsFileBuffer,
//          contentType: 'text/plain',
//        }, purpose: "agents",);
   
//        const uploadedFile = await uploadedFilePoller.pollUntilDone();
//        console.log(`✅ Uploaded standards file, file ID: ${uploadedFile.id}`);
   
//        // 2. Create vector store using uploaded file
//        const vectorStorePoller = await aiClient.vectorStores.beginCreateVectorStoreAndPoll({
//          name: `vectorstore-for-agent-${agentId}`,
//          fileIds: [uploadedFile.id],
//        });
   
//        const vectorStore = await vectorStorePoller.pollUntilDone();
//        console.log(`✅ Created vector store, vector store ID: ${vectorStore.id}`);
   

//     return vectorStore.id;
//   } catch (error: any) {
//     console.error('❌ Error in uploading knowledge:', error.message);
//     throw error;
//   }
// }
