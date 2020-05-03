import React, { Component, } from 'react';
import {Descriptions, Badge,Button,Popconfirm,Row,Col,Table,Input,message,Modal,Form,Icon} from 'antd';
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import { Link } from 'react-router-dom'
import items from '../../../../config/status'
import AMap from 'AMap'
// const token=window.localStorage.getItem('token')
const FIRST_PAGE = 0;
const PAGE_SIZE = 100;
class WorkOrderDetail extends Component{
  constructor(props){
    super(props)
    this.state={
      projectDetail:{

      },
      token:window.localStorage.getItem('token'),
      statusCode:'',
      roleCode:window.localStorage.getItem('roleCode'),
      size: PAGE_SIZE,
      // total: 20, 
      nowCurrent:FIRST_PAGE,
      data:[],
      chooseid:'',
      statusMsg:'',
      commentVisible:false,
      comment:{},//值机员评价
      visible: false,
      result:{},
      assignDetail:{},//分配工程师
      detail:{},
      engineerAcceptDetail:{},//工程师接单定级
      noteDetail:{},//用户备件审核意见
      planApprovalDetail:{}, //服务商进行计划审批
      pmcDetail:{},//项目信息
      principleDetail:{},//审核人信息
      userDetail:{}, //保修人信息
      mapDetail:[],//地图信息
      resultVisible:false,
      assignVisible:false,
      engineerAcceptVisible:false,
      managerApprovalVisible:false,
      planApprovalVisible:false,
      mapVisible:false
    }
    this.getDetail = this.getDetail.bind(this);
  }
  componentDidMount(){
    const { 
      match : { params : { id } }
    } = this.props
    console.log(id)
    this.getDetail(id);   
    // this.initMapPoint()  
  }
    getDetail=(id)=>{
      axios({
        method: 'GET',
        url: '/mdmc/mdmcTask/getTaskDetailByTaskId?taskId='+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){   
            console.log(res.data.result)  
            this.setState({
              projectDetail:res.data.result.mdmcTask,
              pmcDetail:res.data.result.pmcProjectDto,
              principleDetail:res.data.result.principalInfoDto,
              userDetail:res.data.result.userInfoDto,
              statusCode:res.data.result.mdmcTask.status
            }) ;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    

    }
  //获取状态数值
  setStatus=(status)=>{
    var msg=this.getStatusInfo(status)
    let statusMsg=msg.name
    return statusMsg
   
  }
   
  getStatusInfo=(status)=>{
    var a=items.find(item => {
      return item.status===status;
    })
    return a
  }
  //操作改变进行状态之间的切换
  changeStatus(id,status,statusMsg){
    const values={"status": status,"statusMsg": statusMsg,"taskId":id}
    axios({
      method: 'POST',
      url: '/mdmc/mdmcTask/modifyTaskStatusByTaskId/'+id,
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(values)
    })
      .then((res) => {
        if(res && res.status === 200){
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //
  initMapPoint=()=>{
    const {projectDetail}=this.state
    console.log(projectDetail.totalCost)
    var marker=0
    this.map = new AMap.Map('container', {
      center: [116.397428, 39.90923],//中心点坐标
    });
    //监听双击事件
   
    // if (marker) {
    //     marker.setPosition(arr)
    // }
    marker = new AMap.Marker({
      icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      position: this.state.mapDetail
    });
    console.log(marker)
    this.map.add(marker);
  }
// 控制模态框显示
showMapModal = () => {
  const {projectDetail}=this.state
  this.setState({
    mapVisible: true,
  });
  // 
  var mapDetail=[projectDetail.requestLatitude,projectDetail.requestLongitude]
  var map = new AMap.Map('routeMap', {
    center: [116.397428, 39.90923],//中心点坐标
  });
  var marker = new AMap.Marker({
    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
    position: mapDetail
  });
  console.log(marker)
  map.add(marker);
};
closeMapModal = e => {
  console.log(e);
  this.setState({
    mapVisible: false,
  });
};
render(){
  const {projectDetail,userDetail,principleDetail}=this.state
  const {match : { params : { id } }} = this.props   
  return(
    <div className="bg">
      <Descriptions bordered size='small' className="descriptions">
        <Descriptions.Item label="工单编号" span={3}>{projectDetail.id}</Descriptions.Item>
        <Descriptions.Item label="维修任务名称" span={1.5}>{projectDetail.title}</Descriptions.Item>
        <Descriptions.Item label="报修人电话" span={1.5}>{projectDetail.call}</Descriptions.Item>
        <Descriptions.Item label="预约时间" span={1.5}>{projectDetail.appointTime&&projectDetail.appointTime||'--'}</Descriptions.Item>
        <Descriptions.Item label="截止时间" span={1.5}>{projectDetail.deadline&&projectDetail.deadline||'--'}</Descriptions.Item>
        <Descriptions.Item label="计划开始时间" span={1.5}>{projectDetail.scheduledStartTime&&projectDetail.scheduledStartTime||'--'}</Descriptions.Item>
        <Descriptions.Item label="计划结束时间" span={1.5}>{projectDetail.scheduledFinishTime&&projectDetail.scheduledFinishTime||'--'}</Descriptions.Item>
        <Descriptions.Item label="实际开始时间" span={1.5}>{projectDetail.actualStartTime&&projectDetail.actualStartTime}</Descriptions.Item>
        <Descriptions.Item label="实际结束时间" span={1.5}>{projectDetail.actualFinishTime&&projectDetail.actualFinishTime}</Descriptions.Item>                  
        <Descriptions.Item label="地址名" span={1.5}>
          <Button onClick={this.showMapModal}>查看</Button>
          <div className="path-map" style={{ display: (this.state.mapVisible === true) ? "" : "none" }} >
            <Icon className="path-map-icon" type="close-circle" onClick={this.closeMapModal} />
            <div style={{ width: '400px', height: '250px' }} id="routeMap"></div>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="紧急程度" span={1.5}>{projectDetail.level && projectDetail.level===1?'一般':(projectDetail.level===2?'紧急':(projectDetail.level===3?'非常紧急':'--'))}</Descriptions.Item>
        <Descriptions.Item label="审核人名称" span={1.5}>{principleDetail.userName}</Descriptions.Item>
        <Descriptions.Item label="状态" span={1.5}>{projectDetail.status&&this.setStatus(projectDetail.status)}</Descriptions.Item>
        <Descriptions.Item label="报修人名称" span={1.5}>{userDetail.userName}</Descriptions.Item>
        <Descriptions.Item label="预计花费" span={1.5}>{projectDetail.totalCost}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

//地图
mapOk=()=>{
  this.setState({
    mapVisible:false
  })
}
mapCancle=()=>{
  this.setState({
    mapVisible:false
  })
}

}
export default WorkOrderDetail