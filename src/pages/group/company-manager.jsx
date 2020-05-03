import React, {Component} from 'react'
import {Tree, Button, Table, Card, message, Modal, Popconfirm, Tag, Input} from 'antd'
import UpdateAdminForm from './update-group-admin'
import {
    reqAddOrUpdateGroup,
    reqDeleteGroupById,
    reqGetCompanyList
} from '../../axios/index'
import {formatDate} from '../../utils/dateUtils'
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export default class CompanyManager extends Component {

    state = {
        groups: [],
        groupList: [],//上级组织列表
        groupTree: [],
        isShowAdd: false,
        isShowUpdate: false,
        isShowDetails: false,
        item: {},
        group: {},
        companyList: [],//企业列表
        roleCode: window.localStorage.getItem('roleCode'),
    }


    initColumns = () => {
        this.columns = [
            {
                title: '序号',
                width: 50,
                fixed:'left',
                render:(text,record,index)=> `${index+1}`,
            },
            {
                title: '企业名称',
                dataIndex: 'groupName',
                width: 200,
                ...this.getColumnSearchProps('groupName'),
            },
            {
                title: '企业统一信用编码',
                dataIndex: 'groupCode',
                width: 200,
                ...this.getColumnSearchProps('groupCode'),
            },
            {
                title: '企业唯一ID',
                dataIndex: 'id',
                width: 180,
            },
            {
                title: '企业地址',
                dataIndex: 'groupAddress',
                width: 200
            },
            {
                title: '联系人',
                dataIndex: 'contact',
                width: 100
            },
            {
                title: '联系电话',
                dataIndex: 'contactPhone',
                width: 150
            },
            {
                title: '创建人',
                dataIndex: 'creator',
                width: 100
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                width: 200,
                render: formatDate
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                ...this.getColumnSearchProps('status'),
                render: (status) => {
                    return <span>{status === 0 ? '启用' : '禁用'}</span>
                }
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

    getCompanyList = async () => {
        const data = await reqGetCompanyList();
        console.log(data)
        if (data.code === 200) {
            this.setState({companyList: data.result})
        }
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
            this.getCompanyList();
        }

    }

    //显示修改页面
    showUpdate = (data) => {
        console.log(data)
        this.setState({group: ""})
        this.setState({isShowUpdate: true, group: data})
    }

    saveGroup = async () => {
        const newGroup = this.form.getFieldsValue()
        //this.form.resetFields()
        console.log(newGroup)

        const result = await reqAddOrUpdateGroup(newGroup)
        if (result.code === 200) {
            this.form.resetFields()
            this.setState({isShowUpdate: false})
            this.getCompanyList()
            message.success("组织添加成功")
        }
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getCompanyList();
    }
    //搜索
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    清空
                </Button>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const {companyList,groupList,isShowUpdate, group,} = this.state

        return (
            <div>
                {/* <div style={{display: "flex", justifyContent: "center", marginTop: 50}}> */}
                    <Table
                        style={{width: "100%"}}
                        bordered
                        rowKey="id"
                        size='small'
                        dataSource={companyList}
                        columns={this.columns}
                        scroll={{x: 1500}}
                    />
                {/* </div> */}
                <Modal
                    title={"修改企业"}
                    visible={isShowUpdate}
                    onOk={this.saveGroup}
                    onCancel={() => {
                        this.setState({isShowUpdate: false});
                        this.form.resetFields();
                    }}
                    width={850}
                >
                    <UpdateAdminForm
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