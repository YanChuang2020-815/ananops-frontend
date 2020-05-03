import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

class ApprovalRoute extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
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
          path="/cbd/examine"
          component={Loadable({
            loader: () => import(
              './NotApproved/index'),
            loading: Loading
          })}
        />
        <Route
          exact
          path="/cbd/examine/new/:id"
          component={Loadable({
            loader: () => import(
              './NotApproved/Create/index'),
            loading: Loading
          })}
        />
       
      </Switch>
    );
  }

}


export default ApprovalRoute;

