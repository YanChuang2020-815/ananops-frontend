import React, {Component,} from 'react';
import {Descriptions} from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment';

const token = window.localStorage.getItem('token')

class BillDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            billDetail: {},
        }
        this.getBillById = this.getBillById.bind(this);
    }

    componentDidMount() {
        const {
            match: {params: {id}}
        } = this.props
        this.getBillById(id);
    }

    getBillById = (id) => {
        axios({
            method: 'POST',
            url: '/bill/bill/getBillById/' + id,
            headers: {
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        billDetail: res.data.result
                    });
                }
                console.log(res.data.result);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const {
            billDetail,
        } = this.state
        const hasntPay = (
            <Link to={`/cbd/bill/alipay/${billDetail.id}`} style={{marginRight: '12px'}}>前往支付</Link>
        );
        const paid = ("订单已支付");
        return (
            <div>
                <Descriptions bordered size='small'>
                    <Descriptions.Item label="流水号" span={1.5}>{billDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="支付方式" span={1.5}>{billDetail.paymentMethod}</Descriptions.Item>
                    <Descriptions.Item label="交易方式" span={1.5}>{billDetail.transactionMethod}</Descriptions.Item>
                    <Descriptions.Item label="总金额" span={1.5}>{billDetail.amount}{"元"}</Descriptions.Item>
                    <Descriptions.Item label="用户ID" span={1.5}>{billDetail.userId}</Descriptions.Item>
                    <Descriptions.Item label="用户名" span={1.5}>{billDetail.userName}</Descriptions.Item>
                    <Descriptions.Item label="当前时间" span={1.5}>{billDetail.time && moment(parseInt(billDetail.time)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="供应商ID" span={1.5}>{billDetail.supplier}</Descriptions.Item>
                    <Descriptions.Item label="供应商" span={1.5}>{billDetail.supplierName}</Descriptions.Item>
                    <Descriptions.Item label="项目ID" span={1.5}><Link to={`/cbd/pro/project/detail/${billDetail.projectId}`}style={{marginRight:'12px'}}>{billDetail.projectId}</Link></Descriptions.Item>
                    <Descriptions.Item label="工单ID" span={1.5}><Link to={`/cbd/bill/detail/workOrderDetail/${billDetail.workOrderId}`}style={{marginRight:'12px'}}>{billDetail.workOrderId}</Link></Descriptions.Item>
                    {/* <Descriptions.Item label="项目ID" span={1.5}><Link to={`/cbd/pro/project/detail/${billDetail.projectId}`}style={{marginRight:'12px'}}>{billDetail.projectId}</Link></Descriptions.Item> */}
                    <Descriptions.Item label="支付状态" span={1.5}>{billDetail.state}</Descriptions.Item>
                    <Descriptions.Item label="设备总价" span={1.5}>{billDetail.deviceAmount}{"元"}</Descriptions.Item>
                    <Descriptions.Item label="服务总价" span={1.5}>{billDetail.serviceAmount}{"元"}</Descriptions.Item>
                    <Descriptions.Item label="操作">
                        <Link to={`/cbd/bill/index`} style={{marginRight: '12px'}}>返回上级</Link>
                        {billDetail.state == "已完成" ? paid : hasntPay}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }
}

export default BillDetail