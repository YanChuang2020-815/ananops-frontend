import React,{Component} from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
class ChangePwdForm extends Component{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    
  }

  //新密码一致校验
  handleCheckPwd(rules,value,callback){
    let cfmPwd = this.props.form.getFieldValue('confirmPwd');
    if(cfmPwd && cfmPwd !== value){
      callback(new Error('两次密码输入不一致'))
    }else{
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback();
    }
  }

  //确认密码校验一致
  handleCfmPwd(rules,value,callback){
    let loginpass = this.props.form.getFieldValue('newPassword');
    if(loginpass && loginpass !== value){
      callback(new Error('两次密码输入不一致'))
    }else{
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback();
    }
  }
  
  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){

  
    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="原始密码：">
          {
            getFieldDecorator('oldPassword',{
              rules:[{
                required:true,
                message:'原始必须输入'
              }]
            })(
              <Input.Password placeholder="请输入原始密码"/>
            )
          }
 
        </Item>
        <Item label="新密码：">
          {
            getFieldDecorator('newPassword',{
              rules:[{
                required:true,
                message:'新密码必须输入'
              },{
                validator:(rules,value,callback)=>{
                  this.handleCheckPwd(rules,value,callback)
                }
              }],
              validateFirst:true
            })(
              <Input.Password placeholder="请输入新密码"/>
            )
          }
 
        </Item>
        <Item label="确认密码：">
          {
            getFieldDecorator('confirmPwd',{
              rules:[{
                required:true,
                message:'请保证与新密码相同'
              },
              {
                validator:(rules,value,callback)=>
                {this.handleCfmPwd(rules,value,callback)}
              }
              ],
              validateFirst:true
            })(
              <Input.Password placeholder="请确认新密码"/>
            )
          }
 
        </Item>
           
      </Form>
    )
  }
}
export default Form.create()(ChangePwdForm)