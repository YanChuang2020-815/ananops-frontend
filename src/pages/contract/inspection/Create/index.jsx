import React,{Component,} from 'react'
import { Form,Input,Select,Button,message,DatePicker,InputNumber } from 'antd';
import { Link } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';

const token=window.localStorage.getItem('token');
const { TextArea } = Input;
const { Option } = Select;

class InspectionNew extends Component{
  constructor(props){
    super(props)
    this.state={
      inspectionDetail:{
                
      },
      projectDetail:{
              
      }
    }
  }
  componentDidMount(){
    const projectDetail = this.props.projectDetail;
    const inspectionDetail = this.props.inspectionDetail;
    const id = inspectionDetail.id;
    this.setState({
      projectDetail
    })
    console.log("项目id：" + projectDetail.id)
    console.log("巡检任务id：" + id)
    if(id){
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/getTaskById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
      })
        .then((res) => {
          console.log(res)
          if(res && res.status === 200){     
            this.setState({
              inspectionDetail:res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }else if(projectDetail.id){
      //如果是新建一个巡检任务
      axios({
        method: 'POST',
        url: '/pmc/project/getById/'+projectDetail.id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
      })
        .then((res) => {
          console.log(res)
          if(res && res.status === 200){     
            this.setState({
              projectDetail:res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

    getProjectDetail = () =>{

    }

    handleSubmit = (e) => {
      e.preventDefault()
      const {
        form,
        history,
      } = this.props
      const id = this.state.inspectionDetail.id;
      const { getFieldValue } = form;
      const values = form.getFieldsValue()
      if(!getFieldValue('projectId')){
        message.error('请填写项目ID');
        return;
      }
      if(!getFieldValue('projectName')){
        message.error('请输入项目名称');
        return;
      }
      if(!getFieldValue('partyBName')){
        message.error('请输入服务方名称');
        return;
      }
      if(!getFieldValue('partyBId')){
        message.error('请输入服务方Id');
        return;
      }
      if(!getFieldValue('aleaderName')){
        message.error('请输入用户方负责人');
        return;
      }
      if(!getFieldValue('aleaderId')){
        message.error('请输入用户方负责人Id');
        return;
      }
      if(!getFieldValue('aleaderTel')){
        message.error('请输入用户方负责人电话');
        return;
      }
      if(!getFieldValue('scheduledStartTime')){
        message.error('请选择预计开始时间');
        return;
      }
      if(!getFieldValue('deadlineTime')){
        message.error('请选择最晚开始时间');
        return;
      }
      if(!getFieldValue('cycleTime')){
        message.error('请输入巡检周期');
        return;
      }
      if(!getFieldValue('scheduledFinishTime')){
        message.error('请输入巡检持续时间');
        return;
      }
      if(!getFieldValue('taskName')){
        message.error('请输入计划名称');
        return;
      }
      if(!getFieldValue('pointSum')){
        message.error('请输入本次巡检的总点位数量');
        return;
      }
      if(!getFieldValue('inspectionContent')){
        message.error('请输入巡检内容');
        return;
      }
      if(id){
        values.id=id
      }
      values.taskType = "项目配套"
      values.isNow = 1
      values.scheduledStartTime=getFieldValue('scheduledStartTime').format('YYYY-MM-DD HH:mm:ss')
      values.deadlineTime=getFieldValue('deadlineTime').format('YYYY-MM-DD HH:mm:ss')
    
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/save',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
        data:JSON.stringify(values)
      })
        .then((res) => {
          if(res && res.status === 200){
            let createImcInfo = {
              facilitatorId:values.partyBId,
              facilitatorGroupId:values.partyBId,
              facilitatorManagerId:values.partyBId,
              frequency:values.cycleTime,
              inspectionType:1,
              days:values.scheduledFinishTime,
              principalId:values.aleaderId,
              projectId:values.projectId,
              scheduledStartTime:values.scheduledStartTime,
              taskName:values.taskName,
              userId:values.aleaderId,
              pointSum:values.pointSum,
              content:values.inspectionContent
            };
            console.log(createImcInfo);
            axios({
              method: 'POST',
              url: '/imc/inspectionTask/save',
              headers: {
                'Content-Type':'application/json',
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+token,
              },
              data:JSON.stringify(createImcInfo)
            }).then((res) => {
              if(res && res.status === 200){     
                console.log("巡检任务发起成功：" + JSON.stringify(res.data.result))
                alert("巡检任务发起成功！")
                this.props.backToInspectionTable(values.projectId);
              }
            })
            .catch(function (error) {
              console.log(error);
              message.info("您不具备该权限")
            });
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
      } = this.props
      const { inspectionDetail,projectDetail } = this.state;
      const id = inspectionDetail.id;
      return(
        <div>
          <div className="inpection-plan-create-page">
                
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                {...createFormItemLayout}
                label="项目ID"
              >
                {getFieldDecorator('projectId',{
                  initialValue: id && inspectionDetail.projectId || projectDetail.id,
                  rules:[{
                    required:true,
                    message:"请填写项目ID",
                  }]
                })(
                  <Input placeholder="请输入项目ID" disabled='true'/>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="项目名称"
              >
                {getFieldDecorator('projectName',{
                  initialValue: id && inspectionDetail.projectName || projectDetail.projectName,
                  rules:[{
                    required:true,
                    message:"请输入项目名称",
                  }]
                })(
                  <Input placeholder="请输入项目名称" disabled='true'/>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务商名称"
              >
                {getFieldDecorator('partyBName',{
                  initialValue: id || projectDetail.partyBName,
                  rules:[{
                    required:true,
                    message:"请输入服务方名称",
                  }]
                })(
                  <Input placeholder="请输入服务方名称" disabled='true'/>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务商编号"
              >
                {getFieldDecorator('partyBId',{
                  initialValue: id || projectDetail.partyBId,
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
                  initialValue: id || projectDetail.aleaderName,
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
                  initialValue: id || projectDetail.aleaderId,
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
                  initialValue: id || projectDetail.aleaderTel,
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
                  initialValue: id && moment(inspectionDetail.scheduledStartTime),
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
                label="最迟完成时间"
              >
                {getFieldDecorator('deadlineTime',{
                  initialValue: id && moment(inspectionDetail.deadlineTime),
                  rules:[{
                    required:true,
                    message:"请选择最迟完成时间",
                  }]
                })(
                  <DatePicker
                    locale={locale}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择最迟完成时间"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="巡检周期"
              >
                {getFieldDecorator('cycleTime',{
                  initialValue: id && inspectionDetail.cycleTime,
                  rules:[{
                    required:true,
                    message:"请输入巡检周期",
                  }]
                })(
                  <InputNumber placeholder="巡检周期" />
                )}（天）
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="持续时间"
              >
                {getFieldDecorator('scheduledFinishTime',{
                  initialValue: id && inspectionDetail.scheduledFinishTime,
                  rules:[{
                    required:true,
                    message:"请输入巡检的持续时间（天）",
                  }]
                })(
                  <InputNumber placeholder="持续时间" />
                )}（天）
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
                )}（个）
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="计划名称"
              >
                {getFieldDecorator('taskName',{
                  initialValue: id && inspectionDetail.taskName,
                  rules:[{
                    required:true,
                    message:"请输入计划名称",
                  }]
                })(
                  <Input placeholder="请输入名称" />
                )}  
              </Form.Item>
              {/* <Form.Item
                {...createFormItemLayout}
                label="方案类型"
              >
                {getFieldDecorator('taskType',{
                  initialValue: id && inspectionDetail.taskType || '0',
                  rules:[{
                    required:true,
                    message:"请选择巡检类型",
                  }]
                })(
                  <Select>
                    <Option value="0">日常巡视</Option>
                    <Option value="1">项目配套</Option>
                    <Option value="2">其他方案</Option>
                  </Select>
                )}  
              </Form.Item> */}
              <Form.Item
                {...createFormItemLayout}
                label="巡检内容"
              >
                {getFieldDecorator('inspectionContent',{
                  initialValue: id && inspectionDetail.inspectionContent,
                  rules:[{
                    required:true,
                    message:"请填写巡检任务内容（合同内容）",
                  }]
                })(
                  <TextArea rows={6} placeholder="请填写巡检任务内容（合同内容）"/>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="补充描述"
              >
                {getFieldDecorator('description',{
                  initialValue: id && inspectionDetail.description,
                  rules:[{
                    required:false,
                    message:"请填写巡检任务补充描述（自定义内容）",
                  }]
                })(
                  <TextArea rows={6} placeholder="请填写巡检任务补充描述（自定义内容）"/>
                )}  
              </Form.Item>
              {/* <Form.Item
                {...createFormItemLayout}
                label="是否立即执行"
              >
                {getFieldDecorator('isNow',{
                  initialValue: id && inspectionDetail.isNow || 0,
                  rules:[{
                    required:true,
                    message:"请选择是否立即执行",
                  }]
                })(  
                  <Radio.Group>
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                  </Radio.Group>
                       
                )}  
              </Form.Item> */}
              <section className="operator-container">
                <div style={{textAlign:"center"}}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="default"
                  >{id ? '编辑' : '启动'}
                  </Button>
                  <Button
                    style={{marginLeft:"28px"}}
                    size="default"
                    onClick={() => {
                      this.props.backToInspectionTable(projectDetail.id);
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