import React,{Component,} from 'react'
import { Form,Row,Col,Input,Select,Button,message,DatePicker,Radio } from 'antd';
import { Link } from 'react-router-dom'
import {reqInspcFormSchema,getInvoiceItemDetailById} from '../../../axios/index'
import FormRender from 'form-render/lib/antd';

import axios from 'axios';

class InspcInvoiceEdit extends Component{
  constructor(props){
    super(props)
    this.state={
      groupId: JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId,
      roleCode: window.localStorage.getItem('roleCode'),
      token: window.localStorage.getItem('token'),
      formTemplateDetail:{},
      formData:  {
        "assetList": [
          {
            "device": ""
          }
        ],
        "inspcDetailList": [
          {
            "itemContent": "",
            "itemState": "",
            "itemResult": ""
          }
        ]
      },
      SCHEMA: {},
      validData: [],
    }
  }
  componentDidMount() {
    const invoiceDetail = this.props.invoiceDetail
    this.getInvoiceItemDetailById(invoiceDetail.id);
    this.getFormSchema();
  }

  async getInvoiceItemDetailById(invoiceId) {
    const result = await getInvoiceItemDetailById(invoiceId);
    if(result.code===200){
      var data = result.result;
      this.setState({
        formData: data,
        formTemplateDetail: data
      })
    } else {
      message.error("系统字典库，不允许更新！");
    }
  }

  async getFormSchema() {
    const result = await reqInspcFormSchema();
    if(result.code===200){
      var schema = result.result;
      if (schema != undefined) {
        schema.map(item => {
          if (this.state.roleCode === 'engineer' && item.status === 'V') {
            this.setState({
              SCHEMA: item
            })
          }
        })
      }
      
    } else {
      message.error("系统字典库，不允许更新！");
    }
  }
  
  onSubmit = (e) => {
    const {formData,SCHEMA,formTemplateDetail,validData}=this.state;
    if (formData.assetList[0].device === '' || formData.inspcDetailList[0].itemContent === ''){
      message.error('请至少填写一项内容')
      return;
    }
    if (validData.length > 0) {
      message.error('所有加*项必填，请填写完毕再提交表单！')
      return;
    }
    formData.schemaId=SCHEMA.id;
    formData.formTitle="";
    formData.templateId=formTemplateDetail.templateId;
    //保存
    axios({
      method: 'POST',
      url: '/imc/itemInvoice/save',
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data: formData
    })
      .then((res) => {
        if(res && res.status === 200){ 
          this.props.backToInvoiceTable();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  onChange = formData => {
    this.setState({ formData });
  };

  handleValidate = valid => {
    this.setState({
      validData: valid
    })
  };
  
  render(){

    const { formData,SCHEMA,formTemplateDetail } = this.state;
    const { propsSchema, uiSchema } = SCHEMA;
    return(
      <div className="dictionatry-create-page">
        <div style={{textAlign: 'center', width: "80%", margin: 'auto', background: "white"}}>
          <FormRender
            propsSchema={propsSchema}
            uiSchema={uiSchema}
            formData={formData}
            onChange={this.onChange}
            onValidate={this.handleValidate}
            displayType='row'
            showDescIcon={true}
          />
          <div style={{textAlign:"center", marginBottom: 20}}>
            <Button
              onClick={this.onSubmit}
              type="primary"
              size="default"
            >提交
            </Button>
            <Button
              style={{marginLeft:"28px"}}
              size="default"
              onClick={()=> {
                this.props.backToInvoiceTable();
              }}
            >取消
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
  
export default Form.create()(InspcInvoiceEdit)