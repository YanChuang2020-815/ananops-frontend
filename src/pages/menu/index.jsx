import React,{Component} from 'react'
import {Tree, Button, Tag, Popconfirm, Modal, message, Table} from 'antd'
import AddMenuForm from './add-menu'
import UpdateMenuForm from './update-menu'
import {reqGetMenuTree,reqSaveMenu,reqDeleteMenu} from '../../axios/index'

const TreeNode = Tree.TreeNode
export default class Menu extends Component{

  state = {
    menu:{},
    isShowUpdate:false,
    isShowAdd:false,
    menuTree:[],
    roleId: window.localStorage.getItem('roleId'),
  }

  //动态构建机构树形菜单
  renderTree = (data) => {
    console.log('树形菜单数据源', data);
    return data.map(item => {
      if (!item.subMenu) {
        return (
            <TreeNode title={

              <span style={{display: "flex", justifyContent: "space-between", width: 800}}>
              <span >{item.menuName} </span>
              <span >{item.status=== 'ENABLE' ? '显示' : '隐藏'} </span>
              <span>
                <Button type="primary" size={"small"} onClick={() => this.showUpdate(item)} style={{marginLeft: 30}}>更新</Button>
                <Button type="primary" size={"small"} onClick={() => this.showAdd(item)} style={{marginLeft: 10}}>新增</Button>
                  <Popconfirm
                      title="确定要删除吗？"
                      onConfirm={() => {
                        this.deleteMenu(item.id)
                      }}
                  >
                            <Button
                                size={"small"}
                                type="danger"
                                style={{marginLeft: 10}}
                            >删除</Button>
                        </Popconfirm>

                 </span>
              </span>
            } key={item.id}>
            </TreeNode>
        )
      } else {
        return (
            <TreeNode title={
              <span style={{display: "flex", justifyContent: "space-between", width: 800}}>
              <span >{item.menuName} </span>
              <span >{item.status=== 'ENABLE' ? '显示' : '隐藏'} </span>
              <span>
                <Button type="primary" size={"small"} onClick={() => this.showUpdate(item)} style={{marginLeft: 10}}>更新</Button>
                <Button type="primary" size={"small"} onClick={() => this.showAdd(item)} style={{marginLeft: 10}}>新增</Button>
                  <Popconfirm
                      title="确定要删除吗？"
                      onConfirm={() => {
                        this.deleteMenu(item.id)
                      }}
                  >
                            <Button
                                size={"small"}
                                type="danger"
                                style={{marginLeft: 10}}
                            >删除</Button>
                        </Popconfirm>

              </span>

              </span>

            } key={item.id}>
              {this.renderTree(item.subMenu)}
            </TreeNode>
        )
      }
    })
  };
  //删除菜单
  deleteMenu = async (id) => {
    const result = await reqDeleteMenu(id);
    if(result.code === 200){
      message.success("删除成功");
      this.getMenuTree();
    }else if(result.code === 500){
      message.error("此菜单含有子菜单, 请先删除子菜单");
    }else if(result.code === 10013003){
      message.error("菜单不存在");
    }else{
      message.error("删除失败");
    }
  }

  //新增菜单
  saveMenu = async  () => {
    const newMenu = this.form.getFieldsValue()
    console.log(newMenu)
    const result = await reqSaveMenu(newMenu)
    console.info(result);
    if (result.code === 200) {
      this.form.resetFields()
      this.setState({isShowAdd: false,isShowUpdate:false})
      this.getMenuTree();
      message.success("操作成功")
    }else if(result.code === 10013001){
      message.error("操作失败：父菜单不存在")
    }else if(result.code === 10013002){
      message.error("更新上级菜单失败")
    }else{
      message.error("操作失败")
    }
  }

  //显示更新页面
  showUpdate = (data) => {
    console.log(data)
    this.setState({menu: ""})
    this.setState({isShowUpdate: true, menu: data})
  }
  //显示更新页面
  showAdd = (data) => {
    console.log(data)
    this.setState({menu: ""})
    this.setState({isShowAdd: true, menu: data})
  }
  //获取菜单树
  getMenuTree = async () =>{
    const data = await reqGetMenuTree()
    if (data.code == 200) {
      console.log(data)
      this.setState({menuTree:data.result})
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

  componentDidMount() {
    this.getMenuTree().then(r => console.log("getMenuTree"));
  }

  componentWillMount(){
    // this.treeNodes = this.getTreeNodes(menuConfig)
  }

  render(){
    const {menuTree,menu,isShowAdd,isShowUpdate} = this.state
    const menuTreeNodes = this.renderTree(menuTree)
    const columns = [
          {
              title: '菜单名称',
              dataIndex: 'menuName',
              key: 'menuName',
              width: '25%',
          },
          {
              title: '菜单编码',
              dataIndex: 'menuCode',
              key: 'menuCode',
          },
          {

              title:'前端显示',
              dataIndex:'status',
              key: 'status',
              width: '25%',
              render:(status) => status==='ENABLE'? '有效' : <Tag color="#f50">无效</Tag>
          },
          {
            title:'操作',
            width: '25%',
            render: (item) => {
                return (
                    <span>
                      <Button type="primary" size={"small"} onClick={() => this.showAdd(item)} style={{marginLeft: 10}}>新增</Button>
                      {item.menuCode === 'root' ? "" : <span>
                        <Button type="primary" size={"small"} onClick={() => this.showUpdate(item)} style={{marginLeft: 10}}>更新</Button>
                        <Popconfirm
                          title="确定要删除吗？"
                          onConfirm={() => {
                              this.deleteMenu(item.id)
                          }}
                          >
                          <Button
                              size={"small"}
                              type="danger"
                              style={{marginLeft: 10}}
                          >删除</Button>
                        </Popconfirm>
                      </span>}
                  </span>
                )
            }
          },
      ];
      return (
      <div>
        <div style={{marginTop:20,marginLeft:20,width:"100%"}}>
            <Table
                columns={columns}
                dataSource={menuTree}
                childrenColumnName = "subMenu"
                defaultExpandedRowKeys = "1"
                size='small'
            />
        </div>
        <Modal
            title={"新增菜单"}
            visible={isShowAdd}
            onOk={this.saveMenu}
            onCancel={() => {
              this.setState({isShowAdd: false});
              this.form.resetFields();
            }}
        >
          <AddMenuForm
              setForm={(form) => {
                this.form = form
              }}
              menu={menu}
          />
        </Modal>
        <Modal
            title={"更新菜单"}
            visible={isShowUpdate}
            onOk={this.saveMenu}
            onCancel={() => {
              this.setState({isShowUpdate: false});
              this.form.resetFields();
            }}
        >
          <UpdateMenuForm
              setForm={(form) => {
                this.form = form
              }}
              menu={menu}
          />
        </Modal>
      </div>
    )
  }
}