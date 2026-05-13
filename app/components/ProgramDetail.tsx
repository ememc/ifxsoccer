/* eslint-disable @next/next/no-img-element */
import type { Program, ProgramSection } from "../lib/programs";
import { getProgramPhotos, getProgramVideos } from "../lib/galleries";
import ProgramHeroCarousel from "./ProgramHeroCarousel";

type ProgramDetailProps = {
  program: Program;
};

type InternalNavItem = {
  label: string;
  href: string;
};

export const getProgramHeroImage = (program: Program) =>
  program.program_hero?.find((hero) => hero.image_url)?.image_url ||
  "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";

const slugifyAnchor = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getOrderedSections = (program: Program) =>
  [...(program.program_section ?? [])]
    .filter((section) => section.section_title || section.section_text || section.section_image)
    .sort((first, second) => Number(first.section_order ?? 0) - Number(second.section_order ?? 0));

const toArray = <T,>(value: T[] | T | undefined): T[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const getSectionAnchor = (section: ProgramSection, index: number) =>
  slugifyAnchor(section.section_title || `program-section-${index + 1}`);

const addNavItem = (items: InternalNavItem[], label: string, href: string) => {
  const normalizedLabel = label.trim();

  if (!normalizedLabel || items.some((item) => item.href === href)) {
    return;
  }

  items.push({ label: normalizedLabel, href });
};

const getInternalNavItems = (
  sections: ProgramSection[],
  hasDetails: boolean,
  hasInformation: boolean,
  hasVariations: boolean,
  hasAddons: boolean,
  hasPlayers: boolean,
  hasVideos: boolean,
  hasPhotos: boolean
) => {
  const items: InternalNavItem[] = [];

  addNavItem(items, "Overview", "#program-intro");

  sections.forEach((section, index) => {
    if (section.section_title) {
      addNavItem(items, section.section_title, `#${getSectionAnchor(section, index)}`);
    }
  });

  if (hasDetails) {
    addNavItem(items, "Program Details", "#program-details");
  }

  if (hasInformation) {
    addNavItem(items, "More Information", "#more-information");
  }

  if (hasAddons) {
    addNavItem(items, "Add-ons", "#add-ons");
  }

  if (hasPlayers) {
    addNavItem(items, "Player Stories", "#player-stories");
  }

  if (hasVideos) {
    addNavItem(items, "Videos", "#video-gallery");
  }

  if (hasPhotos) {
    addNavItem(items, "Photos", "#photo-gallery");
  }

  if (hasVariations) {
    addNavItem(items, "Dates & Prices", "#dates-prices");
  }

  return items;
};

const renderSectionText = (section: ProgramSection) => {
  if (!section.section_text) {
    return null;
  }

  return getTextParagraphs(section.section_text).map((paragraph, index) => (
    <p key={`${section.section_title || "section"}-${index}`}>{paragraph}</p>
  ));
};

const getTextParagraphs = (text: string | undefined) =>
  (text ?? "")
    .split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const renderDetailText = (text: string | undefined, keyPrefix: string) => {
  const paragraphs = getTextParagraphs(text);

  if (paragraphs.length === 0) {
    return null;
  }

  if (paragraphs.length > 2) {
    return (
      <ul>
        {paragraphs.map((paragraph, index) => (
          <li key={`${keyPrefix}-item-${index}`}>{paragraph}</li>
        ))}
      </ul>
    );
  }

  return paragraphs.map((paragraph, index) => (
    <p key={`${keyPrefix}-paragraph-${index}`}>{paragraph}</p>
  ));
};

export default async function ProgramDetail({ program }: ProgramDetailProps) {
  const sections = getOrderedSections(program);
  const details = toArray(program.program_details);
  const information = toArray(program.program_information);
  const variations = toArray(program.program_variations);
  const addons = toArray(program.program_addons);
  const players = toArray(program.program_players);
  // Keep galleries wired for later, but do not render them yet.
  const showGalleries = false;
  const [videos, photos] = showGalleries
    ? await Promise.all([getProgramVideos(), getProgramPhotos()])
    : [[], []];
  const navItems = getInternalNavItems(
    sections,
    details.length > 0,
    information.length > 0,
    variations.length > 0,
    addons.length > 0,
    players.length > 0,
    videos.length > 0,
    photos.length > 0
  );
  const programDetailsSection = details.length > 0 && (
    <section className="acordeon seccion contenedor" id="program-details">
      <div className="photo-gallery-title contenedor">
        <h2>Program details</h2>
      </div>

      <div>
        {details.map((detail, index) => (
          <details key={`${detail.detail_title}-${index}`}>
            <summary>{detail.detail_title || `Program detail ${index + 1}`}</summary>
            <div className="contenido-acordeon">
              {renderDetailText(detail.detail_text, `${detail.detail_title}-${index}`)}
              {detail.detail_file && (
                <a href={detail.detail_file}>
                  <p>Download file</p>
                </a>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
  const datesPricesSection = variations.length > 0 && (
    <div className="tabla-programas contenedor" id="dates-prices">
      <div className="photo-gallery-title contenedor">
        <h2>Program Dates & Prices</h2>
      </div>

      <table>
        <tbody>
          <tr>
            <th>Program / Duration</th>
            <th>Dates</th>
            <th className="cost">Cost</th>
            <th>Deadline</th>
          </tr>

          {variations.map((variation, index) => (
            <tr key={`${variation.variations_description}-${index}`}>
              <td>{variation.variations_description}</td>
              <td>{variation.variations_dates}</td>
              <td className="cost">{variation.variations_cost ? `${variation.variations_cost}` : ""}</td>
              <td className="deadline">{variation.variations_deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <p className="nota">
        <i className="fa-solid fa-exclamation"></i>&nbsp; Late applications considered on a case by case basis depending on availability.
      </p>
    </div>
  );
  const addOnsSection = addons.length > 0 && (
    <div className="tabla-programas contenedor" id="add-ons">
      <div className="photo-gallery-title contenedor">
        <h2>Add-ons</h2>
      </div>

      <table>
        <tbody>
          <tr>
            <th>Add-on</th>
            <th>Description</th>
            <th className="cost">Cost</th>
          </tr>

          {addons.map((addon, index) => (
            <tr key={`${addon.addons_title}-${index}`}>
              <td>{addon.addons_title}</td>
              <td>{addon.addons_description}</td>
              <td className="cost">{addon.addons_cost ? `${addon.addons_cost}` : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  );

  return (
    <article className="program-detail">
      <div className="nav-interna">
        <div className="prog-navbar contenedor">
          <h1 className="h1programa">{program.program_title}</h1>
        </div>

        <div className="mobile-menu">
          <img src="/assets/img/barras.svg" alt="menu responsive" />
        </div>

        {navItems.length > 0 && (
          <div className="navegacion contenedor">
            <div className="prog-links mostrar">
              {navItems.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProgramHeroCarousel
        applyUrl={program.program_apply || "https://ifxsoccer.com/apply"}
        fallbackTitle={program.program_title}
        heroes={program.program_hero}
      />

      <section className="pro-body seccion contenedor" id="program-intro">
        <h2 className="h2programa">{program.program_title}</h2>

        {program.program_description && (
          <div className="intro-program">
            {getTextParagraphs(program.program_description).map((paragraph, index) => (
              <p key={`${program.program_id}-description-${index}`}>{paragraph}</p>
            ))}
          </div>
        )}
      </section>

      <div className="program-detail__body contenedor">
        {sections.length > 0 && (
          <section>
            {sections.map((section, index) => (
              <div
                className={index === 0 ? "intro-secciones" : "alterna"}
                id={getSectionAnchor(section, index)}
                key={`${section.section_title}-${index}`}
              >
                {section.section_image && (
                  <div className={index === 0 ? "imagen-secciones" : "alterna-imagen"}>
                    <picture>
                      <source srcSet={section.section_image} type="image/webp" />
                      <source srcSet={section.section_image} type="image/jpeg" />
                      <img
                        loading="lazy"
                        src={section.section_image}
                        alt={section.section_title || program.program_title}
                      />
                    </picture>
                  </div>
                )}
                <div className={index === 0 ? "texto-secciones" : "alterna-contenido"}>
                  {section.section_title && <h3>{section.section_title}</h3>}
                  {renderSectionText(section)}
                </div>
              </div>
            ))}
          </section>
        )}

        {information.length > 0 && (
          <section className="program-detail__panel" id="more-information">
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

      </div>

      {players.length > 0 && (
        <div className="envoltura-gris" id="player-stories">
          <section className="our-players contenedor">
            <h2>Our Players Say</h2>

            <div className="testimonials">
              {players.map((player, index) => (
                <div className="testimonial" key={`${player.player_says || player.player_description}-${index}`}>
                  {player.player_image && (
                    <img
                      src={player.player_image}
                      alt={player.player_description || player.player_says || "Player testimonial"}
                      className="author-photo"
                    />
                  )}
                  {player.player_says && <p className="quote">{player.player_says}</p>}
                  {player.player_description && <p className="author">- {player.player_description}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {programDetailsSection}
      {datesPricesSection}
      {addOnsSection}

      <div className="envoltura-gris">
        <div className="imp-info1 contenedor">
          <h2>Important Information</h2>
          <div className="info-items">
            <div className="info-item">
              <i className="fa-solid fa-circle-question"></i>
              <a href="#">FAQ</a>
            </div>
            <div className="info-item">
              <i className="fa-solid fa-passport"></i>

              <a href="#">Visa</a>
            </div>
            <div className="info-item">
              <i className="fa-solid fa-book-medical"></i>
              <a href="#">Medical Insurance</a>
            </div>
            <div className="info-item">
              <i className="fa-solid fa-id-card"></i>
              <a href="#">Player Licences</a>
            </div>
          </div>
        </div>
      </div>

      {showGalleries && videos.length > 0 && (
        <section className="video-section" id="video-gallery">
          <div className="title-video contenedor">
            <h2>Video Gallery</h2>
            <div className="boton-more">
              <a href="#" className="boton boton-news">More Video Galleries</a>
            </div>
          </div>

          <div className="video-grid contenedor">
            {videos.map((video) => (
              <div className="video-item" key={video.id}>
                <div className="video-iframe-wrapper">
                  <iframe
                    width="560"
                    height="315"
                    loading="lazy"
                    src={video.url}
                    title={video.title || "Program video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="texto-video">
                  <p className="video-desc">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="boton-base">
            <a href="#" className="boton boton-news">More Video Galleries</a>
          </div>
        </section>
      )}

      {showGalleries && photos.length > 0 && (
        <section className="photo-gallery" id="photo-gallery">
          <div className="photo-gallery-title contenedor">
            <h2>Photo Gallery</h2>
            <div className="boton-more">
              <a href="#" className="boton boton-news">More Photo Galleries</a>
            </div>
          </div>

          <div className="photo-grid">
            {photos.map((photo) => (
              <div className="photo-item" key={photo.id}>
                <img src={photo.url} alt={photo.alt} loading="lazy" />
                <div className="photo-caption">
                  <p>{photo.title}</p>
                </div>
              </div>
            ))}

            <div className="boton-base">
              <a href="#" className="boton boton-news">
                <i className="fa-solid fa-camera"></i> More Photo Galleries
              </a>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
