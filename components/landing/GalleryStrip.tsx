import Image from "next/image";

interface GalleryStripProps {
  images: string[];
}

const DEFAULT_IMAGES = [
  "https://picsum.photos/seed/ase1/600/400",
  "https://picsum.photos/seed/ase2/600/400",
  "https://picsum.photos/seed/ase3/600/400",
  "https://picsum.photos/seed/ase4/600/400",
  "https://picsum.photos/seed/ase5/600/400",
  "https://picsum.photos/seed/ase6/600/400",
];

export function GalleryStrip({ images }: GalleryStripProps) {
  const displayImages = images.length > 0 ? images : DEFAULT_IMAGES;
  const items = [...displayImages, ...displayImages];

  return (
    <section className="py-12 overflow-hidden">
      <div className="flex animate-gallery">
        {items.map((src, i) => (
          <div
            key={i}
            className="relative w-[300px] md:w-[400px] aspect-[3/2] rounded-[14px] overflow-hidden shrink-0 mx-3"
          >
            <Image
              src={src}
              alt={`Gallery image ${(i % displayImages.length) + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
