import React,{Component} from 'react'
import {Card,Table,Input,Button,Select,Modal,message,DatePicker,Popover} from 'antd'
import {formatDate} from '../../utils/dateUtils'
import {reqExceptions} from '../../axios/index.js'
import moment from 'moment';
import 'moment/locale/zh-cn';

const RangePicker = DatePicker.RangePicker
export default class Exception extends Component{

  state = {
    exceptions:[], //当前页的异常数组
    exception:{}, //当前选中异常
    total:0,//角色总条数
    loading:false, //是否正在加载中
    searchCreator:'', //搜索操作人
    searchCause:'', //搜索异常原因
    searchStack:'',//搜素异常栈信息
    startQueryTime:undefined,//搜索开始日期
    endQueryTime:undefined//搜索截至日期
  }

  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },{
        title:'异常ID',
        dataIndex:'id',
        width:180
      }, 
      {
        title:'系统名称',
        dataIndex:'applicationName',
        width:200
      },
      {
        title:'异常名称',
        dataIndex:'exceptionSimpleName',
        width:270
      },
      {
        title:'操作人',
        dataIndex:'creator',
        width:150
      },
      {
        title:'操作时间',
        dataIndex:'createTime',
        width:170,
        render:formatDate
      },
      {
        title:'异常栈',
        dataIndex:'exceptionStack',
        width:250,
        ellipsis: true,
        render:(exceptionStack) => {
          return (
            <Popover
              content={exceptionStack}
            >
              {exceptionStack}
            </Popover>
          )
        }
      },
      {
        title:'异常信息',
        dataIndex:'exceptionMessage',
        width:250,
        ellipsis: true
      },
      {
        title:'异常原因',
        dataIndex:'exceptionCause',
        width:250,
        ellipsis: true
      },
      {
        title:'操作',
        width:100,
        fixed:'right',
        render: (exception) => {
          return (
            
            <Button type="danger">下载</Button>
            
          )
        }
      },
    ]
  }

  // forceLogout = async (user) => {
  //   Modal.confirm({
  //     title:`确认强制退出${user.userName}吗？`,
  //     onOk: async () => {
  //       const result = await reqForceLogout(user.accessToken)
  //       if(result.code===200){
  //         message.success('用户强制退出成功')
  //         this.resetSearch()
  //         this.getUsers(1)
  //       }
  //     }
  //   })
    
  // }

  getExceptions = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading:true})
    const {searchCreator,searchCause,searchStack,startQueryTime,endQueryTime} = this.state
    
    const dataPost = {
      "pageNum": `${pageNum}`,
      "pageSize": 10,
      "creator": `${searchCreator}`,
      "exceptionCause": `${searchCause}`,
      "exceptionStack": `${searchStack}`,
      "startQueryTime":`${startQueryTime===undefined?'':startQueryTime}`,
      "endQueryTime":`${endQueryTime===undefined?'':endQueryTime}`
    }
    const result = await reqExceptions(dataPost)
    if(result.code===200){
      this.setState({loading:false})
       
      const exceptions = result.result.list
      const total = result.result.total*1
      this.setState({exceptions,total})
    }
  }

  resetSearch = () => {
    const searchCreator = ''
    const searchCause = ''
    const searchStack = ''
    const startQueryTime = undefined
    const endQueryTime = undefined
    this.setState({searchCreator,searchCause,searchStack,startQueryTime,endQueryTime},()=> {
      this.getExceptions(1)
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getExceptions(1)
  }

  render(){
    const {exceptions,exception,total,loading,searchCreator,searchCause,searchStack,startQueryTime,endQueryTime} = this.state
  
    const title = (
      <span>
        <RangePicker 
          placeholder={['开始日期','结束日期']}
          showTime
          onChange={(value) => this.setState({startQueryTime:value[0].format("YYYY-MM-DD HH:mm:ss"),endQueryTime:value[1].format("YYYY-MM-DD HH:mm:ss")})}
          value={startQueryTime===''||startQueryTime===undefined||endQueryTime===''||endQueryTime===undefined?null:[moment(startQueryTime),moment(endQueryTime)]}
        />
        <Input placeholder="操作人" style={{width:150,margin:'0 15px'}} value={searchCreator} onChange={event => this.setState({searchCreator:event.target.value})}/>
        <Input placeholder="异常原因" style={{width:150,margin:'0 15px'}} value={searchCause} onChange={event => this.setState({searchCause:event.target.value})}/>
        <Input placeholder="异常信息" style={{width:150,marginRight:'15px'}} value={searchStack} onChange={event => this.setState({searchStack:event.target.value})}/>
        <Button type="primary" icon="search" onClick={() => {this.getExceptions(1)}} style={{marginRight:'15px'}}>搜索</Button>
        <Button type="default" onClick={() => {this.resetSearch()}}>重置</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          size='small'
          loading={loading}
          rowKey="id"
          dataSource={exceptions}
          columns={this.columns}
          scroll={{ x: 1500 }}
          pagination={{
            current:this.pageNum,
            defaultPageSize:10,
            showQuickJumper:true,
            total:total,
            onChange:this.getExceptions,
          }}
        />
      </Card>
    )
  }
}