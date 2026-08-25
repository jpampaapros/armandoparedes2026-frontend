type BlogTextSectionProps = {
  contenido?: string;
};

export function BlogTextSection({ contenido }: BlogTextSectionProps) {
  if (!contenido) return null;

  return (
    <div
      className="min-w-0 max-w-full font-poppins text-16 font-normal leading-[1.6] text-near-black md:text-18 md:leading-[1.7] [&_p]:m-0 [&_p+p]:mt-16 [&_ul]:mt-16 [&_ul]:list-disc [&_ul]:pl-24 [&_ol]:mt-16 [&_ol]:list-decimal [&_ol]:pl-24 [&_li]:mb-8 [&_strong]:font-semibold [&_em]:italic [&_a]:text-peach [&_a]:underline [&_img]:mx-auto [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_figure]:mx-auto [&_figure]:max-w-full [&_figure]:overflow-hidden"
      dangerouslySetInnerHTML={{ __html: contenido }}
    />
  );
}
