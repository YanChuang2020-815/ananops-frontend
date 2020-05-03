import React,{Component,} from 'react'
import {Descriptions, Badge,Button, Form, message } from 'antd';
import moment from 'moment';
import './index.styl'
import { Link } from 'react-router-dom'
import Inspection from '../Index';
import axios from 'axios'
const token=window.localStorage.getItem('token')

class InspectionDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          inspectionDetail:{
          }
        }
      this.getDetail = this.getDetail.bind(this);
    }
    componentDidMount(){
      const inspectionDetail = this.props.inspectionDetail;
      this.setState({
        inspectionDetail
      })
      this.getDetail(inspectionDetail.id);   
    }
    getDetail=(id)=>{
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/getTaskById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
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
    render(){
      const {inspectionDetail}=this.state
      var type = inspectionDetail.taskType;
      if (type !== null || type != undefined) {
        type = type === '0' ? '日常巡视' : (type === '1') ? '项目配套' : '其他方案';
      }
        return(
            <div className="bg">
            <Descriptions bordered size='small' className="descriptions">
              <Descriptions.Item label="巡检计划ID" span={1.5}>{inspectionDetail.id}</Descriptions.Item>
              <Descriptions.Item label="计划名称" span={1.5}>{inspectionDetail.taskName}</Descriptions.Item>
              <Descriptions.Item label="计划类型" span={1.5}>{type}</Descriptions.Item>
              <Descriptions.Item label="项目唯一ID" span={1.5}>{inspectionDetail.projectId}</Descriptions.Item>
              <Descriptions.Item label="项目名称" span={1.5}>{inspectionDetail.projectName}</Descriptions.Item>
              <Descriptions.Item label="预计开始时间" span={1.5}>{inspectionDetail.scheduledStartTime}</Descriptions.Item>
              <Descriptions.Item label="持续时间" span={1.5}>{inspectionDetail.scheduledFinishTime}（天）</Descriptions.Item>
              <Descriptions.Item label="最迟完成时间" span={1.5}>{inspectionDetail.deadlineTime}</Descriptions.Item>
              <Descriptions.Item label="巡检周期" span={1.5}>{inspectionDetail.cycleTime}（天）</Descriptions.Item>
              <Descriptions.Item label="是否立即执行" span={1.5}>{inspectionDetail.isNow==0?'否':'是'}</Descriptions.Item>
              <Descriptions.Item label="总点位数" span={3}>{inspectionDetail.pointSum}（个）</Descriptions.Item>
              <Descriptions.Item label="描述" span={3}>{inspectionDetail.description}</Descriptions.Item>
              <Descriptions.Item label="巡检内容" span={3}>{inspectionDetail.inspectionContent}</Descriptions.Item>           
              <Descriptions.Item label="巡检情况" span={3}>{inspectionDetail.inspectionCondition}</Descriptions.Item>
              <Descriptions.Item label="处理结果" span={3}>{inspectionDetail.dealResult}</Descriptions.Item>
              <Descriptions.Item label="操作" span={3}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.backToInspectionTable(inspectionDetail.projectId);
                  }}
                >返回巡检计划列表
                </Button>
              </Descriptions.Item>
            </Descriptions>
          
          </div>  
        )
    }
}
export default InspectionDetail
