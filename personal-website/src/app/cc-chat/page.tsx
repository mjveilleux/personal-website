import type { Metadata } from "next";
import { CcChatForm } from "./cc-chat-form";

export const metadata: Metadata = {
  title: "CC Chat",
  description: "Put your prompt in here and click send.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CcChatPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-14 sm:pt-20">
      <p className="mb-6 text-base text-slate-600 sm:text-lg">
        Put your prompt in here and click send.
      </p>
      <CcChatForm />
    </main>
  );
}
