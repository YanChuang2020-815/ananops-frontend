import React, { Component, } from 'react';
import { Form,Input,Select,Button,message,DatePicker,Tooltip,Icon,Upload,List,Skeleton, Modal } from 'antd';
import axios from 'axios'
import 'moment/locale/zh-cn';
import  './index.styl'
import BindedDevice from './bindDevice/index'
const count=3;
class DeviceNew extends Component{
    constructor(props){
        super(props)
        this.state={
            token:window.localStorage.getItem('token'),
            fileType:'',
            initLoading:true,
            loading:false,
            data:[],
            list:[],
            visible:false,
            curSelectedDevice:null,
        }
    }
    componentDidMount(){
      axios({
        method: 'GET',
        url: '/deviceaccess/parentdevices/094f9ec1-05d4-11ea-8ed8-9b8a84d51816?limit=1000',
      })
      .then((res) => {
        console.log(res)
        if(res && res.status === 200){
          let list = []
          list.push({
            createdTime: new Date(),
            customerId: 1,
            deviceType: 'camera',
            id: '815815815',
            manufacture: '815',
            model: 'default',
            name: 'camera'
          })
          //list.push(res.data)
          this.setState({
            initLoading:false,
            data:list,
            list:list
          });
          console.log(res.data)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    onLoadMore=()=>{
      this.setState({
        loading:true,
        list:this.state.data.concat([...new Array(count)].map(()=>({
          loading:true,
          name:{}
        }))),
      });
      axios({
        method: 'GET',
        url: '/deviceaccess/parentdevices/094f9ec1-05d4-11ea-8ed8-9b8a84d51816?limit=1000',
      })
      .then((res) => {
        console.log(res)
        if(res && res.status === 200){
          const data = this.state.data.concat(res.data);
          this.setState({
            data,
            list:data,
            loading:false,
          });
          console.log(res.data);
          window.dispatchEvent(new Event('resize'));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    onLoadMoreEdgeDevice=()=>{
      this.setState({
        loading:true,
        list:this.state.data.concat([...new Array(count)].map(()=>({
          loading:true,
          name:{}
        }))),
      });
      axios({
        method: 'GET',
        url: '/rdc/edgeDevice/getAllEdgeDevice',
        headers: {
            'Content-Type': 'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
        },
      })
      .then((res) => {
        console.log(res)
        if(res && res.status === 200){
          res.data.result.forEach(element => {
            element.name = element.metadata.name
            element.deviceType = element.spec.deviceModelRef.name
            element.manufacture = "gantch"
            element.model = "edge"
          });
          //console.log(res.data.result)
          const data = this.state.data.concat(res.data.result);
          this.setState({
            data,
            list:data,
            loading:false,
          });
          console.log(res.data);
          window.dispatchEvent(new Event('resize'));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    //处理模态框的取消
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleDeviceSelect=(device)=>{
      console.log(device)
      this.setState({
        curSelectedDevice:device,
        visible:true,
      })
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

    handleSubmit = () => {
      const values = this.form.getFieldsValue();
      if (values.attachmentIds != undefined) {
          var fileList = values.attachmentIds.fileList;
          console.log(fileList)
          values.attachmentIds = this.getAttachments(fileList);
      }
      if(values.name == undefined){
          message.error('请输入设备名称')
          return;
      }
      if(values.deviceId == undefined){
          message.error('请输入设备ID')
          return;
      }
      if(values.manufacture== undefined){
          message.error('请输入设备生产商')
          return;
      }
      if(values.model== undefined){
          message.error('请输入设备型号')
          return;
      }
      if(values.type== undefined){
          message.error('请输入设备类型')
          return;
      }
      if(values.attachmentIds== undefined){
          message.error('请上传场景图片')
          return;
      }
      values.uid = values.deviceId;
      console.log("参数：")
      console.log(values)
      axios({
          method: 'POST',
          url: '/rdc/rdcDevice/saveEdgeDevice',
          headers: {
              'Content-Type': 'application/json',
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify(values)
          })
      .then((res) => {
        if(res && res.status === 200){  
          console.log(res)
          this.setState({
            visible:false,
          })
          if(res.data.code==500){
            alert("设备已经添加过了")
          }
          else{
            alert("设备添加成功")
          }
          
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
        match : { params : { id } }
      } = this.props
      const { initLoading, loading, list ,curSelectedDevice} = this.state;
      const loadMore =
        !initLoading && !loading ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
            }}
          >
            <Button onClick={this.onLoadMoreEdgeDevice}>loading more</Button>
          </div>
        ) : null;
      return(
        <div className="inpection-plan-create-page">
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item
            >
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={"设备名称：" + item.name}
                  description={"设别类型：" + item.deviceType + "，设备厂商：" + item.manufacture + "，设备型号：" + item.model}
                />
                <Button onClick={()=>{this.handleDeviceSelect(item)}}>添加</Button>
              </Skeleton>
            </List.Item>
          )}
        />
        <Modal
          title="设备选择"
          visible={this.state.visible}
          onOk={()=>{this.handleSubmit()}}
          onCancel={this.handleCancel}
        >
          <BindedDevice setAssign={(form)=>{this.form = form}} curSelectedDevice={curSelectedDevice}/>
        </Modal>
      </div>   
      )
    }
}
export default Form.create()(DeviceNew)