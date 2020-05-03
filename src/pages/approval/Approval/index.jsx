import React, { Component, } from 'react';
import { Table ,Button,Modal} from 'antd';
import LinkButton from '../../../components/link-button'
import axios from 'axios';
import moment from 'moment';
import {formatDate} from '../../../utils/dateUtils'
import {reqTasked,reqOrderInfo} from '../../../axios/index'
import OrderForm from './order-form'
const FIRST_PAGE = 1;
const PAGE_SIZE = 10;
//const user_id = window.sessionStorage.getItem("user_id");
class Approved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      taskeds:[],
      tasked:{},
      total: 0,     
      isShowComment:false,
      orderInfo:{}
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
        dataIndex:'processName'
      },
      {
        title:'任务名称',
        dataIndex:'taskName'
      },
      {
        title:'创建时间',
        dataIndex:'createTime',
        render:formatDate
      },
      {
        title:'结束时间',
        dataIndex:'endTime',
        render:formatDate
      },
      {
        title:'工单ID',
        dataIndex:'orderId'
      },
      {
        title:'流程定义ID',
        dataIndex:'processDefinitionId',
        width:180
      },
      {
        title:'审核状态',
        width:200,
        fixed:'right',
        dataIndex:'state'
      },
      {
        title:'操作',
        width:300,
        fixed:'right',
        render: (tasked) => {
          return (
            <span>
              <Button type="primary" onClick={() => this.getInfo(tasked)} style={{marginRight:20}}>查看批注</Button>
              {/* <Button type="primary" onClick={() => this.getImage()}>查看流程图</Button> */}
            </span>
            
          )
        }
      }
    ]
  }

  getInfo = async (tasked) => {
    const orderId = tasked.orderId
    console.log(orderId)
    const result = await reqOrderInfo(orderId)
    if(result.code===200){
      this.setState({orderInfo:result.result,tasked:tasked})
      this.setState({isShowComment:true})
    }
  }

  getTaskedList = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading:true})
    
    const loginAfter = JSON.parse(window.localStorage.getItem('loginAfter'))
 
    const userId = loginAfter.loginAuthDto.userId
    
    const dataPost = {
      userid:userId,
      pageNum:pageNum,
      pageSize:10
    }
 
    const result = await reqTasked(dataPost)
    if(result.code===200){
      this.setState({loading:false})
      
      const taskeds = result.result.list
      const total = result.result.total
      this.setState({taskeds,total})
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount(){
    this.getTaskedList(1);
  }


  render() {
    const {loading,taskeds,total,isShowComment,tasked,orderInfo} = this.state;
    return (
      <div>
        <Table
          bordered
          loading={loading}
          rowKey="id"
          size='small'
          dataSource={taskeds}
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            defaultPageSize:10,
            showQuickJumper:true,
            total:total,
            onChange:this.getTaskedList,
          }}
        />
        <Modal
          title="查看批注"
          visible={isShowComment}
          onCancel={() => {this.setState({isShowComment:false,tasked:{}});this.form.resetFields()}}
          cancelText="关闭"
        >
          <OrderForm
            setForm={(form)=>{this.form = form}}
            tasked={tasked}
            orderInfo={orderInfo}
          />
        </Modal>
      </div>

    );
  }
}

export default Approved;

