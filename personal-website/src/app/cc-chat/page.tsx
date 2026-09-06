import type { Metadata } from "next";
import QRCode from "qrcode";
import { CcChatClient } from "./cc-chat-form";

export const metadata: Metadata = {
  title: "CC Chat",
  description: "Put your prompt in here and click send.",
  robots: {
    index: false,
    follow: false,
  },
};

const PAGE_URL = "https://www.mveilleux.com/cc-chat";

export default async function CcChatPage() {
  const qrDataUrl = await QRCode.toDataURL(PAGE_URL, {
    width: 220,
    margin: 1,
    color: {
      dark: "#1a1f25",
      light: "#00000000",
    },
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <div className="mb-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="break-words text-base text-slate-600 sm:text-lg">
          Put your prompt in here and click send.
        </p>
        <figure className="mx-auto shrink-0 sm:mx-0">
          <img
            src={qrDataUrl}
            alt="QR code linking to this page"
            width={160}
            height={160}
            className="h-40 w-40 rounded-lg bg-white p-2 shadow-sm"
          />
          <figcaption className="mt-2 text-center text-xs text-slate-500">
            Scan to open
          </figcaption>
        </figure>
      </div>
      <CcChatClient />
    </main>
  );
}
