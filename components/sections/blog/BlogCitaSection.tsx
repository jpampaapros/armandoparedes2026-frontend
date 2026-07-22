type BlogCitaSectionProps = {
  contenido?: string;
};

export function BlogCitaSection({ contenido }: BlogCitaSectionProps) {
  if (!contenido) return null;

  return (
    <div
      className="font-poppins text-16 font-light italic leading-[1.6] text-near-black md:text-18 md:leading-[1.7] [&_p]:m-0 [&_p+p]:mt-16 [&_strong]:font-medium [&_em]:italic"
      dangerouslySetInnerHTML={{ __html: contenido }}
    />
  );
}
