import { Fragment, type CSSProperties, type ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/** Splits text into letters for the cursor's magnetic effect. */
export default function MagneticText({ text, as: Tag = "span", className, style }: Props) {
  const words = text.split(" ");
  return (
    <Tag data-split="" className={className} style={style} aria-label={text}>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          {wi > 0 && " "}
          <span aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(w).map((c, i) => (
              <span key={i} data-l="">
                {c}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
