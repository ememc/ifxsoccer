import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetail, { getProgramHeroImage } from "../../components/ProgramDetail";
import {
  getProgramBySlug,
  getProgramCanonicalUrl,
  getProgramSlug,
  getPrograms,
} from "../../lib/programs";

type ProgramPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const programs = await getPrograms();

  return programs.map((program) => ({
    slug: getProgramSlug(program),
  }));
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program not found | IFX Soccer",
    };
  }

  return {
    title: `${program.program_title} | IFX Soccer`,
    description: program.program_description,
    alternates: {
      canonical: getProgramCanonicalUrl(program),
    },
    openGraph: {
      title: program.program_title,
      description: program.program_description,
      images: [getProgramHeroImage(program)],
      type: "article",
    },
  };
}

export default async function ProgramDetailPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return <ProgramDetail program={program} />;
}
