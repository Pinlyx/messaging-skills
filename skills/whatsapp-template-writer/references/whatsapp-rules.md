# WhatsApp rules used by this skill

Source data: `channels/whatsapp.json` of [messaging-rules](https://github.com/Pinlyx/messaging-rules), last verified 2026-11-20. Every row links the official page. Platform rules change; check the page before relying on a value.

| Rule | Value | Official source |
| --- | --- | --- |
| Opt-in | You can only message WhatsApp users who have opted in to receiving messages from you. | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages |
| Templates are the only message type outside a customer service window | Template messages only | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview |
| Customer service window | 24 hours, started and restarted by every user message or call | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages |
| Template categories | marketing, utility, authentication | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview |
| Mixed or unclear content | Categorized as marketing | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization |
| Template name | Up to 512 characters, lowercase alphanumeric characters and underscores | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview |
| Template creation rate | 100 templates per messaging account per hour | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview |
| Messaging limit (unique recipients outside a window, moving 24 hours) | New portfolio 250; tiers 2,000 (scaling path), 10,000, 100,000, unlimited | https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits |
| Throughput per number | 80 messages per second by default, up to 1,000 by automatic upgrade (inbound and outbound together) | https://developers.facebook.com/documentation/business-messaging/whatsapp/throughput |
| Free-form text body | 4,096 characters | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/text-messages |
| Media caption | 1,024 characters | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/image-messages |
| Interactive reply buttons (not templates) | up to 3 buttons, label up to 20 characters, body up to 1,024, footer up to 60 | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/interactive-reply-buttons-messages |
| Interactive list (not templates) | up to 10 rows, row title up to 24 characters, row description up to 72, list button label up to 20 | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/interactive-list-messages |

## Not in the rules data (do not quote from memory)

- Maximum lengths of template header, body, footer and button text.
- Maximum number of buttons on a template, and which combinations are allowed.
- Per-user marketing template frequency caps.
- The exact criteria Meta uses to recategorize a template.
- Pricing per category.

For these, open the template categorization and templates pages linked above, or read the validation message in WhatsApp Manager. If a number is needed in a deliverable, write "check the live editor" instead of guessing.
