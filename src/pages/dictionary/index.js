import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

class Dictionary extends Component{
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
          path="/mds/dict/list"
          component={Loadable({
            loader: () => import(
              './Index/index'),
            loading: Loading
          })}
        />
       
        <Route
          exact
          path="/mds/dict/list/new"
          component={Loadable({
            loader: () => import(
              './Create/index'),
            loading: Loading
          })}
        />
        <Route
          exact
          path="/mds/dict/list/edit/:dictId"
          component={Loadable({
            loader: () => import(
              './Create/index'),
            loading: Loading
          })}
        />

        <Route
          exact
          path="/mds/dict/list/dictItem/:dictId"
          component={Loadable({
            loader: () => import(
              './Sub/Index/index'),
            loading: Loading
          })}
        />
        <Route
          exact
          path="/mds/dict/list/dictItem/new/:dictId"
          component={Loadable({
            loader: () => import(
              './Sub/Create/index'),
            loading: Loading
          })}
        />
        <Route
          exact
          path="/mds/dict/list/dictItem/edit/:dictId/:itemId"
          component={Loadable({
            loader: () => import(
              './Sub/Create/index'),
            loading: Loading
          })}
        />
      </Switch>
    );
  }

}


export default Dictionary;
