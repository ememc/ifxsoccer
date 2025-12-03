export default function Category() {
    return (
        <section className="categorias imagen-categorias">
            <div className="seccion contenedor">
                <h2>
                    Soccer Training Programs in Europe
                </h2>
                <div className="contenido-categorias">
                    <div className="categoria">
                        <picture>
                            <source srcSet="/assets/img/P30D-IFX.webp" type="image/webp" />
                            <source srcSet="/assets/img/P30D-IFX.jpg" type="image/jpeg" />
                            <img loading="lazy" src="/assets/img/P30D-IFX.jpg" alt="pro year germany" />
                        </picture>

                        <div className="contenido-categoria especial">
                            <h3>Soccer Trials</h3>
                            <p>IFX is recognized as an expert in the facilitation of pro and semi pro soccer team tryouts in Europe and Youth Soccer club tryouts, especially in Germany. </p>
                            <div>
                                <a href="#" className="boton-cyan">learn more</a>
                            </div>
                        </div>
                    </div>

                    <div className="categoria">
                        <picture>
                            <source srcSet="/assets/img/intl-soccer-academies.webp" type="image/webp" />
                            <source srcSet="/assets/img/intl-soccer-academies.jpg" type="image/jpeg" />
                            <img loading="lazy" src="/assets/img/intl-soccer-academies.jpg" alt="pro year germany" />
                        </picture>

                        <div className="contenido-categoria">
                            <h3>international soccer academies</h3>
                            <p>IFX Soccer facilitates opportunities for student athletes from across the globe to pursue international education and European soccer development. </p>
                            <div>
                                <a href="#" className="boton-cyan">learn more</a>
                            </div>
                        </div>
                    </div>

                    <div className="categoria">
                        <picture>
                            <source srcSet="/assets/img/summer-soccer-camps-germany.webp" type="image/webp" />
                            <source srcSet="/assets/img/summer-soccer-camps-germany.jpg" type="image/jpeg" />
                            <img loading="lazy" src="/assets/img/summer-soccer-camps-germany.jpg" alt="pro year germany" />
                        </picture>

                        <div className="contenido-categoria especial">
                            <h3>Youth Soccer Camps</h3>
                            <p>IFX Soccer International summer camps are all residential soccer camnps encompassing the training philosophies and methodologies of the professional clubs. </p>
                            <div>
                                <a href="#" className="boton-cyan">learn more</a>
                            </div>
                        </div>
                    </div>

                    <div className="categoria">
                        <picture>
                            <source srcSet="/assets/img/team-training.webp" type="image/webp" />
                            <source srcSet="/assets/img/team-training.jpg" type="image/jpeg" />
                            <img loading="lazy" src="/assets/img/team-training.jpg" alt="pro year germany" />
                        </picture>

                        <div className="contenido-categoria">
                            <h3>International Soccer Tours</h3>
                            <p>IFX offers customized Soccer Tours for all level travel soccer teams to experience professional soccer training and similar level opposition overseas.</p>
                            <div>
                                <a href="#" className="boton-cyan dist-boton">learn more</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
