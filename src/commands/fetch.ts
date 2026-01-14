import { transcriptService } from "../services/transcript.service";
import { geminiService } from "../services/gemini.service";
import { configManager } from "../utils/config";
import { logger } from "../utils/logger";
import { Transcript, TranscriptOptions } from "../types/index";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { execSync } from "child_process";

export async function fetchCommand(url: string, options: TranscriptOptions) {
    try {
        const videoId = transcriptService.extractVideoId(url);
        logger.info(`📺 Processing video: ${videoId}`);

        const metadata = await transcriptService.getVideoMetadata(videoId);
        logger.success(`Title: ${metadata.title}`);

        let text = await transcriptService.fetchYoutubeTranscript(videoId);
        let source: "YouTube" | "Gemini 2.5 Flash" = "YouTube";

        if (!text) {
            if (!options.generateIfMissing) {
                logger.error(
                    "No transcript available. Use --generate to create with Gemini."
                );
                process.exit(1);
            }

            const apiKey = options.geminiApiKey || configManager.getApiKey();
            if (!apiKey) {
                logger.error(
                    "Gemini API key not found. Set GEMINI_API_KEY or use 'config --set-key'"
                );
                process.exit(1);
            }

            const audioPath = await geminiService.downloadAudio(videoId);
            text = await geminiService.generateTranscript(audioPath, apiKey);
            source = "Gemini 2.5 Flash";
        }

        const transcript: Transcript = {
            videoId,
            title: metadata.title,
            duration: metadata.duration,
            text,
            source,
            url,
        };

        logger.success("✅ Transcript ready!");
        console.log("\n" + "=".repeat(60));
        console.log(`📋 ${transcript.title}`);
        console.log(`⏱️  Duration: ${formatDuration(transcript.duration)}`);
        console.log(`📌 Source: ${transcript.source}`);
        console.log("=".repeat(60) + "\n");
        console.log(transcript.text);
        console.log("\n" + "=".repeat(60));

        // Copy to clipboard
        copyToClipboard(transcript.text);

        // Save to file if requested
        if (options.output) {
            const dir = dirname(options.output);
            mkdirSync(dir, { recursive: true });

            let content = transcript.text;
            if (options.format === "json") {
                content = JSON.stringify(transcript, null, 2);
            } else if (options.format === "md") {
                content = `# ${transcript.title}\n\n⏱️ Duration: ${formatDuration(transcript.duration)}\n📌 Source: ${transcript.source}\n\n${transcript.text}`;
            }

            writeFileSync(options.output, content, "utf-8");
            logger.success(`📁 Saved to: ${options.output}`);
        }
    } catch (error: any) {
        logger.error(error.message);
        process.exit(1);
    }
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

function copyToClipboard(text: string) {
    try {
        if (process.platform === "win32") {
            execSync('echo ' + JSON.stringify(text) + ' | clip');
        } else if (process.platform === "darwin") {
            execSync('echo -n ' + JSON.stringify(text) + ' | pbcopy');
        } else {
            execSync('echo -n ' + JSON.stringify(text) + ' | xclip -selection clipboard');
        }
        logger.success("📋 Copied to clipboard!");
    } catch {
        logger.warn("Could not copy to clipboard");
    }
}
