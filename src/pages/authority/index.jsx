import React,{Component} from 'react'
import {Table,Button,Card,Select,Input,Icon,Modal,message,TreeSelect} from 'antd'
import LinkButton from '../../components/link-button'
import {formatDate} from '../../utils/dateUtils'
import AddUpdateForm from './add-update-form'
import {
  reqAuthList,
  reqDeleteBatchAuth,
  reqSwitchAuthStatus,
  reqDeleteAuth,
  reqAddOrUpdateAuth,
  reqGetMenuTree
} from '../../axios/index'


const { TreeNode } = TreeSelect;
const Option = Select.Option
export default class Authority extends Component{

  state={
    menuTree:[],
    auths:[], //当前页的权限数组
    auth:{},//选中的auth
    selectedRowKeys:[], //当前选中的权限组
    total:0,//角色总条数
    loading:false, //是否正在加载中
    searchAuthURL:'', //搜索权限URL
    searchAuthCode:'', //搜索权限编码
    searchAuthName:'', //搜索权限名称
    searchMenuName:undefined, //根据哪个菜单名称搜索
    isShowAddUpdate:false,  
  }

  //动态构建机构树形菜单
  renderTree = (data) => {
    console.log('树形菜单数据源', data);
    return data.map(item => {
      if (!item.subMenu) {
        return (
            <TreeNode title={
                <span>{item.menuName} </span>
            } value={item.id}>
            </TreeNode>
        )
      } else {
        return (
            <TreeNode title={
                 <span>{item.menuName} </span>
            } value={item.id}>
              {this.renderTree(item.subMenu)}
            </TreeNode>
        )
      }
    })
  };
  //获取菜单树
  getMenuTree = async () =>{
    const data = await reqGetMenuTree()
    if (data.code == 200) {
      console.log(data)
      this.setState({menuTree:data.result})
    }
  }
  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },
      {
        title:'权限名称',
        dataIndex:'actionName',
        width:200
      },
      {
        title:'权限ID',
        dataIndex:'id',
        width:200
      }, 
      {
        width:100,
        title:'状态',
        dataIndex:'status',
        render:(status) => status==='ENABLE'?'启用':'禁用'
      },
      {
        title:'权限编码',
        dataIndex:'actionCode',
        width:200
      },
      {
        title:'URL地址',
        dataIndex:'url',
        width:250
      },
      {
        title:'菜单名称',
        dataIndex:'menuName',
        width:120
      },
      {
        title:'菜单ID',
        dataIndex:'menuId',
        width:180
      },
      {
        title:'修改时间',
        dataIndex:'updateTime',
        width:170,
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
        width:170,
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
        width:200,
      },
      {
        title:'操作',
        width:200,
        fixed:'right',
        render: (auth) => {
          const {id,status} = auth
          return (
            <span>
              <LinkButton onClick={() => this.updateStatus(id,status==='ENABLE'?'DISABLE':'ENABLE')}>{status==='DISABLE'?'启用':'禁用'}</LinkButton>|
              <LinkButton onClick={() => this.showUpdate(auth)}>更新</LinkButton>|
              <LinkButton onClick={() => this.deleteAuth(auth)}>删除</LinkButton>
            </span>
            
          )
        }
      }
    ]
  }

  //显示添加模态框
  showAdd = () => {
    
    this.setState({auth:{},isShowAddUpdate:true})
  }

  //显示修改模态框
  showUpdate = (auth) => {
    this.setState({auth,isShowAddUpdate:true})
  }

  //启用/禁用
  updateStatus = async (roleId,status) => {
    const dataPost = {
      "id":roleId,
      "status":status
    }
    this.setState({loading:true})
    const result = await reqSwitchAuthStatus(dataPost)
    if(result.code === 200){
      this.getAuths(1)
      message.success("操作成功");
    }else{
      this.getAuths(1)
      message.success("操作失败");
    }
  }


  //根据id删除权限
  deleteAuth = (auth) => {
    Modal.confirm({
      title:`确认删除${auth.actionName}吗？`,
      onOk: async () => {
        const result = await reqDeleteAuth(auth.id)
        if(result.code===200){
          message.success('删除成功')
          this.getAuths(1)
        }else{
          message.error("删除失败");
          this.getAuths(1)
        }
      }
    })
  }

  //批量删除
  deleteBatch = async () => {
    Modal.confirm({
      title:`确认删除这${this.state.selectedRowKeys.length}项吗？`,
      onOk: async () => {
        console.log('deleteArray:',this.state.selectedRowKeys)
        const result = await reqDeleteBatchAuth(this.state.selectedRowKeys)
        if(result.code===200){
          message.success('批量删除权限成功')
          this.getAuths(1)
        }
      }
    })
  }

  getAuths = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading:true})
    const {searchMenuName,searchAuthCode,searchAuthName,searchAuthURL} = this.state
    
    const dataPost = {
      "actionCode": `${searchAuthCode}`,
      "actionName": `${searchAuthName}`,
      "menuIdList": [
        searchMenuName
      ],
      "orderBy": "",
      "pageNum": pageNum,
      "pageSize": 10,
      "status": "",
      "url": `${searchAuthURL}`
    }
    const result = await reqAuthList(dataPost)
    if(result.code===200){
      this.setState({loading:false})
       
      const auths = result.result.list
      const total = result.result.total
      this.setState({auths,total})
    }
  }

  //添加或更新auth
  addOrUpdateAuth = async () => {
    this.setState({isShowAddUpdate:false})
    const auth = this.form.getFieldsValue()
    const menuIdList = {menuIdList:[auth.menuId]}
    this.form.resetFields()
    console.log('修改,模态框采集的auth：',auth)

    if(this.state.auth){//更新
      const newAuth = {}
      Object.assign(newAuth,this.state.auth,auth,menuIdList)
      console.log('修改，发送的auth：',newAuth)

      const result = await reqAddOrUpdateAuth(newAuth)
      if(result.code === 200){
        message.success("更新成功");
        this.setState({auth:{}},()=>{
              this.getAuths(1)
        })
      }else {
        message.error("更新失败");
        this.setState({auth:{}},()=>{
          this.getAuths(1)
        })
      }

    }else{//添加
      const newAuth = {}
      Object.assign(newAuth,auth)
      const result = await reqAddOrUpdateAuth(newAuth)
      if(result.code===200){
        message.success("添加成功");
        this.getAuths(1)
      }else{
        message.error("添加失败");
        this.getAuths(1)
      }
    }
  }

  resetSearch = () => {
    const searchMenuName = undefined
    const searchAuthName = ''
    const searchAuthCode = ''
    const searchAuthURL = ''
    this.setState({searchMenuName,searchAuthName,searchAuthCode,searchAuthURL},()=> {
      this.getAuths(1)
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
    this.getAuths(1)
    this.getMenuTree().then(r => console.log("getMenuTree"));
  }

  onChange = value => {
    console.log(value);
    this.setState({searchMenuName:value});
  };
  render(){
  
    const {menuTree,auths,auth,selectedRowKeys,total,loading,searchMenuName,searchAuthName,searchAuthCode,searchAuthURL,isShowAddUpdate,isShowBindRole} = this.state
    const menuTreeNodes = this.renderTree(menuTree)
    const hasSelected = selectedRowKeys.length>0
  
    const title = (
      <span>
        <TreeSelect
            showSearch
            style={{width:150,marginRight:'15px'}}
            value={this.state.searchMenuName}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择菜单名称"
            allowClear
            treeDefaultExpandAll
            onChange={this.onChange}
        >
          {menuTreeNodes}
        </TreeSelect>
        <Input placeholder="权限编码" style={{width:150,margin:'0 15px'}} value={searchAuthCode} onChange={event => this.setState({searchAuthCode:event.target.value})}/>
        <Input placeholder="权限名称" style={{width:150,marginRight:'15px'}} value={searchAuthName} onChange={event => this.setState({searchAuthName:event.target.value})}/>
        <Input placeholder="权限URL" style={{width:150,marginRight:'15px'}} value={searchAuthURL} onChange={event => this.setState({searchAuthURL:event.target.value})}/>
        <Button type="primary" icon="search" onClick={() => {this.getAuths(1)}} style={{marginRight:'15px'}}>搜索</Button>
        <Button type="default" onClick={() => {this.resetSearch()}}>重置</Button>
      </span>
    )

    const extra = (
      <span>
        <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.showAdd()}><Icon type="plus"/>添加菜单权限</Button>
        <Button type="primary" disabled={!hasSelected} onClick={() => this.deleteBatch()}><Icon type="delete"/>批量删除</Button>
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
          dataSource={auths}
          columns={this.columns}
          scroll={{ x: 1500 }}
          rowSelection={rowSelection}
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
            onChange:this.getAuths,
          }}
        />
        <Modal
          title={auth.id?'修改菜单权限':'添加菜单权限'}
          visible={isShowAddUpdate}
          onOk={this.addOrUpdateAuth}
          onCancel={() => {this.setState({isShowAddUpdate:false,auth:{}});this.form.resetFields()}}
        >
          <AddUpdateForm
            setForm={(form)=>{this.form = form}}
            auth={auth}
            menuTreeNodes={menuTreeNodes}

          />
        </Modal>
        
        
      </Card>
    )
  }
}