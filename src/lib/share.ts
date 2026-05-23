import type { QuizData } from "@/types";

const VERSION = "1";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 2 ? "==" : s.length % 4 === 3 ? "=" : "";
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function gzip(input: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([input as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gunzip(input: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([input as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function encodeQuiz(data: QuizData): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  if (typeof CompressionStream !== "undefined") {
    return `${VERSION}:g:${toBase64Url(await gzip(bytes))}`;
  }
  return `${VERSION}:p:${toBase64Url(bytes)}`;
}

export async function decodeQuiz(token: string): Promise<QuizData> {
  const m = /^(\d+):([gp]):(.+)$/.exec(token);
  if (!m) throw new Error("Unrecognized share link format");
  const [, ver, alg, payload] = m;
  if (ver !== VERSION) throw new Error(`Unsupported share link version ${ver}`);
  const raw = fromBase64Url(payload);
  const bytes = alg === "g" ? await gunzip(raw) : raw;
  const parsed = JSON.parse(new TextDecoder().decode(bytes)) as QuizData;
  if (!parsed.title || !Array.isArray(parsed.lectures) || !Array.isArray(parsed.questions)) {
    throw new Error("Shared data missing required fields");
  }
  if (parsed.questions.length === 0) throw new Error("Shared quiz has no questions");
  return parsed;
}
