import React, {Component,} from 'react';
import {Descriptions, Button} from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment';

const token = window.localStorage.getItem('token')

class BillDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            billDetail: {},
            orderDetail: {},
            returnInfo: "",
        }
    }

    componentDidMount() {
        console.log("props在此：")
        console.log(this.props)
        this.success()
    }

    success = () => {
        
        // 获取 success
        const query = this.props.location.search
        console.log("query在此：")
        console.log(query)
        const arr = query.split('&')

        var arrX = arr[0].split('=')
        const charset = arrX[1]
        console.log("charset在此：")
        console.log(charset)

        arrX = arr[1].split('=')
        const out_trade_no = arrX[1]
        console.log("out_trade_no在此：")
        console.log(out_trade_no)

        arrX = arr[2].split('=')
        const method = arrX[1]
        console.log("method在此：")
        console.log(method)

        arrX = arr[3].split('=')
        const total_amount = arrX[1]
        console.log("total_amount在此：")
        console.log(total_amount)

        arrX = arr[4].split('=')
        const sign = arrX[1]
        console.log("sign在此：")
        console.log(sign)

        arrX = arr[5].split('=')
        const trade_no = arrX[1]
        console.log("trade_no在此：")
        console.log(trade_no)

        arrX = arr[6].split('=')
        const auth_app_id = arrX[1]
        console.log("auth_app_id在此：")
        console.log(auth_app_id)

        arrX = arr[7].split('=')
        const version = arrX[1]
        console.log("version在此：")
        console.log(version)

        arrX = arr[8].split('=')
        const app_id = arrX[1]
        console.log("app_id在此：")
        console.log(app_id)

        arrX = arr[9].split('=')
        const sign_type = arrX[1]
        console.log("sign_type在此：")
        console.log(sign_type)

        arrX = arr[10].split('=')
        const seller_id = arrX[1]
        console.log("seller_id在此：")
        console.log(seller_id)

        arrX = arr[11].split('=')
        const timestamp = arrX[1]
        console.log("timestamp在此：")
        console.log(timestamp)

        axios({
            method: 'GET',
            url: '/bill/order/return',
            params: {
                'charset':charset,
                'out_trade_no':out_trade_no,
                'method':method,
                'total_amount':total_amount,
                'sign':sign,
                'trade_no':trade_no,
                'auth_app_id':auth_app_id,
                'version':version,
                'app_id':app_id,
                'sign_type':sign_type,
                'seller_id':seller_id,
                'timestamp':timestamp,
            },
            headers: {
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + token,
            },
        })
            .then((res) => {
                if (res && res.status === 200) {
                    this.setState({
                        returnInfo: res.data.result
                    });
                }
                console.log(res.data.result);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div style={{textAlign:"center"}}>
                <h1>支付成功！</h1>
                <Button
                      style={{marginLeft:"28px"}}
                      size="default"
                      type="primary"
                      onClick={()=> {
                      const {
                        history,
                      } = this.props
                      history.push('/cbd/bill/history')
                    }}
                    >点此返回账单列表
                    </Button>
            </div>
        )
    }
}

export default BillDetail