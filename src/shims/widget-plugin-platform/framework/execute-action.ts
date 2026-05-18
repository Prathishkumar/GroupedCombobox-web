import { ActionValue } from "mendix";

export function executeAction(action?: ActionValue): void {
    if (action && action.canExecute) {
        action.execute();
    }
}
