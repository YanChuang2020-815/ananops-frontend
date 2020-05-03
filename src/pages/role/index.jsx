import React,{Component} from 'react'
import {Table,Button,Card,Select,Input,Icon,Modal,message,Tag} from 'antd'
import LinkButton from '../../components/link-button'
import {formatDate} from '../../utils/dateUtils'
import AddUpdateForm from './add-update-form'
import BindUser from './bind-user'
import BindMenu from './bind-menu'
import AuthForm from './auth-form'
import {reqSwitchRoleStatus,reqRoleList,reqDeleteRole,reqAddOrUpdateRole,reqDeleteBatch,reqBindUser,reqRoleBindUser} from '../../axios'

const Option = Select.Option
const userRoleCodes = ["user_manager", "user_leader", "user_guardian", "user_watcher"];
const platRoleCodes = ["admin", "supervisor", "superadmin", "p_user_manager", "p_fac_manager", "p_cus_service"];
const facsRoleCodes = ["fac_leader", "fac_service", "fac_manager", "engineer"];

export default class Role extends Component{

  state={
    roles:[], //当前页的角色数组
    selectedRowKeys:[], //当前选中的角色组
    role:{},//当前选中的角色
    total:0,//角色总条数
    loading:false, //是否正在加载中
    searchCode:'', //搜索角色编码
    searchName:'', //搜索角色名称
    searchType:'', //根据哪个字段搜索
    isShowAddUpdate:false,
    isShowBindUser:false,
    isShowBindMenu:false,
    isShowAuth:false,
    allUserSet:[],
    alreadyBindUserSet:[],
  }

  initColumns = () => {
    const userRoleCode = window.localStorage.getItem('roleCode');
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },
      {
        title:'角色名称',
        dataIndex:'roleName',
        width:150
      },
      {
        title:'角色编码',
        dataIndex:'roleCode',
        width:150
      },
      {
        title:'角色ID',
        dataIndex:'id',
        width:200
      },
      {
        title:'修改时间',
        dataIndex:'updateTime',
        width:180,
        render: formatDate
      },
      {
        title:'操作人',
        dataIndex:'lastOperator',
        width:150
      },
      {
        title:'创建时间',
        dataIndex:'createdTime',
        width:180,
        render: formatDate
      },
      {
        title:'创建人',
        dataIndex:'creator',
        width:150
      },
      {
        title:'备注',
        dataIndex:'remark',
        width:500
      },
      {
        title:'状态',
        dataIndex:'status',
        width:70,
        render:(status)=>{return <span>{status==='ENABLE'?'启用':'禁用'}</span>}
      },
      {
        title:'操作',
        fixed:'right',
        width:250,
        render: (role) => {
          const {id,status,roleCode} = role;
          var roleCodes = ["fac_service", "fac_leader", "user_watcher", "user_guardian", "user_leader", "supervisor"];
          if (roleCode === 'fac_manager' || roleCode === 'user_manager') {
            return (
              <span>
                <Tag color="#f50">平台内置角色</Tag>
                <Tag color="#f50">不可更改</Tag>
              </span>
            )
          } else if (userRoleCode !== "admin" && roleCodes.indexOf(roleCode) !== -1) {
            return (
              <span>
                <Tag color="#f50">平台内置角色</Tag>
                <Tag color="#f50">可使用</Tag>
                <Tag color="#f50">不可更改</Tag>
                {/*<LinkButton onClick={() => this.showBindUser(role)}>绑定用户</LinkButton>*/}
              </span>
            )
          } else {
            return (
              <span>
                <LinkButton onClick={() => this.updateStatus(id,status==='ENABLE'?'DISABLE':'ENABLE')}>{status==='DISABLE'?'启用':'禁用'}</LinkButton>|
                <LinkButton onClick={() => this.showBindUser(role)}>绑定用户</LinkButton>|
                <LinkButton onClick={() => this.showBindMenu(role)}>分配菜单</LinkButton>|
                <LinkButton onClick={() => this.showAssignAuth(role)}>分配权限</LinkButton>|
                <LinkButton onClick={() => this.showUpdate(role)}>修改</LinkButton>|
                <LinkButton onClick={()=> this.deleteRole(role)}>删除</LinkButton>
              </span>
            )
          }
        }
      }
    ]
  }

  //显示分配权限
  showAssignAuth = (role) => {
   
    this.setState({role,isShowAuth:true})
  }

  //分配权限确认回调
  assignAuth = () => {
    //this.setState({role:{}})
  }
 
  //显示绑定用户
  showBindUser = async (role) => {
    const roleId = role.id
    const result = await reqBindUser(roleId)
    if(result.code===200){
      console.log(result)
      this.setState({role:role,allUserSet:result.result.allUserSet,alreadyBindUserIdSet:result.result.alreadyBindUserIdSet},()=>this.setState({isShowBindUser:true}))

    }
    
  }

  //绑定用户确认回调
  bindUser = async () => {
    console.log(this.userIdList)
    const dataPost = {
      userIdList:this.userIdList,
      roleId:this.state.role.id
    }
    const result = await reqRoleBindUser(dataPost)
    if(result.code===200){
      this.setState({role:{}},()=>{this.setState({isShowBindUser:false})})
      message.success('绑定用户成功')
    }
  }

  //显示绑定菜单
  showBindMenu = (role) => {
    //存当前选中的角色
    this.setState({role,isShowBindMenu:true})
  }

  //绑定菜单确认回调
  bindMenu = () => {
    //this.setState({role:{}})
  }

  //删除某行角色
  deleteRole = (role) => {
    Modal.confirm({
      title:`确认删除${role.roleName}吗？`,
      onOk: async () => {
        const result = await reqDeleteRole(role.id)
        if(result.code===200){
          message.success('删除角色成功')
          this.getRoles(1)
        }
      }
    })
  }

  //批量删除
  // deleteBatch = async () => {
  //   Modal.confirm({
  //     title:`确认删除这${this.state.selectedRowKeys.length}项吗？`,
  //     onOk: async () => {
  //       console.log('deleteArray:',this.state.selectedRowKeys)
  //       const result = await reqDeleteBatch(this.state.selectedRowKeys)
  //       if(result.code===200){
  //         message.success('批量删除角色成功')
  //         this.getRoles(1)
  //       }
  //     }
  //   })
  // }

  //显示添加页面
  showAdd = () => {
    
    this.setState({role:{},isShowAddUpdate:true})
  }

  //点击修改显示修改界面
  showUpdate = (role) => {
    
    this.setState({role,isShowAddUpdate:true})
  }

  //启用/禁用
  updateStatus = async (roleId,status) => {
    const dataPost = {
      "id":roleId,
      "status":status
    }
    this.setState({loading:true})
    const result = await reqSwitchRoleStatus(dataPost)
    if(result.code === 200){
      this.getRoles(1)
    }
  }

  //添加或更新role
  addOrUpdateRole = async () => {
    this.setState({isShowAddUpdate:false})
    const role = this.form.getFieldsValue()
    if (role.roleCode === null) {
      message.error("角色编码必填！")
      return;
    }
    if (role.roleName === null) {
      message.error("角色名称必填！")
      return;
    }
    if(userRoleCodes.indexOf(role.roleCode) !== -1 || platRoleCodes.indexOf(role.roleCode) !== -1 || facsRoleCodes.indexOf(role.roleCode) !== -1){
      message.error('该角色编码已被系统占用，请更换!');
      return;
    }
    
    this.form.resetFields()

    if(this.state.role){//更新
      const newRole = {}
      Object.assign(newRole,this.state.role,role)

      const result = await reqAddOrUpdateRole(newRole)
      if(result.code === 200){
        this.setState({role:{}},()=>{
          this.getRoles(1)
        })
        
      }

    }else{//添加
      const newRole = {}
      Object.assign(newRole,role)
      const result = await reqAddOrUpdateRole(newRole)
      if(result.code===200){
        this.getRoles(1)
      }
    }
  }


  getRoles = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading:true})
    const {searchCode,searchName,searchType} = this.state
    
    const dataPost = {
      "pageNum": `${pageNum}`,
      "pageSize": 10,
      "roleCode": `${searchCode}`,
      "roleName": `${searchName}`,
      "status": `${searchType===''?'':(searchType==='roleOn'?'ENABLE':'DISABLE')}`
    }
    const result = await reqRoleList(dataPost)
    if(result.code===200){
      this.setState({loading:false})
       
      const roles = result.result.list
      const total = result.result.total
      this.setState({roles,total})
    }else{
      this.setState({loading:false})
    }
  }

  resetSearch = () => {
    const searchName = ''
    const searchType = ''
    const searchCode = ''
    this.setState({searchName,searchType,searchCode},()=> {
      this.getRoles(1)
    })
    
  }

  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.id) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1);
    } else {
      selectedRowKeys.push(record.id);
    }
    this.setState({ selectedRowKeys });
  }

  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getRoles(1)
  }

  render(){
  
    const {roles,role,selectedRowKeys,total,loading,searchType,searchCode,searchName,isShowAddUpdate,isShowBindUser,isShowBindMenu,isShowAuth,allUserSet,alreadyBindUserIdSet} = this.state
  
    const hasSelected = selectedRowKeys.length>0
  
    const title = (
      <span>
        <Select placeholder="状态" value={searchType?searchType:undefined} style={{width:120,}} onChange={value => this.setState({searchType:value})}>
          <Option value="roleOn" key="roleOn">启用</Option>
          <Option value="roleOff" key="roleOff">禁用</Option>
        </Select>
        <Input placeholder="角色编码" style={{width:150,margin:'0 15px'}} value={searchCode} onChange={event => this.setState({searchCode:event.target.value})}/>
        <Input placeholder="角色名称" style={{width:150,marginRight:'15px'}} value={searchName} onChange={event => this.setState({searchName:event.target.value})}/>
        <Button type="primary" icon="search" onClick={() => {this.getRoles(1)}} style={{marginRight:'15px'}}>搜索</Button>
        <Button type="default" onClick={() => {this.resetSearch()}}>重置</Button>
      </span>
    )

    const extra = (
      <span>
        <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.showAdd()}><Icon type="plus"/>添加角色</Button>
        {/* <Button type="primary" disabled={!hasSelected} onClick={() => this.deleteBatch()}><Icon type="delete"/>批量删除</Button> */}
      </span>
      
    )
  
    const rowSelection = {
      selectedRowKeys,
      onChange:this.onSelectedRowKeysChange,
    }
  
  
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          loading={loading}
          rowKey="id"
          size='small'
          dataSource={roles}
          columns={this.columns}
          scroll={{ x: 1500 }}
          // rowSelection={rowSelection}
          onRow={(record)=>({
            onClick:()=>{
              this.selectRow(record)
            }
          })}
          pagination={{
            current:this.pageNum,
            defaultPageSize:10,
            showQuickJumper:true,
            total:total,
            onChange:this.getRoles,
          }}
        />
        <Modal
          title={role.id?'编辑角色':'添加角色'}
          visible={isShowAddUpdate}
          onOk={this.addOrUpdateRole}
          onCancel={() => {this.setState({isShowAddUpdate:false,role:{}});this.form.resetFields();}}
        >
          <AddUpdateForm
            setForm={(form)=>{this.form = form}} role={role}
          />
        </Modal>
        <Modal
          title="绑定用户"
          visible={isShowBindUser}
          onOk={this.bindUser}
          onCancel={() => {this.setState({role:{}},()=>{this.setState({isShowBindUser:false})});}}
          width={700}
        >
          <BindUser 
            setUserIdList={(userIdList)=>{this.userIdList = userIdList}} 
            allUserSet={allUserSet} 
            alreadyBindUserIdSet={alreadyBindUserIdSet}
          />
        </Modal>
        <Modal
          title="绑定菜单"
          visible={isShowBindMenu}
          onOk={this.bindMenu}
          onCancel={() => {this.setState({isShowBindMenu:false,role:{}});}}
          width={600}
        >
          <BindMenu role={role}/>
        </Modal>
        <Modal
          title="分配权限"
          visible={isShowAuth}
          onOk={this.assignAuth}
          onCancel={() => {this.setState({isShowAuth:false,role:{}});}}
        >
          <AuthForm role={role}/>
        </Modal>
      </Card>
    )
  }
}