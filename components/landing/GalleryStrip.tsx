import Image from "next/image";
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
    <section className="py-12 overflow-hidden group-gallery">
      <div className="flex animate-gallery">
        {duplicated.map((item, i) => {
          const pass = i < validItems.length ? "a" : "b";
          const idx = i % validItems.length;
          const key = `${pass}-${idx}`;

          const imageEl = (
            <div
              key={key}
              className="relative w-[240px] md:w-[380px] aspect-[3/2] rounded-[12px] md:rounded-[14px] overflow-hidden shrink-0 mx-2 md:mx-3"
            >
              <Image
                src={item.image}
                alt={`Gallery image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 240px, 380px"
                className="object-cover"
              />
            </div>
          );

          if (item.link) {
            return (
              <Link key={key} href={item.link} className="shrink-0">
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
