/**
 * Utility for grouping flat lists of option IDs into titled sections.
 * Items are sorted A-Z by their group title before grouping.
 * Items with no group title appear in a final "ungrouped" segment.
 */

export interface GroupSegment {
    /** null means the items have no group title (ungrouped) */
    groupTitle: string | null;
    items: string[];
}

/**
 * Groups a list of item IDs by their group title.
 * Automatically sorts groups A-Z. Ungrouped items appear at the end.
 *
 * @param items       Flat list of option IDs
 * @param getGroupFn  Function that returns the group title string for an ID (or null/empty)
 */
export function groupItems(items: string[], getGroupFn: (id: string) => string | null): GroupSegment[] {
    if (items.length === 0) {
        return [];
    }

    // Build a map: groupTitle → items[], preserving item order within each group
    const groupMap = new Map<string, string[]>();
    const ungrouped: string[] = [];

    for (const id of items) {
        const title = getGroupFn(id);
        if (!title || title.trim() === "") {
            ungrouped.push(id);
        } else {
            if (!groupMap.has(title)) {
                groupMap.set(title, []);
            }
            groupMap.get(title)!.push(id);
        }
    }

    // Sort group titles A-Z (case-insensitive)
    const sortedTitles = Array.from(groupMap.keys()).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    const segments: GroupSegment[] = sortedTitles.map(title => ({
        groupTitle: title,
        items: groupMap.get(title)!
    }));

    // Append ungrouped at the end
    if (ungrouped.length > 0) {
        segments.push({ groupTitle: null, items: ungrouped });
    }

    return segments;
}

/**
 * Returns true if the items array produces at least one non-null group title.
 * Used to conditionally render group headers vs plain list.
 */
export function hasGrouping(items: string[], getGroupFn: (id: string) => string | null): boolean {
    return items.some(id => {
        const title = getGroupFn(id);
        return title !== null && title.trim() !== "";
    });
}
