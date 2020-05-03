import React,{Component} from 'react'
import {Card,Table,Input,Button} from 'antd'
import {formatDate} from '../../utils/dateUtils'
import {reqOnlineUsers} from '../../axios/index'

export default class OnlineUsers extends Component{

  
  state = {
    users:[], //当前页的用户数组
    total:0,//角色总条数
    loading:false, //是否正在加载中
    searchLoginName:'', //搜索登录名
    searchUserName:'', //搜索用户名
  }

  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },{
        title:'用户ID',
        dataIndex:'id',
        width:180,
        fixed:'left'
      }, 
      {
        title:'登陆名',
        dataIndex:'loginName',
        width:150
      },
      {
        title:'状态',
        dataIndex:'status',
        width:70,
        render:(status)=>{return <span>{status===''?'离线':'在线'}</span>}
      },
      {
        title:'用户名',
        dataIndex:'userName',
        width:150
      },
      {
        title:'组织名称',
        dataIndex:'groupName',
        width:150
      },
      {
        title:'登陆时间',
        dataIndex:'loginTime',
        width:170,
        render:formatDate
      },
      {
        title:'登陆IP',
        dataIndex:'loginIp',
        width:170
      },
      {
        title:'登陆地点',
        dataIndex:'loginLocation',
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
        title:'注册时间',
        dataIndex:'createdTime',
        width:170,
        render: formatDate
      },
      {
        title:'创建人',
        dataIndex:'creator',
        width:150
      },
      {
        title:'修改时间',
        dataIndex:'updateTime',
        width:170,
        render: formatDate
      },
      {
        title:'修改人',
        dataIndex:'lastOperator',
        width:150
      },
      {
        title:'过期时间（秒）',
        width:150,
        dataIndex:'expiresIn',
        fixed:'right',
      }
    ]
  }

  getUsers = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading:true})
    const {searchLoginName,searchUserName,} = this.state
    const dataPost = {
      "pageNum": `${pageNum}`,
      "pageSize": 10,
      "userName": `${searchUserName}`,
      "loginName": `${searchLoginName}`,
      "status": 0,
    }
    const result = await reqOnlineUsers(dataPost)
    if(result.code===200){
      this.setState({loading:false})
       
      const users = result.result.list
      const total = result.result.total*1
      this.setState({users,total})
    }
  }

  resetSearch = () => {
    const searchUserName = ''
    const searchLoginName = ''
    this.setState({searchUserName,searchLoginName},()=> {
      this.getUsers(1)
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers(1)
  }

  render(){
    const {users,total,loading,searchLoginName,searchUserName} = this.state
  
    const title = (
      <span>
        <Input placeholder="登录名" style={{width:150,margin:'0 15px'}} value={searchLoginName} onChange={event => this.setState({searchLoginName:event.target.value})}/>
        <Input placeholder="用户名" style={{width:150,marginRight:'15px'}} value={searchUserName} onChange={event => this.setState({searchUserName:event.target.value})}/>
        <Button type="primary" icon="search" onClick={() => {this.getUsers(1)}} style={{marginRight:'15px'}}>搜索</Button>
        <Button type="default" onClick={() => {this.resetSearch()}}>重置</Button>
      </span>
    )
  
    const extra = (
      <Button type="primary" onClick={() => this.props.history.goBack()}>返回上一级</Button>
    )
  
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          loading={loading}
          rowKey="id"
          size='small'
          dataSource={users}
          columns={this.columns}
          scroll={{ x: 1500 }}
          pagination={{
            current:this.pageNum,
            defaultPageSize:10,
            showQuickJumper:true,
            total:total,
            onChange:this.getUsers,
          }}
        />
      </Card>
    )
  }
}