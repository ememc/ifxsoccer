const INSTAGRAM_URL = "https://www.instagram.com/ifx.soccer.agency/";

const instagramImages = Array.from({ length: 6 }, (_, index) => {
    const imageNumber = index + 1;

    return {
        alt: `IFX Soccer Instagram post ${imageNumber}`,
        jpg: `/assets/img/insta-${imageNumber}.jpg`,
        webp: `/assets/img/insta-${imageNumber}.webp`,
    };
});

export default function Instagram() {
    return (
        <section className="seccion instagram">
            <div className="cont-insta contenedor">
                <div className="logo-insta">
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="IFX Soccer on Instagram">
                        <img className="balon-insta" src="/assets/img/balonDorado.png" alt="IFX Soccer" />
                    </a>
                </div>

                <div className="texto-insta">
                    <h3>#ifxsoccer on Instagram</h3>
                    <p>
                        We are an international #soccer and #education agency.
                        Scouting soccer #players from around the world.
                    </p>
                </div>
            </div>

            <div className="contenedor contenido-instagram">
                <div className="img-instagram">
                    {instagramImages.map((image) => (
                        <a
                            className="instagram-item"
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={image.jpg}
                        >
                            <picture>
                                <source srcSet={image.webp} type="image/webp" />
                                <img src={image.jpg} alt={image.alt} loading="lazy" />
                            </picture>
                        </a>
                    ))}
                </div>

                <a className="boton-instagram" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    Follow @ifx.soccer.agency
                </a>
            </div>
        </section>
    );
}
