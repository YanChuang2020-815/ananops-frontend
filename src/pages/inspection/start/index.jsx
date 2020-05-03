import React,{Component,} from 'react'
import { Form,Input,Select,Button,message,DatePicker,Radio } from 'antd';
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
      imcTaskPlanDetail:[],
      principleDetail:{},
      providerDetail:{},
      id:'',
      groupId:JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId,
      roleCode:window.localStorage.getItem('roleCode'),
      token:window.localStorage.getItem('token'),
      orderDetail:{},
      selectedImcTaskPlanDetail:{},
      planOptionShow:true
    }
  }
  componentDidMount(){
    this.setState({id:id})
    this.principleConvert(id)
    this.getProject()
  }

    //获取项目下的全部巡检列表信息
    getImcTaskPlanList = (id) => {
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/getTasksByProjectId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){
            console.log(res)
            this.setState({
              imcTaskPlanDetail: res.data.result,
            });
            console.log("当前项目对应的全部巡检方案：")
            console.log(this.state.imcTaskPlanDetail)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }

    //选择巡检方案
    selectImcTaskPlan=(value)=>{
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/getTaskById/'+value,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){  
            console.log("选中的巡检方案：")
            console.log(res)
            this.setState({
              selectedImcTaskPlanDetail:res.data.result,
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
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
              orderDetail:res.data.result,
              planOptionShow:false
            }) 
            if(info.facilitatorId){
              this.providerConvert(info.facilitatorId)
            }
            this.getImcTaskPlanList(value);
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

    //获取巡检方案名
    getImcTaskOption=()=>{
      const {imcTaskPlanDetail} = this.state
      var imcTaskPlanList=imcTaskPlanDetail&&imcTaskPlanDetail.map((item,index)=>(
        <Select.Option key={index} value={item.id}>
          {item.taskName}
        </Select.Option>
      ))
      return imcTaskPlanList;
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
      if(!getFieldValue('executeTimes')){
        message.error('请输入巡检的次数')
        return;
      }
      if(!getFieldValue('imcTaskContent')){
        message.error('请输入巡检的内容')
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
        inspectionType:1,
        days:values.cycleTime,
        principalId:values.aleaderId,
        projectId:values.projectId,
        scheduledStartTime:values.scheduledStartTime,
        taskName:values.taskName,
        userId:values.id,
        times:values.executeTimes,
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
      const { planOptionShow,inspectionDetail,selectedImcTaskPlanDetail,orderDetail,principleDetail,providerDetail } = this.state
      return(
        <div>
          <div className="inpection-plan-create-page">
                
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                {...createFormItemLayout}
                label="项目名称"
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
                label="巡检方案名称"
              >
                {getFieldDecorator('imcTaskPlanId',{
                  initialValue: orderDetail.imcTaskPlanId,
                  rules:[{
                    required:true,
                    message:"请选择巡检方案",
                  }]
                })(
                  <Select
                    placeholder="请选择巡检方案"
                    className="inspection-log-abnormal-select"
                    disabled={planOptionShow}
                    onChange={(value) => { this.selectImcTaskPlan(value) }}
                    allowClear
                  >
                    {this.getImcTaskOption()}
                  </Select>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方名称"
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
                label="服务方id"
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
                label="用户方负责人"
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
                label="用户方负责人id"
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
                label="用户方负责人电话"
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
                  initialValue: moment(selectedImcTaskPlanDetail.scheduledStartTime),
                  rules:[{
                    required:true,
                    message:"请选择预计开始时间",
                  }]
                })(
                  <DatePicker
                    disabled='true'
                    locale={locale}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择预计开始时间"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />,
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="任务名称"
              >
                {getFieldDecorator('taskName',{
                  initialValue: inspectionDetail.taskName||selectedImcTaskPlanDetail.taskName,
                  rules:[{
                    required:true,
                    message:"请输入任务名称",
                  }]
                })(
                  <Input placeholder="请输入任务名称" disabled='true'/>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="巡检任务内容"
              >
                {getFieldDecorator('imcTaskContent', {
                  initialValue: id && selectedImcTaskPlanDetail.inspectionContent,
                  rules: [{
                    required: true,
                    message: "请输入巡检任务内容",
                  }]
                })(
                  <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} placeholder="请输入巡检任务内容" disabled="true"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="巡检周期（天）"
              >
                {getFieldDecorator('cycleTime',{
                  initialValue: inspectionDetail.cycleTime||selectedImcTaskPlanDetail.cycleTime,
                  rules:[{
                    required:true,
                    message:"请输入巡检周期",
                  }]
                })(
                  <Input placeholder="请输入巡检周期" disabled='true'/>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="巡检次数（次）"
              >
                {getFieldDecorator('executeTimes',{
                  initialValue: inspectionDetail.executeTimes,
                  rules:[{
                    required:true,
                    message:"请输入巡检的次数（次）",
                  }]
                })(
                  <Input placeholder="请输入巡检的次数（次）" />
                )}  
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