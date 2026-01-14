import { homedir } from "os";
import { join } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { AppConfig } from "../types/index";

const CONFIG_FILE = join(homedir(), ".yt-transcript-config.json");

export const configManager = {
    getConfig: (): AppConfig => {
        if (!existsSync(CONFIG_FILE)) {
            return {};
        }
        try {
            return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
        } catch {
            return {};
        }
    },

    saveConfig: (config: AppConfig) => {
        writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    },

    setApiKey: (apiKey: string) => {
        const config = configManager.getConfig();
        config.geminiApiKey = apiKey;
        configManager.saveConfig(config);
    },

    getApiKey: (): string => {
        const config = configManager.getConfig();
        return config.geminiApiKey || process.env.GEMINI_API_KEY || "";
    },
};
