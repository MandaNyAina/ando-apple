import sanitizeHtml from "sanitize-html";
import { createClient } from "@/lib/supabase/server";
import { getLogoUrl, getVisibleCategories } from "@/lib/data";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("title, meta_title, meta_description")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!page) return { title: "Page introuvable" };
  return {
    title: page.meta_title || `${page.title} — ASE TECH`,
    description: page.meta_description || "",
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: page }, logoUrl, categories] = await Promise.all([
    supabase.from("pages").select("*").eq("slug", slug).eq("published", true).single(),
    getLogoUrl(),
    getVisibleCategories(),
  ]);

  if (!page) notFound();

  // Sanitize HTML content to prevent XSS - only allow safe tags and attributes
  const safeContent = sanitizeHtml(page.content, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "h1",
      "h2",
      "h3",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "class"],
      img: ["src", "alt", "class"],
      "*": ["class"],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
        },
      }),
    },
  });

  const ctaLink = page.cta_link;
  const isSafeLink =
    ctaLink && (ctaLink.startsWith("/") || ctaLink.startsWith("https://"));

  return (
    <main className="bg-surface-0 text-text-primary min-h-[100dvh]">
      <Nav logoUrl={logoUrl} categories={categories} />
      <div className="max-w-[800px] mx-auto px-6 md:px-12 pt-28 pb-20">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-[-1.5px] mb-8">
          {page.title}
        </h1>
        {/* Content is sanitized server-side with sanitize-html above */}
        <div
          className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed [&_h2]:font-headline [&_h2]:text-text-primary [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-headline [&_h3]:text-text-primary [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:text-accent-light [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
        {page.cta_text && isSafeLink && (
          <div className="mt-12">
            <Link href={ctaLink}>
              <Button variant="solid">{page.cta_text}</Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
