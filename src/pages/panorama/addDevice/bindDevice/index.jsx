import React, { Component, } from 'react';
import { Form,Input,Select,Button,message,DatePicker,Tooltip,Icon,Upload,List,Skeleton, Modal } from 'antd';
import axios from 'axios'
import PropTypes from 'prop-types'
import 'moment/locale/zh-cn';
import  './index.styl'
class BindedDevice extends Component{
    //接收父组件参数
    static propTypes = {
      setAssign:PropTypes.func.isRequired,
      curSelectedDevice:PropTypes.object
    }
    constructor(props){
        super(props)
        this.state={
            token:window.localStorage.getItem('token'),
            fileType:'',
        }
    }
    componentWillMount() {
      this.props.setAssign(this.props.form);
    }

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

    fileUpload(addScene) {

      return {
        fileType: addScene.state.fileType,
        bucketName: 'ananops',
        filePath: 'rdcScene'
      };
    };



    render(){

      const createFormItemLayout = {
        labelCol: {span:8},
        wrapperCol : {span:8},
      }
      const { 
        form: { getFieldDecorator }, 
      } = this.props
      var deviceId=new Date().getTime()
      const uploadProps = {
        name: 'file',
        action: '/rdc/rdcFile/uploadRdcPic',
        headers: {
          authorization: 'Bearer ' + this.state.token,
          'deviceId': deviceId,
        },
        beforeUpload: this.beforeUpload,
        data: this.fileUpload(this),
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
      const curSelectedDevice = this.props.curSelectedDevice;
      return(
          <Form
          >
            <Form.Item
              {...createFormItemLayout}
              label="设备名称"
            >
              {getFieldDecorator('name',{
                initialValue: curSelectedDevice.name,
                rules:[{
                  required:true,
                  message:"请输入设备名称",
                }]
              })(
                <Input placeholder="请输入设备名称" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="设备ID"
            >
              {getFieldDecorator('deviceId',{
                initialValue: curSelectedDevice.id,
                rules:[{
                  required:true,
                  message:"请输入设备Id",
                }]
              })(
                <Input placeholder="请输入设备Id" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="设备生产商"
            >
              {getFieldDecorator('manufacture',{
                initialValue: curSelectedDevice.manufacture,
                rules:[{
                  required:true,
                  message:"请输入设备生产商",
                }]
              })(
                <Input placeholder="请输入设备生产商" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="设备型号"
            >
              {getFieldDecorator('model',{
                initialValue: curSelectedDevice.model,
                rules:[{
                  required:true,
                  message:"请输入设备型号",
                }]
              })(
                <Input placeholder="请输入设备型号" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="设备类型"
            >
              {getFieldDecorator('type',{
                initialValue: curSelectedDevice.deviceType,
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
              label="场景图片"
            >
              {getFieldDecorator('attachmentIds')(
                <Upload  {...uploadProps}>
                  <Tooltip placement="right" title={'支持图片上传'}>
                    <Button><Icon type="upload" />上传图片</Button>
                  </Tooltip>
                </Upload>
              )}
            </Form.Item>
          </Form>
      )
    }
}
export default Form.create()(BindedDevice)