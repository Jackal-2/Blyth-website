import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturesRing from "@/components/FeaturesRing";
import TrustBar from "@/components/TrustBar";
import ClearPrices from "@/components/ClearPrices";
import HelperCategories from "@/components/HelperCategories";
import Faq from "@/components/Faq";
import BottomCta from "@/components/BottomCta";
import { shareQrCodeSvg } from "@/lib/qrCode";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blythapp.com";

export default async function Home() {
  // For visitors on a computer: scan to open the site on their phone, where
  // the download buttons are.
  const qrSvg = await shareQrCodeSvg(SITE_URL);

  return (
    <main>
      <Hero />
      <HowItWorks />
      <FeaturesRing />
      <TrustBar />
      <ClearPrices />
      <HelperCategories />
      <Faq />
      <BottomCta qrSvg={qrSvg} />
    </main>
  );
}
