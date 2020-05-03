import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

class ManageRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const Loading = () => {
            return ( < div className = "loading" >
              <
                Spin size = "large" > </Spin> </div >
            );
        };
        return ( <
            Switch >
          <
            Route exact path = "/cbd/pro/contract"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './management/Index/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/contract/new"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './management/Create/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/contract/edit/:id"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './management/Create/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/contract/detail/:id"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './management/Detail/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/project"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './project/Index/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/project/new"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './project/Create/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/project/edit/:id"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './project/Create/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/project/detail/:id"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './project/Detail/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/inspection/:projectId"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './inspection/Index/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/inspection/new/:projectId"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './inspection/Create/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/inspection/edit/:projectId/:id"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './inspection/Create/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/inspection/detail/:projectId/:id"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './inspection/Detail/index'),
                    loading: Loading
                })
            }
            /> / >
          <
            Route exact path = "/cbd/pro/sub/:projectId/:id"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './sub/Index/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/sub/new/:projectId/:imcTaskId"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './sub/Create/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/sub/edit/:projectId/:imcTaskId/:subId"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './sub/Create/index'),
                    loading: Loading
                })
            }
            /> <
            Route exact path = "/cbd/pro/sub/detail/:projectId/:id/:subId"
            component = {
                Loadable({
                    loader: () =>
                        import (
                            './sub/Detail/index'),
                    loading: Loading
                })
            }
            /> </Switch >
        );
    }

}
export default ManageRoute;