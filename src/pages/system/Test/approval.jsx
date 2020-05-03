import React,{Component} from 'react'
import {Form,Input,InputNumber} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

class Approval extends Component{
  //接收父组件参数
  static propTypes = {
    setApproval:PropTypes.func.isRequired,
    planApprovalDetail:PropTypes.object
  }

  componentWillMount() {
    this.props.setApproval(this.props.form)
  }

  render(){

    const planApprovalDetail = this.props.planApprovalDetail
  
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="订单编号：">
          {
            getFieldDecorator('id',{
              initialValue:planApprovalDetail.id,
              rules:[{
                required:true,
                message:'请输入备品备件订单编号',
              }]
            })(
              <Input placeholder="请输入备品备件订单编号"  disabled='true'></Input>
            )
          }
         
        </Item>
        {/* <Item label="优惠折扣：">
          {
            getFieldDecorator('discount',{
              initialValue:planApprovalDetail.discount,
              rules:[{
                required:true,
                message:'请输入优惠折扣'
              }]
            })(
              <InputNumber 
              placeholder="优惠折扣"
              min={0} max={1} step={0.01}
              />
            )
          }
         
        </Item> */}
        <Item label="订单总金额：">
          {
            getFieldDecorator('totalPrice',{
              initialValue:planApprovalDetail.totalPrice,
              rules:[{
                required:true,
                message:'请输入订单总金额(¥)'
              }]
            })(
              <Input placeholder="请输入订单总金额"></Input>
            )
          }
         
        </Item>
        <Item label="审核意见：">
          {
            getFieldDecorator('suggestion',{
              initialValue:planApprovalDetail.suggestion,
              rules:[{
                required:true,
                message:'请输入审核意见'
              }]
            })(
              <Input.TextArea placeholder="请输入审核意见" autosize={{minRows:4,maxRows:6}} allowClear></Input.TextArea>
            )
          }
         
        </Item>
      </Form>
    )
  }
}
export default Form.create()(Approval)