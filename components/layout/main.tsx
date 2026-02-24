import { ReactNode } from "react";

export interface MainProps {
    children?: ReactNode;
    className?: string;
    id?: string;
}


export default function Main({ children, className }: MainProps) {
    return <main className={className}>{children}</main>;
}
