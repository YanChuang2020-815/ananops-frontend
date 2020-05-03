import React,{Component,} from 'react'
import { Form,Input,Select,Button,message,DatePicker,Upload,Tooltip,Icon,InputNumber } from 'antd';
import { Link } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
const { Option } = Select;
class SubNew extends Component{
  constructor(props){
    super(props)
    this.state={
      imcItemDetail:{},
      token:window.localStorage.getItem('token'),
      imcTaskDetail:{},
      fileType: '',
    }
  }
  componentWillMount(){
    this.props.setSubmit(this.props.form);
    const taskId = this.props.taskId;
    if(taskId){
      //如果是新建一条巡检任务子项
      axios({
        method: 'GET',
        url: '/imc/inspectionTask/getTaskByTaskId/'+taskId,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        }
      })
        .then((res) => {
          if(res && res.status === 200){    
            console.log("接口调用得到的巡检任务内容：")
            console.log(res.data) 
            this.setState({
              imcTaskDetail:res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
    
  //文件上传
  fileUpload = () => {
    return {
      fileType: this.state.fileType,
      bucketName: 'ananops',
      filePath: 'inspectionPic'
    };
  };

  beforeUpload = (file) => {
    var fileName = file.name;
    var type = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length);
    if (type != null) {
      this.setState({
        fileType: type,
      });
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('图片大于5MB!');
    }
    return isLt5M;
  }

    render(){
      const createFormItemLayout = {
        labelCol: {span:7},
        wrapperCol : {span:16},
      }
      const { 
        form: { getFieldDecorator }, 
      } = this.props
      const {imcTaskDetail,imcItemDetail} = this.state;
      var deviceId=new Date().getTime()
      const uploadProps = {
        name: 'file',
        action: '/imc/inspectionItem/uploadImcItemPicture',
        headers: {
          authorization: 'Bearer ' + this.state.token,
          'deviceId': deviceId,
        },
        beforeUpload: this.beforeUpload,
        data: this.fileUpload,
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            console.log(info.file)
            console.log(`${info.file.name} 上传成功！`)
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
          }
          console.log(info)
        },  
      };
      return(
          <Form
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              {...createFormItemLayout}
              label="巡检任务名称"
            >
              {getFieldDecorator('inspectionTaskName',{
                initialValue: imcTaskDetail.taskName,
                rules:[{
                  required:true,
                  message:"请输入巡检任务名称",
                }]
              })(
                <Input placeholder="请输入巡检任务名称" disabled={true}/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="巡检任务编号"
            >
              {getFieldDecorator('inspectionTaskId',{
                initialValue: imcTaskDetail.id,
                rules:[{
                  required:true,
                  message:"请输入巡检任务ID",
                }]
              })(
                <Input placeholder="请输入巡检任务ID" disabled={true}/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="预计开始时间"
              >
              {getFieldDecorator('scheduledStartTime',{
                  initialValue: moment(imcTaskDetail.scheduledStartTime),
                  rules:[{
                  required:true,
                  message:"请选择预计开始时间",
                  }]
              })(
                  <DatePicker
                  disabled={true}
                  locale={locale}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择预计开始时间"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />,
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="巡检周期天数"
              >
              {getFieldDecorator('frequency',{
                  initialValue: imcTaskDetail.frequency,
                  rules:[{
                    required:true,
                    message:"请输入巡检周期",
                  }]
              })(
                  <InputNumber placeholder="请输入巡检周期" disabled={true}/>
              )}（天）
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="计划完成天数"
              >
              {getFieldDecorator('days',{
                  initialValue: imcTaskDetail.days,
                  rules:[{
                    required:true,
                    message:"请输入计划完成天数",
                  }]
              })(
                  <InputNumber placeholder="请输入计划完成天数" disabled={true}/>
              )}（天）
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="子项任务名称"
            >
              {getFieldDecorator('itemName',{
                initialValue: '',
                rules:[{
                  required:true,
                  message:"请填写巡检子项名称",
                }]
              })(
                <Input placeholder="请填写巡检子项名称" />
              )}  
            </Form.Item>
            {/* <Form.Item
              {...createFormItemLayout}
              label="巡检持续时间（天）"
              >
              {getFieldDecorator('days',{
                  initialValue: imcTaskDetail.days,
                  rules:[{
                  required:true,
                  message:"请输入巡检的持续时间（天）",
                  }]
              })(
                  <Input placeholder="请输入巡检的持续时间（天）" />
            )}  
            </Form.Item> */}
            <Form.Item
              {...createFormItemLayout}
              label="任务内容描述"
            >
              {getFieldDecorator('description',{
                initialValue: imcItemDetail.description,
                rules:[{
                  required:true,
                  message:"请输入巡检子项描述",
                }]
              })(
                <Input.TextArea rows={4} placeholder="请输入巡检内容" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="巡检点位位置"
            >
              {getFieldDecorator('location',{
                initialValue: imcItemDetail.location,
                rules:[{
                  required:true,
                  message:"请输入巡检点位位置",
                }]
              })(
                <Input.TextArea rows={4} placeholder="请输入巡检点位位置" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="巡检点位数量"
            >
              {getFieldDecorator('count',{
                initialValue: 1,
                rules:[{
                  required:true,
                  message:"请输入巡检点位数量",
                }]
              })(
                <InputNumber placeholder="请输入巡检点位数量" min={1}/>
              )}（个）
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="上传"
            >
              {getFieldDecorator('attachmentIds')(
                <Upload  {...uploadProps}>
                  <Tooltip placement="right" title={'支持图片上传'}>
                    <Button><Icon type="upload" />上传图片</Button>
                  </Tooltip>
                </Upload>
              )}  
            </Form.Item>
            <Form.Item style={{display:'none'}}>
              {getFieldDecorator('userId',{
                initialValue: imcTaskDetail.principalId
              })}
            </Form.Item>
          </Form>
      )
    }
}
export default Form.create()(SubNew)