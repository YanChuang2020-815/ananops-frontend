import React, { Component, } from 'react';
import {Descriptions, Icon,Button,Popconfirm,Divider } from 'antd';
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import { Link } from 'react-router-dom'
// const token=window.localStorage.getItem('token')
class ItemDetail extends Component{
    constructor(props){
        super(props)
        this.state={
          imcItemDetail:{

          },
          token:window.localStorage.getItem('token'),
          roleCode:window.localStorage.getItem('roleCode'),
          picUrl:[]
        }
        this.getDetail = this.getDetail.bind(this);
    }
    componentDidMount(){
      const { 
        match : { params : { itemId } }
      } = this.props
      this.getDetail(itemId);   
    }
    getDetail=(id)=>{
      axios({
        method: 'GET',
        url: '/imc/inspectionItem/getItemByItemId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
    .then((res) => {
        if(res && res.status === 200){   
            console.log(res.data.result)  
        this.setState({
           imcItemDetail:res.data.result
        }) ;
        this.getPicUrl()
        }
    })
    .catch(function (error) {
        console.log(error);
    });
    }
    //获取图片路径
    getPicUrl=()=>{
      const{imcItemDetail,token}=this.state
      var detail={}
      detail.taskId=imcItemDetail.inspectionTaskId
      detail.itemId=imcItemDetail.id
      detail.itemStatus=imcItemDetail.status
      axios({
        method: 'POST',
        url: '/imc/inspectionItem/getImcPicListByTaskAndItemAndStatus',
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
        data:detail
      })
      .then((res) => {
          if(res && res.status === 200){   
            var arr=[]  
            console.log(res.data)
            res.data.result&&res.data.result.filter((e,index)=>{
              arr[index]=e.url
            })
            this.setState({
              picUrl:arr
            })  
          }
      })
      .catch(function (error) {
          console.log(error);
       //   message.info("您不具备该权限")
      });
    }

    //加载图片
    getImage=()=>{
      const {picUrl}=this.state
      var picitem=picUrl&&picUrl.map((item) => (
        <span>
        <img src={item} className='img'/> <br/>
        <a href={item}>点击查看</a>
      </span>
      ))
      return picitem
    }

    //工程师接单
    acceptImcItem=(itemId)=>{
      const data = {
        itemId:itemId
      }
      const { imcItemDetail } = this.state;
      axios({
        method: 'POST',
        url: '/imc/inspectionItem/acceptItemByMaintainer',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(data)
      })
        .then((res) => {
          if(res && res.status === 200){
            alert("工程师接单成功！")
            //如果当前是维修工账号
            // this.props.history.push(`/cbd/item/${imcItemDetail.inspectionTaskId}/3`)
            this.props.history.goBack()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    getFunction(id,status){ 
      if(status===2 && this.state.roleCode==='engineer'){
        return (
          <div style={{textAlign:'center'}}>
            <Popconfirm
              title="确定接单？"
              onConfirm={()=> {this.acceptImcItem(id)}}
            >
              <Button 
                type="primary"
                // style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button2}}
              >接单</Button>
            </Popconfirm> 
          </div>
        )
      }
    }

    render(){
      const {imcItemDetail}=this.state
      const {match : { params : { itemId,taskStatus,taskId } }} = this.props   
        return(
            <div>
                <div className="bg">
                  <Descriptions bordered size='small' className="descriptions">
                    <Descriptions.Item label="任务子项编号" span={1.5}>{imcItemDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="任务子项名称" span={1.5}>{imcItemDetail.itemName}</Descriptions.Item>
                    <Descriptions.Item label="关联任务编号" span={1.5}>{imcItemDetail.inspectionTaskId}</Descriptions.Item>
                    <Descriptions.Item label="巡检周期天数" span={1.5}>{imcItemDetail.frequency}（天）</Descriptions.Item>
                    <Descriptions.Item label="计划开始时间" span={1.5}>{imcItemDetail.scheduledStartTime}</Descriptions.Item>
                    <Descriptions.Item label="计划完成天数" span={1.5}>{imcItemDetail.days}（天）</Descriptions.Item>
                    <Descriptions.Item label="巡检点位数量" span={1.5}>{imcItemDetail.count}（个）</Descriptions.Item>
                    <Descriptions.Item label="巡检点位位置" span={1.5}>{imcItemDetail.location}</Descriptions.Item>
                    <Descriptions.Item label="任务子项内容" span={3}>{imcItemDetail.description}</Descriptions.Item>
                    <Descriptions.Item label="关联图片预览" span={3}>{this.getImage()}</Descriptions.Item>
                    {/* <Descriptions.Item label="操作" span={3}>
                      <Link to={`/cbd/item/${taskId}/${taskStatus}`}>返回上一级</Link> 
                    </Descriptions.Item> */}
                  </Descriptions>
                </div>  
                <div className="bg">
                  <Divider>子项任务执行信息</Divider>
                  <Descriptions bordered size='small' className="descriptions">
                    <Descriptions.Item label="工程师编号" span={1.5}>{imcItemDetail.maintainerId}</Descriptions.Item>
                    <Descriptions.Item label="工程师姓名" span={1.5}>{imcItemDetail.maintainerName}</Descriptions.Item>
                    <Descriptions.Item label="实际开始时间" span={1.5}>{imcItemDetail.actualStartTime}</Descriptions.Item>
                    <Descriptions.Item label="实际完成时间" span={1.5}>{imcItemDetail.actualFinishTime}</Descriptions.Item>
                  </Descriptions>
                </div>
                {this.getFunction(itemId, imcItemDetail.status)}
                <div style={{textAlign:"right"}}>
                    <Button type="primary" onClick={()=>this.props.history.goBack()} style={{marginRight:20, marginTop:10}}><Icon type='arrow-left'/>返回列表</Button>
                </div>
            </div>
        )
    }

}
export default ItemDetail