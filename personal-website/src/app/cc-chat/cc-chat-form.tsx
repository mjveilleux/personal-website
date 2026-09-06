"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Submission = {
  id: string;
  body: string;
  createdAt: string;
};

type Props = {
  onSubmitted?: () => void;
};

export function CcChatForm({ onSubmitted }: Props) {
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

    // Optimistic: clear immediately, save in the background.
    setText("");
    setIsError(false);
    setMessage("Saved.");

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

export function CcChatSubmissions({ refreshKey = 0 }: { refreshKey?: number }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/cc-chat", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as Submission[];
      setSubmissions(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Couldn’t load submissions.");
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => {
      void load();
    }, 4000);
    return () => window.clearInterval(id);
  }, [load, refreshKey]);

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

export function CcChatClient() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CcChatForm onSubmitted={() => setRefreshKey((value) => value + 1)} />
      <CcChatSubmissions refreshKey={refreshKey} />
    </>
  );
}
