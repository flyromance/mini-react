import React, { Component } from "./lib/react";
import ReactDom, { render } from "./lib/reactDom";

import Welcome from "./components/Welcome";

var names = ["fanlong", "fandisaier"];

function App() {
  return (
    <div style={{ color: "red" }} className="box" id="wrapper">
      hello <span>world!</span>
      {/* {arr.map(function (item) {return item + 2})} */}
      {names.map(name => {
        return <Welcome name={name} />;
      })}
      {/* <Counter /> */}
    </div>
  );
}

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    };
  }

  componentWillUpdate() {
    console.log("update");
  }

  componentWillMount() {
    console.log("willmount");
  }

  onClick() {
    this.setState({ num: this.state.num + 1 });
  }

  render() {
    return (
      <div>
        <h1>number: {this.state.num}</h1>
        <button onClick={() => this.onClick()}>add</button>
      </div>
    );
  }
}

// element = h('div', {}, hello, h('span', {}, world), name.map(() => {}));

ReactDom.render(<App />, document.getElementById("root"));
