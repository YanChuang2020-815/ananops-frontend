import React,{Component} from 'react'
import {Card,Table,Input,Button,Select,Modal,message,Popover} from 'antd'
import {formatDate} from '../../utils/dateUtils'
import {reqOnlineUsers,reqForceLogout} from '../../axios/index.js'

const Option = Select.Option
export default class Token extends Component{

  state = {
    users:[], //当前页的用户数组
    user:{}, //当前选中用户
    total:0,//角色总条数
    loading:false, //是否正在加载中
    searchLoginName:'', //搜索登录名
    searchUserName:'', //搜索用户名
    searchType:''
  }

  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },{
        title:'TokenID',
        dataIndex:'id',
        width:180
      }, 
      {
        title:'登陆名',
        dataIndex:'loginName',
        width:100
      },
      {
        title:'状态',
        dataIndex:'status',
        width:70,
        render:(status)=>{return <span>{status===0?'在线':'离线'}</span>}
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
        title:'access Token',
        dataIndex:'accessToken',
        width:250,
        ellipsis: true,
        render:(accessToken) => {
          return (
            <Popover
              content={accessToken}
            >
              {accessToken}
            </Popover>
          )
        }
      },
      {
        title:'refresh Token',
        dataIndex:'refreshToken',
        width:250,
        ellipsis: true,
        render:(refreshToken) => {
          return (
            <Popover
              content={refreshToken}
            >
              {refreshToken}
            </Popover>
          )
        }
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
        dataIndex:'expiresIn'
      },
      {
        title:'操作',
        width:100,
        fixed:'right',
        render: (user) => {
          return (
            <Button type="danger" disabled={!(user.status===0)} onClick={() => this.forceLogout(user)}>强制退出</Button>
          )
        }
      },
    ]
  }

  forceLogout = async (user) => {
    Modal.confirm({
      title:`确认强制退出${user.userName}吗？`,
      onOk: async () => {
        const result = await reqForceLogout(user.accessToken)
        if(result.code===200){
          message.success('用户强制退出成功')
          this.resetSearch()
          this.getUsers(1)
        }
      }
    })
    
  }

  getUsers = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading:true})
    const {searchLoginName,searchUserName,searchType} = this.state
    
    const dataPost = {
      "pageNum": `${pageNum}`,
      "pageSize": 10,
      "userName": `${searchUserName}`,
      "loginName": `${searchLoginName}`,
      "status": `${searchType===''?'':searchType*1}`
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
    const searchType = ''
    this.setState({searchUserName,searchType,searchLoginName},()=> {
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
    const {users,total,loading,searchLoginName,searchUserName,searchType} = this.state
  
    const title = (
      <span>
        <Select placeholder="状态" value={searchType?searchType:undefined} style={{width:120,}} onChange={value => this.setState({searchType:value})}>
          <Option value="0" key="online">在线</Option>
          <Option value="20" key="offline">离线</Option>
        </Select>
        <Input placeholder="登录名" style={{width:150,margin:'0 15px'}} value={searchLoginName} onChange={event => this.setState({searchLoginName:event.target.value})}/>
        <Input placeholder="用户名" style={{width:150,marginRight:'15px'}} value={searchUserName} onChange={event => this.setState({searchUserName:event.target.value})}/>
        <Button type="primary" icon="search" onClick={() => {this.getUsers(1)}} style={{marginRight:'15px'}}>搜索</Button>
        <Button type="default" onClick={() => {this.resetSearch()}}>重置</Button>
      </span>
    )

    return (
      <Card title={title}>
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