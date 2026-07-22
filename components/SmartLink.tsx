import Link from "next/link";
import { resolveWordPressUrl, isExternalUrl } from "@/lib/urls";
import type { ACFLink } from "@/lib/types";

export type SmartLinkProps = {
  link?: ACFLink;
  className?: string;
  children?: React.ReactNode;
};

export function SmartLink({ link, className, children }: SmartLinkProps) {
  if (!link?.url) return null;

  const href = resolveWordPressUrl(link.url);
  const isExternal = isExternalUrl(link.url);
  const content = children ?? link.title;

  if (isExternal) {
    return (
      <a
        href={href}
        target={link.target || "_blank"}
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} target={link.target || undefined} className={className} prefetch={false}>
      {content}
    </Link>
  );
}
