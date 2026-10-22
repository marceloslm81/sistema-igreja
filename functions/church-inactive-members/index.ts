export const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};
const port = parseInt(Deno.env.get("PORT")!);
const BASE = "https://app.vibe-x.app/v1/c51c12761c2c4713d48524f4/entities";
function daysBetween(from: Date, to: Date): number {
    return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}
Deno.serve({ port }, async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }
    try {
        const now = new Date();
        // ── Detect inactive members (30/60/90 days) ──
        const membersRes = await fetch(`${BASE}/Member/paging?limit=100`);
        if (!membersRes.ok) {
            const t = await membersRes.text().catch(() => "");
            throw new Error(`Member paging failed HTTP ${membersRes.status}: ${t}`);
        }
        const membersJson = await membersRes.json();
        const members = membersJson?.data?.data || membersJson?.data || [];
        const buckets = { d30: [] as any[], d60: [] as any[], d90: [] as any[] };
        for (const m of members) {
            if (!m.lastActivityDate || m.status === "falecido" || m.status === "transferido") continue;
            const last = new Date(m.lastActivityDate);
            if (isNaN(last.getTime())) continue;
            const days = daysBetween(last, now);
            if (days >= 90) buckets.d90.push({ id: m.id, name: m.name, days });
            else if (days >= 60) buckets.d60.push({ id: m.id, name: m.name, days });
            else if (days >= 30) buckets.d30.push({ id: m.id, name: m.name, days });
        }
        // ── Consolidate monthly financial report ──
        const donationsRes = await fetch(`${BASE}/Donation/paging?limit=100`);
        let monthTotal = 0;
        const byType: Record<string, number> = {};
        if (donationsRes.ok) {
            const donationsJson = await donationsRes.json();
            const donations = donationsJson?.data?.data || donationsJson?.data || [];
            for (const d of donations) {
                if (!d.date) continue;
                const dt = new Date(d.date);
                if (dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear()) {
                    const amount = Number(d.amount) || 0;
                    monthTotal += amount;
                    byType[d.type] = (byType[d.type] || 0) + amount;
                }
            }
        }
        const report = {
            generatedAt: now.toISOString(),
            inactiveAlerts: {
                over30days: buckets.d30,
                over60days: buckets.d60,
                over90days: buckets.d90,
                totalNeedingFollowUp: buckets.d30.length + buckets.d60.length + buckets.d90.length,
            },
            financialSummary: {
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                total: monthTotal,
                byType,
            },
        };
        console.log("Church monthly report:", JSON.stringify(report));
        return new Response(JSON.stringify(report), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("edge function error:", e);
        return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
});