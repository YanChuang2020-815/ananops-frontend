import React,{Component,} from 'react'
import { Form,Row,Col,Input,Select,Button,message,DatePicker,Radio } from 'antd';
import { Link } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';

class DictionaryNew extends Component{
  constructor(props){
    super(props)
    this.state={
      groupId: JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId,
      roleCode: window.localStorage.getItem('roleCode'),
      token: window.localStorage.getItem('token'),
      dictionaryDetail:{},
    }
  }
  componentDidMount() {
    const {match: {params: {dictId}}} = this.props
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      history,
      match : { params : { dictId } },
    } = this.props
    const { getFieldValue } = form;
    const {dictionaryDetail}=this.state;
    const values = form.getFieldsValue()
    if(this.state.roleCode === 'admin' ){
      values.groupId=-1 ;
    }
    else{
      values.groupId=this.state.groupId;
    }
    console.log(JSON.stringify(values))
    if (!getFieldValue('name')) {
      message.error('请填写字典库名称')
    }
    if (!getFieldValue('status')) {
      message.error('请填写字典库状态')
    }
    if (!getFieldValue('dictLevel')) {
      message.error('请填写字典库等级')
    }

    //保存
    axios({
      method: 'POST',
      url: '/mdc/dict/save',
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(values)
    })
      .then((res) => {

        if(res && res.status === 200){ 
          history.push('/mds/dict/list')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  

  
  render(){
    const createFormItemLayout = {
      labelCol: {span:8},
      wrapperCol : {span:8},
    }
    const { 
      form: { getFieldDecorator }, 
      match : { params : { dicId } }
    } = this.props

    const { dictionaryDetail } = this.state
    return(
      <div>

        <div className="dictionatry-create-page">
            
          <Form
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              {...createFormItemLayout}
              label="字典库名字"
            >
              {getFieldDecorator('name',{
                initialValue: dicId && dictionaryDetail.name,
                rules:[{
                  required:true,
                  message:"请填写字典库名字",
                }]
              })(
                <Input placeholder="请输入字典库名字" />
              )}  
            </Form.Item>
         
            <Form.Item
              {...createFormItemLayout}
              label="字典库等级"
            >
              {getFieldDecorator('dictLevel',{
                initialValue: dicId && dictionaryDetail.dictLevel,
                rules:[{
                  required:true,
                  message:"请填写字典库等级",
                }]
              })(
                <Input placeholder="请输入字典库等级" />
              )}  
            </Form.Item>
         
            <Form.Item
              {...createFormItemLayout}
              label="字典库状态"
            >
              {getFieldDecorator('status',{
                initialValue: dicId && dictionaryDetail.status,
                rules:[{
                  required:true,
                  message:"请填写字典库状态",
                }]
              })(
                <Input placeholder="请输入字典库状态" />
              )}  
            </Form.Item>

            <section className="operator-container">
              <div style={{textAlign:"center"}}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="default"
                >{dicId ? '编辑' : '新建'}
                </Button>
                <Button
                  style={{marginLeft:"28px"}}
                  size="default"
                  onClick={()=> {
                    const {
                      history,
                    } = this.props
                    history.push('/mds/dict/list')
                  }}
                >取消
                </Button>
              </div>
            </section>
          </Form>
        </div>
      </div>
    )
  }
}
  
export default Form.create()(DictionaryNew)