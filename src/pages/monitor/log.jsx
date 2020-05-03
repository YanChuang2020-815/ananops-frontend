import React,{Component} from 'react'
import {Card,Table,Input,Button} from 'antd'
import {formatDate} from '../../utils/dateUtils'
import {reqLogs} from '../../axios/index'


export default class Log extends Component{

  state = {
    logs:[], //当前页的日志数组
    total:0,//日志总条数
    loading:false, //是否正在加载中
    searchLoginIp:'', //搜索登录名
    searchLoginLocation:'', //搜索用户名
  }

  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },{
        title:'日志ID',
        dataIndex:'id',
        width:180
      }, 
      {
        title:'操作位置',
        dataIndex:'location',
        width:150
      },
      {
        title:'日志类型',
        dataIndex:'logName',
        width:150
      },
      {
        title:'操作系统',
        dataIndex:'os',
        width:150
      },
      {
        title:'浏览器',
        dataIndex:'browser',
        width:150
      },
      {
        title:'IP地址',
        dataIndex:'ip',
        width:150
      },
      {
        title:'组织名称',
        dataIndex:'groupName',
        width:150
      },
      {
        title:'开始执行时间',
        dataIndex:'startTime',
        width:150,
        render:formatDate
      },
      {
        title:'截至执行时间',
        dataIndex:'endTime',
        width:150,
        render:formatDate
      },
      {
        title:'操作时间',
        dataIndex:'executeTime',
        width:150,
        render:formatDate
      },
      {
        title:'创建人',
        dataIndex:'creator',
        width:150
      },
      {
        title:'注册时间',
        dataIndex:'createdTime',
        width:170,
        render: formatDate
      },
      {
        title:'修改人',
        dataIndex:'lastOperator',
        width:150
      },
      {
        title:'修改时间',
        dataIndex:'updateTime',
        width:170,
        fixed:'right',
        render: formatDate
      }
      
    ]
  }

  getLogs = async (pageNum) => {
    
    this.pageNum = pageNum
    this.setState({loading:true})
    const {searchLoginIp,searchLoginLocation} = this.state
    
    const dataPost = {
      "pageNum": `${pageNum}`,
      "pageSize": 10,
      "ip": `${searchLoginIp}`,
      "location": `${searchLoginLocation}`
    }
    const result = await reqLogs(dataPost)
    if(result.code===200){
      this.setState({loading:false})
       
      const logs = result.result.list
      const total = result.result.total*1
      this.setState({logs,total})
    }
  }

  resetSearch = () => {
    const searchLoginIp = ''
    const searchLoginLocation = ''
    this.setState({searchLoginLocation,searchLoginIp},()=> {
      this.getLogs(1)
    })
    
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getLogs(1)
  }

  render(){
     
    const {searchLoginIp,searchLoginLocation,loading,logs,total} = this.state
  
    const title = (
      <span>
        <Input placeholder="登录IP" style={{width:150,margin:'0 15px'}} value={searchLoginIp} onChange={event => this.setState({searchLoginIp:event.target.value})}/>
        <Input placeholder="登陆城市" style={{width:150,marginRight:'15px'}} value={searchLoginLocation} onChange={event => this.setState({searchLoginLocation:event.target.value})}/>
        <Button type="primary" icon="search" onClick={() => {this.getLogs(1)}} style={{marginRight:'15px'}}>搜索</Button>
        <Button type="default" onClick={() => {this.resetSearch()}}>重置</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          loading={loading}
          rowKey="id"
          size='small'
          dataSource={logs}
          columns={this.columns}
          scroll={{ x: 1500 }}
          pagination={{
            current:this.pageNum,
            defaultPageSize:10,
            showQuickJumper:true,
            total:total,
            onChange:this.getLogs,
          }}
        />
      </Card>
    )
  }
}