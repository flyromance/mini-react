import { enqueueState } from "./set-state-queue";

class Component {
  constructor(props = {}) {
    this.isReactComponent = true;

    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    enqueueState(stateChange, this);
  }
}

export default Component;
