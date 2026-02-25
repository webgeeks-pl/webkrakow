import NeonText from "@/components/base/neon-text";
import Section, {
    SectionContent,
    SectionHeader,
    SectionHeaderContent,
    SectionLead,
    SectionTitle,
} from "@/components/layout/section";

export default function HomeClients() {
    return (
        <Section>
            <SectionContent>
                <SectionHeader>
                    <SectionHeaderContent>
                        <SectionTitle>
                            <NeonText
                                glowSpread={0.25}
                                flickerCount={5}
                                text="Strona dla twojego biznesu"
                            />
                        </SectionTitle>
                        <SectionLead>
                            Tworzę strony internetowe dla firm, które chcą zaistnieć w
                            sieci. Niezależnie czy prowadzisz małą lokalną kawiarnię, czy
                            dużą korporację, dostosuję stronę do Twoich potrzeb i pomogę
                            Ci dotrzeć do nowych klientów.
                        </SectionLead>
                    </SectionHeaderContent>
                </SectionHeader>
            </SectionContent>
        </Section>
    );
}
