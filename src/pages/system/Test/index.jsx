import React,{Component,} from 'react'
import { Button,Row,Col,Table,Input,Popconfirm,message,Modal,Card  } from 'antd';
import { Link } from 'react-router-dom'
import Confirm from './confirm'
import Result from './result'
import Comment from './comment'
import Assign from './assign'
import Level from './level'
import Note from './note'
import Approval from './approval'
import moment from 'moment';
import axios from 'axios';
import items from '../../../config/status'
import { platform } from 'os';
import { copyFileSync } from 'fs';

const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;
class Test extends Component{
  constructor(props){
    super(props)
    this.state={
      id:window.localStorage.getItem('id'),
      token:window.localStorage.getItem('token'),
      role:'',
      status:null,
      statusMsg:'',
      roleCode:window.localStorage.getItem('roleCode'),
      current: FIRST_PAGE,
      size: PAGE_SIZE,
      total:20,
      // total: 20, 
      nowCurrent:FIRST_PAGE,
      data:[],
      visible: false,
      chooseid:'',
      result:{},
      comment:{},//值机员评价
      assignDetail:{},//分配工程师
      detail:{},
      engineerAcceptDetail:{},//工程师接单定级
      noteDetail:{},//用户备件审核意见
      planApprovalDetail:{}, //服务商进行计划审批
      commentVisible:false,
      resultVisible:false,
      assignVisible:false,
      engineerAcceptVisible:false,
      managerApprovalVisible:false,
      planApprovalVisible:false,
    }
    this.getInfo=this.getInfo.bind(this)
  }
  componentDidMount(){
    this.getInfo(FIRST_PAGE)
  }

  //根据不同的路由，加载不同的信息
  getInfo(page){
    var location=this.props.location.pathname
    var status
 
    if(location=='/cbd/maintain/data'){
    
      status=null
    }
    else if(location==='/cbd/maintain/data/serverWait'){
      status=3
    }
    else if(location==='/cbd/maintain/data/billApproval'){
      status=7
    }
    else if(location==='/cbd/maintain/data/maintainerWait'){
      status=5
    }
    else if(location==='/cbd/maintain/data/planConfirm'){
      status=6
    }
    else if(location==='/cbd/maintain/data/assign'){
      status=4
    }
    else if(location==='/cbd/maintain/data/orderApproval'){
      status=2
    }
    else if(location==='/cbd/maintain/data/planApproval'){
      status=8
    }
    else if(location==='/cbd/maintain/data/serviceFinish'){
      status=10
    }
    // else if(location==='/cbd/maintain/data/orderSubmit'){
    //   status=2
    // }
    else if(location==='/cbd/maintain/data/serviceFinish'){
      status=13
    }
    else if(location==='/cbd/maintain/data/pay'){
      status=11
    }
    else if(location==='/cbd/maintain/data/comment'){
      status=12
    }
    else if(location==='/cbd/maintain/data/finish'){
      status=13
    }
    console.log(status)
    const { size, } = this.state;
    const values={orderBy: "appointTime",pageSize:size,pageNum:page,id:this.state.id,roleCode:this.state.roleCode,status:status}
    console.log(values);
    axios({
      method: 'POST',
      url: '/mdmc/mdmcTask/getTaskList',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:values
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res)
          this.setState({
            data: res.data.result.list,
            nowCurrent:res.data.result.pageNum,
            status:status,
            total:res.data.result.total
            // roleCode:roleCode,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
      // axios({
      //   method: 'GET',
      //   url: '/mdmc/mdmcTask/getTaskCountByUserId?userId='+this.state.id,
      //   headers: {
      //     'deviceId': this.deviceId,
      //     'Authorization':'Bearer '+this.state.token,
      //   },
      // }).then((res) => {
      //   if(res && res.status === 200){
      //     console.log(res)
      //     this.setState({
      //       total:res.data.result
      //     });
      //   }
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });
  }
  //返回不同的状态按钮
  getFunction(record,status,roleCode){
    if(status===3){
      return (
        <div>
          <Popconfirm
            title="确认接单？"
            onConfirm={()=> {this.changeStatus(record.id,4,'审核通过，待服务商接单')}}
          >
            <Button 
              type="simple"
              style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
              // onClick={()=>{this.providerAccept(record.id)}}
            >接单</Button>
          </Popconfirm>
          <Popconfirm
            title="确认拒单？"
            onConfirm={()=> {this.changeStatus(record.id,14,'服务商业务员拒绝工单，待平台服务员重新派单')}}
          >
            <Button 
              type="simple"
              style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            //  onClick={()=>{this.providerRefuse(record.id)}}
            >拒单</Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===4){
      return (
        <div>
          <Button 
            type="simple"
            style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
            onClick={()=>{this.assign(record.id)}}
          >分配工程师</Button>
          {/* <Button 
              type="simple"
              style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
              onClick={()=>{this.changeStatus(record.id,15,'维修工拒绝工单')}}
              >拒单</Button> */}
        </div>
      )
    }
    else if(status===5){
      return (
        <div>
          <Button 
            type="simple"
            style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
            onClick={()=>{this.engineerAccept(record.id)}}
          >接单</Button>
          <Popconfirm
            title="确认拒单？"
            onConfirm={()=> {this.changeStatus(record.id,15,'工程师拒绝工单，待服务商重新派单')}}
          >
            <Button 
              type="simple"
              style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
              // onClick={()=>{this.engineerRefuse(record.applicantId)}}
            >拒单</Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===6){
      return (
        <div>
          <Link
            to={`/cbd/service/plan/${record.id}`}
            style={{marginRight:'12px'}}
          >备件申请</Link>
          <Button 
            type="simple"
            style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            onClick={()=>{this.resultSubmit(record.id)}}
          >提交结果</Button>
              
        </div>
      )
    }
    else if(status===7){
      return (
        <div>
          <Button 
            type="simple"
            style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            onClick={()=>{this.planApproval(record.id)}}
          >备件方案通过</Button>
          <Popconfirm
            title="确认该备件方案不通过？"
            onConfirm={()=> {this.changeStatus(record.id,16,'备件库管理员驳回备品备件方案，待工程师重新提交备品备件申请')}}
          >
            <Button 
              type="simple"
              style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
              //  onClick={()=>{this.planRefuse(record.id)}}
            >备件方案不通过
            </Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===8){
      return (
        <div>
          <Button 
            type="simple"
            style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
            onClick={()=>{this.managerApproval(record.id)}}
          >备件方案通过</Button>
          <Popconfirm
            title="确认该备件方案不通过？"
            onConfirm={()=> {this.changeStatus(record.id,17,'用户负责人驳回备品备件方案，待工程师重新提交备品备件申请')}}
          >
            <Button 
              type="simple"
              style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            //  onClick={()=>{this.managerRefuse(record.id)}}
            >备件方案不通过</Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===2&&(roleCode=='user_manager'||roleCode==='user_leader'||roleCode==='user_service')){
      return (
        <div>
          <Popconfirm
            title="确定该工单通过审核？"
            onConfirm={()=> {this.changeStatus(record.id,3,'审核通过，待服务商接单')}}
          >
            <Button 
              type="primary"
              style={{marginRight:'12px'}}
            //  onClick={()=>{this.orderApproval(record.id)}}
            >审核通过</Button>
          </Popconfirm>
          <Popconfirm
            title="确定该工单不通过审核？"
            onConfirm={()=> {this.changeStatus(record.id,1,'用户负责人审核工单未通过，工单已取消')}}
          >
            <Button 
              type="primary"
              // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
            //  onClick={()=>{this.orderRefuse(record.id)}}
            >审核驳回</Button>
          </Popconfirm>
        </div>
      )
    }
    else if(status===10){
      return (
        <Popconfirm
          title="确定维修完成？"
          onConfirm={()=> {this.changeStatus(record.id,11,'值机员确认，待用户负责人审核账单')}}
        >
          <Button 
            type="primary"
            // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
          //    onClick={()=>{this.confirmFinish(record.id)}}
          >确认完成</Button>
        </Popconfirm>
      )
    }
    else if(status===11){
      return (
        <Button 
          type="primary"
          // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
          onClick={()=>{this.pay(record.id)}}
        >支付</Button>
      )
    }
    else if(status===12){
      return (
        <Button 
          type="primary"
          // style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
          onClick={()=>{this.comment(record.id)}}
        >评价</Button>
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
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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

  //确认提交
  resultOk = e =>{
    this.setState({
      resultVisible: false,
    });
    const values = this.form.getFieldsValue() 
    values.status = 10
    console.log(values)
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
          this.getInfo(FIRST_PAGE)
          //   this.changeStatus(res.data.result.id,8,'维修工提交维修结果，待服务商审核维修结果')
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
    values.status=13
    console.log(values)
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
          // this.changeStatus(res.data.result.taskId,13,'值机员评价完成，订单完成')
          this.getInfo(FIRST_PAGE)
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
    this.setState({assignVisible:false})
    const values = this.form.getFieldsValue()
    values.status=5
    values.deadline=this.form.getFieldValue('deadline').format('YYYY-MM-DD HH:mm:ss')
    console.log(values)
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
          this.getInfo(FIRST_PAGE)
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
    const values = this.form.getFieldsValue() 
    values.status=6
    console.log(values)
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
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  
  }

  //工程师取消modal框
  engineerAcceptCancel=()=>{
    this.setState({
      planApprovalVisible:false
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
    console.log(values)
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
          this.getInfo(FIRST_PAGE)
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
          this.getInfo(FIRST_PAGE)
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
  //获取状态数值
  setStatus=(status)=>{
    var msg=this.getStatusInfo(status)
    let statusMsg=msg.name
    return statusMsg
  }

  getStatusInfo=(status)=>{
    var a=items.find(item => {    
      return item.status === status;
    })
    return a
  }
  
  render(){
    const {
      data,
      nowCurrent,
      size, 
      total,
      status,
      roleCode,
      detail,
      result,
      comment,
      assignDetail,
      engineerAcceptDetail,
      noteDetail,
      planApprovalDetail,
    } = this.state;
    const current = nowCurrent+1
    const limit = size


    return(
      <div>
        <Table
          className="group-list-module"
          bordered
          size='small'
          scroll={{ x: 1000 }}
          showHeader={true}
          pagination={{
            defaultCurrent:1,
            total:this.state.total,
            current:this.state.current,
            pageSize: limit,
            onChange: (page,pageSize)=>{
              console.log('current page:',page)
              this.setState({
                current:page
              })
              this.getInfo(page);
            },
            // showTotal: () => `共${allCount} 条数据`
          }}
          rowClassName={this.setRowClassName}
          dataSource={data}
          columns={[
            {
              title:'序号',
              width:50,
              fixed:'left',
              render:(text,record,index)=> `${index+1}`,
            },
            {
              title: '任务名称',
              key: 'title',
              render: (text, record) => {
                return (record.title && record.title) || '--'
              }
            }, {
              title: '任务ID ',
              key: 'id',
              width:180,
              render: (text, record) => {
                return ((record.id && record.id) || '--')
              }   
            },{
              title: '创建时间',
              key: 'createdTime',
              render: (text, record) => {
                return (record.createdTime && record.createdTime)|| '--'
              }
            },
            {
              title: '截止时间',
              key: 'deadline',
              render: (text, record) => {
                return (record.deadline && record.deadline) || '--'
              }
            },{
              title: '状态',
              key: 'status',
              render: (text, record) => {
                return (record.status && this.setStatus(record.status))|| '--'
              }
            },
            {
              title: '紧急程度',
              key: 'level',
              render: (text, record) => {
                return (record.level && record.level===1?'不紧急':(record.level===2?'一般':(record.level===3?'紧急':'非常紧急'))) || '--'
              }
            },
            {
              title: '操作',
              fixed:'right',
              render: (text, record, index) => (
                <div className="operate-btns"
                  style={{ display: 'block',width:'140px' }}
                >
                  <Link
                    to={`/cbd/service/sub/${record.id}`}
                    style={{marginRight:'12px'}}
                  >任务子项</Link>                
                  <Link
                    to={`/cbd/service/log/${record.id}`}
                    style={{marginRight:'12px'}}
                  >任务日志</Link>
                  <br/>
                  <Link
                    to={`/cbd/service/spare/${record.id}`}
                    style={{marginRight:'12px'}}
                  >备品备件</Link>
                  <Link
                    to={`/cbd/service/detail/${record.id}`}
                    style={{marginRight:'12px'}}
                  >详情</Link>
                </div>
              ),
            }]}
        />
        {/* </Card> */}
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
          title="工程师定级"
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
          title="评价"
          visible={this.state.commentVisible}
          onOk={this.commentOk}
          onCancel={this.commentCancel}
        >
          <Comment setComment={(form)=>{this.form = form}}  comment={comment}/>
        </Modal>
      </div>  
    )
  }
}
export default Test;