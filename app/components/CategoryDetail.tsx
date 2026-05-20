import type { Category } from "../lib/categories";
import { categoryToProgram } from "../lib/categories";
import CategoryHeroCarousel from "./CategoryHeroCarousel";
import ProgramDetail from "./ProgramDetail";

type CategoryDetailProps = {
  category: Category;
};

export const getCategoryHeroImage = (category: Category) =>
  category.category_hero?.find((hero) => hero.image_url)?.image_url ||
  "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";

export default function CategoryDetail({ category }: CategoryDetailProps) {
  return (
    <ProgramDetail
      program={categoryToProgram(category)}
      HeroCarousel={CategoryHeroCarousel}
    />
  );
}
