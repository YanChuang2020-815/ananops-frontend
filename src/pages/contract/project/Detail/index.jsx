import React, { Component, } from 'react';
import {Descriptions, Badge,Button } from 'antd';
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import { Link } from 'react-router-dom'
class ProjectDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          projectDetail:{

          },
          token:window.localStorage.getItem('token')
        }
        this.getDetail = this.getDetail.bind(this);
    }
    componentDidMount(){
      const projectId = this.props.projectId;
      this.getDetail(projectId);   
    }
    getDetail=(id)=>{
      axios({
        method: 'POST',
        url: '/pmc/project/getById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
    .then((res) => {
        if(res && res.status === 200){     
        this.setState({
           projectDetail:res.data.result
        }) ;
        }
    })
    .catch(function (error) {
        console.log(error);
    });
    

    }
    render(){
      const {projectDetail}=this.state
      console.log(projectDetail)
        return(
                <div className="bg">
                  <Descriptions bordered size='small' className="descriptions">
                    <Descriptions.Item  label="项目编号" span={1.5}>{projectDetail.id}</Descriptions.Item>
                    <Descriptions.Item  label="项目名称" span={1.5}>{projectDetail.projectName}</Descriptions.Item>
                   
                    <Descriptions.Item  label="用户公司编号" span={1.5}>{projectDetail.partyAId}</Descriptions.Item>
                    <Descriptions.Item  label="服务商公司编号" span={1.5}>{projectDetail.partyBId}</Descriptions.Item>
                    <Descriptions.Item  label="用户公司名称" span={1.5}>{projectDetail.partyAName}</Descriptions.Item>
                    <Descriptions.Item  label="服务商公司名称" span={1.5}>{projectDetail.partyBName}</Descriptions.Item>
                    <Descriptions.Item  label="用户负责人编号" span={1.5}>{projectDetail.aleaderId}</Descriptions.Item>
                    <Descriptions.Item  label="服务商负责人编号" span={1.5}>{projectDetail.bleaderId}</Descriptions.Item>
                    <Descriptions.Item  label="用户负责人姓名" span={1.5}>{projectDetail.aleaderName}</Descriptions.Item>
                    <Descriptions.Item  label="服务商负责人姓名" span={1.5}>{projectDetail.bleaderName}</Descriptions.Item>
                    <Descriptions.Item  label="用户负责人电话" span={1.5}>{projectDetail.aleaderTel}</Descriptions.Item>
                    <Descriptions.Item  label="服务商负责人电话" span={1.5}>{projectDetail.bleaderTel}</Descriptions.Item>
                    <Descriptions.Item  label="项目是否作废" span={1.5}>
                     {projectDetail.isDestroy==0?<Badge status="processing" text="有效" />:<Badge status="Error" text="作废" />}
                    </Descriptions.Item>
                    <Descriptions.Item  label="项目类型" span={1.5}>{projectDetail.projectType}</Descriptions.Item>
                    <Descriptions.Item  label="项目开始时间" span={1.5}>{projectDetail.startTime}</Descriptions.Item>
                    <Descriptions.Item  label="项目结束时间" span={1.5}>{projectDetail.endTime}</Descriptions.Item>
                    <Descriptions.Item  label="是否签署合同" span={1.5}>{projectDetail.isContract==0?'是':'否'}</Descriptions.Item>
                    <Descriptions.Item  label="关联合同编号" span={1.5}>{projectDetail.contractId}</Descriptions.Item>
                    <Descriptions.Item  label="服务商联系方式" span={1.5}>{projectDetail.partyBOne}</Descriptions.Item>
                    <Descriptions.Item  label="服务商24小时移动电话" span={1.5}>{projectDetail.partyBPhone}</Descriptions.Item>
                    <Descriptions.Item  label="服务商24小时值班电话" span={1.5}>{projectDetail.partyBTel}</Descriptions.Item>
                    <Descriptions.Item  label="服务商24小时联系邮箱" span={1.5}>{projectDetail.partyBEmail}</Descriptions.Item>
                    <Descriptions.Item  label="用户相关联系人" span={3}>------ 联系人1: ------<br/> 姓名：{projectDetail.aoneName} <br/> 电话：{projectDetail.partyAOne} <br/>
                    ------ 联系人2: ------<br/> 姓名：{projectDetail.atwoName} <br/> 电话：{projectDetail.partyATwo} <br/>
                    ------ 联系人3: ------<br/> 姓名：{projectDetail.athreeName} <br/> 电话：{projectDetail.partyAThree}
                    </Descriptions.Item>
                    <Descriptions.Item  label="项目相关描述" span={3}>{projectDetail.description}</Descriptions.Item>
                    <Descriptions.Item  label="操作">
                    {this.props.backToTable ? <Button
                      type="primary"
                      onClick={() => {
                        this.props.backToTable(projectDetail.contractId);
                      }}
                    >返回项目列表</Button> : <Button
                      type="primary"
                      onClick={() => {
                        this.props.onClose();
                      }}
                    >关闭项目详情</Button>}
                    </Descriptions.Item>
                  </Descriptions>
                
                </div>  
        )
    }

}
export default ProjectDetail