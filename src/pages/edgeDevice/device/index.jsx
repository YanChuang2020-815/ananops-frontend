import React,{Component} from 'react';
import {Table, Button, Card, Select, Input, Icon, Modal, message, Alert, Tag,Space} from 'antd';
import LinkButton from '../../../components/link-button'
import axios from 'axios';

export default class Device extends Component{
  constructor(props){
      super(props)
      this.state={
        token:window.localStorage.getItem('token'),
        deviceList:[

        ],
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
        dataIndex:'metadata.labels.model',
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
        render: (device) => { 
            return (
                <span>
                  <LinkButton onClick={() => alert("修改")}>修改</LinkButton>|
                  <LinkButton onClick={() => alert("详情")}>详情</LinkButton>|
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
        <Button type="primary" style={{marginRight:'15px'}} onClick={() => alert("添加设备")}><Icon type="plus"/>添加设备</Button>
      </span>

    )
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
      </Card>
    )
  }
}