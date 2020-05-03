import React,{Component} from 'react'
import {Form,Input,Button,Radio,Select,Cascader} from 'antd'
import PropTypes from 'prop-types'
import {reqAddressList} from '../../axios/index'
const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
class UpdateAdminForm extends Component{
    //接收父组件参数
    static propTypes = {
        setForm:PropTypes.func.isRequired,
        groupList:PropTypes.array.isRequired,
    }

    state = {
        addressList:[]
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
        const item = this.props.group
        console.log(item)

        const group = groupList.map((item,index)=>
            <Option value={item[0]} key={index}>{item[1]}</Option>
        )

        const {addressList} = this.state


        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:15}
        }

        const {getFieldDecorator} = this.props.form
        return (
            <Form {...formItemLayout} >
                <Item label="上级部门：">
                    {
                        getFieldDecorator('pid',{
                            initialValue: "1",
                            rules:[{
                                required:true,
                                message:'请选择父部门'
                            }]
                        })(
                            <Select defaultValue="1" disabled>
                                <Option value="1">ananops</Option>
                            </Select>
                        )
                    }
                </Item>
                <Item label="企业Id：">
                    {
                        getFieldDecorator('id',{
                            initialValue: item.id,
                            rules:[{
                                required:true,
                                message:'组织Id'
                            }]
                        })(
                            <Input placeholder="组织Id" disabled></Input>
                        )
                    }
                </Item>
                <Item label="企业统一信用编码:">
                    {
                        getFieldDecorator('groupCode',{
                            initialValue: item.groupCode,
                            rules:[{
                                required:true,
                            }]
                        })(
                            <Input placeholder="请输入企业统一信用编码"></Input>
                        )
                    }

                </Item>

                <Item label="企业名称：">
                    {
                        getFieldDecorator('groupName',{
                            initialValue:item.groupName,
                            rules:[{
                                required:true,
                            }]
                        })(
                            <Input></Input>
                        )
                    }
                </Item>
               <Item label="企业地址：">
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
                            initialValue:item.groupAddress,
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
                            initialValue:item.contact,
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
                            initialValue:item.contactPhone,
                            rules:[{
                                required:true,
                                message:'请输入联系电话'
                            }]
                        })(
                            <Input></Input>
                        )
                    }
                </Item>

                {/*<Item label="组织类型：">
                    {
                        getFieldDecorator('type',{
                            initialValue:item.type,

                        })(
                            <Select>
                                <Option value="company" key="company">公司</Option>
                                <Option value="department" key="apartment">部门</Option>
                            </Select>
                        )
                    }
                </Item>*/}
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
export default Form.create()(UpdateAdminForm)