import React, { Component, } from 'react';
import { Button,Descriptions,Card } from 'antd'
import {reqCompanyInfo} from '../../../../axios/index.js'
import './index.styl'

const Item = Descriptions.Item
export default class Provider extends Component{

  constructor(props) {
    super(props);
    this.state={
      providerInfo:{}
    }
  }

  getProviderInfo = async () => {
    const userId = window.localStorage.getItem('id');
    const result = await reqCompanyInfo(userId)
    if(result.code===200){
      this.setState({providerInfo:result.result})
    }
  }

  componentDidMount() {
    this.getProviderInfo()
  }

  render(){
    const {providerInfo} = this.state
    return(
      <div>
        <Card title="基础信息" extra={(<Button type="default" icon="edit" onClick={() => this.props.history.push('/cbd/alliance/business/edit',providerInfo)}>编辑</Button>)}>
          <Descriptions bordered size='small'>
            <Item label="主体名称" span={3}>{providerInfo.groupName}</Item>
            <Item label="法定代表人姓名">{providerInfo.legalPersonName}</Item>
            <Item label="法定代表人联系电话">{providerInfo.legalPersonPhone}</Item>
            <Item label="法定代表人身份证号">{providerInfo.legalPersonNumber}</Item>
            <Item label="附件"><a href={providerInfo.legalPersonidPhoto}>点击下载</a></Item>
            <Item label="主体机构类别">{providerInfo.type}</Item>
            <Item label="主体行业">{providerInfo.mainWork}</Item>
            <Item label="国别/地区">{providerInfo.country}</Item>
            {/* <Item label="注册地"></Item> */}
            <Item label="邮政编码">{providerInfo.zipCode}</Item>
            <Item label="联系人">{providerInfo.contact}</Item>
            <Item label="联系人电话">{providerInfo.contactPhone}</Item>
            <Item label="详细地址" span={2}>{providerInfo.detailAddress}</Item>
          </Descriptions>
        </Card>
        <Card title="基本账户开户许可证">
          <Descriptions bordered size='small'>
            <Item label="基本户账户名称">{providerInfo.groupName}</Item>
            <Item label="基本户账号">{providerInfo.accountNumber}</Item>
            <Item label="附件"><a href={providerInfo.accountOpeningLicense}>点击下载</a></Item>
          </Descriptions>
        </Card>
        <Card title="营业执照">
          <Descriptions bordered size='small'>
            <Item label="类型">{providerInfo.licenseType}</Item>
            <Item label="注册资本（人民币）">{providerInfo.registeredCaptial}</Item>
            <Item label="统一社会信用代码">{providerInfo.groupCode}</Item>
            <Item label="有效期">{providerInfo.expirationDate}</Item>
            <Item label="经营范围">{providerInfo.businessScope}</Item>
            <Item label="供应产品类别">{providerInfo.productCategory}</Item>
            <Item label="附件"><a href={providerInfo.businessLicensePhoto}>点击下载</a></Item>
          </Descriptions>
        </Card>
      </div>
      
    )
  }
}
