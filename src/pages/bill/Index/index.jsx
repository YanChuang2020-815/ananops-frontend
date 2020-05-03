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
            // projectId:null,
            // billNumByUserId:null,
            // billNumByUserIdAndState:null,
            // billNumByUserIdAndTransactionMethod1:null,
            // billNumByUserIdAndTransactionMethod2:null,
            // billNumByUserIdAndTransactionMethod3:null,
            // billNumByUserIdAndAmount:null,
            // moneySumWithLength:null,
        }
        // this.getGroupList = this.getGroupList.bind(this);
    }
    componentDidMount(){
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var len = 5;
        //保存当前页面的路由路径
        // this.getGroupList(FIRST_PAGE);   
        // this.getMoneySumWithLength(year, month,len);
        // this.getGroupList();   
        // this.getBillNumByUserId();
        // this.getBillNumByUserIdAndAmount();
        // this.getBillNumByUserIdAndState();
        // this.getBillNumByUserIdAndTransactionMethod1();
        // this.getBillNumByUserIdAndTransactionMethod2();
        // this.getBillNumByUserIdAndTransactionMethod3();
        this.getStatistics(year, month, len);
        this.getTransactionMethodOption();
        this.getAmountOption();
        this.getBillConsumeOption();
    }

    getStatistics = (year, month, len) => {
        var userId = this.state.id;
        axios({
            method: 'GET',
            url: '/bill/bill/getStatistics/{userId}/{amount}/{year}/{month}/{length}',
            params: {
                'userId': userId,
                // 'userId': '835382621079864320',
                'amount': 1000,
                'year': year,
                'month':month,
                'length':len,
            },
            headers: {
                'Content-Type': 'application/json',
               'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
        })
        .then((res) => {
            if(res && res.status === 200){
            console.log(res)
            this.setState({
                data: res.data.result
            })
            // return res.data.result;
            // console.log(this.state.data)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    // 绘制柱状图
    getBillConsumeOption = () =>({
        title: {
            text: '消费趋势',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }
        },
        legend: {
            data:['消费金额']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: (function (){
                    var now = new Date();
                    var year = now.getFullYear();
                    var month = now.getMonth()+1;
                    var current = year + '-' + month;
                    var res = [];
                    var len = 5;
                    while (len--) {
                        res.unshift(current);
                        now.setMonth(now.getMonth()-1);
                        year = now.getFullYear();
                        month = now.getMonth()+1;
                        current = year + '-' + month;
                    }
                    return res;
                })()
            },
            {
                type: 'category',
                boundaryGap: true,
                data: (function (){
                    var res = [];
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                scale: false,
                boundaryGap: []
            },
            {
                type: 'value',
                scale: true,
                name: '￥',
                max: 500000,
                min: 0,
                boundaryGap: [0.2, 0.2]
            },
        ],
        series: [
            {
                name: '消费金额',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: (this.functionForBar)()
            },
        ]
    })

    // 绘制柱状图时需要使用的方法
    functionForBar (){
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var len = 5;
        // var res  = this.getMoneySum(year,month,len);
        var res = []
        // while(len--){
        //     // var data = Number(this.getMoneySum(year, month));
        //     res.push(50000);
        //     now.setMonth(now.getMonth()-1);
        //     year = now.getFullYear();
        //     month = now.getMonth()+1;
        // }
        // 此处前端获取不到后台的信息
        res = this.state.data.moneySum;
        // var res = [12340,242444,233442,455244];
        return  res;
    }

    // // 绘制柱状图时须调用的后台接口
    // getMoneySumWithLength = (year,month,len) =>{
    //     var userId = this.state.id;
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getMoneySumByUserIdYearMonthAndLength/{userId}/{year}/{month}/{length}',
    //         params: {
    //             'userId': userId,
    //             'year': year,
    //             'month':month,
    //             'length':len,
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //     })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             moneySumWithLength: res.data.result
    //         })
    //         // return res.data.result;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }

    // // 绘制柱状图时须调用的后台接口
    // getMoneySum = (year,month) =>{
    //     var userId = this.state.id;
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getMoneySumByUserIdYearAndMonth/{userId}/{year}/{month}',
    //         params: {
    //             'userId': userId,
    //             'year': year,
    //             'month':month,
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //     })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         return res.data.result;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }

    // //获取信息列表 无分页
    // getGroupList = () => {
    //     const userId=this.state.id
    //     console.log(userId)
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getAllByUser/'+userId,
    //         headers: {
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             data: res.data.result,
    //         }) ;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }

    // 绘制饼形图
    getTransactionMethodOption = () => ({
        title:{
            text:'账单支付方式统计',
            x:'center',
            y:'top',
          },
          legend:{
            top:20,
            bottom:20,
            data:['现结','账期','年结']
          },
          series:[
            //饼图中的series没有x,y轴，所以通过series中必须有value和name
            {
              name:'账单量',
              type:'pie',
              radius:['20%','50%'], //控制内环、外环
              data:[
              { 
                value:this.state.data.billNumByUserIdAndStateNowPay,
                name:'现结'
              },{ 
                value:this.state.data.billNumByUserIdAndStatePeriodPay,
                name:'账期'
              },{ 
                value:this.state.data.billNumByUserIdAndStateYearPay,
                name:'年结'
              },
              ]
            }
        ]
    });

    // 绘制图表
    getAmountOption = () => ({
        title:{
            text:'账单金额统计',
            x:'center',
            y:'top',
          },
          legend:{
            top:20,
            bottom:20,
            data:['1000元以下','1000元以上']
          },
          series:[
            //饼图中的series没有x,y轴，所以通过series中必须有value和name
            {
              name:'账单量',
              type:'pie',
              radius:['20%','50%'], //控制内环、外环
              data:[
              { 
                value:this.state.data.billNum-this.state.data.billNumByUserIdAndAmount,
                name:'1000元以下'
              },{ 
                value:this.state.data.billNumByUserIdAndAmount,
                name:'1000元以上'
              },
              ]
            }
        ]
    });

    // //分页
    // handlePageChange = (page) => {
    //     this.getGroupList(page-1)
    // }
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
    // //获取信息列表 无分页
    // getGroupList = () => {
    //     const userId=this.state.id
    //     console.log(userId)
    //     axios({
    //         method: 'GET',
    //         url: '/bill/bill/getAllByUser/'+userId,
    //         headers: {
    //            'deviceId': this.deviceId,
    //           'Authorization':'Bearer '+this.state.token,
    //         },
    //       })
    //     .then((res) => {
    //         if(res && res.status === 200){
    //         console.log(res)
    //         this.setState({
    //             data: res.data.result,
    //         }) ;
    //         // console.log(this.state.data)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
        
    // }
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
    //         url: '/bill/bill/getBillNumByUserIdAndAmount/{userId}/{amount}',
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
        //  billNumByUserId,
        //  billNumByUserIdAndState,
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
                
                <div>
                    <Row gutter={16}>
                        <Col span={10}>
                            <Card>
                                <ReactEcharts option={this.getBillConsumeOption()}/>
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
                    </Row>
                </div>
         </div>
        )
    }
}
export default Bill;