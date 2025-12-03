export default function News() {
    return (
        <section className="news">
            <h2>IFX Soccer Player News</h2>
            <div className="contenedor-news contenedor">
                <a href="#">
                    <div className="noti-principal">
                        <div className="title-header">
                            <h3>
                                Gianluca and Alberto Valle: Youth Talent Development Through a Soccer Year in Germany
                            </h3>
                        </div>
                        <picture className="first-new">
                            <source srcSet="/assets/img/noticia1.webp" type="image/webp" />
                            <source srcSet="/assets/img/noticia1.jpg" type="image/jpeg" />
                            <img loading="lazy" src="/assets/img/noticia1.jpg" alt="noticia principal" />
                        </picture>
                        <div className="excerpt">
                            <p>
                                Brothers Gianluca and Alberto Valle share their journey from Ecuador to Germany at Soccer City boarding school.
                            </p>
                        </div>
                    </div>
                </a>
                <div className="noti-secundarias">
                    <a href="#">
                        <div className="noticia2">
                            <picture className="first-new">
                                <source srcSet="/assets/img/noticia2.webp" type="image/webp" />
                                <source srcSet="/assets/img/noticia2.jpg" type="image/jpeg" />
                                <img loading="lazy" src="/assets/img/noticia2.jpg" alt="noticia principal" />
                            </picture>
                            <div className="excerpt">
                                <p>
                                    Brothers Gianluca and Alberto Valle share their journey from Ecuador to Germany at Soccer City boarding school.
                                </p>
                            </div>
                        </div>
                    </a>
                    <a href="#">
                        <div className="noticia3">
                            <picture className="first-new">
                                <source srcSet="/assets/img/noticia3.webp" type="image/webp" />
                                <source srcSet="/assets/img/noticia3.jpg" type="image/jpeg" />
                                <img loading="lazy" src="/assets/img/noticia3.jpg" alt="noticia principal" />
                            </picture>

                            <div className="excerpt">
                                <p>
                                    Brothers Gianluca and Alberto Valle share their journey from Ecuador to Germany at Soccer City boarding school.
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <a href="#" className="boton boton-news">More Player News</a>
        </section>
    );
}
