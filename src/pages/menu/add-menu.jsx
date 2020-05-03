import React,{Component} from 'react'
import {Form,Input,Button,Select} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
class AddMenuForm extends Component{
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
                        getFieldDecorator('pid',{
                            initialValue:menu.id,
                            rules:[{
                                required:true,
                                message:'父级菜单必须输入'

                            }]
                        })(
                            <Select disabled>
                                <Option value={menu.id}>{menu.menuName}</Option>
                            </Select>
                        )
                    }

                </Item>

                <Item label="菜单名称：">
                    {
                        getFieldDecorator('menuName',{
                            initialValue:'',
                            rules:[{
                                required:true,
                                message:'请输入菜单名称'
                            }]
                        })(
                            <Input placeholder="请输入菜单名称"></Input>
                        )
                    }
                </Item>

                <Item label="菜单编码：">
                    {
                        getFieldDecorator('menuCode',{
                            initialValue:'',
                            rules:[{
                                required:true,
                                message:'菜单编码必须输入'
                            }]
                        })(
                            <Input placeholder="请输入菜单编码"></Input>
                        )
                    }

                </Item>

                <Item label="图标：">
                    {
                        getFieldDecorator('icon',{
                            initialValue:''

                        })(
                            <Input></Input>
                        )
                    }

                </Item>

                <Item label="前端显示：">
                    {
                        getFieldDecorator('status',{
                            initialValue:'ENABLE',
                            rules:[{
                                required:true,
                                message:'请选择菜单状态'
                            }]
                        })(
                            <Select>
                                <Option value="ENABLE">显示</Option>
                                <Option value="DISABLE">隐藏</Option>
                            </Select>
                        )
                    }
                </Item>


                <Item label="菜单排序：">
                    {
                        getFieldDecorator('number',{
                            initialValue:'',
                            rules:[{
                                required:true,
                                pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                message:'请输入数字'
                            }]
                        })(
                            <Input placeholder="请输入整数"></Input>
                        )
                    }
                </Item>
                <Item label="菜单地址：">
                    {
                        getFieldDecorator('url',{
                            initialValue:'',
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
                            initialValue:'',

                        })(
                            <TextArea autoSize={{minRows:2,maxRows:6}}></TextArea>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddMenuForm)