import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryDetail, { getCategoryHeroImage } from "../../components/CategoryDetail";
import {
  getCategories,
  getCategoryBySlug,
  getCategoryCanonicalUrl,
  getCategorySlug,
} from "../../lib/categories";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    slug: getCategorySlug(category),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category not found | IFX Soccer",
    };
  }

  return {
    title: `${category.category_title} | IFX Soccer`,
    description: category.category_description,
    alternates: {
      canonical: getCategoryCanonicalUrl(category),
    },
    openGraph: {
      title: category.category_title,
      description: category.category_description,
      images: [getCategoryHeroImage(category)],
      type: "article",
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return <CategoryDetail category={category} />;
}
