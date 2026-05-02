import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { getVideoComments } from "@/lib/youtube";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return new Response("Missing videoId", { status: 400 });
    }

    const comments = await getVideoComments(videoId);
    console.log(`Fetched ${comments.length} comments for video: ${videoId}`);

    if (!comments || comments.length === 0) {
      return Response.json({ error: "No comments found" }, { status: 404 });
    }

    // Prepare text for analysis
    const commentTexts = comments.map(c => c.text).join("\n---\n");

    const result = await generateObject({
      model: google("gemini-3.1-flash-lite-preview"), 
      schema: z.object({
        sentimentDistribution: z.object({
          positive: z.number(),
          negative: z.number(),
          neutral: z.number(),
        }),
        keywords: z.array(z.string()),
        bigrams: z.array(z.object({
          source: z.string(),
          target: z.string(),
          value: z.number(),
        })).describe("Top meaningful word pairs for network visualization"),
        stats: z.object({
          totalAnalyzed: z.number(),
          averageLength: z.number(),
        }),
        analyzedComments: z.array(z.object({
          id: z.string(),
          sentiment: z.enum(["positive", "negative", "neutral"]),
          summary: z.string(),
        })),
      }),
      prompt: `Analyze the following YouTube comments and provide a detailed sentiment and keyword analysis.
      
      Comments:
      ${commentTexts.slice(0, 30000)} // Limiting to prevent token overflow
      
      Instructions:
      1. Calculate the overall sentiment distribution.
      2. Extract the top 10 most relevant keywords.
      3. Identify the top 10 meaningful bigram word pairs (e.g., "great video", "love this").
      4. Calculate basic stats like average comment length.
      5. Provide a sentiment and brief summary for each comment.
      `,
    });

    // Merge time data from original comments
    const timeSeriesMap: Record<string, any> = {};
    comments.forEach((c, index) => {
      const publishedDate = c.publishedAt ? new Date(c.publishedAt) : new Date();
      const date = publishedDate.toISOString().split('T')[0];
      if (!timeSeriesMap[date]) {
        timeSeriesMap[date] = { time: date, positive: 0, negative: 0, neutral: 0, count: 0 };
      }
      const analyzed = result.object.analyzedComments[index];
      if (analyzed) {
        timeSeriesMap[date][analyzed.sentiment]++;
      }
      timeSeriesMap[date].count++;
    });

    const timeSeriesData = Object.values(timeSeriesMap).sort((a, b) => a.time.localeCompare(b.time));

    return Response.json({
      ...result.object,
      timeSeriesData,
      rawComments: comments
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    return Response.json({ error: "Failed to analyze comments" }, { status: 500 });
  }
}
