"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import api from "../services/api";

type GalleryImage = {
    id: string;
    href: string;
    image: string;
    title: string;
};

type ImageRecord = Record<string, unknown>;

const VISIBLE_IMAGES = 3;

const isRecord = (value: unknown): value is ImageRecord => (
    typeof value === "object" && value !== null && !Array.isArray(value)
);

const getStringValue = (record: ImageRecord, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];

        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }

    return "";
};

const parseImagesResponse = (payload: unknown): ImageRecord[] => {
    if (Array.isArray(payload)) {
        return payload.filter(isRecord);
    }

    if (!isRecord(payload)) {
        return [];
    }

    if (typeof payload.body === "string") {
        try {
            return parseImagesResponse(JSON.parse(payload.body));
        } catch {
            return [];
        }
    }

    if (payload.body) {
        return parseImagesResponse(payload.body);
    }

    const collectionKeys = ["images", "image", "items", "gallery", "photos", "data", "results"];

    for (const key of collectionKeys) {
        const collection = payload[key];
        const parsedCollection = parseImagesResponse(collection);

        if (parsedCollection.length > 0) {
            return parsedCollection;
        }
    }

    return [];
};

const normalizeGalleryImage = (item: ImageRecord, index: number): GalleryImage | null => {
    const image = getStringValue(item, [
        "image_url",
        "image_image",
        "gallery_image",
        "photo_image",
        "photo_url",
        "image",
        "url",
        "src",
    ]);

    if (!image) {
        return null;
    }

    const id = getStringValue(item, ["image_id", "gallery_id", "photo_id", "id"]) || `${image}-${index}`;
    const title = getStringValue(item, [
        "image_title",
        "gallery_title",
        "photo_title",
        "title",
        "image_caption",
        "caption",
        "description",
        "image_alt",
        "alt",
        "name",
    ]) || "IFX Soccer photo gallery";
    const href = getStringValue(item, ["image_call", "image_link", "gallery_link", "photo_link", "href", "link"]) || "#";

    return {
        href,
        id,
        image,
        title,
    };
};

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.images);

    return parseImagesResponse(response.data)
        .filter((item) => item.image_enabled !== false && item.enabled !== false)
        .map(normalizeGalleryImage)
        .filter((item): item is GalleryImage => item !== null);
};

export default function Gallery() {
    const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        let mounted = true;

        getGalleryImages()
            .then((images) => {
                if (mounted) {
                    setGalleryItems(images);
                    setStartIndex(0);
                }
            })
            .catch((error) => {
                console.error("Error loading gallery images", error);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const canSlide = galleryItems.length > VISIBLE_IMAGES;
    const visibleImages = canSlide
        ? Array.from({ length: VISIBLE_IMAGES }, (_, index) => galleryItems[(startIndex + index) % galleryItems.length])
        : galleryItems;

    const handlePrevious = () => {
        setStartIndex((currentIndex) => (
            currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1
        ));
    };

    const handleNext = () => {
        setStartIndex((currentIndex) => (currentIndex + 1) % galleryItems.length);
    };

    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % galleryItems.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    };

    useEffect(() => {
        if (!isModalOpen || !isPlaying) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % galleryItems.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isModalOpen, isPlaying, galleryItems.length]);

    if (galleryItems.length === 0) {
        return null;
    }

    return (
        <div>
            <section className="photo-gallery">
                <div className="photo-gallery__container">
                    <div className="photo-gallery__header">
                        <h2 className="photo-gallery__title">Photo Gallery</h2>
                        <a href="#" className="photo-gallery__button">More Photo Galleries</a>
                    </div>

                    <div className={`photo-gallery__carousel ${canSlide ? "" : "photo-gallery__carousel--static"}`}>
                        {canSlide && (
                            <button
                                type="button"
                                className="photo-gallery__control photo-gallery__control--prev"
                                aria-label="Previous gallery images"
                                onClick={handlePrevious}
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                        )}

                        <div className="photo-gallery__grid">
                            {visibleImages.map((item, index) => (
                                <button
                                    type="button"
                                    className="photo-gallery__item"
                                    key={item.id}
                                    onClick={() => openModal((startIndex + index) % galleryItems.length)}
                                >
                                    <img src={item.image} alt={item.title} loading="lazy" />
                                    <div className="photo-caption">
                                        <p>{item.title}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {canSlide && (
                            <button
                                type="button"
                                className="photo-gallery__control photo-gallery__control--next"
                                aria-label="Next gallery images"
                                onClick={handleNext}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        )}
                    </div>
                </div>

                {isModalOpen && (
                    <div className="gallery-modal" onClick={closeModal}>
                        <div className="gallery-modal__content" onClick={(e) => e.stopPropagation()}>
                            <button className="gallery-modal__close" onClick={closeModal}>
                                <i className="fa-solid fa-times"></i>
                            </button>
                            <button className="gallery-modal__prev" onClick={prevImage}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <img
                                src={galleryItems[currentImageIndex].image}
                                alt={galleryItems[currentImageIndex].title}
                                className="gallery-modal__image"
                            />
                            <button className="gallery-modal__next" onClick={nextImage}>
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                            <div className="gallery-modal__caption">
                                <p>{galleryItems[currentImageIndex].title}</p>
                            </div>
                            <button className="gallery-modal__play-pause" onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}>
                                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                            </button>
                        </div>
                    </div>
                )}
            </section>
            <section className="imagen-photogallery">
                <a href="https://www.facebook.com/IFX.Soccer.Camps" target="_blank" className="boton-gallery"><i className="fa-brands fa-facebook"></i> Join Us On Facebook</a>
            </section>
        </div>
    );
}
