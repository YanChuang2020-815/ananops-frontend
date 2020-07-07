import React,{Component} from 'react'
import {Form,Input,Radio,Space,Select,Button} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'
import axios from 'axios';
import './index.styl'
const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
class AddUpdateForm extends Component{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    device:PropTypes.object,
  }

  constructor(props){
    super(props)
    this.state={
      twins: props.device.status != null ? (props.device.status.twins || []) : [],
      isChangeable: props.mode != 'check' ? 'block' : 'none',
      token:window.localStorage.getItem('token'),
      twinChoose: [],
      deviceModel: null,
      deviceModelList: [],
      selectedProperties: [],
    }

}

  
  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  componentDidMount() {
    this.getDeviceModels(this.props.device)
    this.getDeviceModel(this.props.device)
  }

  getDeviceModels = (device) => {
    if (device.spec != null) return;
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

  handleSelectOption = (value) =>{
    const deviceModel = JSON.parse(value)
    console.log(deviceModel)
    this.setState({
      deviceModel: deviceModel
    })
    let twinChoose = deviceModel.spec.properties.map((item, index) => {
      let twin = {
        propertyName: item.name,
        desired: {
          value:item["type"][Object.keys(item.type)]["defaultValue"],
          metadata: {
            type: Object.keys(item.type)
          }
        }
      }
      return twin
    })
    console.log(twinChoose)
    this.setState({
      twinChoose: twinChoose
    })

    this.props.form.setFieldsValue({"deviceModenlName":deviceModel.spec.name})
    return;
  }

  handlePropertySelect = (value) => {
    let selectedProperty = JSON.parse(value)
    console.log(selectedProperty)
    let selectedProperties = this.state.selectedProperties;
    selectedProperties.push(selectedProperty)
    this.setState({
      selectedProperties: selectedProperties
    })
  }

  getDeviceModel = (device) =>{
    if (device.spec == null) return;
    let deviceModelName = device.spec.deviceModelRef.name
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
        for (let i=0;i<res.data.result.length;i++) {
          if (res.data.result[i].metadata.name==deviceModelName) {
            let deviceModel = res.data.result[i];
            let deviceModels = [res.data.result[i]];
            this.setState({
              deviceModel: deviceModel,
              deviceModelList: deviceModels
            })
            let twinChoose = res.data.result[i].spec.properties.map((item, index) => {
              let twin = {
                propertyName: item.name,
                desired: {
                  value:item["type"][Object.keys(item.type)]["defaultValue"],
                  metadata: {
                    type: Object.keys(item.type)
                  }
                }
              }
              return twin
            })
            console.log(twinChoose)
            this.setState({
              twinChoose: twinChoose
            })
            return;
          }
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  render(){
    const device = this.props.device
    const {deviceModel, twinChoose} = this.state

    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator, form} = this.props.form

    // 添加
    const add = () => {
        const twins = this.state.twins;
        const nextTwins = twins.concat({});
        this.setState({
            twins:nextTwins
        })
    }

    // 删除
    const deleteRow = (index) => {
        let twins = this.state.twins;
        if (twins.length === 0) {
        return;
        }
        twins = twins.filter((item, key) => key !== index);
        this.setState({
            twins:twins
        })
    }

    const modelOptions = this.state.deviceModelList.map((item, index) => {
      return (
      <Option key={index} value={JSON.stringify(item)} >{item.metadata.name}</Option>
      )
    })

    const twinOptions = twinChoose.map((item, index) => {
      return (
        <Option key={index} value={JSON.stringify(item)}>{item.propertyName}</Option>
      )
    })

    const listContent = this.props.mode == 'add' ?
    this.state.twins.map((item, index) => {
        return (
            <div key={index}>
                <Form.Item
                    label="属性名"
                >
                {
                    getFieldDecorator(`twins[${index}].propertyName`,{
                    initialValue:(this.state.selectedProperties!=null && this.state.selectedProperties.length>index) ? (this.state.selectedProperties[index].propertyName || '') : '',
                    rules:[{
                        required:true,
                        message:'设备属性必须输入'
                    }
                    ]
                    })(
                    <Select
                    onChange={this.handlePropertySelect}
                    >
                      {twinOptions}
                    </Select>
                    )
                }
                </Form.Item>

                <Form.Item
                    label="属性类型"
                >
                {
                    getFieldDecorator(`twins[${index}].desired.metadata.type`,{
                    initialValue:(this.state.selectedProperties!=null && this.state.selectedProperties.length>index) ? (this.state.selectedProperties[index].desired.metadata.type[0] || '') : '',
                    rules:[{
                        required:false,
                        message:'设备属性类型必须输入'
                    }
                    ]
                    })(
                    <Input placeholder="请输入属性类型"></Input>
                    )
                }
                </Form.Item>

                <Form.Item
                    label="属性当前值"
                >
                {
                    getFieldDecorator(`twins[${index}].desired.value`,{
                    initialValue:(this.state.selectedProperties!=null && this.state.selectedProperties.length>index) ? (this.state.selectedProperties[index].desired.value || '') : '',
                    rules:[{
                        required:false,
                    }
                    ]
                    })(
                    <Input placeholder="请输入属性当前值"></Input>
                    )
                }
                </Form.Item>
                {index >= 0 ? (
                    <Button style={{display: this.state.isChangeable}} type="primary" onClick={deleteRow.bind(this, index)}>删除</Button>
                ) : null}
            </div>
        );
    }) :
    this.state.twins.map((item, index) => {
        return (
            <div key={index}>
                <Form.Item
                    label="属性名"
                >
                {
                    getFieldDecorator(`propertyName`,{
                    initialValue:item.propertyName || '',
                    rules:[{
                        required:true,
                        message:'设备属性必须输入'
                    }
                    ]
                    })(
                    <Select
                    onChange={this.handlePropertySelect}
                    >
                      {twinOptions}
                    </Select>
                    )
                }
                </Form.Item>

                <Form.Item
                    label="属性类型"
                >
                {
                    getFieldDecorator(`propertyType`,{
                    initialValue:item.desired!=null ? (item.desired.metadata.type || '') : '',
                    rules:[{
                        required:false,
                        message:'设备属性类型必须输入'
                    }
                    ]
                    })(
                    <Input placeholder="请输入属性类型"></Input>
                    )
                }
                </Form.Item>

                <Form.Item
                    label="属性当前值"
                >
                {
                    getFieldDecorator(`value`,{
                    initialValue:item.desired != null ? (item.desired.value || '') : '',
                    rules:[{
                        required:false,
                    }
                    ]
                    })(
                    <Input placeholder="请输入属性当前值"></Input>
                    )
                }
                </Form.Item>
                {index >= 0 ? (
                    <Button style={{display: this.state.isChangeable}} type="primary" onClick={deleteRow.bind(this, index)}>删除</Button>
                ) : null}
            </div>
        );
    });

    return (
      <Form {...formItemLayout}>

        <Item label="名称">
          {
            getFieldDecorator('name',{
              initialValue:device.metadata != null ? (device.metadata.name || '') : '',
              rules:[{
                required:true,
                message:'设备名必须输入'
              }
            ]
            })(
              <Input placeholder="请输入设备名"></Input>
            )
          }
        </Item>
        
        <Item label="设备模型">
          {
            getFieldDecorator('deviceModel',{
              initialValue:device.spec != null ? (device.spec.deviceModelRef.name || '') : '',
              rules:[{
                required:true,
                message:'设备模型必须输入'
              }
            ]
            })(
              <Select
                onChange={this.handleSelectOption}
              >
                {modelOptions}
              </Select>
            )
          }
        </Item>

        <Item label="API版本">
          {
            getFieldDecorator('apiVersion',{
              initialValue:device.apiVersion || 'devices.kubeedge.io/v1alpha1',
              rules:[{
                required:true,
                message:'API版本必须输入'
              }
            ]
            })(
              <Input placeholder="请输入API版本"></Input>
            )
          }
        </Item>

        <Item label="资源类型">
          {
            getFieldDecorator('kind',{
              initialValue:device.kind || 'Device',
              rules:[{
                required:true,
                message:'资源类型必须输入'
              }
            ]
            })(
              <Input placeholder="请输入资源类型"></Input>
            )
          }
        </Item>

        <Item label="所在节点">
          {
            getFieldDecorator('node',{
              initialValue:device.spec != null ? (device.spec.nodeSelector.nodeSelectorTerms[0].matchExpressions[0].values || 'master') : 'master',
              rules:[{
                required:true,
                message:'所在节点必须输入'
              }
            ]
            })(
              <Input placeholder="请输入所在节点"></Input>
            )
          }
        </Item>
        
        {listContent}
        <Item style={{display: this.state.isChangeable}}>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={add}>增加</Button>
        </Item>

      </Form>
    )
  }
}
export default Form.create()(AddUpdateForm)