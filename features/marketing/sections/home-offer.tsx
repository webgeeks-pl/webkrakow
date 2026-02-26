import { LucideIcon } from "@/components/base/lucide-icons";
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

const offerItems = [
    {
        title: "100% bezpieczne",
        description:
            "Nasze strony to statyczny HTML i CSS, więc dosłownie nie ma czego zhakować.",
    },
    {
        title: "Projekt na zamówienie",
        description:
            "Projekty tworzy nasz wewnętrzny zespół, dzięki czemu możemy zaprojektować wszystko.",
    },
    {
        title: "Wyniki PageSpeed 100",
        description:
            "Zero balastu, zero marnotrawstwa — strony budujemy z myślą o wyniku 98-100/100.",
    },
    {
        title: "Gwarancja zwrotu pieniędzy",
        description:
            "Jeśli nie zaprojektujemy czegoś, co Ci się podoba, oddajemy pieniądze i kończymy umowę.",
    },
    {
        title: "Niespotykane wsparcie",
        description:
            "Dzwoń lub pisz kiedy chcesz — bez automatów. Odbieram ja: właściciel i developer.",
    },
    {
        title: "Znamy SEO",
        description:
            "Bez ściemy i magicznych trików. Tłumaczymy jasno, czym jest SEO i co realnie zrobimy.",
    },
];

export default function HomeOffer() {
    return (
        <Section className="pb-size-xl pt-size-sm">
            <SectionContent>
                <SectionHeader>
                    <SectionHeaderContent>
                        <Badge variant={"neon"}>Co oferujemy</Badge>
                        <SectionTitle>
                            <NeonText
                                glowSpread={0.25}
                                flickerCount={5}
                                className="uppercase"
                                trigger="inView"
                                text="Strony od 0 USD na start i 175 USD miesięcznie"
                            />
                        </SectionTitle>
                        <SectionLead>
                            Oferujemy 0 USD na start dla standardowej, 5-stronicowej
                            strony firmowej. Jeśli potrzebujesz więcej, przygotujemy
                            wycenę na podstawie zakresu prac, liczby dodatkowych stron i
                            nakładu czasu. Minimalny kontrakt to 12 miesięcy. W cenie:
                            projekt, development, hosting, nielimitowane poprawki,
                            wsparcie 24/7 i dożywotnie aktualizacje.
                        </SectionLead>
                    </SectionHeaderContent>
                </SectionHeader>

                <div className="mt-10 grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        {offerItems.map((item) => (
                            <div key={item.title} className="flex gap-4">
                                <div className="mt-1">
                                    <LucideIcon
                                        name="Check"
                                        className="text-neon-cyan h-5 w-5"
                                    />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold uppercase">
                                        {item.title}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-start justify-center lg:justify-end">
                        <Button variant="neon" size="marketing">
                            Umów rozmowę
                        </Button>
                    </div>
                </div>
            </SectionContent>
        </Section>
    );
}
