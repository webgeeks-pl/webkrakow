import Page from "@/components/layout/page";
import HomeClients from "../sections/home-clients";
import HomeHero from "../sections/home-hero";

export default function HomePage() {
    return (
        <Page className="bg-website-bg">
            <HomeHero />
            <HomeClients />
        </Page>
    );
}
