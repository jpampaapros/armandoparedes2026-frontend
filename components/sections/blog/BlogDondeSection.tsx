type BlogDondeSectionProps = {
  titulo?: string;
  direccion?: string;
};

export function BlogDondeSection({ titulo, direccion }: BlogDondeSectionProps) {
  if (!titulo && !direccion) return null;

  return (
    <div className="flex flex-col gap-6">
      {titulo && (
        <h2 className="m-0 font-poppins text-16 font-semibold leading-[1.5] text-near-black md:text-18">
          {titulo}
        </h2>
      )}
      {direccion && (
        <p className="m-0 font-poppins text-16 font-normal leading-[1.5] text-near-black md:text-18 md:leading-[1.33]">
          {direccion}
        </p>
      )}
    </div>
  );
}
