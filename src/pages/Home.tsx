import Button from "../components/Button";

const Home = () => {
    return (
        <main className="bg-bg-primary text-text-primary min-h-screen divide-solid divide-y-2 divide-brand-red/60">
            <section className="relative h-screen flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=100&w=2070')] bg-cover bg-center" />

                <div className="relative z-20 text-center px-4">
                    <h1 className="text-5xl md:text-7xl 2xl:text-9xl font-bebas text-text-primary text-shadow-md/80 uppercase leading-none mb-6">
                        Smak, który trafia w <span className="text-brand-red">10</span>-tkę!
                    </h1>
                    <p className="text-lg md:text-xl 2xl:text-3xl 2xl:max-w-5xl font-roboto text-text-primary text-shadow-md/80 mb-8 italic max-w-2xl mx-auto">
                        Od pysznych śniadań po sycące obiady - dla każdego coś dobrego! Sprawdź nasze menu i zamów już dziś, aby przekonać się, że strzał w 10-tkę to coś więcej niż tylko nazwa - to smak, który trafia w samo sedno!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button to="/menu" variant="primary" className="2xl:text-xl font-roboto">Zobacz Menu</Button>
                        <Button to="/order" variant="outline" className="2xl:text-xl font-roboto">Zamów Teraz!</Button>
                    </div>
                </div>
            </section>
            <section className="h-screen py-16 px-4 flex flex-col items-center justify-center text-center bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('https://images.unsplash.com/photo-1705331338418-70ba954573de?q=100&w=1934&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center ">
                <h2 className="text-3xl sm:text-5xl 2xl:text-7xl font-bebas text-text-primary text-shadow-md/80 uppercase leading-none mb-6">
                    Organizujemy imprezy okolicznościowe oraz catering!
                </h2>
                <p className="text-base sm:text-lg md:text-xl 2xl:text-3xl 2xl:max-w-5xl font-roboto text-text-primary text-shadow-md/80 italic mb-8 max-w-2xl mx-auto">
                    Planujesz urodziny, komunię, czy firmowy event? Skontaktuj się z nami w celu uzyskania szczegółów!
                </p>
                <Button to="/contact" variant="primary" className="2xl:text-xl font-roboto">Kontakt</Button>
            </section>
            <section className="h-screen py-16 px-4 flex flex-col items-center justify-center text-center bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('https://images.unsplash.com/photo-1656164631668-8673eab87b84?q=100&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
                <h2 className="text-4xl sm:text-5xl md:text-7xl 2xl:text-9xl font-bebas text-text-primary text-shadow-md/80 uppercase leading-none mb-6">
                    Sprawdź nas na Facebooku!
                </h2>
                <Button to="https://www.facebook.com/p/Strza%C5%82-w-10-tk%C4%99-100057634831739/?locale=pl_PL" variant="primary" className="2xl:text-xl font-roboto">Zobacz nasz profil!</Button>
            </section>
            <section className="py-16 px-8 grid grid-cols-1 md:grid-cols-3 text-shadow-md/80 gap-8 max-w-6xl mx-auto">
                <div className="text-center">
                    <h3 className="text-brand-gold font-bold font-roboto uppercase mb-2 2xl:text-2xl">Gdzie jesteśmy:</h3>
                    <p className="2xl:text-lg font-roboto">ul. Kujawska 52 (stacja Circle K)</p>
                    <p className="2xl:text-lg font-roboto">86-050 Solec Kujawski</p>
                </div>
                <div className="text-center">
                    <h3 className="text-brand-gold font-bold font-roboto uppercase mb-2 2xl:text-2xl">Godziny otwarcia:</h3>
                    <p className="2xl:text-lg font-roboto">Pn-Pt: 08:00-20:00</p>
                    <p className="2xl:text-lg font-roboto">Sb-Nd: 11:00-18:00</p>
                </div>
                <div className="text-center">
                    <h3 className="text-brand-gold font-bold font-roboto uppercase mb-2 2xl:text-2xl">Kontakt:</h3>
                    <p className="2xl:text-lg font-roboto hover:scale-105 hover:text-brand-red hover:text-shadow-md/50 transition-all duration-300"><a href="tel:+48 535 086 908">+48 535 086 908</a></p>
                </div>
            </section>
            
        </main>
    )
}

export default Home;