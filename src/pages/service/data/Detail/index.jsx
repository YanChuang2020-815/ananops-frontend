import React, { Component, } from 'react';
import {Descriptions,Button,Popconfirm,Divider,message,Modal,Card,Icon,Drawer} from 'antd';
import moment from 'moment';
import './index.styl'
import Confirm from '../../../system/Test/confirm'
import Result from  '../../../system/Test/result'
import Comment from '../../../system/Test/comment'
import Assign from './assign'
import Level from '../../../system/Test/level'
import Note from '../../../system/Test//note'
import Approval from '../../../system/Test//approval'
import ProjectDetail from'../../../contract/project/Detail/index'
import axios from 'axios'
import { Link } from 'react-router-dom'
import items from '../../../../config/status'
import AMap from 'AMap'
import { platform } from 'os';
import { copyFileSync } from 'fs';
class MdmcTaskDetail extends Component{
  constructor(props){
    super(props)
    this.state={
      projectDetail:{

      },
      token:window.localStorage.getItem('token'),
      statusCode:'',
      roleCode:window.localStorage.getItem('roleCode'),
      data:[],
      chooseid:'',
      statusMsg:'',
      commentVisible:false,
      comment:{},//值机员评价
      visible: false, //控制项目详情抽屉展示
      result:{},
      assignDetail:{},//分配工程师
      detail:{},
      engineerAcceptDetail:{},//工程师接单定级
      noteDetail:{},//用户备件审核意见
      planApprovalDetail:{}, //服务商进行计划审批
      examine:{}, //值机员审核
      pmcDetail:{},//项目信息
      principleDetail:{},//审核人信息
      userDetail:{}, //保修人信息
      mapDetail:[],//地图信息
      picUrl:[], //图片信息
      resultVisible:false,
      assignVisible:false,
      engineerAcceptVisible:false,
      managerApprovalVisible:false,
      planApprovalVisible:false,
      mapVisible:false,
      examineVisible:false,
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
              engineerDto : res.data.result.engineerDto,
              principleDetail:res.data.result.principalInfoDto,
              userDetail:res.data.result.userInfoDto,
              statusCode:res.data.result.mdmcTask.status
            }) ;
            this.getPicUrl()
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

  //返回不同的状态按钮
  getFunction(id,status){
    const {roleCode}=this.state
    if(status===3&&(roleCode==='fac_manager'||roleCode==='fac_leader'||roleCode==='fac_service')){
      return (
        <div style={{textAlign:'center'}}>
          <Popconfirm
            title="确认接单？"
            onConfirm={()=> {this.changeStatus(id,4,'审核通过，待服务商接单')}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            >接单</Button>
          </Popconfirm>
          <Popconfirm
            title="确认拒单？"
            onConfirm={()=> {this.changeStatus(id,14,'服务商业务员拒绝工单，待平台服务员重新派单')}}
          >
            <Button 
              type="primary"
              // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            >拒单</Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===4&&(roleCode==='fac_manager'||roleCode==='fac_leader'||roleCode==='fac_service')){
      return (
        <div style={{textAlign:'center'}}>
          <Button 
            type="primary"
            // style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
            onClick={()=>{this.assign(id)}}
          >分配工程师</Button>
        </div>
      )
    }
    else if(status===5&&roleCode==='engineer'){
      return (
        <div style={{textAlign:'center'}}>
          <Button 
            type="primary"
            style={{marginRight:'12px'}}
            onClick={()=>{this.engineerAccept(id)}}
          >接单</Button>
          <Popconfirm
            title="确认拒单？"
            onConfirm={()=> {this.changeStatus(id,15,'工程师拒绝工单，待服务商重新派单')}}
          >
            <Button 
              type="primary"
              // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            >拒单</Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===6&&roleCode==='engineer'){
      return (
        <div style={{textAlign:'center'}}>
          <Link
            to={`/cbd/service/plan/${id}`}
            style={{marginRight:'12px'}}
          ><Button type="primary">备件申请</Button></Link>
          <Button 
            type="primary"
            // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            onClick={()=>{this.resultSubmit(id)}}
          >提交结果</Button>
               
        </div>
      )
    }
    else if(status===7&&roleCode==='fac_leader'){
      return (
        <div style={{textAlign:'center'}}>
          <Button 
            type="simple"
            style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            onClick={()=>{this.planApproval(id)}}
          >备件方案通过</Button>
          <Popconfirm
            title="确认该备件方案不通过？"
            onConfirm={()=> {this.changeStatus(id,16,'备件库管理员驳回备品备件方案，待工程师重新提交备品备件申请')}}
          >
            <Button 
              type="simple"
              style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            >备件方案不通过
            </Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===8&&roleCode==='user_leader'){
      return (
        <div style={{textAlign:'center'}}>
          <Button 
            type="simple"
            style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
            onClick={()=>{this.managerApproval(id)}}
          >备件方案通过</Button>
          <Popconfirm
            title="确认该备件方案不通过？"
            onConfirm={()=> {this.changeStatus(id,17,'用户负责人驳回备品备件方案，待工程师重新提交备品备件申请')}}
          >
            <Button 
              type="simple"
              style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            >备件方案不通过</Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===2&&(roleCode=='user_manager'||roleCode==='user_leader'||roleCode==='user_service')){
      return (
        <div style={{textAlign:'center'}}>
          <Popconfirm
            title="确定该工单通过审核？"
            onConfirm={()=> {this.changeStatus(id,3,'审核通过，待服务商接单')}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            >审核通过</Button>
          </Popconfirm>
          <Popconfirm
            title="确定该工单不通过审核？"
            onConfirm={()=> {this.changeStatus(id,1,'用户负责人审核工单未通过，工单已取消')}}
          >
            
            <Button 
              type="primary"
            >审核驳回</Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===10&&roleCode==='user_watcher'){
      return (
        <div style={{textAlign:'center'}}>
          {/* <Popconfirm
            title="确定维修完成？"
            onConfirm={()=> {this.changeStatus(id,11,'值机员确认，待用户负责人审核账单')}}
          >
            <Button 
              type="primary"
              // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            >确认完成</Button>
          </Popconfirm> */}
           <Button 
              type="primary"
              // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
              onClick={()=>{this.comment(id)}}
            >确认完成</Button>
        </div>
      )
    }
    else if(status===11&&roleCode==='user_leader'){
      return (
        <div style={{textAlign:'center'}}>
          <Button 
            type="primary"
            // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            onClick={()=>{this.pay(id)}}
          >立即支付</Button>
           <Button 
            type="primary"
            style={{marginLeft: 20}}
           // onClick={()=>{this.pay(id)}}
          >账单支付</Button>
        </div>
      )
    }
    else if(status===12&&roleCode==='user_watcher'){
      return (
        <div style={{textAlign:'center'}}>
          <Button 
            type="primary"
            // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            onClick={()=>{this.comment(id)}}
          >服务评价</Button>
        </div>
      
      )
    }
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
          this.getDetail(id);  
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
// 控制模态框显示
  showMapModal = () => {
    const {projectDetail}=this.state
    this.setState({
      mapVisible: true,
    });
    // 
    var mapDetail=[projectDetail.requestLatitude,projectDetail.requestLongitude]
    let mapInfo=(mapDetail[0]==null||mapDetail[1]==null)?[116.397428, 39.90923]:mapDetail
    var map = new AMap.Map('routeMap', {
      zoom:9,
      center: mapInfo,//中心点坐标
    });
    if(mapDetail[0]!==null||mapDetail[1]!==null){
      var marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: mapDetail
       });
      map.add(marker);
    }
   
  };
  //关地图
  closeMapModal = e => {
    console.log(e);
    this.setState({
      mapVisible: false,
    });
  };

  //加载图片
  getPicUrl=()=>{
    const{projectDetail,token}=this.state
    var detail={}
    detail.status=projectDetail.status
    detail.taskId=projectDetail.id
    axios({
      method: 'POST',
      url: '/mdmc/mdmcTask/getPictureByTaskIdAndStatus',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
      data:detail
    })
    .then((res) => {
        if(res && res.status === 200){ 
          var arr=[]  
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
       // message.info("您不具备该权限")
    });
  }
  //渲染图片
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
  //工程师信息
  getEngineer = (name, phone) =>{
    return (
      <>
        <Descriptions.Item label="工程师姓名" span={1.5}>{name && name || '--'}</Descriptions.Item>
        <Descriptions.Item label="工程师联系方式" span={1.5}>{phone && phone||'--'}</Descriptions.Item>
      </>
    )
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
  
render(){
  const {
    projectDetail,
    pmcDetail,
    userDetail,
    principleDetail,
    statusCode,
    assignDetail,
    engineerAcceptDetail,
    engineerDto,
    noteDetail,
    examine,
    planApprovalDetail,
    result,
    comment,
  }=this.state
  const {match : { params : { id } }} = this.props  
  return(
    <div className="bg">
      <Card>
      <Descriptions bordered size='small' className="descriptions">
        <Descriptions.Item label="工单编号" span={3}>{projectDetail.id}</Descriptions.Item>
        <Descriptions.Item label="维修任务名称" span={1.5}>{projectDetail.title&&projectDetail.title||'--'}</Descriptions.Item>
        <Descriptions.Item label="报修人电话" span={1.5}>{projectDetail.call&&projectDetail.call||'--'}</Descriptions.Item>
        <Descriptions.Item label="预约时间" span={1.5}>{projectDetail.appointTime&&projectDetail.appointTime||'--'}</Descriptions.Item>
        <Descriptions.Item label="截止时间" span={1.5}>{projectDetail.deadline&&projectDetail.deadline||'--'}</Descriptions.Item>
        <Descriptions.Item label="计划开始时间" span={1.5}>{projectDetail.scheduledStartTime||'--'}</Descriptions.Item>
        <Descriptions.Item label="计划结束时间" span={1.5}>{projectDetail.scheduledFinishTime||'--'}</Descriptions.Item>
        <Descriptions.Item label="紧急程度" span={1.5}>{ projectDetail.level===1?'不紧急':(projectDetail.level===2?'一般':(projectDetail.level===3?'紧急':'非常紧急'))}</Descriptions.Item>
        <Descriptions.Item label="审核人名称" span={1.5}>{principleDetail.userName&&principleDetail.userName||'--'}</Descriptions.Item>
        <Descriptions.Item label="状态" span={1.5}>{projectDetail.status&&this.setStatus(projectDetail.status)}</Descriptions.Item>
        <Descriptions.Item label="报修人名称" span={1.5}>{userDetail.userName&&userDetail.userName||'--'}</Descriptions.Item>
        {projectDetail.status>=6  && this.getEngineer(engineerDto.loginName,engineerDto.mobileNo)}   
        <Descriptions.Item label="预计花费" span={3}>{projectDetail.totalCost&&projectDetail.totalCost||'--'}</Descriptions.Item>
        <Descriptions.Item label="图片预览" span={3}>
          {this.getImage()}
        </Descriptions.Item>
        <Descriptions.Item label="地理位置" span={3}>
          <Button onClick={this.showMapModal}>查看</Button>
          <div className="path-map" style={{ display: (this.state.mapVisible === true) ? "" : "none" }} >
            <Icon className="path-map-icon" type="close-circle" onClick={this.closeMapModal} />
            <div style={{ width: '400px', height: '250px' }} id="routeMap"></div>
          </div>
        </Descriptions.Item>
      </Descriptions>
      <Divider>工程师反馈信息</Divider>
      <Descriptions bordered size='small' className="descriptions">
        <Descriptions.Item label="实际开始时间" span={1.5}>{projectDetail.actualStartTime&&projectDetail.actualStartTime||'--'}</Descriptions.Item>
        <Descriptions.Item label="实际结束时间" span={1.5}>{projectDetail.actualFinishTime&&projectDetail.actualFinishTime||'--'}</Descriptions.Item>
        <Descriptions.Item label="故障产生原因" span={1.5}>{projectDetail.troubleReason&&projectDetail.troubleReason||'--'}</Descriptions.Item>
        <Descriptions.Item label="故障维修结果" span={1.5}>{projectDetail.result&&projectDetail.result||'--'}</Descriptions.Item> 
        <Descriptions.Item label="故障维修建议" span={1.5}>{projectDetail.suggestion&&projectDetail.suggestion||'--'}</Descriptions.Item>
        <Descriptions.Item label="作业超时原因" span={1.5}>{projectDetail.delayReason&&projectDetail.delayReason||'--'}</Descriptions.Item> 
      </Descriptions>
      {this.getFunction(id,projectDetail.status)}
      <div style={{textAlign:'right'}}>       
        {/* {projectDetail.projectId&& <Link to={`/cbd/pro/project/detail/${projectDetail.projectId}`} style={{marginRight:'5px'}}>查看项目</Link>}    */}
        {projectDetail.projectId &&
        <Button  
                  type="primary"
                  // style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                  onClick={() => {
                    this.showProjectDetail();
                  }}
              >查看关联项目</Button>}
        <Button type="primary" onClick={()=>this.props.history.goBack()} style={{marginLeft:10}}><Icon type='arrow-left'/>返回列表</Button>
        {/* <Link to={`/cbd/maintain/data`} >返回上一级</Link> */}
        {/* {projectDetail.contract&&<Link to={`/cbd/pro/contract/detail/${projectDetail.contractId}`} style={{marginRight:'5px'}}>查看合同</Link>} */}
      </div>
      </Card>
      <div>
        <Modal
          title="备品备件审核"
          visible={this.state.planApprovalVisible}
          onOk={this.planApprovalOk}
          onCancel={this.planApprovalCancel}
        >
          <Approval setApproval={(form)=>{this.form = form}}  planApprovalDetail={planApprovalDetail}/>
        </Modal>
        <Modal
          title="分配工程师"
          visible={this.state.assignVisible}
          onOk={this.assignOk}
          onCancel={this.assignCancel}
        >
         <Assign setAssign={(form)=>{this.form = form}} assignDetail={assignDetail}/>
        </Modal>
        <Modal
          title="任务评估反馈"
          visible={this.state.engineerAcceptVisible}
          onOk={this.engineerAcceptOK}
          onCancel={this.engineerAcceptCancel}
        >
          <Level setLevel={(form)=>{this.form = form}} engineerAcceptDetail={engineerAcceptDetail}/>
        </Modal>
        <Modal
          title="备品备件审核"
          visible={this.state.managerApprovalVisible}
          onOk={this.managerApprovalOK}
          onCancel={this.managerApprovalCancel}
        >
          <Note setNote={(form)=>{this.form = form}} noteDetail={noteDetail}/>
        </Modal>
        <Modal
          title="提交结果"
          visible={this.state.resultVisible}
          onOk={this.resultOk}
          onCancel={this.resultCancel}
          okText="结束并提交"
          cancelText="取消"
        >
          <Result setSubmit={(form)=>{this.form = form}}  result={result}/>
        </Modal>
        <Modal
          title="验收"
          visible={this.state.examineVisible}
          onOk={this.examineOk}
          onCancel={this.examineCancel}
        >
          {/* <Examine setExamine={(form)=>{this.form = form}}  examine={examine}/> */}
        </Modal>
        <Modal
          title="验收评价"
          visible={this.state.commentVisible}
          onOk={this.commentOk}
          onCancel={this.commentCancel}
        >
          <Comment setComment={(form)=>{this.form = form}}  comment={comment}/>
        </Modal>
      </div>  
      <Drawer
        title='工单关联项目详情'
        width={1000}
        destroyOnClose={true}
        onClose={this.onClose}
        visible={this.state.visible}
      >
        <ProjectDetail
          projectId={projectDetail.projectId}
          onClose={this.onClose}
        />
      </Drawer>
    </div>
  )
}
 //备件库管理员处理后，待用户管理员审核
 managerApproval=(record)=>{
   var info={}
   info.id=record
   this.setState({
     managerApprovalVisible:true,
     noteDetail:info
   })
 }
//获取工程师信息
assign=(record)=>{
  var info={}
  info.id=record
  console.log(info)
  this.setState({
    assignVisible:true,
    assignDetail:info
  })
}

//提交方案modal框
showModal = () => {
  this.setState({    
    visible: true,
  });
};

//工程师接单
engineerAccept=(id)=>{
  var info={}
  info.id=id
  this.setState({
    engineerAcceptVisible:true,
    engineerAcceptDetail:info
  })
}

//服务商审批备品备件
planApproval=(id)=>{
  this.setState({ planApprovalVisible:true})
  axios({
    method: 'GET',
    url: '/rdc/deviceOrder/all/object/'+id+'/'+1,
    headers: {
      'deviceId': this.deviceId,
      'Authorization':'Bearer '+this.state.token,
    },
  })
    .then((res) => {
      if(res && res.status === 200){
        var response=res.data.result
        var info={}
        info.id=response.deviceOrderList[0].deviceOrder.id
        info.objectType=1
        //  info.objectId=res.deviceOrderList[0].deviceOrder.id
        this.setState({planApprovalDetail:info})
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
//提交结果，获取已填部分
resultSubmit(id){
  this.setState({resultVisible:true})
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
        this.setState({result:res.data.result})
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//获取文件
getAttachments(fileList) {
  console.log(fileList)
  var res = [];
  var size = fileList.length;
  for (var i=0; i<size; i++) {
    var attachmentId = fileList[i].response[0].attachmentId;
    res.push(attachmentId);
  }
  return res;
}

//确认提交
resultOk = e =>{
  this.setState({
    resultVisible: false,
  });
  const values = this.form.getFieldsValue() 
  console.log(values)
  if (null==values.id) {
    message.error('请输入工单编号');
    return;
  }
  if (null==values.troubleReason) {
    message.error('请输入故障原因');
    return;
  }
  if (null==values.result) {
    message.error('请输入维修结果');
    return;
  }
  if (null==values.suggestion) {
    message.error('请输入维修建议');
    return;
  }
  if (null==values.actualStartTime) {
    message.error('请输入维修建议');
    return;
  }
  if (null==values.actualFinishTime) {
    message.error('请输入维修建议');
    return;
  }
  if (values.attachmentIdList != undefined) {
    var fileList = values.attachmentIdList.fileList;
    console.log(fileList)
    values.attachmentIdList = this.getAttachments(fileList);
  }
  values.status = 10
  // values.actualFinishTime=moment().format('YYYY-MM-DD HH:mm:ss')
  values.actualStartTime=values.actualStartTime.format('YYYY-MM-DD HH:mm:ss')
  values.actualFinishTime=values.actualFinishTime.format('YYYY-MM-DD HH:mm:ss')
  var id=values.id
  axios({
    contentType:'application/json',
    method: 'POST',
    url: '/mdmc/mdmcTask/save',
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
//取消提交
resultCancel = e => {
  console.log(e);
  this.setState({
    resultVisible: false,
  });
};
//验收模态框，获取已知信息
examine(id){
  this.setState({examineVisible:true})
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
        this.setState({examine:res.data.result})
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//评论模态框，获取已知信息
comment(id){ 
  this.setState({commentVisible:true})
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
        var receive={}
        receive.taskId=res.data.result.id
        receive.userId=res.data.result.userId
        receive.principleId=res.data.result.principleId
        this.setState({comment:receive})
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//提交评论信息
commentOk = e =>{
  this.setState({
    commentVisible: false,
  });
  const values = this.form.getFieldsValue() 
  values.status=11
  var id=values.taskId
  if (values.taskId === undefined || values.taskId === null) {
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
    url: '/mdmc/mdmcReview/save',
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

//指定工程师模态框
assignOk=e=>{
  this.setState({
    assignVisible:false
  })
  const values = this.form.getFieldsValue() 
  console.log(values.maintainId)
  values.status=5
  values.deadline=this.form.getFieldValue('deadline').format('YYYY-MM-DD HH:mm:ss')
  var id=values.id
  axios({
    contentType:'application/json',
    method: 'POST',
    url: '/mdmc/mdmcTask/save',
    headers: {
      'deviceId': this.deviceId,
      'Authorization':'Bearer '+this.state.token,
    },
    data:values
  })
    .then((res) => {
      if(res && res.status === 200){
        alert('提交成功')
        this.getDetail(id);  
      }
    })
    .catch(function (error) {
      console.log(error);
    });

}
//取消指定
assignCancel=e=>{
  this.setState({
    assignVisible:false
  })
}

//工程师指定等级
engineerAcceptOK=()=>{
  this.setState({engineerAcceptVisible:false})
  const values = this.form.getFieldsValue();
  const { getFieldValue } = this.form;
  values.status=6
  // values.actualStartTime=moment().format('YYYY-MM-DD HH:mm:ss')
  values.scheduledStartTime=getFieldValue('scheduledStartTime').format('YYYY-MM-DD HH:mm:ss');
  values.scheduledFinishTime=getFieldValue('scheduledFinishTime').format('YYYY-MM-DD HH:mm:ss')
  var id=values.id
  axios({
    contentType:'application/json',
    method: 'POST',
    url: '/mdmc/mdmcTask/save',
    headers: {
      'deviceId': this.deviceId,
      'Authorization':'Bearer '+this.state.token,
    },
    data:values
  })
    .then((res) => {
      if(res && res.status === 200){
        alert('提交成功')
        this.getDetail(id);  
      }
    })
    .catch(function (error) {
      console.log(error);
    });

}

//工程师取消modal框
engineerAcceptCancel=()=>{
  this.setState({
    engineerAcceptVisible:false
  })
}

//用户支付流程
pay=(id)=>{
  alert("支付完成")
  this.changeStatus(id,13,'用户负责人支付完成，工单结束')
}

//备品备件服务商审批
planApprovalOk=()=>{
  this.setState({planApprovalVisible:false})
  const values=this.form.getFieldsValue()
  values.objectId=values.id
  values.status=1
  var id=values.id
  axios({
    contentType:'application/json',
    method: 'POST',
    url: '/rdc/deviceOrder/operation',
    headers: {
      'deviceId': this.deviceId,
      'Authorization':'Bearer '+this.state.token,
    },
    data:values
  })
    .then((res) => {
      if(res && res.status === 200){
        alert('提交成功')
        this.getDetail(id);  
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
//备品备件用户审核意见确认
managerApprovalOK=()=>{
  this.setState({managerApprovalVisible:false})
  const values = this.form.getFieldsValue() 
  values.status=6
  var id=values.id
  axios({
    contentType:'application/json',
    method: 'POST',
    url: '/mdmc/mdmcTask/save',
    headers: {
      'deviceId': this.deviceId,
      'Authorization':'Bearer '+this.state.token,
    },
    data:values
  })
    .then((res) => {
      if(res && res.status === 200){
        alert('提交成功')
        this.getDetail(id);  
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//备品备件审核取消
planApprovalCancel=()=>{
  this.setState({
    planApprovalVisible:false
  })
}
//备品备件用户审核取消
managerApprovalCancel=()=>{
  this.setState({
    managerApprovalVisible:false
  })
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
export default MdmcTaskDetail