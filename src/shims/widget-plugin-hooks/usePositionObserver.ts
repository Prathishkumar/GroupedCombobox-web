import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Observes the position (bounding rect) of an element while active.
 * Returns the current DOMRect or undefined when not observing.
 */
export function usePositionObserver(element: HTMLElement | null, active: boolean): DOMRect | undefined {
    const [rect, setRect] = useState<DOMRect | undefined>(undefined);
    const rafRef = useRef<number>(0);

    const updateRect = useCallback(() => {
        if (element) {
            setRect(element.getBoundingClientRect());
        }
    }, [element]);

    useEffect(() => {
        if (!element || !active) {
            setRect(undefined);
            return;
        }

        updateRect();

        const onScroll = (): void => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateRect);
        };

        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onScroll);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onScroll);
        };
    }, [element, active, updateRect]);

    return rect;
}
