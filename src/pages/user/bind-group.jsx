import React,{Component} from 'react'
import {Form,Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
class BindGroup extends Component{

  static propTypes = {
    setForm:PropTypes.func.isRequired,
    user:PropTypes.object,
    groupList:PropTypes.array.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){
    const user = this.props.user
    const groupList = this.props.groupList

    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }
  
    const group = groupList.map((item,index)=>
      <Option value={item[0]} key={index}>{item[1]}</Option>
    )

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="组织名称：">
          {
            getFieldDecorator('groupId',{
              initialValue:user.groupName,
              rules:[{
                required:true,
                message:'请选择组织名称'
              }]
            })(
              <Select>
                {group}
              </Select>
            )
          }
       
        </Item>
      </Form>
    )
  }
      
    
}
export default Form.create()(BindGroup)