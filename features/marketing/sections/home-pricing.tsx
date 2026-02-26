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
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const pricingPlans = [
    {
        title: "Jednorazowo",
        description: "Projekt i wdrozenie",
        price: "$3800",
        priceNote: "+$25/mies. hosting",
        cta: "Zacznij",
        items: [
            "Projekt i wdrozenie",
            "$25/mies. hosting",
            "$100 oplaty za kazda strone powyzej 5",
            "+$50/mies. dodatek nielimitowane poprawki",
            "+$250 dodanie bloga",
            "Wsparcie 24/7",
            "Dozywotnie aktualizacje",
        ],
    },
    {
        title: "Miesiecznie",
        description: "Projekt i wdrozenie",
        price: "$175",
        priceNote: "miesiecznie",
        cta: "Zacznij",
        items: [
            "Projekt i wdrozenie",
            "Hosting w cenie",
            "$100 oplaty za kazda strone powyzej 5",
            "+$250 dodanie bloga",
            "Nielimitowane poprawki",
            "Wsparcie 24/7",
            "Dozywotnie aktualizacje",
        ],
    },
    {
        title: "E-commerce",
        description: "Wlasny sklep Shopify",
        price: "$8k",
        priceNote: "od",
        cta: "Zacznij",
        items: [
            "Wlasny sklep Shopify",
            "Konfiguracja dowolnych aplikacji",
            "Zintegrowana wysylka",
            "Szkolenie Shopify krok po kroku",
            "Pelna edycja w CMS Shopify",
            "+$50/mies. nielimitowane poprawki",
            "Wsparcie 24/7",
        ],
    },
];

export default function HomePricing() {
    return (
        <Section className="pb-size-xl pt-size-sm">
            <SectionContent>
                <SectionHeader>
                    <SectionHeaderContent>
                        <Badge variant={"neon"}>Nasze ceny</Badge>
                        <SectionTitle>
                            <NeonText
                                glowSpread={0.25}
                                flickerCount={5}
                                className="uppercase"
                                trigger="inView"
                                text="Pakiety cenowe na kazdy budzet"
                            />
                        </SectionTitle>
                        <SectionLead>
                            Wybierz model rozliczenia dopasowany do Twoich potrzeb i
                            skali projektu.
                        </SectionLead>
                    </SectionHeaderContent>
                </SectionHeader>

                <div className="mt-10 grid gap-8 lg:grid-cols-3">
                    {pricingPlans.map((plan) => (
                        <Card
                            key={plan.title}
                            className="bg-background/50 rounded-xl transition-colors duration-300"
                        >
                            <CardHeader className="gap-3">
                                <CardTitle className="text-xl uppercase">
                                    {plan.title}
                                </CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="pt-2">
                                    <p className="text-3xl font-semibold">{plan.price}</p>
                                    <p className="text-muted-foreground">
                                        {plan.priceNote}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardFooter className="flex flex-col items-start gap-6">
                                <div className="space-y-3">
                                    {plan.items.map((item) => (
                                        <div key={item} className="flex gap-3">
                                            <LucideIcon
                                                name="Check"
                                                className="text-neon-cyan h-5 w-5"
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="neon" size="marketing">
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </SectionContent>
        </Section>
    );
}
