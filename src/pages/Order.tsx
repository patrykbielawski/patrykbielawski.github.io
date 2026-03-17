const Order = () => {
    return (
        <main className="bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?q=100&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center text-brand-red text-shadow-sm/60 2xl:text-shadow-lg/100 h-[90vh] flex flex-col items-center justify-center">
            <h2 className="text-4xl md:text-5xl 2xl:text-7xl my-8">Złóż zamówienie:</h2>
            <section className="text-center px-4 py-2">
                <div className="mt-6 flex flex-col gap-4 justify-around items-center sm:flex-row text-nowrap text-lg max-w-2xl mx-auto text-text-secondary">
                    <a href="tel:+48 535 086 908" className="2xl:text-2xl hover:text-brand-red hover:scale-105 outline outline-brand-red rounded font-roboto px-4 py-2 flex items-center bg-brand-gold shadow-sm/60 transition-all duration-300"><span className="material-symbols-rounded px-1">call</span>+48 535 086 908</a>
                    <span className="relative px-1 text-xl  2xl:text-2xl">LUB</span>
                    <a href="https://www.pyszne.pl/menu/strzal-w-10-tke?serviceType=delivery&utm_source=google&utm_medium=organic&utm_campaign=foodorder" className="2xl:text-2xl hover:text-brand-red hover:scale-105 outline outline-brand-red rounded font-roboto px-4 py-2 flex items-center bg-brand-gold shadow-sm/60 transition-all duration-300"><span className="material-symbols-rounded px-1">food_bank</span>Pyszne.pl</a>
                </div>
            </section>
        </main>
    )
}

export default Order;