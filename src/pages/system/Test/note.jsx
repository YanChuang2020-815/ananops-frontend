import React,{Component} from 'react'
import {Form,Input,DatePicker,Select} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

class Note extends Component{
  //接收父组件参数
  static propTypes = {
    setNote:PropTypes.func.isRequired,
    noteDetail:PropTypes.object
  }
  
  componentWillMount() {
    this.props.setNote(this.props.form)
  }
  render(){

    const noteDetail = this.props.noteDetail
  
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="任务编号：">
          {
            getFieldDecorator('id',{
              initialValue:noteDetail.id,
              rules:[{
                required:true,
                message:'请输入任务编号',
              }]
            })(
              <Input placeholder="请输入任务编号"  disabled='true'></Input>
            )
          }
         
        </Item>
        <Item label="审核意见">
          {
            getFieldDecorator('note',{
              initialValue:noteDetail.note,
              rules:[{
                required:true,
                message:'请输入审核意见'
              }]
            })(
              <Input.TextArea
                autoSize={{minRows:4, maxRows:6 }}
                placeholder="请输入审核意见，不超过300字"
                allowClear
              />
            )
          }
         
        </Item>
      
        
      </Form>
    )
  }
}
export default Form.create()(Note)