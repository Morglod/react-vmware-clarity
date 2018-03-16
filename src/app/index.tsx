import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Components from 'components';

class App extends React.Component {
    render() {
        return (
            <div>
                <Components.Alert
                    type="info"
                    text="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    actions={[]}
                    icon="exclamation-circle"
                />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));