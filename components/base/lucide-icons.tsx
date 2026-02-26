import { FileQuestionMarkIcon, type LucideProps } from "lucide-react";
import dynamic from "next/dynamic";
import {
    memo,
    type ComponentType,
    type ForwardRefExoticComponent,
    type RefAttributes,
} from "react";

type LucideIcon = ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

// Cache dla dynamicznych ikon - zapobiega ponownemu tworzeniu przy każdym renderze
const iconCache = new Map<string, ComponentType<LucideProps>>();

function getCachedIcon(name: string): ComponentType<LucideProps> {
    if (iconCache.has(name)) {
        return iconCache.get(name)!;
    }

    const Icon = dynamic<LucideProps>(() =>
        import("lucide-react").then((mod) => {
            const IconComponent = mod[name as keyof typeof mod] as LucideIcon;
            if (!IconComponent) {
                console.error(`LucideIcon '${name}' not found`);
                return mod.FileQuestionMarkIcon;
            }
            return IconComponent;
        })
    );

    iconCache.set(name, Icon);
    return Icon;
}

interface IconProps extends LucideProps {
    name: keyof typeof import("lucide-react") | string;
}

export const LucideIcon = memo(function LucideIcon({ name, ...props }: IconProps) {
    const Icon = getCachedIcon(name);
    // eslint-disable-next-line react-hooks/static-components
    return <Icon {...props} />;
});

export function getLucideIcon(name: string | null): ComponentType<LucideProps> {
    if (!name) {
        console.error("LucideIcon name is null");
        return FileQuestionMarkIcon;
    }

    return getCachedIcon(name);
}
