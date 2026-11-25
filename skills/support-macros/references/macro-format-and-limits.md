# Macro format and channel limits

## Macro file format

One macro is one JSON object (or one YAML block). Keep a file per language or one file with all languages, as long as every macro has an `id` that is the same across languages.

```json
{
  "id": "hours_en",
  "intent": "opening hours",
  "language": "en",
  "text": {
    "default": "Hi {first_name}! We are open {hours_summary}. Is there anything I can help you with?",
    "x": "We are open {hours_summary}."
  },
  "variables": {
    "first_name": {"source": "contact.first_name", "fallback": "there"},
    "hours_summary": {"source": "settings.hours_summary"}
  },
  "facts_owner": "operations",
  "handoff": false,
  "last_reviewed": "2026-11-26",
  "reviewed_by": "name"
}
```

## Byte check (Instagram)

```js
const bytes = (s) => new TextEncoder().encode(s).length;
const ok = (s) => s.length < 1000 && bytes(s) <= 1000; // Instagram: characters and UTF-8 bytes
```

Run it on the text after variables are filled with realistic longest values (a long name, a long address).

## Limits by channel

Source data: `channels/*.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), last verified 2026-11-20.

| Channel | Text | Buttons or quick replies | Official source |
| --- | --- | --- | --- |
| WhatsApp | 4,096 characters; caption 1,024 | Reply buttons: up to 3, label up to 20 characters; list rows up to 10, row title up to 24 characters | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/text-messages and https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/interactive-reply-buttons-messages and https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/interactive-list-messages |
| Instagram | Under 1,000 characters and 1,000 UTF-8 bytes | Quick replies: up to 13, label up to 20 characters, plain text | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/send-message and https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/quick-replies |
| Messenger | 2,000 characters (UTF-8) | Quick replies: up to 13, label up to 20 characters | https://developers.facebook.com/documentation/business-messaging/messenger-platform/reference/messenger-platform-send-api and https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages/quick-replies |
| Telegram | 1 to 4,096 characters after entity parsing; caption 1,024 | Callback data 1 to 64 bytes | https://core.telegram.org/bots/api#sendmessage and https://core.telegram.org/bots/api#inlinekeyboardbutton |
| X | No maximum stated in the current reference | One media attachment per DM | https://docs.x.com/x-api/direct-messages/create-dm-message-by-participant-id |

WhatsApp template body, header, footer and button limits are not in the data: use the template editor.

## Validation through the rules server

```
npx -y -p messaging-rules messaging-rules-mcp
```

The server exposes `validate_message`. In code: `validateMessage('instagram', { text })` returns `{ ok, problems }` with limits and sources. Lengths are counted in UTF-16 code units, which never undercounts characters (an emoji counts as 2); Instagram's byte limit is counted in UTF-8.
