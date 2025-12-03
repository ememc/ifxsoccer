export default function Destination() {
    return (
        <div>
            <section className="destinations">
                <div className="contenedor">
                    <h2>Destinations</h2>
                    <div className="photo-grid">

                        <div className="country">
                            <img src="/assets/img/photo6.jpg" alt="Photo 1" loading="lazy" />
                            <h4>Germany</h4>
                            <div className="cities">
                                <a href="#"><span>Nürnberg</span></a> |
                                <a href="#"><span>Fürth</span></a> |
                                <a href="#"><span className="active">Köln</span></a>

                            </div>
                        </div>

                        <div className="country">
                            <img src="/assets/img/photo5.jpg" alt="Photo 5" loading="lazy" />
                            <h4>Spain</h4>
                            <div className="cities">
                                <a href="#"><span>Madrid</span></a> |
                                <a href="#"><span>Cádiz</span></a> |
                                <a href="#"><span>Zaragoza</span></a> |
                                <a href="#"><span className="active">Barcelona</span></a>

                            </div>
                        </div>

                        <div className="country">
                            <img src="/assets/img/photo4.jpg" alt="Photo 4" loading="lazy" />
                            <h4>England</h4>
                            <div className="cities">
                                <a href="#"><span>London</span></a> |
                                <a href="#"><span>Portsmouth</span></a> |
                                <a href="#"><span>Bournemouth</span></a> |
                                <a href="#"><span className="active">Isle of Wight</span></a>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="imagen-destinations">
                <h2>...the real experience of playing Soccer Internationally</h2>
            </section>
        </div>
    );
}
