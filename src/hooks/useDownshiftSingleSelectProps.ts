import {
    useCombobox,
    UseComboboxProps,
    UseComboboxReturnValue,
    UseComboboxState,
    UseComboboxStateChange,
    UseComboboxStateChangeOptions
} from "downshift";

import { useCallback, useMemo } from "react";
import { A11yStatusMessage, SingleSelector } from "../helpers/types";

interface Options {
    inputId?: string;
    labelId?: string;
}

export function useDownshiftSingleSelectProps(
    selector: SingleSelector,
    options: Options = {},
    a11yStatusMessage: A11yStatusMessage
): UseComboboxReturnValue<string> {
    const { inputId, labelId } = options;

    const downshiftProps: UseComboboxProps<string> = useMemo(() => {
        return {
            items: [],
            itemToString: (v: string | null) => selector.caption.get(v),
            onSelectedItemChange({ selectedItem }: UseComboboxStateChange<string>) {
                selector.setValue(selectedItem ?? null);
            },
            onInputValueChange({ inputValue, type }: UseComboboxStateChange<string>) {
                if (selector.onFilterInputChange && type === useCombobox.stateChangeTypes.InputChange) {
                    selector.options.setSearchTerm(inputValue ?? "");
                    selector.onFilterInputChange(inputValue ?? "");
                } else {
                    selector.options.setSearchTerm("");
                }
            },
            getA11yStatusMessage(options) {
                const selectedItem = selector.caption.get(selector.currentId);
                let message = selectedItem
                    ? selector.currentId
                        ? `${a11yStatusMessage.a11ySelectedValue} ${selectedItem}. `
                        : "No options selected."
                    : "";
                if (!options.isOpen) {
                    return message;
                }
                if (!options.resultCount) {
                    return a11yStatusMessage.a11yNoOption;
                }
                if (options.resultCount > 0) {
                    message += `${a11yStatusMessage.a11yOptionsAvailable} ${options.resultCount}. ${a11yStatusMessage.a11yInstructions}`;
                } else {
                    return a11yStatusMessage.a11yNoOption;
                }

                return message;
            },
            defaultHighlightedIndex: 0,
            selectedItem: null,
            initialInputValue: selector.caption.get(selector.currentId),
            stateReducer(state: UseComboboxState<string>, actionAndChanges: UseComboboxStateChangeOptions<string>) {
                const { changes, type } = actionAndChanges;
                switch (type) {
                    // clear input when user toggles (closes) dropdown.
                    case useCombobox.stateChangeTypes.ToggleButtonClick:
                        return {
                            ...changes,
                            inputValue: ""
                        };

                    // when item is selected, downshift fills in input automatically, prevent that.
                    case useCombobox.stateChangeTypes.FunctionSelectItem:
                    case useCombobox.stateChangeTypes.ItemClick:
                    case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
                    case useCombobox.stateChangeTypes.InputKeyDownEnter:
                        return {
                            ...changes,
                            inputValue: ""
                        };

                    case useCombobox.stateChangeTypes.InputFocus:
                        return {
                            ...changes,
                            isOpen: state.isOpen,
                            inputValue: "",
                            highlightedIndex: changes.selectedItem ? -1 : this.defaultHighlightedIndex
                        };

                    // clear input when user want to close the popup with escape (or it was closed programmatically)
                    case useCombobox.stateChangeTypes.InputKeyDownEscape:
                    case useCombobox.stateChangeTypes.FunctionCloseMenu:
                        return {
                            ...changes,
                            selectedItem: state.selectedItem,
                            isOpen: false,
                            inputValue: ""
                        };
                    case useCombobox.stateChangeTypes.InputBlur:
                        return {
                            ...changes,
                            selectedItem: state.selectedItem,
                            inputValue: "",
                            isOpen: false
                        };
                    default:
                        return { ...changes };
                }
            },
            inputId,
            labelId
        };
    }, [
        selector,
        inputId,
        labelId,
        a11yStatusMessage.a11ySelectedValue,
        a11yStatusMessage.a11yOptionsAvailable,
        a11yStatusMessage.a11yNoOption,
        a11yStatusMessage.a11yInstructions
    ]);

    // Sort items in grouped order (matching SingleSelectionMenu render order)
    const rawItems = selector.options.getAll() ?? [];
    const getGroupFn = selector.caption.getGroup
        ? (id: string) => selector.caption.getGroup!(id)
        : (_id: string) => null as string | null;
    const hasGroups = rawItems.some(id => {
        const title = getGroupFn(id);
        return title !== null && title.trim() !== "";
    });
    let sortedItems: string[];
    if (hasGroups) {
        const groupMap = new Map<string, string[]>();
        const ungrouped: string[] = [];
        for (const id of rawItems) {
            const title = getGroupFn(id);
            if (!title || title.trim() === "") {
                ungrouped.push(id);
            } else {
                if (!groupMap.has(title)) {
                    groupMap.set(title, []);
                }
                groupMap.get(title)!.push(id);
            }
        }
        const sortedTitles = Array.from(groupMap.keys()).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
        );
        sortedItems = [];
        for (const title of sortedTitles) {
            sortedItems.push(...groupMap.get(title)!);
        }
        sortedItems.push(...ungrouped);
    } else {
        sortedItems = rawItems;
    }

    const returnVal = useCombobox({
        ...downshiftProps,
        items: sortedItems,
        selectedItem: selector.currentId
    });

    const { closeMenu } = returnVal;

    selector.onLeaveEvent = useCallback(closeMenu, [closeMenu]);

    return returnVal;
}
