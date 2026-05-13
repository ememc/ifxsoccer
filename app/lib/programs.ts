import { API_ENDPOINTS, API_URL_BASE } from "../config/api";

export type ProgramHero = {
  image_text?: string;
  image_url?: string;
};

export type ProgramSection = {
  section_title?: string;
  section_text?: string;
  section_image?: string;
  section_order?: string;
};

export type ProgramDetail = {
  detail_title?: string;
  detail_text?: string;
  detail_file?: string;
};

export type ProgramInformation = {
  information_title?: string;
  information_url?: string;
  information_image?: string;
};

export type ProgramVariation = {
  variations_description?: string;
  variations_dates?: string;
  variations_deadline?: string;
  variations_cost?: string;
};

export type ProgramAddon = {
  addons_title?: string;
  addons_cost?: string;
  addons_description?: string;
};

export type ProgramPlayer = {
  player_description?: string;
  player_image?: string;
  player_says?: string;
};

export type Program = {
  program_id: string;
  program_title: string;
  program_description?: string;
  program_category?: string;
  program_status?: string;
  program_date?: string;
  program_apply?: string;
  program_enabled?: boolean;
  program_hero?: ProgramHero[];
  program_section?: ProgramSection[];
  program_details?: ProgramDetail[] | ProgramDetail;
  program_information?: ProgramInformation[] | ProgramInformation;
  program_variations?: ProgramVariation[] | ProgramVariation;
  program_addons?: ProgramAddon[] | ProgramAddon;
  program_players?: ProgramPlayer[] | ProgramPlayer;
  program_slug?: string;
  canonical_url?: string;
  program_canonical?: string;
  program_url?: string;
};

type ProgramApiResponse =
  | Program[]
  | {
      body?: string | ProgramApiResponse;
      programs?: Program[];
      items?: Program[];
      data?: Program[];
    };

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ifxsoccer.com").replace(/\/$/, "");

export const slugifyProgramTitle = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const getProgramSlug = (program: Program) => {
  const adminSlug =
    program.program_slug ||
    program.program_url ||
    program.program_canonical ||
    program.canonical_url;

  if (adminSlug) {
    try {
      const pathname = new URL(adminSlug).pathname;
      const lastSegment = pathname.split("/").filter(Boolean).pop();
      if (lastSegment) {
        return slugifyProgramTitle(lastSegment);
      }
    } catch {
      const lastSegment = trimSlashes(adminSlug).split("/").filter(Boolean).pop();
      if (lastSegment) {
        return slugifyProgramTitle(lastSegment);
      }
    }
  }

  return slugifyProgramTitle(program.program_title);
};

export const getProgramPath = (program: Program) => `/programs/${getProgramSlug(program)}`;

export const getProgramCanonicalUrl = (program: Program) => {
  const adminCanonical = program.canonical_url || program.program_canonical || program.program_url;

  if (adminCanonical) {
    try {
      return new URL(adminCanonical).toString();
    } catch {
      return `${SITE_URL}/${trimSlashes(adminCanonical)}`;
    }
  }

  return `${SITE_URL}${getProgramPath(program)}`;
};

const parseProgramResponse = (payload: ProgramApiResponse): Program[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.body)) {
    return payload.body;
  }

  if (typeof payload.body === "string") {
    try {
      return parseProgramResponse(JSON.parse(payload.body));
    } catch {
      return [];
    }
  }

  if (payload.body) {
    return parseProgramResponse(payload.body);
  }

  return payload.programs ?? payload.items ?? payload.data ?? [];
};

export const getPrograms = async () => {
  const response = await fetch(`${API_URL_BASE}${API_ENDPOINTS.programs}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Unable to load programs: ${response.status}`);
  }

  const payload = (await response.json()) as ProgramApiResponse;

  return parseProgramResponse(payload).filter(
    (program) => program.program_enabled !== false && Boolean(program.program_title)
  );
};

export const getProgramBySlug = async (slug: string) => {
  const programs = await getPrograms();
  return programs.find((program) => getProgramSlug(program) === slug) ?? null;
};
