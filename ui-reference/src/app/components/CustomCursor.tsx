import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onHoverStart = () => {
      ringRef.current?.classList.add("hovering");
    };
    const onHoverEnd = () => {
      ringRef.current?.classList.remove("hovering");
    };

    const animate = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.left = mousePos.current.x - 3 + "px";
        dotRef.current.style.top = mousePos.current.y - 3 + "px";
      }
      if (ringRef.current) {
        const ringSize = ringRef.current.classList.contains("hovering") ? 28 : 18;
        ringRef.current.style.left = ringPos.current.x - ringSize + "px";
        ringRef.current.style.top = ringPos.current.y - ringSize + "px";
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);

    const interactables = document.querySelectorAll("a, button, [data-cursor]");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", onHoverStart);
      el.addEventListener("mouseleave", onHoverEnd);
    });

    rafRef.current = requestAnimationFrame(animate);

    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll("a, button, [data-cursor]");
      els.forEach((el) => {
        el.addEventListener("mouseenter", onHoverStart);
        el.addEventListener("mouseleave", onHoverEnd);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
