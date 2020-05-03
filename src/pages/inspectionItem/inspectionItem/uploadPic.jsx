import React,{Component} from 'react'
import {Form,Input,DatePicker,Tooltip,Upload,Button,Icon,message} from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const Item = Form.Item

class UploadInfo extends Component{
  //接收父组件参数
  static propTypes = {
    setUpload:PropTypes.func.isRequired,
    uploadDetail:PropTypes.object
  }
  constructor(props){
    super(props)
      this.state={
        token:window.localStorage.getItem('token'),
        fileType:''
      }
  }
  componentWillMount() {
    this.props.setUpload(this.props.form)
  }

  //文件上传
  fileUpload = () => {
    return {
      fileType: this.state.fileType,
      bucketName: 'ananops',
      filePath: 'inspectionPic'
    };
  };

  // 上传前获取格式后缀以及大小验证
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

    const uploadDetail = this.props.uploadDetail
  
    const formItemLayout = {
      labelCol:{span:8},
      wrapperCol:{span:10}
    }
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
            console.log(`${info.file.name} 上传成功！`)
            message.info(`${info.file.name} 上传成功！`)
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
          }
          console.log(info)
        },  
      };
    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>
          <Item
            label="实际开始时间"
          >
            {getFieldDecorator('actualStartTime',{
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
          <Item
              label="任务相关图片"
            >
              {getFieldDecorator('attachmentIds')(
                // <div className="inspection-log-upload">
                <Upload  {...uploadProps}>
                  <Tooltip placement="right" title={'支持图片上传'}>
                    <Button><Icon type="upload" />上传图片</Button>
                  </Tooltip>
                </Upload>
                // </div>
              )}
            </Item>
      </Form>
    )
  }
}
export default Form.create()(UploadInfo)