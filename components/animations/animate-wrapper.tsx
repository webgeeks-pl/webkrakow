import { ReactNode } from "react";
import Animate from "./animate";
import AnimateMany from "./animate-many";

interface AnimateWrapperProps {
    children?: ReactNode;
    animate?: boolean;
    animateProps?: React.ComponentProps<typeof Animate>;
    many?: boolean;
}

export default function AnimateWrapper({
    children,
    animate,
    animateProps,
    many,
}: AnimateWrapperProps) {
    if (!animate) return children;
    const Wrapper = many ? AnimateMany : Animate;
    return <Wrapper {...animateProps}>{children}</Wrapper>;
}
