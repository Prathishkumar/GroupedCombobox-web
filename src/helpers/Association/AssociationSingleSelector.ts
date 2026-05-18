import { ReferenceValue } from "mendix";
import { GroupedComboboxContainerProps } from "../../../typings/GroupedComboboxProps";
import { SingleSelector } from "../types";
import { BaseAssociationSelector } from "./BaseAssociationSelector";

export class AssociationSingleSelector
    extends BaseAssociationSelector<string, ReferenceValue>
    implements SingleSelector
{
    type = "single" as const;
    updateProps(props: GroupedComboboxContainerProps): void {
        super.updateProps(props);
        this.currentId = this._attr?.value?.id ?? null;
    }
    setValue(value: string | null): void {
        this._attr?.setValue(this.options._optionToValue(value));
        super.setValue(value);
    }
}
