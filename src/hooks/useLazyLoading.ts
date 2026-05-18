import { useCallback } from "react";
import { InfiniteBodyProps, useInfiniteControl } from "@mendix/widget-plugin-grid/components/InfiniteBody";
import { ListValue } from "mendix";

type UseLazyLoadingProps = Pick<InfiniteBodyProps, "hasMoreItems" | "isInfinite"> & {
    isOpen: boolean;
    loadMore?: () => void;
    datasourceFilter?: ListValue["filter"];
    readOnly?: boolean;
};

type UseLazyLoadingReturn = {
    onScroll: (e: any) => void;
};

export function useLazyLoading(props: UseLazyLoadingProps): UseLazyLoadingReturn {
    const { hasMoreItems, isInfinite, loadMore } = props;

    const setPageCallback = useCallback(() => {
        if (loadMore) {
            loadMore();
        }
    }, [loadMore]);

    const [trackScrolling] = useInfiniteControl({ hasMoreItems, isInfinite, setPage: setPageCallback });

    return { onScroll: trackScrolling };
}
