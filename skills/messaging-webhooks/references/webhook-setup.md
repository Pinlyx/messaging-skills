# Webhook setup notes

The channel rules data in `messaging-rules` covers sending limits and windows, not webhook mechanics. The mechanics below are the documented behavior implemented and tested in [unified-message](https://github.com/Pinlyx/unified-message) (see its README, "Verifying webhooks" and "Per-channel notes and limits"). Platform webhook pages change; confirm against the current developer documentation of each platform when something does not match.

## Meta (WhatsApp Cloud API, Instagram, Messenger)

Setup steps:

1. In the app's developer dashboard, add the product (WhatsApp, Messenger or Instagram) and open its webhook settings.
2. Enter the callback URL and a verify token you choose. Meta sends the GET handshake; answer with `hub.challenge`.
3. Subscribe to the fields you need (for example `messages` for WhatsApp, `messages` and `messaging_postbacks` for Messenger and Instagram).
4. Subscribe the specific account or page to the app where the product requires it.
5. Configure the app secret in your server; it signs every POST in `X-Hub-Signature-256`.

Payload notes from the parsers:

- WhatsApp: one body can hold several entries, changes, messages and statuses. Media arrives as a `mediaId`; fetch the URL with your access token, then download with the same token. Statuses cover sent, delivered, read, failed and deleted.
- Instagram: body has `object: "instagram"`. Attachment URLs are temporary CDN links; download what you need soon. Story replies carry the story id. Names and usernames are not in the webhook, only scoped ids. Comment and mention webhooks use the `changes` format.
- Messenger: body has `object: "page"`. Echoes arrive through `message_echoes` and must be marked. Delivery receipts are one status per message id; read receipts carry a watermark instead of an id. Use Page-scoped ids (PSID); app-scoped ids from Facebook Login do not work with the Messenger Platform.

## Telegram

Official method: `setWebhook` (https://core.telegram.org/bots/api#setwebhook). Parameters that matter: `url` (HTTPS), `secret_token` (returned to you in the `X-Telegram-Bot-Api-Secret-Token` header), `allowed_updates` (list the update types you handle, for example `message`, `callback_query`; reactions need `message_reaction` and an admin bot), `drop_pending_updates` (to discard the backlog). Use `getWebhookInfo` to read the last error and the pending count. While a webhook is set, polling with `getUpdates` is not available; delete the webhook to poll again.

## X (Account Activity API)

- CRC: Respond to GET `crc_token` with `{ "response_token": "sha256=<base64>" }`, an HMAC-SHA256 of the token keyed with the consumer secret.
- Signature: `x-twitter-webhooks-signature: sha256=<base64>` over the raw POST body with the consumer secret.
- Messages sent by the subscribed account arrive marked as echoes. Photo and video URLs on `ton.twitter.com` need an authorized request to download.
- Access to this API depends on your X developer tier and the product is being phased out in favor of newer activity endpoints: check what your tier can subscribe to before building on it.

## What is not documented in the rules data

- Retry counts, schedules and give-up behavior of Meta, Telegram and X webhooks.
- Maximum webhook payload size or concurrency limits.
- Allowed webhook ports and TLS requirements beyond HTTPS.

Build for at-least-once delivery, answer fast, dedupe, and read each platform's current webhook documentation for the specifics you depend on.
