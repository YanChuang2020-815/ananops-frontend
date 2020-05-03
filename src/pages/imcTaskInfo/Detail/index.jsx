import React,{Component,} from 'react'
import { Descriptions,Button,Row,Col,Icon,Input,Popconfirm,message,Drawer,Modal,Popover,Rate, Divider  } from 'antd';
import { Link,Route } from 'react-router-dom'
import ProjectDetail from'../../contract/project/Detail/index'
import Comment from '../../system/Test/comment'
import moment from 'moment';
import axios from 'axios';
import './index.styl'

const FIRST_PAGE = 0;
const { TextArea } = Input;
class TaskDetail  extends Component{
  constructor(props){
    super(props)
    this.state={
      imcTaskDetail:{

      }, 
      token:window.localStorage.getItem('token'),
      role:window.localStorage.getItem('role'), 
      roleCode:window.localStorage.getItem('roleCode'),
      status:1,
      statusMsg:'',
      data:[],
      visible: false, //控制项目详情抽屉展示
      taskItemList:[],
      reviewRank:null,
      reviewContent:null,
      assignDetail:{},//分配工程师
      assignVisible:false,
      itemNumber:0,
      reportUrl:[],
      commentVisible:false,
      comment:{},//用户负责人评价
    }

    this.getDetail = this.getDetail.bind(this);
  }
  
  componentDidMount(){
    const { 
      match : { params : { id } }
    } = this.props
    this.getDetail(id);
    this.getItemList(id);
    // this.getItemNumber(id);
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

  getItemNumber=(id)=>{
    axios({
      method: 'GET',
      url: '/imc/inspectionTask/getItemNumberByTaskId/'+id,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){  
          console.log("该巡检任务的子项总数：") 
          console.log(res.data.result)  
          this.setState({
            itemNumber:res.data.result
          }) ;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //评论模态框，获取已知信息
  comment(record){ 
    this.setState({commentVisible:true})
    var receive={}
    receive.taskId=record.id
    receive.userId=record.principalId
    receive.principleId=record.principleId
    this.setState({comment:receive})
  }

  //返回不同的状态按钮
  getFunction(id,status,record){
    if(status===-1){
      return (
        <div style={{textAlign:'center'}}>
          <Popconfirm
            title="确定删除该任务？"
            onConfirm={()=> {this.deleteTask(id)}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            >删除</Button>
          </Popconfirm> 
        </div>
      )
    }
    else if(status=== 0 && this.state.role.includes('用户')){
      return (
        <div   style={{textAlign:'center'}}>
          <Popconfirm
            title="确定同意该巡检任务的执行？"
            onConfirm={()=> {this.approveImcTaskByA(id)}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            >同意执行</Button>
          </Popconfirm>  

          <Popconfirm
            title="确定否决该巡检任务的执行？"
            onConfirm={()=> {this.denyImcTaskByA(id)}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            >否决执行</Button>
          </Popconfirm>     
          <Popconfirm
            title="确定删除该任务？"
            onConfirm={()=> {this.deleteTask(id)}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            >删除</Button>
          </Popconfirm> 
        </div>
      )
    }
    else if(status === 2 && this.state.role.includes('服务商')){
      return (
        <div style={{textAlign:'center'}}>
          <Popconfirm
            title="确定接单？"
            onConfirm={()=> {this.acceptImcTaskByB(id)}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            >接单</Button>
          </Popconfirm>  

          <Popconfirm
            title="确定拒单？"
            onConfirm={()=> {this.denyImcTaskByB(id)}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            >拒单</Button>
          </Popconfirm> 
        
        </div>
      )
    }
    else if(status=== 4  && this.state.role.includes('用户')){
      return (
        <div style={{textAlign:'center'}}>
          <Button 
            type="primary"
            onClick={()=>{this.comment(record)}}
          >确认完成</Button>
        </div>
      )
    }
    else if(status=== 5 && this.state.role.includes('用户')){
      return (
        <div style={{textAlign:'center'}}>
          <Popconfirm
            title="确定付款？"
            onConfirm={()=> {this.payImcTask(id)}}
          >
            <Button 
              type="primary"
              // style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent'}}
            >费用支付</Button>
          </Popconfirm> 
        </div>
      )
    }
    // else if(status=== 6 && this.state.role.includes('用户')){
    //   return (
    //     <div style={{textAlign:'center'}}>
    //       <Link
    //           to={`/cbd/imcTaskInfo/review/${id}`} 
    //           style={{textAlign:'center'}}
    //         >
    //         <Button 
    //         type="primary"
    //         >服务评价</Button>
    //       </Link> 
    //     </div>
    //   )
    // }
    else if( status === 7 ){
      return (
        <div style={{textAlign:'center'}}>
          <Popover 
            content={
              <div>
                <TextArea rows={4} value={this.state.reviewContent} />
                <Rate value = {this.state.reviewRank}></Rate>
              </div>
            } 
            title="任务评价情况"
            trigger="click"
          >
            <Button 
              onClick={()=>{this.getTaskReview(id)}}
              type="primary"
              style={{marginRight:'12px'}}
            >查看评论</Button>
          </Popover>
          <Button 
              onClick={()=>{this.getReportUrl(id)}}
              type="primary"
              style={{marginRight:'12px'}}
            >巡检报告</Button>
        </div>
      )
    }
  }

  //用户方负责人同意该巡检任务的执行
  approveImcTaskByA=(id)=>{
    console.log("当前巡检任务id为：" + id)
    const data={
      taskId:id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/acceptImcTaskByPrincipal',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.props.history.push("/cbd/inspection");
        }
      })
      .catch(function (error) {
        console.log(error);
        this.props.history.push("/cbd/inspection");
      });
  }
  //用户方负责人否决该巡检任务的执行
  denyImcTaskByA=(id)=>{
    console.log("当前巡检任务id为：" + id)
    const data={
      taskId:id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/denyImcTaskByPrincipal',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.props.history.push("/cbd/inspection");
        }
      })
      .catch(function (error) {
        console.log(error);
        this.props.history.push("/cbd/inspection");
      });
  }
  //服务商接单
  acceptImcTaskByB=(id)=>{
    console.log("当前巡检任务id为：" + id)
    const data={
      taskId:id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/acceptTaskByFacilitator',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.props.history.push("/cbd/inspection");
        }
      })
      .catch(function (error) {
        console.log(error);
        this.props.history.push("/cbd/inspection");
      });
  }
  //服务商拒单
  denyImcTaskByB=(id)=>{
    console.log("当前巡检任务id为：" + id)
    const data={
      taskId:id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/refuseTaskByFacilitator',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.props.history.push("/cbd/inspection");
        }
      })
      .catch(function (error) {
        console.log(error);
        this.props.history.push("/cbd/inspection");
      });
  }
  //删除巡检任务
  deleteTask=(id)=>{
    console.log("当前巡检任务id为：" + id)
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/deleteTaskByTaskId/' + id,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          console.log(this)
          this.props.history.push("/cbd/inspection");
        }
      })
      .catch(function (error) {
        console.log(error);
        this.props.history.push("/cbd/inspection");
      });
  }
  
  //用户方付款
  payImcTask=(imcTaskId)=>{
    const data = {
      status:7,
      taskId:imcTaskId
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/modifyTaskStatusByTaskId',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(data)
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          alert("巡检任务付款成功！")
          this.getDetail(imcTaskId);  //更新页面数据
          this.getInfo(FIRST_PAGE); //更新列表数据
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //获取任务的评价
  getTaskReview = (taskId)=>{
    axios({
      method: 'GET',
      url: '/imc/inspectionReview/getReviewByTaskId/' + taskId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(JSON.stringify(res.data.result))
          this.setState({
            reviewRank:res.data.result.score,
            reviewContent:res.data.result.contents,
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
//获取工程师信息
assign=(record)=>{
  var info={}
  info.id=record
  this.setState({
    assignVisible:true,
    assignDetail:info
  })
}

//获取巡检报告路径
getReportUrl=(id)=>{
  const{token}=this.state
  axios({
    method: 'GET',
    url: '/imc/inspectionTask/getImcTaskReport/' + id,
    headers: {
      'deviceId': this.deviceId,
      'Authorization':'Bearer '+token,
    },
  })
  .then((res) => {
      if(res && res.status === 200){   
        var arr=[]  
        console.log("巡检报告url：")
        console.log(res.data)
        res.data.result&&res.data.result.filter((e,index)=>{
          arr[index]=e.url
        })
        this.setState({
          reportUrl:arr
        })  
        console.log(arr[0])
        if(null!=arr[0])
          window.location.href=arr[0];
        else
          alert("巡检报告不存在")
      }
  })
  .catch(function (error) {
      console.log(error);
   //   message.info("您不具备该权限")
  });
}

//获取巡检单据预览
getInvoicePreview=(id)=>{
  const{token}=this.state
  axios({
    method: 'GET',
    url: '/imc/itemInvoice/getInvoicePreview/' + id,
    headers: {
      'deviceId': this.deviceId,
      'Authorization':'Bearer '+token,
    },
  })
  .then((res) => {
      if(res && res.status === 200){   
        var arr=[];
        res.data.result&&res.data.result.filter((e,index)=>{
          arr[index]=e.url
        })
        if(null!=arr[0])
          window.location.href=arr[0];
        else
          alert("巡检单据不存在或未生成，完成全部点位后生成！")
      }
  })
  .catch(function (error) {
      console.log(error);
  });
}

getItemList = (id) => {
    const values={pageSize:100,pageNum:0,taskId:id}
    axios({
      method: 'POST',
      url: '/imc/inspectionItem/getAllItemListByTaskId',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:values
    }).then((res) => {
        if(res && res.status === 200){
          var taskItemList = res.data.result.list;
          var itemNumber = res.data.result.total;
          this.setState({
            taskItemList:taskItemList,
            itemNumber:itemNumber
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}

getItemDetail = () => {
  const {taskItemList}=this.state;
  var i = 1;
  var taskItem=taskItemList&&taskItemList.map((item, index) => (
    <div className="bg" key={item.id}>
      <Divider>任务子项-{i++}-《 {item.itemName} 》-详情 </Divider>
      <Descriptions bordered size='small' className="descriptions">
        <Descriptions.Item label="任务子项编号" span={1.5}>{item.id}</Descriptions.Item>
        <Descriptions.Item label="任务子项名称" span={1.5}>{item.itemName}</Descriptions.Item>
        <Descriptions.Item label="关联任务编号" span={1.5}>{item.inspectionTaskId}</Descriptions.Item>
        <Descriptions.Item label="巡检周期天数" span={1.5}>{item.frequency}（天）</Descriptions.Item>
        <Descriptions.Item label="计划开始时间" span={1.5}>{item.scheduledStartTime}</Descriptions.Item>
        <Descriptions.Item label="计划完成天数" span={1.5}>{item.days}（天）</Descriptions.Item>
        <Descriptions.Item label="巡检点位数量" span={1.5}>{item.count}（个）</Descriptions.Item>
        <Descriptions.Item label="巡检点位位置" span={1.5}>{item.location}</Descriptions.Item>
        <Descriptions.Item label="工程师编号" span={1.5}>{item.maintainerId}</Descriptions.Item>
        <Descriptions.Item label="工程师姓名" span={1.5}>{item.maintainerName}</Descriptions.Item>
        <Descriptions.Item label="实际开始时间" span={1.5}>{item.actualStartTime}</Descriptions.Item>
        <Descriptions.Item label="实际完成时间" span={1.5}>{item.actualFinishTime}</Descriptions.Item>
        <Descriptions.Item label="任务子项内容" span={3}>{item.description}</Descriptions.Item>
        <Descriptions.Item label="巡检单据预览" span={3}>{<Button type="primary" onClick={()=>this.getInvoicePreview(item.id)}>点击查看</Button>}</Descriptions.Item>
      </Descriptions>
    </div>
  ))
  return taskItem
}

showProjectDetail = () => {
  this.setState({
    visible: true,
  });
}

onClose = () => {
  this.setState({
    visible: false,
  });
};

//提交评论信息
commentOk = e =>{
  this.setState({
    commentVisible: false,
  });
  const values = this.form.getFieldsValue() 
  values.status=5;
  values.inspectionTaskId=values.taskId;
  values.principalId=values.userId;
  var id=values.taskId
  if (values.inspectionTaskId === undefined || values.inspectionTaskId === null) {
    message.error('任务Id不能为空');
    return;
  }
  if (values.checkContens === undefined || values.checkContens === null) {
    message.error('验收服务内容不能为空');
    return;
  }
  if (values.score === undefined || values.score === null) {
    message.error('服务星级不能为空');
    return;
  }
  if (values.contents === undefined || values.contents === null) {
    message.error('评价内容不能为空');
    return;
  }
  axios({
    contentType:'application/json',
    method: 'POST',
    url: '/imc/inspectionReview/confirmRating',
    headers: {
      'deviceId': this.deviceId,
      'Authorization':'Bearer '+this.state.token,
    },
    data:values
  })
    .then((res) => {
      if(res && res.status === 200){
        this.getDetail(id);  
      }
    })
    .catch(function (error) {
      console.log(error);
    });

}

//取消评论模态框
commentCancel=e=>{
  this.setState({
    commentVisible:false
  })
}

render(){

  const {imcTaskDetail,itemNumber,comment}=this.state;
  const {match : { params : { id,status } }} = this.props;
  // const 
  return(
    <div>
      <div className="bg">
        <Descriptions bordered size='small' className="descriptions">
          <Descriptions.Item label="巡检任务名称" span={1.5}>{imcTaskDetail.taskName}</Descriptions.Item>
          <Descriptions.Item label="巡检任务编号" span={1.5}>{imcTaskDetail.id}</Descriptions.Item>
          {/* <Descriptions.Item label="发起用户编号" span={1.5}>{imcTaskDetail.userId}</Descriptions.Item>    */}
          <Descriptions.Item label="用户负责人编号" span={1.5}>{imcTaskDetail.principalId}</Descriptions.Item>
          <Descriptions.Item label="用户负责人姓名" span={1.5}>{imcTaskDetail.principalName}</Descriptions.Item>
          <Descriptions.Item label="服务商编号" span={1.5}>{imcTaskDetail.facilitatorId}</Descriptions.Item>
          <Descriptions.Item label="服务商名称" span={1.5}>{imcTaskDetail.facilitatorName}</Descriptions.Item>
          <Descriptions.Item label="计划开始时间" span={1.5}>{imcTaskDetail.scheduledStartTime}</Descriptions.Item>
          <Descriptions.Item label="关联项目名称" span={1.5}>{imcTaskDetail.projectName}</Descriptions.Item>
          <Descriptions.Item label="计划完成天数" span={1.5}>{imcTaskDetail.days}（天）</Descriptions.Item>
          <Descriptions.Item label="巡检周期天数" span={1.5}>{imcTaskDetail.frequency}（天）</Descriptions.Item>
          <Descriptions.Item label="实际开始时间" span={1.5}>{imcTaskDetail.actualStartTime}</Descriptions.Item>
          <Descriptions.Item label="实际完成时间" span={1.5}>{imcTaskDetail.actualFinishTime}</Descriptions.Item>
          <Descriptions.Item label="应巡检点位数" span={1.5}>{imcTaskDetail.pointSum}（个）</Descriptions.Item>
          <Descriptions.Item label="已安排点位数" span={1.5}>{imcTaskDetail.alreadyPoint}（个）</Descriptions.Item>
          <Descriptions.Item label="过程相关费用" span={3}>{imcTaskDetail.maintenanceCost}</Descriptions.Item>
          <Descriptions.Item label="巡检任务内容" span={3}>{imcTaskDetail.content}</Descriptions.Item>
          <Descriptions.Item label="任务其他描述" span={3}>{imcTaskDetail.remark}</Descriptions.Item>
        </Descriptions>
      </div >
      {this.getFunction(id, imcTaskDetail.status,imcTaskDetail)}
      {this.getItemDetail()} 
      <div style={{textAlign:"right"}}> 
        {/* <Link to={`/cbd/inspection`}>返回上一级</Link> */}
        {imcTaskDetail.projectId &&
          <Button  
                  type="primary"
                  style={{marginRight:'12px'}}
                  onClick={() => {
                    this.showProjectDetail();
                  }}
          >查看关联项目</Button>}
        <Button type="primary" onClick={()=>this.props.history.goBack()}><Icon type='arrow-left'/>返回列表</Button>
      </div>
      <Modal
          title="验收评价"
          visible={this.state.commentVisible}
          onOk={this.commentOk}
          onCancel={this.commentCancel}
        >
          <Comment setComment={(form)=>{this.form = form}}  comment={comment}/>
      </Modal>  
      <Drawer
        title='工单关联项目详情'
        width={1000}
        destroyOnClose={true}
        onClose={this.onClose}
        visible={this.state.visible}
      >
        <ProjectDetail
          projectId={imcTaskDetail.projectId}
          onClose={this.onClose}
        />
      </Drawer>
    </div>
  )
}

}
export default TaskDetail