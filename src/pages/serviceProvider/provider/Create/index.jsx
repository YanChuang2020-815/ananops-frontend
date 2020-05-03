import React, { Component, } from 'react';
import { Form,Input,Select,Button,message } from 'antd';
import { Link } from 'react-router-dom'

class ProviderNew extends Component{
    constructor(props){
        super(props)
        this.state={
            providerDetail:{}
        }
    }
    render(){
        const createFormItemLayout = {
            labelCol: {span:8},
            wrapperCol : {span:8},
          }
          const { 
            form: { getFieldDecorator }, 
            match : { params : { id } }
          } = this.props
          const { providerDetailtail } = this.state
        return(
            <div className="inpection-plan-create-page">
            
            <Form
                onSubmit={this.handleSubmit}
            >
                <Form.Item
                {...createFormItemLayout}
                label="公司名称"
                >
                {getFieldDecorator('companyName',{
                    initialValue: id && providerDetailtail.companyName,
                    rules:[{
                    required:true,
                    message:"请填写公司名称",
                    }]
                })(
                    <Input placeholder="请输入公司名称" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="法人姓名"
                >
                {getFieldDecorator('legalName',{
                    initialValue: id && providerDetailtail.legalName,
                    rules:[{
                    required:true,
                    message:"请输入法人姓名",
                    }]
                })(
                    <Input placeholder="请输入法人姓名" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="法人联系方式"
                >
                {getFieldDecorator('legalPhone',{
                    initialValue: id && providerDetailtail.legalPhone,
                    rules:[{
                    required:true,
                    message:"请选择法人联系方式",
                    }]
                })(
                    <Input placeholder="请选择法人联系方式"/>,
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="法人身份账号"
                >
                {getFieldDecorator('legalId',{
                    initialValue: id && providerDetailtail.legalId,
                    rules:[{
                    required:true,
                    message:"请选择法人身份账号",
                    }]
                })(
                    <Input placeholder="请输入法人身份账号" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="主体机构类别"
                >
                {getFieldDecorator('companyType',{
                    initialValue: id && providerDetailtail.companyType,
                    rules:[{
                    required:true,
                    message:"请输入主体机构类别",
                    }]
                })(
                    <Input placeholder="请输入主体机构类别" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="主体行业"
                >
                {getFieldDecorator('mainWork',{
                    initialValue: id && providerDetailtail.mainWork,
                    rules:[{
                    required:false,
                    message:"请输入主体行业",
                    }]
                })(
                    <Input placeholder="请输入主体行业" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="国家地区"
                >
                {getFieldDecorator('country',{
                    initialValue: id && providerDetailtail.country,
                    rules:[{
                    required:true,
                    message:"请输入国家地区",
                    }]
                })(
                    <Input placeholder="请输入国家地区" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="注册地"
                >
                {getFieldDecorator('registeredAddress',{
                    initialValue: id && providerDetailtail.registeredAddress,
                    rules:[{
                    required:true,
                    message:"请输入注册地",
                    }]
                })(
                    <Input placeholder="请输入注册地" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="详细地址"
                >
                {getFieldDecorator('companyAddress',{
                    initialValue: id && providerDetailtail.companyAddress,
                    rules:[{
                    required:true,
                    message:"请输入详细地址",
                    }]
                })(
                    <Input placeholder="请输入详细地址" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="邮政编码"
                >
                {getFieldDecorator('zipCode',{
                    initialValue: id && providerDetailtail.zipCode,
                    rules:[{
                    required:false,
                    message:"请输入邮政编码",
                    }]
                })(
                    <Input placeholder="请输入邮政编码" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="联系人"
                >
                {getFieldDecorator('contactName',{
                    initialValue: id && providerDetailtail.contactName,
                    rules:[{
                    required:false,
                    message:"请输入联系人",
                    }]
                })(
                    <Input placeholder="请输入联系人" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="联系人电话"
                >
                {getFieldDecorator('contactPhone',{
                    initialValue: id && providerDetailtail.contactPhone,
                    rules:[{
                    required:false,
                    message:"请输入联系人电话",
                    }]
                })(
                    <Input placeholder="请输入联系人电话" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="基本户账户名称"
                >
                {getFieldDecorator('accountName',{
                    initialValue: id && providerDetailtail.accountName,
                    rules:[{
                    required:false,
                    message:"请输入基本户账户名称",
                    }]
                })(
                    <Input placeholder="请输入基本户账户名称" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="基本账户账号"
                >
                {getFieldDecorator('accountId',{
                    initialValue: id && providerDetailtail.accountId,
                    rules:[{
                    required:false,
                    message:"请选择基本账户账号",
                    }]
                })(
                    <Input placeholder="请选择基本账户账号" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="营业执照类别"
                >
                {getFieldDecorator('licenseType',{
                    initialValue: id && providerDetailtail.licenseType,
                    rules:[{
                    required:false,
                    message:"请输入营业执照类别",
                    }]
                })(
                    <Input placeholder="请输入营业执照类别" />
                )}  
                </Form.Item>
                
                <Form.Item
                {...createFormItemLayout}
                label="注册资本"
                >
                {getFieldDecorator('registeredCaptial',{
                    initialValue: id && providerDetailtail.registeredCaptial,
                    rules:[{
                    required:false,
                    message:"请输入注册资本",
                    }]
                })(
                    <Input placeholder="请输入注册资本" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="统一社会信用编码"
                >
                {getFieldDecorator('socialCreditCode',{
                    initialValue: id && providerDetailtail.socialCreditCode,
                    rules:[{
                    required:false,
                    message:"请选择统一社会信用编码",
                    }]
                })(
                    <Input placeholder="请选择统一社会信用编码" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="有效期"
                >
                {getFieldDecorator('expirationDate',{
                    initialValue: id && providerDetailtail.expirationDate,
                    rules:[{
                    required:false,
                    message:"请输入有效期",
                    }]
                })(
                    <Input placeholder="请输入有效期" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="经营范围"
                >
                {getFieldDecorator('businessScope',{
                    initialValue: id && providerDetailtail.businessScope,
                    rules:[{
                    required:false,
                    message:"请输入经营范围",
                    }]
                })(
                    <Input placeholder="请输入经营范围" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="供应产品类别"
                >
                {getFieldDecorator('productCategory',{
                    initialValue: id && providerDetailtail.productCategory,
                    rules:[{
                    required:false,
                    message:"请选择供应产品类别",
                    }]
                })(
                    <Input placeholder="请选择供应产品类别" />
                )}  
                </Form.Item>
                <section className="operator-container">
                <div style={{textAlign:"center"}}>
                    <Button
                    htmlType="submit"
                    type="primary"
                    size="default"
                    >{id ? '编辑' : '新建'}
                    </Button>
                    <Button
                    style={{marginLeft:"28px"}}
                    size="default"
                    onClick={()=> {
                        const {
                        history,
                        } = this.props
                        history.push('/serviceProvider/provider')
                    }}
                    >取消
                    </Button>
                </div>
                </section>
            </Form>
            </div>
        )
    }
}
export default Form.create(ProviderNew)