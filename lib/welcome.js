// Sends the welcome email using a template published in Resend.
// Needs WELCOME_TEMPLATE_ID (and MAIL_FROM) in Vercel. If either is missing, nothing is sent
// and the signup still works.
export async function sendWelcome(resend, email) {
  const id = process.env.WELCOME_TEMPLATE_ID;
  if (!id || !process.env.MAIL_FROM) return;
  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "You're in. Thanks for subscribing to ggwp.wtf",
    template: { id },
  });
  if (error) console.error('welcome: Resend error', error);
}
