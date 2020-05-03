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
        {/* <Route 
          exact   
          path="/cbd/inspection/data"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        />    
         <Route 
          exact   
          path="/cbd/inspection/data/billApproval"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        />   
         <Route 
          exact   
          path="/cbd/inspection/data/maintainWait"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        />  
          <Route 
          exact   
          path="/cbd/inspection/data/maintainerWait"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        />
         <Route 
          exact   
          path="/cbd/inspection/data/planConfirm"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        /> 
          <Route 
          exact   
          path="/cbd/inspection/data/resultSubmit"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/inspection/data/orderApproval"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/inspection/data/planApproval"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/inspection/data/maintainConfirm"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/inspection/data/orderSubmit"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/inspection/data/maintainFinish"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        /> 
         <Route 
          exact   
          path="/cbd/inspection/data/pay"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        />   
         <Route 
          exact   
          path="/cbd/inspection/data/comment"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        />  
        <Route 
          exact   
          path="/cbd/inspection/data/resultSubmit"
          component={Loadable({
            loader: () => import(
              './Test/index'),
            loading: Loading
          })}
        />      */}
      </Switch>
    );
  }

}


export default system;
