import React, { Component, } from 'react'
import { Row, Col, Table, Icon, Button } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
import items from '../../../../config/status'
import { Steps, Popover } from 'antd';


const { Step } = Steps;

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);


class Process extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            token: window.localStorage.getItem('token'),
        }
        this.getGroupList = this.getGroupList.bind(this);
    }
    componentDidMount() {//重写组件生命周期

        const {
            match: { params: { id } }
        } = this.props
        console.log(id)
        this.getGroupList(id);

    }
    //获取列表信息
    getGroupList = (id) => {
        axios({
            method: 'GET',
            url: '/mdmc/mdmcTask/getTaskLogs/' + id,
            headers: {
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    console.log(res)
                    this.setState({
                        data: res.data.result,
                    });
                    // console.log(this.state.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    //获取状态数值
    setStatus = (status) => {
        var msg = this.getStatusInfo(status)
        let statusMsg = msg.name
        return statusMsg
    }

    getStatusInfo = (status) => {
        var a = items.find(item => {
            return item.status === status;
        })
        return a
    }



    render() {
        const {
            match: { params: { id } }
        } = this.props
        const { data } = this.state


        return (
            <div>
                <div className="searchPart">
                    <Row>
                        <Col span={5}>
                            {/* <Link to={`/cbd/maintain/data`}>
                                <Button type="primary" >返回工单</Button>
                            </Link> */}
                        </Col>
                    </Row>
                </div>


                <div className="searchPart">
                    <Row>
                        <Col span={5}>
                            <Link to={`/cbd/maintain/data`}>
                                
                            </Link>
                        </Col>
                    </Row>
                </div>

                <div className="searchPart">
                    <Row>
                        <Col span={5}>
                            <Link to={`/cbd/maintain/data`}>
                                
                </Link>
                        </Col>
                    </Row>
                </div>

                <div className="searchPart">
                    <Row>
                        <Col span={5}>
                            <Link to={`/cbd/maintain/data`}>
                                
                </Link>
                        </Col>
                    </Row>
                </div>
        
                <Steps current={1} progressDot={customDot}>
                    <Step title="已提交"   description="" />
                    <Step title="审核通过" description="" />
                    <Step title="服务商接单" description="" />
                    <Step title="工程师接单" description="" />
                    <Step title="已处理" description="" />
                </Steps>,
                <Table
                    className="group-list-module"
                    bordered
                    size='small'
                    showHeader={true}
                    // pagination={{
                    //     current,
                    //     total,
                    //     pageSize: size,
                    //     onChange: this.handlePageChange,

                    // }}
                    rowClassName={this.setRowClassName}
                    dataSource={data}
                    columns={[
                        //     {
                        //     title: 'ID',
                        //     key: 'id',
                        //     render: (text, record) => {
                        //     return ((record.id && record.id) || '--')
                        //     }   
                        // }, {
                        //     title: '工单ID',
                        //     key: 'taskId',
                        //     render: (text, record) => {
                        //     return (record.taskId && record.taskId) || '--'
                        //     }
                        // }, 
                        {
                            title: '序号',
                            width: 50,
                            fixed: 'left',
                            render: (text, record, index) => `${index + 1}`,
                        },
                        {
                            title: '工单状态',
                            key: 'status',
                            render: (text, record) => {
                                return (record.status && this.setStatus(record.status)) || '--'
                            }
                        },
                        // {
                        //     title: '状态时间戳', 
                        //     key: 'statusTimestamp',
                        //     render: (text, record) => {
                        //     return (record.statusTimestamp && record.statusTimestamp) || '--'
                        //     }
                        // }, {
                        //     title: '创建时间',
                        //     key: 'createdTime',
                        //     render: (text, record) => {
                        //     return (record.createdTime && record.createdTime) || '--'
                        //     }
                        // },
                        {
                            title: '操作执行者',
                            key: 'creator',
                            render: (text, record) => {
                                return (record.creator && record.creator) || '--'
                            }
                        }, {
                            title: '执行操作',
                            key: 'movement',
                            render: (text, record) => {
                                return (record.movement && record.movement) || '--'
                            }
                        },
                        {
                            title: '操作时间',
                            key: 'updateTime',
                            render: (text, record) => {
                                return (record.updateTime && record.updateTime) || '--'
                            }
                        }
                    ]}
                />
                <div style={{textAlign:"right"}}>
                    <Button type="primary" onClick={()=>this.props.history.goBack()} style={{marginRight:20, marginTop:10}}><Icon type='arrow-left'/>返回列表</Button>
                </div> 
            </div>
        )

    }

}
export default Process