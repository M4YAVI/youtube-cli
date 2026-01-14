# 🚀 Quick Start Guide

## 1️⃣ Get Your API Key

Visit [Google AI Studio](https://aistudio.google.com/app/apikeys) and create a new API key.

## 2️⃣ Configure the CLI

```bash
bun run src/main.ts config --set-key "YOUR_API_KEY_HERE"
```

## 3️⃣ Test with a Simple Fetch

```bash
# Fetch a transcript (this video has captions)
bun run src/main.ts fetch "https://www.youtube.com/watch?v=jNQXAC9IVRw"
```

## 4️⃣ Try AI Generation

```bash
# Generate transcript with Gemini if captions don't exist
bun run src/main.ts fetch "https://www.youtube.com/watch?v=VIDEO_ID" --generate
```

## 5️⃣ Save to File

```bash
# Save as text
bun run src/main.ts fetch "https://www.youtube.com/watch?v=jNQXAC9IVRw" -o transcript.txt

# Save as JSON
bun run src/main.ts fetch "https://www.youtube.com/watch?v=jNQXAC9IVRw" -o data.json -f json

# Save as Markdown
bun run src/main.ts fetch "https://www.youtube.com/watch?v=jNQXAC9IVRw" -o notes.md -f md
```

## 6️⃣ Batch Process Multiple Videos

```bash
# Use the example file
bun run src/main.ts batch example-urls.txt -d ./transcripts

# Or create your own
echo "https://youtube.com/watch?v=VIDEO_1
https://youtube.com/watch?v=VIDEO_2" > my-videos.txt

bun run src/main.ts batch my-videos.txt -g -d ./output
```

## 📋 Common Commands

```bash
# Show help
bun run src/main.ts --help

# View config
bun run src/main.ts config

# Quick fetch (copies to clipboard)
bun run src/main.ts fetch "YOUTUBE_URL"

# Fetch with AI fallback
bun run src/main.ts fetch "YOUTUBE_URL" -g

# Save to specific location
bun run src/main.ts fetch "YOUTUBE_URL" -o ./transcripts/video.txt
```

## 🎯 Pro Tips

1. **Clipboard Auto-Copy**: Transcripts are automatically copied to your clipboard!
2. **Debug Mode**: Set `DEBUG=true` in `.env` for detailed logs
3. **Batch Processing**: Use `-g` flag to generate missing transcripts with AI
4. **Format Options**: Choose `txt`, `json`, or `md` based on your needs

## ⚡ NPM Scripts

For convenience, you can use these shortcuts:

```bash
bun run dev          # Run the CLI
bun run fetch        # Quick fetch command
bun run batch        # Quick batch command
bun run config       # Quick config command
bun run help         # Show help
```

## 🐛 Troubleshooting

### "yt-dlp not found"
```bash
pip install yt-dlp
```

### "API key not found"
```bash
bun run src/main.ts config --set-key "YOUR_KEY"
```

### "No transcript available"
Add the `--generate` flag to use Gemini AI:
```bash
bun run src/main.ts fetch "URL" --generate
```

---

**Ready to go! 🎉**
