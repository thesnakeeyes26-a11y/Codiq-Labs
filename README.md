# Codiq Labs v2 (static, no build step)
Pages: `/` (index.html), `/portfolio`, `/services`, plus 404. Deploy the folder to Vercel as is (`cleanUrls` is on).
Local preview: `npm install` once, then `npm run dev` (opens http://localhost:3000). Or without installing: `npx serve .`

## Before going live
- Aivus AI is marked "Coming soon". When it launches: remove the `soon` tags in index.html / portfolio.html and add screenshots to assets/img/ (use new file names, assets are cached for 1 year).
- Fonts load from Google Fonts. For a privacy-first brand, self-hosting Outfit and Playfair Display is recommended (then drop fonts.googleapis.com / fonts.gstatic.com from the CSP in vercel.json).
- Social preview uses the 512px logo. A 1200x630 image in assets/ would look better.

## Contact form (Tally)
Form ID `eqKBKe`. Buttons open it as a popup (Tally script loads only on click); `/contact` shows it inline.
Design is set inside Tally (Design tab): background #0B0820, text #FFFFFF, button #7C5CFF with white text, rounded corners.
