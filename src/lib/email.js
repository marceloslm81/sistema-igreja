export async function sendEmail({ to, subject, text, html, fromName, replyTo }) {
  const res = await fetch('https://app.vibe-x.app/v1/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': 'ck-L8631L_6DPbKkR4qUZSUzbTIWPNDFeJs-ZsuhDCMvPs',
    },
    body: JSON.stringify({ to, subject, text, html, fromName, replyTo }),
  });
  if (!res.ok) {
    throw new Error(`Falha ao enviar e-mail: ${res.status}`);
  }
  return res.json();
}