import Link from "next/link";
import { getProgramPath, getPrograms, type Program } from "../lib/programs";

const getHeroImage = (program: Program) =>
    program.program_hero?.find((hero) => hero.image_url)?.image_url ||
    "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";

export default async function Category() {
    const programs = await getPrograms();

    return (
        <div>
            <br/>
            <br/>
            <section className="seccion contenedor">
                <h2 className="photo-gallery__title">
                    Soccer Schools, Camps and International Academies
                </h2>
                <div className="contenedor-programas">
                    {programs.map((program) => {
                        const heroImage = getHeroImage(program);

                        return (
                        <div className="programa" key={program.program_id}>
                            <picture>
                                <source src={heroImage} type="image/webp"></source>
                                <source src={heroImage} type="image/jpeg"></source>
                                <img loading="lazy" src={heroImage} alt={program.program_title}></img>
                            </picture>
                            <div className="contenido-programa especial">
                                <h3>{program.program_title}</h3>
                                <p>{program.program_description}</p>
                                <div className="botones">
                                    <Link href={getProgramPath(program)} className="boton-programa">learn more</Link>
                                    <a href={program.program_apply || "https://ifxsoccer.com/apply"} className="boton-programa-azul">Apply online</a>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                    
            </section>
            
        </div>
    );
}
