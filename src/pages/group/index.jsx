import React, {Component} from 'react'
import {Tree, Button, Table, Card, message, Modal, Popconfirm, Icon} from 'antd'
import menuConfig from '../../config'
import AddForm from './add-group'
import UpdateForm from './update-group'
import DetailForm from './details-group'
import AddAdminForm from './add-group-admin'
import UpdateAdminForm from './update-group-admin'
import {reqGroupList, reqAddOrUpdateGroup, reqGroupTree, reqDeleteGroupById, reqQueryById,reqGetCompanyList} from '../../axios/index'
import {formatDate} from '../../utils/dateUtils'
import LinkButton from "../../components/link-button";

const TreeNode = Tree.TreeNode
export default class Group extends Component {

    state = {
        groups: [],
        groupList: [],//上级组织列表
        groupTree: [],
        isShowAdd: false,
        isShowUpdate: false,
        isShowDetails:false,
        item: {},
        group: {},
        companyList:[],//企业列表
        roleCode: window.localStorage.getItem('roleCode'),
    }


    initColumns = () => {
        this.columns = [
            {
                title: '企业名称',
                dataIndex: 'groupName',
                width: 150
            },
            {
                title: '企业统一信用编码',
                dataIndex: 'groupCode',
                width: 150
            },
            {
                title: 'ID',
                dataIndex: 'id',
                width: 120,
            },
            {
                title: '父组织ID',
                dataIndex: 'pId',
                width: 100,
            },
            {
                title: '企业地址',
                dataIndex: 'groupAddress',
                width: 150
            },
            {
                title: '联系人',
                dataIndex: 'contact',
                width: 100
            },
            {
                title: '联系电话',
                dataIndex: 'contactPhone',
                width: 100
            },
            {
                title: '创建人',
                dataIndex: 'creator',
                width: 100
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                width: 100,
                render: formatDate
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (status) => {
                    return <span>{status === 0 ? '启用' : '禁用'}</span>
                }
            },
            {
                title: '企业描述',
                dataIndex: 'status',
                width: 200,
            },
            {
                title: '操作',
                width: 200,
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <span>
                 <Button type="primary" size={"small"} onClick={() => this.showUpdate(record)}>修改</Button>
                  <Popconfirm
                      title="确定要删除吗？"
                      onConfirm={() => {
                          this.deleteGroupById(record.id)
                      }}
                  >
                            <Button
                                size={"small"}
                                type="danger"
                            >删除</Button>
                        </Popconfirm>
            </span>

                    )

                }

            }
        ]
    }


    getGroups = async () => {
        const result = await reqGroupList()
        if (result.code === 200) {
            this.setState({groups: result.result})
        }
    }

    getCompanyList = async  () => {
        const data  = await  reqGetCompanyList();
        if (data.code === 200) {
            this.setState({companyList: data.result})
        }
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

    //显示组织详情
    showDetails= async (id) => {
        const data = await reqQueryById(id);
        console.log(data.result);
        this.setState({group: ""})
        this.setState({group: data.result,isShowDetails: true})
    }
    //修改组织
    showModify = async (id) => {
        console.log(id);
        const data = await reqQueryById(id);
        console.log(data);
        this.showUpdate(data.result)
    }

    //删除组织
    deleteGroupById = async (id) => {
        console.info(id);
        const data = await reqDeleteGroupById(id);
        console.log(data);
        if (data.code === 10015007) {
            message.error("该组织下还存在子节点，不能将其删除");
        } else if (data.code === 10015008) {
            message.error("该组织下绑定的用户，不能将其删除")
        } else {
            message.success("删除成功");
            this.getGroups();
            this.getGroupTree();
            this.getGroupList();
            this.getCompanyList();
        }

    }

    //显示添加页面
    showAdd = (data) => {
        console.log(data)
        this.setState({item: ""})
        this.setState({isShowAdd: true, item: data})
    }
    //显示修改页面
    showUpdate = (data) => {
        console.log(data)
        this.setState({group: data})
        this.setState({isShowUpdate: true, group: data})
    }

    //动态构建机构树形菜单
    renderTree = (data) => {
        console.log('树形菜单数据源', data);
        return data.map(item => {
            if (!item.subMenu) {
                return (
                    <TreeNode title={
                        <span style={{display: "flex", justifyContent: "flex-start", width: 550}}>
                            <span>| - - <Icon type="appstore"/> {item.menuName} </span>
                            <span>
                                {/* <Button type="link" size={"small"} onClick={() => this.showDetails(item.id)} >详情</Button>
                                <Button size={"small"} onClick={() => this.showModify(item.id)} style={{marginRight: 5}}>修改</Button> */}
                                <Button type="primary" size={"small"} onClick={() => this.showAdd(item)} style={{marginRight: 5, marginLeft: 10}}>添加</Button>
                                <Popconfirm
                                    title="确定要删除吗？"
                                    onConfirm={() => {
                                        this.deleteGroupById(item.id)
                                    }}
                                >
                                            <Button
                                                size={"small"}
                                                type="danger"
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
                        <span style={{display: "flex", justifyContent: "flex-start", width: 550}}>
                            <span>| - - <Icon type="appstore"/> {item.menuName}</span>
                            <span>
                                {/* <Button type="link" size={"small"} onClick={() => this.showDetails(item.id)} >详情</Button>
                            <Button size={"small"} onClick={() => this.showModify(item.id)} style={{marginRight: 5}}>修改</Button> */}
                            <Button type="primary" size={"small"} onClick={() => this.showAdd(item)} style={{marginRight: 5, marginLeft: 10}}>添加</Button>
                            <Popconfirm
                                title="确定要删除吗？"
                                onConfirm={() => {
                                    this.deleteGroupById(item.id)
                                }}
                            >
                                        <Button
                                            size={"small"}
                                            type="danger"
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

    //获取上级组织列表
    getGroupList = async () => {
        const group = await reqGroupList()
        if (group.code === 200) {
            const groupList = group.result.map((item) => [item.id, item.groupName])
            console.log(groupList)
            this.setState({groupList})
        }

    }


    saveGroup = async () => {
        const newGroup = this.form.getFieldsValue()
        //this.form.resetFields()
        console.log(newGroup)

        const result = await reqAddOrUpdateGroup(newGroup)
        if (result.code === 200) {
            this.form.resetFields()
            this.getGroups()
            this.setState({isShowAdd: false})
            this.setState({isShowUpdate: false})
            this.getGroupTree()
            this.getGroupList()
            this.getCompanyList()
            message.success("组织添加成功")
        }
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuConfig)
        console.log(menuConfig)
        this.initColumns()
        this.getGroupTree()
    }

    componentDidMount() {
        this.getGroups()
        this.getGroupList()
        this.getCompanyList()
    }

    onSelect = async(e) => {
        if (e.length > 0) {
            const data = await reqQueryById(e);
            this.setState({group: data.result})
        }
      };

    render() {
        const {companyList,groups, groupList, groupTree, isShowAdd, isShowUpdate, item, group,isShowDetails} = this.state
        const groupTreeNodes = this.renderTree(groupTree);
        const roleCode = this.state.roleCode
            return (
                <div>
                    <div style={{display:"flex", marginTop:50}}>
                        <div style={{width:400, marginLeft: 30}}>
                            <Tree
                                style={{width: "30%"}}
                                onSelect={this.onSelect}
                                defaultExpandAll={true}
                            >
                                {groupTreeNodes}
                            </Tree>
                        </div>
                        <div style={{width:500, marginLeft: 90}}>
                            <Card title={<Button type="primary" onClick={() => this.saveGroup()}>保存</Button>}>
                            <UpdateForm
                                setForm={(form) => {
                                    this.form = form
                                }}
                                groupList={groupList}
                                group={group}
                            />
                            </Card>
                        </div>
                    </div>
                    
                    <Modal
                        title={"添加部门"}
                        visible={isShowAdd}
                        onOk={this.saveGroup}
                        onCancel={() => {
                            this.setState({isShowAdd: false});
                            this.form.resetFields();
                        }}
                    >
                        <AddForm
                            setForm={(form) => {
                                this.form = form
                            }}
                            groupList={groupList}
                            item={item}
                        />
                    </Modal>
                    <Modal
                        title={"修改部门"}
                        visible={isShowUpdate}
                        onOk={this.saveGroup}
                        onCancel={() => {
                            this.setState({isShowUpdate: false});
                            this.form.resetFields();
                        }}
                    >
                        <UpdateForm
                            setForm={(form) => {
                                this.form = form
                            }}
                            groupList={groupList}
                            group={group}
                        />
                    </Modal>
                    <Modal
                        title={"部门详情"}
                        visible={isShowDetails}
                        onOk={() => {
                            this.setState({isShowDetails: false});
                        }}
                        onCancel={() => {
                            this.setState({isShowDetails: false});
                        }}
                    >
                        <DetailForm
                            setForm={(form) => {
                                this.form = form
                            }}
                            groupList={groupList}
                            group={group}
                        />
                    </Modal>
                </div>

            )

    }
}