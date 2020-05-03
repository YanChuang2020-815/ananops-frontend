import React, {Component} from 'react'
import {Tree, Button, Table, Card, Modal, Icon} from 'antd'
import menuConfig from '../../config'
import {reqGroupTree, reqDepartUserList, reqGroupList, reqBindGroup} from '../../axios/index'
import ChangeGroup from './change-group'

const TreeNode = Tree.TreeNode
export default class GroupEmpl extends Component {

    state = {
        groupTree: [],
        groupList:[],
        groupName:'',
        users:[], // 当前页的用户数组
        user: {}, // 选中的User
        item: {},
        group: {},
        roleCode: window.localStorage.getItem('roleCode'),
        total:0,//角色总条数
        isShowBindGroup:false,
        loginUserGroupId:''
    }

    initColumns = () => {
        this.columns = [
            {
                title:'序号',
                width: 50,
                fixed:'left',
                render:(text,record,index)=> `${index+1}`,
            },
            {
                title:'姓名',
                dataIndex:'userName',
                width:80
            },
            {
                title:'工号',
                dataIndex:'userCode',
                width:80
            },
            {
                title:'职位',
                dataIndex:'roleName',
                width:100
            },
            {
                title:'联系电话',
                dataIndex:'mobileNo',
                width:120
            },
            {
                title:'邮箱',
                dataIndex:'email',
                width:170
            },
            {
                title: '操作',
                width: 90,
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <Button onClick={() => this.bindGroup(record)}>部门调整</Button>
                    )
                }
            }
        ]
    }

    //获取组织列表
    getGroupList = async () => {
        const group = await reqGroupList()
        const groupId = this.state.loginUserGroupId;
        if(group.code===200){
        var groupList = [];
        group.result.map((item) => {
            if (groupId !== item.id) {
                groupList.push([item.id,item.groupName])
            }
        })
        this.setState({groupList})
        }
    }

    bindGroup = (user) => {
        this.setState({user:user,isShowBindGroup:true})
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>)
            return pre
        }, [])
    }

    //动态构建机构树形菜单
    renderTree = (data) => {
        return data.map(item => {
            if (!item.subMenu) {
                return (
                    <TreeNode title={
                        <span style={{display: "flex", justifyContent: "flex-start", width: 550}}>
                            <span>| - - <Icon type="appstore"/> {item.menuName} </span>
                        </span>
                    } key={item.id}>
                    </TreeNode>
                )
            } else {
                return (
                    <TreeNode title={
                        <span style={{display: "flex", justifyContent: "flex-start", width: 550}}>
                            <span>| - - <Icon type="appstore"/> {item.menuName}</span>
                        </span>
                    } key={item.id}>
                        {this.renderTree(item.subMenu)}
                    </TreeNode>
                )
            }
        })
    };

    //获取组织树
    getGroupTree = async () => {
        const data = await reqGroupTree()
        if (data.code == 200) {
            console.log(data)
            const groupTree = data.result
            console.log(groupTree)
            this.setState({groupTree})
        }
    }

    componentWillMount() {
        var loginUserGroupId = JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId;
        this.setState({loginUserGroupId})
        this.treeNodes = this.getTreeNodes(menuConfig)
        this.initColumns()
        this.getGroupTree()
    }

    componentDidMount() {
        this.getGroupList()
    }

    onSelect = async(e) => {
        if (e.length > 0) {
            if (this.state.loginUserGroupId === e[0]) {
                return;
            }
            this.state.groupList.map((item,index)=> {
                if (item[0] === e[0]) {
                    this.setState({
                        groupName: item[1]
                    })
                }
            })
            this.getUsers(0, e[0]);
        }
      };
    
    getUsers = async (pageNum, groupId) => {
        this.pageNum = pageNum
        this.setState({loading:true})
        const dataPost = {
          "pageNum": `${pageNum}`,
          "pageSize": 10,
          "groupId": groupId
        }
        const result = await reqDepartUserList(dataPost)
        if(result.code===200){
          this.setState({loading:false})
    
          const users = result.result.list
          const total = result.result.total*1
          this.setState({users,total})
        }
    }

    bindGroupConfirm = async () => {
        const groupId = this.form.getFieldsValue()
        this.form.resetFields()
    
        const dataPost = {
          groupId:groupId.groupId,
          userId:this.state.user.id
        }
        const result = await reqBindGroup(dataPost)
        if(result.code===200){
            this.state.groupList.map((item,index)=> {
                if (item[0] === groupId.groupId) {
                    this.setState({
                        groupName: item[1]
                    })
                }
            })
            this.setState({isShowBindGroup:false,user:{}},()=>{
                this.getUsers(1, groupId.groupId);
            })
        }
    }

    render() {
        const {
            groupTree,
            users,
            total,
            isShowBindGroup,
            groupList,
            user,
            groupName
        } = this.state
        const groupTreeNodes = this.renderTree(groupTree);
            return (
                <div>
                    <div style={{display:"flex", marginTop:20}}>
                        <div style={{width: '35%', marginLeft: 10}}>
                            <Tree
                                style={{width: "10%"}}
                                onSelect={this.onSelect}
                                defaultExpandAll={true}
                            >
                                {groupTreeNodes}
                            </Tree>
                        </div>
                        <div style={{width:'63%', marginLeft: 1}}>
                            <Card title={<span>成员列表 > {groupName}</span>}>
                                <Table
                                bordered
                                size='small'
                                rowKey='id'
                                scroll={{ x: 600 }}
                                showHeader={true}
                                pagination={{
                                    current:this.pageNum,
                                    defaultPageSize:10,
                                    showQuickJumper:true,
                                    total:total,
                                    onChange:this.getUsers,
                                }}
                                rowClassName={this.setRowClassName}
                                dataSource={users}
                                columns={this.columns}>
                                </Table>
                            </Card>
                        </div>
                    </div>
                    <Modal
                        title="调整该成员所属部门"
                        visible={isShowBindGroup}
                        onOk={this.bindGroupConfirm}
                        onCancel={() => {this.setState({user:{}},()=>{this.setState({isShowBindGroup:false})});this.form.resetFields()}}
                    >
                        <ChangeGroup
                            setForm={(form)=>{this.form = form}}
                            user={user}
                            groupList={groupList}
                        />
                    </Modal>
                </div>

            )

    }
}