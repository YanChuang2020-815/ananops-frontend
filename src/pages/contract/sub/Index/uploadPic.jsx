import React,{Component} from 'react'
import {Form,Input,DatePicker,Tooltip,Upload,Button,Icon,message} from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios';
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
        token:window.localStorage.getItem('token')
      }
  }
  componentWillMount() {
    this.props.setUpload(this.props.form)
  }

  //文件上传
  fileUpload() {
    return {
      fileType: 'png',
      bucketName: 'ananops',
      filePath: 'inspectionPic'
    };
  };
  render(){

    const uploadDetail = this.props.uploadDetail
  
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }
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
    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Form.Item
              // {...createFormItemLayout}
              label="上传"
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
            </Form.Item>
      </Form>
    )
  }
}
export default Form.create()(UploadInfo)