import React, { Component, } from 'react';
import {Descriptions, Badge,Button,Row,Col,Table,Icon,Select,Form } from 'antd';
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import { Link } from 'react-router-dom'
const { Option } = Select;
// const token=window.localStorage.getItem('token')
class BindEngineer extends Component{
  constructor(props){
    super(props)
    this.state={
      imcTaskDetail:{

      },
      engineerList:[],
      token:window.localStorage.getItem('token'),
      whichEngineer:null,
    }
    // this.getDetail = this.getDetail.bind(this);
  }
  componentDidMount(){
    const { 
      match : { params : { taskId,itemId } }
    } = this.props
    console.log("任务id：" + taskId)
    this.getDetail(taskId)

  }
    chooseWho = (e) =>{
      console.log(e)
      this.setState({
        whichEngineer:e
      })
    }
    //为巡检任务子项分配工程师
    appointEngineerForImcItem = (engineerId) =>{
      const { 
        match : { params : { taskId,taskStatus,itemId } }
      } = this.props
      console.log("itemId:" + itemId);
      // alert(engineerId);
      const values = {
        engineerId:engineerId,
        taskId:itemId
      }
      console.log("values:" + JSON.stringify(values))
      axios({
        method: 'POST',
        url: '/spc/workorder/distributeEngineerWithImcOrder',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(values)
      })
        .then((res) => {
          if(res && res.status === 200){     
            console.log(res.data.result)
            alert("工程师分配成功！")
            this.props.history.push(`/cbd/item/${taskId}/${taskStatus}`);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    //获取当前巡检任务子项对应的巡检任务的信息
    getDetail= async(id)=>{
      console.log("+++"+id)
      const res1 = await axios({
        method: 'GET',
        url: '/imc/inspectionTask/getTaskByTaskId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
      if(res1 && res1.status === 200){
        this.setState({
          imcTaskDetail:res1.data.result
        }) ;
      }
      let value={
        position:"engineer",
        pageNum:0,
        pageSize:0
      }
      const res2 = await axios({
        method: 'POST',
        url: '/spc/engineer/queryListByGroupId',//+this.state.imcTaskDetail.projectId,
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(value)
      })
      if(res2 && res2.status === 200){
        this.setState({
          engineerList:res2.data.result.list
        })
        console.log("列表：");
        console.log(this.state.engineerList);
      }

    }
    render(){
      const {
        match : { params : { taskId,taskStatus,itemId } }
      } = this.props   
      const List = [];
      const engineerIdList = this.state.engineerList;
      let length=0;
      for(let engineer in engineerIdList){
        length++;
      }
      for(let i=0;i<length;i++){
        List.push(<Option key={engineerIdList[i].userId}>{engineerIdList[i].loginName}</Option>);
      }
      // for (let i = 10; i < 36; i++) {
      //   children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
      // }

      return(
        <div className="bg">
          <div className="searchPart">
            <Row>
              <Col span={5}>
                <Link to={`/cbd/item/${taskId}/${taskStatus}`}>
                  <Icon type="arrow-left" ></Icon>返回
                </Link>
              </Col>
            </Row> 
            <Form>
              <Form.Item>
                <Select mode="tags" style={{ width: '100%' }} placeholder="请选择和该项目绑定的工程师" onSelect={this.chooseWho}>
                  {List}
                </Select>
                <Button onClick={()=>{this.appointEngineerForImcItem(this.state.whichEngineer)}}>确定绑定</Button>
              </Form.Item>
            </Form>
              
              
          </div>
        </div>  
      )
    }

}
export default BindEngineer