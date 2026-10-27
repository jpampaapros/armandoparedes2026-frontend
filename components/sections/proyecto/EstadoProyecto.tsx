export function EstadoProyecto({ texto, color_fondo }: { texto?: string, color_fondo?: string }) {
  if (!texto) return null;

  return (
    <div className="flex w-full items-center justify-center px-24 py-12 text-center" style={{ backgroundColor: color_fondo || '#c4786a' }}>
      <span className="font-poppins text-14 font-medium leading-20 text-white md:text-20 md:leading-24">
        {texto}
      </span>
    </div>
  );
}
