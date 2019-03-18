import * as React from '../../lib/react';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { name } = this.props;
        return (
            <div>welcome {name}</div>
        );
    }
}