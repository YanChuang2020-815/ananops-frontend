import React,{Component} from 'react'
import {Card,Form,Input,message,Select,Button,Icon} from 'antd'
import LinkButton from '../../components/link-button'

const Item = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
class AlarmAddUpdate extends Component{

  submit = () => {
    this.props.form.validateFields()
  }

  render(){
  
    const formItemLayout = {
      labelCol:{span:2},
      wrapperCol:{span:8}
    }

    const title=(
      <LinkButton onClick={()=>this.props.history.goBack()}><Icon type='arrow-left' style={{fontSize:20}}/></LinkButton>
    )
  
    const {getFieldDecorator} = this.props.form
  
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='设备ID'>
            {
              getFieldDecorator('deviceId',{
                rules:[{required:true,message:'设备ID必须输入'}]
              })(
                <Input placeholder='请输入设备ID'/>
              )
            }
          </Item>
          <Item label='报警员工ID'>
            {
              getFieldDecorator('staffId',{
                rules:[{required:true,message:'报警员工ID必须输入'}]
              })(
                <Input placeholder='请输入报警员工ID'/>
              )
            }
          </Item>
          <Item label='警报等级'>
            {
              getFieldDecorator('deviceId',{
                rules:[{required:true,message:'警报等级必须选择'}]
              })(
                <Select>
                  <Option value='1'>1</Option>
                  <Option value='2'>2</Option>
                  <Option value='3'>3</Option>
                  <Option value='4'>4</Option>
                  <Option value='5'>5</Option>
                </Select>
              )
            }
          </Item>
          <Item label='报警类型'>
            {
              getFieldDecorator('staffId',{
                rules:[{required:true,message:'报警类型必须输入'}]
              })(
                <Input placeholder='请输入报警类型'/>
              )
            }
          </Item>
          <Item label='报警描述'>
            {
              getFieldDecorator('staffId',{
                rules:[{required:true,message:'报警描述必须输入'}]
              })(
                <TextArea placeholder='请输入报警描述' autosize={{minRows:2,maxRows:6}}/>
              )
            }
          </Item>
          <Item style={{marginLeft:30}}>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(AlarmAddUpdate)