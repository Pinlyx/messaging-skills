---
name: local-lead-list
description: "Build a list of local businesses for a region and category from open map data (OpenStreetMap, Overture Maps), enrich each with the contact channels its website offers using contact-channel-detector, and plan outreach inside legal and platform limits. Use for 'find restaurants/dentists/gyms in <city>', 'local business lead list', 'which of these businesses use WhatsApp', 'cold outreach list', or 'can I message these businesses'."
metadata:
  version: "0.1.0"
  channels: "whatsapp, instagram, messenger, telegram, x, email, phone"
---

# Local lead list

A lead list from open data is cheap to build and easy to misuse. The useful part is the list with the contact channel each business actually offers. The risky part is messaging people who never asked to be contacted. This skill covers both, and ends with what you may and may not send. Details and licenses: [references/outreach-limits-and-sources.md](references/outreach-limits-and-sources.md).

## When to use this skill

- Building a prospect or partner list for an area and a category.
- Enriching an existing list with each business's website channels.
- Planning first contact for businesses that have not messaged you.

## Tools

- Open data sources: OpenStreetMap (query with Overpass or a regional extract) and Overture Maps places. A purpose-built open source tool, `Pinlyx/open-business-finder`, is planned (coming soon); until it is released, use the sources directly.
- [contact-channel-detector](https://github.com/Pinlyx/contact-channel-detector) to read each website's channels: `pip install git+https://github.com/Pinlyx/contact-channel-detector`.
- `can-i-message` and `broadcast-compliance` for the outreach step.

## Context to collect

1. Region (city, district, bounding box, administrative boundary) and the language of the market.
2. Business category and exclusions.
3. Purpose of the contact: sales offer, partnership, survey, directory update. B2B or B2C?
4. Country or countries whose law applies to the recipients and to you.
5. Who will contact them, by which channel, and what the offer is.

## Workflow

### 1. Define the query

- Translate the category into data tags. OpenStreetMap examples: `amenity=restaurant`, `amenity=dentist`, `shop=bakery`, `leisure=fitness_centre`. Check the tag in the OSM wiki; local tagging varies.
- Fix the area by boundary or bounding box. Avoid querying the whole country when you need a city.
- Keep the request small and polite: respect the Overpass usage policy or use an extract for large areas.

### 2. Collect and clean

Keep only fields that serve the purpose: name, category, address, coordinates, website, source id, source and collection date. Phone numbers and emails that appear in the open data belong to businesses, but treat them as data to handle carefully, not as permission to contact.

Cleaning:

- Normalize names and addresses; remove closed or disused entries when tagged.
- Normalize websites to a canonical homepage; drop social pages as "websites" and keep them as handles.
- Normalize phone numbers to international format.
- Deduplicate by website, then by name plus location.
- Drop entries without enough data to act on.

### 3. Enrich with contact channels

```
contact-channels -i websites.txt --format csv -o channels.csv --respect-robots --timeout 8
```

Join the result by website. Keep `instant_channel`, the channels found and the evidence. Failed fetches stay in the list as "unknown". Remember that "not detected" is not absence.

### 4. Segment

Segment by what the business offers and what you plan to do:

- Offers WhatsApp or live chat: they take messages, so a *customer-style* inquiry or a partnership question on that channel is natural.
- Only email or a form: email or the form is the expected door.
- Only phone: call during business hours, or email if shown.
- Social handles only: consider commenting or following only if relevant; do not send automated DMs.

Add a score from fit (category, size signals, location) and reachability (channel found). Do not score personal characteristics of individuals.

### 5. Plan outreach inside the limits

- **Platform rules.** On Instagram, Messenger and Telegram a business cannot start a conversation through the official messaging APIs: the person must write first (Instagram and Messenger allow one private reply to a comment). On WhatsApp a business may start with an approved template, only to people who opted in: a scraped number is not an opt-in. On X delivery depends on the recipient's DM settings and rate limits apply. See `can-i-message`.
- **Law.** Rules for unsolicited electronic marketing differ by country and by whether the recipient is a company or a person (sole traders are often treated as individuals). Many places require prior consent or a registered permission for marketing messages; some allow a limited first business email with a clear opt-out and an identified sender. This is not legal advice: confirm the rules for each target market before sending.
- **Data protection.** Collecting and storing contact details of identifiable people is regulated in many countries. Keep the minimum, record source and date, honor deletion and opt-out requests, and do not share the list.
- **Do not** buy or scrape phone numbers to blast WhatsApp, use automation on personal accounts to message strangers, or bypass rate limits.

Safe, effective first contacts: a short email from a named person to the business address shown on its website, a call, a walk-in, a reply to an inquiry the business published, or a message through the channel the business advertises for customer questions, in the language of the market, one message, clearly stating who you are and why.

### 6. Deliver

Deliver a CSV with the schema below and a methodology note (query, area, date, licenses, tool versions, how many entries failed).

## Output schema (CSV)

```
name, category, address, lat, lon, website, phone_source, channels_detected, instant_channel, whatsapp_number, instagram_handle, email_on_site, source, source_id, license, collected_at, notes
```

## Checklist

- [ ] Query and area documented; request volume polite.
- [ ] License and attribution recorded (OpenStreetMap contributors for OSM data; check the Overture release license).
- [ ] Duplicates and closed businesses removed.
- [ ] Detector run with robots.txt respected; failures labelled unknown.
- [ ] Outreach plan checked against platform rules and the law of the target market.
- [ ] Opt-out and deletion process exists.
- [ ] No automated DMs to strangers.

## Output template

```
Area / category: <...>   Collected: <date>   Entries: <n> (after cleaning <n>)
Sources and licenses: <...>
Channel mix: <share with WhatsApp, live chat, email only, none detected, unknown>
Segments and plan: <segment -> channel -> first-contact approach -> rule check>
Legal and platform notes: <what applies, what must be confirmed with counsel>
Files: <csv names>
```

## Common mistakes

- Treating a phone number found on a public page as consent to WhatsApp marketing.
- Mass messaging through personal accounts and getting them banned.
- Forgetting attribution and license terms of the open data.
- Querying the whole country and overloading a public service.
- Believing "no WhatsApp detected" means the business does not use WhatsApp.
- Keeping a list forever with no source and date.

## Related

`contact-channel-audit`, `can-i-message`, `broadcast-compliance`.
