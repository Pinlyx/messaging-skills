# contact-channel-detector output reference

Tool: https://github.com/Pinlyx/contact-channel-detector (Python 3.9+, standard library, MIT). Install: `pip install git+https://github.com/Pinlyx/contact-channel-detector`.

## Result object

```json
{
  "url": "example.com",
  "final_url": "https://www.example.com/",
  "status": 200,
  "ok": true,
  "error": null,
  "parked": false,
  "parked_reason": null,
  "channels": ["whatsapp", "live_chat", "instagram", "email"],
  "instant_channel": true,
  "social": {"instagram": "examplehandle"},
  "findings": [
    {"channel": "live_chat", "provider": "Tawk.to", "value": null,
     "evidence": "https://embed.tawk.to/abc/default", "source": "script"}
  ]
}
```

| Field | Meaning |
| --- | --- |
| `channel` | `whatsapp`, `telegram`, `messenger`, `viber`, `live_chat`, `multichannel_widget`, `instagram`, `facebook`, `x`, `tiktok`, `youtube`, `linkedin`, `pinterest`, `threads`, `bluesky`, `email`, `phone` |
| `provider` | Vendor or platform (Tawk.to, Joinchat (WordPress), wa.me, Instagram, ...) |
| `value` | Normalized handle, number or address; null for widgets |
| `evidence` | The matching link, script URL, class name or code fragment |
| `source` | `link`, `script`, `plugin`, `jsonld` (schema.org sameAs) or `cfemail` (Cloudflare-protected address) |
| `instant_channel` | True when any of whatsapp, telegram, messenger, viber, live_chat or multichannel_widget is offered |

Normalization: WhatsApp and Viber numbers are digits only, handles are lower case without `@`, YouTube is `@name`, `channel/UC...`, `c/name` or `user/name`, LinkedIn is `company/slug` or `in/slug`.

## Useful commands

```
contact-channels example.com --pretty                        # one site, readable JSON
contact-channels -i urls.txt --format csv -o results.csv     # many sites, one CSV row each
contact-channels -i urls.txt --respect-robots --timeout 8    # polite mode
```

For many URLs the CLI prints a percentage table on stderr; stdout stays clean for piping. Percentages are computed over sites that were reachable and not parked.

## Known limits

- Only the homepage is fetched. A channel present on a contact page only may be missed.
- Buttons drawn by JavaScript without a link in the HTML are covered for common plugins but not in general. Not detected is not the same as absent.
- A detected number is not proof that the number is active or staffed.
- Network failures return `ok=false` with a short error; the tool never raises for them.
- The detector reads public pages; it does not log in, and it does not validate phone numbers or handles with the platforms.
