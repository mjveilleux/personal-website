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
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <p className="mb-6 break-words text-base text-slate-600 sm:text-lg">
        Put your prompt in here and click send.
      </p>
      <CcChatForm />
    </main>
  );
}
