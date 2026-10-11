import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const clean = (v, n) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot: bots fill this
  const email = clean(b.email, 200);
  const name = clean(b.name, 80);
  const message = String(b.message ?? '').trim().slice(0, 5000);
  if (!/^\S+@\S+\.\S+$/.test(email) || !message) return res.status(400).json({ ok: false });

  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM,      // e.g. "ggwp.wtf <hello@ggwp.wtf>"
    to: process.env.CONTACT_TO,       // your real inbox
    replyTo: email,                   // hit reply and it goes to the visitor
    subject: `Message from ${name || email}`,
    text: `${message}\n\n— ${name} <${email}>`,
  });
  if (error) return res.status(500).json({ ok: false });

  if (b.subscribe === true) await resend.contacts.create({ email }); // optional newsletter opt-in
  return res.status(200).json({ ok: true });
}
