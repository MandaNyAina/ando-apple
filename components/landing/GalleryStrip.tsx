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
  if (items.length === 0) return null;

  const duplicated = [...items, ...items];

  return (
    <section className="py-12 overflow-hidden">
      <div className="flex animate-gallery">
        {duplicated.map((item, i) => {
          const imageEl = (
            <div
              key={i}
              className="relative w-[300px] md:w-[400px] aspect-[3/2] rounded-[14px] overflow-hidden shrink-0 mx-3"
            >
              <Image
                src={item.image}
                alt={`Gallery image ${(i % items.length) + 1}`}
                fill
                className="object-cover"
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
