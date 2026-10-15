"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";

/**
 * Each reel ships in three encodes in /public/home/influencer/ and the browser
 * plays the first one it supports, downloading only that file:
 *   <id>.av1.mp4   1080p AV1   (Chrome, Edge, Firefox, Android)
 *   <id>.hevc.mp4  1080p HEVC  (Safari, iPhone)
 *   <id>.h264.mp4  720p H.264  (fallback for anything older)
 * The 1080p encodes are visually lossless against the originals (VMAF ≥ 95).
 */
const reel = (id, { av1, hevc }) => ({
  poster: `/home/influencer/${id}.webp`,
  sources: [
    { src: `/home/influencer/${id}.av1.mp4`, type: `video/mp4; codecs="${av1}, mp4a.40.2"` },
    { src: `/home/influencer/${id}.hevc.mp4`, type: `video/mp4; codecs="${hevc}, mp4a.40.2"` },
    { src: `/home/influencer/${id}.h264.mp4`, type: "video/mp4" },
  ],
});

// Set `sources: null` on an entry to fall back to opening the reel on Instagram.
const VIDEOS = [
  {
    id: "divya-vora",
    name: "Divya Vora",
    instagram: "https://www.instagram.com/reel/Db8KHhMsGHc/",
    ...reel("divya-vora", { av1: "av01.0.08M.08", hevc: "hvc1.1.6.L120.90" }),
  },
  {
    id: "mitali",
    name: "Mitali",
    instagram: "https://www.instagram.com/reel/DctIgnftMIG/",
    ...reel("mitali", { av1: "av01.0.09M.08", hevc: "hvc1.1.6.L123.90" }),
  },
];

const isMobile = () => window.matchMedia("(max-width: 767.98px)").matches;

const Play = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

/**
 * One 9:16 card with the creator's name underneath. `inactive` is true for the
 * card peeking in from the side of the mobile carousel: tapping it brings it to
 * the centre (`onActivate`) instead of playing or leaving the page.
 */
function VideoCard({ video, inactive, onActivate, onPlay, registerVideo }) {
  const [playing, setPlaying] = useState(false);
  // Encodes to skip. A browser can claim a codec and still fail to decode it;
  // <source> fallback doesn't cover that, so on a decode error we drop the
  // failing encode, remount the <video> with the rest, and carry on playing.
  const [skip, setSkip] = useState(0);
  const videoRef = useRef(null);
  const wantsPlay = useRef(false); // only resume after a fallback if they pressed play

  useEffect(() => {
    if (skip > 0 && wantsPlay.current) videoRef.current?.play().catch(() => {});
  }, [skip]);

  const guard = (e) => {
    if (inactive && isMobile()) {
      e.preventDefault();
      onActivate();
      return true;
    }
    return false;
  };

  return (
    <figure className="flex flex-col items-center">
      <div className="relative w-full">
        {/* Offset purple "shadow" card from the design. */}
        <img
          src="/home/influencer/card-shadow.png"
          alt=""
          draggable={false}
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full translate-x-[3.5%] rounded-[1.5rem]"
        />
        <div className="relative aspect-[430/764] overflow-hidden rounded-[1.5rem] bg-accent-light-1">
          {video.sources ? (
            <>
              <video
                key={skip}
                ref={(el) => {
                  videoRef.current = el;
                  registerVideo(el);
                }}
                poster={video.poster}
                controls={playing}
                playsInline
                preload="none"
                onPlay={() => {
                  setPlaying(true);
                  onPlay();
                }}
                onEnded={() => setPlaying(false)}
                onError={() => skip < video.sources.length - 1 && setSkip(skip + 1)}
                className="absolute inset-0 h-full w-full object-cover"
              >
                {video.sources.slice(skip).map((s) => (
                  <source key={s.src} src={s.src} type={s.type} />
                ))}
              </video>
              {!playing && (
                <button
                  type="button"
                  id={`btn_home_expert_video_${video.id}`}
                  onClick={(e) => {
                    if (guard(e)) return;
                    wantsPlay.current = true;
                    videoRef.current?.play().catch(() => {});
                  }}
                  aria-label={`Play ${video.name}'s video`}
                  className="btn-video group absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-accent shadow-hover transition-transform group-hover:scale-110">
                    <Play />
                  </span>
                </button>
              )}
            </>
          ) : (
            <a
              href={video.instagram}
              target="_blank"
              rel="noopener noreferrer"
              id={`btn_home_expert_reel_${video.id}`}
              onClick={guard}
              aria-label={`Watch ${video.name}'s reel on Instagram`}
              className="btn-video group absolute inset-0 flex flex-col items-center justify-center gap-3 text-white"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-accent shadow-hover transition-transform group-hover:scale-110">
                <Play />
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm">
                Watch on Instagram
              </span>
            </a>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-center font-clash text-base font-semibold text-dark md:text-lg lg:mt-[1.5svh] lg:text-[clamp(1rem,2.2svh,1.35rem)]">
        {video.name}
      </figcaption>
    </figure>
  );
}

export default function Influencers() {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const videoRefs = useRef([]);
  const [active, setActive] = useState(0);

  // Mobile: the active slide is whichever one is closest to the track's centre.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const centre = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    slideRefs.current.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - centre);
      const bestD = Math.abs(slideRefs.current[best].offsetLeft + slideRefs.current[best].offsetWidth / 2 - centre);
      if (d < bestD) best = i;
    });
    setActive(best);
  }, []);

  const goTo = (i) => {
    const track = trackRef.current;
    const s = slideRefs.current[i];
    if (!track || !s) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  };

  // Only one video plays at a time; on mobile, swiping away pauses the old one.
  const pauseAllExcept = (keep) =>
    videoRefs.current.forEach((v, i) => {
      if (v && i !== keep && !v.paused) v.pause();
    });

  useEffect(() => {
    if (!isMobile()) return;
    videoRefs.current.forEach((v, i) => {
      if (v && i !== active && !v.paused) v.pause();
    });
  }, [active]);

  return (
    <section
      id="experts"
      aria-labelledby="experts-title"
      // White, fading into lavender along a soft curve at the bottom (as in the
      // design) so it runs straight into the "Is This For You" gradient below.
      //   --m-w    mobile card width: 64vw, capped so the fold fits the screen (never under 12rem)
      //   --inf-w  desktop card width: fits the area under the navbar with the caption
      className="relative overflow-hidden bg-white pb-2 pt-6 [--m-w:min(64vw,18.75rem,max(12rem,calc((100svh-7.5rem-19rem)*0.5628)))] md:py-16 lg:h-[calc(100svh-8rem)] lg:min-h-110 lg:scroll-mt-32 lg:py-0 lg:[--inf-w:min(24vw,calc((87svh-13.25rem)*0.5628))]"
      style={{ backgroundImage: "radial-gradient(218% 100% at 50% 100%, #d7ceeb 26%, #ffffff 44%)" }}
    >
      <div className="relative z-10 mx-auto flex h-full flex-col px-[5%] lg:pb-[5svh] lg:pt-[4svh]">
        <Reveal>
          <h2 id="experts-title" className="text-balance text-center font-clash text-[min(6.2vw,1.875rem)] font-semibold text-dark md:text-4xl">
            Backed By Science, Trusted By Millions
          </h2>
        </Reveal>

        {/* Mobile: swipeable track (cards snap to the centre, the next one peeks in).
            md+: the same cards side by side. */}
        <Reveal delay={100} className="mt-4 md:mt-10 lg:mt-[4svh]">
          <div
            ref={trackRef}
            onScroll={onScroll}
            role="region"
            aria-roledescription="carousel"
            aria-label="Creator videos"
            tabIndex={0}
            className="relative mx-[-5vw] flex snap-x snap-mandatory gap-[6vw] overflow-x-auto px-[calc((100vw-var(--m-w))/2)] py-3 outline-none [scrollbar-width:none] md:mx-auto md:grid md:max-w-xl md:snap-none md:grid-cols-2 md:gap-10 md:overflow-visible md:px-0 md:py-0 lg:w-max lg:max-w-none lg:grid-cols-[repeat(2,var(--inf-w))] lg:gap-[min(9vw,11rem)] [&::-webkit-scrollbar]:hidden"
          >
            {VIDEOS.map((v, i) => (
              <div
                key={v.id}
                ref={(el) => (slideRefs.current[i] = el)}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${VIDEOS.length}: ${v.name}`}
                className={`w-(--m-w) shrink-0 snap-center transition-[scale,rotate,opacity] duration-500 ease-out md:w-auto md:scale-100 md:rotate-0 md:opacity-100 ${
                  i === active ? "" : `scale-[0.88] opacity-55 ${i < active ? "-rotate-3" : "rotate-3"}`
                }`}
              >
                <VideoCard
                  video={v}
                  inactive={i !== active}
                  onActivate={() => goTo(i)}
                  onPlay={() => pauseAllExcept(i)}
                  registerVideo={(el) => (videoRefs.current[i] = el)}
                />
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile pagination: pill dots, each a full 44px tap target. */}
        <div className="flex justify-center md:hidden">
          {VIDEOS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${v.name}'s video`}
              aria-current={i === active}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`h-2 rounded-full bg-accent transition-all duration-300 ${i === active ? "w-6" : "w-2 opacity-35"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
