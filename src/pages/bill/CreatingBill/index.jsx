import React, { Component, } from 'react';
import {Button, Row, Col, Table, Input, Popconfirm, message, Card, Statistic, Progress, Icon, Tag, Modal} from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { Menu} from 'antd';
import Header from 'antd/lib/calendar/Header';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import ReactEcharts from 'echarts-for-react';

//import './index.styl'
const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;
class Bill extends Component{
    constructor(props){
        super(props);
        this.state={
            token:window.localStorage.getItem('token'),
            current: FIRST_PAGE,
            id:window.localStorage.getItem('id'),
            connectVisible:false,
            disVisible:false,
            data:[],
            add:{},
            projectId:null,
            billNumByUserId:null,
            billNumByUserIdAndState:null,
            billNumByUserIdAndTransactionMethod1:null,
            billNumByUserIdAndTransactionMethod2:null,
            billNumByUserIdAndTransactionMethod3:null,
            billNumByUserIdAndAmount:null,
        }
        this.getGroupList = this.getGroupList.bind(this);
    }
    componentDidMount(){
        //保存当前页面的路由路径
        // this.getGroupList(FIRST_PAGE);   
        this.getGroupList();   
    }

    //分页
    handlePageChange = (page) => {
        this.getGroupList(page-1)
    }
    //获取列表信息+分页
    // getGroupList = (page) => {
    //     const { size, } = this.state;
    //     const values={orderBy:'',pageSize:size,pageNum:page}
    //     axios({
    //         method: 'POST',
    //         url: '/pmc/project/getProjectListWithPage',
    //         headers: {
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //         data:values
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res.data.result)
    //         this.setState({
    //             data: res.data.result.list,
    //             nowCurrent:res.data.result.pageNum-1
    //         }) ;
    //         console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }
    //获取信息列表 无分页
    getGroupList = () => {
        const userId=this.state.id
        console.log(userId)
        axios({
            method: 'GET',
            url: '/bill/bill/getBillsByUserIdAndState/{userId}/{state}',
            params:{
                'userId':userId,
                'state':'创建中',
            },
            headers: {
               'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
        .then((res) => {
            if(res && res.status === 200){
            console.log(res)
            this.setState({
                data: res.data.result,
            }) ;
            // console.log(this.state.data)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }

    render() {
        const {
         data,
         nowCurrent,
         size,
         add,
         billNumByUserId,
         billNumByUserIdAndState,
        } = this.state;
        // const total = allCount
        const current = nowCurrent+1
        const limit = size
        return(
            <div>
                <div>
                    <h1>费用账单</h1>
                    <Row>
                        <Col span={2}>
                            <Link to={"/cbd/bill/index"}>
                                <Button type="primary">
                                    账单总览
                                </Button>
                            </Link>
                        </Col>
                        <Col span={2}>
                            <Link to={"/cbd/bill/history"}>
                                <Button type="primary">
                                    账单明细
                                </Button>
                            </Link>
                        </Col>
                        <Col span={2}>
                            <Link to={"/cbd/bill/creatingBill"}>
                                <Button type="primary">
                                    未完成账单
                                </Button>
                            </Link>
                        </Col>
                        <Col span={2}>
                            <Link to={"/cbd/bill/finishedBill"}>
                                <Button type="primary">
                                    已完成账单
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </div>
                <Table
                className="group-list-module"
                bordered
                showHeader={true}
                size='small'
                rowClassName={this.setRowClassName}
                dataSource={data}
                columns={[{
                    title: '流水号',
                    key: 'id',
                    render: (text, record) => {
                    return ((record.id && record.id) || '--')
                    }   
                }, {
                    title: '支付方式',
                    key: 'paymentMethod',
                    render: (text, record) => {
                    return (record.paymentMethod && record.paymentMethod) || '--'
                    }
                }, {
                    title: '交易方式',
                    key: 'transactionMethod',
                    render: (text, record) => {
                    return (record.transactionMethod && record.transactionMethod) || '--'
                    }
                },{
                    title: '总价', 
                    key: 'amount',
                    render: (text, record) => {
                    return (record.amount&& record.amount + "元") || '--'
                    }
                }, {
                    title: '用户名',
                    key: 'userName',
                    render: (text, record) => {
                    return (record.userName && record.userName) || '--'
                    }
                },{
                    title: '消费时间',
                    key: 'time',
                    render: (text, record) => {
                    return  (record.time &&  moment(parseInt(record.time)).format('YYYY-MM-DD HH:mm:ss')) || '--'
                    }
                },{
                    title: '供应商',
                    key: 'supplierName',
                    render: (text, record) => {
                    return (record.supplierName && record.supplierName) || '--'
                    }
                },
                {
                  title: '工单ID',
                  key: 'wordOrderId',
                  render: (text, record) => {
                  return (record.workOrderId && record.workOrderId) || '--'
                  }
              },{
                title: '支付状态',
                key: 'state',
                render: (text, record) => {
                return (record.state && record.state) || '--'
                }
            },
              {
                    title: '操作',
                    render: (text, record, index) => (
                    <div className="operate-btns"
                        style={{ display: 'block' }}
                    >
                        <Link
                        to={`/cbd/bill/detail/${record.id}`}
                        style={{marginRight:'12px'}}
                        >详情</Link>
            
                        <Link to={`/cbd/bill/alipay/${record.id}`} 
                        style={{marginRight: '12px'}}
                        >前往支付</Link>
                    </div>
                    ),
                }
              ]}
                />
         </div>
        )
    }
}
export default Bill;