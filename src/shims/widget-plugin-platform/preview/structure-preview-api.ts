/* eslint-disable @typescript-eslint/no-explicit-any */

// Minimal type shims for the Mendix editor preview API.
// These are enough to satisfy TypeScript compilation in the standalone build.

export interface StructurePreviewProps {
    type: string;
    [key: string]: any;
}

export interface ContainerProps extends StructurePreviewProps {
    children?: StructurePreviewProps[];
    borders?: boolean;
    borderRadius?: number;
    borderWidth?: number;
    padding?: number;
    backgroundColor?: string;
}

export interface DropZoneProps extends StructurePreviewProps {
    property: any;
    placeholder?: string;
}

type BuilderFn<T> = {
    (...modifiers: any[]): (...args: any[]) => T;
};

/**
 * The real `container` is a curried builder: container(modifiers...)(children...) => ContainerProps.
 */
interface ContainerBuilder extends BuilderFn<ContainerProps> {
    padding(n: number): any;
    borders(): any;
    borderWidth(n: number): any;
    borderRadius(n: number): any;
    backgroundColor(c: string): any;
}

export const container: ContainerBuilder = Object.assign(
    (..._modifiers: any[]) => (..._args: any[]) => ({ type: "Container" } as ContainerProps),
    {
        padding: (_n: number) => ({ padding: _n }),
        borders: () => ({ borders: true }),
        borderWidth: (_n: number) => ({ borderWidth: _n }),
        borderRadius: (_n: number) => ({ borderRadius: _n }),
        backgroundColor: (_c: string) => ({ backgroundColor: _c })
    }
);

/**
 * The real `dropzone` is a curried builder: dropzone(modifiers...)(property) => DropZoneProps.
 */
interface DropzoneBuilder extends BuilderFn<DropZoneProps> {
    placeholder(text: string): any;
    hideDataSourceHeaderIf(condition: boolean): any;
}

export const dropzone: DropzoneBuilder = Object.assign(
    (..._modifiers: any[]) => (..._args: any[]) => ({ type: "DropZone" } as DropZoneProps),
    {
        placeholder: (_text: string) => ({ placeholder: _text }),
        hideDataSourceHeaderIf: (_condition: boolean) => ({ hideDataSourceHeader: _condition })
    }
);

interface PaletteColors {
    ContrastText: string;
    background: { [key: string]: string };
    text: { [key: string]: string };
    [key: string]: any;
}

export const structurePreviewPalette: Record<string, PaletteColors> = {
    light: {
        ContrastText: "#333",
        background: { topbarData: "#DAEFFB", topbarStandard: "#F5F5F5", container: "#FFF" },
        text: { data: "#264AE5", primary: "#333", secondary: "#6B707B" }
    },
    dark: {
        ContrastText: "#FFF",
        background: { topbarData: "#3E4453", topbarStandard: "#3B3E48", container: "#252627" },
        text: { data: "#579BF9", primary: "#DEDEDE", secondary: "#A7A7A7" }
    }
};
