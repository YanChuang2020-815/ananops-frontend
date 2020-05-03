import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

class system extends Component{
  constructor(props){
    super(props);
    this.state = {
     
    };
 
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
          path="/cbd/inspection"
          component={Loadable({
            loader: () => import(
              './Inspection/index'),
            loading: Loading
          })}
        />    
        {/* <Route 
          exact   
          path="/cbd/inspection/wait"
          component={Loadable({
            loader: () => import(
              './Inspection/Inspection'),
            loading: Loading
          })}
        />    */}
        <Route 
          exact   
          path="/cbd/inspection/execute"
          component={Loadable({
            loader: () => import(
              './Inspection/index'),
            loading: Loading
          })}
        />  
        <Route 
          exact   
          path="/cbd/inspection/confirm"
          component={Loadable({
            loader: () => import(
              './Inspection/index'),
            loading: Loading
          })}
        />
        <Route 
          exact   
          path="/cbd/inspection/pay"
          component={Loadable({
            loader: () => import(
              './Inspection/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/inspection/comment"
          component={Loadable({
            loader: () => import(
              './Inspection/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/inspection/finish"
          component={Loadable({
            loader: () => import(
              './Inspection/index'),
            loading: Loading
          })}
        /> 
      </Switch>
    );
  }

}


export default system;
