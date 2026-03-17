import type { ReactNode } from "react";
import Card from "./Card";

interface ContactCardProps {
    children: ReactNode;
    title: string;
    icon: string;
    variant?: "red" | "gold";
    href?: string;
    className?: string;
}

const ContactCard = ({
    children,
    title,
    icon,
    variant = "red",
    href,
    className = ""
}: ContactCardProps) => {
    const styles = {
        container: `flex flex-col items-center justify-around text-center cursor-pointer py-2 border border-brand-red/30 bg-[rgba(0,0,0,0.8)] ${className}`,
        icon: `material-symbols-rounded text-brand-gold p-6`
    }
}