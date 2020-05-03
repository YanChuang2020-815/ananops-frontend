import React,{Component} from 'react'
import {Form,Input,Rate} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

class Comment extends Component{
  //接收父组件参数
  static propTypes = {
    setComment:PropTypes.func.isRequired,
    comment:PropTypes.object
  }

  componentWillMount() {
    this.props.setComment(this.props.form)
  }

  render(){

    const comment = this.props.comment
  
    const formItemLayout = {
      labelCol:{span:6},
      wrapperCol:{span:14}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="任务唯一编号">
          {
            getFieldDecorator('taskId',{
              initialValue:comment.taskId,
              rules:[{
                required:true,
                message:'请输入任务编号',
              }]
            })(
              <Input placeholder="请输入任务编号"  disabled={true}></Input>
            )
          }
         
        </Item>
        <Item label="评价用户编号">
          {
            getFieldDecorator('userId',{
              initialValue:comment.userId,
              rules:[{
                required:true,
                message:'请输入用户ID'
              }]
            })(
              <Input placeholder="请输入用户ID"  disabled={true}></Input>
            )
          }
         
        </Item>
        <Item label="验收服务内容">
          {
            getFieldDecorator('checkContens',{
              initialValue:comment.checkContens,
              rules:[{
                required:true,
                message:'请输入维修任务验收内容'
              }]
            })(
              <Input.TextArea placeholder="请输入维修任务验收内容" rows={6} allowClear></Input.TextArea>
            )
          }
        </Item>
        <Item label="此次服务打星">
          {
            getFieldDecorator('score',{
              initialValue:comment.totalCost,
              rules:[{
                required:true,
                message:'请输入评分'
              }]
            })(
              <Rate />
            )
          }
         
        </Item>
        <Item label="此次服务评价">
          {
            getFieldDecorator('contents',{
              initialValue:comment.content,
              rules:[{
                required:true,
                message:'请输入评论'
              }]
            })(
              <Input.TextArea placeholder="请输入评论" rows={4} allowClear></Input.TextArea>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(Comment)