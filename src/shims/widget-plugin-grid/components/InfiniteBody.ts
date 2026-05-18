import { useCallback, useRef } from "react";

export interface InfiniteBodyProps {
    hasMoreItems: boolean;
    isInfinite: boolean;
    setPage?: () => void;
}

type TrackScrollingFn = (e: any) => void;

export function useInfiniteControl(props: InfiniteBodyProps): [TrackScrollingFn] {
    const { setPage, hasMoreItems } = props;
    const loadingRef = useRef(false);

    const trackScrolling = useCallback(
        (event: any) => {
            const el = event?.target;
            if (!el || loadingRef.current || !hasMoreItems) {
                return;
            }
            const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
            if (nearBottom && setPage) {
                loadingRef.current = true;
                setPage();
                setTimeout(() => {
                    loadingRef.current = false;
                }, 100);
            }
        },
        [setPage, hasMoreItems]
    );

    return [trackScrolling];
}
