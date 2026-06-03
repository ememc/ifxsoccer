export default function Partner() {
    const partnerImages = Array.from({ length: 14 }, (_, index) => index + 1);

    return (
        <section id="galeria" className="seccion contenedor">
            <h2 className="photo-gallery__title">Our Global Partners</h2>
            <br/>
            <br/>
            <p className="partner-description">We collaborate with leading football academies and clubs worldwide.</p>
            <div className="galeria-imagenes">
                {partnerImages.map((imageNumber) => (
                    <img
                        key={imageNumber}
                        src={`/assets/img/partners/${imageNumber}.jpg`}
                        alt={`IFX Soccer partner ${imageNumber}`}
                        loading="lazy"
                    />
                ))}
            </div>
        </section>
    );
}
