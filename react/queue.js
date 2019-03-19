import { renderComponent } from "../react-dom/diff";

const stateQueue = [];
const renderQueue = [];

export function defer(fn) {
  return Promise.resolve().then(fn);
}

export function enqueueState(stateChange, component) {
  if (stateQueue.length === 0) {
    defer(flush);
  }
  stateQueue.push({
    stateChange,
    component
  });

  // 渲染对象，不能重复入队，只需要进入一次就行
  if (!renderQueue.some(item => item === component)) {
    renderQueue.push(component);
  }
}

function flush() {
  let item, component;

  /* eslint-disable-next-line no-cond-assign */
  while ((item = stateQueue.shift())) {
    const { stateChange, component } = item;

    // 如果没有prevState，则将当前的state作为初始的prevState
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state);
    }

    // 如果stateChange是一个方法，也就是setState的第二种形式
    if (typeof stateChange === "function") {
      Object.assign(component.state, stateChange(component.prevState, component.props));
    } else {
      // 如果stateChange是一个对象，则直接合并到setState中
      Object.assign(component.state, stateChange);
    }

    component.prevState = component.state;
  }

  /* eslint-disable-next-line no-cond-assign */
  while ((component = renderQueue.shift())) {
    renderComponent(component);
  }
}
