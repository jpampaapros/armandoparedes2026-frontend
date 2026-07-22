import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { HeaderClient } from "./HeaderClient";
import type { ACFLink, ACFImage } from "@/lib/types";

export type HeaderData = {
  logo?: ACFImage;
  main_menu?: {
    contact_link?: ACFLink;
  };
  modal_menu?: {
    logo?: ACFImage;
    menu?: { link?: ACFLink }[];
    image?: ACFImage;
  };
};

export async function Header() {
  const data = await createWordPressRestClient({
    cache: { revalidate: 3600, tags: ["wordpress-header"] },
  }).request<HeaderData>("/wp-json/armando-paredes/v1/options/header");

  return <HeaderClient data={data} />;
}
