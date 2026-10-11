export async function sendWelcome(resend, email) {
  const id = process.env.WELCOME_TEMPLATE_ID || 'welcome';
  const from = process.env.MAIL_FROM;
  console.log('welcome: start', { template: id, from: !!from });
  if (!from) {
    console.log('welcome: skipped, MAIL_FROM is missing');
    return;
  }
  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: "You're in. Thanks for subscribing to ggwp.wtf",
    template: { id },
  });
  if (error) console.error('welcome: Resend error', error);
  else console.log('welcome: sent', data?.id);
}
