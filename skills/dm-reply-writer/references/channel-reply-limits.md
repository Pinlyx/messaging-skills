# Channel limits and reply budgets

## Platform limits (sourced)

Source data: `channels/*.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), last verified 2026-11-20.

| Channel | Text limit | Quick replies or buttons | Official source |
| --- | --- | --- | --- |
| WhatsApp | 4,096 characters (free-form text); media caption 1,024 | Reply buttons: up to 3, label 20 characters, body 1,024; list: up to 10 rows | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/text-messages and https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/interactive-reply-buttons-messages |
| Instagram | Under 1,000 characters and 1,000 bytes of UTF-8 | Quick replies: up to 13, 20 characters each, plain text, not on desktop | https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/send-message |
| Messenger | 2,000 characters (UTF-8) | Quick replies: up to 13, 20 characters each | https://developers.facebook.com/documentation/business-messaging/messenger-platform/reference/messenger-platform-send-api |
| Telegram | 1 to 4,096 characters after entity parsing; captions 1,024 | Inline callback data 1 to 64 bytes | https://core.telegram.org/bots/api#sendmessage |
| X | No maximum is stated in the current reference (it names a "text too long" error without a number) | One media attachment per DM | https://docs.x.com/x-api/direct-messages/create-dm-message-by-participant-id |

### The byte rule on Instagram

1,000 bytes is the binding limit for text that is not plain ASCII. In UTF-8, Turkish letters such as ç, ş, ğ, ı take 2 bytes, Cyrillic and Greek letters take 2 bytes, Arabic takes 2 bytes, and most Chinese, Japanese and Korean characters take 3 bytes. A Russian reply therefore fits roughly 500 characters, a Chinese one roughly 330. Emoji take 4 bytes. Measure bytes, not characters, before sending on Instagram.

## Style budgets (conventions, not platform limits)

The `dm-bench` benchmark scores replies against these length budgets. They are editorial targets for a DM that is easy to read on a phone, chosen by the benchmark, not numbers published by the platforms:

| Channel | dm-bench reply budget |
| --- | --- |
| X | 280 characters |
| Instagram | 600 characters |
| WhatsApp, Messenger | 700 characters |
| Telegram, live chat | 900 characters |

Use them as a default; go longer only when the customer needs the detail (an itinerary, step-by-step instructions), and then break it into short paragraphs.

## Formatting

DM channels render plain text. Avoid markdown tables, headings, `**bold**` markers and `[text](url)` links in replies unless the channel renders them. Put the URL on its own line.
