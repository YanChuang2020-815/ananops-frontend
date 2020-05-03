import React,{Component} from 'react'
import {Form,Input,Rate} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

class Examine extends Component{
  //接收父组件参数
  static propTypes = {
    setExamine:PropTypes.func.isRequired,
    examine:PropTypes.object
  }

  componentWillMount() {
    this.props.setExamine(this.props.form)
  }

  render(){

    const examine = this.props.examine
  
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="任务编号：">
          {
            getFieldDecorator('taskId',{
              initialValue:examine.taskId,
              rules:[{
                required:true,
                message:'请输入任务编号',
              }]
            })(
              <Input placeholder="请输入任务编号"  disabled='true'></Input>
            )
          }
         
        </Item>
        <Item label="用户ID">
          {
            getFieldDecorator('userId',{
              initialValue:examine.userId,
              rules:[{
                required:true,
                message:'请输入用户ID'
              }]
            })(
              <Input placeholder="请输入用户ID"  disabled='true'></Input>
            )
          }
         
        </Item>
        <Item label="评分：">
          {
            getFieldDecorator('score',{
              initialValue:examine.totalCost,
              rules:[{
                required:true,
                message:'请输入评分'
              }]
            })(
              <Rate />
            )
          }
         
        </Item>
        <Item label="评论：">
          {
            getFieldDecorator('content',{
              initialValue:examine.content,
              rules:[{
                required:true,
                message:'请输入评论'
              }]
            })(
              <Input.TextArea placeholder="请输入评论" autosize={{minRows:4,maxRows:6}} allowClear></Input.TextArea>
            )
          }
         
        </Item>
      
        
      </Form>
    )
  }
}
export default Form.create()(Examine)