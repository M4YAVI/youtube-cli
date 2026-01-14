import chalk from "chalk";

export const logger = {
    info: (msg: string) => console.log(chalk.blue("ℹ"), msg),
    success: (msg: string) => console.log(chalk.green("✓"), msg),
    error: (msg: string) => console.error(chalk.red("✗"), msg),
    warn: (msg: string) => console.warn(chalk.yellow("⚠"), msg),
    debug: (msg: string) => {
        if (process.env.DEBUG === "true") {
            console.log(chalk.gray(`[DEBUG] ${msg}`));
        }
    },
    loading: (msg: string) => process.stdout.write(chalk.cyan(`○ ${msg}\r`)),
    clearLine: () => process.stdout.write("\r\x1b[K"),
};
