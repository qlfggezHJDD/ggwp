import { Resend } from 'resend';
import { sendWelcome } from '../lib/welcome.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('subscribe: missing RESEND_API_KEY');
      return res.status(500).json({ ok: false, reason: 'config' });
    }
    const b = req.body || {};
    if (b.website) return res.status(200).json({ ok: true });
    const email = String(b.email ?? '').trim().slice(0, 200);
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ ok: false, reason: 'invalid' });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.contacts.create({ email });
    if (error) {
      console.error('subscribe: Resend error', error);
      return res.status(500).json({ ok: false, reason: 'send' });
    }
    await sendWelcome(resend, email);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('subscribe: crash', e);
    return res.status(500).json({ ok: false, reason: 'crash' });
  }
}
