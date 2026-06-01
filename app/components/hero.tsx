'use client';
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import api from "../services/api";

export type HeroData = {
    hero_id: string;
    hero_button: string;
    hero_call: string;
    hero_date?: string;
    hero_enabled?: boolean;
    hero_image: string;
    hero_title: string;
};

type HeroApiResponse =
    | HeroData[]
    | {
        body?: string | HeroApiResponse;
        hero?: HeroData[];
        heroes?: HeroData[];
        heros?: HeroData[];
        items?: HeroData[];
    };

const parseHeroResponse = (payload: HeroApiResponse): HeroData[] => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload.body)) {
        return payload.body;
    }

    if (typeof payload.body === "string") {
        try {
            const parsedBody = JSON.parse(payload.body);
            return parseHeroResponse(parsedBody);
        } catch {
            return [];
        }
    }

    if (payload.body) {
        return parseHeroResponse(payload.body);
    }

    return payload.hero ?? payload.heroes ?? payload.heros ?? payload.items ?? [];
};

const hasButtonLabel = (buttonLabel: string) => {
    const normalizedLabel = buttonLabel.trim();
    return normalizedLabel.length > 0 && normalizedLabel !== "#";
};

const requestHeroData = async (endpoint: string): Promise<HeroData[]> => {
    const response = await api.get<HeroApiResponse>(endpoint);
    return parseHeroResponse(response.data).filter((item) => item.hero_enabled !== false);
};

export const getHeroData = async (): Promise<HeroData[]> => {
    try {
        return await requestHeroData(API_ENDPOINTS.heros);
    } catch (error) {
        console.warn("Primary hero endpoint failed, retrying fallback endpoint", error);
        return requestHeroData(API_ENDPOINTS.herosFallback);
    }
};

export default function Hero() {

    const [heroData, setHeroData] = useState<HeroData[]>([]);

    useEffect(() => {
        let mounted = true;

        getHeroData()
            .then((data) => {
                if (mounted) {
                    setHeroData(data);
                }
            })
            .catch((error) => {
                console.error("Error loading hero data", error);
            });
        void import('bootstrap/dist/js/bootstrap.bundle.min.js');

        return () => {
            mounted = false;
        };
    }, []);

    if (heroData.length === 0) {
        return null;
    }

    return (
        <section className="carousel slide" data-ride="carousel">

            <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">


                <div className="carousel-indicators">
                    {heroData?.map((item, index) => (
                        <React.Fragment key={item.hero_id}>
                            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to={index} className={index === 0 ? 'active' : ''}></button>
                        </React.Fragment>
                    ))}
                </div>

                <div className="carousel-inner">
                    {heroData?.map((item, index) => (
                        <React.Fragment key={item.hero_id}>
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} >
                                <img src={item.hero_image} className="d-block w-100" alt={item.hero_title} style={{ objectFit: 'cover' }} />
                                <div className="carousel-caption">
                                    <p>{item.hero_title}</p>
                                    {hasButtonLabel(item.hero_button) && (
                                        <a className="boton-hero" href={item.hero_call || "#"}>{item.hero_button}</a>
                                    )}
                                    <br />
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    <button
                        className="carousel-control-prev hero-carousel__control photo-gallery__control"
                        type="button"
                        data-bs-target="#mainCarousel"
                        data-bs-slide="prev"
                        aria-label="Previous hero image"
                    >
                        <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                    </button>

                    <button
                        className="carousel-control-next hero-carousel__control photo-gallery__control"
                        type="button"
                        data-bs-target="#mainCarousel"
                        data-bs-slide="next"
                        aria-label="Next hero image"
                    >
                        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    </button>

                </div>
            </div>
        </section>
    );
}
