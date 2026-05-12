export default function News() {
    return (
        
        <div>
            <br/>
            <br/>
            <section className="seccion contenedor">
                <div className="pphoto-gallery__title">
                    <div className="photo-gallery__header">
                        <h2 className="photo-gallery__title">IFX Player News</h2>
                        <a href="#" className="photo-gallery__button">More Player News</a>
                    </div>
                </div>
                <div>
                    <br/>
                </div>
                <div className="contenedor-news">
                    <a href="#">
                        <div className="noti-principal">
                            <div className="title-header">
                                <h3>
                                Gianluca and Alberto Valle: Youth Talent Development Through a Soccer Year in Germany
                                </h3>
                            </div>
                            
                            <picture className="first-new">
                                <source src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561341303-noticia1.jpg" type="image/webp"></source>
                                <source src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561341303-noticia1.jpg" type="image/jpeg"></source>
                                <img loading="lazy" src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561341303-noticia1.jpg" alt="noticia principal"></img>
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
                                    <source src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561586283-noticia2.jpg" type="image/webp"></source>
                                    <source src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561586283-noticia2.jpg" type="image/jpeg"></source>
                                    <img loading="lazy" src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561586283-noticia2.jpg" alt="noticia principal"></img>
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
                                    <source src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561634625-noticia3.jpg" type="image/webp"></source>
                                    <source src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561634625-noticia3.jpg" type="image/jpeg"></source>
                                    <img loading="lazy" src="https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/1778561634625-noticia3.jpg" alt="noticia principal"></img>
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

                <div className="boton-base">
                    <a href="#" className="boton boton-news">More Player News</a>
                </div>
            </section>
        </div>
    );
}
