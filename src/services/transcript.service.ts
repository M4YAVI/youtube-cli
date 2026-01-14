import { fetchTranscript } from "youtube-transcript-plus";
import chalk from "chalk";

async function getTranscript(videoUrl: string): Promise<string> {
    const videoId = extractVideoId(videoUrl);

    try {
        console.log(chalk.blue(`📝 Fetching transcript...`));

        const transcript = await fetchTranscript(videoId, {
            lang: 'en',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });

        if (!transcript || transcript.length === 0) {
            throw new Error("No transcript segments found");
        }

        // Combine all transcript segments into a single string
        const text = transcript.map((segment: any) => segment.text).join(" ");

        console.log(chalk.green(`✓ Transcript fetched successfully!`));
        return text;

    } catch (error: any) {
        // Try without language specification as fallback
        try {
            const transcript = await fetchTranscript(videoId, {
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            });

            if (transcript && transcript.length > 0) {
                const text = transcript.map((segment: any) => segment.text).join(" ");
                console.log(chalk.green(`✓ Transcript fetched successfully!`));
                return text;
            }
        } catch { }

        throw new Error(`No transcript available: ${error.message}`);
    }
}

function extractVideoId(url: string): string {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    throw new Error("Invalid YouTube URL");
}

export { getTranscript, extractVideoId };
