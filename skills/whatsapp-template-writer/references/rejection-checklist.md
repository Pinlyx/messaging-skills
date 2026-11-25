# Template rejection checklist

Meta shows the reason next to a rejected template in WhatsApp Manager. This list groups the causes people hit most often, with a fix for each. It is practical experience and the documented categorization rule, not a list of published numbers. Treat the reason shown by Meta as the authority and use this file to decide what to change.

| Symptom or reason | Likely cause | Fix |
| --- | --- | --- |
| Category rejected or changed to marketing | Promotional or unclear content in a utility template. Documented rule: mixed content is categorized as marketing. | Remove the promo text, or split into a utility template and a separate marketing template. |
| Invalid or missing variable examples | Placeholder examples such as "test" or "xxx", or an example left out. | Provide one realistic example per variable, in the same language as the body. |
| Variable format error | Placeholders not numbered in order, skipped numbers, or malformed braces. | Number from `{{1}}` upward with no gaps; keep braces exact. |
| Message is mostly variables | Too little fixed text around placeholders, so the content cannot be judged. | Rewrite so the fixed text states the purpose and each variable fills a small slot. |
| Sensitive data requested | Template asks for passwords, card numbers, ids or similar. | Move that step to a secure page on your own domain; send a link. |
| URL problems | Link shortener, tracking redirect that hides the destination, or a domain unrelated to the business. | Use the business's own domain and a visible path. |
| Abusive, threatening or pressuring language | Debt collection style wording, false urgency, excessive capitals. | Neutral wording; state facts and the next step. |
| Wrong language | Body in a language different from the template language setting. | Match the language setting to the text; submit each language separately. |
| Duplicate content | Same body and category as an existing template. | Reuse the existing template instead of creating a copy. |
| Policy violation (restricted goods or services) | The product or offer falls under platform commerce or business policy restrictions. | Read the current policy pages; do not try to reword around a restriction. |
| Authentication template rejected | Added free text, promotion or extra links to a code message. | Keep authentication templates to the verification purpose only. |
| Template paused or quality dropped after approval | Recipients blocked or reported the messages. | Tighten the audience to opted-in people, reduce frequency, improve relevance. See `broadcast-compliance`. |

## Fix loop

1. Read the exact reason in WhatsApp Manager.
2. Change one thing, the one the reason points to.
3. Re-check category with the decision table in `SKILL.md`.
4. Resubmit and record the date and outcome.
5. If rejected twice for the same reason, stop editing and rewrite from the purpose, not from the previous text.
