---
name: telegram-channel-growth
description: "Analyze a public Telegram channel with telegram-channel-stats (subscribers, views, reach, posting frequency), compare it with its size band, find what posting patterns lift reach, and write a growth plan of testable experiments. Use for 'analyze my Telegram channel', 'why are my Telegram views low', 'how often should I post', 'compare my channel with a competitor', or 'Telegram channel growth plan'."
metadata:
  version: "0.1.0"
  channels: "telegram"
---

# Telegram channel growth

Growth advice for channels is usually generic. This skill starts from numbers any public channel exposes (subscribers, per-post views, dates) and turns them into a diagnosis and a short list of experiments. The measuring tool is [telegram-channel-stats](https://github.com/Pinlyx/telegram-channel-stats) (Python 3.9+, standard library, no login or key). Benchmark table and caveats: [references/benchmarks-and-limits.md](references/benchmarks-and-limits.md).

## When to use this skill

- A channel owner wants to know whether their reach is healthy for their size.
- Comparing two or more channels in the same niche.
- Planning posting frequency, formats and promotion for the next 4 to 8 weeks.

This skill covers channels. For bots use `telegram-bot-builder`.

## Context to collect

1. Channel handle(s), and competitors to compare with.
2. Goal: subscribers, post views, clicks to a site, sales, community.
3. Posting resources: posts per week the team can sustain, who writes, who approves.
4. Past actions: ad buys, cross-promotions, giveaways, changes in format.
5. Whether the channel is public with a web preview. Private channels and channels with the preview disabled cannot be analyzed by the tool.

## Workflow

### 1. Measure

```
pip install git+https://github.com/Pinlyx/telegram-channel-stats
tgstats mychannel competitor1 competitor2 --posts 100
tgstats mychannel --json > mychannel.json
tgstats mychannel --csv posts.csv
```

It reads the public page politely (one request at a time, at least one second apart). Record the date of the run: numbers change daily.

### 2. Read the headline numbers

| Metric | Meaning | Watch for |
| --- | --- | --- |
| Subscribers | Count shown on the channel (rounded above 1,000 by Telegram) | Inflated or inactive subscribers lower reach |
| Average and median views per post | Per-post view counters over the posts analysed | Median resists one viral post; compare both |
| Reach | Average views divided by subscribers | Can exceed 100% when posts travel through forwards and previews |
| Posts per day | Posts over the period analysed | Short windows are noisy |
| Top posts | The highest viewed posts | Study what they have in common |

### 3. Compare with the size band

The tool ships medians by subscriber band from the Pinlyx Telegram Channel Reach 2026 study (https://pinlyx.com/research/telegram-channel-reach-2026): median reach is 31.4% for 1,000 to 5,000 subscribers, 15.8% for 5,000 to 20,000, 9.1% for 20,000 to 100,000, 6.0% for 100,000 to 500,000 and 3.3% above that. No benchmark exists below 1,000 subscribers.

Interpret the ratio to the band median, not the raw percentage. Large channels have lower reach by nature. A channel far above the band median may be getting a lot of views from forwards: check whether that traffic converts.

### 4. Diagnose with the CSV

Use the post list to answer, with your own arithmetic:

- **Frequency:** group posts by week; compare median views in weeks with few posts and weeks with many. If views per post fall as frequency rises, you are over-posting for this audience; if flat, frequency is free reach.
- **Timing:** group by weekday and hour in the audience's time zone; find the top and bottom slots by median views; require enough posts per slot before believing a difference.
- **Format:** classify posts (text only, image, video, link, poll, long read) and compare medians.
- **Length and hook:** compare the first line of top and bottom posts.
- **Trend:** are views per post rising or falling over the last 30, 60 and 90 days?
- **Forwarded content:** the CSV marks forwarded posts; compare them with original posts.

Do not draw conclusions from fewer than about 8 to 10 posts per group, and say so when you do.

### 5. Write the growth plan

Turn diagnosis into at most 4 experiments, each with: hypothesis, change, duration (two to four weeks), metric (median views per post, net subscribers), and the decision rule (keep, drop, retest). Typical levers, none guaranteed:

- Posting rhythm and timing adjustments.
- A recurring format readers respond to; retire formats with consistently low medians.
- Stronger first lines and a single call to action per post.
- Cross-promotion with channels of similar size and relevance, with a tracked invite link per partner.
- Pinned post and channel description that state what the channel gives and how often.
- Moving valuable conversations into a bot or a discussion group (see `telegram-bot-builder`).

Paid growth and promotion deals vary widely: price them per net new subscriber measured with invite links, not per promised view.

### 6. Re-measure

Run the tool again after each experiment window. Record the numbers next to the change so the plan builds a history.

## Checklist

- [ ] Date, channel and post count recorded for every measurement.
- [ ] Median and mean compared; one viral post not driving conclusions.
- [ ] Benchmark band used; no benchmark claimed below 1,000 subscribers.
- [ ] Limits of the data stated (views include forwards, counts are rounded).
- [ ] Each experiment has one metric and a decision rule.
- [ ] No promise of growth numbers.

## Output template

```
Channel: @<handle>   Measured: <date>   Posts analysed: <n> (<date range>)
Headline: subscribers <n>, median views <n>, reach <x%>, posts/day <x>
Benchmark: band <range>, band median reach <x%>, this channel <x%> (<ratio>x)
Findings: <3 to 5 bullets, each with the number behind it>
Experiments: <hypothesis | change | duration | metric | decision rule>
Caveats: <forwarded views, rounding, sample size>
Next measurement date: <date>
```

## Common mistakes

- Reading reach above 100% as "everyone saw it".
- Comparing a 500,000-subscriber channel with the 1,000 to 5,000 median.
- Concluding from three posts per weekday.
- Judging an experiment before the newest posts have collected their views (recent posts are still rising).
- Buying subscribers: inactive accounts depress reach and tell you nothing.

## Related

`telegram-bot-builder`, `messaging-kpis`, `contact-channel-audit`.
