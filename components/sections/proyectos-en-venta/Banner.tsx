import type { ComponentProps } from "react";
import { HeroProyectos } from "./HeroProyectos";

export function Banner(props: ComponentProps<typeof HeroProyectos>) {
  return <HeroProyectos {...props} dataSection="banner" />;
}
