"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { X, Minus, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { resolveFileUrl } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdBubbleData {
  id: string;
  title: string;
  description: string;
  contentType: string;
  mediaUrl: string;
  textContent: string;
  ctaLabel: string;
  ctaUrl: string;
  ctaTarget: string;
  displayType: string;
  displayMode: string;
  position: string;
  customOffsetX: number;
  customOffsetY: number;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
  bgColor: string;
  bgOpacity: number;
  borderRadius: number;
  shadowSize: string;
  borderColor: string;
  borderWidth: number;
  animIn: string;
  animOut: string;
  animDuration: number;
  showDelay: number;
  autoHide: number;
  showOnScroll: number;
  exitIntent: boolean;
  closeable: boolean;
  minimizable: boolean;
  draggable: boolean;
  targetDevice: string;
  targetPages: string;
  targetExclude: string;
  zIndex: number;
  order: number;
  priority: number;
  active: boolean;
  impressions: number;
  clicks: number;
}

// ─── Position Mapping ────────────────────────────────────────────────────────

const positionClasses: Record<string, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "center-left": "top-1/2 left-4 -translate-y-1/2",
  "center-right": "top-1/2 right-4 -translate-y-1/2",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const positionDragBounds: Record<string, { minX: number; minY: number; maxX: number; maxY: number }> = {
  "top-left": { minX: 0, minY: 0, maxX: 70, maxY: 50 },
  "top-right": { minX: -70, minY: 0, maxX: 0, maxY: 50 },
  "bottom-left": { minX: 0, minY: -50, maxX: 70, maxY: 0 },
  "bottom-right": { minX: -70, minY: -50, maxX: 0, maxY: 0 },
  "center-left": { minX: 0, minY: -40, maxX: 40, maxY: 40 },
  "center-right": { minX: -40, minY: -40, maxX: 0, maxY: 40 },
  center: { minX: -40, minY: -40, maxX: 40, maxY: 40 },
};

// ─── Animation Classes ───────────────────────────────────────────────────────

const animInClasses: Record<string, string> = {
  fade: "animate-[fadeIn_0.5s_ease-out]",
  slide: "animate-[slideIn_0.5s_ease-out]",
  bounce: "animate-[bounceIn_0.6s_ease-out]",
  zoom: "animate-[zoomIn_0.4s_ease-out]",
  none: "",
};

const animOutClasses: Record<string, string> = {
  fade: "animate-[fadeOut_0.3s_ease-in]",
  slide: "animate-[slideOut_0.3s_ease-in]",
  zoom: "animate-[zoomOut_0.3s_ease-in]",
  none: "",
};

// ─── Shadow Classes ──────────────────────────────────────────────────────────

const shadowClasses: Record<string, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-lg",
  lg: "shadow-xl",
  xl: "shadow-2xl",
};

// ─── Display Mode Styles ─────────────────────────────────────────────────────

function getDisplayModeStyles(mode: string, bgColor: string, bgOpacity: number, isDark: boolean): React.CSSProperties {
  const base: React.CSSProperties = {};
  const rgb = hexToRgb(bgColor);

  switch (mode) {
    case "glassmorphism":
      base.background = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(bgOpacity, 0.7)})`
        : `rgba(255, 255, 255, 0.15)`;
      base.backdropFilter = "blur(16px) saturate(180%)";
      base.WebkitBackdropFilter = "blur(16px) saturate(180%)";
      base.border = "1px solid rgba(255, 255, 255, 0.25)";
      break;
    case "neumorphism":
      base.background = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity})`
        : "#e0e5ec";
      base.boxShadow = isDark
        ? "8px 8px 16px rgba(0,0,0,0.4), -8px -8px 16px rgba(50,50,50,0.1)"
        : "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff";
      break;
    case "minimal-clean":
      base.background = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity})`
        : "#ffffff";
      base.border = "1px solid rgba(0,0,0,0.06)";
      break;
    case "rounded-bubble":
    default:
      base.background = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity})`
        : "#ffffff";
      break;
  }

  return base;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

// ─── Single Ad Bubble Component ──────────────────────────────────────────────

function SingleAdBubble({ bubble, currentPage, isDark }: {
  bubble: AdBubbleData;
  currentPage?: string;
  isDark: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const impressionTrackedRef = useRef(false);
  const [muted, setMuted] = useState(true);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(() => {
    // Initialize from localStorage
    if (!bubble.draggable) return null;
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`ad-pos-${bubble.id}`);
        if (saved) {
          const pos = JSON.parse(saved);
          return { x: pos.x, y: pos.y };
        }
      }
    } catch { /* ignore */ }
    return null;
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check device targeting
  const deviceOk = useMemo(() => {
    if (bubble.targetDevice === "all") return true;
    const mobile = isMobileDevice();
    return (bubble.targetDevice === "mobile" && mobile) || (bubble.targetDevice === "desktop" && !mobile);
  }, [bubble.targetDevice]);

  // Check page targeting
  const pageOk = useMemo(() => {
    try {
      const targetPages: string[] = JSON.parse(bubble.targetPages || "[]");
      const targetExclude: string[] = JSON.parse(bubble.targetExclude || "[]");

      // If no target pages specified, show on all
      if (targetPages.length === 0) {
        // But check exclusions
        if (currentPage && targetExclude.includes(currentPage)) return false;
        return true;
      }

      if (!currentPage) return true;
      if (targetExclude.includes(currentPage)) return false;
      return targetPages.includes(currentPage) || targetPages.includes("*");
    } catch {
      return true;
    }
  }, [bubble.targetPages, bubble.targetExclude, currentPage]);

  // Show logic: delay, scroll, exit intent
  useEffect(() => {
    if (!deviceOk || !pageOk) return;

    let showTimer: ReturnType<typeof setTimeout>;

    if (bubble.showOnScroll > 0) {
      const handleScroll = () => {
        if (window.scrollY >= bubble.showOnScroll && !visible) {
          // Apply delay after scroll threshold
          showTimer = setTimeout(() => setVisible(true), bubble.showDelay);
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(showTimer);
      };
    }

    if (bubble.exitIntent) {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !visible) {
          showTimer = setTimeout(() => setVisible(true), bubble.showDelay);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        document.removeEventListener("mouseleave", handleMouseLeave);
        clearTimeout(showTimer);
      };
    }

    // Default: show after delay
    showTimer = setTimeout(() => setVisible(true), bubble.showDelay);
    return () => clearTimeout(showTimer);
  }, [bubble.showDelay, bubble.showOnScroll, bubble.exitIntent, deviceOk, pageOk, visible]);

  // Close handler with animation
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 300);
  }, []);

  // Auto hide
  useEffect(() => {
    if (visible && bubble.autoHide > 0) {
      autoHideTimerRef.current = setTimeout(() => handleClose(), bubble.autoHide);
      return () => {
        if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
      };
    }
  }, [visible, bubble.autoHide, handleClose]);

  // Track impression
  useEffect(() => {
    if (visible && !impressionTrackedRef.current) {
      impressionTrackedRef.current = true;
      fetch("/api/ad-bubbles/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bubble.id, type: "impression" }),
      }).catch(() => {});
    }
  }, [visible, bubble.id]);

  // Track click
  const handleClick = useCallback(() => {
    fetch("/api/ad-bubbles/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bubble.id, type: "click" }),
    }).catch(() => {});
  }, [bubble.id]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!bubble.draggable) return;
    e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      ox: dragOffset?.x || 0,
      oy: dragOffset?.y || 0,
    };
    setIsDragging(true);
  }, [bubble.draggable, dragOffset]);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const dx = ((clientX - dragStartRef.current.x) / window.innerWidth) * 100;
    const dy = ((clientY - dragStartRef.current.y) / window.innerHeight) * 100;

    const bounds = positionDragBounds[bubble.position] || { minX: -50, minY: -50, maxX: 50, maxY: 50 };
    const newX = Math.max(bounds.minX, Math.min(bounds.maxX, dragStartRef.current.ox + dx));
    const newY = Math.max(bounds.minY, Math.min(bounds.maxY, dragStartRef.current.oy + dy));

    setDragOffset({ x: newX, y: newY });
  }, [isDragging, bubble.position]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartRef.current = null;

    // Save position to localStorage
    if (dragOffset && bubble.draggable) {
      try {
        localStorage.setItem(`ad-pos-${bubble.id}`, JSON.stringify(dragOffset));
      } catch { /* ignore */ }
    }
  }, [isDragging, dragOffset, bubble.id, bubble.draggable]);

  // Don't render if not targeted
  if (!deviceOk || !pageOk) return null;

  // Don't render if not visible
  if (!visible && !closing) return null;

  const isMobile = isMobileDevice();
  const w = isMobile ? bubble.mobileWidth : bubble.width;
  const h = isMobile ? bubble.mobileHeight : bubble.height;
  const posClass = positionClasses[bubble.position] || "bottom-4 right-4";
  const animClass = closing
    ? (animOutClasses[bubble.animOut] || "")
    : (animInClasses[bubble.animIn] || "");
  const shadow = shadowClasses[bubble.shadowSize] || "shadow-lg";
  const displayStyles = getDisplayModeStyles(bubble.displayMode, bubble.bgColor, bubble.bgOpacity, isDark);

  // Sticky banner full width
  const isStickyBanner = bubble.displayType === "sticky-banner";
  const isPopupMini = bubble.displayType === "popup-mini";
  const isFloatingCard = bubble.displayType === "floating-card";

  const containerStyle: React.CSSProperties = {
    ...displayStyles,
    borderRadius: isStickyBanner ? `${bubble.borderRadius / 2}px` : `${bubble.borderRadius}px`,
    border: bubble.borderWidth > 0 ? `${bubble.borderWidth}px solid ${bubble.borderColor}` : undefined,
    width: isStickyBanner ? "100%" : `${w}px`,
    maxWidth: isStickyBanner ? "100%" : `${w}px`,
    height: minimized && bubble.minimizable ? "auto" : (isStickyBanner ? "auto" : `${h}px`),
    zIndex: bubble.zIndex,
    cursor: isDragging ? "grabbing" : (bubble.draggable ? "grab" : "default"),
    ...dragOffset ? { transform: `translate(${dragOffset.x}vw, ${dragOffset.y}vh)` } : {},
    position: isStickyBanner ? "fixed" : "fixed",
    transition: isDragging ? "none" : "transform 0.3s ease",
  };

  // Position override for sticky banner
  const stickyPosition = isStickyBanner
    ? "bottom-0 left-0 right-0"
    : posClass;

  return (
    <div
      ref={containerRef}
      className={`fixed ${stickyPosition} ${animClass} ${shadow} ${isDragging ? "select-none" : ""} group`}
      style={containerStyle}
      onMouseMove={isDragging ? handleDragMove : undefined}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={isDragging ? handleDragMove : undefined}
      onTouchEnd={handleDragEnd}
    >
      {/* Drag Handle */}
      {bubble.draggable && (
        <div
          className="absolute top-0 left-0 right-0 h-6 cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
      )}

      {/* Control Buttons */}
      <div className="absolute top-1 right-1 flex items-center gap-0.5 z-10">
        {bubble.closeable && (
          <button
            onClick={handleClose}
            className="w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Tutup iklan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {bubble.minimizable && !minimized && (
          <button
            onClick={() => setMinimized(true)}
            className="w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Minimalkan iklan"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Minimized State */}
      {minimized ? (
        <div
          className="flex items-center gap-2 p-2 cursor-pointer"
          onClick={() => setMinimized(false)}
        >
          <div className="w-8 h-8 rounded-full bg-bkad-green/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-bkad-green">{bubble.title.charAt(0)}</span>
          </div>
          <span className="text-xs font-medium truncate">{bubble.title}</span>
        </div>
      ) : (
        <div className={`flex flex-col h-full overflow-hidden ${isStickyBanner ? "p-3 md:p-4" : "p-3"}`}>
          {/* Content rendering based on type */}
          {bubble.contentType === "image" && resolveFileUrl(bubble.mediaUrl) && (
            <div className="flex-1 relative overflow-hidden rounded-md">
              <img
                src={resolveFileUrl(bubble.mediaUrl)!}
                alt={bubble.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {bubble.contentType === "gif" && resolveFileUrl(bubble.mediaUrl) && (
            <div className="flex-1 relative overflow-hidden rounded-md">
              <img
                src={resolveFileUrl(bubble.mediaUrl)!}
                alt={bubble.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {bubble.contentType === "video" && resolveFileUrl(bubble.mediaUrl) && (
            <div className="flex-1 relative overflow-hidden rounded-md">
              <video
                src={resolveFileUrl(bubble.mediaUrl)!}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={muted}
                playsInline
                loading="lazy"
              />
              <button
                onClick={() => setMuted(!muted)}
                className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {bubble.contentType === "text" && bubble.textContent && (
            <div
              className="flex-1 flex flex-col justify-center items-center text-center px-2 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: bubble.textContent }}
            />
          )}

          {/* Title + Description overlay for media types */}
          {(bubble.contentType === "image" || bubble.contentType === "gif" || bubble.contentType === "video") && bubble.description && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-md">
              <p className="text-white text-[10px] md:text-xs line-clamp-2">{bubble.description}</p>
            </div>
          )}

          {/* CTA Button */}
          {bubble.ctaLabel && bubble.ctaUrl && (
            <div className={`mt-2 flex-shrink-0 ${isStickyBanner ? "flex-shrink-0" : ""}`}>
              <a
                href={bubble.ctaUrl}
                target={bubble.ctaTarget === "_blank" ? "_blank" : undefined}
                rel={bubble.ctaTarget === "_blank" ? "noopener noreferrer" : undefined}
                onClick={handleClick}
                className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "#0D6B3F" }}
              >
                {bubble.ctaLabel}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Text content for floating-card */}
          {isFloatingCard && bubble.textContent && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-3" dangerouslySetInnerHTML={{ __html: bubble.textContent }} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Renderer Component ─────────────────────────────────────────────────

interface AdBubbleRendererProps {
  currentPage?: string;
}

export default function AdBubbleRenderer({ currentPage }: AdBubbleRendererProps) {
  const [bubbles, setBubbles] = useState<AdBubbleData[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Fetch active bubbles
  useEffect(() => {
    let cancelled = false;
    const fetchBubbles = async () => {
      try {
        const res = await fetch("/api/ad-bubbles");
        const data = await res.json();
        if (data.success && !cancelled) {
          setBubbles(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch ad bubbles:", err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    fetchBubbles();
    return () => { cancelled = true; };
  }, []);

  if (!loaded || bubbles.length === 0) return null;

  return (
    <>
      {/* Inject keyframe animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes zoomOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.5); }
        }
      `}</style>
      {bubbles.map((bubble) => (
        <SingleAdBubble
          key={bubble.id}
          bubble={bubble}
          currentPage={currentPage}
          isDark={isDark}
        />
      ))}
    </>
  );
}
