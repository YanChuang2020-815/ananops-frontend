import React,{Component} from 'react'
import {Form,Input,InputNumber,Select} from 'antd'
import {reqValidateUserLoginName} from '../../../axios/index'
import PropTypes from 'prop-types'
const Item = Form.Item

class Update extends Component{
  //接收父组件参数
  static propTypes = {
    //setSubmit:PropTypes.func.isRequired,
    // updateDetail:PropTypes.object,
    setForm:PropTypes.func.isRequired,
    user:PropTypes.object,
    //groupList:PropTypes.array.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  onLoginNameRq = async (rule, value, callback) => {
    const user = this.props.user
    const dataPost = {};
    dataPost.type = 'loginName';
    dataPost.validValue = value;
    const result = await reqValidateUserLoginName(dataPost)
    if (result.code === 200) {
      if(result.result === false){
        if (value != user.loginName) {
          callback(result.message);
        }
      }else{
        callback('登录名唯一，可使用!');
      }
    } else {
      callback('登录名校验错误!');
    }
  }

  render(){

    const user = this.props.user
  
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="登录名：">
          {
            getFieldDecorator('loginName',{
              initialValue:user.loginName,
              rules:[{
                required:true,
                message:'请输入登录名',
              },
              {validator: this.onLoginNameRq}]
            })(
              <Input placeholder="请输入登录名"></Input>
            )
          }
         
        </Item>
        <Item label="姓名：">
          {
            getFieldDecorator('userName',{
              initialValue:user.userName,
              rules:[{
                required:true,
                message:'请输入姓名'
              }]
            })(
              <Input placeholder="请输入姓名"></Input>
            )
          }
         
        </Item>
        <Item label="工号：">
          {
            getFieldDecorator('userCode',{
              initialValue:user.userCode,
              rules:[{
                required:true,
                message:'请输入工号'
              }]
            })(
              <Input placeholder="请输入工号"></Input>
            )
          }
         
        </Item>
        <Item label="身份证号码：">
          {
            getFieldDecorator('identityNumber',{
              initialValue:user.identityNumber,
              rules:[{
                required:true,
                message:'请输入身份证号码'
              }]
            })(
              <Input placeholder="请输入身份证号码"></Input>
            )
          }
         
        </Item>
        <Item label="证书编号：">
          {
            getFieldDecorator('titleCeNumber',{
              initialValue:user.titleCeNumber,
              rules:[{
                required:true,
                message:'请输入证书编号'
              }]
            })(
              <Input placeholder="请输入证书编号"></Input>
            )
          }
         
        </Item>
        <Item label="手机号码：">
          {
            getFieldDecorator('mobileNo',{
              initialValue:user.mobileNo,
              rules:[{
                required:true,
                message:'请输入手机号码'
              }]
            })(
              <Input placeholder="请输入手机号码"></Input>
            )
          }
         
        </Item>
        <Item label="邮箱：">
          {
            getFieldDecorator('email',{
              initialValue:user.email,
              rules:[{
                required:true,
                message:'请输入邮箱'
              }]
            })(
              <Input placeholder="请输入邮箱"></Input>
            )
          }
         
        </Item>
      </Form>
    )
  }
}
export default Form.create()(Update)