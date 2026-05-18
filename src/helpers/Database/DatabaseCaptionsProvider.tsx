import Big from "big.js";
import { DynamicValue, ListAttributeValue, ListExpressionValue, ListWidgetValue, ObjectItem } from "mendix";
import { ReactNode } from "react";
import { OptionsSourceAssociationCustomContentTypeEnum } from "../../../typings/GroupedComboboxProps";
import { CaptionPlacement, CaptionsProvider } from "../types";
import { CaptionContent } from "../utils";

interface Props {
    emptyOptionText?: DynamicValue<string>;
    formattingAttributeOrExpression: ListExpressionValue<string> | ListAttributeValue<string> | undefined;
    customContent?: ListWidgetValue | undefined;
    customContentType: OptionsSourceAssociationCustomContentTypeEnum;
    attribute: ListAttributeValue<string | Big> | undefined;
    caption?: string;
    /** Optional attribute that defines the group/section heading for each item */
    groupAttribute?: ListAttributeValue<string>;
}

export class DatabaseCaptionsProvider implements CaptionsProvider {
    private unavailableCaption = "<...>";
    formatter?: ListExpressionValue<string> | ListAttributeValue<string>;
    protected customContent?: ListWidgetValue;
    protected customContentType: OptionsSourceAssociationCustomContentTypeEnum = "no";
    attribute?: ListAttributeValue<string | Big>;
    emptyCaption = "";
    overrideCaption: string | null | undefined = undefined;
    private groupFormatter?: ListAttributeValue<string>;

    constructor(private optionsMap: Map<string, ObjectItem>) {}

    updateProps(props: Props): void {
        if (!props.emptyOptionText || props.emptyOptionText.status === "unavailable") {
            this.emptyCaption = "";
        } else {
            this.emptyCaption = props.emptyOptionText.value!;
        }

        this.formatter = props.formattingAttributeOrExpression;
        this.customContent = props.customContent;
        this.customContentType = props.customContentType;
        this.attribute = props.attribute;
        this.overrideCaption = props.caption;
        this.groupFormatter = props.groupAttribute;
    }

    get(id: string | null): string {
        if (id === null) {
            if (this.overrideCaption) {
                return this.overrideCaption;
            }
            return this.emptyCaption;
        }
        if (!this.formatter && this.attribute) {
            const item = this.optionsMap.get(id);
            if (item) {
                return this.attribute.get(item).displayValue;
            }
        }
        const item = this.optionsMap.get(id);
        if (!item) {
            return this.unavailableCaption;
        }
        const captionValue = this.formatter?.get(item);
        if (!captionValue || captionValue.status === "unavailable") {
            return this.unavailableCaption;
        }

        if (captionValue.value !== undefined && captionValue.value !== null) {
            return String(captionValue.value);
        }
        return "";
    }

    /**
     * Returns the group title for the given item ID.
     * Returns null when no group attribute is configured or the value is unavailable.
     */
    getGroup(value: string): string | null {
        if (!this.groupFormatter) {
            return null;
        }
        const item = this.optionsMap.get(value);
        if (!item) {
            return null;
        }
        const groupValue = this.groupFormatter.get(item);
        if (!groupValue || groupValue.status !== "available" || !groupValue.displayValue) {
            return null;
        }
        return groupValue.displayValue;
    }

    getCustomContent(value: string | null): ReactNode | null {
        if (value === null) {
            return null;
        }
        const item = this.optionsMap.get(value);
        if (!item) {
            return null;
        }
        return this.customContent?.get(item) as ReactNode;
    }

    render(value: string | null, placement: CaptionPlacement, htmlFor?: string): ReactNode {
        const { customContentType } = this;

        return customContentType === "no" ||
            (placement === "label" && customContentType === "listItem") ||
            value === null ? (
            <CaptionContent htmlFor={htmlFor}>{this.get(value)}</CaptionContent>
        ) : (
            <div className="widget-combobox-caption-custom">{this.getCustomContent(value)}</div>
        );
    }
}
