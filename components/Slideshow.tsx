/** Cross-fading cover slideshow (pure CSS). */
export default function Slideshow({ images, kind, className, style }: { images: { src: string; alt: string }[]; kind: "tt" | "ta"; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`tt-show ${className ?? ""}`} style={style}>
      {images.map((im, i) => (
        <div key={im.src + i} className={`${kind}-slide`} style={{ animationDelay: `${i * 6}s` }}>
          <img className="bg" src={im.src} alt="" />
          <img className="fg" src={im.src} alt={im.alt} />
        </div>
      ))}
    </div>
  );
}
