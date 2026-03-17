import { useEffect, useState } from "react";

export const useMobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen((prev) => !prev);
    const close = () => setIsOpen(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {document.body.style.overflow = "unset"; };
    }, [isOpen]);

    return { isOpen, toggle, close};
};