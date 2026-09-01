import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const method = searchParams.get("method") || "GET";
  const expectedStatus = parseInt(searchParams.get("expectedStatus") || "200", 10);
  const keyword = searchParams.get("keyword");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing 'url' query parameter" }, { status: 400 });
  }

  let formattedUrl = targetUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(formattedUrl, {
      method,
      signal: controller.signal,
      headers: {
        "User-Agent": "PulseGuard-Bot/1.0 (+https://pulseguard.io)",
        "Accept": "*/*",
      },
    });
    clearTimeout(timeoutId);

    const durationMs = Math.round(performance.now() - startTime);
    let keywordFound = true;

    if (keyword) {
      const text = await response.text();
      keywordFound = text.includes(keyword);
    }

    const isStatusOk = response.status === expectedStatus || (expectedStatus === 200 && response.status >= 200 && response.status < 400);
    const ok = isStatusOk && keywordFound;

    const headersObj: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      headersObj[key] = val;
    });

    return NextResponse.json({
      ok,
      url: formattedUrl,
      status: response.status,
      statusText: response.statusText,
      latencyMs: durationMs,
      timestamp: new Date().toISOString(),
      headers: {
        server: headersObj["server"] || "unknown",
        "content-type": headersObj["content-type"] || "unknown",
        "cache-control": headersObj["cache-control"] || "unknown",
      },
      keywordMatched: keyword ? keywordFound : undefined,
    });
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : "Connection failed";
    return NextResponse.json({
      ok: false,
      url: formattedUrl,
      status: 0,
      statusText: errorMessage.includes("abort") ? "Timeout" : "Connection Error",
      latencyMs: durationMs,
      timestamp: new Date().toISOString(),
      error: errorMessage,
    });
  }
}
