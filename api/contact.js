import { Resend } from 'resend';

const clean = (v, n) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  try {
    const { RESEND_API_KEY, MAIL_FROM, CONTACT_TO } = process.env;
    if (!RESEND_API_KEY || !MAIL_FROM || !CONTACT_TO) {
      console.error('contact: missing env var(s)', { key: !!RESEND_API_KEY, from: !!MAIL_FROM, to: !!CONTACT_TO });
      return res.status(500).json({ ok: false, reason: 'config' });
    }
    const b = req.body || {};
    if (b.website) return res.status(200).json({ ok: true });
    const email = clean(b.email, 200);
    const name = clean(b.name, 80);
    const message = String(b.message ?? '').trim().slice(0, 5000);
    if (!/^\S+@\S+\.\S+$/.test(email) || !message) return res.status(400).json({ ok: false, reason: 'invalid' });

    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Message from ${name || email}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    if (error) {
      console.error('contact: Resend error', error);
      return res.status(500).json({ ok: false, reason: 'send' });
    }
    if (b.subscribe === true) {
      const r = await resend.contacts.create({ email });
      if (r.error) console.error('contact: subscribe error', r.error);
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('contact: crash', e);
    return res.status(500).json({ ok: false, reason: 'crash' });
  }
}
