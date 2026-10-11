# ggwp.wtf

Static site (`index.html`) + two Vercel functions (`api/contact.js`, `api/subscribe.js`) that use Resend.

## Setup
1. Resend: create an account, add the domain ggwp.wtf, add the DNS records it shows at your registrar, wait for "Verified".
2. Resend: create an API key.
3. Vercel: Project > Settings > Environment Variables, add:
   - RESEND_API_KEY  = your key
   - MAIL_FROM       = ggwp.wtf <hello@ggwp.wtf>   (an address on your verified domain)
   - CONTACT_TO      = the inbox where you want to receive messages
4. In `index.html`, set `STUDIO.email` to your real address.
5. Deploy this folder to Vercel (GitHub repo or `vercel` CLI), then Project > Settings > Domains > add ggwp.wtf.
6. Send a newsletter: Resend dashboard > Broadcasts.

## Test
Submit both tabs of the form on the live site, then check your inbox and the Contacts page in Resend.

## Welcome email
1. Upload `logo.png` to the repo root (the email loads it from https://ggwp.wtf/logo.png).
2. Resend > Templates > Create template. Paste the contents of `emails/welcome.html`. Publish it.
3. Copy the template ID (or alias). In Vercel add the env variable WELCOME_TEMPLATE_ID, then redeploy.
Subject and sender are set in `lib/welcome.js` and `MAIL_FROM`. If you change the HTML, publish the template again in Resend.
