import React, { Component, } from 'react';
import { Button,Row,Col,Table,Input,Popconfirm,message  } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import './index.styl'
const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;

class Engineer extends Component{
    constructor(props){
        super(props)
        this.state={
            current: FIRST_PAGE,
            size: PAGE_SIZE,
            total: 20, 
            nowCurrent:FIRST_PAGE,
            data:{
                data:[
                    {
                        "education": "string",
                        "employmentStart": "2019-12-11T07:39:41.984Z",
                        "expirationDate": "string",
                        "id": 0,
                        "identityNumber": "string",
                        "location": "string",
                        "name": "string",
                        "phone": "string",
                        "photo": "string",
                        "position": "string",
                        "sex": "string",
                        "title": "string"                     
                    }
                ],
                limit:3,
                page:0,
                allCount:0,
            }
        }
    }
    render(){
        const {
            data:{
              allCount,
              data,
              limit,
              page,
            },
          } = this.state;
          const total = allCount
          const current = page+1
          const size = limit
        return(
            <div>
            <div className="searchPart">
            <Row>
                {/* <Col span={2}>巡检人姓名：</Col> */}
                <Col span={5}>
                <Search
                    placeholder="搜索从这里开始"
                    enterButton
                    onSearch={value => this.selectActivity(value)}
                />
                </Col>
                <Col push={16}>
                <Link to={"/serviceProvider/engineer/new"}>
                    <Button type="primary">
                                +添加工程师
                    </Button>
                </Link>
                </Col>
            </Row> 
            </div>
            <Table
            // className="group-list-module"
            bordered
            size='small'
            showHeader={true}
            pagination={{
                current,
                total,
                pageSize: size,
                onChange: this.handlePageChange,
                // showTotal: () => `共${allCount} 条数据`
            }}
            rowClassName={this.setRowClassName}
            dataSource={data}
            columns={[
            {
                title:'序号',
                fixed:'left',
                render:(text,record,index)=> `${index+1}`,
            },{
                title: '工程师ID',
                key: 'id',
                render: (text, record) => {
                return ((record.id && record.id) || '--')
                }   
            }, {
                title: '姓名',
                key: 'name',
                render: (text, record) => {
                return (record.name && record.name) || '--'
                }
            }, {
                title: '性别',
                key: 'sex',
                render: (text, record) => {
                return (record.sex && record.sex) || '--'
                }
            },
            {
                title: '所在省市', 
                key: 'location',
                render: (text, record) => {
                return (record.location && record.location) || '--'
                }
            }, {
                title: '身份证号码',
                key: 'identityNumber',
                render: (text, record) => {
                return (record.identityNumber && record.identityNumber) || '--'
                }
            },{
                title: '身份证有效期',
                key: 'expirationDate',
                render: (text, record) => {
                return (record.expirationDate && record.expirationDate) || '--'
                }
            },{
                title: '职务',
                key: 'position',
                render: (text, record) => {
                return (record.position && record.position) || '--'
                }
            },
            {
                title: '联系电话',
                key: 'phone',
                render: (text, record) => {
                return (record.phone && record.phone) || '--'
                }
            },
            {
                title: '操作',
                render: (text, record, index) => (
                <div className="operate-btns"
                    style={{ display: 'block' }}
                >
                    <Link
                    to={`/serviceProvider/engineer/detail/${record.id}`}
                    style={{marginRight:'12px'}}
                    >详情</Link>               
                    <Link
                    to={`/serviceProvider/engineer/edit/${record.id}`}
                    style={{marginRight:'12px'}}
                    >修改</Link>
                    <Link
                    to={`/serviceProvider/engineer/delete/${record.id}`}
                    style={{marginRight:'8px'}}
                    >删除</Link>
                    {/* <Popconfirm
                            title="确定要删除吗？"
                            onConfirm={()=> {this.deleteGroup(record)}}
                        >
                            <Button 
                            type="simple"
                            style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
                            >删除</Button>
                        </Popconfirm> */}
                </div>
                ),
            }]}
        />
     </div>
        )
    }
}
export default Engineer;