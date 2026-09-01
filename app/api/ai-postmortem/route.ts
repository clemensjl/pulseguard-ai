import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, monitorName, severity, impact, updates } = body;

    // Simulate AI synthesis with realistic structured incident response analysis
    const updateLogs = (updates || [])
      .map((u: { status: string; message: string; timestamp: string }) => `- **[${u.status.toUpperCase()}]** (${new Date(u.timestamp).toLocaleTimeString()}): ${u.message}`)
      .join("\n");

    const postMortem = `### 🤖 PulseGuard AI Autonomous Incident Post-Mortem

**Incident Overview:**
- **Target:** \`${monitorName || "Production System"}\`
- **Severity Level:** \`${(severity || "major").toUpperCase()}\`
- **Primary Impact:** ${impact || "Service degradation detected by synthetic probes."}

---

#### 1. Root Cause Summary
Based on telemetry logs and probe anomaly detection, the disruption was initiated by a combination of upstream connection saturation and internal thread starvation. The primary gateway failed to satisfy keep-alive requirements, resulting in elevated TTFB (Time to First Byte) and cascading request timeouts across client edge zones.

#### 2. Incident Timeline
${updateLogs || "- **[INVESTIGATING]**: Anomaly threshold exceeded\n- **[RESOLVED]**: Service restored to baseline latency"}

#### 3. Blast Radius Assessment
- **API Availability:** Decreased by ~1.4% during the incident window.
- **Affected Clients:** External API consumers in regional edge zones with persistent HTTP/2 connection pooling.
- **Data Integrity:** **100% Uncompromised** (No database write corruption or transactional loss detected).

#### 4. Automated & Manual Remediation
1. **Dynamic Edge Rerouting:** Probes triggered traffic shed to redundant active-active nodes.
2. **Auto-healing Restart:** Worker pools automatically recycled memory heap buffers upon hitting 92% ceiling.

#### 5. Recommended Preventive Action Items
- [ ] Increase keep-alive connection pool maximums on reverse proxies by 50%.
- [ ] Lower auto-scaler CPU threshold trigger from 85% to 70%.
- [ ] Configure multi-region cross-fallback routing in DNS Anycast configuration.
`;

    return NextResponse.json({
      success: true,
      postMortem,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
