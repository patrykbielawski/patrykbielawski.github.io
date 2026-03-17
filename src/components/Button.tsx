import type {ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "outline" | "ghost";
type HTMLButtonType = "button" | "submit" | "reset";

interface ButtonProps {
    children?: ReactNode;
    to?: string;
    onClick?: React.MouseEventHandler<any>;
    variant?: ButtonVariant;
    className?: string;
    type?: HTMLButtonType;
}

const Button = ({
    children,
    to,
    onClick,
    variant = "primary",
    className = "",
    type = "button",
}: ButtonProps) => {
    const baseStyles = "p-3 uppercase cursor-pointer font-bold tracking-widest text-shadow-sm/50 transition-all duration-300 hover:scale-105 hover:text-shadow-sm/50 active:scale-95 text-sm text-center inline-block";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-brand-red text-white hover:bg-red-800 border-2 border-transparent hover:border-brand-gold",
        outline: "border-2 border-brand-gold text-white text-shadow-sm/80 hover:bg-brand-gold hover:text-brand-red hover:border-brand-red/80",
        ghost: "text-light-text",
    };

    const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

    const isExternal = to?.startsWith("http");

    if (to) {
        if (isExternal) {
            return (
                <a
                    href={to}
                    onClick={onClick}
                    className={combinedStyles}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            );
        }
        return (
            <Link to={to} onClick={onClick} className={combinedStyles}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={combinedStyles}>
            {children}
        </button>
    );
};

export default Button;