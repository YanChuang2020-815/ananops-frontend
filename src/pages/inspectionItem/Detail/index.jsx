import React, { Component, } from 'react';
import {Descriptions, Badge,Button } from 'antd';
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import { Link } from 'react-router-dom'
// const token=window.localStorage.getItem('token')
class ItemDetail extends Component{
  constructor(props){
    super(props)
    this.state={
      itemDetail:{

      },
      token:window.localStorage.getItem('token')
    }
    this.getDetail = this.getDetail.bind(this);
  }
  componentDidMount(){
    const { 
      match : { params : { id } }
    } = this.props
    console.log(id)
    this.getDetail(id);   
  }
    getDetail=(id)=>{
      axios({
        method: 'GET',
        url: '/mdmc/mdmcTask/getTaskByTaskId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){   
            console.log(res.data.result)  
            this.setState({
              itemDetail:res.data.result
            }) ;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    

    }
    render(){
      const {itemDetail}=this.state
      const {match : { params : { id } }} = this.props   
      console.log(itemDetail)
      return(
        <div className="bg">
          <Descriptions bordered size='small' className="descriptions">
            <Descriptions.Item label="巡检任务ID " span={3}>{itemDetail.id}</Descriptions.Item>
            <Descriptions.Item label="巡检任务名称" span={1.5}>{itemDetail.taskName}</Descriptions.Item>
            <Descriptions.Item label="巡检任务对应的用户方用户id" span={1.5}>{itemDetail.userId}</Descriptions.Item>   
            <Descriptions.Item label="计划起始时间" span={1.5}>{itemDetail.scheduledStartTime}</Descriptions.Item>
            <Descriptions.Item label="实际完成时间" span={1.5}>{itemDetail.actualFinishTime}</Descriptions.Item>
            <Descriptions.Item label="项目ID " span={1.5}>{itemDetail.projectId}</Descriptions.Item>
            <Descriptions.Item label="项目负责人ID" span={1.5}>{itemDetail.principalId}</Descriptions.Item>
            <Descriptions.Item label="服务商名称" span={1.5}>{itemDetail.facilitatorId}</Descriptions.Item>
            <Descriptions.Item label="巡检任务对应的服务商组织的Id " span={1.5}>{itemDetail.facilitatorGroupId}</Descriptions.Item>
            <Descriptions.Item label="计划完成天数" span={1.5}>{itemDetail.days}</Descriptions.Item>
            <Descriptions.Item label="巡检类型" span={1.5}>{itemDetail.inspectionType}</Descriptions.Item>
            <Descriptions.Item label="巡检位置信息" span={3}>{itemDetail.location}</Descriptions.Item>
            <Descriptions.Item label="巡检产生的维修维护费用" span={1.5}>{itemDetail.maintenanceCost}</Descriptions.Item>
            <Descriptions.Item label="备注" span={1.5}>{itemDetail.remark}</Descriptions.Item>
            <Descriptions.Item label="操作" span={3}>
              <Link to={`/cbd/inspection`}>返回上一级</Link>
            </Descriptions.Item> 
          </Descriptions>
        </div>
                
      )
    }

}
export default ItemDetail