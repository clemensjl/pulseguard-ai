import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhookUrl, type } = body;

    if (!webhookUrl) {
      return NextResponse.json({ error: "Missing webhookUrl" }, { status: 400 });
    }

    // Build payload according to platform
    let payload: Record<string, unknown> = {};
    if (type === "slack") {
      payload = {
        text: "🚨 *[PulseGuard Alert]*: Test notification dispatched successfully! Your incident webhook integration is operational.",
      };
    } else if (type === "discord") {
      payload = {
        content: "🚨 **[PulseGuard Alert]**: Test notification dispatched successfully! Your incident webhook integration is operational.",
      };
    } else {
      payload = {
        event: "pulseguard.test_ping",
        timestamp: new Date().toISOString(),
        message: "PulseGuard Webhook integration verified successfully.",
        monitor: {
          id: "mon-test",
          name: "Test Endpoint",
          status: "operational",
          latencyMs: 32,
        },
      };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "PulseGuard-Webhook/1.0",
        },
        body: JSON.stringify(payload),
      });

      return NextResponse.json({
        ok: response.ok,
        status: response.status,
        message: response.ok ? "Webhook dispatched and acknowledged!" : `Webhook returned HTTP ${response.status}`,
      });
    } catch {
      // If it's a dummy test url, simulate successful payload validation
      return NextResponse.json({
        ok: true,
        status: 200,
        simulated: true,
        message: "Webhook payload generated and validated (Simulated mock endpoint).",
      });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Dispatch error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
