import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable';

class BillRoute extends Component{
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
          path="/cbd/bill/index"
          component={Loadable({
            loader: () => import(
              './Index/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/bill/history"
          component={Loadable({
            loader: () => import(
              './History/index'),
            loading: Loading
          })}
        /> 
        <Route
            exact
            path="/cbd/bill/detail/:id"
            component={Loadable({
                loader: () => import(
                    './Detail/index'),
                loading: Loading
            })}
        />   
        <Route 
          exact   
          path="/cbd/bill/detail/workOrderDetail/:id"
          component={Loadable({
            loader: () => import(
              './Detail/WorkOrderDetail/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/bill/alipay/:id"
          component={Loadable({
            loader: () => import(
              './Detail/alipay'),
            loading: Loading
          })}
        /> 
        {/* 所需参数： */}
        {/* ?charset=utf-8
        &out_trade_no=1424123
        &method=alipay.trade.page.pay.return
        &total_amount=1.00
        &sign=feBq%2BG6oTQ%2FdnV2JBTX2I3LDGPo2ROyd9arwZaqoGgL4njhoJnsi3ffykZtcNvR7mCbLhthTJDPJV2zBwIgfO30cNi3YQwKWYoK1n1qoUhZdq492e2OXCfCjM5903RjXazkKbAhHjDICTMM3mL0uWADy47yQZbJWgBIhRNGD0AKd3m9rIbHHHn%2FW%2Fr4qrBBHdH085d%2BqYmlWBq81S%2FL4evrIXmSNk1FS4iLrPz28MdlLWhWq2szxR01rervy%2B%2BsZZtaMnOqYm8QumcMV8eWDRNyXxIqnhL21zfGJ3MhIVbEIKbcst74VBPHd%2FZrgPZ82bm4k14%2B0IZI04Hai%2FSxB5Q%3D%3D
        &trade_no=2020042022001438780501135742
        &auth_app_id=2016102100733322
        &version=1.0
        &app_id=2016102100733322
        &sign_type=RSA2
        &seller_id=2088102180541262
        &timestamp=2020-04-20+12%3A01%3A51 */}
        <Route 
          exact   
          path="/cbd/bill/alipayReturn/"
          component={Loadable({
            loader: () => import(
              './Detail/alipayReturn'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/bill/creatingBill"
          component={Loadable({
            loader: () => import(
              './CreatingBill/index'),
            loading: Loading
          })}
        /> 
        <Route 
          exact   
          path="/cbd/bill/finishedBill"
          component={Loadable({
            loader: () => import(
              './FinishedBill/index'),
            loading: Loading
          })}
        /> 
      </Switch>
    );
  }

}


export default BillRoute;
