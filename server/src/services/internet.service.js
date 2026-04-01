import { tavily as Tavily } from "@tavily/core";

// 🛡️ Guard: This prevents the app from crashing if the .env hasn't loaded yet
const getTavilyClient = () => {
    if (!process.env.TAVILY_API_KEY) {
        console.error("❌ ERROR: TAVILY_API_KEY is missing from .env");
        return null;
    }
    return new Tavily({ apiKey: process.env.TAVILY_API_KEY });
};

export const searchInternet = async (query) => {
    try {
        const client = getTavilyClient();
        if (!client) return { results: [] }; // Return empty results instead of crashing

        return await client.search(query, {
            maxResults: 5,
            searchDepth: "advanced",
        });
    } catch (error) {
        console.error("Tavily Search Failed:", error.message);
        return { results: [] }; // Return empty results so the AI can still answer
    }
};