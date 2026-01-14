import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../utils/logger";
import { spawn } from "child_process";
import { existsSync, unlinkSync, readFileSync } from "fs";

async function downloadAudio(videoId: string): Promise<string> {
    const audioPath = `./temp_audio_${videoId}.mp3`;

    if (existsSync(audioPath)) {
        unlinkSync(audioPath);
    }

    return new Promise((resolve, reject) => {
        logger.loading("🎬 Downloading video audio...");

        const yt = spawn("yt-dlp", [
            `https://www.youtube.com/watch?v=${videoId}`,
            "-x",
            "--audio-format",
            "mp3",
            "--audio-quality",
            "128K",
            "-o",
            audioPath,
            "-q",
        ]);

        yt.on("close", (code) => {
            logger.clearLine();
            if (code === 0 && existsSync(audioPath)) {
                resolve(audioPath);
            } else {
                reject(new Error("Failed to download video audio"));
            }
        });

        yt.on("error", (err) => {
            logger.clearLine();
            reject(err);
        });
    });
}

async function generateTranscript(
    audioPath: string,
    apiKey: string
): Promise<string> {
    try {
        logger.loading("🤖 Generating transcript with Gemini 2.5 Flash...");

        const client = new GoogleGenerativeAI(apiKey);
        const audioBuffer = readFileSync(audioPath);
        const base64Audio = audioBuffer.toString("base64");

        const model = client.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
        });

        const response = await model.generateContent([
            {
                inlineData: {
                    mimeType: "audio/mpeg",
                    data: base64Audio,
                },
            },
            {
                text: "Provide a complete, accurate transcript of this audio. Include all spoken words, timestamps if possible, and maintain natural punctuation. Format as continuous text.",
            },
        ]);

        logger.clearLine();
        const transcript = response.response.text();

        if (existsSync(audioPath)) {
            unlinkSync(audioPath);
        }

        return transcript;
    } catch (error: any) {
        logger.clearLine();
        throw new Error(`Gemini generation failed: ${error.message}`);
    }
}

export const geminiService = {
    downloadAudio,
    generateTranscript,
};
