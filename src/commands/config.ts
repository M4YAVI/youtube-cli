import { configManager } from "../utils/config";
import { logger } from "../utils/logger";
import { homedir } from "os";

export async function configCommand(options: any) {
    try {
        if (options.setKey) {
            configManager.setApiKey(options.setKey);
            logger.success("✅ API key saved!");
            logger.info(
                `Config location: ${homedir()}/.yt-transcript-config.json`
            );
            return;
        }

        const config = configManager.getConfig();
        logger.info("📋 Current Configuration:");
        console.log(JSON.stringify(config, null, 2));
    } catch (error: any) {
        logger.error(error.message);
        process.exit(1);
    }
}
