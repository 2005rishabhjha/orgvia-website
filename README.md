# OrgVia marketing website

Static, independently deployable public website. The deployable directory is `dist/`.

## Local verification

```bash
npm run check
python3 -m http.server 4173 --directory dist
```

Deploy the contents of `dist/` to the host serving `orgvia.rishabh.codes`. Before production, set the final `https://orgvia.rishabh.codes` canonical URLs if the deployed hostname differs, replace illustrative product previews with authorized screenshots, configure a secure sales-enquiry endpoint, and have legal counsel approve the draft legal pages.
