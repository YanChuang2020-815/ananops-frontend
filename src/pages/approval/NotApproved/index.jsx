import React, { Component, } from 'react';
import { Button,Table,Modal,message } from 'antd';
import {reqExamines,reqOrderInfo,reqDisagree,reqAgree} from '../../../axios/index'
import {formatDate} from '../../../utils/dateUtils'
import OrderForm from './order-form'

class NotApproved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      examines:[],
      examine:{},
      total: 0,     
      orderInfo:{}, //工单信息
      isShowExamine:false,
    };
   
  }

  initColumns = () => {
    this.columns = [
      {
        title:'任务ID',
        dataIndex:'taskId'
      },
      {
        title:'实例ID',
        dataIndex:'processInstanceId'
      },
      {
        title:'发起人ID',
        dataIndex:'startUser'
      },
      {
        title:'流程名称',
        dataIndex:'processName',
        width:180
      },
      {
        title:'任务名称',
        dataIndex:'taskName',
        width:180
      },
      {
        title:'创建时间',
        dataIndex:'createTime',
        render:formatDate,
        width:180
      },
      {
        title:'工单ID',
        dataIndex:'orderId',
        width:180
      },
      {
        title:'流程定义ID',
        dataIndex:'processDefinitionId',
        width:180
      },
      {
        title:'操作',
        width:300,
        fixed:'right',
        render: (examine) => {
          return (
            <span>
              <Button type="primary" onClick={() => this.getInfo(examine)} style={{marginRight:20}}>审批</Button>
              {/* <Button type="primary" onClick={() => this.getImage()}>查看流程图</Button> */}
            </span>
            
          )
        }
      }
    ]
  }
 
  getInfo = async (examine) => {
    const orderId = examine.orderId
    console.log(orderId)
    const result = await reqOrderInfo(orderId)
    if(result.code===200){
      this.setState({orderInfo:result.result,examine:examine})
      this.setState({isShowExamine:true})
    }
  }
  
 getExamineList = async (pageNum) => {
   this.pageNum = pageNum
   this.setState({loading:true})
   
   const loginAfter = JSON.parse(window.localStorage.getItem('loginAfter'))

   const userId = loginAfter.loginAuthDto.userId
   
   const dataPost = {
     userid:userId,
     pageNum:pageNum,
     pageSize:10
   }

   const result = await reqExamines(dataPost)
   if(result.code===200){
     this.setState({loading:false})
     
     const examines = result.result.list
     const total = result.result.total
     this.setState({examines,total})
   }else{
     this.setState({loading:false})
     message.error('获取审批列表失败')
   }
 }

 refuse = async () => {
  
   const info = this.form.getFieldsValue()
   const dataPost = {
     comment:info.comment,
     taskId:this.state.examine.taskId
   }

   const result = await reqDisagree(dataPost)
   if(result.code==200){
     this.form.resetFields()
     this.setState({isShowExamine:false,examine:{}})
     this.getExamineList(1)
   }

 }

 accept = async () => {
   const info = this.form.getFieldsValue()
   const dataPost = {
     comment:info.comment,
     taskId:this.state.examine.taskId,
     userid:782525013398923265
   }

   const result = await reqAgree(dataPost)
   if(result.code==200){
     this.form.resetFields()
     this.setState({isShowExamine:false,examine:{}})
     this.getExamineList(1)
   }
 }

 componentWillMount() {
   this.initColumns()
 }

 componentDidMount(){
   this.getExamineList(1)
 }

 
 render() {
   const {loading,examines,examine,total,isShowExamine,orderInfo} = this.state;
   return (
     <div>
       <Table
         bordered
         loading={loading}
         rowKey="processInstanceId"
         dataSource={examines}
         size='small'
         columns={this.columns}
         pagination={{
           current:this.pageNum,
           defaultPageSize:10,
           showQuickJumper:true,
           total:total,
           onChange:this.getExamineList,
         }}
       />
       <Modal
         title="审批"
         visible={isShowExamine}
         footer={
           <span>
             <Button type="default" onClick={() => {this.setState({isShowExamine:false,examine:{}});this.form.resetFields()}}>取消</Button>
             <Button type="primary" onClick={this.refuse}>不通过</Button>
             <Button type="primary" onClick={this.accept}>通过</Button>
           </span>
         }
       >
         <OrderForm
           setForm={(form)=>{this.form = form}}
           order={orderInfo}
           examine={examine}
         />
       </Modal>
     </div>

   );
 }
}

export default NotApproved;

