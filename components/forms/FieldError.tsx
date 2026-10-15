import type { FieldError as RHFFieldError } from "react-hook-form";

type Props = {
  id: string;
  error?: RHFFieldError;
  /** Color del texto; los formularios sobre fondo oscuro usan blanco. */
  className?: string;
};

export function FieldError({ id, error, className = "text-red-700" }: Props) {
  if (!error?.message) return null;
  return <p id={id} role="alert" className={`m-0 font-poppins text-12 leading-tight ${className}`}>{error.message}</p>;
}
