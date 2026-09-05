import type { Metadata } from "next";
import { CcChatForm } from "./cc-chat-form";

export const metadata: Metadata = {
  title: "CC Chat",
  description: "Drop a prompt or note for the live chat session.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CcChatPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-14 sm:pt-20">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Live session
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-[#1a1f25] sm:text-4xl">
          CC Chat
        </h1>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Share a prompt or note. No name needed — just the text gets saved.
        </p>
      </header>

      <CcChatForm />
    </main>
  );
}
