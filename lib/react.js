import { updateComponent } from "./reactDom";

const React = {};

export function createElement(tag, props, ...children) {
  return {
    tag,
    props,
    children: [].concat(...children)
  };
}

React.createElement = createElement;

export class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }
  shouldComponentUpdate() {
    return true;
  }
  _updateComponent() {
    let component = this;

    if (component.componentWillReceiveProps) component.componentWillReceiveProps(component.props);

    if (component.shouldComponentUpdate() !== true) return;

    if (component.componentWillUpdate) component.componentWillUpdate();

    const vnode = component.render.call(component);

    // 虚拟dom，diff
    // let old_vnode = component._vnode;
    // patch(vnode, old_vnode);
    // 比如vnode的tag类型是类式组件，vnode._component对应组件实例，如果是props不一样，就直接调用 updateComponent(vnode._component)
    // 或者把updateComponent方法，挂到组件对象的原型上！！！

    // 不需要重新渲染
    let dom = _render(vnode);

    if (component._dom && component._dom.parentNode) {
      component._dom.parentNode.replaceChild(dom, component._dom);
    }

    if (component.componentDidUpdate) component.componentDidUpdate();

    component._dom = dom;
    component._vnode = vnode;
    _dom._component = component;
  }
  setState(data = {}) {
    Object.assign(this.state, data);
    this._updateComponent();
  }
  render() {}
}

React.Component = Component;

export default React;
