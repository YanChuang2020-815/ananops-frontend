import React,{Component} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const { Option } = Select;

class Add extends Component{
    //接收父组件参数
    static propTypes = {
      setSubmit:PropTypes.func.isRequired,
      addDetail:PropTypes.object
    }
  
    componentWillMount() {
      this.props.setSubmit(this.props.form)
    }

    render(){
      const addDetail = this.props.addDetail;
      const formItemLayout = {
        labelCol:{span:5},
        wrapperCol:{span:15}
      }
  
      const {getFieldDecorator} = this.props.form
      return (
        <Form {...formItemLayout}>
          <Item label="名称">
            {getFieldDecorator('name',{
              initialValue: addDetail.name,
              rules:[{
                required:true,
                message:"请输入内容",
              }]
            })(
              <Input placeholder="请输入内容" />
            )} 
          </Item>
          <Item label="备注">
            {getFieldDecorator('mark',{
              initialValue: addDetail.mark
            })(
              <Input placeholder="请输入内容" />
            )} 
          </Item>
          <Item label="类型">
            {getFieldDecorator('dictLevel',{
              initialValue: addDetail.dictLevel || "system",
              rules:[{
                required:true,
                message:"请选择类型",
              }]
            })(
              <Select>
                <Option value='system'>系统</Option>
                <Option value='biz'>业务</Option>
              </Select>
            )}  
          </Item>

          <Item label="状态：">
            {getFieldDecorator('status',{
              initialValue: addDetail.status || "Y",
              rules:[{
                required:true,
                message:"请选择状态",
              }]
            })(
              <Select>
                <Option value='Y'>有效</Option>
                <Option value='N'>无效</Option>
              </Select>
            )}  
          </Item>

         
        </Form>
      )
    }
}
export default Form.create()(Add)