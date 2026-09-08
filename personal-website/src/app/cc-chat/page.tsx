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
    width: 360,
    margin: 1,
    color: {
      dark: "#1a1f25",
      light: "#00000000",
    },
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <CcChatClient qrDataUrl={qrDataUrl} />
    </main>
  );
}
