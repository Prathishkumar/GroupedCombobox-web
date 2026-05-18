import { ReactElement, createElement } from "react";

export interface AlertProps {
    children?: string;
    id?: string;
}

export function ValidationAlert({ children, id }: AlertProps): ReactElement | null {
    if (!children) {
        return null;
    }
    return createElement("div", { className: "alert alert-danger mx-validation-message", id }, children);
}
