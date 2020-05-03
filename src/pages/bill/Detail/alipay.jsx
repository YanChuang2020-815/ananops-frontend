import React, {Component,} from 'react';
import {Form, Button, Descriptions,message, Input, Table} from 'antd';
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment';
const id=window.localStorage.getItem('id')
const token = window.localStorage.getItem('token')

class PayBill extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderDetail:{},
            token:window.localStorage.getItem('token'),
            alipayForm: null,
            billDetail:{},
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

    payBill=(e)=>{
      e.preventDefault()
      const {
        form,
        history,
        match : { params : {id } },
        } = this.props
        const { getFieldValue } = form;
        const values = form.getFieldsValue()
        console.log(values)
        if (values.attachmentIdList != undefined) {
            var fileList = values.attachmentIdList.fileList;
            console.log(fileList)
            values.attachmentIdList = this.getAttachments(fileList);
        }
        // if(!getFieldValue('outTradeNo')){
        //   message.error('请输入商户订单')
        //   return;
        // }
        // if(!getFieldValue('subject')){
        //   message.error('请输入订单名称')
        //   return;
        // }
        // if(!getFieldValue('totalAmount')){
        //   message.error('请输入付款金额 ')
        //   return;
        // }
        // if(!getFieldValue('body')){
        //   message.error('请输入商品描述')
        //   return;
        // }
        values.outTradeNo = "Ananops"+this.state.billDetail.id
        values.subject = "用户："+this.state.billDetail.userName+" | 供应商："+this.state.billDetail.supplierName
        values.totalAmount = this.state.billDetail.amount
        values.body = "工单ID："+this.state.billDetail.workOrderId
        axios({
          method: 'POST',
          url: '/bill/order/alipay',
          params:{
            'outTradeNo':values.outTradeNo,
            'subject':values.subject,
            'totalAmount':values.totalAmount,
            'body':values.body,
          },
          headers: {
            'Content-Type': 'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
        })
          .then((res) => {
            if(res && res.status === 200){  
              console.log(res.data);
              this.setState({
                alipayForm: res.data,
              })
              const newWindow = window.open("", "_self");
              newWindow.document.write(res.data);
              newWindow.focus();
            }
          })
          .catch(function (error) {
            console.log(error);
          });
          
      }

    render() {
      const createFormItemLayout = {
        labelCol: {span:8},
        wrapperCol : {span:8},
      };
      const { 
        form: { getFieldDecorator }, 
        match : { params : { id } }
      } = this.props;
      const {orderDetail,alipayForm,billDetail} = this.state;
      const sendAlipayForm = (
        <div className="alipayForm">
          <section className="sendAlipayForm">
            <h2 style={{textAlign:"center"}}>支 付 宝 收 款</h2>
            <Form>{alipayForm}</Form>
          </section>
        </div>
      );
      const sendBillForm = (
        <div className="alipay-pay-page">
                <h1 style={{textAlign:"center"}}>支 付 账 单</h1>
                <div></div>
                <div style={{textAlign:"center"}}>
                  <center>
                    <table border="1" style={{textAlign:"center"}}>
                      <tr>
                        <th>outTradeNo</th>
                        <th>{"Ananops"+billDetail.id}</th>
                      </tr>
                      <tr>
                        <td>subject</td>
                        <td>{"用户："+billDetail.userName+" | 供应商："+billDetail.supplierName+ " | 账单ID："+billDetail.id}</td>
                      </tr>
                      <tr>
                        <td>totalAmount</td>
                        <td>{billDetail.amount}</td>
                      </tr>
                      <tr>
                        <td>body</td>
                        <td>{"工单ID："+billDetail.workOrderId}</td>
                      </tr>
                    </table>
                  </center>
                </div>
                <div style={{textAlign:"center"}}>***********************<text style={{color:"red"}}>WARNING!!!</text>***********************</div>
                <div style={{textAlign:"center"}}>************************<text style={{color:"red"}}>请注意!!!</text>************************</div>
                <div style={{textAlign:"center",color:"red"}}>在跳转到支付宝支付后，完成付款时请勿关闭页面！待完成交易返回本平台后才能关闭页面！</div>
                <div style={{textAlign:"center",color:"red"}}>如出现不能返回本平台页面的情况，请及时联系平台管理员，并保留已支付账单的证据，以便管理员审核！</div>
                <div style={{textAlign:"center"}}>**********************************************************</div>
                  

                  {/* 测试专用 */}
                {/* <h1 style={{textAlign:"center"}}>支付账单（暂时为测试专用，不使用已创建账单进行测试，直接在下方填写）</h1> */}
                <Form
                  onSubmit={this.payBill}
                >
                  {/* <Form.Item
                    {...createFormItemLayout}
                    label="商户订单"
                  >
                  {getFieldDecorator('outTradeNo',{
                  initialValue: orderDetail.outTradeNo,
                  rules:[{
                    required:true,
                    message:"请输入商户订单",
                  }]
                  })(
                    <Input placeholder="请输入商户订单" />
                    )}  
                  </Form.Item>
                  <Form.Item
                    {...createFormItemLayout}
                    label="订单名称"
                  >
                  {getFieldDecorator('subject',{
                  initialValue: orderDetail.subject,
                  rules:[{
                    required:true,
                    message:"请输入订单名称",
                  }]
                  })(
                    <Input placeholder="请输入订单名称" />
                    )}  
                  </Form.Item>
                  <Form.Item
                    {...createFormItemLayout}
                    label="付款金额"
                  >
                  {getFieldDecorator('totalAmount',{
                  initialValue: orderDetail.totalAmount,
                  rules:[{
                    required:true,
                    message:"请输入付款金额",
                  }]
                  })(
                    <Input placeholder="请输入付款金额" />
                    )}  
                  </Form.Item>
                  <Form.Item
                    {...createFormItemLayout}
                    label="商品描述"
                  >
                  {getFieldDecorator('body',{
                  initialValue: orderDetail.body,
                  rules:[{
                    required:true,
                    message:"请输入商品描述",
                  }]
                  })(
                    <Input placeholder="请输入商品描述" />
                    )}  
                  </Form.Item> */}


                <section className="operator-container">
                  <div style={{textAlign:"center"}}>
                    <Button
                      htmlType="submit"
                      type="primary"
                      size="default"
                    >前往支付宝支付
                    </Button>
                    <Button
                      style={{marginLeft:"28px"}}
                      size="default"
                      onClick={()=> {
                      const {
                        history,
                      } = this.props
                      history.push('/cbd/bill/history')
                    }}
                    >取消
                    </Button>
                  </div>
                </section>
                </Form>
                <h1>值得注意的是</h1>
                <h1>1、目前同步返回测通的情况是返回到 http://localhost:3000 下。上线后，须将后台账单模块中alipay.properties下returnUrl改为公网域名地址</h1>
                <h1>2、目前异步返回使用实验室服务器IP地址无法测通，原因是需要有公网IP地址，而实验室服务器无法公网访问，因此无法测通。上线后，将后台账单模块中alipay.properties下notifyUrl改为公网域名地址即可正常使用</h1>
            </div>
      );
      return (sendBillForm);
    }
}

export default Form.create()(PayBill);