export default function Video() {
    return (
        <div>
            <section className="video-section">
                <h2 className="video-section-title">Video Gallery</h2>
                <div className="video-grid">
                    <div className="video-item">
                        <div className="video-iframe-wrapper">
                            <iframe
                                width="560" height="315"
                                loading="lazy"
                                src="https://www.youtube.com/embed/KGdrgTVzeKk?si=XKxTIRHnbu_PefNu"
                                title="Video 1"
                                // frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            // allowfullscreen
                            ></iframe>
                        </div>
                        <div className="texto-video">
                            <img src="/assets/img/balonDorado.png" alt="isotype IFX Soccer" />
                            <p className="video-desc">Descripción del video 1</p>
                        </div>
                    </div>
                    <div className="video-item">
                        <div className="video-iframe-wrapper">
                            <iframe
                                width="560" height="315"
                                loading="lazy"
                                src="https://www.youtube.com/embed/THXM93j54nA?si=gAvuWKcPaZZXzJA9"
                                title="Video 2"
                                // frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            // allowfullscreen
                            ></iframe>
                        </div>
                        <div className="texto-video">
                            <img src="/assets/img/balonDorado.png" alt="isotype IFX Soccer" />
                            <p className="video-desc">Descripción del video 2</p>
                        </div>
                    </div>
                    <div className="video-item">
                        <div className="video-iframe-wrapper">
                            <iframe
                                width="560" height="315"
                                loading="lazy"
                                src="https://www.youtube.com/embed/KSL3D8Q7ni8?si=Szg7VoHhXfc-ZlZ9"
                                title="Video 3"
                                // frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            // allowfullscreen
                            ></iframe>
                        </div>
                        <div className="texto-video">
                            <img src="/assets/img/balonDorado.png" alt="isotype IFX Soccer" />
                            <p className="video-desc">Descripción del video 3</p>
                        </div>
                    </div>
                </div>
                <div className="dosbotones">
                    <a href="#" className="boton"><i className="fa-brands fa-youtube"></i> More Video Galleries</a>
                </div>
            </section>
            <section className="imagen-videogallery">
                <a href="#" className="boton-youtube"><i className="fa-brands fa-youtube"></i> Follow Us On YouTube</a>
            </section>
        </div>
    );
}
