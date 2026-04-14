import Link from "next/link";

interface GalleryStripItem {
  image: string;
  link: string;
}

interface GalleryStripProps {
  items: GalleryStripItem[];
}

export function GalleryStrip({ items }: GalleryStripProps) {
  const validItems = items.filter((item) => item.image);
  if (validItems.length === 0) return null;

  const duplicated = [...validItems, ...validItems];

  return (
    <section className="py-12 overflow-hidden">
      <div className="flex animate-gallery">
        {duplicated.map((item, i) => {
          const imageEl = (
            <div
              key={i}
              className="relative w-[240px] md:w-[380px] aspect-[3/2] rounded-[12px] md:rounded-[14px] overflow-hidden shrink-0 mx-2 md:mx-3"
            >
              <img
                src={item.image}
                alt={`Gallery image ${(i % validItems.length) + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          );

          if (item.link) {
            return (
              <Link key={i} href={item.link} className="shrink-0">
                {imageEl}
              </Link>
            );
          }

          return imageEl;
        })}
      </div>
    </section>
  );
}
