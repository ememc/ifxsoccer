import { API_ENDPOINTS, API_URL_BASE } from "../config/api";
import categoriesSnapshot from "../data/categories.json";
import {
  slugifyProgramTitle,
  type Program,
  type ProgramAddon,
  type ProgramDetail,
  type ProgramHero,
  type ProgramInformation,
  type ProgramPlayer,
  type ProgramSection,
  type ProgramVariation,
} from "./programs";

export type Category = {
  category_id: string;
  category_title: string;
  category_description?: string;
  category_apply?: string;
  category_enabled?: boolean;
  category_hero?: ProgramHero[];
  category_section?: ProgramSection[] | boolean;
  category_details?: ProgramDetail[] | ProgramDetail;
  category_information?: ProgramInformation[] | ProgramInformation;
  category_variations?: ProgramVariation[] | ProgramVariation;
  category_addons?: ProgramAddon[] | ProgramAddon;
  category_players?: ProgramPlayer[] | ProgramPlayer;
  category_slug?: string;
  canonical_url?: string;
  category_canonical?: string;
  category_url?: string;
};

type CategoryApiResponse =
  | Category[]
  | {
      body?: string | CategoryApiResponse;
      category?: Category[];
      categories?: Category[];
      items?: Category[];
      data?: Category[];
      results?: Category[];
    };

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ifxsoccer.com").replace(/\/$/, "");
let hasLoggedCategoryFallback = false;

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

const getLastSlugSegment = (value: string) => {
  try {
    const pathname = new URL(value).pathname;
    return pathname.split("/").filter(Boolean).pop() ?? "";
  } catch {
    return trimSlashes(value).split("/").filter(Boolean).pop() ?? "";
  }
};

export const getCategorySlug = (category: Category) => {
  const adminSlug =
    category.category_slug ||
    category.category_url ||
    category.category_canonical ||
    category.canonical_url;

  if (adminSlug) {
    const lastSegment = getLastSlugSegment(adminSlug);

    if (lastSegment) {
      return slugifyProgramTitle(lastSegment);
    }
  }

  return slugifyProgramTitle(category.category_title);
};

export const getCategoryPath = (category: Category) => `/category/${getCategorySlug(category)}/`;

export const getCategoryCanonicalUrl = (category: Category) => {
  const adminCanonical = category.canonical_url || category.category_canonical || category.category_url;

  if (adminCanonical) {
    try {
      return new URL(adminCanonical).toString();
    } catch {
      return `${SITE_URL}/${trimSlashes(adminCanonical)}`;
    }
  }

  return `${SITE_URL}${getCategoryPath(category)}`;
};

const parseCategoryResponse = (payload: CategoryApiResponse): Category[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.body)) {
    return payload.body;
  }

  if (typeof payload.body === "string") {
    try {
      return parseCategoryResponse(JSON.parse(payload.body));
    } catch {
      return [];
    }
  }

  if (payload.body) {
    return parseCategoryResponse(payload.body);
  }

  return payload.category ?? payload.categories ?? payload.items ?? payload.data ?? payload.results ?? [];
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL_BASE}${API_ENDPOINTS.category}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(`Unable to load categories: ${response.status}`);
      return [];
    }

    const payload = (await response.json()) as CategoryApiResponse;

    return parseCategoryResponse(payload).filter(
      (category) => category.category_enabled !== false && Boolean(category.category_title)
    );
  } catch (error) {
    if (!hasLoggedCategoryFallback) {
      console.warn("Unable to load categories during static generation, using local snapshot", error);
      hasLoggedCategoryFallback = true;
    }

    return (categoriesSnapshot as Category[]).filter(
      (category) => category.category_enabled !== false && Boolean(category.category_title)
    );
  }
};

export const getCategoryBySlug = async (slug: string) => {
  const categories = await getCategories();
  return categories.find((category) => getCategorySlug(category) === slug) ?? null;
};

export const categoryToProgram = (category: Category): Program => ({
  program_id: category.category_id,
  program_title: category.category_title,
  program_description: category.category_description,
  program_apply: category.category_apply,
  program_enabled: category.category_enabled,
  program_hero: category.category_hero,
  program_section: Array.isArray(category.category_section) ? category.category_section : [],
  program_details: category.category_details,
  program_information: category.category_information,
  program_variations: category.category_variations,
  program_addons: category.category_addons,
  program_players: category.category_players,
  program_slug: getCategorySlug(category),
  canonical_url: getCategoryCanonicalUrl(category),
});
