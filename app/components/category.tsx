"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { getProgramPath, type Program } from "../lib/programs";
import api from "../services/api";

type ProgramRecord = Record<string, unknown>;

type ProgramItem = {
    id: string;
    title: string;
    description: string;
    applyUrl: string;
    canonicalUrl: string;
    imageUrl: string;
};

const DEFAULT_VISIBLE_PROGRAMS = 3;
const FALLBACK_PROGRAM_IMAGE = "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";

const isRecord = (value: unknown): value is ProgramRecord => (
    typeof value === "object" && value !== null && !Array.isArray(value)
);

const getStringValue = (record: ProgramRecord, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];

        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }

    return "";
};

const getProgramHeroImage = (item: ProgramRecord) => {
    const heroCollection = item.program_hero;

    if (!Array.isArray(heroCollection)) {
        return "";
    }

    for (const heroItem of heroCollection) {
        if (!isRecord(heroItem)) {
            continue;
        }

        const imageUrl = getStringValue(heroItem, ["image_url"]);

        if (imageUrl) {
            return imageUrl;
        }
    }

    return "";
};

const parseProgramsResponse = (payload: unknown): ProgramRecord[] => {
    if (Array.isArray(payload)) {
        return payload.filter(isRecord);
    }

    if (!isRecord(payload)) {
        return [];
    }

    if (typeof payload.body === "string") {
        try {
            return parseProgramsResponse(JSON.parse(payload.body));
        } catch {
            return [];
        }
    }

    if (payload.body) {
        return parseProgramsResponse(payload.body);
    }

    const collectionKeys = ["programs", "program", "items", "data", "results"];

    for (const key of collectionKeys) {
        const collection = payload[key];
        const parsedCollection = parseProgramsResponse(collection);

        if (parsedCollection.length > 0) {
            return parsedCollection;
        }
    }

    return [];
};

const normalizeProgramItem = (item: ProgramRecord, index: number): ProgramItem | null => {
    const title = getStringValue(item, ["program_title", "title", "name"]);

    if (!title) {
        return null;
    }

    const program = {
        ...item,
        program_id: getStringValue(item, ["program_id", "id"]) || `${title}-${index}`,
        program_title: title,
    } as Program;

    return {
        id: program.program_id,
        title,
        description: getStringValue(item, ["program_description", "description"]),
        applyUrl: getStringValue(item, ["program_apply", "apply_url", "apply", "link"]) || "https://ifxsoccer.com/apply",
        canonicalUrl: getProgramPath(program),
        imageUrl: getProgramHeroImage(item) || FALLBACK_PROGRAM_IMAGE,
    };
};

const getCategoryPrograms = async (): Promise<ProgramItem[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.programs);

    return parseProgramsResponse(response.data)
        .filter((item) => item.program_enabled !== false && item.enabled !== false)
        .map(normalizeProgramItem)
        .filter((item): item is ProgramItem => item !== null);
};

export default function Category() {
    const [programs, setPrograms] = useState<ProgramItem[]>([]);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        let mounted = true;

        getCategoryPrograms()
            .then((items) => {
                if (mounted) {
                    setPrograms(items);
                    setStartIndex(0);
                }
            })
            .catch((error) => {
                console.error("Error loading programs", error);
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (programs.length === 0) {
        return null;
    }

    const canSlide = programs.length > DEFAULT_VISIBLE_PROGRAMS;
    const visiblePrograms = canSlide
        ? Array.from(
            { length: DEFAULT_VISIBLE_PROGRAMS },
            (_, index) => programs[(startIndex + index) % programs.length]
        )
        : programs;

    const handlePrevious = () => {
        setStartIndex((currentIndex) => (
            currentIndex === 0 ? programs.length - 1 : currentIndex - 1
        ));
    };

    const handleNext = () => {
        setStartIndex((currentIndex) => (currentIndex + 1) % programs.length);
    };

    return (
        <div>
            <br />
            <br />
            <section className="seccion contenedor">
                <h2 className="photo-gallery__title">
                    Soccer Schools, Camps and International Academies
                </h2>
                <div className={`programs-carousel ${canSlide ? "" : "programs-carousel--static"}`.trim()}>
                    {canSlide && (
                        <button
                            type="button"
                            className="photo-gallery__control programs-carousel__control"
                            aria-label="Previous programs"
                            onClick={handlePrevious}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    )}
                    <div className="contenedor-programas">
                        {visiblePrograms.map((program, index) => (
                            <div className="programa" key={program.id}>
                                <picture>
                                    <source srcSet={program.imageUrl} type="image/webp"></source>
                                    <source srcSet={program.imageUrl} type="image/jpeg"></source>
                                    <img loading="lazy" src={program.imageUrl} alt={program.title}></img>
                                </picture>
                                <div className={`contenido-programa ${index === 0 ? "especial" : ""}`.trim()}>
                                    <h3>{program.title}</h3>
                                    <p>{program.description}</p>
                                    <div className="botones">
                                        <a href={program.canonicalUrl} className="boton-programa">learn more</a>
                                        <a href={program.applyUrl} className="boton-programa-azul">Apply online</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {canSlide && (
                        <button
                            type="button"
                            className="photo-gallery__control programs-carousel__control"
                            aria-label="Next programs"
                            onClick={handleNext}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}
