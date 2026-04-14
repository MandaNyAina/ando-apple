import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-surface-0 text-text-primary">
      <Nav />
      <div className="min-h-[100dvh] flex items-center justify-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">
          ASE<span className="text-accent font-normal">TECH</span>
        </h1>
      </div>
      <Footer />
    </main>
  );
}
