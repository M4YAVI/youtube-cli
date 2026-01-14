# YouTube Transcript CLI 🎬

A powerful CLI tool to fetch YouTube transcripts with AI-powered generation using Google's Gemini 2.0 Flash.

## ✨ Features

- ✅ **Fetch YouTube Transcripts** - Extract existing transcripts from any YouTube video
- 🤖 **AI Generation** - Generate transcripts using Gemini 2.0 Flash when none exist
- 📋 **Auto Clipboard** - Automatically copies transcripts to clipboard
- 📁 **Multiple Formats** - Export as TXT, JSON, or Markdown
- 🔄 **Batch Processing** - Process multiple videos from a file
- ⚙️ **Config Management** - Store API keys securely
- 🎨 **Beautiful CLI** - Colored output with progress indicators

## 🚀 Installation

```bash
# Clone or navigate to project
cd yt-transcript-cli

# Install dependencies
bun install

# Install yt-dlp (if not already installed)
pip install yt-dlp
```

## 🔑 Setup API Key

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikeys)

```bash
# Option 1: Set via config command
bun run src/main.ts config --set-key "YOUR_API_KEY_HERE"

# Option 2: Set environment variable
export GEMINI_API_KEY="YOUR_API_KEY_HERE"

# Option 3: Create .env file
cp .env.example .env
# Edit .env and add your key
```

## 📖 Usage

### Fetch a transcript

```bash
# Fetch existing transcript
bun run src/main.ts fetch "https://youtube.com/watch?v=dQw4w9WgXcQ"

# Generate with Gemini if not available
bun run src/main.ts fetch "https://youtube.com/watch?v=VIDEO_ID" --generate

# Save to file
bun run src/main.ts fetch "https://youtube.com/watch?v=VIDEO_ID" -o transcript.txt

# Save as JSON
bun run src/main.ts fetch "https://youtube.com/watch?v=VIDEO_ID" -o data.json -f json

# Save as Markdown
bun run src/main.ts fetch "https://youtube.com/watch?v=VIDEO_ID" -o README.md -f md
```

### Batch processing

```bash
# Create a file with URLs (one per line)
echo "https://youtube.com/watch?v=VIDEO_ID_1
https://youtube.com/watch?v=VIDEO_ID_2
https://youtube.com/watch?v=VIDEO_ID_3" > urls.txt

# Process all videos
bun run src/main.ts batch urls.txt -g -d ./transcripts
```

### Configuration

```bash
# View current config
bun run src/main.ts config

# Set API key
bun run src/main.ts config --set-key "YOUR_API_KEY"
```

## 📝 Commands

| Command | Description |
|---------|-------------|
| `fetch <url>` | Fetch transcript from YouTube video |
| `batch <file>` | Process multiple URLs from file |
| `config` | Manage configuration |

## 🎛️ Options

### Fetch Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--generate` | `-g` | Generate using Gemini if not available |
| `--output <path>` | `-o` | Save transcript to file |
| `--format <fmt>` | `-f` | Output format: txt, json, md |
| `--api-key <key>` | | Gemini API key |

### Batch Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--output-dir <dir>` | `-d` | Output directory for transcripts |
| `--format <fmt>` | `-f` | Output format: txt, json, md |
| `--generate` | `-g` | Generate using Gemini |
| `--api-key <key>` | | Gemini API key |

### Config Options

| Option | Description |
|--------|-------------|
| `--set-key <key>` | Set Gemini API key |

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Ultra-fast JavaScript runtime
- **Language**: TypeScript - Type-safe development
- **AI**: Google Gemini 2.0 Flash - Advanced transcript generation
- **CLI**: Chalk - Beautiful terminal output
- **Validation**: Zod - Schema validation
- **Video**: yt-dlp - YouTube audio extraction

## 📂 Project Structure

```
yt-transcript-cli/
├── src/
│   ├── main.ts                    # CLI entry point
│   ├── commands/
│   │   ├── fetch.ts              # Fetch command
│   │   ├── batch.ts              # Batch command
│   │   └── config.ts             # Config command
│   ├── services/
│   │   ├── transcript.service.ts # YouTube transcript fetching
│   │   └── gemini.service.ts     # Gemini AI integration
│   ├── utils/
│   │   ├── logger.ts             # Colored logging
│   │   └── config.ts             # Config management
│   └── types/
│       └── index.ts              # TypeScript types
├── bunfig.toml                    # Bun configuration
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
└── .env.example                   # Environment template
```

## 🔍 How It Works

1. **Extract Video ID** - Parses YouTube URL to get video ID
2. **Fetch Metadata** - Retrieves video title, duration, etc.
3. **Try YouTube Transcript** - Attempts to fetch existing transcript
4. **Fallback to Gemini** - If no transcript exists and `--generate` is used:
   - Downloads audio using yt-dlp
   - Sends to Gemini 2.0 Flash for transcription
   - Cleans up temporary files
5. **Output** - Displays transcript and optionally saves to file
6. **Clipboard** - Automatically copies to clipboard

## 🐛 Troubleshooting

### yt-dlp not found
```bash
pip install yt-dlp
```

### API key errors
```bash
# Check if key is set
bun run src/main.ts config

# Set the key
bun run src/main.ts config --set-key "YOUR_KEY"
```

### Clipboard not working
The clipboard feature requires:
- **Windows**: `clip` (built-in)
- **macOS**: `pbcopy` (built-in)
- **Linux**: `xclip` (install with `apt install xclip`)

## 📄 License

MIT

## ⚡ All Commands Cheat Sheet (v2.1)

### 📥 basic Fetching
```bash
# Get transcript and copy to clipboard
yt "https://www.youtube.com/watch?v=VIDEO_ID"
```

### 🤖 AI Generation (Gemini 2.0)
If no captions exist, use `-g` to generate them with Google's Gemini 2.0 Flash (requires API key).

```bash
# 1. First, set your API key (one-time setup)
yt config --set-key "AIzaSy..."

# 2. Then generate transcript
yt "VIDEO_URL" -g
```

### � Saving & Formats
```bash
# Save to file
yt "VIDEO_URL" -o transcript.txt

# Save as JSON
yt "VIDEO_URL" -o data.json -f json
```

### ❓ Help
```bash
yt --help
```
