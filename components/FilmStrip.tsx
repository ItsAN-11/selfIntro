export default function FilmStrip({ count = 40 }: { count?: number }) {
  return (
    <div aria-hidden className="overflow-hidden border-y border-line bg-deep py-2.5">
      <div className="flex gap-[18px] pl-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="h-3.5 w-[22px] flex-none rounded-[3px] bg-surface2" />
        ))}
      </div>
    </div>
  );
}
