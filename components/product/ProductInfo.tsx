import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, calculateSavings } from "@/lib/utils";
import { ShieldCheck, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { Product } from "@/lib/types";

interface ProductInfoProps {
  product: Product;
  whatsappNumber: string;
}

export function ProductInfo({ product, whatsappNumber }: ProductInfoProps) {
  const savings = calculateSavings(product.price, product.original_price);
  const whatsappText = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par le ${product.name} à ${formatPrice(product.price)} Ar. Est-il toujours disponible ?`,
  );
  const safeNumber = whatsappNumber.replace(/[^\d+]/g, "");
  const whatsappLink = `https://wa.me/${safeNumber}?text=${whatsappText}`;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Fil d'ariane" className="flex items-center gap-2 text-[13px] text-text-muted">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-text-primary transition-colors">
          Produits
        </Link>
        <span>/</span>
        <span className="text-text-secondary" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* Title & Badge */}
      <div className="space-y-3">
        <h1 className="font-headline font-bold text-2xl md:text-3xl text-text-primary">
          {product.name}
        </h1>
        <Badge condition={product.condition} />
      </div>

      {/* Price block */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="font-headline font-bold text-3xl text-text-primary">
            {formatPrice(product.price)} Ar
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-[15px] text-text-muted line-through">
              {formatPrice(product.original_price)} Ar
            </span>
          )}
        </div>
        {savings && (
          <p className="text-accent text-[14px] font-semibold">
            Vous économisez {formatPrice(savings.amount)} Ar ({savings.percentage}%)
          </p>
        )}
      </div>

      {/* Specs table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="rounded-[12px] border border-[rgba(138,158,150,0.08)] overflow-hidden">
          <table className="w-full text-[14px]">
            <tbody>
              {Object.entries(product.specs).map(([key, value], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-surface-1" : "bg-surface-2"}>
                  <td className="px-4 py-3 text-text-muted font-medium w-1/3">{key}</td>
                  <td className="px-4 py-3 text-text-primary">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="space-y-2">
          <h2 className="font-headline font-semibold text-[16px] text-text-primary">Description</h2>
          <p className="text-text-secondary text-[14px] leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[12px] font-body font-semibold text-[13px] bg-accent text-surface-0 hover:bg-accent-light px-8 py-4 transition-colors duration-200"
        >
          <WhatsappLogo size={18} weight="fill" />
          Commander via WhatsApp
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-[12px] font-body font-semibold text-[13px] border border-[rgba(138,158,150,0.15)] text-text-primary hover:border-[rgba(138,158,150,0.3)] hover:bg-surface-2 px-8 py-4 transition-colors duration-200"
        >
          Nous contacter
        </Link>
      </div>

      {/* Warranty note */}
      <div className="flex items-start gap-3 p-4 rounded-[12px] bg-surface-1 border border-[rgba(138,158,150,0.06)]">
        <ShieldCheck size={20} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
        <p className="text-[13px] text-text-secondary leading-relaxed">
          Tous nos produits sont garantis <strong className="text-text-primary">24 mois</strong>.
          Chaque appareil est rigoureusement testé et reconditionné par nos experts.
        </p>
      </div>
    </div>
  );
}
