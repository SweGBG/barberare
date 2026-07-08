import { MetadataRoute } from "next";

const BASE_URL = "https://barberare.vercel.app"; // byt till riktig domän

/**
 * Genererar /sitemap.xml automatiskt via Next.js App Router.
 * Vercel kallar denna vid varje build + ISR-revalidering.
 *
 * Testa lokalt: GET http://localhost:3000/sitemap.xml
 * Skicka till Google: Search Console → Sitemaps → klistra in URL
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Statiska sidor
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/boka`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tjanster`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/om-oss`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Om du lägger till blogg/artiklar i framtiden – hämta från Supabase och lägg in här:
  // const posts = await supabase.from("posts").select("slug, updated_at");
  // const blogPages = posts.data?.map(p => ({ url: `${BASE_URL}/blogg/${p.slug}`, ... })) ?? [];

  return [...staticPages];
}
