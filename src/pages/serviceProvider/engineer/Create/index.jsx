import React, { Component, } from 'react';
import { Form,Input,Select,Button,message,Radio,Cascader } from 'antd';
import { Link } from 'react-router-dom'
const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ];
class EngineerNew extends Component{
    constructor(props){
        super(props)
        this.state={
            engineerDetail:{}
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
          const { engineerDetailtail } = this.state
        return(
            <div className="inpection-plan-create-page">
            
            <Form
                onSubmit={this.handleSubmit}
            >
                <Form.Item
                {...createFormItemLayout}
                label="姓名"
                >
                {getFieldDecorator('name',{
                    initialValue: id && engineerDetailtail.name,
                    rules:[{
                    required:true,
                    message:"请填写姓名",
                    }]
                })(
                    <Input placeholder="请输入姓名" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="性别"
                >
                {getFieldDecorator('sex',{
                    initialValue: id && engineerDetailtail.sex,
                    rules:[{
                    required:true,
                    message:"请选择性别",
                    }]
                })(
                    <Radio.Group value={this.state.value}>
                    <Radio value={"女"}>男</Radio>
                    <Radio value={"男"}>女</Radio>
                  </Radio.Group>
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="所在省市"
                >
                {getFieldDecorator('location',{
                    initialValue: id && engineerDetailtail.location,
                    rules:[{
                    required:true,
                    message:"请选择所在省市",
                    }]
                })(
                    <Cascader options={options} placeholder="请选择所在省市"/>,
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="身份证号码"
                >
                {getFieldDecorator('identityNumber',{
                    initialValue: id && engineerDetailtail.identityNumber,
                    rules:[{
                    required:true,
                    message:"请选择身份证号码",
                    }]
                })(
                    <Input placeholder="请输入身份证号码" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="身份证有效期"
                >
                {getFieldDecorator('expirationDate',{
                    initialValue: id && engineerDetailtail.expirationDate,
                    rules:[{
                    required:true,
                    message:"请输入身份证有效期",
                    }]
                })(
                    <Input placeholder="请输入身份证有效期" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="职务"
                >
                {getFieldDecorator('position',{
                    initialValue: id && engineerDetailtail.position,
                    rules:[{
                    required:false,
                    message:"请输入职务",
                    }]
                })(
                    <Input placeholder="请输入职务" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="职称"
                >
                {getFieldDecorator('title',{
                    initialValue: id && engineerDetailtail.title,
                    rules:[{
                    required:true,
                    message:"请输入职称",
                    }]
                })(
                    <Input placeholder="请输入职称" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="学历"
                >
                {getFieldDecorator('education',{
                    initialValue: id && engineerDetailtail.education,
                    rules:[{
                    required:true,
                    message:"请输入学历",
                    }]
                })(
                    <Input placeholder="请输入学历" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="联系电话"
                >
                {getFieldDecorator('phone',{
                    initialValue: id && engineerDetailtail.phone,
                    rules:[{
                    required:true,
                    message:"请输入联系电话",
                    }]
                })(
                    <Input placeholder="请输入联系电话" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="从业开始时间"
                >
                {getFieldDecorator('employmentStart',{
                    initialValue: id && engineerDetailtail.employmentStart,
                    rules:[{
                    required:false,
                    message:"请输入从业开始时间",
                    }]
                })(
                    <Input placeholder="请输入从业开始时间" />
                )}  
                </Form.Item>
                <Form.Item
                {...createFormItemLayout}
                label="图片存放路径url"
                >
                {getFieldDecorator('photo',{
                    initialValue: id && engineerDetailtail.photo,
                    rules:[{
                    required:false,
                    message:"请输入图片存放路径url",
                    }]
                })(
                    <Input placeholder="请输入图片存放路径url" />
                    // <Upload>
                    //     <Button>
                    //     <Icon type="upload" />上传图片
                    //     </Button>
                    // </Upload>,
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
                        history.push('/serviceProvider/engineer')
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
export default Form.create(EngineerNew)