"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { getProgramPath, type Program } from "../lib/programs";
import api from "../services/api";
import { useResponsiveCount } from "./use-responsive-count";

type ApiRecord = Record<string, unknown>;

type ProgramItem = {
    id: string;
    title: string;
    description: string;
    applyUrl: string;
    canonicalUrl: string;
    imageUrl: string;
};

type CategorySectionData = {
    programs: ProgramItem[];
    totalPrograms: number;
    title: string;
};

const FALLBACK_PROGRAM_IMAGE = "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";

const isRecord = (value: unknown): value is ApiRecord => (
    typeof value === "object" && value !== null && !Array.isArray(value)
);

const getStringValue = (record: ApiRecord, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];

        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }

    return "";
};

const isTrueValue = (value: unknown) => (
    value === true || (typeof value === "string" && value.trim().toLowerCase() === "true")
);

const hasProgramIds = (value: unknown) => {
    const programIds = new Map<string, number>();
    addProgramIdsFromValue(value, programIds);
    return programIds.size > 0;
};

const getProgramHeroImage = (item: ApiRecord) => {
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

const parseCollectionResponse = (payload: unknown, collectionKeys: string[]): ApiRecord[] => {
    if (Array.isArray(payload)) {
        return payload.filter(isRecord);
    }

    if (!isRecord(payload)) {
        return [];
    }

    if (typeof payload.body === "string") {
        try {
            return parseCollectionResponse(JSON.parse(payload.body), collectionKeys);
        } catch {
            return [];
        }
    }

    if (payload.body) {
        return parseCollectionResponse(payload.body, collectionKeys);
    }

    for (const key of collectionKeys) {
        const parsedCollection = parseCollectionResponse(payload[key], collectionKeys);

        if (parsedCollection.length > 0) {
            return parsedCollection;
        }
    }

    return [];
};

const normalizeProgramItem = (item: ApiRecord, index: number): ProgramItem | null => {
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

const addProgramIdsFromValue = (value: unknown, programIds: Map<string, number>, order = programIds.size) => {
    if (typeof value === "string" && value.trim().length > 0) {
        programIds.set(value.trim(), order);
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => addProgramIdsFromValue(item, programIds, index));
        return;
    }

    if (!isRecord(value)) {
        return;
    }

    const programId = getStringValue(value, ["program_id", "id", "_id", "value"]);
    const programOrder = Number.parseInt(getStringValue(value, ["program_order", "order"]), 10);
    const resolvedOrder = Number.isNaN(programOrder) ? order : programOrder;

    if (programId) {
        programIds.set(programId, resolvedOrder);
    }

    addProgramIdsFromValue(value.program, programIds, resolvedOrder);
    addProgramIdsFromValue(value.program_id, programIds, resolvedOrder);
};

const getSectionCategories = (categories: ApiRecord[]) => {
    const enabledCategories = categories.filter((category) => isTrueValue(category.category_enabled));
    const sectionCategories = enabledCategories.filter((category) => isTrueValue(category.category_section));

    if (sectionCategories.length > 0) {
        return sectionCategories;
    }

    return enabledCategories.filter((category) => hasProgramIds(category.category_programs));
};

const getSectionCategoryProgramIds = (categories: ApiRecord[]) => {
    const programIds = new Map<string, number>();

    categories.forEach((category) => {
        addProgramIdsFromValue(category.category_programs, programIds);
    });

    return programIds;
};

const getCategorySectionData = async (previewOnly = false): Promise<CategorySectionData> => {
    const [categoriesResponse, programsResponse] = await Promise.all([
        api.get<unknown>(API_ENDPOINTS.category),
        api.get<unknown>(API_ENDPOINTS.programs),
    ]);
    const categories = parseCollectionResponse(categoriesResponse.data, ["category", "categories", "items", "data", "results"]);
    const programs = parseCollectionResponse(programsResponse.data, ["programs", "program", "items", "data", "results"]);
    const sectionCategories = getSectionCategories(categories);
    const categoryProgramIds = getSectionCategoryProgramIds(sectionCategories);
    const selectedCategory = sectionCategories[0];
    const title = getStringValue(selectedCategory ?? {}, ["category_title", "title", "name"]) || "Programs";
    if (categoryProgramIds.size === 0) {
        return {
            programs: [],
            totalPrograms: 0,
            title,
        };
    }

    const sectionPrograms = programs
        .filter((program) => program.program_enabled !== false && program.enabled !== false)
        .filter((program) => categoryProgramIds.has(getStringValue(program, ["program_id", "id", "_id"])))
        .sort((firstProgram, secondProgram) => (
            (categoryProgramIds.get(getStringValue(firstProgram, ["program_id", "id", "_id"])) ?? 0) -
            (categoryProgramIds.get(getStringValue(secondProgram, ["program_id", "id", "_id"])) ?? 0)
        ))
        .map(normalizeProgramItem)
        .filter((program): program is ProgramItem => program !== null);

    return {
        programs: previewOnly ? sectionPrograms.slice(0, 1) : sectionPrograms,
        totalPrograms: sectionPrograms.length,
        title,
    };
};

export default function CategorySection() {
    const [programs, setPrograms] = useState<ProgramItem[]>([]);
    const [sectionTitle, setSectionTitle] = useState("Programs");
    const [totalPrograms, setTotalPrograms] = useState(0);
    const [isLoadingAllPrograms, setIsLoadingAllPrograms] = useState(false);
    const [hasLoadedAllPrograms, setHasLoadedAllPrograms] = useState(false);
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = useResponsiveCount({
        desktop: 3,
        tablet: 2,
        mobile: 1,
    });

    useEffect(() => {
        let mounted = true;

        getCategorySectionData(true)
            .then(({ programs: items, totalPrograms: totalItems, title }) => {
                if (mounted) {
                    setPrograms(items);
                    setTotalPrograms(totalItems);
                    setSectionTitle(title);
                    setHasLoadedAllPrograms(totalItems <= items.length);
                    setStartIndex(0);
                }
            })
            .catch((error) => {
                console.error("Error loading category section programs", error);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const handleViewMorePrograms = async () => {
        if (isLoadingAllPrograms || hasLoadedAllPrograms) {
            return;
        }

        setIsLoadingAllPrograms(true);

        try {
            const { programs: items, totalPrograms: totalItems, title } = await getCategorySectionData();

            setPrograms(items);
            setTotalPrograms(totalItems);
            setSectionTitle(title);
            setHasLoadedAllPrograms(true);
            setStartIndex(0);
        } catch (error) {
            console.error("Error loading all category section programs", error);
        } finally {
            setIsLoadingAllPrograms(false);
        }
    };

    if (programs.length === 0) {
        return null;
    }

    const canSlide = programs.length > 1;
    const visibleSlots = Math.min(visibleCount, programs.length);
    const visiblePrograms = canSlide
        ? Array.from(
            { length: visibleSlots },
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
            <section className="seccion contenedor">
                <h2 className="photo-gallery__title">
                    {sectionTitle}
                </h2>
                <div className={`programs-carousel ${canSlide ? "" : "programs-carousel--static"} ${visiblePrograms.length === 1 ? "programs-carousel--single" : ""}`.trim()}>
                    {canSlide && (
                        <button
                            type="button"
                            className="photo-gallery__control programs-carousel__control"
                            aria-label="Previous category section programs"
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
                                    <p className="programa-descripcion">{program.description}</p>
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
                            aria-label="Next category section programs"
                            onClick={handleNext}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>
                {!hasLoadedAllPrograms && totalPrograms > programs.length && (
                    <div className="category-section__actions">
                        <button
                            type="button"
                            className="boton-programa category-section__view-more"
                            onClick={handleViewMorePrograms}
                            disabled={isLoadingAllPrograms}
                        >
                            {isLoadingAllPrograms ? "loading programs..." : "view more programs"}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
