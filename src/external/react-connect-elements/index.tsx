import * as React from "react";
import { PureComponent } from "react";
import ReactDOM from "react-dom";
import { connectElements } from "./utils";

const Portal = ({ children, query }) =>
  ReactDOM.createPortal(children, document.querySelector(query));

export default class ReactConnectElements extends PureComponent<{
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

  state = {
    querySelector: "body",
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
    if (document.querySelector(this.props.selector)) {
      this.setState({ querySelector: this.props.selector }, () =>
        this.connectAll()
      );
    }
  };

  connectAll = () => {
    const { elements } = this.props;

    elements.map((element, index) => {
      const start = document.querySelector(element.from);
      const end = document.querySelector(element.to);
      const path = this.svg.current.querySelector(`.path${index + 1}`);

      return connectElements(
        this.svgContainer.current,
        this.svg.current,
        path,
        start,
        end
      );
    });
  };

  render() {
    const { elements, overlay, strokeWidth, color } = this.props;

    if (this.state.querySelector) {
      return (
        <Portal query={this.state.querySelector}>
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
        </Portal>
      );
    }

    return null;
  }
}
