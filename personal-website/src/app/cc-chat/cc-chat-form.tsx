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
      setMessage("Write something before sending.");
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
      setMessage("Saved.");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
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
          if (status !== "idle" && status !== "submitting") {
            setStatus("idle");
            setMessage("");
          }
        }}
        className="box-border max-h-[50vh] min-h-[10rem] w-full max-w-full min-w-0 resize-y rounded-xl border border-[#1a1f25]/15 bg-white/80 px-3 py-3 text-base leading-relaxed text-[#1a1f25] shadow-sm outline-none transition focus:border-[#1f403c] focus:ring-2 focus:ring-[#1f403c]/20 sm:px-4"
        disabled={status === "submitting"}
      />
      <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-[#1f403c] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#16332f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-2.5"
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
        {message ? (
          <p
            className={
              status === "error"
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
