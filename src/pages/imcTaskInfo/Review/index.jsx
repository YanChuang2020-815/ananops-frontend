import React, { Component, } from 'react';
import {Button,Input,Form,Col,Row,Icon,Rate } from 'antd';
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import { Link } from 'react-router-dom'
const { TextArea } = Input;
// const token=window.localStorage.getItem('token')
class Review extends Component{
  constructor(props){
    super(props)
    this.state={
      token:window.localStorage.getItem('token'),
      reviewContent:null,
      valuek:5,
    }
    // this.getDetail = this.getDetail.bind(this);
  }
  componentDidMount(){
    const { 
      match : { params : { taskId } }
    } = this.props
    console.log("任务id：" + taskId)
  }
    handleContent = (e) =>{
      console.log(e.target.value);
      this.setState({
        reviewContent:e.target.value
      })
    }
    handleRank = (e) =>{
      this.setState({
        value:e
      })
    }
    submitReview = async ()=>{
      const { 
        match : { params : { taskId } }
      } = this.props
      console.log("提交的内容：" + this.state.reviewContent)
      console.log("任务的id：" + taskId)
      console.log("评论等级：" + this.state.value)
      const data2 = {
        status:7,
        taskId:taskId
            
      }
      console.log("data2:" + JSON.stringify(data2))
      const res2 = await axios({
        method: 'POST',
        url: '/imc/inspectionTask/modifyTaskStatusByTaskId',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(data2)
      })
      if(res2 && res2.status === 200){
        console.log(JSON.stringify(res2.data.result))
      }
      const data = {
        contents:this.state.reviewContent,
        inspectionTaskId:taskId,
        score:this.state.value
      }
      const res1 = await axios({
        method: 'POST',
        url: '/imc/inspectionReview/save',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(data)
      })
      if(res1 && res1.status === 200){     
        console.log(res1.data.result)
        alert("评价成功！")
        this.props.history.push('/cbd/inspection/finish')
      }
        
    }
    render(){
      const {
        match : { params : { taskId } }
      } = this.props   
      const {value} = this.state
      const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
      return(
        <div className="bg">
          <div className="searchPart">
            <Row>
              <Col span={5}>
                <Link to={`/cbd/inspection/comment`}>
                  <Icon type="rollback" style={{fontSize: 24, marginLeft:10}}></Icon> <Button type='primary' style={{marginLeft: 10}}>返回上一级</Button>
                </Link>
              </Col>
            </Row> 
            <Form>
              <Form.Item>
                <TextArea rows={4} placeholder="请输入内容" onChange={this.handleContent} />
                <span style={{marginLeft: 10}}>
                    请选择服务星级：
                  <Rate tooltips={desc} onChange={this.handleRank} value={value} />
                  {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
                </span> 
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={()=>{this.submitReview()}} style={{marginLeft: 20}}>提交评价</Button>
              </Form.Item>
            </Form>
              
              
          </div>
        </div>  
      )
    }

}
export default Review