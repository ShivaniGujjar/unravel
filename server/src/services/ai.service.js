import 'dotenv/config';
import { ChatMistralAI } from "@langchain/mistralai"
import readline from "readline";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import { searchInternet } from './internet.service.js';
import * as z from "zod";



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
)


const agent = createAgent({
    model: mistralModel,
    tools: [ searchInternetTool ],
})


const systemPrompt = {
  role: "system",
  content: `You are a concise AI search assistant. 
  - Provide brief, direct answers unless the user asks for detail.
  - Use bullet points for readability.
  - If the answer is a simple fact, give it in 1-2 sentences.
  - Do not use conversational filler like "Here is what I found" or "I hope this helps."`
};




// We replace 'invoke' with 'stream'
export async function generateResponse(messages, onChunk) { 
  try {
    const lastUserMessage = messages[messages.length - 1]?.content;
    const internetData = await searchInternet(lastUserMessage);

    const systemPrompt = new SystemMessage(
      `Concise search assistant. Use max 3 sentences. Context: ${JSON.stringify(internetData?.results?.slice(0,2))}`
    );

    const langchainMessages = [
      systemPrompt,
      ...messages.map(m => m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content))
    ];

    // 🚀 STEP 1: Start the stream
    const stream = await mistralModel.stream(langchainMessages);

    let fullContent = "";

    // 🚀 STEP 2: Loop through every "chunk" (word/character) Mistral sends
    for await (const chunk of stream) {
      const content = chunk.content;
      
      // ✅ BUG FIX: Check if content actually exists before sending
      if (content) {
        fullContent += content;
        if (onChunk) {
          onChunk(content); 
        }
      }
    }

    return fullContent; // Return the final string to save in MongoDB later
  } catch (error) {
    console.error("AI Error:", error);
    return "Error generating response.";
  }
}



export async function generateChatTitle(message) {

    const response = await mistralModel.invoke([
        new SystemMessage("You are a helpful assistant that generates concise titles for conversations."),
        new HumanMessage(`Generate a concise title for the following conversation: ${message}`)


    ])
    return response.content
}

export async function testAi() {
    rl.question("Ask something: ", async (input) => {
        // 🚀 FIX: Use mistralModel
        const response = await mistralModel.invoke(input); 
        console.log("AI:", response.content);
        testAi();
    });
}




