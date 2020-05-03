import React, { Component, } from 'react';
import {Route} from 'react-router-dom';
import { Tabs } from 'antd';
import Inspection from './Inspection';
import InspectionItem from '../inspectionItem/inspectionItem'
import axios from 'axios'
import './index.styl'
const TabPane = Tabs.TabPane;

class InspectionData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey:"",
      roleCode:window.localStorage.getItem('roleCode'),
      partyA_show:'none',
      partyB_show:'none',
      partyC_show:'none',
    };
    this.onTabChange=this.onTabChange.bind(this);
    // this.getUserInfo=this.getUserInfo.bind(this)
  }

  
  componentDidMount(){
    const { 
      location : { pathname }
    } = this.props
    if(this.state.roleCode && this.state.roleCode==='user_leader'){
      //this.props.history.replace({pathname:"/cbd/inspection/",state:{tabKey:''}});
      this.setState({
        partyA_show:'block',
        partyB_show:'none',
        partyC_show:'none',
      })
      //this.props.history.replace({pathname:"/cbd/inspection/",state:{tabKey:''}});

    }else if(this.state.roleCode &&this.state.roleCode==='fac_leader'){
    
      this.setState({
        partyA_show:'none',
        partyB_show:'block',
        partyC_show:'none',
      })
      //this.props.history.replace({pathname:"/cbd/inspection",state:{tabKey:''}});
    }else if(this.state.roleCode && this.state.roleCode==='engineer')
    {
      this.setState({
        partyA_show:'none',
        partyB_show:'none',
        partyC_show:'block',
      })
      if (pathname === '/cbd/inspection') {
        this.props.history.replace({pathname:"/cbd/inspection/allItem",state:{tabKey:'allItem'}});
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.roleCode && this.state.roleCode==='engineer' && nextProps.location.pathname==='/cbd/inspection' ) {
      this.props.history.replace({pathname:"/cbd/inspection/allItem",state:{tabKey:'allItem'}});
    }
  }

  //tab栏每一个状态之间切换
  onTabChange=(key)=>{

    this.setState({tabKey:key});
    this.props.history.replace({pathname:"/cbd/inspection/"+key,state:{tabKey:key}});
    
  }
  render() {
    return (    
      <div className="plan-approval-list-page">
        <Tabs 
          style={{display:this.state.partyA_show}}
          activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
          onChange={this.onTabChange}>
          <TabPane 
            tab="全部"
            key=""
          >
            <Route exact 
              path="/cbd/inspection/" 
              component={Inspection} 
            />
          </TabPane>
          <TabPane 
            tab="待审核"
            key="waitForPrincipal"
          >
            <Route exact 
              path="/cbd/inspection/waitForPrincipal" 
              component={Inspection} 
            />
          </TabPane>
          {/* <TabPane 
            tab="待审核"
            key="check"
          >
            <Route exact 
              path="/cbd/inspection/check" 
              component={Inspection} 
            />
          </TabPane> */}
          {/* <TabPane 
            tab="待接单"
            key="accept"
          >
            <Route exact 
              path="/cbd/inspection/accept" 
              component={Inspection} 
            />
          </TabPane> */}
          <TabPane 
            tab="执行中"
            key="execute"
          >
            <Route exact 
              path="/cbd/inspection/execute" 
              component={Inspection} 
            />
          </TabPane>
          <TabPane 
            tab="待确认"
            key="confirm"
          >  
            <Route exact 
              path="/cbd/inspection/confirm" 
              component={Inspection} 
            />                         
          </TabPane>
          <TabPane tab="待支付"
            key="pay"
          >  
            <Route exact 
              path="/cbd/inspection/pay" 
              component={Inspection} 
            />                         
          </TabPane>
          {/* <TabPane tab="待评价"
            key="comment"
          >  
            <Route exact 
              path="/cbd/inspection/comment" 
              component={Inspection} 
            />                         
          </TabPane> */}
          <TabPane tab="已完成"
            key="finish"
          >  
            <Route exact 
              path="/cbd/inspection/finish" 
              component={Inspection} 
            />                         
          </TabPane>
          {/* <TabPane tab="已否决"
            key="deny"
          >  
            <Route exact 
              path="/cbd/inspection/deny" 
              component={Inspection} 
            />                         
          </TabPane> */}
        </Tabs>
        <Tabs 
          style={{display:this.state.partyB_show}}
          activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
          onChange={this.onTabChange}>
          <TabPane 
            tab="全部"
            key=""
          >
            <Route exact 
              path="/cbd/inspection/" 
              component={Inspection} 
            />
          </TabPane>
          <TabPane 
            tab="待接单"
            key="waitForFacilitator"
          >
            <Route exact 
              path="/cbd/inspection/waitForFacilitator" 
              component={Inspection} 
            />
          </TabPane>
          <TabPane 
            tab="待处理"
            key="appoint"
          >
            <Route exact 
              path="/cbd/inspection/appoint" 
              component={Inspection} 
            />
          </TabPane>
          <TabPane 
            tab="已完成"
            key="alreadyAppoint"
          >
            <Route exact 
              path="/cbd/inspection/alreadyAppoint" 
              component={Inspection} 
            />
          </TabPane>
        </Tabs>
        <Tabs 
          style={{display:this.state.partyC_show}}
          activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
          onChange={this.onTabChange}>
          <TabPane 
            tab="全部"
            key="allItem"
          >
            <Route exact 
              path="/cbd/inspection/allItem" 
              component={InspectionItem} 
            />
          </TabPane>
          <TabPane 
            tab="待接单"
            key="waitForMaintainer"
          >
            <Route exact 
              path="/cbd/inspection/waitForMaintainer" 
              component={InspectionItem} 
            />
          </TabPane>
          <TabPane 
            tab="已接单"
            key="maintainerAccept"
          >
            <Route exact 
              path="/cbd/inspection/maintainerAccept" 
              component={InspectionItem} 
            />
          </TabPane>
          <TabPane 
            tab="已完成"
            key="alreadyAppoint"
          >
            <Route exact 
              path="/cbd/inspection/alreadyAppoint" 
              component={InspectionItem} 
            />
          </TabPane>
        </Tabs>
      </div>
      
    );
  }
}
export default InspectionData;