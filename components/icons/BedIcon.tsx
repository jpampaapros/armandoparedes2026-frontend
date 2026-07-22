type BedIconProps = {
  className?: string;
};

export function BedIcon({ className }: BedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 20v-9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9" />
      <path d="M4 20v-7h16v7" />
      <path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
    </svg>
  );
}
