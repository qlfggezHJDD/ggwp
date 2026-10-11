import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot
  const email = String(b.email ?? '').trim().slice(0, 200);
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ ok: false });

  const { error } = await resend.contacts.create({ email });
  if (error) return res.status(500).json({ ok: false });
  return res.status(200).json({ ok: true });
}
