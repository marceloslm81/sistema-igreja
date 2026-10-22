const CURRENCY_PATTERN = /^[a-z]{3}$/;
function getCurrentUserId() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return undefined;
    const u = JSON.parse(raw);
    return u?.id ?? u?._id ?? u?.user_id;
  } catch {
    return undefined;
  }
}
async function handleCheckoutResponse(res, popup) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (popup && !popup.closed) popup.close();
    const msg = json?.message || `Checkout falhou (HTTP ${res.status})`;
    alert(msg);
    throw new Error(msg);
  }
  const session = json?.data ?? json;
  if (session?.url) {
    if (popup && !popup.closed) {
      popup.location.href = session.url;
    } else {
      window.location.href = session.url;
    }
  } else if (popup && !popup.closed) {
    popup.close();
  }
  return session;
}
export async function createCheckoutSession(amount, currency, productName) {
  const normalized = (currency || 'usd').toLowerCase();
  if (!CURRENCY_PATTERN.test(normalized)) {
    throw new Error(
      `Moeda inválida "${currency}". Use um código ISO 4217 de 3 letras minúsculas (ex.: 'brl', 'usd').`
    );
  }
  const userId = getCurrentUserId();
  const popup = window.open('about:blank', '_blank');
  const res = await fetch('https://app.vibe-x.app/v1/c51c12761c2c4713d48524f4/entities/integrations/Stripe/CreateCheckoutSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      currency: normalized,
      product_name: productName,
      success_url: window.location.origin + '/payment/success',
      cancel_url: window.location.origin + '/payment/cancel',
      ...(userId ? { user_id: userId } : {})
    })
  });
  return handleCheckoutResponse(res, popup);
}