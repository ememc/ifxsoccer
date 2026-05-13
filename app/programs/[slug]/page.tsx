/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProgramBySlug,
  getProgramCanonicalUrl,
  getProgramSlug,
  getPrograms,
  type Program,
  type ProgramSection,
} from "../../lib/programs";

type ProgramPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getHeroImage = (program: Program) =>
  program.program_hero?.find((hero) => hero.image_url)?.image_url ||
  "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";

const getOrderedSections = (program: Program) =>
  [...(program.program_section ?? [])]
    .filter((section) => section.section_title || section.section_text || section.section_image)
    .sort((first, second) => Number(first.section_order ?? 0) - Number(second.section_order ?? 0));

const renderSectionText = (section: ProgramSection) => {
  if (!section.section_text) {
    return null;
  }

  return <p>{section.section_text}</p>;
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
      images: [getHeroImage(program)],
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

  const heroImage = getHeroImage(program);
  const sections = getOrderedSections(program);
  const details = program.program_details ?? [];
  const information = program.program_information ?? [];
  const variations = program.program_variations ?? [];
  const addons = program.program_addons ?? [];
  const players = program.program_players ?? [];

  return (
    <article className="program-detail">
      <section className="program-detail__hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="program-detail__hero-content contenedor">
          {program.program_category && <p className="program-detail__category">{program.program_category}</p>}
          <h1>{program.program_title}</h1>
          {program.program_description && <p className="program-detail__intro">{program.program_description}</p>}
          <div className="program-detail__actions">
            <a className="boton-programa-azul" href={program.program_apply || "https://ifxsoccer.com/apply"}>
              Apply online
            </a>
          </div>
        </div>
      </section>

      <div className="program-detail__body contenedor">
        {sections.length > 0 && (
          <section className="program-detail__section-list">
            {sections.map((section, index) => (
              <div className="program-detail__section" key={`${section.section_title}-${index}`}>
                {section.section_image && (
                  <img src={section.section_image} alt={section.section_title || program.program_title} />
                )}
                <div>
                  {section.section_title && <h2>{section.section_title}</h2>}
                  {renderSectionText(section)}
                </div>
              </div>
            ))}
          </section>
        )}

        {details.length > 0 && (
          <section className="program-detail__panel">
            <h2>Program Details</h2>
            <div className="program-detail__cards">
              {details.map((detail, index) => (
                <div className="program-detail__card" key={`${detail.detail_title}-${index}`}>
                  {detail.detail_title && <h3>{detail.detail_title}</h3>}
                  {detail.detail_text && <p>{detail.detail_text}</p>}
                  {detail.detail_file && <a href={detail.detail_file}>View file</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {variations.length > 0 && (
          <section className="program-detail__panel">
            <h2>Dates and Costs</h2>
            <div className="program-detail__cards">
              {variations.map((variation, index) => (
                <div className="program-detail__card" key={`${variation.variations_description}-${index}`}>
                  {variation.variations_description && <h3>{variation.variations_description}</h3>}
                  {variation.variations_dates && <p>Dates: {variation.variations_dates}</p>}
                  {variation.variations_deadline && <p>Deadline: {variation.variations_deadline}</p>}
                  {variation.variations_cost && <p>Cost: ${variation.variations_cost}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {addons.length > 0 && (
          <section className="program-detail__panel">
            <h2>Add-ons</h2>
            <div className="program-detail__cards">
              {addons.map((addon, index) => (
                <div className="program-detail__card" key={`${addon.addons_title}-${index}`}>
                  {addon.addons_title && <h3>{addon.addons_title}</h3>}
                  {addon.addons_description && <p>{addon.addons_description}</p>}
                  {addon.addons_cost && <p>Cost: ${addon.addons_cost}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {information.length > 0 && (
          <section className="program-detail__panel">
            <h2>More Information</h2>
            <div className="program-detail__cards">
              {information.map((item, index) => (
                <a className="program-detail__card" href={item.information_url || "#"} key={`${item.information_title}-${index}`}>
                  {item.information_image && <img src={item.information_image} alt={item.information_title || "Program information"} />}
                  {item.information_title && <h3>{item.information_title}</h3>}
                </a>
              ))}
            </div>
          </section>
        )}

        {players.length > 0 && (
          <section className="program-detail__panel">
            <h2>Player Stories</h2>
            <div className="program-detail__cards">
              {players.map((player, index) => (
                <div className="program-detail__card" key={`${player.player_says}-${index}`}>
                  {player.player_image && <img src={player.player_image} alt={player.player_says || "Player testimonial"} />}
                  {player.player_says && <h3>{player.player_says}</h3>}
                  {player.player_description && <p>{player.player_description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
