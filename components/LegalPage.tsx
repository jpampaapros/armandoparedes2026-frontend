import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { stripHtml } from "@/lib/utils";

type LegalPageFields = { contenido?: string };

type WordPressLegalPage = {
  id: number;
  title: { rendered: string };
  content?: { rendered?: string };
  acf?: LegalPageFields | [];
  acf_full?: LegalPageFields;
};

/**
 * Páginas legales (política de privacidad, términos y condiciones): un título y un
 * WYSIWYG de ACF llamado `contenido`. Si el campo aún no se expone en REST se cae al
 * contenido nativo de la página.
 */
export async function getLegalPage(id: number): Promise<WordPressLegalPage | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    return await wordpress.request<WordPressLegalPage>(
      `/wp-json/wp/v2/pages/${id}?acf_format=standard&_fields=id,title,content,acf,acf_full`,
    );
  } catch {
    return null;
  }
}

function getContenido(page: WordPressLegalPage): string {
  const acf = Array.isArray(page.acf) ? undefined : page.acf;
  return acf?.contenido || page.acf_full?.contenido || page.content?.rendered || "";
}

export async function getLegalPageMetadata(id: number, fallbackTitle: string): Promise<Metadata> {
  const page = await getLegalPage(id);
  const title = stripHtml(page?.title.rendered) || fallbackTitle;
  return { title: `${title} | Armando Paredes` };
}

export async function LegalPage({ id }: { id: number }) {
  const page = await getLegalPage(id);
  if (!page) notFound();

  const contenido = getContenido(page);

  return (
    <main className="w-full bg-white">
      <article className="mx-auto min-w-0 w-382 overflow-hidden py-40 md:w-full md:px-355 md:py-80">
        <h1
          className="m-0 w-full font-gotham-medium text-28 font-medium leading-28 text-near-black md:text-40 md:leading-40"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />
        {contenido && (
          <div
            className="mt-32 min-w-0 max-w-full font-poppins text-16 font-normal leading-[1.6] text-near-black md:mt-48 md:text-16 md:leading-[1.7] [&_p]:m-0 [&_p+p]:mt-16 [&_ul]:mt-16 [&_ul]:list-disc [&_ul]:pl-24 [&_ol]:mt-16 [&_ol]:list-decimal [&_ol]:pl-24 [&_li]:mb-8 [&_strong]:font-semibold [&_em]:italic [&_a]:text-peach [&_a]:underline [&_h2]:mt-32 [&_h2]:text-24 [&_h2]:font-semibold [&_h3]:mt-24 [&_h3]:text-20 [&_h3]:font-semibold [&_table]:mt-16 [&_table]:w-full [&_td]:border [&_td]:border-border-light [&_td]:p-8 [&_th]:border [&_th]:border-border-light [&_th]:p-8"
            dangerouslySetInnerHTML={{ __html: contenido }}
          />
        )}
      </article>
    </main>
  );
}
