import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Submission = {
  id: string;
  body: string;
  createdAt: string;
};

const PREFIX = "cc-chat/";

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function GET() {
  if (!hasBlobToken()) {
    return NextResponse.json(
      { error: "Blob storage is not configured." },
      { status: 503 },
    );
  }

  try {
    const { blobs } = await list({ prefix: PREFIX });

    const submissions = (
      await Promise.all(
        blobs.map(async (blob): Promise<Submission | null> => {
          try {
            const res = await fetch(blob.url, { cache: "no-store" });
            if (!res.ok) return null;
            const data = (await res.json()) as Partial<Submission>;
            if (typeof data.body !== "string") return null;
            return {
              id: data.id ?? blob.pathname,
              body: data.body,
              createdAt: data.createdAt ?? blob.uploadedAt.toISOString(),
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

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("cc-chat GET failed", error);
    return NextResponse.json(
      { error: "Failed to load submissions." },
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
