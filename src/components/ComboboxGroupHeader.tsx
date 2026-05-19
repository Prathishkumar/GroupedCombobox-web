import classNames from "classnames";
import { ReactElement } from "react";

interface ComboboxGroupHeaderProps {
    title: string;
}

/**
 * A non-interactive, non-selectable list item rendered as a group heading
 * inside the combobox dropdown menu.
 *
 * Important: this element is NOT included in the downshift item index
 * sequence — it is purely visual and skipped during keyboard navigation.
 */
export function ComboboxGroupHeader({ title }: ComboboxGroupHeaderProps): ReactElement {
    return (
        <li
            className={classNames("widget-grouped-combobox-group-header")}
            aria-disabled="true"
            role="separator"
            aria-label={title}
            onMouseDown={e => e.preventDefault()}
        >
            <span className="widget-grouped-combobox-group-header-text">{title}</span>
        </li>
    );
}
