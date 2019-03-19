import { updateComponent } from "./reactDom";

export const React = {};

export function createElement(tag, props, ...children) {
  return {
    tag,
    props: {
      ...props,
      children: [].concat(...children)
    }
  };
}

React.createElement = createElement;

export default class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }
  setState(data) {
    if (this.shouldComponentUpdate(data) !== true) {
      return;
    }

    this.state = Object.assign(this.state, data);

    this._updateComponent();
  }

  _updateComponent() {
    updateComponent(this);
  }

  shouldComponentUpdate() {
    return true;
  }
}

React.Component = Component;
