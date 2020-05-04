import React, {Component,} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Spin} from 'antd';
import Loadable from 'react-loadable';

class PanoramaRoute extends Component {
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
                    path="/cbd/panorama/scene"
                    component={Loadable({
                        loader: () => import(
                            './scene/index'),
                        loading: Loading
                    })}
                />
                <Route
                    exact
                    path="/cbd/panorama/addScene"
                    component={Loadable({
                        loader: () => import(
                            './addScene/index'),
                        loading: Loading
                    })}
                />
                <Route
                    exact
                    path="/cbd/panorama/panorama"
                    component={Loadable({
                        loader: () => import(
                            './panorama/index'),
                        loading: Loading
                    })}
                />
                <Route
                    exact
                    path="/cbd/panorama/addDevice"
                    component={Loadable({
                        loader: () => import(
                            './addDevice/index'),
                        loading: Loading
                    })}
                />
                <Route
                    exact
                    path="/cbd/panorama/device"
                    component={Loadable({
                        loader: () => import(
                            './device/index'),
                        loading: Loading
                    })}
                />
            </Switch>
        );
    }
}

export default PanoramaRoute;