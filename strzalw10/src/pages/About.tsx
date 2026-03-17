import Carousel from "../components/Carousel";

const About = () => {

    const mySlides = [
        {
            url: "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/651900397_1370222751575540_5703464613067046510_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=fkyBzdxSO4sQ7kNvwEkgkLb&_nc_oc=AdkqewSdxpjAK6l2qOG526cticS-iMrrN-9sIG9Cx-oyM9DentMYzMtTjprfzxxPY2wfMT_KgRIp2HJg_hu9gI-t&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=sjHT11z3l3mDBzGddBqEZQ&_nc_ss=8&oh=00_Afx6gxzFm_JrDANmPx2e8xK6043rIebV8OgblLFc90aICQ&oe=69BB516F"
        },
        {
            url: "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/645333596_1363566118907870_8476557288852696477_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=kP_bAzJ7UPYQ7kNvwG-f_hf&_nc_oc=AdmpQMuR6GN0dTM1VyLGel1D59nLszswn6-V41I74iMvKOwyN8v_O6AqWIrDB1R2Hyd2ftPckTtEoa3-xMoJZMir&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=oXhFr2mUAiThdhw80AztdA&_nc_ss=8&oh=00_AfxuEAmfG3CePFhbyyF522z3o06Geuar4K9duKeeVf_qtw&oe=69BB3C2D"
        },
        {
            url: "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/637111260_1352322150032267_7778228299753005167_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=wJdZjl4xhZYQ7kNvwGiB7-f&_nc_oc=AdmedSNeOSx5LG-KKkn9jJuHApjkHsrAzZ1PJL9G-pdb00VZF_xoTefoUOrr9eJkS1PET_-7N1pWnkQJ3U3m37Zz&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=CUou0Gq9K-0ZCP7RPLWEHQ&_nc_ss=8&oh=00_Afx0bJZP1m_g__vXNDWV9q8w7bOxPPNxMoMWr2enpkkShA&oe=69BB5A09"
        },
        {
            url: "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/573975121_1266755901922226_8865093787502324062_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=S9HnkKBAguYQ7kNvwEd1Kx_&_nc_oc=AdnFf-VwIitWebUNHG08UmTE9jb9Ef1YPWXdp-szBXm1BCUfPZ8XRkEJAVl05vTcoSHa7CRr2dBU0iPVo5-x_GmY&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=A_WKlcjxylnZR5EXbZQyEQ&_nc_ss=8&oh=00_AfwRcARg_GpSZOZMEv6_6EBPdvx8he-gNQPkAxOfpxqO-Q&oe=69BB6B75"
        },
        {
            url: "https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/481907344_1080138603917291_4390335296779144617_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_ohc=8sMmhO2IN6UQ7kNvwHpvLBJ&_nc_oc=AdlMCZOO3xkq3D8-tOrolF3CaofU1oby9TsrLtdPHq27Rat2GZs62Hh7va9WHmzqSFb3BZk0AtH6fVQvoE4YwWCq&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=RIrsjxna5WrEpULRg28fvA&_nc_ss=8&oh=00_AfydT4mjxmAtqYMWJh3gtm54VPcC3z_LJ-_JkVS3k9__Xw&oe=69BB26C6"
        },
        {
            url: "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/480665443_1075399804391171_2769165756896337733_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=K5lSd83fKHgQ7kNvwH9tovN&_nc_oc=AdnoMpAS6rxnWdv0Cuppgus3hvi6pqYzZPq_pb2aIuufLAMdqttPWQAC3L6UQZ0-_7GNMGgiM1iFCDsl9Oue9D9S&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=zL06VF1fyu_fHbZFdBKdiQ&_nc_ss=8&oh=00_AfwSWh4AuCr5QPlUWuAxjjCQVD3d8ehKocL4K1SbJUxa3g&oe=69BB5714"
        },
    ];

    return (
        <main className="flex flex-col gap-8 items-center justify-center text-center divide-solid divide-y-2 divide-brand-red/70 min-h-screen mx-auto px-4 py-16 bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/475034338_1055845579679927_6739405856868333375_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=2a1932&_nc_ohc=0QaQMv7FagcQ7kNvwGtdCcd&_nc_oc=AdkDD95kMGYzzY08je_zKEBiJhcvyI4mjv3s3fbSvDIxV_fbR_K8_GK9NgT5DWa4UFX_yLHyIhV63JAS0k_4NVtw&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=G2nmhd2Snay11XnYJFCgCA&_nc_ss=8&oh=00_Afz4iMkiVIWwFPNkU6C5pTBCMij7IEN1CDRLHlijeEIUCA&oe=69BB3570')] bg-cover bg-center">
            <section className="max-w-7xl flex flex-col justify-center items-center">
                <h1 className="text-5xl md:text-7xl 2xl:text-9xl font-bebas text-brand-red text-shadow-md/80 uppercase leading-none mb-8">
                    O nas:
                </h1>
                <p className="text-lg md:text-xl 2xl:text-3xl font-roboto text-text-primary text-shadow-md/80 mb-8 italic max-w-3xl text-center">
                    <p className="font-bold text-xl md:text-2xl 2xl:text-5xl text-brand-gold mb-8">Zatrzymaj się, zjedz, odpocznij.</p>
                    Jesteśmy czymś więcej niż tylko punktem na mapie. To miejsce stworzone dla pasjonatów drogi, którzy cenią uczciwe porcje i swobodną atmosferę. Niezależnie od tego, czy potrzebujesz krótkiej przerwy na espresso, czy solidnego obiadu przed trasą – nasze drzwi są dla Ciebie zawsze otwarte.
                </p>
            </section>
            <section className="w-[90%]">
                <Carousel slides={mySlides} />
            </section>
        </main>
    )
}

export default About;