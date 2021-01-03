import * as React from "react";
export declare class Connectors extends React.PureComponent<{
    elements: {
        from: string;
        to: string;
        color?: string;
    }[];
    overlay: number;
    selector: string;
    strokeWidth: number;
    color: string;
}> {
    static defaultProps: {
        overlay: number;
        strokeWidth: number;
        color: string;
    };
    svgContainer: React.RefObject<HTMLDivElement>;
    svg: React.RefObject<SVGSVGElement>;
    componentDidMount(): void;
    componentDidUpdate(): void;
    checkSelector: () => void;
    connectAll: () => void;
    render(): JSX.Element;
}
