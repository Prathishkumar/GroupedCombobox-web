import { FilterTypeEnum } from "typings/GroupedComboboxProps";
import { CaptionsProvider, OptionsProvider, Status } from "./types";
import { matchSorter, MatchSorterOptions } from "match-sorter";
import { getFilterTypeOptions } from "./utils";

export class BaseOptionsProvider<T = unknown, P = object> implements OptionsProvider<T, P> {
    protected options: string[] = [];
    private caption: CaptionsProvider;
    private trigger?: () => void;

    filterType: FilterTypeEnum = "contains";
    searchTerm = "";
    lazyLoading: boolean = false;

    constructor(caption: CaptionsProvider) {
        this.caption = caption;
    }

    get hasMore(): boolean {
        return false;
    }

    get isLoading(): boolean {
        return false;
    }

    get status(): Status {
        return "available";
    }

    getAll(): string[] {
        return this.getAllWithMatchSorter();
    }

    private cachedOptions: string[] | null = null;
    private lastSearchTerm: string | null = null;
    private lastOptionsRef: string[] | null = null;

    protected getAllWithMatchSorter(): string[] {
        if (
            this.cachedOptions !== null &&
            this.lastSearchTerm === this.searchTerm &&
            this.lastOptionsRef === this.options
        ) {
            return this.cachedOptions;
        }

        const matchSorterOptions: MatchSorterOptions<string> = {
            keys: [v => this.caption.get(v)],
            ...getFilterTypeOptions(this.filterType)
        };

        if (this.searchTerm === "") {
            matchSorterOptions.sorter = option => option;
        }

        const result = matchSorter(this.options, this.searchTerm || "", matchSorterOptions);
        
        this.cachedOptions = result;
        this.lastSearchTerm = this.searchTerm;
        this.lastOptionsRef = this.options;

        return result;
    }

    setSearchTerm(term: string): void {
        this.searchTerm = term;
        this.trigger?.();
    }

    onAfterSearchTermChange(callback: () => void): void {
        this.trigger = callback;
    }

    loadMore(): void {
        return undefined;
    }

    _updateProps(_props: P): void {
        throw new Error("_updateProps not implemented");
    }
    _optionToValue(_option: string | null): T | undefined {
        throw new Error("_optionToValue not implemented");
    }
    _valueToOption(_value: T | undefined): string | null {
        throw new Error("_valueToOption not implemented");
    }
}
