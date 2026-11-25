# Contributing

Skills here are only useful if they are correct. Two rules follow from that.

1. **Every platform rule needs an official source.** A window length, a tag, a character limit, a rate limit or a size limit must come from an official platform page (for example developers.facebook.com, core.telegram.org, docs.x.com), preferably through the source-cited data in [messaging-rules](https://github.com/Pinlyx/messaging-rules). Put the value and its URL in the skill's `references/` file. Blogs and vendor help centers can help you find the official page but are not a source.
2. **No number without a source.** If a value is not published or you could not confirm it, write "no published number in the rules data, check the live editor or the official page" instead of a figure from memory.

## Adding a skill

1. Create `skills/<name>/SKILL.md`. The folder name and the `name` field in the frontmatter must match: lowercase letters, digits and single hyphens.
2. Frontmatter:

   ```yaml
   ---
   name: my-skill
   description: "One to three sentences, at most 1,024 characters, that say what the skill does and name concrete phrases that should trigger it."
   metadata:
     version: "0.1.0"
     channels: "whatsapp, instagram"
   ---
   ```

3. Required sections, as `##` headings: When to use, Context to collect, Workflow, Checklist, Output template, Common mistakes. Add Related if useful.
4. Put sourced rules and long tables in `skills/<name>/references/*.md`, link each file from `SKILL.md`, and include the official URLs.
5. Skills must work without any particular product. Open source tools may be named as optional helpers; do not make a skill depend on a hosted service.
6. Add the skill to the table in `README.md` and the list in `GEMINI.md`, and add a line to `CHANGELOG.md`.
7. Run `node scripts/validate.mjs` and fix everything it reports.

## Style

- English, plain and specific. Say what to do, in order, and what the output looks like.
- No em dashes or en dashes (use a colon, comma, period or hyphen).
- No secrets, no personal or internal paths, no real customer data in examples.
- Write examples with invented businesses and names.

## Changing a rule value

Platforms change rules. If a value is out of date, open an issue or a pull request with the link to the official page that shows the new value and update the matching `references/` file. If the value also exists in `messaging-rules`, update it there too.

## Reviewing

Pull requests are reviewed for correctness first (is the rule real and sourced), then for usefulness (could someone follow this and get a good result), then for length. Shorter and exact beats long and vague.
