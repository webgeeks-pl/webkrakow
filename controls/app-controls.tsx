import { AnimationProvider } from "@/context/animation-context";
import NavigationProvider from "@/context/navigation-context";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

export default function AppControls({ children }: { children?: ReactNode }) {
    return (
        <>
            <AnimationProvider>
                <NavigationProvider>
                    <NextIntlClientProvider>
                        <>{children}</>
                    </NextIntlClientProvider>
                </NavigationProvider>
            </AnimationProvider>
            {/* <LenisControls /> */}
        </>
    );
}
