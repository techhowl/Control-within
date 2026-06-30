import { Fragment } from "react";

/**
 * Seamless scrolling marquee.
 *
 * The track holds the items duplicated once and animates translateX(0 → -50%)
 * via the `animate-marquee` utility (defined in globals.css @theme). Because the
 * second copy is identical to the first, the wrap point is invisible.
 *
 * @param {string[]} items   short messages to scroll
 * @param {"top"|"mid"} variant  visual treatment
 */
export default function Ticker({ items, variant = "top" }) {
  const loop = [...items, ...items];

  const isMid = variant === "mid";
  const shell = isMid
    ? "bg-teal-deep text-white"
    : "bg-accent text-white";
  const pad = isMid ? "py-3.5" : "py-2";
  const itemText = isMid
    ? "text-sm font-medium tracking-wide"
    : "text-xs font-medium uppercase tracking-[0.18em]";
  const sepColor = isMid ? "text-teal" : "text-accent-light-2";

  return (
    <div
      className={`relative overflow-hidden ${shell}`}
      role="marquee"
      aria-label="Key messages"
    >
      <div
        className={`flex w-max ${pad} animate-marquee whitespace-nowrap will-change-transform hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:translate-x-0`}
      >
        {loop.map((text, i) => (
          <Fragment key={i}>
            <span className={`px-5 ${itemText}`}>{text}</span>
            <span className={`select-none text-[0.6em] ${sepColor}`} aria-hidden="true">
              ◆
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
