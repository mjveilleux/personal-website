"use client";

import { FormEvent, useState } from "react";

export function CcChatForm() {
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
