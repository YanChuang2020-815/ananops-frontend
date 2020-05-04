import React, { Component, } from 'react';
import { Form,Input,Select,Button,message,DatePicker,Tooltip,Icon,Upload } from 'antd';
import axios from 'axios'
import 'moment/locale/zh-cn';
import  './index.styl'
class DeviceNew extends Component{
    constructor(props){
        super(props)
        this.state={
            token:window.localStorage.getItem('token'),
            fileType:'',
        }
    }
    componentDidMount(){

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

    //提交
    handleSubmit = (e) => {
        e.preventDefault()
        const {
            form,
            history,
            match : { params : {id } },
        } = this.props
        const { getFieldValue } = form;
        const values = form.getFieldsValue()
        console.log(values)
        if (values.attachmentIds != undefined) {
            var fileList = values.attachmentIds.fileList;
            console.log(fileList)
            values.attachmentIds = this.getAttachments(fileList);
        }
        if(!getFieldValue('name')){
            message.error('请输入设备名称')
            return;
        }
        if(!getFieldValue('deviceId')){
            message.error('请输入设备ID')
            return;
        }
        if(!getFieldValue('manufacture')){
            message.error('请输入设备生产商')
            return;
        }
        if(!getFieldValue('model')){
            message.error('请输入设备型号')
            return;
        }
        if(!getFieldValue('type')){
            message.error('请输入设备类型')
            return;
        }
        if(!getFieldValue('attachmentIds')){
          message.error('请上传场景图片')
          return;
      }
      console.log("参数：")
      console.log(values)
      axios({
          method: 'POST',
          url: '/rdc/rdcDevice/save',
          headers: {
              'Content-Type': 'application/json',
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify(values)
          })
      .then((res) => {
        if(res && res.status === 200){  
          console.log(res.data.result)
          alert("场景创建成功")
          history.push('/cbd/panorama/device')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
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
        match : { params : { id } }
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
      return(
        <div className="inpection-plan-create-page">
          <Form
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              {...createFormItemLayout}
              label="设备名称"
            >
              {getFieldDecorator('name',{
                initialValue: id,
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
                initialValue: id,
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
                initialValue: id,
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
                initialValue: id,
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
                initialValue: id,
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
                // <div className="inspection-log-upload">
                <Upload  {...uploadProps}>
                  <Tooltip placement="right" title={'支持图片上传'}>
                    <Button><Icon type="upload" />上传图片</Button>
                  </Tooltip>
                </Upload>
                // </div>
              )}
            </Form.Item>
            <section className="operator-container">
              <div style={{textAlign:"center"}}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="default"
                >{id ? '编辑' : '新建'}
                </Button>
                <Button
                  style={{marginLeft:"28px"}}
                  size="default"
                  onClick={()=> {
                    const {
                      history,
                    } = this.props
                    history.push('/cbd/panorama/device')
                  }}
                >取消
                </Button>
              </div>
            </section>
          </Form>
        </div>
          
      )
    }
}
export default Form.create()(DeviceNew)