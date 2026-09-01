import { NextRequest, NextResponse } from "next/server";
import tls from "tls";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing 'url' query parameter" }, { status: 400 });
  }

  let hostname = targetUrl.replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];

  return new Promise<NextResponse>((resolve) => {
    try {
      const socket = tls.connect(
        {
          host: hostname,
          port: 443,
          servername: hostname,
          timeout: 6000,
        },
        () => {
          const peerCert = socket.getPeerCertificate();
          socket.destroy();

          if (!peerCert || !peerCert.valid_to) {
            resolve(
              NextResponse.json({
                ok: false,
                hostname,
                error: "Unable to retrieve certificate",
              })
            );
            return;
          }

          const validTo = new Date(peerCert.valid_to);
          const validFrom = new Date(peerCert.valid_from);
          const now = new Date();
          const daysRemaining = Math.max(0, Math.floor((validTo.getTime() - now.getTime()) / (1000 * 3600 * 24)));

          resolve(
            NextResponse.json({
              ok: true,
              hostname,
              issuer: peerCert.issuer?.O || peerCert.issuer?.CN || "Unknown Authority",
              subject: peerCert.subject?.CN || hostname,
              validFrom: validFrom.toISOString(),
              validTo: validTo.toISOString(),
              daysRemaining,
              isExpired: daysRemaining <= 0,
              isExpiringSoon: daysRemaining <= 30,
            })
          );
        }
      );

      socket.on("error", (err) => {
        resolve(
          NextResponse.json({
            ok: false,
            hostname,
            error: err.message || "SSL handshake failed",
          })
        );
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve(
          NextResponse.json({
            ok: false,
            hostname,
            error: "SSL connection timed out",
          })
        );
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "SSL check error";
      resolve(
        NextResponse.json({
          ok: false,
          hostname,
          error: errorMessage,
        })
      );
    }
  });
}
