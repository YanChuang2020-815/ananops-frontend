import React,{Component,} from 'react'
import { Form,Input,Select,Button,message,DatePicker,InputNumber } from 'antd';
import { Link } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
const token=window.localStorage.getItem('token');
const id=window.localStorage.getItem('id');
let name='';
class InspectionNew extends Component{
    constructor(props){
        super(props)
        this.state={
            inspectionDetail:{
                
            },
            projectDetail:[],
            principleDetail:{},
            providerDetail:{},
            id:'',
            groupId:JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId,
            roleCode:window.localStorage.getItem('roleCode'),
            token:window.localStorage.getItem('token'),
            orderDetail:{},
        }
    }
    componentDidMount(){
      this.setState({id:id})
      this.principleConvert(id)
      this.getProject()
    }

    getProject=()=>{
      const {roleCode}=this.state
      this.getProjectListByGroup()
    }
    //如果用户是用户负责人
    getProjectListByGroup=()=>{
      const {groupId}=this.state
      const values={groupId: groupId, projectType: "巡检项目"}
      axios({
        method: 'POST',
        url: '/pmc/project/getProjectList',
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:values
      })
        .then((res) => {
          if(res && res.status === 200){  
            console.log(res.data.result)                 
            this.setState({
              projectDetail:res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //选择项目
    selectProject=(value)=>{
        axios({
        method: 'POST',
        url: '/pmc/project/getById/'+value,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){  
            var info={}
            var {orderDetail,roleCode}=this.state
            info.principalId=res.data.result.aleaderId 
            info.facilitatorId=res.data.result.bleaderId 
            this.setState({
              orderDetail:res.data.result
            }) 
            if(info.facilitatorId){
              this.providerConvert(info.facilitatorId)
            }
            console.log("orderDetail")
            console.log(res.data.result)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    principleConvert=(id)=>{
      const {orderDetail}=this.state
      var info=orderDetail
      axios({
        method: 'POST',
        url: '/uac/user/getUacUserById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){  
            this.setState({
              principleDetail:res.data.result
            })
            console.log("principle")
            console.log(res.data.result)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    providerConvert=(id)=>{
      const {orderDetail}=this.state
      var infoProvider=orderDetail
      axios({
        method: 'POST',
        url: '/uac/user/getUacUserById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){  
            this.setState({
              providerDetail:res.data.result
            })
            console.log("provider")
            console.log(res.data.result)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      return name
    }

    //获取项目名
    getOption=()=>{
      const {projectDetail}=this.state
      var projectitem=projectDetail&&projectDetail.map((item, index) => (
        <Select.Option key={index} value={item.id}> 
          {item.projectName}
        </Select.Option>
      ))
      return projectitem
    }


    handleSubmit = (e) => {
        e.preventDefault()
        const {
          form,
          history,
        } = this.props
        const { getFieldValue } = form;
        const values = form.getFieldsValue()
        if(!getFieldValue('projectId')){
          message.error('请选择项目')
          return;
        }
        if(!getFieldValue('taskName')){
          message.error('请输入任务名称')
          return;
        }
        if(!getFieldValue('partyBName')){
          message.error('请输入服务方名称')
          return;
        }
        if(!getFieldValue('partyBId')){
          message.error('请输入服务方Id')
          return;
        }
        if(!getFieldValue('aleaderName')){
          message.error('请输入用户方负责人')
          return;
        }
        if(!getFieldValue('aleaderId')){
          message.error('请输入用户方负责人Id')
          return;
        }
        if(!getFieldValue('aleaderTel')){
          message.error('请输入用户方负责人电话')
          return;
        }
        if(!getFieldValue('scheduledStartTime')){
          message.error('请选择预计开始时间')
          return;
        }
        if(!getFieldValue('cycleTime')){
          message.error('请输入巡检周期')
          return;
        }
        if(!getFieldValue('scheduledFinishTime')){
          message.error('请输入持续时间')
          return;
        }
        if(!getFieldValue('pointSum')){
          message.error('请输入本次巡检的总点位数')
          return;
        }
        if(!getFieldValue('imcTaskContent')){
          message.error('请输入巡检任务的内容')
          return;
        }
        if(id){
          values.id=id
        }
        values.scheduledStartTime=getFieldValue('scheduledStartTime').format('YYYY-MM-DD HH:mm:ss')
        console.log("信息：")
        console.log(values)
        let createImcInfo = {
          facilitatorId:values.partyBId,
          facilitatorGroupId:values.partyBId,
          facilitatorManagerId:values.partyBId,
          frequency:values.cycleTime,
          inspectionType:2,
          days:values.scheduledFinishTime,
          principalId:values.aleaderId,
          projectId:values.projectId,
          scheduledStartTime:values.scheduledStartTime,
          taskName:values.taskName,
          userId:values.id,
          pointSum:values.pointSum,
          content:values.imcTaskContent
      };
      console.log(createImcInfo);
      axios({
          method: 'POST',
          url: '/imc/inspectionTask/save',
          headers: {
              'Content-Type':'application/json',
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify(createImcInfo)
      })
      .then((res) => {
          if(res && res.status === 200){     
              console.log("巡检任务发起成功：" + JSON.stringify(res.data.result))
              alert("巡检任务发起成功！")
              this.props.history.push('/cbd/inspection/');
          }
      })
      .catch(function (error) {
          console.log(error);
          message.info("您不具备该权限")
      });
     }

    render(){
        const createFormItemLayout = {
            labelCol: {span:8},
            wrapperCol : {span:8},
          }
          const { 
            form: { getFieldDecorator }, 
          } = this.props
          const { inspectionDetail,orderDetail,principleDetail,providerDetail } = this.state
        return(
            <div>
                <div className="inpection-plan-create-page">
                
                <Form
                    onSubmit={this.handleSubmit}
                >
                    <Form.Item
                      {...createFormItemLayout}
                      label="关联的项目"
                    >
                      {getFieldDecorator('projectId',{
                        initialValue: orderDetail.projectId,
                        rules:[{
                          required:true,
                          message:"请选择项目",
                        }]
                      })(
                        <Select
                          placeholder="请选择项目"
                          className="inspection-log-abnormal-select"
                          onChange={(value) => { this.selectProject(value) }}
                          allowClear
                        >
                          {this.getOption()}
                        </Select>
                      )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="服务商公司名称"
                    >
                    {getFieldDecorator('partyBName',{
                        initialValue: orderDetail.partyBName,
                        rules:[{
                        required:true,
                        message:"请输入服务方名称",
                        }]
                    })(
                        <Input placeholder="请输入服务方名称" disabled='true' />
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="服务商公司编号"
                    >
                    {getFieldDecorator('partyBId',{
                        initialValue: orderDetail.partyBId,
                        rules:[{
                        required:true,
                        message:"请输入服务方Id",
                        }]
                    })(
                        <Input placeholder="请输入服务方Id" disabled='true'/>
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="用户负责人名称"
                    >
                    {getFieldDecorator('aleaderName',{
                        initialValue: principleDetail.userName,
                        rules:[{
                        required:true,
                        message:"请输入用户方负责人",
                        }]
                    })(
                        <Input placeholder="请输入用户方负责人" disabled='true'/>
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="用户负责人编号"
                    >
                    {getFieldDecorator('aleaderId',{
                        initialValue: principleDetail.id,
                        rules:[{
                        required:true,
                        message:"请输入用户方负责人Id",
                        }]
                    })(
                        <Input placeholder="请输入用户方负责人Id" disabled='true'/>
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="用户负责人电话"
                    >
                    {getFieldDecorator('aleaderTel',{
                        initialValue: principleDetail.mobileNo,
                        rules:[{
                        required:true,
                        message:"请输入用户方负责人电话",
                        }]
                    })(
                        <Input placeholder="请输入用户方负责人电话" disabled='true'/>
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="预计开始时间"
                    >
                    {getFieldDecorator('scheduledStartTime',{
                        initialValue: moment(inspectionDetail.scheduledStartTime),
                        rules:[{
                        required:true,
                        message:"请选择预计开始时间",
                        }]
                    })(
                        <DatePicker
                        locale={locale}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="请选择预计开始时间"
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      />,
                    )}  
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="临检任务名称"
                    >
                    {getFieldDecorator('taskName',{
                        initialValue: inspectionDetail.taskName,
                        rules:[{
                        required:true,
                        message:"请输入任务名称",
                        }]
                    })(
                        <Input placeholder="请输入任务名称" />
                    )}  
                    </Form.Item>
                    <Form.Item
                        {...createFormItemLayout}
                        label="巡检任务内容"
                    >
                        {getFieldDecorator('imcTaskContent', {
                            initialValue: id && inspectionDetail.inspectionContent,
                            rules: [{
                                required: true,
                                message: "请输入巡检任务内容",
                            }]
                        })(
                            <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} placeholder="请输入巡检任务内容" />
                        )}
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="巡检周期"
                    >
                    {getFieldDecorator('cycleTime',{
                        initialValue: inspectionDetail.cycleTime,
                        rules:[{
                          required:true,
                          message:"请输入巡检周期",
                        }]
                    })(
                        <InputNumber placeholder="巡检周期" />
                    )} （天）
                    </Form.Item>
                    <Form.Item
                      {...createFormItemLayout}
                      label="持续时间"
                    >
                      {getFieldDecorator('scheduledFinishTime',{
                        initialValue: id && inspectionDetail.scheduledFinishTime,
                        rules:[{
                          required:true,
                          message:"请输入巡检的持续时间",
                        }]
                      })(
                        <InputNumber placeholder="持续时间" />
                      )} （天）
                    </Form.Item>
                    <Form.Item
                    {...createFormItemLayout}
                    label="总点位数"
                    >
                    {getFieldDecorator('pointSum',{
                        initialValue: inspectionDetail.pointSum,
                        rules:[{
                          required:true,
                          message:"请输入本次巡检的总点位数量",
                        }]
                    })(
                        <InputNumber placeholder="点位数量" />
                    )} （个）
                    </Form.Item>
                    <section className="operator-container">
                    <div style={{textAlign:"center"}}>
                        <Button
                        htmlType="submit"
                        type="primary"
                        size="default"
                        >{'新建'}
                        </Button>
                        <Button
                        style={{marginLeft:"28px"}}
                        size="default"
                        onClick={()=> {
                            const {
                            history,
                            } = this.props
                            history.push('/cbd/inspection/')
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
export default Form.create()(InspectionNew)