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

type CategoryProgramSection = {
    id: string;
    programs: ProgramItem[];
    title: string;
};

type CategorySectionData = {
    sections: CategoryProgramSection[];
};

const FALLBACK_PROGRAM_IMAGE = "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";
const CATEGORIES_INCREMENT = 1;

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

const hasSectionValue = (value: unknown) => (
    isTrueValue(value) || (Array.isArray(value) && value.length > 0)
);

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
    const sectionCategories = enabledCategories.filter((category) => hasSectionValue(category.category_section));
    const programCategories = enabledCategories.filter((category) => hasProgramIds(category.category_programs));
    const categoryMap = new Map<string, ApiRecord>();

    [...sectionCategories, ...programCategories].forEach((category, index) => {
        const categoryKey = getStringValue(category, ["category_id", "id", "_id"]) || `${getStringValue(category, ["category_title", "title", "name"])}-${index}`;
        categoryMap.set(categoryKey, category);
    });

    return Array.from(categoryMap.values());
};

const getCategoryProgramIds = (category: ApiRecord) => {
    const programIds = new Map<string, number>();

    addProgramIdsFromValue(category.category_programs, programIds);

    return programIds;
};

const normalizeComparisonText = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

const isEnabledProgram = (program: ApiRecord) => (
    program.program_enabled !== false && program.enabled !== false
);

const getProgramRecordId = (program: ApiRecord) => getStringValue(program, ["program_id", "id", "_id"]);

const getCategoryPrograms = (category: ApiRecord, programs: ApiRecord[]) => {
    const categoryProgramIds = getCategoryProgramIds(category);
    const categoryId = getStringValue(category, ["category_id", "id", "_id"]);
    const categoryLabels = [
        getStringValue(category, ["category_category"]),
        getStringValue(category, ["category_title", "title", "name"]),
    ]
        .filter(Boolean)
        .map(normalizeComparisonText);
    const enabledPrograms = programs.filter(isEnabledProgram);
    const matchedById = categoryId
        ? enabledPrograms.filter((program) => getProgramRecordId(program) === categoryId)
        : [];

    const basePrograms = categoryProgramIds.size > 0
        ? enabledPrograms
        : matchedById.length > 0
            ? matchedById
            : enabledPrograms;
    const selectedPrograms = basePrograms
        .filter((program) => {
            const programId = getProgramRecordId(program);

            if (categoryProgramIds.size > 0) {
                return categoryProgramIds.has(programId);
            }

            if (matchedById.length > 0) {
                return true;
            }

            const programCategory = normalizeComparisonText(getStringValue(program, ["program_category", "category"]));

            return categoryLabels.includes(programCategory);
        })
        .sort((firstProgram, secondProgram) => {
            if (categoryProgramIds.size === 0) {
                return 0;
            }

            return (
                (categoryProgramIds.get(getProgramRecordId(firstProgram)) ?? 0) -
                (categoryProgramIds.get(getProgramRecordId(secondProgram)) ?? 0)
            );
        })
        .map(normalizeProgramItem)
        .filter((program): program is ProgramItem => program !== null);

    return Array.from(new Map(selectedPrograms.map((program) => [program.id, program])).values());
};

const getCategorySectionData = async (): Promise<CategorySectionData> => {
    const [categoriesResponse, programsResponse] = await Promise.all([
        api.get<unknown>(API_ENDPOINTS.category),
        api.get<unknown>(API_ENDPOINTS.programs),
    ]);
    const categories = parseCollectionResponse(categoriesResponse.data, ["category", "categories", "items", "data", "results"]);
    const programs = parseCollectionResponse(programsResponse.data, ["programs", "program", "items", "data", "results"]);
    const sectionCategories = getSectionCategories(categories);

    return {
        sections: sectionCategories
            .map((category, index) => ({
                id: getStringValue(category, ["category_id", "id", "_id"]) || `${getStringValue(category, ["category_title", "title", "name"])}-${index}`,
                programs: getCategoryPrograms(category, programs),
                title: getStringValue(category, ["category_title", "title", "name"]) || "Programs",
            }))
            .filter((section) => section.programs.length > 0),
    };
};

export default function CategorySection() {
    const [sections, setSections] = useState<CategoryProgramSection[]>([]);
    const [visibleSectionCount, setVisibleSectionCount] = useState(1);
    const [isLoadingMoreCategories, setIsLoadingMoreCategories] = useState(false);
    const [startIndexes, setStartIndexes] = useState<Record<string, number>>({});
    const visibleProgramCount = useResponsiveCount({
        desktop: 3,
        tablet: 2,
        mobile: 1,
    });

    useEffect(() => {
        let mounted = true;

        getCategorySectionData()
            .then(({ sections: items }) => {
                if (mounted) {
                    setSections(items);
                    setVisibleSectionCount(1);
                    setStartIndexes({});
                }
            })
            .catch((error) => {
                console.error("Error loading category section programs", error);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const visibleSections = sections.slice(0, visibleSectionCount);
    const hasMoreCategories = visibleSectionCount < sections.length;

    const handleViewMorePrograms = () => {
        if (isLoadingMoreCategories || !hasMoreCategories) {
            return;
        }

        setIsLoadingMoreCategories(true);
        setVisibleSectionCount((currentCount) => Math.min(currentCount + CATEGORIES_INCREMENT, sections.length));
        setIsLoadingMoreCategories(false);
    };

    if (sections.length === 0) {
        return null;
    }

    const getVisiblePrograms = (section: CategoryProgramSection) => {
        const startIndex = startIndexes[section.id] ?? 0;
        const visibleSlots = Math.min(visibleProgramCount, section.programs.length);

        if (section.programs.length <= 1) {
            return section.programs;
        }

        return Array.from(
            { length: visibleSlots },
            (_, index) => section.programs[(startIndex + index) % section.programs.length]
        );
    };

    const handlePrevious = (section: CategoryProgramSection) => {
        setStartIndexes((currentIndexes) => {
            const currentIndex = currentIndexes[section.id] ?? 0;

            return {
                ...currentIndexes,
                [section.id]: currentIndex === 0 ? section.programs.length - 1 : currentIndex - 1,
            };
        });
    };

    const handleNext = (section: CategoryProgramSection) => {
        setStartIndexes((currentIndexes) => ({
            ...currentIndexes,
            [section.id]: ((currentIndexes[section.id] ?? 0) + 1) % section.programs.length,
        }));
    };

    return (
        <div>
            <section className="seccion contenedor category-section">
                {visibleSections.map((section) => {
                    const canSlide = section.programs.length > 1;
                    const visiblePrograms = getVisiblePrograms(section);

                    return (
                        <div className="category-section__group" key={section.id}>
                            <h2 className="photo-gallery__title">
                                {section.title}
                            </h2>
                            <div className={`programs-carousel ${canSlide ? "" : "programs-carousel--static"} ${visiblePrograms.length === 1 ? "programs-carousel--single" : ""}`.trim()}>
                                {canSlide && (
                                    <button
                                        type="button"
                                        className="photo-gallery__control programs-carousel__control"
                                        aria-label={`Previous ${section.title} programs`}
                                        onClick={() => handlePrevious(section)}
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
                                        aria-label={`Next ${section.title} programs`}
                                        onClick={() => handleNext(section)}
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div className="category-section__actions">
                    <button
                        type="button"
                        className="boton-programa category-section__view-more"
                        onClick={handleViewMorePrograms}
                        disabled={isLoadingMoreCategories || !hasMoreCategories}
                    >
                        {hasMoreCategories ? "view more programs" : "no more programs"}
                    </button>
                </div>
            </section>
        </div>
    );
}
