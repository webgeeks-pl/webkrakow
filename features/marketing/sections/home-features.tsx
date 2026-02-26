import { LucideIcon } from "@/components/base/lucide-icons";
import NeonContainer from "@/components/base/neon-container";
import NeonText from "@/components/base/neon-text";
import Section, {
    SectionContent,
    SectionHeader,
    SectionHeaderContent,
    SectionLead,
    SectionTitle,
} from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const features = [
    {
        title: "Mobile First Design",
        description:
            "Budujemy Twoją stronę od wersji mobilnej, dbając o czysty i zoptymalizowany kod bez zbędnego balastu — dzięki temu strona jest szybsza i bardziej responsywna.",
        cta: "Rozpocznij",
        icon: "Smartphone",
    },
    {
        title: "W pełni responsywna",
        description:
            "Twoja strona będzie idealnie wyglądać na każdym ekranie — smartfonie, tablecie i komputerze — zapewniając odwiedzającym doskonałe wrażenia niezależnie od urządzenia.",
        cta: "Rozpocznij",
        icon: "Layers",
    },
    {
        title: "Szybkość ładowania",
        description:
            "Jeśli strona ładuje się dłużej niż 3 sekundy, możesz stracić nawet 50% ruchu. Nasze strony ładują się w mniej niż sekundę, dzięki czemu nikt nie odejdzie z pustymi rękami.",
        cta: "Więcej o szybkości",
        icon: "Zap",
    },
    {
        title: "Usługi SEO",
        description:
            "Nasz specjalista SEO rozumie lokalne pozycjonowanie i wie, jak wypromować Twoją firmę na rynku lokalnym — z case studies i comiesięcznymi raportami.",
        cta: "Więcej o SEO",
        icon: "Search",
    },
    {
        title: "Reklamy Google PPC",
        description:
            "Oferujemy tworzenie i zarządzanie kampaniami Google Ads — nasz ekspert tworzy skuteczne reklamy, które maksymalizują zwrot z inwestycji.",
        cta: "Więcej o reklamach",
        icon: "DollarSign",
    },
    {
        title: "Z siedzibą w Polsce",
        description:
            "Nie zatrudniamy tanich zagranicznych deweloperów. Nasz zespół pracuje w 100% zdalnie z Polski, zapewniając najwyższą jakość i bezpośredni kontakt.",
        cta: "Więcej o nas",
        icon: "MapPin",
    },
];

export default function HomeFeatures() {
    return (
        <Section className="pb-size-xl pt-size-sm">
            <SectionContent>
                <SectionHeader>
                    <SectionHeaderContent>
                        <Badge variant={"neon"}>Czym się zajmuję</Badge>
                        <SectionTitle>
                            <NeonText
                                glowSpread={0.25}
                                flickerCount={5}
                                className="uppercase"
                                trigger="inView"
                                text="Nie martw się o swoją stronę internetową"
                            />
                        </SectionTitle>
                        <SectionLead>
                            Oferujemy profesjonalne usługi tworzenia stron internetowych,
                            które pomogą Twojej firmie zaistnieć w sieci. Skontaktuj się z
                            nami, aby dowiedzieć się więcej!
                        </SectionLead>
                    </SectionHeaderContent>
                </SectionHeader>

                <div className="mt-12 grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            data-neon-trigger="features"
                            className="group"
                        >
                            <Card className="bg-background rounded-xl transition-colors duration-300">
                                <CardHeader className="gap-4">
                                    <NeonContainer
                                        trigger="hover"
                                        triggerSelector="[data-neon-trigger=features]"
                                        ignitionSpeed={0.4}
                                        shutdownSpeed={0.4}
                                        glowSpread={0.4}
                                        flickerInterval={[4, 10]}
                                        flickerDepth={0.5}
                                        className="h-fit w-fit rounded-xl border-transparent! p-2"
                                    >
                                        <LucideIcon
                                            name={feature.icon}
                                            className="text-neon-cyan h-12 w-12"
                                        />
                                    </NeonContainer>
                                    <CardTitle>
                                        <NeonText
                                            text={feature.title}
                                            trigger="hover"
                                            triggerSelector="[data-neon-trigger=features]"
                                            glowSpread={0.4}
                                            flickerCount={2}
                                            flickerInterval={[4, 10]}
                                            flickerDepth={0.5}
                                            offColor="fff"
                                            ignitionSpeed={0.4}
                                            shutdownSpeed={0.4}
                                            className="text-xl uppercase"
                                        />
                                    </CardTitle>
                                    <CardDescription>
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="py-size-sm">
                                    <Button
                                        variant="outline"
                                        size="marketing"
                                        // className="underline underline-offset-6"
                                    >
                                        {feature.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>

                <Button variant="neon" size="marketing" className="mx-auto mt-12">
                    Zobacz wszystkie usługi
                </Button>
            </SectionContent>
        </Section>
    );
}
