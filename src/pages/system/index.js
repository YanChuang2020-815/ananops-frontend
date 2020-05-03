import React, { Component, } from 'react';
import {Route} from 'react-router-dom';
import { Tabs } from 'antd';
import Test from './Test';
import axios from 'axios'
import './index.styl'
const TabPane = Tabs.TabPane;

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey:"",
      role:window.localStorage.getItem('role'),
    };
    this.onTabChange=this.onTabChange.bind(this);
    // this.getUserInfo=this.getUserInfo.bind(this)
  }
  componentDidMount(){
    //   this.getUserInfo()
  }

  //tab栏每一个状态之间切换
  onTabChange=(key)=>{

    this.setState({tabKey:key});
    this.props.history.replace({pathname:"/cbd/maintain/data/"+key,state:{tabKey:key}});
    
  }

  //tab栏不同角色的切换
  getRole=(role)=>{
    console.log(role)

    if(role==='用户管理员'||role==='用户负责人'||role==='用户业务员'){
      return(
        <Tabs  
          activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
          onChange={this.onTabChange}>
          <TabPane 
            tab="全部"
            key=""
          >
            <Route exact 
              path="/cbd/maintain/data" 
              component={Test} 
            />
          </TabPane>
          <TabPane 
            tab="待审核"
            key="orderApproval"
          >
            <Route exact 
              path="/cbd/maintain/data/orderApproval" 
              component={Test} 
            />
          </TabPane>
          <TabPane 
            tab="待确认"
            key="planApproval"
          >
            <Route exact 
              path="/cbd/maintain/data/planApproval" 
              component={Test} 
            />
          </TabPane>
          {/* <TabPane 
            tab="待确认"
            key="serviceConfirm"
            >
            <Route exact 
                path="/cbd/maintain/data/serviceConfirm" 
                component={Test} 
                />
            </TabPane> */}
          <TabPane tab="待支付"
            key="pay"
          >  
            <Route exact 
              path="/cbd/maintain/data/pay" 
              component={Test} 
            />                        
          </TabPane>
          <TabPane 
            tab="已完成"
            key="finish"
          >
            <Route exact 
              path="/cbd/maintain/data/finish" 
              component={Test} 
            />
          </TabPane>
        </Tabs>
      )
    }
    else if(role=='维修工程师'){
      return(
        <Tabs 
          activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
          onChange={this.onTabChange}>
          <TabPane 
            tab="全部"
            key=""
          >
            <Route exact 
              path="/cbd/maintain/data" 
              component={Test} 
            />
          </TabPane>
          <TabPane 
            tab="待接单"
            key="maintainerWait"
          >
            <Route exact 
              path="/cbd/maintain/data/maintainerWait" 
              component={Test} 
            />
          </TabPane>
          <TabPane tab="进行中"
            key="planConfirm"
          >  
            <Route exact 
              path="/cbd/maintain/data/planConfirm" 
              component={Test} 
            />                         
          </TabPane>
          <TabPane 
            tab="已完成"
            key="finish"
          >
            <Route exact 
              path="/cbd/maintain/data/finish" 
              component={Test} 
            />
          </TabPane>
          {/* <TabPane tab="结果提交"
            key="resultSubmit"
            >  
               <Route exact 
                path="/cbd/maintain/data/resultSubmit" 
                component={Test} 
                />                         
            </TabPane> */}
        </Tabs>
      )
    }
    else if(role=='用户值机员'){
      return(
        <Tabs
          activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
          onChange={this.onTabChange}>
          <TabPane 
            tab="全部"
            key=""
          >
            <Route exact 
              path="/cbd/maintain/data" 
              component={Test} 
            />
          </TabPane>
          <TabPane tab="待审核"
            key="orderApproval"
          >  
            <Route exact 
              path="/cbd/maintain/data/orderApproval" 
              component={Test} 
            />                                          
          </TabPane>
          <TabPane 
            tab="待确认"
            key="serviceFinish"
          >
            <Route exact 
              path="/cbd/maintain/data/serviceFinish" 
              component={Test} 
            />
          </TabPane>
          {/* <TabPane 
            tab="待评价"
            key="comment"
          >
            <Route exact 
              path="/cbd/maintain/data/comment" 
              component={Test} 
            />
          </TabPane> */}
          <TabPane 
            tab="已完成"
            key="finish"
          >
            <Route exact 
              path="/cbd/maintain/data/finish" 
              component={Test} 
            />
          </TabPane>
        </Tabs>
      )
    }
    else if(role=='服务商业务员'||role==='服务商管理员'||role==='服务商负责人'){
      return(
        <Tabs
          activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
          onChange={this.onTabChange}>
          <TabPane 
            tab="全部"
            key=""
          >
            <Route exact 
              path="/cbd/maintain/data" 
              component={Test} 
            />
          </TabPane>
          <TabPane 
            tab="待接单"
            key="serverWait"
          >
            <Route exact 
              path="/cbd/maintain/data/serverWait" 
              component={Test} 
            />
          </TabPane>
          <TabPane 
            tab="待分配"
            key="assign"
          >
            <Route exact 
              path="/cbd/maintain/data/assign" 
              component={Test} 
            />
          </TabPane>
          <TabPane 
            tab="备件审核"
            key="billApproval"
          >
            <Route exact 
              path="/cbd/maintain/data/billApproval" 
              component={Test} 
            />
          </TabPane>
          <TabPane 
            tab="已完成"
            key="finish"
          >
            <Route exact 
              path="/cbd/maintain/data/finish" 
              component={Test} 
            />
          </TabPane>
        </Tabs>
      )
    }
    else{
      return(
        <Tabs
          activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
          onChange={this.onTabChange}>
          <TabPane 
            tab="全部订单"
            key=""
          >
            <Route exact 
              path="/cbd/maintain/data" 
              component={Test} 
            />
          </TabPane>
        </Tabs>
      )
    }
  }
  render() {
    const role=window.localStorage.getItem('role')
    return (    
      <div className="plan-approval-list-page">
        {this.getRole(role)}
        
      </div>
      
    );
  }
}

export default Data;