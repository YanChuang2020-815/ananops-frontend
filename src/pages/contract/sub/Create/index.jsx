import React,{Component,} from 'react'
import { Form,Input,Select,Button,message,DatePicker,Upload,Tooltip,Icon } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
const { Option } = Select;
class SubNew extends Component{
  constructor(props){
    super(props)
    this.state={
      inspectionDetail:{},
      token:window.localStorage.getItem('token'),
      imcTaskDetail:{}
    }
  }
  componentDidMount(){
    const {match : { params : { subId,imcTaskId } }} = this.props   
    if(subId){
      axios({
        method: 'POST',
        url: '/pmc/inspectDetail/getInspectDetailById/'+subId,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
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
    }else if(imcTaskId){
      //如果是新建一条巡检任务子项
      console.log(imcTaskId)
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/getTaskById/'+imcTaskId,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          console.log(res)
          if(res && res.status === 200){     
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
  fileUpload() {
    return {
      fileType: 'png',
      bucketName: 'ananops',
      filePath: 'inspectionPic'
    };
  };

  //获取文件
  getAttachments(fileList) {
    console.log(fileList)
    var res = [];
    var size = fileList.length;
    for (var i=0; i<size; i++) {
      var attachmentId = fileList[i].response[0].attachmentId;
      res.push(attachmentId);
    }
    return res;
  }

    handleSubmit = (e) => {
      e.preventDefault()
      const {
        form,
        history,
        match : { params : {projectId,imcTaskId,subId } },
      } = this.props
      console.log("提交后的任务id为：" + imcTaskId)
      const { getFieldValue } = form;
      const values = form.getFieldsValue()
      if (values.attachmentIds != undefined) {
        var fileList = values.attachmentIds.fileList;
        console.log(fileList)
        values.attachmentIds = this.getAttachments(fileList);
      }
      if(!getFieldValue('name')){
        message.error('请填写名称')
      }
      if(!getFieldValue('inspectionTaskId')){
        message.error('请输入巡检任务ID')
      }
      if(!getFieldValue('inspectionTaskName')){
        message.error('请输入巡检任务名')
      }
      if(subId){
        values.id=subId
      }
      console.log(values)
      axios({
        method: 'POST',
        url: '/pmc/inspectDetail/save',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(values)
      })
        .then((res) => {
          if(res && res.status === 200){     
          // this.setState({
          //    projectDetail:res.data.result
          // });
            history.push('/cbd/pro/sub/'+projectId+'/'+imcTaskId)
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
        match : { params : { imcTaskId,projectId,subId} }
      } = this.props
      const { inspectionDetail,imcTaskDetail } = this.state
      console.log(imcTaskId)
      var deviceId=new Date().getTime()
      const uploadProps = {
        name: 'file',
        action: '/imc/inspectionItem/uploadImcItemPicture',
        headers: {
          authorization: 'Bearer ' + this.state.token,
          'deviceId': deviceId,
        },
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
        <div>
          <div className="inpection-plan-create-page">
                
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                {...createFormItemLayout}
                label="巡检子项名称"
              >
                {getFieldDecorator('name',{
                  initialValue: subId && inspectionDetail.name,
                  rules:[{
                    required:true,
                    message:"请填写巡检子项名称",
                  }]
                })(
                  <Input placeholder="请填写巡检子项名称" />
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="巡检方案ID"
              >
                {getFieldDecorator('inspectionTaskId',{
                  initialValue: subId && inspectionDetail.inspectionTaskId || imcTaskDetail.id,
                  rules:[{
                    required:true,
                    message:"请输入巡检方案ID",
                  }]
                })(
                  <Input placeholder="请输入巡检方案ID" />
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="巡检方案名称"
              >
                {getFieldDecorator('inspectionTaskName',{
                  initialValue: subId && inspectionDetail.inspectionTaskName || imcTaskDetail.taskName,
                  rules:[{
                    required:true,
                    message:"请输入巡检方案名称",
                  }]
                })(
                  <Input placeholder="请输入巡检方案名称" />
                )}  
              </Form.Item>
                  
                   
              <Form.Item
                {...createFormItemLayout}
                label="巡检网点"
              >
                {getFieldDecorator('itemName',{
                  initialValue: subId && inspectionDetail.itemName,
                  rules:[{
                    required:false,
                    message:"请输入巡检网点",
                  }]
                })(
                  <Input placeholder="请输入巡检网点" />
                )}  
              </Form.Item>
              {/* <Form.Item
                {...createFormItemLayout}
                label="维修人员姓名"
              >
                {getFieldDecorator('maintainerName',{
                  initialValue: subId && inspectionDetail.maintainerName,
                  rules:[{
                    required:false,
                    message:"请输入维修人员姓名",
                  }]
                })(
                  <Input placeholder="请输入维修人员姓名" />
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="维修人员ID"
              >
                {getFieldDecorator('maintainerId',{
                  initialValue: subId && inspectionDetail.maintainerId,
                  rules:[{
                    required:false,
                    message:"请输入维修人员ID",
                  }]
                })(
                  <Input placeholder="请输入维修人员ID" />
                )}  
              </Form.Item> */}
              <Form.Item
                {...createFormItemLayout}
                label="备注"
              >
                {getFieldDecorator('remark',{
                  initialValue: subId && inspectionDetail.remark,
                  rules:[{
                    required:false,
                    message:"请输入备注",
                  }]
                })(
                  <Input.TextArea autoSize={{minRows: 2, maxRows: 6 }} placeholder="请输入备注" />
                )}  
              </Form.Item>
              {/* <Form.Item
                {...createFormItemLayout}
                label="巡检结果"
              >
                {getFieldDecorator('result',{
                  initialValue: subId && inspectionDetail.result,
                  rules:[{
                    required:false,
                    message:"请输入巡检结果",
                  }]
                })(
                  <Input.TextArea autoSize={{minRows: 2, maxRows: 6 }} placeholder="请输入巡检结果" />
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="巡检状态"
              >
                {getFieldDecorator('status',{
                  initialValue: subId && inspectionDetail.status,
                  rules:[{
                    required:false,
                    message:"请输入巡检状态",
                  }]
                })(
                  // <Input placeholder="请输入巡检状态" />
                  <Select>
                    <Option value={-1}>不存在该状态</Option>
                    <Option value={1}>待服务商接单</Option>
                    <Option value={2}>巡检任务执行中</Option>
                    <Option value={3}>巡检结果待确认</Option>
                    <Option value={4}>巡检待付款</Option>
                    <Option value={5}>巡检已付款，等待用户方评价</Option>
                    <Option value={6}>已完成评价，巡检结束</Option>
                  </Select>
                )}  
              </Form.Item> */}
              <Form.Item
                {...createFormItemLayout}
                label="巡检内容"
              >
                {getFieldDecorator('description',{
                  initialValue: subId && inspectionDetail.description || imcTaskDetail.inspectionContent,
                  rules:[{
                    required:false,
                    message:"请输入巡检内容",
                  }]
                })(
                  <Input.TextArea autoSize={{minRows: 4, maxRows: 6 }} placeholder="请输入巡检内容" />
                )}  
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
              <section className="operator-container">
                <div style={{textAlign:"center"}}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="default"
                  >{subId ? '编辑' : '新建'}
                  </Button>
                  <Button
                    style={{marginLeft:"28px"}}
                    size="default"
                    onClick={()=> {
                      const {
                        history,
                      } = this.props
                      history.push('/cbd/pro/sub/'+projectId + '/' + imcTaskId)
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
export default Form.create()(SubNew)