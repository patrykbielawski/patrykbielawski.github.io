import { Link } from "react-router-dom";
import Button from "./Button";
import { useMobileMenu } from "../hooks/useMobileMenu";
import logoImage from "../assets/logo.png";

const navLinks = [
    { name: "Start", href: "/"},
    { name: "Menu", href: "/menu"},
    { name: "Zamów teraz", to: "/order", isButton: true },
    { name: "O nas", href: "/about"},
    { name: "Kontakt", href: "/contact"},
];

const Navbar = () => {
    const { isOpen, toggle, close } = useMobileMenu();

    return (
        <nav className="flex items-center justify-between px-8 py-6 font-roboto bg-bg-primary border-b border-brand-red sticky top-0 z-50 h-20 2xl:h-30">
            <Link to="/" className="flex items-center gap-2 md:gap-4">
                <div className="w-12 sm:w-15 2xl:w-20 flex items-center justify-center">
                    <img src={logoImage} alt="logo"/>
                </div>
                <span className="text-lg md:text-2xl 2xl:text-5xl font-bebas font-black tracking-tighter text-text-primary">
                    Strzał w <span className="text-brand-red">10</span>-tkę
                </span>
            </Link>
            <div className={`md:hidden ${isOpen ? "hidden" : "block"} h-12 -mr-5`}>
                <Button variant="ghost" onClick={toggle} aria-expanded={isOpen} aria-label="Toggle menu">
                    <span className="material-symbols-rounded text-text-primary hover:text-brand-red transition-all duration-300">
                        menu
                    </span>
                </Button>
            </div>
            <div 
                className={`
                    md:hidden transition-all duration-300 ease-in-out transform fixed 
                    top-0 right-0 h-screen w-[75%] sm:w-[50%] z-60 shadow-2xl
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                    bg-bg-primary border-t border-brand-red
                `}
            >
                <div className="flex justify-end p-6">
                    <Button variant="ghost" onClick={close} aria-label="Close menu">
                        <span className="material-symbols-rounded text-text-primary hover:text-brand-red transition-all duration-300 text-3xl">
                            close
                        </span>
                    </Button>
                </div>
                <div className="px-2 pt-2 pb-3 space-y-6 sm:px-3 flex flex-col items-center">
                    {navLinks.map((link) => {
                        if (link.isButton) {
                            return (
                                <Button
                                    onClick={close}
                                    key={link.name}
                                    to={link.to}
                                    variant="ghost"
                                    className="
                                        w-[90%] text-left hover:text-brand-gold hover:outline
                                        hover:outline-brand-gold/60 hover:shadow-md/80
                                        focus:outline focus:outline-brand-gold/60 focus:scale-95 focus:duration-25 focus:text-brand-red
                                        rounded-xs border-b border-gray-600/80
                                    "
                                >
                                    {link.name}
                                </Button>
                            );
                        }

                        return (
                            <Link
                                key={link.name}
                                to={link.href || "/" }
                                className="
                                    w-[90%] text-left font-bold text-shadow-sm/50 hover:text-shadow-md/50 
                                    hover:text-brand-red hover:outline hover:outline-brand-red/80 focus:duration-25
                                    focus:outline focus:outline-brand-red/80 focus:scale-95 focus:text-brand-gold
                                    hover:shadow-md/80 hover:scale-105 active:scale-95 px-3 py-2 text-base transition-all 
                                    duration-300 rounded-xs border-b border-gray-600/80"
                                onClick={close}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="hidden md:flex 2xl:text-xl gap-4 items-center uppercase font-medium tracking-widest text-xs">
                    {navLinks.map((link) => {
                        if (link.isButton) {
                            return (
                                <Button
                                    key={link.name}
                                    to={link.to}
                                    variant="ghost"
                                    className="text-sm 2xl:text-xl hover:text-brand-red transition-all duration-300"
                                >
                                    {link.name}
                                </Button>
                            );
                        }

                        return (
                            <Link
                                key={link.name}
                                to={link.href || "/" }
                                className="
                                    hover:text-brand-red hover:scale-105 hover:text-shadow-md/50
                                    active:scale-95 transition-all duration-300
                                "
                            >
                                {link.name}
                            </Link>

                        )
                    })}
            </div>
        </nav>
    );
};

export default Navbar;