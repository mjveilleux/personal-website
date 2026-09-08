"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Submission = {
  id: string;
  body: string;
  createdAt: string;
};

const CHANNEL = "cc-chat-sync";

type FormProps = {
  onOptimisticSubmit?: (submission: Submission) => void;
  onSubmitted?: () => void;
};

export function CcChatForm({ onOptimisticSubmit, onSubmitted }: FormProps) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = text.trim();
    if (!body) {
      setIsError(true);
      setMessage("Write something before sending.");
      return;
    }

    const optimistic: Submission = {
      id: `local-${Date.now()}`,
      body,
      createdAt: new Date().toISOString(),
    };

    setText("");
    setIsError(false);
    setMessage("Saved.");
    onOptimisticSubmit?.(optimistic);

    void fetch("/api/cc-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("save failed");
        onSubmitted?.();
      })
      .catch(() => {
        setIsError(true);
        setMessage("Couldn’t save. Try again.");
        setText(body);
      });
  }

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0 space-y-4">
      <label htmlFor="cc-chat-body" className="sr-only">
        Put your prompt in here and click send.
      </label>
      <textarea
        id="cc-chat-body"
        name="body"
        rows={8}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          if (message) {
            setMessage("");
            setIsError(false);
          }
        }}
        className="box-border max-h-[50vh] min-h-[10rem] w-full max-w-full min-w-0 resize-y rounded-xl border border-[#1a1f25]/15 bg-white/80 px-3 py-3 text-base leading-relaxed text-[#1a1f25] shadow-sm outline-none transition focus:border-[#1f403c] focus:ring-2 focus:ring-[#1f403c]/20 sm:px-4"
      />
      <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="w-full rounded-full bg-[#1f403c] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#16332f] sm:w-auto sm:py-2.5"
        >
          Send
        </button>
        {message ? (
          <p
            className={
              isError
                ? "min-w-0 break-words text-sm text-red-700"
                : "min-w-0 break-words text-sm text-[#1f403c]"
            }
            role="status"
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function withPendingLocals(
  serverItems: Submission[],
  current: Submission[],
): Submission[] {
  if (serverItems.length === 0) return [];

  const serverBodies = new Set(serverItems.map((item) => item.body));
  const pendingLocals = current.filter(
    (item) => item.id.startsWith("local-") && !serverBodies.has(item.body),
  );

  return [...serverItems, ...pendingLocals].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function CcChatSubmissions({
  refreshKey = 0,
  optimistic,
  onCleared,
  registerClear,
  onClearingChange,
}: {
  refreshKey?: number;
  optimistic?: Submission | null;
  onCleared?: () => void;
  registerClear?: (clearFn: (() => void) | null) => void;
  onClearingChange?: (clearing: boolean) => void;
}) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);
  const seenOptimistic = useRef<string | null>(null);
  const generationRef = useRef<number | null>(null);

  const applyServerItems = useCallback(
    (serverItems: Submission[], generation: number | null) => {
      const generationChanged =
        generation !== null &&
        generationRef.current !== null &&
        generation !== generationRef.current;

      if (generation !== null) {
        generationRef.current = generation;
      }

      if (generationChanged || serverItems.length === 0) {
        setSubmissions(serverItems);
        return;
      }

      setSubmissions((current) => withPendingLocals(serverItems, current));
    },
    [],
  );

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/cc-chat?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as Submission[];
      const serverItems = Array.isArray(data) ? data : [];
      const generationHeader = res.headers.get("X-Cc-Chat-Generation");
      const generation =
        generationHeader !== null && generationHeader !== ""
          ? Number(generationHeader)
          : null;
      applyServerItems(
        serverItems,
        generation !== null && Number.isFinite(generation) ? generation : null,
      );
      setError("");
    } catch {
      setError("Couldn’t load submissions.");
    }
  }, [applyServerItems]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => {
      void load();
    }, 1000);
    return () => window.clearInterval(id);
  }, [load, refreshKey]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === "cleared") {
        setSubmissions([]);
        void load();
      }
    };
    return () => channel.close();
  }, [load]);

  useEffect(() => {
    if (!optimistic || seenOptimistic.current === optimistic.id) return;
    seenOptimistic.current = optimistic.id;
    setSubmissions((current) => {
      if (current.some((item) => item.id === optimistic.id)) return current;
      return [optimistic, ...current];
    });
  }, [optimistic]);

  const clearAll = useCallback(async () => {
    if (
      !window.confirm(
        "Delete all submissions from the store? This cannot be undone.",
      )
    ) {
      return;
    }

    setClearing(true);
    onClearingChange?.(true);
    setError("");
    try {
      const res = await fetch("/api/cc-chat", { method: "DELETE" });
      if (!res.ok) throw new Error("clear failed");
      const generationHeader = res.headers.get("X-Cc-Chat-Generation");
      if (generationHeader) {
        const generation = Number(generationHeader);
        if (Number.isFinite(generation)) {
          generationRef.current = generation;
        }
      }
      setSubmissions([]);
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel(CHANNEL);
        channel.postMessage({ type: "cleared" });
        channel.close();
      }
      onCleared?.();
      void load();
    } catch {
      setError("Couldn’t clear submissions.");
    } finally {
      setClearing(false);
      onClearingChange?.(false);
    }
  }, [load, onCleared, onClearingChange]);

  useEffect(() => {
    registerClear?.(() => {
      void clearAll();
    });
    return () => registerClear?.(null);
  }, [clearAll, registerClear]);

  return (
    <section className="mt-10 w-full min-w-0">
      <h2 className="text-xl font-semibold text-[#1a1f25]">Submissions</h2>
      {error ? (
        <p className="mt-3 text-sm text-red-700">{error}</p>
      ) : null}
      {submissions.length === 0 && !error ? (
        <p className="mt-3 text-sm text-slate-500">No submissions yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {submissions.map((item) => (
            <li
              key={item.id}
              className="w-full min-w-0 break-words rounded-xl border border-[#1a1f25]/10 bg-white/70 px-4 py-3 text-base text-[#1a1f25]"
            >
              <p className="whitespace-pre-wrap">{item.body}</p>
              <p className="mt-2 text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function CcChatClient({ qrDataUrl }: { qrDataUrl: string }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [optimistic, setOptimistic] = useState<Submission | null>(null);
  const [clearing, setClearing] = useState(false);
  const clearFnRef = useRef<(() => void) | null>(null);

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <p className="min-w-0 flex-1 break-words text-base text-slate-600 sm:text-lg">
          Put your prompt in here and click send.
        </p>
        <button
          type="button"
          onClick={() => clearFnRef.current?.()}
          disabled={clearing}
          className="shrink-0 rounded-full border border-red-700/30 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {clearing ? "Clearing…" : "Clear"}
        </button>
      </div>

      <figure className="mb-8 flex flex-col items-center">
        <img
          src={qrDataUrl}
          alt="QR code linking to this page"
          width={280}
          height={280}
          className="h-56 w-56 rounded-xl bg-white p-3 shadow-sm sm:h-64 sm:w-64"
        />
        <figcaption className="mt-2 text-center text-xs text-slate-500">
          Scan to open
        </figcaption>
      </figure>

      <CcChatForm
        onOptimisticSubmit={setOptimistic}
        onSubmitted={() => setRefreshKey((value) => value + 1)}
      />
      <CcChatSubmissions
        refreshKey={refreshKey}
        optimistic={optimistic}
        onCleared={() => {
          setOptimistic(null);
          setRefreshKey((value) => value + 1);
        }}
        registerClear={(fn) => {
          clearFnRef.current = fn;
        }}
        onClearingChange={setClearing}
      />
    </>
  );
}
