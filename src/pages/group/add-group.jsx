import React,{Component} from 'react'
import {Form,Input,Button,Radio,Select,Cascader} from 'antd'
import PropTypes from 'prop-types'
import {reqAddressList} from '../../axios/index'
const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
class AddForm extends Component{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    groupList:PropTypes.array.isRequired,
  }

  state = {
    addressList:[],
      id:'',
  }

  getAddressList = async () => {
    const result = await reqAddressList()
    if(result.code===200){
      const addressList = this.mapAddressList(result.result)
      this.setState({addressList:addressList})
    }
  }

  mapAddressList = (addressList) => {
    return addressList.reduce((pre,curr)=> {
      if(curr.children){
        pre.push({
          value:curr.id,
          label:curr.nodeName,
          children:this.mapAddressList(curr.children)
        })
      }else{
        pre.push({
          value:curr.id,
          label:curr.nodeName
        })
      }
      return pre
    },[])
  }

  onChange = (value) => {
    console.log(value)
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
    this.getAddressList()
  }

  render(){
    const groupList = this.props.groupList
    const item = this.props.item
      let pid = '';
      if(item){
          pid = item.id
      }
  
    const group = groupList.map((item,index)=>
      <Option value={item[0]} key={index}>{item[1]}</Option>
    )
  
    const {addressList,id} = this.state


    const formItemLayout = {
      labelCol:{span:6},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>
        <Item label="上级管理单位：">
          {
            getFieldDecorator('pid',{
              initialValue: pid ,
              rules:[{
                required:true,
                message:'请选择父部门'
              }]
            })(
              <Select>
                {group}
              </Select>
            )
          }
        </Item>

        {/* <Item label="组织编码：">
          {
            getFieldDecorator('groupCode',{
              initialValue:'',
              rules:[{
                required:true,
              }]
            })(
              <Input placeholder="请输入组织编码"></Input>
            )
          }

        </Item>*/}

        <Item label="部门名称：">
          {
            getFieldDecorator('groupName',{
              initialValue:'',
              rules:[{
                required:true,
              }]
            })(
              <Input placeholder="请输入部门名称"></Input>
            )
          }
        </Item>

        {/*<Item label="组织地址：">
          {
            getFieldDecorator('addressList',{
              rules:[{
                required:true
              }]
            })(
              <Cascader
                options={addressList}
                onChange={this.onChange}
                placeholder="请选择组织地址"
              />
            )
          }
        </Item>
        <Item label="详细地址：">
          {
            getFieldDecorator('detailAddress',{
              initialValue:'',
              rules:[{
                required:true,
              }]
            })(
              <Input></Input>
            )
          }
        </Item>
        <Item label="联系人：">
          {
            getFieldDecorator('contact',{
              initialValue:'',
              rules:[{
                required:true,
                message:'请输入联系人'
              }]
            })(
              <Input></Input>
            )
          }
        </Item>
        <Item label="联系电话：">
          {
            getFieldDecorator('contactPhone',{
              initialValue:'',
              rules:[{
                required:true,
                message:'请输入联系电话'
              }]
            })(
              <Input></Input>
            )
          }
        </Item>*/}

        <Item label="部门类型：">
          {
            getFieldDecorator('type',{
              initialValue:'department',
              
            })(
                <Input placeholder="部门类型" value="department" disabled ></Input>
            )
          }
        </Item>
        <Item label="部门描述：">
          {
            getFieldDecorator('remark',{
              initialValue:'',

            })(
                <Input placeholder="部门描述"  ></Input>
            )
          }
        </Item>
        <Item label="状态：">
          {
            getFieldDecorator('status',{
              initialValue:'0',
              
            })(
              <Radio.Group>
                <Radio value="0">启用</Radio>
                <Radio value="1">禁用</Radio>
              </Radio.Group>
            )
          }
        </Item>
        
      </Form>
    )
  }
}
export default Form.create()(AddForm)