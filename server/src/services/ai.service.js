import 'dotenv/config';
import { ChatMistralAI } from "@langchain/mistralai"
import readline from "readline";
import { HumanMessage, SystemMessage ,AIMessage } from '@langchain/core/messages';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
})


export async function generateResponse(messages) {

    const response = await mistralModel.invoke(
        messages.map(msg => {
            if (msg.role === 'user') {
                return new HumanMessage(msg.content);
            }
            if (msg.role === 'ai') {
                return new AIMessage(msg.content); // ✅ fixed typo
            }
            if (msg.role === 'system') {
                return new SystemMessage(msg.content);
            }
        })
    );

    return response.content;
}



export async function generateChatTitle(message) {

    const response = await mistralModel.invoke([
        new SystemMessage("You are a helpful assistant that generates concise titles for conversations."),
        new HumanMessage(`Generate a concise title for the following conversation: ${message}`)


    ])
    return response.text
}

export async function testAi() {

    rl.question("Ask something: ", async (input) => {

        const response = await model.invoke(input);

        console.log("AI:", response.content);

        testAi()
        // rl.close();
    });
}




