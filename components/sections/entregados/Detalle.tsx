import Image from "next/image";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { BuildingIcon } from "@/components/icons/BuildingIcon";
import { AreaIcon } from "@/components/icons/AreaIcon";
import { BedIcon } from "@/components/icons/BedIcon";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import type { ACFImage } from "@/lib/types";

type DetalleProps = {
  imagen?: ACFImage;
  icono_direccion?: ACFImage;
  icono_pisos?: ACFImage;
  icono_area?: ACFImage;
  icono_dormitorios?: ACFImage;
  icono_fecha?: ACFImage;
  direccion?: string;
  pisos?: string;
  area?: string;
  dormitorios?: string;
  fecha?: string;
};

type ItemConfig = {
  value?: string;
  icon: React.ReactNode;
  customIcon?: ACFImage;
};

function DetailItem({ icon, customIcon, value }: ItemConfig) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-14">
      <div className="h-30 w-30 shrink-0 text-white">
        {customIcon?.url ? (
          <Image src={customIcon.url} alt="" width={30} height={30} className="h-full w-full object-contain" />
        ) : icon}
      </div>
      <span className="font-poppins text-20 font-medium leading-24 text-white md:text-24">
        {value}
      </span>
    </div>
  );
}

export function Detalle({
  imagen,
  icono_direccion,
  icono_pisos,
  icono_area,
  icono_dormitorios,
  icono_fecha,
  direccion,
  pisos,
  area,
  dormitorios,
  fecha,
}: DetalleProps) {
  const items: ItemConfig[] = [
    { value: direccion, customIcon: icono_direccion, icon: <LocationIcon className="h-full w-full" /> },
    { value: pisos, customIcon: icono_pisos, icon: <BuildingIcon className="h-full w-full" /> },
    { value: area, customIcon: icono_area, icon: <AreaIcon className="h-full w-full" /> },
    { value: dormitorios, customIcon: icono_dormitorios, icon: <BedIcon className="h-full w-full" /> },
    { value: fecha, customIcon: icono_fecha, icon: <CalendarIcon className="h-full w-full" /> },
  ].filter((i) => i.value);

  if (!imagen?.url && items.length === 0) return null;

  return (
    <section
      data-section="detalle"
      className="w-full bg-slate"
    >
      <div className="flex w-full flex-col md:h-800 md:flex-row">
        {imagen?.url && (
          <div className="relative order-2 h-397 w-full md:order-1 md:h-full md:w-1/2">
            <Image
              src={imagen.url}
              alt={imagen.alt || "Detalle del proyecto"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className="order-1 flex w-full flex-col justify-center px-27 py-60 md:order-2 md:w-1/2 md:px-80 md:py-0">
          {items.length > 0 && (
            <div className="flex flex-col gap-30">
              {items.map((item, index) => (
                <DetailItem key={index} icon={item.icon} customIcon={item.customIcon} value={item.value} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
