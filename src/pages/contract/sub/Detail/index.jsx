import React,{Component,} from 'react'
import {Descriptions, Badge,Button, Form, message } from 'antd';
import moment from 'moment';
import './index.styl'
import { Link } from 'react-router-dom'
import Inspection from '../Index';
import axios from 'axios'

class SubDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          inspectionDetail:{
          },
          token:window.localStorage.getItem('token'),
          picUrl:[]
        }
      this.getDetail = this.getDetail.bind(this);
    }
    componentDidMount(){
      const { 
        match : { params : { subId } }
      } = this.props
      this.getDetail(subId);   
    }
    getDetail=(id)=>{
      axios({
        method: 'POST',
        url: '/pmc/inspectDetail/getInspectDetailById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
    .then((res) => {
        if(res && res.status === 200){     
        this.setState({
           inspectionDetail:res.data.result
        }) ;
        }
    })
    .catch(function (error) {
        console.log(error);
        message.info("您不具备该权限")
    });
    

    }
    status=(status)=>{
      if(status===-1){
        return '不存在该状态'
      }
      else if(status===1){
        return '待服务商接单'
      }
      else if(status===2){
        return '巡检任务执行中'
      }
      else if(status===3){
        return '巡检结果待确认'
      }
      else if(status===4){
        return '巡检待付款'
      }
      else if(status===5){
        return '巡检已付款，等待用户方评价'
      }
      else if(status===6){
        return '已完成评价，巡检结束'
      }
    }

    render(){
      const { 
        match : { params : { projectId,id, } }
      } = this.props
      const {inspectionDetail}=this.state
        return(
            <div className="bg">
            <Descriptions bordered size='small' className="descriptions">
              <Descriptions.Item label="巡检详情ID" span={1.5}>{inspectionDetail.id}</Descriptions.Item>
              <Descriptions.Item label="巡检详情名称" span={1.5}>{inspectionDetail.name}</Descriptions.Item>
              <Descriptions.Item label="巡检任务ID" span={1.5}>{inspectionDetail.inspectionTaskId}</Descriptions.Item>
              <Descriptions.Item label="巡检任务名称" span={1.5}>{inspectionDetail.inspectionTaskName}</Descriptions.Item>
              <Descriptions.Item label="巡检网点" span={1.5}>{inspectionDetail.itemName}</Descriptions.Item>
              <Descriptions.Item label="维修人员姓名" span={1.5}>{inspectionDetail.maintainerName}</Descriptions.Item>
              <Descriptions.Item label="维修人员ID" span={1.5}>{inspectionDetail.maintainerId}</Descriptions.Item>
              <Descriptions.Item label="备注" span={1.5}>{inspectionDetail.remark}</Descriptions.Item>
              <Descriptions.Item label="巡检结果" span={1.5}>{inspectionDetail.result}</Descriptions.Item>
              <Descriptions.Item label="巡检状态" span={1.5}>{
                // inspectionDetail.status
                inspectionDetail.status&&this.status(inspectionDetail.status)
                }</Descriptions.Item>
              <Descriptions.Item label="巡检内容描述" span={3}>{inspectionDetail.description}</Descriptions.Item>     
              <Descriptions.Item label="操作" span={3}><Link to={`/cbd/pro/sub/${projectId}/${id}`}>返回上级</Link></Descriptions.Item>
            </Descriptions>
          
          </div>  
        )
    }
}
export default SubDetail
