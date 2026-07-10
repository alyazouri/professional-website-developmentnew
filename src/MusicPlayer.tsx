import { useState, useEffect, useRef } from "react";
import { useLang } from "./LanguageContext";

export function MusicPlayer() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem("music_muted") === "true";
    } catch {
      return true;
    }
  });
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef<any>(null);

  // YouTube video IDs for background music
  const playlist = [
    "dQw4w9WgXcQ", // Example - replace with actual gaming music
    "9bZkp7q19s4",
    "HZevd8lJx7M",
  ];
  const [currentTrack, setCurrentTrack] = useState(0);

  // Initialize YouTube player
  useEffect(() => {
    if (!hasInteracted) return;

    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      // @ts-ignore
      const player = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: playlist[currentTrack],
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: playlist.join(","),
        },
        events: {
          onReady: (event: any) => {
            playerRef.current = event.target;
            if (isPlaying) {
              playerRef.current.playVideo();
            }
            if (isMuted) {
              playerRef.current.mute();
            }
          },
          onStateChange: (event: any) => {
            // @ts-ignore
            if (event.data === window.YT.PlayerState.ENDED) {
              const nextTrack = (currentTrack + 1) % playlist.length;
              setCurrentTrack(nextTrack);
              if (playerRef.current) {
                playerRef.current.loadVideoById(playlist[nextTrack]);
                if (isPlaying) {
                  playerRef.current.playVideo();
                }
              }
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [hasInteracted, currentTrack, isPlaying, isMuted]);

  // Handle play/pause
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  // Handle mute
  useEffect(() => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
    try {
      localStorage.setItem("music_muted", String(isMuted));
    } catch { /* ignore */ }
  }, [isMuted]);

  const togglePlay = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % playlist.length;
    setCurrentTrack(next);
    if (playerRef.current) {
      playerRef.current.loadVideoById(playlist[next]);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
    setCurrentTrack(prev);
    if (playerRef.current) {
      playerRef.current.loadVideoById(playlist[prev]);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  };

  // Handle first user interaction
  const handleFirstInteraction = () => {
    setHasInteracted(true);
    setIsPlaying(true);
    setIsMuted(false);
  };

  if (!hasInteracted) {
    return (
      <div className="card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">🎵</span>
          <h3 className="font-display text-lg font-bold text-white">
            {isAr ? "موسيقى خلفية" : "Background Music"}
          </h3>
        </div>
        <p className="mb-4 text-sm text-white/60">
          {isAr ? "انقر لاي مكان لبدء الموسيقى" : "Click anywhere to start music"}
        </p>
        <button onClick={handleFirstInteraction} className="btn-primary w-full rounded-xl py-3">
          {isAr ? "تمكين الموسيقى" : "Enable Music"}
        </button>
      </div>
    );
  }

  return (
    <div className="card neon-box rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🎵</span>
        <h3 className="font-display text-lg font-bold text-white">
          {isAr ? "موسيقى خلفية" : "Background Music"}
        </h3>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={prevTrack} className="rounded-full border border-white/20 p-2 text-white/60 hover:bg-white/5">
          ⏮️
        </button>
        <button onClick={togglePlay} className="rounded-full border border-orange-500/30 bg-orange-500/10 p-3 text-orange-300 hover:bg-orange-500/20">
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <button onClick={nextTrack} className="rounded-full border border-white/20 p-2 text-white/60 hover:bg-white/5">
          ⏭️
        </button>
        <button onClick={toggleMute} className="rounded-full border border-white/20 p-2 text-white/60 hover:bg-white/5">
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">
            {isAr ? "الآن" : "Now Playing"}:
          </span>
          <span className="text-sm font-semibold text-white">
            {isAr ? "موسيقى ألعاب" : "Gaming Music"} {currentTrack + 1}/{playlist.length}
          </span>
        </div>
      </div>

      {/* Hidden YouTube player */}
      <div id="youtube-player" />

      <div className="mt-4 text-xs text-white/40">
        {isAr ? "الموسيقى من YouTube" : "Music from YouTube"}
      </div>
    </div>
  );
}