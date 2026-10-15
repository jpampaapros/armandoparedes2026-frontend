export function EstadoProyecto({ texto }: { texto?: string }) {
  if (!texto) return null;

  return (
    <div className="flex w-full items-center justify-center bg-[#c4786a] px-24 py-12 text-center">
      <span className="font-poppins text-14 font-medium leading-20 text-white md:text-20 md:leading-24">
        {texto}
      </span>
    </div>
  );
}
