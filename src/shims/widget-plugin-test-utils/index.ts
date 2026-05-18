import { DynamicValue } from "mendix";

/**
 * Creates a mock DynamicValue with status "available" and the given value.
 * Used in editor preview mode to provide static DynamicValue instances.
 */
export function dynamic<T>(value: T): DynamicValue<T> {
    return { status: "available", value } as DynamicValue<T>;
}
