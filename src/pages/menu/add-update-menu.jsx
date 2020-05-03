import React,{Component} from 'react'
import {Form,Input,Button} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const TextArea = Input.TextArea
class AddUpdateForm extends Component{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    menu:PropTypes.object
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){

    const menu = this.props.menu
  
    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="父级菜单：">
          {
            getFieldDecorator('parentMenu',{
              initialValue:menu.parentMenu,
              rules:[{
                required:true,
                message:'角色编码必须输入'
              }]
            })(
              <Input placeholder="请输入角色编码"></Input>
            )
          }
         
        </Item>
        
        <Item label="菜单编码：">
          {
            getFieldDecorator('menuCode',{
              initialValue:menu.menuCode,
              rules:[{
                required:true,
                message:'菜单编码必须输入'
              }]
            })(
              <Input placeholder="请输入菜单编码"></Input>
            )
          }
         
        </Item>
      
        <Item label="Icon编码：">
          {
            getFieldDecorator('icon',{
              initialValue:menu.icon,
              
            })(
              <Input></Input>
            )
          }
         
        </Item>

        <Item label="菜单名称：">
          {
            getFieldDecorator('menuName',{
              initialValue:menu.title,
              rules:[{
                required:true,
                message:'请输入菜单名称'
              }]
            })(
              <Input placeholder="请输入中文汉字"></Input>
            )
          }
        </Item>
        
        <Item label="菜单排序：">
          {
            getFieldDecorator('number',{
              initialValue:menu.number,
              rules:[{
                required:true,
                message:'请输入菜单序号'
              }]
            })(
              <Input placeholder="请输入整数"></Input>
            )
          }
        </Item>
        <Item label="菜单地址：">
          {
            getFieldDecorator('url',{
              initialValue:menu.key,
              rules:[{
                required:true,
                message:'请输入菜单地址'
              }]
            })(
              <Input></Input>
            )
          }
        </Item>
        <Item label="备注说明：">
          {
            getFieldDecorator('remark',{
              initialValue:menu.remark,
              
            })(
              <TextArea autoSize={{minRows:2,maxRows:6}}></TextArea>
            )
          }
        </Item>
        <Button type="primary">保存</Button>
      </Form>
    )
  }
}
export default Form.create()(AddUpdateForm)