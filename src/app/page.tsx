import Hero from "@/components/Hero";
import FeaturesRing from "@/components/FeaturesRing";
import TrustBar from "@/components/TrustBar";
import Testimonials from "@/components/Testimonials";
import MidCta from "@/components/MidCta";
import BottomCta from "@/components/BottomCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturesRing />
      <TrustBar />
      <Testimonials />
      <MidCta />
      <BottomCta />
    </main>
  );
}
