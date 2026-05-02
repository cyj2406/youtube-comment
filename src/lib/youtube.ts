import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getVideoComments(videoId: string, maxResults = 100) {
  try {
    const response = await youtube.commentThreads.list({
      part: ["snippet"],
      videoId: videoId,
      maxResults: maxResults,
      order: "relevance",
    });

    return response.data.items?.map((item) => ({
      id: item.id,
      text: item.snippet?.topLevelComment?.snippet?.textDisplay,
      author: item.snippet?.topLevelComment?.snippet?.authorDisplayName,
      publishedAt: item.snippet?.topLevelComment?.snippet?.publishedAt,
      likeCount: item.snippet?.topLevelComment?.snippet?.likeCount,
    })) || [];
  } catch (error) {
    console.error("Error fetching YouTube comments:", error);
    throw error;
  }
}

export function extractVideoId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : url;
}
