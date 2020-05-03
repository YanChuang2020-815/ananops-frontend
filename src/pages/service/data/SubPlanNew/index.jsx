import React,{Component,} from 'react'
import { Form,Input,Select,Button,message,DatePicker } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
class SubPlanNew extends Component{
    constructor(props){
        super(props)
        this.state={
            subDetail:{},
            token:window.localStorage.getItem('token'),
            maintainerId:window.localStorage.getItem('id')
        }
    }
    componentDidMount(){
      }

    handleSubmit = (e) => {
        e.preventDefault()
        const {
          form,
          history,
          match : { params : {id,subId } },
        } = this.props
        const { getFieldValue } = form;
        const values = form.getFieldsValue()
        if(!getFieldValue('principalId')){
          message.error('请输入负责人ID')
        }
        if(!getFieldValue('deviceId')){
          message.error('请输入设备ID')
        }
        if(!getFieldValue('deviceType')){
          message.error('请输入设备类型')
        }
        values.id=null
        values.taskId=id
        values.taskItemId=subId
        values.maintainerId=this.state.maintainerId
        console.log(this.state.maintainerId)
        axios({
          method: 'POST',
          url: '/mdmc/mdmcItem/save',
          headers: {
            'Content-Type': 'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:values
        })
      .then((res) => {
          if(res && res.status === 200){     
          // this.setState({
          //    projectDetail:res.data.result
          // });
          this.changeStatus(subId,2,'维修工填了备件方案，备件审核')
          console.log(res.data.result.maintainerId)
       
          }
      })
      .catch(function (error) {
          console.log(error);
      });
     }

    //操作改变进行状态之间的切换
  changeStatus(id,status,statusMsg){
    const {
        history,
      } = this.props
    const values={"status": status,"statusMsg": statusMsg,"itemId":id}
    axios({
        method: 'POST',
        url: '/mdmc/mdmcItem/modifyItemStatusByItemId',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(values)
      })
    .then((res) => {
        if(res && res.status === 200){
            history.push('cbd/maintain/data')
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
            match : { params : { id,} }
          } = this.props
          const { subDetail } = this.state
        return(
            <div>
                <div className="inpection-plan-create-page">
                
                <Form
                    onSubmit={this.handleSubmit}
                >
                    <Form.Item
                    {...createFormItemLayout}
                    label="负责人ID"
                    >
                    {getFieldDecorator('principalId',{
                        initialValue: id && subDetail.principalId,
                        rules:[{
                        required:true,
                        message:"请输入负责人ID",
                        }]
                    })(
                        <Input placeholder="请输入负责人ID" />
                    )}  
                    </Form.Item>
                    {/* <Form.Item
                    {...createFormItemLayout}
                    label="维修工ID"
                    >
                    {getFieldDecorator('maintainerId',{
                        initialValue: id && subDetail.maintainerId,
                        rules:[{
                        required:true,
                        message:"请输入维修工ID",
                        }]
                    })(
                        <Input placeholder="请输入维修工ID" />
                    )}  
                    </Form.Item> */}
                    <Form.Item
                    {...createFormItemLayout}
                    label="设备ID"
                    >
                    {getFieldDecorator('deviceId',{
                        initialValue: id && subDetail.deviceId,
                        rules:[{
                        required:true,
                        message:"请输入设备ID",
                        }]
                    })(
                        <Input placeholder="请输入设备ID" />
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="设备类型"
                    >
                    {getFieldDecorator('deviceType',{
                        initialValue: id && subDetail.deviceType,
                        rules:[{
                        required:true,
                        message:"请输入设备类型",
                        }]
                    })(
                        <Input placeholder="请输入设备类型" />
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="总花费"
                    >
                    {getFieldDecorator('cost',{
                        initialValue: id && subDetail.cost,
                        rules:[{
                        required:false,
                        message:"请输入总花费",
                        }]
                    })(
                        <Input placeholder="请输入总花费" />
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="总计"
                    >
                    {getFieldDecorator('count',{
                        initialValue: id && subDetail.count,
                        rules:[{
                        required:false,
                        message:"请输入总计",
                        }]
                    })(
                        <Input placeholder="请输入总计" />
                    )}  
                    </Form.Item>

                    <section className="operator-container">
                    <div style={{textAlign:"center"}}>
                        <Button
                        htmlType="submit"
                        type="primary"
                        size="default"
                        >新建
                        </Button>
                        <Button
                        style={{marginLeft:"28px"}}
                        size="default"
                        onClick={()=> {
                            const {
                            history,
                            } = this.props
                            history.push('cbd/maintain/data')
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
export default Form.create()(SubPlanNew)