import { debounce } from "@mendix/widget-plugin-platform/utils/debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import { GroupedComboboxContainerProps } from "../../typings/GroupedComboboxProps";
import { getSelector } from "../helpers/getSelector";
import { Selector } from "../helpers/types";

function onInputValueChange(
    onChangeFilterInputEvent: GroupedComboboxContainerProps["onChangeFilterInputEvent"],
    filterValue?: string
): void {
    if (!onChangeFilterInputEvent) {
        return;
    }
    if (onChangeFilterInputEvent.canExecute && !onChangeFilterInputEvent.isExecuting) {
        onChangeFilterInputEvent.execute({
            filterInput: filterValue
        });
    }
}

export function useGetSelector(props: GroupedComboboxContainerProps): Selector {
    const selectorRef = useRef<Selector | undefined>(undefined);
    const [, setInput] = useState({});
    const [onFilterChangeDebounce, cancelDebounce] = useMemo(
        () =>
            debounce((filterValue?: string) => {
                onInputValueChange(props.onChangeFilterInputEvent, filterValue);
            }, props.filterInputDebounceInterval ?? 200),
        [props.onChangeFilterInputEvent, props.filterInputDebounceInterval]
    );

    useEffect(() => {
        return () => cancelDebounce();
    }, [cancelDebounce]);

    if (!selectorRef.current) {
        selectorRef.current = getSelector(props);
        selectorRef.current.options.onAfterSearchTermChange(() => setInput({}));
        selectorRef.current.onFilterInputChange = onFilterChangeDebounce;
    } else {
        if (!selectorRef.current.onFilterInputChange) {
            selectorRef.current.onFilterInputChange = onFilterChangeDebounce;
        }
    }
    selectorRef.current.updateProps(props);

    return selectorRef.current;
}
