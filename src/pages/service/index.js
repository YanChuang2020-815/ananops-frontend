import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

class Service extends Component{
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
          path="/cbd/service/new"
          component={Loadable({
            loader: () => import(
              './data/Create/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/edit/:id"
          component={Loadable({
            loader: () => import(
              './data/Create/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/log/:id"
          component={Loadable({
            loader: () => import(
              './data/Process/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/plan/:id"
          component={Loadable({
            loader: () => import(
              './data/Plan/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/progress/:id"
          component={Loadable({
            loader: () => import(
              './data/Progress/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/sub/:id"
          component={Loadable({
            loader: () => import(
              './data/Sub/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/sub/new/:id"
          component={Loadable({
            loader: () => import(
              './data/SubNew/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/subEdit/:id/:subId"
          component={Loadable({
            loader: () => import(
              './data/SubNew/edit'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/subDetail/:id/:subId"
          component={Loadable({
            loader: () => import(
              './data/SubDetail/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/subEdit/:id/:subId"
          component={Loadable({
            loader: () => import(
              './data/SubNew/index'),
            loading: Loading
          })}
        />

        <Route 
          exact   
          path="/cbd/service/spare/:id"
          component={Loadable({
            loader: () => import(
              './data/Fault/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/detail/:id"
          component={Loadable({
            loader: () => import(
              './data/Detail/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/sublog/:id/:subId"
          component={Loadable({
            loader: () => import(
              './data/SubLog/index'),
            loading: Loading
          })}
        />
    
        <Route 
          exact   
          path="/cbd/service/subplan/:id/:subId"
          component={Loadable({
            loader: () => import(
              './data/SubPlan/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/plan/new/:id"
          component={Loadable({
            loader: () => import(
              './data/SubPlan/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/service/plan/new/:id/:subId"
          component={Loadable({
            loader: () => import(
              './data/SubPlanNew/index'),
            loading: Loading
          })}
        />
      </Switch>
    );
  }

}


export default Service;

