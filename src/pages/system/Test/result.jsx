import React,{Component} from 'react'
import {Form,Input,DatePicker,Upload,Tooltip,Button,Icon,message} from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const Item = Form.Item;
var fileType = '';

class Result extends Component{

  //接收父组件参数
  static propTypes = {
    setSubmit:PropTypes.func.isRequired,
    result:PropTypes.object
  }

  componentWillMount() {
    this.props.setSubmit(this.props.form)
  }

  fileUpload() {
    return {
        fileType: fileType,
        bucketName: 'ananops',
        filePath: 'maintainOrder'
    };
  }; 

  beforeUpload = (file) => {
    var fileName = file.name;
    var type = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length);
    if (type != null) {
      fileType = type;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('图片大于5MB!');
    }
    return isLt5M;
  }

  render(){

    const result= this.props.result
  
    const formItemLayout = {
      labelCol:{span:6},
      wrapperCol:{span:14}
    }

    const {getFieldDecorator} = this.props.form

    var deviceId=new Date().getTime()
    var token = window.localStorage.getItem('token');
    const uploadProps = {
      name: 'file',
      action: '/mdmc/mdmcTask/uploadTaskPicture',
      headers: {
        authorization: 'Bearer ' + token,
        'deviceId': deviceId,
      },
      beforeUpload: this.beforeUpload,
      data: this.fileUpload,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.info(`${info.file.name} 上传成功！`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
        }
        console.log(info)
      },  
    };
    return (
      <Form {...formItemLayout}>

        <Item label="工单唯一编号">
          {
            getFieldDecorator('id',{
              initialValue:result.id,
              rules:[{
                required:true,
                message:'请输入工单编号',
              }]
            })(
              <Input placeholder="请输入工单编号"  disabled='true'></Input>
            )
          }
         
        </Item>
        
        <Item label="故障产生原因">
          {
            getFieldDecorator('troubleReason',{
              initialValue:result.troubleReason,
              rules:[{
                required:true,
                message:'请输入故障原因'
              }]
            })(
              <Input.TextArea  placeholder="请输入故障原因" rows={3} allowClear></Input.TextArea>
            )
          }
         
        </Item>
            
        <Item label="故障维修结果">
          {
            getFieldDecorator('result',{
              initialValue:result.result,
              rules:[{
                required:true,
                message:'请输入维修结果'
              }]
            })(
              <Input.TextArea  placeholder="请输入维修结果" rows={4} allowClear></Input.TextArea>
            )
          }
        </Item>
        <Item
              label="维修现场图片"
            >
              {getFieldDecorator('attachmentIdList')(
                // <div className="inspection-log-upload">
                <Upload  {...uploadProps}>
                  <Tooltip placement="right" title={'支持图片上传'}>
                    <Button><Icon type="upload" />上传图片</Button>
                  </Tooltip>
                </Upload>
                // </div>
              )}
            </Item>
        <Item label="故障维修建议">
          {
            getFieldDecorator('suggestion',{
              initialValue:result.suggestion,
              rules:[{
                required:true,
                message:'请输入维修建议'
              }]
            })(
              <Input.TextArea  placeholder="请输入维修建议" rows={3} allowClear></Input.TextArea>
            )
          }
        </Item>
        <Item label="作业超时原因">
          {
            getFieldDecorator('delayReason',{
              initialValue:result.delayReason,
              rules:[{
                required:false,
                message:'请输入未按时完成维修任务原因'
              }]
            })(
              <Input.TextArea  placeholder="请输入未按时完成维修任务原因" rows={3} allowClear></Input.TextArea>
            )
          }
        </Item>
        <Item
            label="实际开始时间"
          >
            {getFieldDecorator('actualStartTime',{
              initialValue: moment(),
              rules:[{
                required:true,
                message:"请选择实际开始时间",
              }]
            })(
              <DatePicker
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择实际开始时间"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
            )}  
          </Item>
          <Item
            label="实际结束时间"
          >
            {getFieldDecorator('actualFinishTime',{
              initialValue: moment(),
              rules:[{
                required:true,
                message:"请选择实际结束时间",
              }]
            })(
              <DatePicker
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择实际结束时间"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
            )}  
          </Item>
      </Form>
    )
  }
}
export default Form.create()(Result)