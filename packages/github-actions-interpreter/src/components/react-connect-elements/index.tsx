import * as React from "react";
import { PureComponent } from "react";
import { connectElements } from "./utils";

export class Connectors extends PureComponent<{
  elements: { from: string; to: string; color?: string }[];
  overlay: number;
  selector: string;
  strokeWidth: number;
  color: string;
}> {
  static defaultProps = {
    overlay: 0,
    strokeWidth: 5,
    color: "#666",
  };

  svgContainer = React.createRef<HTMLDivElement>();
  svg = React.createRef<SVGSVGElement>();

  componentDidMount() {
    this.checkSelector();
  }

  componentDidUpdate() {
    this.checkSelector();
  }

  checkSelector = () => {
    this.connectAll();
  };

  connectAll = () => {
    const { elements } = this.props;

    if (typeof document !== undefined) {
      elements.forEach((element, index) => {
        const start = document.querySelector(element.from);
        const end = document.querySelector(element.to);
        const path = this.svg.current.querySelector(`.path${index + 1}`);

        if (start && end) {
          connectElements(
            this.svgContainer.current,
            this.svg.current,
            path,
            start,
            end
          );
        }
      });
    }
  };

  render() {
    const { elements, overlay, strokeWidth, color } = this.props;

    return (
      <div
        className="react-connect-elements-container"
        style={{ zIndex: overlay, position: "absolute" }}
        ref={this.svgContainer}
      >
        <svg width="0" height="0" ref={this.svg}>
          {elements.map((element, index) => (
            <path
              key={`${element.from}-${element.to}`}
              className={`path${index + 1}`}
              d="M0 0"
              stroke={element.color || color}
              fill="none"
              strokeWidth={`${strokeWidth}px`}
            />
          ))}
        </svg>
      </div>
    );
  }
}
