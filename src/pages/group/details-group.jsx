import React,{Component} from 'react'
import {Form,Input,Button,Radio,Select,Cascader,Descriptions} from 'antd'
import PropTypes from 'prop-types'
import {reqAddressList} from '../../axios/index'
const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
class DetailForm extends Component{
    //接收父组件参数
    static propTypes = {
        setForm:PropTypes.func.isRequired,
        groupList:PropTypes.array.isRequired,
    }

    state = {
        addressList:[]
    }


    onChange = (value) => {
        console.log(value)
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render(){
        const item = this.props.group
        return (
            <div>
                <Descriptions bordered size='small'>
                    <Descriptions.Item label="部门名称" span={3}>{item.groupName}</Descriptions.Item>

                    <Descriptions.Item label="部门类型" span={3}>{item.type}</Descriptions.Item>
                    <Descriptions.Item label="部门状态"
                                       span={3}>{item.status === 0 ? '启用' : '禁用'}</Descriptions.Item>
                    <Descriptions.Item label="部门描述" span={3}>{item.remark}</Descriptions.Item>
                    <Descriptions.Item label="部门编码" span={3}>{item.groupCode}</Descriptions.Item>
                    <Descriptions.Item label="部门地址" span={3}>{item.groupAddress}</Descriptions.Item>
                    <Descriptions.Item label="部门地址" span={3}>{item.detailAddress}</Descriptions.Item>
                    <Descriptions.Item label="联系人" span={3}>{item.contact}</Descriptions.Item>
                    <Descriptions.Item label="联系电话" span={3}>{item.contactPhone}</Descriptions.Item>
                </Descriptions>
            </div>
        )
    }
}
export default Form.create()(DetailForm)