#!/usr/bin/env bun

import chalk from "chalk";
import { getTranscript, extractVideoId } from "./services/transcript.service";
import { geminiService } from "./services/gemini.service";
import { configManager } from "./utils/config";
import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const HELP = `
${chalk.bold.cyan("═══════════════════════════════════════════")}
${chalk.bold.cyan("  YouTube Transcript Extractor v2.1")}
${chalk.bold.cyan("═══════════════════════════════════════════")}

${chalk.yellow("USAGE:")}
  yt <command> [options]
  yt <URL> [options]

${chalk.yellow("COMMANDS:")}
  config --set-key <key>   Set your Gemini API key
  
${chalk.yellow("OPTIONS:")}
  -o, --output <file>     Save to file
  -f, --format <fmt>      Format: txt, json (default: txt)
  -g, --generate          Generate with Gemini if captions missing
  --api-key <key>         Use specific API key
  -h, --help              Show help

${chalk.yellow("EXAMPLES:")}
  yt "https://youtube.com/watch?v=123"
  yt "https://youtube.com/watch?v=123" -g
  yt config --set-key "AIzaSy..."
`;

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
        console.log(HELP);
        process.exit(0);
    }

    const firstArg = args[0];

    // Handle CONFIG command
    if (firstArg === "config") {
        if (args[1] === "--set-key" && args[2]) {
            configManager.setApiKey(args[2]);
            console.log(chalk.green("\n✅ API Key saved successfully!\n"));
            process.exit(0);
        } else {
            console.log(chalk.red("\n❌ usage: yt config --set-key <YOUR_API_KEY>\n"));
            process.exit(1);
        }
    }

    // Handle URL (Fetch/Generate)
    const url = firstArg;
    const options: any = {
        output: undefined,
        format: "txt",
        generate: false,
        apiKey: undefined,
    };

    for (let i = 1; i < args.length; i++) {
        if (args[i] === "-o" || args[i] === "--output") options.output = args[++i];
        else if (args[i] === "-f" || args[i] === "--format") options.format = args[++i];
        else if (args[i] === "-g" || args[i] === "--generate") options.generate = true;
        else if (args[i] === "--api-key") options.apiKey = args[++i];
    }

    try {
        const videoId = extractVideoId(url);
        console.log(chalk.blue(`\n📥 Processing: ${url}`));

        let transcript = "";
        let source = "";

        try {
            // 1. Try fetching standard captions
            transcript = await getTranscript(url);
            source = "YouTube Captions";
        } catch (err: any) {
            // 2. If failed and generate flag is ON, try Gemini
            if (options.generate) {
                console.log(chalk.yellow("⚠ No captions found. Switching to Gemini AI generation..."));

                const apiKey = options.apiKey || configManager.getApiKey();
                if (!apiKey) {
                    throw new Error("Gemini API key required for generation. Use --api-key or 'yt config --set-key'");
                }

                const audioPath = await geminiService.downloadAudio(videoId);
                transcript = await geminiService.generateTranscript(audioPath, apiKey);
                source = "Gemini AI (Generated)";
            } else {
                throw new Error("No captions found. Use --generate (-g) to create one with AI.");
            }
        }

        // Success Output
        console.log(chalk.cyan("═".repeat(70)));
        console.log(chalk.bold(`Source: ${source}`));
        console.log(chalk.dim("─".repeat(70)));
        console.log(transcript.substring(0, 1000) + (transcript.length > 1000 ? "..." : ""));
        console.log(chalk.cyan("═".repeat(70)));

        // Clipboard
        try {
            if (process.platform === "win32") {
                const proc = require("child_process").spawn("clip");
                proc.stdin.write(transcript);
                proc.stdin.end();
            } else if (process.platform === "darwin") {
                execSync(`echo "${transcript}" | pbcopy`);
            } else if (process.platform === "linux") {
                execSync(`echo -n "${transcript}" | xclip -selection clipboard`);
            }
            console.log(chalk.green("✓ Copied to clipboard!"));
        } catch {
            // Silent fail for clipboard 
        }

        // File Output
        if (options.output) {
            mkdirSync(dirname(options.output) || ".", { recursive: true });
            let content = transcript;
            if (options.format === "json") {
                content = JSON.stringify({ url, source, transcript }, null, 2);
            }
            writeFileSync(options.output, content, "utf-8");
            console.log(chalk.green(`✓ Saved to: ${options.output}`));
        }

        console.log(chalk.green("\n✅ Done!"));

    } catch (error: any) {
        console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
        process.exit(1);
    }
}

main();
