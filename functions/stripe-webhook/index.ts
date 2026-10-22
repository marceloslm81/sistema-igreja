export const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-vibex-signature, x-app-user-id",
};
const port = parseInt(Deno.env.get("PORT") || "8000");
const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
async function verifyVibexSignature(rawBody: string, signature: string | null): Promise<boolean> {
    if (!WEBHOOK_SECRET || !signature) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(WEBHOOK_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
    const expected = Array.from(new Uint8Array(sigBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    if (signature.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < signature.length; i++) {
        diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return diff === 0;
}
Deno.serve({ port }, async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-vibex-signature");
        if (!(await verifyVibexSignature(rawBody, signature))) {
            console.warn("Rejected webhook: invalid x-vibex-signature");
            return new Response(
                JSON.stringify({ error: "Invalid signature" }),
                {
                    status: 401,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                },
            );
        }
        const event = JSON.parse(rawBody);
        const buyerUserId = req.headers.get("x-app-user-id") || "";
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("Payment successful for session:", session.id, "buyer:", buyerUserId || "(anonymous)");
            if (session.payment_status === "paid" && session.status === "complete") {
                const base = "https://app.vibe-x.app/v1/c51c12761c2c4713d48524f4/entities/Payment";
                const listRes = await fetch(`${base}/paging?filter[stripeSessionId]=${session.id}&limit=1`);
                if (!listRes.ok) {
                    const errText = await listRes.text().catch(() => "");
                    console.error(`Payment paging failed HTTP ${listRes.status}: ${errText}`);
                    return new Response(JSON.stringify({ error: "downstream failed" }), {
                        status: 500,
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                }
                const listJson = await listRes.json();
                const payment = (listJson?.data?.data || listJson?.data || [])[0];
                if (payment && payment.status !== "success") {
                    const updRes = await fetch(`${base}/${payment.id}/update`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            status: "success",
                            paidAt: new Date().toISOString(),
                            metadata: {
                                ...(payment.metadata || {}),
                                buyerUserId,
                                transferAmount: session.metadata?.transferAmount || "",
                            },
                        }),
                    });
                    if (!updRes.ok) {
                        const errText = await updRes.text().catch(() => "");
                        console.error(`Payment update failed HTTP ${updRes.status}: ${errText}`);
                        return new Response(JSON.stringify({ error: "update failed" }), {
                            status: 500,
                            headers: { ...corsHeaders, "Content-Type": "application/json" },
                        });
                    }
                } else if (payment && payment.status === "success") {
                    return new Response(JSON.stringify({ received: true, alreadyProcessed: true }), {
                        status: 200,
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                }
            }
        }
        return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err: any) {
        console.error("Webhook Error:", err.message);
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});