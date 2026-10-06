import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mini, PracticeSet, WorkedSet } from "@/components/dilr-set";
import { PageHeader } from "@/components/ui";
import { dilrChapters } from "@/content/dilr";

export const dynamicParams = false;

export function generateStaticParams() {
  return dilrChapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/dilr/sets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = dilrChapters.find((x) => x.slug === slug);
  return { title: c && `DILR: ${c.title.toLowerCase()}`, description: c?.lede };
}

export default async function SetChapter({ params }: PageProps<"/dilr/sets/[slug]">) {
  const { slug } = await params;
  const i = dilrChapters.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const c = dilrChapters[i];
  const prev = dilrChapters[i - 1];
  const next = dilrChapters[i + 1];

  return (
    <main className="mx-auto max-w-[1000px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow={`DILR guide, section ${c.n}`} title={c.title}>{c.lede}</PageHeader>
      <div className="mt-14 space-y-10">
        {c.items.map((it, k) =>
          "mini" in it ? <Mini key={k} title={it.mini} body={it.body} />
          : "n" in it ? <WorkedSet key={k} s={it} />
          : <PracticeSet key={k} s={it} />,
        )}
      </div>
      <nav aria-label="Previous and next" className="mt-20 grid gap-6 border-t-2 border-line pt-8 sm:grid-cols-2">
        {prev ? (
          <Link href={`/dilr/sets/${prev.slug}`} className="btn btn-secondary flex-col items-start">
            <span className="text-caption text-muted">Previous</span>{prev.title}
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/dilr/sets/${next.slug}`} className="btn btn-secondary flex-col items-start sm:items-end sm:text-right">
            <span className="text-caption text-muted">Next</span>{next.title}
          </Link>
        )}
      </nav>
    </main>
  );
}
