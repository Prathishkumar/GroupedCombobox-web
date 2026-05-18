import { UseComboboxPropGetters } from "downshift/typings";
import { Fragment, MouseEvent, ReactElement, ReactNode } from "react";
import { Checkbox } from "../../assets/icons";
import { MultiSelector } from "../../helpers/types";
import { groupItems } from "../../helpers/groupingUtils";
import { ComboboxMenuWrapper } from "../ComboboxMenuWrapper";
import { ComboboxOptionWrapper } from "../ComboboxOptionWrapper";
import { ComboboxGroupHeader } from "../ComboboxGroupHeader";
import { Loader } from "../Loader";

interface MultiSelectionMenuProps extends Partial<UseComboboxPropGetters<string>> {
    isOpen: boolean;
    selectableItems: string[];
    selectedItems: string[];
    highlightedIndex: number | null;
    selector: MultiSelector;
    noOptionsText?: string;
    inputId?: string;
    menuHeaderContent?: ReactNode;
    menuFooterContent?: ReactNode;
    onOptionClick?: (e: MouseEvent) => void;
    isLoading: boolean;
    lazyLoading: boolean;
    onScroll: (e: any) => void;
}

export function MultiSelectionMenu({
    isOpen,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    selector,
    selectableItems,
    noOptionsText,
    inputId,
    menuHeaderContent,
    menuFooterContent,
    onOptionClick,
    isLoading,
    lazyLoading,
    onScroll
}: MultiSelectionMenuProps): ReactElement {
    // Build grouping function from caption provider
    const getGroupFn = selector.caption.getGroup
        ? (id: string) => selector.caption.getGroup!(id)
        : (_id: string) => null;

    const segments = groupItems(selectableItems, getGroupFn);
    const isGrouped = segments.some(s => s.groupTitle !== null);

    // Continuous downshift index that skips group header rows
    let downshiftIndex = 0;

    return (
        <ComboboxMenuWrapper
            getMenuProps={getMenuProps}
            highlightedIndex={highlightedIndex}
            isEmpty={selectableItems.length <= 0}
            isLoading={isLoading}
            isOpen={isOpen}
            lazyLoading={lazyLoading}
            loader={
                <Loader
                    isEmpty={selectableItems.length === 0}
                    isLoading={isLoading}
                    isOpen={isOpen}
                    lazyLoading={lazyLoading}
                    loadingType={selector.loadingType}
                    withCheckbox={selector.selectionMethod === "checkbox"}
                />
            }
            menuFooterContent={menuFooterContent}
            menuHeaderContent={menuHeaderContent}
            noOptionsText={noOptionsText}
            onOptionClick={onOptionClick}
            onScroll={lazyLoading ? onScroll : undefined}
        >
            {isOpen &&
                (isGrouped
                    ? segments.map(segment => (
                          <Fragment key={segment.groupTitle ?? "__ungrouped__"}>
                              {segment.groupTitle && <ComboboxGroupHeader title={segment.groupTitle} />}
                              {segment.items.map(item => {
                                  const currentIndex = downshiftIndex++;
                                  const isActive = highlightedIndex === currentIndex;
                                  const isSelected = selector.currentId?.includes(item);
                                  return (
                                      <ComboboxOptionWrapper
                                          key={item}
                                          isHighlighted={isActive}
                                          isSelected={isSelected}
                                          item={item}
                                          getItemProps={getItemProps}
                                          index={currentIndex}
                                      >
                                          {selector.selectionMethod === "checkbox" && (
                                              <Checkbox checked={isSelected} id={`${inputId}_${item}`} />
                                          )}
                                          {selector.caption.render(item, "options", `${inputId}_${item}`)}
                                      </ComboboxOptionWrapper>
                                  );
                              })}
                          </Fragment>
                      ))
                    : selectableItems.map((item, index) => {
                          const isActive = highlightedIndex === index;
                          const isSelected = selector.currentId?.includes(item);
                          return (
                              <ComboboxOptionWrapper
                                  key={item}
                                  isHighlighted={isActive}
                                  isSelected={isSelected}
                                  item={item}
                                  getItemProps={getItemProps}
                                  index={index}
                              >
                                  {selector.selectionMethod === "checkbox" && (
                                      <Checkbox checked={isSelected} id={`${inputId}_${item}`} />
                                  )}
                                  {selector.caption.render(item, "options", `${inputId}_${item}`)}
                              </ComboboxOptionWrapper>
                          );
                      }))}
        </ComboboxMenuWrapper>
    );
}
