'use client';
import React from "react";
import api from "../services/api";
import { useEffect, useState } from "react";

export type GeneralData = {
    id: string;
    title: string;
    image: string;
    button: string;
    call: string;
};

export const getHeroData = async (): Promise<GeneralData[]> => {
    const response = await api.get("/");
    return response.data;
};

export default function Hero() {

    const [heroData, setHeroData] = useState<GeneralData[] | null>(null);

    useEffect(() => {

        getHeroData().then((data) => {
            setHeroData(data);
        });
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    console.log(heroData);

    return (
        <section className="carousel slide" data-ride="carousel">

            <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">


                <div className="carousel-indicators">
                    {heroData?.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to={index} className={index === 0 ? 'active' : ''}></button>
                        </React.Fragment>
                    ))}
                </div>

                <div className="carousel-inner">
                    {heroData?.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} >
                                <img src={item.image} className="d-block w-100" alt={item.title} style={{ objectFit: 'cover' }} />
                                <div className="carousel-caption d-none d-md-block">
                                    <p>{item.title}</p>
                                    <a className="boton-hero" href={item.call} target="_#">{item.button}</a>
                                    <br />
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                    </button>

                    <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon"></span>
                    </button>

                </div>
            </div>
        </section>
    );
}
