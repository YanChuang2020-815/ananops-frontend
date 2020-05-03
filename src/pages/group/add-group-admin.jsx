import React, {Component} from 'react'
import {Form, Input, Button, Radio, Select, Cascader} from 'antd'
import PropTypes from 'prop-types'
import {reqAddressList} from '../../axios/index'

const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option

class AddAdminForm extends Component {
    //接收父组件参数
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        groupList: PropTypes.array.isRequired,
    }

    state = {
        addressList: [],
        id: '',
    }

    getAddressList = async () => {
        const result = await reqAddressList()
        if (result.code === 200) {
            const addressList = this.mapAddressList(result.result)
            this.setState({addressList: addressList})
        }
    }

    mapAddressList = (addressList) => {
        return addressList.reduce((pre, curr) => {
            if (curr.children) {
                pre.push({
                    value: curr.id,
                    label: curr.nodeName,
                    children: this.mapAddressList(curr.children)
                })
            } else {
                pre.push({
                    value: curr.id,
                    label: curr.nodeName
                })
            }
            return pre
        }, [])
    }

    onChange = (value) => {
        console.log(value)
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
        this.getAddressList()
    }

    render() {
        const groupList = this.props.groupList
        const item = this.props.item
        let pid = '';
        if (item) {
            pid = item.id
        }

        const group = groupList.map((item, index) =>
            <Option value={item[0]} key={index}>{item[1]}</Option>
        )

        const {addressList, id} = this.state


        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 15}
        }

        const {getFieldDecorator} = this.props.form
        return (
            <Form {...formItemLayout}>
                <Item label="上级管理单位：">
                    {
                        getFieldDecorator('pid', {
                            initialValue: '1',
                            rules: [{
                                required: true,
                                message: '请选择父部门'
                            }]
                        })(
                            <Select defaultValue="1" disabled>
                                <Option value="1">ananops</Option>
                            </Select>
                        )
                    }
                </Item>

                <Item label="企业统一信用编码:">
                    {
                        getFieldDecorator('groupCode', {
                            initialValue: '',
                            rules: [{
                                required: true,
                            }]
                        })(
                            <Input placeholder="请输入企业统一信用编码"></Input>
                        )
                    }

                </Item>

                <Item label="企业名称：">
                    {
                        getFieldDecorator('groupName', {
                            initialValue: '',
                            rules: [{
                                required: true,
                            }]
                        })(
                            <Input placeholder="请输入企业名称"></Input>
                        )
                    }
                </Item>

                <Item label="企业地址：">
                    {
                        getFieldDecorator('addressList', {
                            rules: [{
                                required: true
                            }]
                        })(
                            <Cascader
                                options={addressList}
                                onChange={this.onChange}
                                placeholder="请选择企业地址"
                            />
                        )
                    }
                </Item>
                <Item label="详细地址：">
                    {
                        getFieldDecorator('detailAddress', {
                            initialValue: '',
                            rules: [{
                                required: true,
                            }]
                        })(
                            <Input placeholder="请输入详细地址"></Input>
                        )
                    }
                </Item>
                <Item label="联系人：">
                    {
                        getFieldDecorator('contact', {
                            initialValue: '',
                            rules: [{
                                required: true,
                                message: '请输入联系人'
                            }]
                        })(
                            <Input placeholder="请输入联系人"></Input>
                        )
                    }
                </Item>
                <Item label="联系电话：">
                    {
                        getFieldDecorator('contactPhone', {
                            initialValue: '',
                            rules: [{
                                required: true,
                                message: '请输入联系电话'
                            }]
                        })(
                            <Input placeholder="请输入联系电话"></Input>
                        )
                    }
                </Item>

                <Item label="企业类型：">
                    {
                        getFieldDecorator('type', {
                            initialValue: 'company',

                        })(
                            <Input placeholder="部门类型" value="company" disabled></Input>
                        )
                    }
                </Item>
                <Item label="企业描述：">
                    {
                        getFieldDecorator('remark', {
                            initialValue: '',

                        })(
                            <Input placeholder="企业描述"></Input>
                        )
                    }
                </Item>
                <Item label="状态：">
                    {
                        getFieldDecorator('status', {
                            initialValue: '',

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

export default Form.create()(AddAdminForm)