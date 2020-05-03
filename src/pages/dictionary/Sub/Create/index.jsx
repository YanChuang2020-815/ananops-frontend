import React,{Component,} from 'react'
import { Form,Input,Select,Button,message,DatePicker,Upload,Tooltip,Icon } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
const { Option } = Select;

class DictionaryItemNew extends Component{
  constructor(props){
    super(props)
    this.state={
      dictItemDetail:{},
      token:window.localStorage.getItem('token'),

    }
  }
  componentDidMount(){
    const {match : { params : { dictId } }} = this.props   
  }
   
  
 
    handleSubmit = (e) => {
      e.preventDefault()
      const {
        form,
        history,
        match : { params : {dictId,itemId } },
      } = this.props
      const { getFieldValue } = form;
      const values = form.getFieldsValue()
      if(!getFieldValue('name')){
        message.error('请填写字典项名称')
      }
      if(!getFieldValue('code')){
        message.error('请输入字典项编码')
      }
      if(!getFieldValue('sort')){
        message.error('请输入字典项类型')
      }

      axios({
        method: 'POST',
        url: '/mdc/dictItem/save',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(values)
      })
        .then((res) => {
          console.log(JSON.stringify(values))
          if(res && res.status === 200){     
            history.push('/mds/dict/list/dictItem/'+dictId)
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
        match : { params : { dictId,itemId} }
      } = this.props
      const { dictItemDetail } = this.state
    
      return(
        <div>
          <div className="inpection-plan-create-page">
                
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                {...createFormItemLayout}
                label="字典库ID"
              >
                {getFieldDecorator('dictId',{
                  initialValue: dictId,
                  rules:[{
                    required:true,
                    message:"请输入字典库ID",
                  }]
                })(
                  <Input placeholder="请输入字典库ID" disabled />
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="字典项名称"
              >
                {getFieldDecorator('name',{
                  initialValue: itemId && dictItemDetail.name,
                  rules:[{
                    required:true,
                    message:"请填写字典项名称",
                  }]
                })(
                  <Input placeholder="请填写字典项名称" />,
                  
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="字典项类型"
              >
                {getFieldDecorator('sort',{
                  initialValue: itemId && dictItemDetail.sort,
                  rules:[{
                    required:true,
                    message:"请填写字典项类型",
                  }]
                })( 
                  <Input placeholder="请填写字典项类型" />
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="字典项编码"
              >
                {getFieldDecorator('code',{
                  initialValue: itemId && dictItemDetail.code,
                  rules:[{
                    required:true,
                    message:"请填写字典项编码",
                  }]
                })( 
                  <Input placeholder="请填写字典项编码" />
                )}  
              </Form.Item>
             
              <section className="operator-container">
                <div style={{textAlign:"center"}}>
                  <Button
                    htmlType="submit"item
                    type="primary"
                    size="default"
                  >{itemId ? '编辑' : '新建'}
                  </Button>
                  <Button
                    style={{marginLeft:"28px"}}
                    size="default"
                    onClick={()=> {
                      const {
                        history,
                      } = this.props
                      history.push('/mds/dict/list/dictItem/'+dictId)
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
export default Form.create()(DictionaryItemNew)