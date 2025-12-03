export default function Container() {
    return (
        <section className="seccion contenedor">
            <h2>Soccer Schools, Camps and International Academies</h2>
            <div className="contenedor-programas">
                <div className="programa">
                    <picture>
                        <source srcSet="/assets/img/PYG-IFX.webp" type="image/webp" />
                        <source srcSet="/assets/img/PYG-IFX.jpg" type="image/jpeg" />
                        <img loading="lazy" src="/assets/img/PYG-IFX.jpg" alt="pro year germany" />
                    </picture>
                    <div className="contenido-programa especial">
                        <h3>Pro Year Germany</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio est nemo mollitia maxime magnam. Optio vitae natus, </p>
                        <div>
                            <a href="#" className="boton">learn more</a>
                            <a href="#" className="boton">Apply online</a>
                        </div>
                    </div>
                </div>

                <div className="programa">
                    <picture>
                        <source srcSet="/assets/img/P30D-IFX.webp" type="image/webp" />
                        <source srcSet="/assets/img/P30D-IFX.jpg" type="image/jpeg" />
                        <img loading="lazy" src="/assets/img/P30D-IFX.jpg" alt="pro soccer trials" />
                    </picture>
                    <div className="contenido-programa">
                        <h3>Soccer Trials in Germany | Pro 30 Day</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio est nemo mollitia maxime magnam. Optio vitae natus, </p>
                        <div>
                            <a href="#" className="boton">learn more</a>
                            <a href="#" className="boton">Apply online</a>
                        </div>
                    </div>
                </div>

                <div className="programa">
                    <picture>
                        <source srcSet="/assets/img/soccer-city.webp" type="image/webp" />
                        <source srcSet="/assets/img/soccer-city.jpg" type="image/jpeg" />
                        <img loading="lazy" src="/assets/img/soccer-city.jpg" alt="german soccer boarding school" />
                    </picture>
                    <div className="contenido-programa">
                        <h3>Soccer Trials in Germany | Pro 30 Day</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio est nemo mollitia maxime magnam. Optio vitae natus, </p>
                        <div>
                            <a href="#" className="boton">learn more</a>
                            <a href="#" className="boton">Apply online</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
