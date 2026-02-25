import NeonText from "@/components/base/neon-text";
import Text from "@/components/base/text";
import Section, { SectionContent } from "@/components/layout/section";
import Lightning from "@/components/Lightning";
import Rain from "@/components/Rain";
import { Button } from "@/components/ui/button";

export default function HomeHero() {
    return (
        <Section className="h-screen min-h-screen overflow-hidden">
            <Rain count={250} speed={1.2} opacity={0.25} wind={6} className="z-15" />
            <div className="absolute top-0 -right-1/2 left-0 z-10 h-screen">
                <Lightning />
            </div>
            <div className="absolute top-0 right-0 left-0 z-15 h-screen bg-black/20" />
            <SectionContent className="z-20 flex h-full items-start justify-center">
                <div className="mb-[20vh] flex flex-col items-start gap-8">
                    {/* <Text variant="h1" className="text-4xl md:text-5xl lg:text-6xl">
                        Szybka strona dla Twojej firmy
                    </Text> */}
                    <NeonText
                        text="Szybka strona dla Twojej firmy"
                        font="heading"
                        className="text-4xl md:text-5xl lg:text-6xl"
                        glowSpread={0.75}
                        flicker={true}
                        flickerCount={3}
                        flickerInterval={[6, 8]}
                        flickerDepth={0.6}
                        breathe={true}
                        breatheDeep={0.1}
                        breatheCount={[3, 5]}
                        breatheStrength={0.1}
                        breatheInterval={[2, 3]}
                        breatheGroupGap={[0.05, 0.1]}
                        breatheSpeed={0.1}
                    />
                    <Text variant="lead" className="max-w-prose text-xl!">
                        Oferujemy profesjonalne usługi tworzenia stron internetowych,
                        które pomogą Twojej firmie zaistnieć w sieci. Skontaktuj się z
                        nami, aby dowiedzieć się więcej!
                    </Text>
                    <div className="flex gap-8">
                        <Button variant="outline" size="marketing">
                            Zobacz ofertę
                        </Button>
                        <Button variant="neon" size="marketing">
                            Sprawdź nasze usługi
                        </Button>
                    </div>
                </div>
            </SectionContent>
        </Section>
    );
}
