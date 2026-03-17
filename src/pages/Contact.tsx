import Card from "../components/Card";

const Contact = () => {
    return (
        <main className="
            flex flex-col text-center items-center justify-center min-h-screen px-4 py-16 gap-8 mx-auto
            bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('https://images.unsplash.com/photo-1634827557243-c9f9d707fba3?q=100&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]
            bg-cover bg-center divide-solid divide-y-2 divide-brand-red/70"
        >
            <section className="mb-8 w-[90%] max-w-7xl flex flex-col justify-center items-center">
                <h1 className="text-5xl md:text-7xl 2xl:text-9xl font-bebas text-brand-red text-shadow-md/80 uppercase leading-none mb-8">
                    Kontakt:
                </h1>
                <p className="text-sm md:text-xl 2xl:text-3xl italic text-shadow-md/80 font-roboto text-text-primary mb-8 max-w-3xl">
                    <p className="font-bold text-xl md:text-2xl 2xl:text-5xl text-brand-gold text-shadow-md/80 mb-8 max-w-3xl">
                        Chcesz zamówić catering, zorganizować imprezę okolicznościową, czy po prostu masz pytania?
                    </p>
                    Skontaktuj się z nami! Jesteśmy tu, aby pomóc i sprawić, że Twoje doświadczenie ze "Strzałem w <span className="text-brand-red">10</span>-tkę" będzie niezapomniane.
                </p>
            </section>
            <section className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-7xl w-[90%] mt-12">
                <Card className="flex flex-col  h-72 2xl:h-96 items-center justify-around text-center cursor-pointer py-2 border border-brand-red/30 bg-[rgba(0,0,0,0.8)]">
                    <div>
                        <span className="material-symbols-rounded text-brand-gold p-6">call</span>
                        <h3 className="text-2xl text-shadow-sm/80 font-bebas text-text-primary mb-8 tracking-wide 2xl:text-3xl">
                            Zadzwoń:
                        </h3>
                    </div>
                    <a 
                        href="tel:+48 535 086 908" 
                        className="
                            text-base font-bold font-roboto text-shadow-md/80 text-brand-gold hover:text-brand-red
                            transition-all duration-300 hover:scale-105 active:scale-95 after:absolute 2xl:text-xl 
                            w-full bg-brand-red/10 hover:bg-brand-gold/10
                            "
                    >
                        <p className="outline outline-brand-red rounded-md p-2 hover:outline-brand-gold">+48 535 086 908</p>
                    </a>
                </Card>
                <Card className="flex flex-col h-72 2xl:h-96 items-center justify-around text-center cursor-pointer py-2 border border-brand-red/30 bg-[rgba(0,0,0,0.8)]">
                    <div>
                        <span className="material-symbols-rounded text-brand-gold p-6">mail</span>
                        <h3 className="text-2xl 2xl:text-3xl text-shadow-sm/80 font-bebas text-text-primary mb-8 max-w-2xl tracking-wide">
                            Napisz:
                        </h3>
                    </div>
                    <a
                        href="mailto:kontakt@strzalwdziesiatke.pl"
                        className="
                            text-base font-bold font-roboto text-shadow-sm/80 text-brand-gold hover:text-brand-red
                            transition-all duration-300 hover:scale-105 active:scale-95 after:absolute 2xl:text-xl 
                            w-full bg-brand-red/10 hover:bg-brand-gold/10
                        "
                    >
                        
                        <p className="outline outline-brand-red rounded-md p-2 hover:outline-brand-gold">kontakt@strzalwdziesiatke.pl</p>
                    </a>
                </Card>
                <Card className="flex flex-col h-72 2xl:h-96 items-center justify-around text-center cursor-pointer py-2 border border-brand-red/30 bg-[rgba(0,0,0,0.8)]">
                    <div>
                        <span className="material-symbols-rounded text-brand-gold p-6">location_on</span>
                        <h3 className="text-2xl 2xl:text-3xl text-shadow-sm/80 font-bebas text-text-primary mb-8 max-w-2xl tracking-wide">
                            Przyjedź:
                        </h3>
                    </div>
                    <a
                        href="https://maps.app.goo.gl/zmoYgkAXcFBMAmBbA"
                        target="_blank"
                        className="
                            text-base font-bold font-roboto text-shadow-md/80 text-brand-gold hover:text-brand-red
                            transition-all duration-300 hover:scale-105 active:scale-95 after:absolute 2xl:text-xl 
                            w-full bg-brand-red/10 hover:bg-brand-gold/10
                        "
                    >
                        <p className="outline outline-brand-red rounded-md p-2 hover:outline-brand-gold bg-black/30">
                            Kujawska 52 
                                <p className="text-sm 2xl:text-lg">Solec Kujawski</p> 
                            (stacja Circle K)
                        </p>
                    </a>
                </Card>
            </section>
        </main>
    )
}

export default Contact;