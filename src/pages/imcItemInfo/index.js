import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

class imcItemInfo extends Component{
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
          path="/cbd/imcItemInfo/log/:taskId/:taskStatus/:itemId"
          component={Loadable({
            loader: () => import(
              './Log/index'),
            loading: Loading
          })}
        />
         <Route 
          exact   
          path="/cbd/imcItemInfo/bindEngineer/:taskId/:taskStatus/:itemId"
          component={Loadable({
            loader: () => import(
              './BindEngineer/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/imcItemInfo/detail/:taskId/:taskStatus/:itemId"
          component={Loadable({
            loader: () => import(
              './Detail/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/imcItemInfo/addImcItem/:taskId/:taskStatus"
          component={Loadable({
            loader: () => import(
              './AddImcItem/index'),
            loading: Loading
          })}
        />
      </Switch>
    );
  }

}


export default imcItemInfo;

