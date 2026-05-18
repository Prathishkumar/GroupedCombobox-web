import { ReactElement, createElement } from "react";

export type ThreeStateCheckBoxEnum = "all" | "some" | "none";

export interface ThreeStateCheckBoxProps {
    checked?: boolean;
    id?: string;
    value?: ThreeStateCheckBoxEnum;
    onChange?: () => void;
    disabled?: boolean;
}

export function ThreeStateCheckBox(props: ThreeStateCheckBoxProps): ReactElement {
    return createElement("input", {
        type: "checkbox",
        checked: props.value === "all" || props.checked,
        ref: (el: HTMLInputElement | null) => {
            if (el) {
                el.indeterminate = props.value === "some";
            }
        },
        onChange: props.onChange ?? (() => {}),
        id: props.id,
        disabled: props.disabled
    });
}
