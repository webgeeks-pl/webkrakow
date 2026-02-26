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

const performanceItems = [
    {
        icon: "TrendingUp",
        text: "Lepszy czas ladowania oznacza wiecej ruchu i wiecej konwersji w dluzszej perspektywie.",
    },
    {
        icon: "Search",
        text: "Szybsze strony pomagaja poprawic SEO i wyniki Twoich kampanii Google Ads.",
    },
    {
        icon: "Zap",
        text: "Nasze strony laduja sie natychmiast, ponizej 1 sekundy, co poprawia doswiadczenie uzytkownika i konwersje.",
    },
];

export default function HomePerformance() {
    return (
        <Section className="pb-size-xl pt-size-sm">
            <SectionContent>
                <SectionHeader>
                    <SectionHeaderContent>
                        <Badge variant={"neon"}>Wydajnosc</Badge>
                        <SectionTitle>
                            <NeonText
                                glowSpread={0.25}
                                flickerCount={5}
                                className="uppercase"
                                trigger="inView"
                                text="Budujemy lepsze strony, ktore dzialaja szybciej"
                            />
                        </SectionTitle>
                        <SectionLead>
                            Jesli chodzi o czas ladowania, niewielu osiaga wyniki Google
                            PageSpeed takie jak my przy kazdej realizacji. Sprawdz czas
                            ladowania swojej strony w Google PageSpeed Insights i zobacz,
                            ile punktow zdobywa teraz Twoja witryna.
                        </SectionLead>
                    </SectionHeaderContent>
                </SectionHeader>

                <div className="mt-10 grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        {performanceItems.map((item) => (
                            <div key={item.text} className="flex gap-4">
                                <div className="mt-1">
                                    <LucideIcon
                                        name={item.icon}
                                        className="text-neon-cyan h-5 w-5"
                                    />
                                </div>
                                <p className="text-muted-foreground">{item.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-start justify-center lg:justify-end">
                        <Button variant="neon" size="marketing">
                            Zacznij juz dzis
                        </Button>
                    </div>
                </div>
            </SectionContent>
        </Section>
    );
}
