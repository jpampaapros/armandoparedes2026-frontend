import Image from "next/image";
import Link from "next/link";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { resolveWordPressUrl, isExternalUrl } from "@/lib/urls";
import type { ACFImage, ACFLink } from "@/lib/types";

export type FooterLinkItem = {
  link?: ACFLink;
  icon?: ACFImage;
};

export type FooterLinkColumn = {
  title?: string;
  links?: FooterLinkItem[];
};

export type FooterInfoColumn = {
  title?: string;
  description?: string;
  redes?: { icon?: ACFImage; link?: ACFLink }[];
};

export type FooterData = {
  title?: string;
  columns?: {
    link_columns?: FooterLinkColumn[];
    info_column?: FooterInfoColumn;
  };
};

function FooterLink({ item }: { item?: FooterLinkItem }) {
  const url = item?.link?.url;
  if (!url) return null;

  const { link, icon } = item;
  const children = (
    <>
      {icon?.url && (
        <Image
          src={icon.url}
          alt={icon.alt || ""}
          width={icon.width ?? 33}
          height={icon.height ?? 23}
          className="h-auto w-33 shrink-0"
        />
      )}
      <span className="whitespace-nowrap">{link?.title || url}</span>
    </>
  );

  const className =
    "inline-flex h-24 items-center gap-7 text-18 leading-24 font-normal text-header-text no-underline transition-opacity hover:opacity-80";

  if (isExternalUrl(url)) {
    return (
      <a
        href={url}
        className={className}
        target={link?.target || "_blank"}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={resolveWordPressUrl(url)} className={className} target={link?.target || undefined} prefetch={false}>
      {children}
    </Link>
  );
}

function SocialLink({ item }: { item?: { icon?: ACFImage; link?: ACFLink } }) {
  const url = item?.link?.url;
  const iconUrl = item?.icon?.url;
  if (!url || !iconUrl) return null;

  const { link, icon } = item;

  return (
    <a
      href={url}
      target={link?.target || "_blank"}
      rel="noopener noreferrer"
      aria-label={link?.title || url}
      className="inline-flex h-30 w-30 items-center justify-center transition-opacity hover:opacity-80"
    >
      <Image
        src={iconUrl}
        alt={icon?.alt || link?.title || ""}
        width={30}
        height={30}
        className="h-auto w-30"
      />
    </a>
  );
}

function Description({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <div
      className="m-0 text-18 leading-24 font-normal text-header-text"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}

const COLUMN_ORDER_CLASSES = [
  "order-2 row-start-2 md:order-1 md:row-start-1",
  "order-3 row-start-2 md:order-2 md:row-start-1",
  "order-4 row-start-3 md:order-3 md:row-start-1",
];

const COLUMN_SPAN_CLASSES = [
  "col-span-1",
  "col-span-1",
  "col-span-2 md:col-auto",
];

export async function Footer() {
  const data = await createWordPressRestClient({
    cache: { revalidate: 3600, tags: ["wordpress-footer"] },
  }).request<FooterData>("/wp-json/armando-paredes/v1/options/footer");

  const linkColumns = data.columns?.link_columns?.filter(Boolean) ?? [];
  const infoColumn = data.columns?.info_column;

  return (
    <footer className="bg-modal-bg text-header-text font-gotham">
      <div className="mx-auto max-w-1440 px-24 pt-59 pb-60 md:px-80 md:pt-66 md:pb-40">
        {data.title && (
                <h2
            className="mx-0 mb-60 mt-0 max-w-857 text-36 font-normal uppercase leading-44 md:mx-auto md:mb-70 md:font-gotham-black md:font-medium md:text-60 md:leading-66"
            style={{ marginTop: 0 }}
          >
            {data.title}
          </h2>
        )}

        <div className="grid grid-cols-2 gap-x-16 gap-y-60 md:grid-cols-[--spacing(105)_--spacing(125)_--spacing(249)_--spacing(249)] md:gap-x-193 md:gap-y-0">
          {infoColumn && (
            <div className="col-span-2 order-1 row-start-1 flex flex-col justify-between gap-26 md:justify-start md:col-auto md:col-start-4 md:row-start-1 md:order-none">
              <div className="flex flex-col gap-16">
                {infoColumn.title && (
                  <h3 className="m-0 text-18 font-bold leading-24">
                    {infoColumn.title}
                  </h3>
                )}
                <Description text={infoColumn.description} />
              </div>
              {infoColumn.redes && infoColumn.redes.length > 0 && (
                <div className="flex items-center gap-14 md:mt-0">
                  {infoColumn.redes.map((item, i) => (
                    <SocialLink key={i} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {linkColumns.map((column, index) => (
            <div
              key={index}
              className={`${COLUMN_SPAN_CLASSES[index] ?? "col-span-1"} ${COLUMN_ORDER_CLASSES[index] ?? "order-4 md:order-3"} flex flex-col gap-16`}
            >
              {column.title && (
                <h3 className="m-0 text-18 font-bold leading-24">
                  {column.title}
                </h3>
              )}
              <ul className="m-0 flex list-none flex-col gap-16 p-0">
                {column.links?.map((item, i) => (
                  <li key={i} className="m-0 p-0">
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
