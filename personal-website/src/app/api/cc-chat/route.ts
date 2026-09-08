import { del, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Submission = {
  id: string;
  body: string;
  createdAt: string;
};

type Meta = {
  generation: number;
  clearedAt: string;
};

const PREFIX = "cc-chat/";
const META_PATH = `${PREFIX}meta.json`;

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function listAllBlobs() {
  const blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;

  do {
    const result = await list({ prefix: PREFIX, cursor });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return blobs;
}

async function readMeta(
  blobs: Awaited<ReturnType<typeof listAllBlobs>>,
): Promise<Meta> {
  const metaBlob = blobs.find((blob) => blob.pathname === META_PATH);
  if (!metaBlob) {
    return { generation: 0, clearedAt: "1970-01-01T00:00:00.000Z" };
  }

  try {
    const res = await fetch(metaBlob.url, { cache: "no-store" });
    if (!res.ok) {
      return { generation: 0, clearedAt: "1970-01-01T00:00:00.000Z" };
    }
    const data = (await res.json()) as Partial<Meta>;
    return {
      generation:
        typeof data.generation === "number" && Number.isFinite(data.generation)
          ? data.generation
          : 0,
      clearedAt:
        typeof data.clearedAt === "string"
          ? data.clearedAt
          : "1970-01-01T00:00:00.000Z",
    };
  } catch {
    return { generation: 0, clearedAt: "1970-01-01T00:00:00.000Z" };
  }
}

function cacheHeaders(generation: number) {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    Pragma: "no-cache",
    "X-Cc-Chat-Generation": String(generation),
  };
}

export async function GET() {
  if (!hasBlobToken()) {
    return NextResponse.json(
      { error: "Blob storage is not configured." },
      { status: 503 },
    );
  }

  try {
    const blobs = await listAllBlobs();
    const meta = await readMeta(blobs);
    const clearedAtMs = new Date(meta.clearedAt).getTime();

    const submissions = (
      await Promise.all(
        blobs.map(async (blob): Promise<Submission | null> => {
          if (blob.pathname === META_PATH) return null;
          try {
            const res = await fetch(blob.url, { cache: "no-store" });
            if (!res.ok) return null;
            const data = (await res.json()) as Partial<Submission>;
            if (typeof data.body !== "string") return null;
            const createdAt =
              data.createdAt ?? blob.uploadedAt.toISOString();
            if (new Date(createdAt).getTime() <= clearedAtMs) return null;
            return {
              id: data.id ?? blob.pathname,
              body: data.body,
              createdAt,
            };
          } catch {
            return null;
          }
        }),
      )
    ).filter((item): item is Submission => item !== null);

    submissions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json(submissions, {
      headers: cacheHeaders(meta.generation),
    });
  } catch (error) {
    console.error("cc-chat GET failed", error);
    return NextResponse.json(
      { error: "Failed to load submissions." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  if (!hasBlobToken()) {
    return NextResponse.json(
      { error: "Blob storage is not configured." },
      { status: 503 },
    );
  }

  try {
    const blobs = await listAllBlobs();
    const meta = await readMeta(blobs);
    const nextMeta: Meta = {
      generation: meta.generation + 1,
      clearedAt: new Date().toISOString(),
    };

    const toDelete = blobs.map((blob) => blob.url);
    if (toDelete.length > 0) {
      await del(toDelete);
    }

    await put(META_PATH, JSON.stringify(nextMeta), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return NextResponse.json(
      { ok: true, deleted: toDelete.length, generation: nextMeta.generation },
      { headers: cacheHeaders(nextMeta.generation) },
    );
  } catch (error) {
    console.error("cc-chat DELETE failed", error);
    return NextResponse.json(
      { error: "Failed to clear submissions." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!hasBlobToken()) {
    return NextResponse.json(
      { error: "Blob storage is not configured." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body =
    typeof payload === "object" &&
    payload !== null &&
    "body" in payload &&
    typeof (payload as { body: unknown }).body === "string"
      ? (payload as { body: string }).body.trim()
      : "";

  if (!body) {
    return NextResponse.json(
      { error: "Body text is required." },
      { status: 400 },
    );
  }

  if (body.length > 20_000) {
    return NextResponse.json(
      { error: "Body text is too long (max 20,000 characters)." },
      { status: 400 },
    );
  }

  const createdAt = new Date().toISOString();
  const id = `${Date.now()}-${crypto.randomUUID()}`;
  const submission: Submission = { id, body, createdAt };

  try {
    const blob = await put(
      `${PREFIX}${id}.json`,
      JSON.stringify(submission),
      {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      },
    );

    return NextResponse.json(
      { ok: true, submission, url: blob.url },
      { status: 201 },
    );
  } catch (error) {
    console.error("cc-chat POST failed", error);
    return NextResponse.json(
      { error: "Failed to save submission." },
      { status: 500 },
    );
  }
}
