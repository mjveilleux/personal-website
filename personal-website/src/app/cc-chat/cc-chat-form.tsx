"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function CcChatForm() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = text.trim();
    if (!body) {
      setStatus("error");
      setMessage("Write something before submitting.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/cc-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setText("");
      setStatus("success");
      setMessage("Saved. Thanks — you can submit another if you want.");
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label htmlFor="cc-chat-body" className="sr-only">
        Your prompt or note
      </label>
      <textarea
        id="cc-chat-body"
        name="body"
        rows={10}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          if (status !== "idle" && status !== "submitting") {
            setStatus("idle");
            setMessage("");
          }
        }}
        placeholder="Paste or write your prompt here…"
        className="w-full resize-y rounded-xl border border-[#1a1f25]/15 bg-white/80 px-4 py-3 text-base text-[#1a1f25] shadow-sm outline-none transition focus:border-[#1f403c] focus:ring-2 focus:ring-[#1f403c]/20"
        disabled={status === "submitting"}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-[#1f403c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#16332f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Saving…" : "Submit"}
        </button>
        {message ? (
          <p
            className={
              status === "error"
                ? "text-sm text-red-700"
                : "text-sm text-[#1f403c]"
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
