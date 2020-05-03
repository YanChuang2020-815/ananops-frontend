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
        // this.getBillNumByUserId();
        // this.getBillNumByUserIdAndAmount();
        // this.getBillNumByUserIdAndState();
        // this.getBillNumByUserIdAndTransactionMethod1();
        // this.getBillNumByUserIdAndTransactionMethod2();
        // this.getBillNumByUserIdAndTransactionMethod3();
        // this.getTransactionMethodOption();
        // this.getAmountOption();
    }

    // // 绘制图表
    // getTransactionMethodOption = () => ({
    //     title:{
    //         text:'账单支付方式统计',
    //         x:'center',
    //         y:'top',
    //       },
    //       legend:{
    //         top:20,
    //         bottom:20,
    //         data:['现结','账期','年结']
    //       },
    //       series:[
    //         //饼图中的series没有x,y轴，所以通过series中必须有value和name
    //         {
    //           name:'账单量',
    //           type:'pie',
    //           radius:['20%','50%'], //控制内环、外环
    //           data:[
    //           { 
    //             value:this.state.billNumByUserIdAndTransactionMethod1,
    //             name:'现结'
    //           },{ 
    //             value:this.state.billNumByUserIdAndTransactionMethod2,
    //             name:'账期'
    //           },{ 
    //             value:this.state.billNumByUserIdAndTransactionMethod3,
    //             name:'年结'
    //           },
    //           ]
    //         }
    //     ]
    // });

    // // 绘制图表
    // getAmountOption = () => ({
    //     title:{
    //         text:'账单金额统计',
    //         x:'center',
    //         y:'top',
    //       },
    //       legend:{
    //         top:20,
    //         bottom:20,
    //         data:['1000元以下','1000元以上']
    //       },
    //       series:[
    //         //饼图中的series没有x,y轴，所以通过series中必须有value和name
    //         {
    //           name:'账单量',
    //           type:'pie',
    //           radius:['20%','50%'], //控制内环、外环
    //           data:[
    //           { 
    //             value:this.state.billNumByUserId-this.state.billNumByUserIdAndAmount,
    //             name:'1000元以下'
    //           },{ 
    //             value:this.state.billNumByUserIdAndAmount,
    //             name:'1000元以上'
    //           },
    //           ]
    //         }
    //     ]
    // });

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
            url: '/bill/bill/getAllByUser/'+userId,
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
    // //获取统计信息:根据用户id获取账单数量
    // getBillNumByUserId = () => {
    //     const userId=this.state.id
    //     console.log(userId)
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getBillNumByUserId/{userId}?userId='+userId,
    //         headers: {
    //             'Content-Type': 'application/json',
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             billNumByUserId: res.data.result,
    //         }) ;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }
    // //获取统计信息:根据用户id和支付状态获取账单数量
    // getBillNumByUserIdAndState = () => {
    //     const userId=this.state.id
    //     console.log(userId)
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getBillNumByUserIdAndState/{userId}/{state}',
    //         params:{
    //             'userId': userId,
    //             'state': '创建中',
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             billNumByUserIdAndState: res.data.result,
    //         }) ;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }
    // //获取统计信息:根据用户id和交易方式获取帐单数量
    // getBillNumByUserIdAndTransactionMethod1 = () => {
    //     const userId=this.state.id
    //     console.log(userId)
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getBillNumByUserIdAndTransactionMethod/{userId}/{transactionMethod}',
    //         params: {
    //             'userId': userId,
    //             'transactionMethod': '现结',
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             billNumByUserIdAndTransactionMethod1: res.data.result,
    //         }) ;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }
    // //获取统计信息:根据用户id和交易方式获取帐单数量
    // getBillNumByUserIdAndTransactionMethod2 = () => {
    //     const userId=this.state.id
    //     console.log(userId)
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getBillNumByUserIdAndTransactionMethod/{userId}/{transactionMethod}',
    //         params: {
    //             'userId': userId,
    //             'transactionMethod': '账期',
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             billNumByUserIdAndTransactionMethod2: res.data.result,
    //         }) ;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }
    // //获取统计信息:根据用户id和交易方式获取帐单数量
    // getBillNumByUserIdAndTransactionMethod3 = () => {
    //     const userId=this.state.id
    //     console.log(userId)
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getBillNumByUserIdAndTransactionMethod/{userId}/{transactionMethod}',
    //         params: {
    //             'userId': userId,
    //             'transactionMethod': '年结',
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             billNumByUserIdAndTransactionMethod3: res.data.result,
    //         }) ;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }
    // //获取统计信息:根据用户id和预约金额获取账单数量
    // getBillNumByUserIdAndAmount = () => {
    //     const userId=this.state.id
    //     console.log(userId)
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getBillNumByUserIdAndAmount/{userId}/{amount}?',
    //         params: {
    //             'userId': userId,
    //             'amount': 1000,
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             billNumByUserIdAndAmount: res.data.result,
    //         }) ;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }
    // //删除该项目
    // deleteGroup=(record)=>{
    //     console.log(record)
    //     axios({
    //         method:'POST',
    //         url:'/pmc/project/deleteProjectById/'+record.id,
    //         headers:{
    //             'deviceId': this.deviceId,
    //             'Authorization':'Bearer '+this.state.token,
    //         }           
    //     }) 
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res.data.result)
    //         // this.getGroupList(this.state.nowCurrent)
    //         this.getGroupList()
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }
    // selectActivity=(value)=>{
    //     axios({
    //         method: 'POST',
    //         url: '/pmc/project/getProjectListByGroupId/'+value,
    //         headers: {
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res.data.result)
    //         this.setState({
    //             data: res.data.result.list,
    //             // nowCurrent:res.data.result.pageNum-1
    //         }) ;
    //         console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }

    render() {
        const {
         data,
         nowCurrent,
         size,
         add,
         billNumByUserId,
         billNumByUserIdAndState,
        //  billNumByUserIdAndTransactionMethod1,
        //  billNumByUserIdAndTransactionMethod2,
        //  billNumByUserIdAndTransactionMethod3,
        //  billNumByUserIdAndAmount,
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
                {/* <h1>账单统计</h1>
                <div>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Card title="账单总数" bordered={false}>
                                <Statistic value={billNumByUserId}/>
                            </Card>
                            <Card title="创建中账单总数" bordered={false}>
                                <Statistic value={billNumByUserIdAndState}/>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <ReactEcharts option={this.getTransactionMethodOption()}/>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <ReactEcharts option={this.getAmountOption()}/>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card title="账单完成量" bordered={false}>
                                <Progress type="circle" percent={(1-(billNumByUserIdAndState/billNumByUserId)).toFixed(2) * 100}/>
                            </Card>
                        </Col>
                    </Row>
                </div> */}
                <div className="searchPart">
                <Row>
                    {/* <Col span={2}>巡检人姓名：</Col> */}
                    {/* <Col span={5}>
                    <Search
                        placeholder="请输入组织ID"
                        enterButton
                        onSearch={value => this.selectActivity(value)}
                    />
                    </Col> */}
                    <Col push={20}>
                    {/* <Link to={"/cbd/pro/project/new"}>
                        <Button type="primary">
                                    +新建项目
                        </Button>
                    </Link> */}
                    </Col>
                </Row> 
                </div>
                <Table
                className="group-list-module"
                bordered
                showHeader={true}
                // pagination={{
                //     current,
                //     // total,
                //     pageSize: limit,
                //     onChange: this.handlePageChange,
                //     // showTotal: () => `共${allCount} 条数据`
                // }}
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
            
                        {/* <Link
                        to={`/cbd/pro/project/edit/${record.id}`}
                        style={{marginRight:'12px'}}
                        >修改</Link> */}
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