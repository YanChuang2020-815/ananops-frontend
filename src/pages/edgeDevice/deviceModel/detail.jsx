import React,{Component} from 'react'
import {Form,Input,Radio,Space,Select,Button} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'
import './index.styl'
const Item = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
class AddUpdateForm extends Component{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    deviceModel:PropTypes.object
  }

  constructor(props){
    super(props)
    this.state={
      properties: props.deviceModel.properties,
      isChangeable: props.mode != 'check' ? 'block' : 'none'
    }

}

  
  componentWillMount() {
    
    this.props.setForm(this.props.form)
  }


  render(){
    const deviceModel = this.props.deviceModel

    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator, form} = this.props.form

    // 添加
    const add = () => {
        const properties = this.state.properties;
        const nextProperties = properties.concat({});
        this.setState({
            properties:nextProperties
        })
    }

    // 删除
    const deleteRow = (index) => {
        let properties = this.props.deviceModel.properties;
        if (properties.length === 1) {
        return;
        }
        properties = properties.filter((item, key) => key !== index);
        this.setState({
            properties:properties
        })
    }

    const listContent = this.state.properties.map((item, index) => {
        return (
            <div key={index}>
                <Form.Item
                    label="属性名"
                >
                {
                    getFieldDecorator(`properties[${index}].name`,{
                    initialValue:item.name || '',
                    rules:[{
                        required:true,
                        message:'设备类型名必须输入'
                    }
                    ]
                    })(
                    <Input placeholder="请输入设备类型名"></Input>
                    )
                }
                </Form.Item>

                <Form.Item
                    label="属性描述"
                >
                {
                    getFieldDecorator(`properties[${index}].description`,{
                    initialValue:item.description || '',
                    rules:[{
                        required:false,
                    }
                    ]
                    })(
                    <Input placeholder="请输入属性描述"></Input>
                    )
                }
                </Form.Item>

                <Form.Item
                    label="属性类型"
                >
                {
                    getFieldDecorator(`properties[${index}].type`,{
                    initialValue:(item.type != null && item.type != undefined) ? Object.keys(item.type) : '',
                    rules:[{
                        required:true,
                        message: '缺少属性类型'
                    }
                    ]
                    })(
                    <Select>
                        <Select.Option key="string" value="string">string</Select.Option>
                        <Select.Option key="int" value="int">int</Select.Option>
                        <Select.Option key="double" value="double">double</Select.Option>
                    </Select>
                    )
                }
                </Form.Item>

                <Form.Item
                    label="访问类型"
                >
                {
                    getFieldDecorator(`properties[${index}].type.accessMode`,{
                    initialValue:(item.type != null && item.type != undefined) ? item["type"][Object.keys(item.type)]["accessMode"] : '',
                    rules:[{
                        required:true,
                        message: '缺少访问类型'
                    }
                    ]
                    })(
                    <Select>
                        <Select.Option key="ReadWrite" value="ReadWrite">ReadWrite</Select.Option>
                        <Select.Option key="ReadOnly" value="ReadOnly">ReadOnly</Select.Option>
                    </Select>
                    )
                }
                </Form.Item>
                <Form.Item
                    label="属性默认值"
                >
                {
                    getFieldDecorator(`properties[${index}].type.defaultValue`,{
                    initialValue:(item.type != null && item.type != undefined) ? item["type"][Object.keys(item.type)]["defaultValue"] : '',
                    rules:[{
                        required:false,
                    }
                    ]
                    })(
                    <Input placeholder="请输入属性默认值"></Input>
                    )
                }
                </Form.Item>
                {index > 0 ? (
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
              initialValue:deviceModel.name,
              rules:[{
                required:true,
                message:'设备类型名必须输入'
              }
            ]
            })(
              <Input placeholder="请输入设备类型名"></Input>
            )
          }
        </Item>
        
        <Item label="命名空间">
          {
            getFieldDecorator('namespace',{
              initialValue:deviceModel.namespace || 'default',
              rules:[{
                required:true,
                message:'命名空间必须输入'
              }
            ]
            })(
              <Input placeholder="请输入设备命名空间"></Input>
            )
          }
        </Item>

        <Item label="API版本">
          {
            getFieldDecorator('apiVersion',{
              initialValue:deviceModel.apiVersion || 'devices.kubeedge.io/v1alpha1',
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
              initialValue:deviceModel.kind || 'deviceModel',
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
        
        {listContent}
        <Item style={{display: this.state.isChangeable}}>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={add}>增加</Button>
        </Item>

      </Form>
    )
  }
}
export default Form.create()(AddUpdateForm)