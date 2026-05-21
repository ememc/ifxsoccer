"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { getCategoryPath, type Category as CategoryData } from "../lib/categories";
import api from "../services/api";
import { useResponsiveCount } from "./use-responsive-count";

type CategoryRecord = Record<string, unknown>;

type CategoryItem = {
    id: string;
    title: string;
    description: string;
    applyUrl: string;
    canonicalUrl: string;
    imageUrl: string;
};

const FALLBACK_CATEGORY_IMAGE = "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";

const isRecord = (value: unknown): value is CategoryRecord => (
    typeof value === "object" && value !== null && !Array.isArray(value)
);

const getStringValue = (record: CategoryRecord, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];

        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }

    return "";
};

const getCategoryHeroImage = (item: CategoryRecord) => {
    const heroCollection = item.category_hero ?? item.program_hero;

    if (!Array.isArray(heroCollection)) {
        return "";
    }

    for (const heroItem of heroCollection) {
        if (!isRecord(heroItem)) {
            continue;
        }

        const imageUrl = getStringValue(heroItem, ["image_url", "category_image", "image"]);

        if (imageUrl) {
            return imageUrl;
        }
    }

    return "";
};

const parseCategoriesResponse = (payload: unknown): CategoryRecord[] => {
    if (Array.isArray(payload)) {
        return payload.filter(isRecord);
    }

    if (!isRecord(payload)) {
        return [];
    }

    if (typeof payload.body === "string") {
        try {
            return parseCategoriesResponse(JSON.parse(payload.body));
        } catch {
            return [];
        }
    }

    if (payload.body) {
        return parseCategoriesResponse(payload.body);
    }

    const collectionKeys = ["category", "categories", "items", "data", "results"];

    for (const key of collectionKeys) {
        const collection = payload[key];
        const parsedCollection = parseCategoriesResponse(collection);

        if (parsedCollection.length > 0) {
            return parsedCollection;
        }
    }

    return [];
};

const normalizeCategoryItem = (item: CategoryRecord, index: number): CategoryItem | null => {
    const title = getStringValue(item, ["category_title", "title", "name"]);

    if (!title) {
        return null;
    }

    const category = {
        ...item,
        category_id: getStringValue(item, ["category_id", "id"]) || `${title}-${index}`,
        category_title: title,
    } as CategoryData;

    return {
        id: category.category_id,
        title,
        description: getStringValue(item, ["category_description", "description"]),
        applyUrl: getStringValue(item, ["category_apply", "apply_url", "apply", "link"]) || "https://ifxsoccer.com/apply",
        canonicalUrl: getCategoryPath(category),
        imageUrl: getCategoryHeroImage(item) || FALLBACK_CATEGORY_IMAGE,
    };
};

const getCategories = async (): Promise<CategoryItem[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.category);

    return parseCategoriesResponse(response.data)
        .filter((item) => item.category_enabled !== false && item.enabled !== false)
        .map(normalizeCategoryItem)
        .filter((item): item is CategoryItem => item !== null);
};

export default function Category() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = useResponsiveCount({
        desktop: 3,
        tablet: 2,
        mobile: 1,
    });

    useEffect(() => {
        let mounted = true;

        getCategories()
            .then((items) => {
                if (mounted) {
                    setCategories(items);
                    setStartIndex(0);
                }
            })
            .catch((error) => {
                console.error("Error loading categories", error);
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (categories.length === 0) {
        return null;
    }

    const visibleCategories = Array.from(
        { length: Math.min(visibleCount, categories.length) },
        (_, index) => categories[(startIndex + index) % categories.length]
    );

    const handlePrevious = () => {
        setStartIndex((currentIndex) => (
            currentIndex === 0 ? categories.length - 1 : currentIndex - 1
        ));
    };

    const handleNext = () => {
        setStartIndex((currentIndex) => (currentIndex + 1) % categories.length);
    };

    return (
        <div>
            <section className="seccion contenedor category-section">
                <h2 className="photo-gallery__title">
                    Soccer Training Programs in Europe
                </h2>
                <div className="programs-carousel">
                    <button
                        type="button"
                        className="photo-gallery__control programs-carousel__control"
                        aria-label="Previous categories"
                        onClick={handlePrevious}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className="contenedor-programas">
                        {visibleCategories.map((category, index) => (
                            <div className="programa" key={category.id}>
                                <picture>
                                    <source srcSet={category.imageUrl} type="image/webp"></source>
                                    <source srcSet={category.imageUrl} type="image/jpeg"></source>
                                    <img loading="lazy" src={category.imageUrl} alt={category.title}></img>
                                </picture>
                                <div className={`contenido-programa ${index === 0 ? "especial" : ""}`.trim()}>
                                    <h3>{category.title}</h3>
                                    <p className="programa-descripcion">{category.description}</p>
                                    <div className="botones">
                                        <a href={category.canonicalUrl} className="boton-programa">learn more</a>
                                        <a href={category.applyUrl} className="boton-programa-azul">Apply online</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="photo-gallery__control programs-carousel__control"
                        aria-label="Next categories"
                        onClick={handleNext}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </section>
        </div>
    );
}
