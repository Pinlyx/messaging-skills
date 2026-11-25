# Telegram Bot API limits used by this skill

Source data: `channels/telegram.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), read from Bot API 10.4 (November 9, 2026), last verified 2026-11-20. Telegram marks upload limits as subject to change. Megabytes are converted as 1 MB = 1,000,000 bytes.

| Rule | Value | Official source |
| --- | --- | --- |
| Starting a conversation | Bots cannot start conversations; the user must message the bot or add it to a group | https://core.telegram.org/bots |
| Text | 1 to 4,096 characters after entities parsing | https://core.telegram.org/bots/api#sendmessage |
| Caption | Up to 1,024 characters (photo, video, audio, document, animation, voice) | https://core.telegram.org/bots/api#sendphoto |
| Album | 2 to 10 items with sendMediaGroup | https://core.telegram.org/bots/api#sendmediagroup |
| Photo | 10 MB upload, 5 MB by URL; width plus height at most 10,000; aspect ratio at most 20 | https://core.telegram.org/bots/api#sendphoto |
| Video, audio, voice, document, animation | 50 MB upload, 20 MB by URL | https://core.telegram.org/bots/api#sendvideo and https://core.telegram.org/bots/api#senddocument |
| Voice | OGG encoded with OPUS, or mp3, or m4a | https://core.telegram.org/bots/api#sendvoice |
| Download by bot | 20 MB with getFile | https://core.telegram.org/bots/api#getfile |
| Local Bot API Server | Uploads up to 2,000 MB; downloads without size limit | https://core.telegram.org/bots/api#using-a-local-bot-api-server |
| Re-sending by file_id | No size limit for files already on Telegram | https://core.telegram.org/bots/api#sending-files |
| Inline button callback_data | 1 to 64 bytes | https://core.telegram.org/bots/api#inlinekeyboardbutton |
| answerCallbackQuery text | Up to 200 characters | https://core.telegram.org/bots/api#answercallbackquery |
| Single chat | Avoid more than about 1 message per second | https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this |
| Group | No more than 20 messages per minute | same page |
| Bulk notifications | About 30 messages per second overall | same page |
| Paid broadcasts | Up to 1,000 messages per second when enabled in @BotFather | https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bots-subscribers-at-once |

## Not in the data

- Maximum number of buttons or rows in an inline keyboard.
- The exact retry wait after an HTTP 429 (the API returns it in the error response: read it from there).
- Webhook ports and certificate requirements (see https://core.telegram.org/bots/api#setwebhook).
