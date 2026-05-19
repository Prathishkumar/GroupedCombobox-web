import classNames from "classnames";
import { UseComboboxPropGetters } from "downshift/typings";
import { PropsWithChildren, ReactElement } from "react";

interface ComboboxOptionWrapperProps extends PropsWithChildren, Partial<UseComboboxPropGetters<string>> {
    isSelected?: boolean;
    isHighlighted?: boolean;
    item: string;
    index: number;
}

export function ComboboxOptionWrapper(props: ComboboxOptionWrapperProps): ReactElement {
    const { children, isSelected, isHighlighted, item, getItemProps, index } = props;
    return (
        <li
            className={classNames("widget-grouped-combobox-item", {
                "widget-grouped-combobox-item-selected": isSelected,
                "widget-grouped-combobox-item-highlighted": isHighlighted
            })}
            {...getItemProps?.({
                index,
                item
            })}
            aria-selected={isSelected}
        >
            {children}
        </li>
    );
}
