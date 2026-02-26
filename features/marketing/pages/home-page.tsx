import Page from "@/components/layout/page";
import HomeFeatures from "../sections/home-features";
import HomeHero from "../sections/home-hero";
import HomeOffer from "../sections/home-offer";
import HomePerformance from "../sections/home-performance";
import HomePricing from "../sections/home-pricing";

export default function HomePage() {
    return (
        <Page className="bg-website-bg">
            <HomeHero />
            <HomeFeatures />
            <HomeOffer />
            <HomePerformance />
            <HomePricing />
        </Page>
    );
}
