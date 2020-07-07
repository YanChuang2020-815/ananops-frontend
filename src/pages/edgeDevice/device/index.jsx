import React,{Component} from 'react';
import {Table, Button, Card, Select, Input, Icon, Modal, message, Alert, Tag,Space} from 'antd';
import LinkButton from '../../../components/link-button'
import axios from 'axios';
import AddUpdateForm from './detail'

export default class Device extends Component{
  constructor(props){
      super(props)
      this.state={
        token:window.localStorage.getItem('token'),
        deviceList:[

        ],
        editDevice: false,
        checkDevice: false,
        addDevice: false,
        device: null
      }

  }
  componentDidMount(){
    this.getAllDevice()
  }

  getAllDevice = () => {
    axios({
      method: 'GET',
      url: '/rdc/edgeDevice/getAllEdgeDevice',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      }
    })
    .then((res) => {
      if(res && res.status === 200){
        console.log(res.data.result)
        this.setState({
          deviceList: res.data.result
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
        title:'设备模型',
        dataIndex:'spec.deviceModelRef.name',
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
        title:'所在节点',
        dataIndex:'spec.nodeSelector.nodeSelectorTerms[0].matchExpressions[0].values',
        width:70,
      },
      {
        title:'操作',
        width:280,
        fixed:'right',
        render: (device) => { 
            return (
                <span>
                  <LinkButton onClick={() => this.listenDevice(device)}>监听</LinkButton>|
                  <LinkButton onClick={() => this.checkDevice(device)}>详情</LinkButton>|
                  <LinkButton onClick={() => this.deleteDevice(device)}>删除</LinkButton>
                </span>
            )
          }
      }
    ]
  }

  componentWillMount() {
    this.initColumns()
  }

  checkDevice = (device) => {
    this.setState({
      device: device,
      checkDevice: true
    })
  }

  addDevice = (device) => {
    this.setState({
      device: device,
      addDevice: true
    })
  }

  editDevice = (device) => {
    this.setState({
      device: device,
      editDevice: true
    })
  }

  deleteDevice = (device) => {
    console.log(device)
    axios({
      method: 'POST',
      url: '/rdc/edgeDevice/deleteEdgeDevice',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:device
    })
    .then((res) => {
      if(res && res.status === 200){
        alert("删除成功")
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("删除失败")
    });
  }

  listenDevice = (device) => {
    console.log(device)
    axios({
      method: 'POST',
      url: '/rdc/edgeDevice/watchEdgeDevice',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:device
    })
    .then((res) => {
      if(res && res.status === 200){
        alert("正在监听")
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("监听失败")
    });
  }

  onCancel = () =>{
    this.setState({
      checkDevice: false,
      editDevice: false,
      addDevice: false
    })
    this.form.resetFields()
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { getFieldValue } = this.form;
    let device =  this.form.getFieldsValue()
    device.twins.map((item, index) => {
      item.propertyName = JSON.parse(item.propertyName).propertyName
    })
    device.deviceModel = JSON.parse(device.deviceModel).metadata.name
    if(!getFieldValue('name')){
      message.error('请输入设备名')
      return;
    }
    if(!getFieldValue('deviceModel')){
      message.error('请输入设备模型')
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
    if(!getFieldValue('node')){
      message.error('请输入所在节点')
      return;
    }
    if(!getFieldValue('twins') || getFieldValue('twins').length==0){
      message.error('请添加设备类型属性')
      return;
    }
    this.form.resetFields()
    console.log(device)
    let data = {
        apiVersion: device.apiVersion,
        kind: 'Device',
        metadata: {
          name: device.name,
          labels: {
            description: device.name,
            model: device.deviceModel
          },
          namespace:'default'
        },
        spec: {
          deviceModelRef: {
            name: device.deviceModel
          },
          nodeSelector: {
            nodeSelectorTerms: [
              {
                matchExpressions: [
                  {
                    key:'',
                    operator: 'In',
                    values: [
                      device.node
                    ]
                  }
                ]
              }
            ]
          }
        },
        status: {
          twins: device.twins
        }
    }
    console.log(data)
    axios({
      method: 'POST',
      url: '/rdc/edgeDevice/createEdgeDevice',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
    .then((res) => {
      if(res && res.status === 200){
        alert("设备创建成功！")
        this.setState({
          addDevice: false
        })
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("设备创建失败")
        this.setState({
          addDevice: false
        })
    });
  }

  render(){
    const mockData = [
      {
        apiVersion: 'devices.kubeedge.io/v1alpha1',
        kind: 'Device',
        metadata: {
          name: 'led-light-instance-01',
          labels: {
            description: 'LEDLight',
            model: 'led-light'
          }
        },
        spec: {
          deviceModelRef: {
            name: 'led-light'
          },
          nodeSelector: {
            nodeSelectorTerms: [
              {
                matchExpressions: [
                  {
                    key:'',
                    operator: 'In',
                    values: [
                      'edge-node1'
                    ]
                  }
                ]
              }
            ]
          }
        },
        status: {
          twins: [
            {
              propertyName: 'power-status',
              desired: {
                metadata: {
                  type: 'string'
                },
                value: 'OFF'
              }
            }
          ]
        }
      }
    ]

    const extra = (
      <span>
        <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.addDevice({})}><Icon type="plus"/>添加设备</Button>
      </span>
    )

    const {editDevice, addDevice, checkDevice, device, deviceList} = this.state
    return (
      <Card extra={extra}>
        <Table
          bordered
          //loading={loading}
          rowKey="id"
          size='small'
          dataSource={deviceList}
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            defaultPageSize:10,
            showQuickJumper:true,
            total:0,
          }}
        />
        <Modal
          title="设备详情"
          visible={checkDevice}
          onOk={this.onCancel}
          onCancel={this.onCancel}
        >
          <AddUpdateForm
            setForm={(form)=>{this.form = form}}
            device={device}
            mode="check"
          />
        </Modal>

        <Modal
          title="编辑设备"
          visible={editDevice}
          onOk={this.onCancel}
          onCancel={this.onCancel}
        >
          <AddUpdateForm
            setForm={(form)=>{this.form = form}}
            device={device}
            mode="edit"
          />
        </Modal>

        <Modal
          title="添加设备"
          visible={addDevice}
          onOk={this.onSubmit}
          onCancel={this.onCancel}
        >
          <AddUpdateForm
            setForm={(form)=>{this.form = form}}
            device={device}
            mode="add"
          />
        </Modal>
      </Card>
    )
  }
}