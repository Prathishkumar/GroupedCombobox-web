import { UseComboboxPropGetters } from "downshift/typings";
import { Fragment, ReactElement, ReactNode } from "react";
import { SingleSelector } from "../../helpers/types";
import { groupItems } from "../../helpers/groupingUtils";
import { ComboboxMenuWrapper } from "../ComboboxMenuWrapper";
import { ComboboxOptionWrapper } from "../ComboboxOptionWrapper";
import { ComboboxGroupHeader } from "../ComboboxGroupHeader";
import { Loader } from "../Loader";

interface ComboboxMenuProps extends Partial<UseComboboxPropGetters<string>> {
    isOpen: boolean;
    selector: SingleSelector;
    highlightedIndex: number | null;
    selectedItem?: string | null;
    noOptionsText?: string;
    alwaysOpen?: boolean;
    menuFooterContent?: ReactNode;
    isLoading: boolean;
    lazyLoading: boolean;
    onScroll: (e: any) => void;
}

export function SingleSelectionMenu({
    isOpen,
    selector,
    highlightedIndex,
    getMenuProps,
    getItemProps,
    noOptionsText,
    alwaysOpen,
    menuFooterContent,
    isLoading,
    lazyLoading,
    onScroll
}: ComboboxMenuProps): ReactElement {
    const items = selector.options.getAll();

    // Build the group function — falls back to null (no grouping) when caption provider has no getGroup
    const getGroupFn = selector.caption.getGroup
        ? (id: string) => selector.caption.getGroup!(id)
        : (_id: string) => null;

    const segments = groupItems(items, getGroupFn);
    const isGrouped = segments.some(s => s.groupTitle !== null);

    // We need a continuous downshift index that skips group header rows
    let downshiftIndex = 0;

    return (
        <ComboboxMenuWrapper
            alwaysOpen={alwaysOpen}
            getMenuProps={getMenuProps}
            isEmpty={items?.length <= 0}
            isLoading={isLoading}
            isOpen={isOpen}
            lazyLoading={lazyLoading}
            loader={
                <Loader
                    isLoading={isLoading}
                    isOpen={isOpen}
                    lazyLoading={lazyLoading}
                    loadingType={selector.loadingType}
                    withCheckbox={false}
                    isEmpty={items.length === 0}
                />
            }
            menuFooterContent={menuFooterContent}
            noOptionsText={noOptionsText}
            onScroll={lazyLoading ? onScroll : undefined}
        >
            {isOpen &&
                (isGrouped
                    ? segments.map(segment => (
                          <Fragment key={segment.groupTitle ?? "__ungrouped__"}>
                              {segment.groupTitle && <ComboboxGroupHeader title={segment.groupTitle} />}
                              {segment.items.map(item => {
                                  const currentIndex = downshiftIndex++;
                                  return (
                                      <ComboboxOptionWrapper
                                          key={item}
                                          isHighlighted={alwaysOpen ? false : highlightedIndex === currentIndex}
                                          isSelected={selector.currentId === item}
                                          item={item}
                                          getItemProps={getItemProps}
                                          index={currentIndex}
                                      >
                                          {selector.caption.render(item, "options")}
                                      </ComboboxOptionWrapper>
                                  );
                              })}
                          </Fragment>
                      ))
                    : items.map((item, index) => (
                          <ComboboxOptionWrapper
                              key={item}
                              isHighlighted={alwaysOpen ? false : highlightedIndex === index}
                              isSelected={selector.currentId === item}
                              item={item}
                              getItemProps={getItemProps}
                              index={index}
                          >
                              {selector.caption.render(item, "options")}
                          </ComboboxOptionWrapper>
                      )))}
        </ComboboxMenuWrapper>
    );
}
