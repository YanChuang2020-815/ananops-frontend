import React,{Component} from 'react'
import {Form,Input,DatePicker,Select} from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
const Item = Form.Item
//let maintain=[]
class EngineerAccept extends Component{
  //接收父组件参数
  static propTypes = {
    setLevel:PropTypes.func.isRequired,
    engineerAcceptDetail:PropTypes.object
  }
  componentWillMount() {
    this.props.setLevel(this.props.form)
  }
  render(){

    const engineerAcceptDetail = this.props.engineerAcceptDetail
  
    const formItemLayout = {
      labelCol:{span:7},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="任务唯一编号">
          {
            getFieldDecorator('id',{
              initialValue:engineerAcceptDetail.id,
              rules:[{
                required:true,
                message:'请输入任务编号',
              }]
            })(
              <Input placeholder="请输入任务编号"  disabled='true'></Input>
            )
          }
         
        </Item>
        <Item label="紧急程度评估">
          {
            getFieldDecorator('level',{
              initialValue:engineerAcceptDetail.level || 1,
              rules:[{
                required:true,
                message:'请选择紧急程度'
              }]
            })(
              <Select
                placeholder="请选择紧急程度"
                allowClear 
              >
                <Select.Option value={1}> 
                    不紧急
                </Select.Option>
                <Select.Option value={2}> 
                    一般
                </Select.Option>
                <Select.Option value={3}> 
                   紧急
                </Select.Option>
                <Select.Option value={4}> 
                   非常紧急
                </Select.Option>
              </Select>
            )
          }       
        </Item>
        <Item
            label="计划开始时间"
          >
            {getFieldDecorator('scheduledStartTime',{
              initialValue: moment(),
              rules:[{
                required:true,
                message:"请选择计划开始时间",
              }]
            })(
              <DatePicker
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择计划开始时间"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
            )}  
          </Item>
          <Item
            label="计划结束时间"
          >
            {getFieldDecorator('scheduledFinishTime',{
              initialValue: moment(),
              rules:[{
                required:true,
                message:"请选择计划结束时间",
              }]
            })(
              <DatePicker
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择计划结束时间"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
            )}  
          </Item>      
      </Form>
    )
  }
}
export default Form.create()(EngineerAccept)