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
    
  }

  
  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width: 50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },
      {
        title:'名称',
        dataIndex:'name',
        width:70
      },
      {
        title:'命名空间',
        dataIndex:'namespace',
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
  

  render(){
    const {deviceModel, showDeviceModelDetail, editDeviceModel} = this.state
    const extra = (
      <span>
        <Button type="primary" style={{marginRight:'15px'}} onClick={() => alert("添加设备类型")}><Icon type="plus"/>添加设备类型</Button>
      </span>

    )
    const mockData = [
      {
        apiVersion: 'devices.kubeedge.io/v1alpha1',
        kind: 'deviceModel',
        name: 'led-light',
        namespace: 'default',
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
    ]
      
    return (
      <Card extra={extra}>
        <Table
          bordered
          //loading={loading}
          rowKey="id"
          size='small'
          dataSource={mockData}
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
          onOk={this.onCancel}
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