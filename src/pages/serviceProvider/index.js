/* eslint-disable indent */
import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

class serviceProviderRoute extends Component{
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
          return(
            <Switch>
               
              <Route 
                    exact   
                    path="/cbd/alliance/engineer"
                    component={Loadable({
                        loader: () => import(
                        './engineer/index'),
                        loading: Loading
                    })}
                 />
              <Route 
                    exact   
                    path="/cbd/alliance/business"
                    component={Loadable({
                        loader: () => import(
                        './provider/Index/index'),
                        loading: Loading
                    })}
              />
              <Route 
                    exact
                    path="/cbd/alliance/business/edit"
                    component={Loadable({
                        loader: () => import(
                        './provider/Edit/index'),
                        loading: Loading
                    })}
              />
              
             
                 
            </Switch>
          )
    }
}
export default serviceProviderRoute