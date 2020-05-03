import React,{Component} from 'react'
import {Tabs,Descriptions,Card,Table,Button,Tree} from 'antd'
import {reqUserLogs} from '../../axios/index'
import {formatDate} from '../../utils/dateUtils'
import avatar from '../../img/avatar.jpg'
import menuConfig from '../../config'

const TabPane = Tabs.TabPane
const Item = Descriptions.Item
const Meta = Card.Meta
const TreeNode = Tree.TreeNode
export default class DetailUser extends Component{

  constructor(props){
    super(props)
    //this.user = this.props.location.state.user
  }

  state = {
    loading:false,
    logs:[],
    total:0,

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
        width:170,
        render:formatDate
      },
      {
        title:'截至执行时间',
        dataIndex:'endTime',
        width:170,
        render:formatDate
      },
      {
        title:'操作时间',
        dataIndex:'executeTime',
        width:170,
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
    const userId = this.props.location.state.id
    const dataPost = {
      "pageNum": `${pageNum}`,
      "pageSize": 10,
      "userId":userId,
    }
    const result = await reqUserLogs(dataPost)
    if(result.code===200){
      this.setState({loading:false})
       
      const logs = result.result.list
      const total = result.result.total*1
      this.setState({logs,total})
    }
  }

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre,item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>)
      return pre
    },[])
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.treeNodes = this.getTreeNodes(menuConfig)
    console.log(menuConfig)
    this.getLogs(1)
  }


  render(){
  
    const {logs,total,loading} = this.state
    
    const {loginName,userName,userCode,status,groupName,mobileNo,lastLoginIp,lastLoginTime} = this.props.location.state
  
    return (
      <div>
        <Button type="default" onClick={()=> this.props.history.goBack()}>返回</Button>
         
        <Tabs defaultActiveKey="1" style={{height:"100%"}}>
          <TabPane 
            tab="用户信息"
            key="1"
            style={{height:800}}
          >
            <div style={{display:"flex"}}>
              <div style={{marginLeft:50}}>
                <Card hoverable style={{width:300,height:300}} cover={<img alt="用户头像" src={avatar}/>}>
                  <Meta title={userName} style={{textAlign:"center"}}/>
                </Card>
              </div>
                
              <div style={{marginLeft:50}}>
                <Descriptions bordered size='small' column={{md:1,xs:1,xm:1,lg:1,xl:1,xxl:1}}>
                  <Item label="登录名">{loginName}</Item>
                  <Item label="姓名">{userName}</Item>
                  <Item label="工号">{userCode}</Item>
                  <Item label="状态">{status==='ENABLE'?'启用':'禁用'}</Item>
                  <Item label="所属组织">{groupName}</Item>
                  <Item label="电话号码">{mobileNo}</Item>
                  <Item label="最后登陆IP">{lastLoginIp}</Item>
                  <Item label="最后在线">{formatDate(lastLoginTime)}</Item>
                </Descriptions>
              </div>
              <div style={{width:500,marginLeft:50}}>
                <Card title="权限信息">
                  <Tree >
                    <TreeNode title="运营工作台" key="all">
                      {this.treeNodes}
                    </TreeNode>
                  </Tree>
                </Card>
              </div>
            </div>
      
          </TabPane>
          <TabPane 
            tab="操作日志"
            key="2"
            style={{height:800}}
          > 
            <Table
              bordered
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
          </TabPane>
        
        </Tabs>
      </div>
      
    )
  }
}