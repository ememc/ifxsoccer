export default function Gallery() {
    return (
        <div>
            <section className="photo-gallery">
                <div className="contenedor">
                    <h2>Photo Gallery</h2>
                    <div className="photo-grid">
                        <a href="#">
                            <div className="photo-item">
                                <img src="/assets/img/photo1.jpg" alt="Photo 1" loading="lazy" />
                                <div className="photo-caption">
                                    <img src="/assets/img/balonDorado.png" className="balon" alt="isotype IFX Soccer" />
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                </div>
                            </div>
                        </a>
                        <a href="#">
                            <div className="photo-item">
                                <img src="/assets/img/photo2.jpg" alt="Photo 1" loading="lazy" />
                                <div className="photo-caption">
                                    <img src="/assets/img/balonDorado.png" className="balon" alt="isotype IFX Soccer" />
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                </div>
                            </div>
                        </a>
                        <a href="#">
                            <div className="photo-item">
                                <img src="/assets/img/photo3.jpg" alt="Photo 1" loading="lazy" />
                                <div className="photo-caption">
                                    <img src="/assets/img/balonDorado.png" className="balon" alt="isotype IFX Soccer" />
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="dosbotones">
                        <a href="#" className="boton"><i className="fa-solid fa-camera"></i> More Photo Galleries</a>
                    </div>
                </div>
            </section>
            <section className="imagen-photogallery">
                <a href="#" className="boton-gallery"><i className="fa-brands fa-facebook"></i> Follow Us On Facebook</a>
            </section>
        </div>
    );
}
