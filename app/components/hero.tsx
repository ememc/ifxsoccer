'use client';

import { useEffect } from 'react';

export default function Hero() {

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return (
        <section className="carousel slide" data-ride="carousel">

            <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">

                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2"></button>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/assets/img/hero.jpg" className="d-block w-100" alt="Slide 1" style={{ objectFit: 'cover' }} />
                        <div className="carousel-caption d-none d-md-block">
                            <p>IFX is one of the oldest soccer agencies of its kind, combining soccer development and education programs in Europe.</p>
                            <a className="boton-hero">Schedule a Call</a>
                            <br />
                        </div>
                    </div>

                    <div className="carousel-item">
                        <img src="/assets/img/sliderBayernMunchenvsFronlach.jpg" className="d-block w-100" alt="Slide 2" style={{ objectFit: 'cover' }} />
                        <div className="carousel-caption d-none d-md-block">
                            <p>Some representative placeholder content for the first slide.</p>
                            <a className="boton-hero">Schedule a Call</a>
                            <br />
                        </div>
                    </div>

                    <div className="carousel-item">
                        <img src="/assets/img/soccer-trials-2.jpg" className="d-block w-100" alt="Slide 3" style={{ objectFit: 'cover' }} />
                        <div className="carousel-caption d-none d-md-block">
                            <p>Some representative placeholder content for the first slide.</p>
                            <a className="boton-hero">Schedule a Call</a>
                            <br />
                        </div>
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </button>

                <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </button>

            </div>

        </section>
    );
}
