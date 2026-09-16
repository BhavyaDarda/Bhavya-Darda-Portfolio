import { useEffect, useRef } from "react"

const FADE_OUT_LEAD = 0.55

export function FadingVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number | null>(null)
  const fadingOutRef = useRef(false)

  const fadeTo = (target: number, duration: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    const video = videoRef.current
    if (!video) return
    const start = performance.now()
    const startOpacity = parseFloat(video.style.opacity || "0")
    const step = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      video.style.opacity = String(startOpacity + (target - startOpacity) * t)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.style.opacity = "0"

    const onLoaded = () => {
      video.style.opacity = "0"
      video.play().catch(() => {})
      fadeTo(1, 0.5)
    }

    const onTimeUpdate = () => {
      if (
        !fadingOutRef.current &&
        video.duration - video.currentTime <= FADE_OUT_LEAD &&
        video.duration - video.currentTime > 0
      ) {
        fadingOutRef.current = true
        fadeTo(0, 0.5)
      }
    }

    const onEnded = () => {
      video.style.opacity = "0"
      setTimeout(() => {
        video.currentTime = 0
        video.play().catch(() => {})
        fadingOutRef.current = false
        fadeTo(1, 0.5)
      }, 100)
    }

    video.addEventListener("loadeddata", onLoaded)
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("ended", onEnded)

    // Pause when section is off-screen, resume when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(video)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      video.removeEventListener("loadeddata", onLoaded)
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("ended", onEnded)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      style={{ opacity: 0 }}
      className={className}
    />
  )
}
