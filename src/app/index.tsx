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
            <div className="main-container">
                <header className="header header-6">
                    <div className="branding">
                        <a href="https://github.com/Morglod/react-vmware-clarity" target="_blank">
                            <span className="title">React VMWare Clarity</span>
                        </a>
                    </div>
                </header>
                <nav className="subnav" />
                <div className="content-container">
                    <div className="content-area">
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
                    </div>
                    <nav className="sidenav" />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));