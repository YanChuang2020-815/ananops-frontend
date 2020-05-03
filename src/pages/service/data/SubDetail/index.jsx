import React,{Component,} from 'react'
import {Descriptions, Badge,Button,Popconfirm,Row,Col,Table,Input,message,Modal,Form,Icon} from 'antd';
import { Link,Route } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
import AMap from 'AMap'
class SubDetail extends Component{

  constructor(props){
    super(props)
    this.state={
      subDetail:{
      },
      token:window.localStorage.getItem('token'),
    }
    
    this.getItemDetailByItemId=this.getItemDetailByItemId.bind(this);
   
  }
  componentDidMount(){
    const { 
      match : { params : {id, subId } }
    } = this.props

    this.getItemDetailByItemId(subId);
  }


 
  getItemDetailByItemId=(subId)=>{
    axios({        
      method: 'GET',
      url: '/mdmc/mdmcItem/getItemByItemId?itemId='+subId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){
          this.setState({
            subDetail: res.data.result,
          }) ;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
 
  render(){

    const {subDetail}=this.state
    const {match : { params : { id,subId } }} = this.props   
    console.log(subDetail)
    return(
 
      <div className="bg">
        <Descriptions bordered size="small" className="descriptions">          
          <Descriptions.Item label="维修任务ID" span={1.5}>{subDetail.taskId}</Descriptions.Item>     
          <Descriptions.Item label="任务子项ID" span={1.5}>{subDetail.id}</Descriptions.Item>
          <Descriptions.Item label="设备名称" span={1.5}>{subDetail.deviceName}</Descriptions.Item>
          <Descriptions.Item label="设备编号" span={1.5}>{subDetail.deviceId}</Descriptions.Item>  
          <Descriptions.Item label="设备类型" span={1.5}>{subDetail.deviceType}</Descriptions.Item>  
          <Descriptions.Item label="故障类型" span={1.5}>{subDetail.troubleType}</Descriptions.Item>
          <Descriptions.Item label="紧急程度" span={1.5}> {subDetail.level && subDetail.level===1?'不紧急':(subDetail.level===2?'一般':(subDetail.level===3?'紧急':'非常紧急'))} </Descriptions.Item>
          <Descriptions.Item label="故障地址" span={1.5}>{subDetail.troubleAddress} </Descriptions.Item> 
          <Descriptions.Item label="创建人" span={1.5}>{subDetail.creator|| '--'}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1.5}>{subDetail.createdTime|| '--'}</Descriptions.Item>
          <Descriptions.Item label="实际开始时间" span={1.5}>{subDetail.actualStartTime|| '--'}</Descriptions.Item>
          <Descriptions.Item label="实际结束时间" span={1.5}>{subDetail.actualFinishTime|| '--'}</Descriptions.Item>
          <Descriptions.Item label="更新时间" span={1.5}>{subDetail.updateTime|| '--'}</Descriptions.Item>
          <Descriptions.Item label="故障描述" span={3}>{subDetail.description}</Descriptions.Item>     
        </Descriptions>
            
      </div>
    )
  }
      
}
export default SubDetail