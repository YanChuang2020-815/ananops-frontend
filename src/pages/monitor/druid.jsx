import React,{Component} from 'react'
import {Tabs} from 'antd'

const TabPane = Tabs.TabPane
export default class Druid extends Component{
  render(){
    return (
      <Tabs defaultActiveKey="1" style={{height:"100%"}}>
        <TabPane 
          tab="数据中心-数据源"
          key="1"
          style={{height:800}}
        >
          <iframe title="swagger" src="http://www.ananops.com:8030/druid"  width="100%" height="100%"></iframe>
    
        </TabPane>
        <TabPane 
          tab="对接中心-数据源"
          key="2"
          style={{height:800}}
        > 
          <iframe title="swagger" src="http://www.ananops.com:8070/druid"  width="100%" height="100%"></iframe>
        </TabPane>
        <TabPane 
          tab="用户中心-数据源"
          key="3"
          style={{height:800}}
        >
          <iframe title="swagger" src="http://www.ananops.com:29993/druid"  width="100%" height="100%"></iframe>
        </TabPane>
      </Tabs>
    )
  }
}