import React, {Component,} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Spin} from 'antd';
import Loadable from 'react-loadable';

class EdgeDeviceRoute extends Component {
    render() {
        const Loading = () => {
            return (
                <div className="loading">
                    <Spin size="large"></Spin>
                </div>
            );
        };

        return (
            <Switch>
                <Route
                    exact
                    path="/cbd/edgeDevice/device"
                    component={Loadable({
                        loader: () => import(
                            './device/index'),
                        loading: Loading
                    })}
                />
                <Route
                    exact
                    path="/cbd/edgeDevice/deviceModel"
                    component={Loadable({
                        loader: () => import(
                            './deviceModel/index'),
                        loading: Loading
                    })}
                />
            </Switch>
        );
    }
}

export default EdgeDeviceRoute;