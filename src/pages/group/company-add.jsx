import React, {Component} from 'react'
import {Tree, Button, Table, Card, message, Modal, Popconfirm, Tag} from 'antd'
import AddAdminForm from './add-group-admin'
import {
    reqAddOrUpdateGroup,
} from '../../axios/index'

export default class CompanyAdd extends Component {

    state = {
        groups: [],
        groupList: [],//上级组织列表
        groupTree: [],
        isShowAdd: false,
        isShowUpdate: false,
        isShowDetails: false,
        item: {},
        group: {},
        companyList: [],//企业列表
        roleCode: window.localStorage.getItem('roleCode'),
    }


    saveGroup = async () => {
        const newGroup = this.form.getFieldsValue()
        console.log(newGroup)
        if(!this.form.getFieldValue('groupCode')){
            message.error('请输入企业统一信用编码')
            return;
        }
        if(!this.form.getFieldValue('groupName')){
            message.error('请输入企业名称')
            return;
        }
        if(!this.form.getFieldValue('addressList')){
            message.error('请选择企业地址')
            return;
        }
        if(!this.form.getFieldValue('detailAddress')){
            message.error('请输入详细地址')
            return;
        }
        if(!this.form.getFieldValue('contact')){
            message.error('请输入联系人')
            return;
        }
        if(!this.form.getFieldValue('contactPhone')){
            message.error('请输入联系电话')
            return;
        }
        if(this.form.getFieldValue('contactPhone') && this.form.getFieldValue('contactPhone').length!==11){
            message.error('请输入正确的电话格式')
            return;
        }
        const result = await reqAddOrUpdateGroup(newGroup)
        if (result.code === 200) {
            this.form.resetFields()
            message.success("组织添加成功")
        }
    }

    render() {
        const {groupList} = this.state
        return (
            <div>
                <div style={{display: "flex", justifyContent: "center", marginTop: 50}}>
                    <Card title="添加企业" style={{width: "45%"}}>
                        <AddAdminForm
                            setForm={(form) => {
                                this.form = form
                            }}
                            groupList={groupList}
                        />
                        <Button type="primary" onClick={this.saveGroup}>保存</Button>
                    </Card>
                </div>
            </div>

        )
    }
}