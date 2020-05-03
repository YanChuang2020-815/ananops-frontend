import React,{Component,} from 'react'
import { Form,Row,Col,Input,Select,Button,message,DatePicker,Radio } from 'antd';
import { Link } from 'react-router-dom'
import {reqInspcFormSchema,getFormTemplateDetailById} from '../../../axios/index'
import FormRender from 'form-render/lib/antd';

import axios from 'axios';

class FormTemplateNew extends Component{
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
      SCHEMA: {}
    }
  }
  componentDidMount() {
    const {match: {params: {templateId}}} = this.props
    if (templateId !== undefined) {
      this.getFormTemplateDetail(templateId);
    }
    this.getFormSchema();
  }

  async getFormTemplateDetail(templateId) {
    const result = await getFormTemplateDetailById(templateId);
    if(result.code===200){
      var data = result.result;
      this.setState({
        formData: {
          "assetList": data.assetList,
          "inspcDetailList": data.inspcDetailList
        },
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
          if (this.state.roleCode === 'user_manager' && item.status === 'E') {
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
    const {formData,SCHEMA,formTemplateDetail}=this.state;
    if(formData.assetList[0].device === '' || formData.inspcDetailList[0].itemContent === ''){
      message.error('请至少填写一项内容')
      return;
    }
    formData.schemaId=SCHEMA.id;
    formData.formTitle="";
    formData.templateId=formTemplateDetail.templateId;
    //保存
    axios({
      method: 'POST',
      url: '/mdc/formTemplate/saveFormTemplate',
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data: formData
    })
      .then((res) => {
        if(res && res.status === 200){ 
          this.props.history.push('/mds/form/list')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  onChange = formData => {
    this.setState({ formData });
  };

  // onValidate = valid => {
  //   console.log('没有通过的校验:', valid);
  // };
  
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
            displayType='row'
            showDescIcon={true}
          />
          <div style={{textAlign:"center", marginBottom: 20}}>
            <Button
              onClick={this.onSubmit}
              type="primary"
              size="default"
            >{formTemplateDetail.templateId ? '编辑' : '新建'}
            </Button>
            <Button
              style={{marginLeft:"28px"}}
              size="default"
              onClick={()=> {
                const {
                  history,
                } = this.props;
                history.push('/mds/form/list');
                this.setState({
                  formTemplateDetail: {}
                })
              }}
            >取消
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
  
export default Form.create()(FormTemplateNew)