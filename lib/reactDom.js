import { Component } from "./react";

const ReactDom = {};

ReactDom.render = function(vnode, container, callback) {
  container.innerHTML = "";
  return container.appendChild(_render(vnode));
};

export default ReactDom;

export function render(vnode, container) {
  let dom = _render(vnode);
  container.appendChild(dom);
  if (dom._component && dom._component.componentDidMount) {
    dom._component.componentDidMount();
  }
  return dom;
}

// 把对象渲染为dom
function _render(vnode) {
  if (vnode == null || typeof vnode === "boolean") {
    vnode = "";
  }

  if (typeof vnode === "number") {
    vnode = String(vnode);
  }

  // 当vnode是字符串，渲染结果是一段文本
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  // vnode是函数(普通函数或者类)
  if (typeof vnode.tag === "function") {
    const component = createComponent(vnode.tag, vnode.props);
    return component._dom;
  }

  // vnode是div等
  const parentDom = document.createElement(vnode.tag);
  if (vnode.props) {
    Object.keys(vnode.props).forEach(key => {
      setAttribute(parentDom, key, vnode.props[key]);
    });
  }

  vnode.children.forEach(child => {
    render(child, parentDom);
  });

  return parentDom;
}

export function setAttribute(dom, key, value) {
  if (key === "className") {
    key = "class";
  }

  if (/^on\w+$/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || "";
  } else if (key === "style") {
    if (!value || typeof value === "string") {
      dom.style.cssText = value || "";
    } else if (value && typeof value === "object") {
      for (let name in value) {
        dom.style[name] = typeof value[name] === "number" ? value[name] + "px" : value[name];
      }
    }
  } else {
    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(name, value);
    }
  }
}

export function createComponent(Ctor, props, children) {
  let component;

  // class类组件
  if (Ctor.prototype && Ctor.prototype.render) {
    component = new Ctor(props);
  } else {
    // 函数式组件
    component = {};
    component.constructor = Ctor;
    component.render = function() {
      return Ctor(props);
    };
  }

  if (component.componentWillMount) component.componentWillMount();

  let vnode = component.render();

  let dom = _render(vnode);

  component._dom = dom;

  component._vnode = vnode;

  vnode._component = component;

  return component;
}
