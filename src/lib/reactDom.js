export const ReactDom = {};

ReactDom.render = function(vnode, container) {
  container.innerHTML = "";
  return render(vnode, container);
};

function render(vnode, container) {
  let dom = _render(vnode);
  vnode._dom = dom;
  container.appendChild(dom);
  if (vnode._component) {
    vnode._component.componentDidMount && vnode._component.componentDidMount();
  }
}

// 传入vnode，返回dom
function _render(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  if (typeof vnode.tag === "string") {
    return createHtmlNode(vnode);
  } else if (typeof vnode.tag === "function") {
    // class
    if (typeof vnode.tag.render === "function") {
      return createClassComponent(vnode);
    } else {
      // function
      return createFnComponent(vnode);
    }
  }
}

function createHtmlNode(vnode) {
  let { tag, props = {} } = vnode;
  let dom = document.createElement(tag);
  Object.keys(props).forEach(function(prop) {
    setProp(dom, prop, props[prop]);
  });
  if (props || props.children) {
    props.children.forEach(function(childVnode) {
      render(childVnode, dom);
    });
  }
  vnode._dom = dom;
  return dom;
}

function createClassComponent(vnode) {
  let { tag: Ctor, props } = vnode;
  let component = new Ctor(props);
  component.componentWillMount && component.componentWillMount();
  let _vnode = component.render();
  component._vnode = _vnode;

  let dom = _render(_vnode);
  vnode._component = component;
  vnode._dom = dom;
  return dom;
}

function createFnComponent(vnode) {
  let _vnode = vnode.tag(vnode.props);
  let dom = _render(_vnode);
  let component = {
    render: vnode,
    _vnode
  };
  vnode._component = component;

  return dom;
}

function setProp(dom, prop, value) {
  let value = props[prop];
  switch (prop) {
    case "children":
      break;
    case "className":
      dom.className = value;
      break;
    case "style":
      if (typeof value === "string") {
        dom.style.cssText = value;
      } else if (typeof value === "object") {
        Object.keys(value).forEach(function(key) {
          dom.style[key] = value[key];
        });
      }
      break;
    default:
      dom.setAttribute(prop, value);
      break;
  }
}

export function updateComponent(component) {
  component.componentWillUpdate && component.componentWillUpdate();
  let new_vnode = component.render();
  let old_vnode = component._vnode;
  // patch
  // diff(new_vnode, old_vnode);

  component._vnode = new_vnode;
  component.componentDidUpdate && component.componentDidUpdate();
}
