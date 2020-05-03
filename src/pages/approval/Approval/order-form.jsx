import React,{Component} from 'react'
import {Form,Input,Select,Collapse} from 'antd'
import PropTypes from 'prop-types'
import {reqComment} from '../../../axios/index'
const Item = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const Panel = Collapse.Panel
class OrderForm extends Component{
  state = {
    comments:[],//批注
  }
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    tasked:PropTypes.object.isRequired,
    orderInfo:PropTypes.object.isRequired,
  }

  getComment = async () => {
    const result = await reqComment(this.props.tasked.processInstanceId)
    if(result.code===200){
      this.setState({comments:result.result})
    }
  }

  componentWillMount() {
    
    this.props.setForm(this.props.form)
  }

  componentDidMount() {
    this.getComment()
  }

  render(){

    const {comments} = this.state
    const order = this.props.order || {}
    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="工单ID：">
          {
            getFieldDecorator('id',{
              initialValue:order.id,
              
            })(
              <Input></Input>
            )
          }
        </Item>

        <Item label="报修人编号：">
          {
            getFieldDecorator('userId',{
              initialValue:order.userId,
              
            })(
              <Input></Input>
            )
          }
        </Item>

        <Item label="报修人名称：">
          {
            getFieldDecorator('userId',{
              initialValue:order.userId,
              
            })(
              <Input></Input>
            )
          }
        </Item>
        
        <Item label="项目编号：">
          {
            getFieldDecorator('projectId',{
              initialValue:order.projectId,
             
            })(
              <Input></Input>
            )
          }
         
        </Item>
      
        <Item label="工单名称：">
          {
            getFieldDecorator('title',{
              initialValue:order.title,
              
            })(
              <Input></Input>
            )
          }
         
        </Item>
        <Item label="工单状态：">
          {
            getFieldDecorator('status',{
              initialValue:order.status,
              
            })(
              <Input></Input>
            )
          }
         
        </Item>
        <Item label="服务费用：">
          {
            getFieldDecorator('totalPrice',{
              initialValue:order.totalPrice,
              
            })(
              <Input></Input>
            )
          }
         
        </Item>
        <Item label="报修人手机号：">
          {
            getFieldDecorator('call',{
              initialValue:order.call,
              
            })(
              <Input></Input>
            )
          }
         
        </Item>
        <Item label="区域：">
          {
            getFieldDecorator('address_name',{
              initialValue:order.address_name,
              
            })(
              <Input></Input>
            )
          }
         
        </Item>

        <Item label="创建时间：">
          {
            getFieldDecorator('createdTime',{
              initialValue:order.createdTime,
              
            })(
              <Input></Input>
            )
          }
         
        </Item>
        <Item label="既往批注：">
          <Collapse>
            {
              comments.map( (item) => <Panel header={item.assignee} key={item.assignee}>{item.comment}</Panel>
              )
            }
           
          </Collapse>
        </Item>
        
        <Item label="批注：">
          {
            getFieldDecorator('comment',{
              initialValue:'',
              
            })(
              <TextArea></TextArea>
            )
          }
         
        </Item>
      </Form>
    )
  }
}
export default Form.create()(OrderForm)