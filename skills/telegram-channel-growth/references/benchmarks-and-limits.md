# Benchmarks and limits

## Median reach by subscriber band

Source: Pinlyx, Telegram Channel Reach 2026, https://pinlyx.com/research/telegram-channel-reach-2026. The study measured the Pinlyx Data API catalogue of 3,205,346 public Telegram channels. Reach is average views per post divided by subscribers. The same table is bundled in [telegram-channel-stats](https://github.com/Pinlyx/telegram-channel-stats).

| Subscribers | Median reach |
| --- | --- |
| 1,000 to 5,000 | 31.4% |
| 5,000 to 20,000 | 15.8% |
| 20,000 to 100,000 | 9.1% |
| 100,000 to 500,000 | 6.0% |
| 500,000 and up | 3.3% |

Channels under 1,000 subscribers are not covered. The three smaller bands were computed over samples; the two largest cover every channel in them.

## How the tool measures, and what that means

- It reads the public web preview `https://t.me/s/<channel>` and follows `?before=<post_id>` for older posts. Only channels with a public preview work. A private channel, a missing channel and a channel with the preview disabled look the same from outside.
- Telegram's view counter includes views through forwards and web previews by people who are not subscribers. Reach can overstate the share of subscribers who saw a post, and values above 100% are possible.
- Counts such as 1.2K and 3.4M are rounded by Telegram, so subscribers and views are approximate above 1,000.
- The newest posts are still collecting views, which pulls a short window down a little.
- This is an observation of public numbers, not an audit: nothing shows who saw a post or whether views are real.
- Telegram can change its page markup at any time; the tool degrades to missing fields.

## Posting and Telegram's rules

Telegram does not publish a posting frequency limit for channels in the rules data. There is nothing in `messaging-rules` to cite for how often a channel may post. Any frequency advice must come from your own measurements.
