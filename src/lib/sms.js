export async function sendSms({ dialCode, phoneNumber, body }) {
  const res = await fetch('https://app.vibe-x.app/v1/sms/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': 'ck-glvoYDFphS9SUM3jIZ3gK8Dq7RzkoVMyBY4miG6o2k8',
    },
    body: JSON.stringify({ dialCode, phoneNumber, body }),
  });
  if (!res.ok) {
    throw new Error(`Falha ao enviar SMS: ${res.status}`);
  }
  return res.json();
}