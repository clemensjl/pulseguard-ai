import { lookup } from "node:dns/promises";
import { Agent, fetch as undiciFetch } from "undici";
import { isIP } from "node:net";

// Blocks requests from the server to internal networks (SSRF).
// Every route that fetches or connects to a user-supplied address goes through here.

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

const BLOCKED_V4: Array<[string, number]> = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];

function isBlockedV4(ip: string): boolean {
  const n = ipv4ToInt(ip);
  return BLOCKED_V4.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (n & mask) === (ipv4ToInt(base) & mask);
  });
}

export function isBlockedIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isBlockedV4(ip);
  if (version !== 6) return true;

  const v6 = ip.toLowerCase();
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isBlockedV4(mapped[1]);
  if (v6 === "::" || v6 === "::1") return true;
  if (/^f[cd]/.test(v6)) return true; // fc00::/7 unique local
  if (/^fe[89ab]/.test(v6)) return true; // fe80::/10 link local
  if (v6.startsWith("ff")) return true; // multicast
  if (v6.startsWith("::ffff:") || v6.startsWith("64:ff9b:")) return true; // other mapped/translated forms
  return false;
}

export class UnsafeTargetError extends Error {}

export async function resolvePublicTarget(rawUrl: string): Promise<{ url: URL; address: string }> {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`);
  } catch {
    throw new UnsafeTargetError("Invalid URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeTargetError("Only http and https URLs are allowed");
  }
  if (url.username || url.password) {
    throw new UnsafeTargetError("Credentials in the URL are not allowed");
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host)
    ? [{ address: host }]
    : await lookup(host, { all: true }).catch(() => {
        throw new UnsafeTargetError("Host could not be resolved");
      });

  if (addresses.length === 0 || addresses.some((a) => isBlockedIp(a.address))) {
    throw new UnsafeTargetError("Target resolves to a private or reserved address");
  }
  return { url, address: addresses[0].address };
}

// fetch that connects only to the address validated above (no second DNS lookup,
// so DNS rebinding cannot swap in an internal IP) and re-validates every redirect hop.
export async function safeFetch(
  rawUrl: string,
  init: RequestInit & { maxRedirects?: number } = {}
): Promise<{ response: Response; finalUrl: string }> {
  const { maxRedirects = 3, ...rest } = init;
  let current = rawUrl;

  for (let hop = 0; ; hop++) {
    const { url, address } = await resolvePublicTarget(current);
    const family = isIP(address);
    const dispatcher = new Agent({
      connect: {
        lookup: (_hostname, options, callback) => {
          if ((options as { all?: boolean }).all) {
            (callback as (err: null, addrs: Array<{ address: string; family: number }>) => void)(null, [{ address, family }]);
          } else {
            callback(null, address, family);
          }
        },
      },
    });

    try {
      const response = (await undiciFetch(url.toString(), {
        ...(rest as object),
        redirect: "manual",
        dispatcher,
      })) as unknown as Response;

      const location = response.headers.get("location");
      if (response.status >= 300 && response.status < 400 && location && hop < maxRedirects) {
        await response.body?.cancel();
        current = new URL(location, url).toString();
        continue;
      }
      // Read the body before the dispatcher is closed.
      const body = await response.arrayBuffer();
      return {
        response: new Response(response.status === 204 || response.status === 304 ? null : body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        }),
        finalUrl: url.toString(),
      };
    } finally {
      dispatcher.close().catch(() => {});
    }
  }
}
