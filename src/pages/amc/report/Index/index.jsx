import React, {Component,} from 'react';
import {Button, Row, Col, Table, Input, Popconfirm, message, Card, Statistic, Progress, Icon, Tag} from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios'

const PAGE_SIZE = 10;

class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: window.localStorage.getItem('token'),
            size: PAGE_SIZE,
            total: 0,
            data: [],
            alarmCount: null,
            processedCount: null,
            urgencyCount: null,
            dealingCount: null,
        }
        this.getAlarmListByGroupId = this.getAlarmListByGroupId.bind(this);

    }

    componentDidMount() {
        //保存当前页面的路由路径
        this.getAlarmListByGroupId(1);
        this.getAlarmCount();
        this.getProcessedCount();
        this.getUrgencyCount();
        this.getDealingCount();
    }

    //获取告警总数
    getAlarmCount = () => {
        axios({
            method: 'POST',
            url: '/amc/alarm/getAllAlarmCount',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        alarmCount: res.data.result,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //获取待处理告警数
    getDealingCount = () => {
        axios({
            method: 'POST',
            url: '/amc/alarm/getDealingCount',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        dealingCount: res.data.result,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //获取急需处理告警数
    getUrgencyCount = () => {
        axios({
            method: 'POST',
            url: '/amc/alarm/getUrgencyCount',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        urgencyCount: res.data.result,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //获取已处理告警数
    getProcessedCount = () => {
        axios({
            method: 'POST',
            url: '/amc/alarm/getDealedCount',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        processedCount: res.data.result,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getAlarmListByGroupId = (pageNum) => {
        this.pageNum = pageNum
        const baseQuery = {orderBy: 'updateTime', pageSize: PAGE_SIZE, pageNum: `${pageNum}`}
        axios({
            method: 'POST',
            url: '/amc/alarm/getAlarmListByGroupId',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            },
            data: baseQuery
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        data: res.data.result.list,
                        total: res.data.result.total,
                    });
                    console.log(res.data.result)
                    console.log(this.state)
                    console.log(this.pageNum)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    deleteAlarmByAlarmId = (record) => {
        axios({
            method: 'POST',
            url: '/amc/alarm/deleteAlarmByAlarmId/' + record.id,
            headers: {
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + this.state.token,
            }
        })
            .then((res) => {
                if (res && res.status === 200) {
                    console.log(res.data.result)
                    this.getAlarmListByGroupId(1)
                    this.getAlarmCount();
                    this.getProcessedCount();
                    this.getUrgencyCount();
                    this.getDealingCount();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        const {
            data,
            urgencyCount,
            processedCount,
            alarmCount,
            dealingCount,
            total,
        } = this.state;
        const columns = [
                {
                    title: '等级',
                    dataIndex: 'alarmLevel',
                    key: 'alarmLevel',
                    filters: [
                        {
                            text: '紧急',
                            value: 1,
                        },
                        {
                            text: '可疑',
                            value: 2,
                        },
                        {
                            text: '提醒',
                            value: 3,
                        },
                    ],
                    render:
                        (text, record) => {
                            return (record.alarmLevel === 1 ? <Tag color="#FF1A19">紧急</Tag> : (record.alarmLevel === 2 ?
                                <Tag color="#ffc573">可疑</Tag> : <Tag color="#674E2E">提醒</Tag>))

                        }
                },
                {
                    title: '告警名称',
                    key:
                        'alarmName',
                    render:
                        (text, record) => {
                            return (record.alarmName && record.alarmName) || '--'
                        }
                }
                ,
                {
                    title: '告警资产',
                    key:
                        'alarmAsset',
                    render:
                        (text, record) => {
                            return (record.alarmAsset && record.alarmAsset) || '--'
                        }

                }
                ,
                {
                    title: '告警设备位置',
                    key:
                        'alarmLocation',
                    render:
                        (text, record) => {
                            return (record.alarmLocation && record.alarmLocation) || '--'
                        }

                },
                {
                    title: '最新发生时间',
                    key:
                        'lastOccurTime',
                    render:
                        (text, record) => {
                            return (record.lastOccurTime && record.lastOccurTime) || '--'
                        }
                }
                ,
                {
                    title: '描述',
                    key:
                        'description',
                    render:
                        (text, record) => {
                            return (record.description && record.description) || '--'
                        }
                }
                ,
                {
                    title: '状态',
                    key:
                        'alarmStatus',
                    render:
                        (text, record) => {
                            if (record.alarmStatus === 1) {
                                return <Tag color="red">未处理</Tag>;
                            } else {
                                return <Tag color="blue">已处理</Tag>;
                            }
                        }

                }
                ,
                {
                    title: '操作',
                    key:
                        'action',
                    render:
                        (text, record) => (
                            <div className="operate-btns"
                                 style={{display: 'block'}}
                            >
                                <Link
                                    to={`/cbd/amc/report/detail/${record.id}`}
                                    style={{marginRight: '12px'}}
                                >详情</Link>
                                <Link
                                    to={`/cbd/amc/alarm/modify/${record.id}`}
                                    style={{marginRight: '12px'}}
                                >修改</Link>
                                <Popconfirm
                                    title="确定要删除吗？"
                                    onConfirm={() => {
                                        this.deleteAlarmByAlarmId(record)
                                    }}
                                >
                                    <Button
                                        type="simple"
                                        style={{border: 'none', padding: 0, color: "#357aff", background: 'transparent'}}
                                    >删除</Button>
                                </Popconfirm>

                            </div>
                        ),

                }
                ,
            ]
        ;
        return (
            <div>
                <div>
                    <h1>安全告警处理</h1>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Card title="告警总数" bordered={false}>
                                <Statistic value={alarmCount}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="急需处理告警数" bordered={false}>
                                <Statistic value={urgencyCount}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="未处理告警数" bordered={false}>
                                <Statistic value={dealingCount}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="已处理告警数" bordered={false}>
                                <Statistic value={processedCount}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="告警处理率" bordered={false}>
                                <Statistic value={(processedCount / alarmCount).toFixed(2) * 100+"%"}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="数据显示率" bordered={false}>
                                <Statistic value={100+"%"}/>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div>
                    <Link to={`/cbd/amc/alarm/create/`}>
                        <Button type="danger"> +发起报警</Button>
                    </Link>
                </div>
                <div>
                    <Table rowKey="id"
                           dataSource={data}
                           columns={columns}
                           size='small'
                           pagination={{
                               current: this.pageNum,
                               defaultPageSize: 10,
                               showQuickJumper: true,
                               total: total,
                               onChange: this.getAlarmListByGroupId,
                           }}
                    />
                </div>
            </div>
        )
    }
}

export default Report;