import React,{Component} from 'react';
import {Table, Button, Card, Select, Input, Icon, Modal, message, Alert, Tag,Space} from 'antd';
import LinkButton from '../../../components/link-button'
import {formatDate} from '../../../utils/dateUtils'
import axios from 'axios';
import AddUpdateForm from './detail'

export default class DeviceModel extends Component{
  constructor(props){
      super(props)
      this.state={
        token:window.localStorage.getItem('token'),
        deviceModelList:[

        ],
        showDeviceModelDetail: false,
        deviceModel: null,
        editDeviceModel: false
      }

  }
  componentDidMount(){
    this.getDeviceModels()
  }

  getDeviceModels = () => {
    axios({
      method: 'GET',
      url: '/rdc/edgeDevice/getAllEdgeDeviceModel',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      }
    })
    .then((res) => {
      if(res && res.status === 200){
        console.log(res.data.result)
        this.setState({
          deviceModelList: res.data.result
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  
  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width: 50,
        fixed:'left',
        dataIndex: 'id',
        render:(text,record,index)=> `${index+1}`,
      },
      {
        title:'名称',
        dataIndex:'metadata.name',
        width:70
      },
      {
        title:'命名空间',
        dataIndex:'metadata.namespace',
        width:70,
      },
      {
        title:'API版本',
        dataIndex:'apiVersion',
        width:150,
      },
      {
        title:'资源类型',
        dataIndex:'kind',
        width:70,
      },
      {
        title:'操作',
        width:280,
        fixed:'right',
        render: (deviceModel) => { 
            return (
                <span>
                  <LinkButton onClick={() => this.showEditDeviceModel(deviceModel)}>修改</LinkButton>|
                  <LinkButton onClick={() => this.showDeviceModel(deviceModel)}>详情</LinkButton>|
                  <LinkButton onClick={() => alert("删除")}>删除</LinkButton>
                </span>
            )
          }
      }
    ]
  }

  componentWillMount() {
    this.initColumns()
  }

  showDeviceModel = (deviceModel) =>{
    this.setState({
      showDeviceModelDetail: true,
      deviceModel: deviceModel
    })
  }

  onCancel = () =>{
    this.setState({
      showDeviceModelDetail: false,
      editDeviceModel: false
    })
  }

  showEditDeviceModel = (deviceModel) => {
    this.setState({
      editDeviceModel: true,
      deviceModel: deviceModel
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { getFieldValue } = this.form;
    let deviceModel =  this.form.getFieldsValue()
    if(!getFieldValue('name')){
      message.error('请输入设备类型名')
      return;
    }
    if(!getFieldValue('namespace')){
      message.error('请输入设备命名空间')
      return;
    }
    if(!getFieldValue('apiVersion')){
      message.error('请输入API版本')
      return;
    }
    if(!getFieldValue('kind')){
      message.error('请输入资源类型')
      return;
    }
    if(!getFieldValue('properties') || getFieldValue('properties').length<=0 || !getFieldValue('properties')){
      message.error('请添加设备类型属性')
      return;
    }
    this.form.resetFields()
    let data = {
      apiVersion: deviceModel.apiVersion,
      kind: deviceModel.kind,
      metadata: {
        name: deviceModel.name,
        namespace: deviceModel.namespace
      },
      spec: {
        properties: deviceModel.properties.map((item, index) => {
          let type = item.type[""]
          item.type[type] = {
            accessMode: item.type.accessMode,
            defaultValue: item.type.defaultValue
          }
          delete item.type[""];
          delete item.type.accessMode;
          delete item.type.defaultValue
          return item
        })
      }
    }
    console.log(data)
    axios({
      method: 'POST',
      url: '/rdc/edgeDevice/createEdgeDeviceModel',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
    .then((res) => {
      if(res && res.status === 200){
        alert("设备类型创建成功！")
        this.setState({
          editDeviceModel: false
        })
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("设备类型创建失败")
        this.setState({
          editDeviceModel: false
        })
    });
    
  }
  

  render(){
    const {deviceModel, showDeviceModelDetail, editDeviceModel, deviceModelList} = this.state
    const extra = (
      <span>
        <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.showEditDeviceModel({})}><Icon type="plus"/>添加设备类型</Button>
      </span>

    )
    const mockData = [
      {
        apiVersion: 'devices.kubeedge.io/v1alpha1',
        kind: 'deviceModel',
        metadata: {
          name: 'led-light',
          namespace: 'default',
        },
        spec: {
          properties: [
            {
              name: 'power-status',
              description: 'Indicates whether the led light is ON/OFF',
              type: {
                string: {
                  accessMode: 'ReadWrite',
                  defaultValue: 'ON'
                }
              }
            },
            {
              name: 'gpio-pin-number',
              description: 'Indicates whether the GPIO pin to which LED is connected',
              type: {
                int: {
                  accessMode: 'ReadWrite',
                  defaultValue: 18
                }
              }
            }
          ]
        } 
      }
    ]
      
    return (
      <Card extra={extra}>
        <Table
          bordered
          //loading={loading}
          rowKey="id"
          size='small'
          dataSource={deviceModelList}
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            defaultPageSize:10,
            showQuickJumper:true,
            total:0,
          }}
        />
        <Modal
          title="设备类型"
          visible={showDeviceModelDetail}
          onOk={this.onCancel}
          onCancel={this.onCancel}
        >
          <AddUpdateForm
            setForm={(form)=>{this.form = form}}
            deviceModel={deviceModel}
            mode="check"
          />
        </Modal>
        <Modal
          title="设备类型"
          visible={editDeviceModel}
          onOk={this.onSubmit}
          onCancel={this.onCancel}
        >
          <AddUpdateForm
            setForm={(form)=>{this.form = form}}
            deviceModel={deviceModel}
            mode="edit"
          />
        </Modal>
      </Card>
    )
  }
}