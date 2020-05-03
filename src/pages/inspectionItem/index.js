import React, { Component, } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { Spin,Tabs,Button,Icon,Modal,message,Steps } from 'antd';
import Loadable from 'react-loadable';
import InspectionItem from './inspectionItem/index'
import SubNew from '../imcItemInfo/AddImcItem/index'
const TabPane = Tabs.TabPane;
const { Step } = Steps;

class Item extends Component{
  constructor(props){
    super(props);
    this.state = {
      tabKey:"waitForMaintainer",
      role:window.localStorage.getItem('role'),
      roleCode:window.localStorage.getItem('roleCode'),
      token:window.localStorage.getItem('token'),
      imcTaskId:null,
      imcTaskDetail:{},
      imcTaskStatus:null,
      addVisible: false
    };
    this.onTabChange=this.onTabChange.bind(this);
  }
  componentDidMount(){
    const { 
      match : { params : { tabKey, imcTaskId, imcTaskStatus} }
    } = this.props
    this.setState({
      tabKey:tabKey,
      imcTaskId:imcTaskId,
      imcTaskStatus:imcTaskStatus
    })
    if(this.state.roleCode && this.state.roleCode==='engineer'){
      this.props.history.push("/cbd/inspection/waitForMaintainer");
    }else{
      this.props.history.replace({pathname:"/cbd/item/" + tabKey + "/" + imcTaskId +"/" + imcTaskStatus ,state:{tabKey:tabKey},query:this.props.location.query});
      this.getDetail(imcTaskId);
    }
  }

  getDetail=(id)=>{
    axios({
      method: 'GET',
      url: '/imc/inspectionTask/getTaskByTaskId/'+id,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){   
          console.log(res.data.result)  
          this.setState({
            imcTaskDetail:res.data.result
          }) ;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //tab栏每一个状态之间切换
  onTabChange=(key)=>{
    this.setState({tabKey:key});
    this.props.history.replace({pathname:"/cbd/item/"+key + "/" + this.state.imcTaskId + "/" + this.state.imcTaskStatus,state:{tabKey:key}});
  }

  // 新建任务子项模态框
  showAdd = () => {
    this.setState({
      addVisible: true,
    })
  }

  // 取消新建任务子项模态框
  addCancel = () => {
    this.setState({
      addVisible: false
    })
  }

  //获取文件
  getAttachments(fileList) {
    console.log(fileList)
    var res = [];
    var size = fileList.length;
    for (var i=0; i<size; i++) {
      var attachmentId = fileList[i].response[0].attachmentId;
      res.push(attachmentId);
    }
    return res;
  }

  // 确认提交新建任务子项表单
  addOk = e => {
    const { getFieldValue } = this.form;
    const { imcTaskId, imcTaskStatus} = this.state;
    const values = this.form.getFieldsValue()
    if (values.attachmentIds != undefined) {
      var fileList = values.attachmentIds.fileList;
      console.log(fileList)
      values.attachmentIds = this.getAttachments(fileList);
    }
    if(!getFieldValue('itemName')){
      message.error('请填写巡检子项名称')
      return;
    }
    if(!getFieldValue('inspectionTaskId')){
      message.error('请输入巡检任务ID')
      return;
    }
    if(!getFieldValue('inspectionTaskName')){
      message.error('请输入巡检任务名称')
      return;
    }
    if(!getFieldValue('location')){
      message.error('请输入巡检网点')
      return;
    }
    if(!getFieldValue('scheduledStartTime')){
      message.error('请输入预计开始时间')
      return;
    }
    if(!getFieldValue('days')){
      message.error('请输入巡检周期')
      return;
    }
    if(!getFieldValue('description')){
      message.error('请输入巡检子项描述')
      return;
    }
    values.scheduledStartTime=getFieldValue('scheduledStartTime').format('YYYY-MM-DD HH:mm:ss')
    values.status=1;
    axios({
      method: 'POST',
      url: '/imc/inspectionItem/save',
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(values)
    })
      .then((res) => {
        if(res && res.status === 200){
          message.info("巡检任务子项创建成功");
          this.form.resetFields();
          this.setState({
            addVisible: false
          });
          window.location.reload();
        }
      })
      .catch(function (error) {
        alert("巡检任务子项创建失败")
        console.log(error);
      });
  }

  render(){
    const Loading = () => {
      return (
        <div className="loading">
          <Spin size="large"></Spin>
        </div>
      );
    };
    const {imcTaskDetail} = this.state;
    const operations = (
      <div>
        {this.state.roleCode!==null && this.state.roleCode==='fac_leader' && this.state.tabKey==='waitForMaintainer' && <Button 
        type="primary" 
        style={{marginRight: 20}} 
        onClick={() => this.showAdd()}>+ 新建子项任务</Button>} 
      </div>
    )
    return (
      <div className="plan-approval-list-page">
        <div>
          <Tabs tabBarExtraContent={operations}
            activeKey={(this.props.location.state && this.props.location.state.tabKey) ? this.props.location.state.tabKey : ''}
            onChange={this.onTabChange}>
            <TabPane 
              tab="待分配"
              key="waitForMaintainer"
            >
              <Route exact 
                path="/cbd/item/waitForMaintainer/:imcTaskId/:imcTaskStatus" 
                component={Loadable({
                  loader: () => import(
                      './inspectionItem/index'),
                  loading: Loading
                })} 
              />
            </TabPane>
            <TabPane 
              tab="待确认"
              key="waitForAccept"
            >
              <Route exact 
                path="/cbd/item/waitForAccept/:imcTaskId/:imcTaskStatus" 
                component={Loadable({
                  loader: () => import(
                      './inspectionItem/index'),
                  loading: Loading
                })} 
              />
            </TabPane>
            <TabPane 
              tab="执行中"
              key="execute"
            >
              <Route exact 
                path="/cbd/item/execute/:imcTaskId/:imcTaskStatus" 
                component={Loadable({
                  loader: () => import(
                      './inspectionItem/index'),
                  loading: Loading
                })} 
              />
            </TabPane>
            <TabPane 
              tab="已结束"
              key="finish"
            >  
              <Route exact 
                path="/cbd/item/finish/:imcTaskId/:imcTaskStatus" 
                component={Loadable({
                  loader: () => import(
                      './inspectionItem/index'),
                  loading: Loading
                })} 
              />                         
            </TabPane>
            {/* <TabPane 
              tab="已确认"
              key="confirmed" 
            >  
              <Route exact 
                path="/cbd/item/confirmed/:imcTaskId/:imcTaskStatus" 
                component={Loadable({
                  loader: () => import(
                      './inspectionItem/index'),
                  loading: Loading
                })} 
              />                         
            </TabPane> */}
          </Tabs>
          {this.state.roleCode==='engineer' ? '' : <span> 
          <div style={{float:'left', marginTop:10, marginLeft:20}} >
            <span>
              <h1><Spin /> 当前任务：{imcTaskDetail.taskName}</h1>
            </span>
          </div>
          <Button 
          type="primary" 
          onClick={()=>this.props.history.replace({pathname:"/cbd/inspection/appoint",state:{tabKey:'appoint'}})} 
          style={{float:'right', marginTop:10, marginRight:20}}>
            <Icon type='arrow-left'/>返回待处理</Button></span>} 
        </div>
        <Modal
            title='新增子项任务'
            visible={this.state.addVisible}
            onOk={this.addOk}
            onCancel={() => {this.setState({addVisible:false});this.form.resetFields();}}
          >
            <SubNew setSubmit={(form) => {
              this.form = form
            }} taskId={this.state.imcTaskId}
            />
        </Modal>
      </div>
    );
  }

}


export default Item;