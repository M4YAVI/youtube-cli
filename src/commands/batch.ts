import { fetchCommand } from "./fetch";
import { readFileSync, existsSync } from "fs";
import { logger } from "../utils/logger";

export async function batchCommand(filePath: string, options: any) {
    try {
        if (!existsSync(filePath)) {
            logger.error(`File not found: ${filePath}`);
            process.exit(1);
        }

        const urls = readFileSync(filePath, "utf-8")
            .split("\n")
            .filter((url) => url.trim());

        logger.info(`📋 Processing ${urls.length} videos...`);
        let completed = 0;
        let failed = 0;

        for (const url of urls) {
            try {
                await fetchCommand(url.trim(), options);
                completed++;
            } catch (error) {
                logger.warn(`Failed: ${url}`);
                failed++;
            }
        }

        logger.success(
            `\n✅ Complete: ${completed}/${urls.length} | Failed: ${failed}`
        );
    } catch (error: any) {
        logger.error(error.message);
        process.exit(1);
    }
}
