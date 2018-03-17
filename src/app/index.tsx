import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    Alerts,
    Alert,
    Button,
    Badge
} from 'components';

class App extends React.Component {
    render() {
        return (
            <div style={{ padding: '20px' }}>
                <Alerts>
                    <Alert
                        type="info"
                        text="asd"
                        actions={[]}
                        icon="dollar"
                    />
                    <Alert
                        type="danger"
                        text="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                        actions={[]}
                        icon="exclamation-circle"
                    />
                    <Alert
                        type="warning"
                        text="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    />
                </Alerts>
                <br />
                <Button children="Primary" primary />
                <Button children="Saving" info outline loading />
                <Button children="Primary" primary icon="dollar" />
                <Button children="Saving" info outline loading disabled />
                <Button primary icon="dollar" />
                <Button info outline >
                    Show items <Badge children={100} />
                </Button>
                <br />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));