import React,{Component} from 'react'
import {Form,Input,Radio,Select,TreeSelect} from 'antd'
import PropTypes from 'prop-types'
import {reqGetApis} from '../../axios/index'
const Item = Form.Item
const Option = Select.Option
class AddUpdateForm extends Component{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    auth:PropTypes.object,
      menuTreeNodes:PropTypes.object
  }
  state={
        searchMenuName:undefined, //根据哪个菜单名称搜索
        apis:[],
    }
  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  componentDidMount() {
      this.getApis();
  }

    onChange = value => {
        console.log(value);
        this.setState({searchMenuName:value});
  }

  getApis = async () => {
     const data = await reqGetApis();
     if (data.code === 200){
        this.setState({apis:data.result})
     }
  }

  getApiOptions=()=>{
        const {apis}=this.state
        var apiOption=apis&&apis.map((item, index) => (
            <Select.Option key={index} value={item.url}>
                <span style={{display: "flex", justifyContent: "space-between"}}>
                    <span>{item.apiName}</span>
                    <span>{item.url}</span>
                </span>

            </Select.Option>
        ))
        return apiOption
    }

  render(){
    const menuTreeNodes = this.props.menuTreeNodes
    const auth = this.props.auth
    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}
      >

          <Item label="菜单名称：">
              {
                  getFieldDecorator('menuId',{
                      initialValue:auth.menuId,

                  })(
                      <TreeSelect
                          showSearch
                          value={this.state.searchMenuName}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择菜单名称"
                          allowClear
                          treeDefaultExpandAll
                          onChange={this.onChange}
                      >
                          {menuTreeNodes}
                      </TreeSelect>
                  )
              }
          </Item>
        <Item label="权限编码：">
          {
            getFieldDecorator('actionCode',{
              initialValue:auth.actionCode,
              rules:[{
                required:true,
                message:'权限编码必须输入'
              }]
            })(
              <Input placeholder="请输入权限编码"></Input>
            )
          }
         
        </Item>
      
        <Item label="权限名称：">
          {
            getFieldDecorator('actionName',{
              initialValue:auth.actionName,
              rules:[{
                required:true,
                message:'权限名称必须输入'
              }]
            })(
              <Input placeholder="请输入权限名称"></Input>
            )
          }
         
        </Item>
        <Item label="权限地址："

        >
          {
            getFieldDecorator('url',{
              initialValue:auth.url,
              rules:[{
                required:true,
                message:'权限地址必须输入'
              }]
            })(
                <Select
                    showSearch
                    placeholder="请选择url"
                    allowClear
                >
                    {this.getApiOptions()}
                </Select>
            )
          }
         
        </Item>

        <Item label="权限说明：">
          {
            getFieldDecorator('remark',{
              initialValue:auth.remark,
              
            })(
              <Input placeholder="请输入权限说明"></Input>
            )
          }
         
        </Item>
        <Item label="状态：">
          {
            getFieldDecorator('status',{
              initialValue:auth.status=== undefined?'ENABLE':auth.status,
              
            })(
              <Radio.Group>
                <Radio value="ENABLE">启用</Radio>
                <Radio value="DISABLE">禁用</Radio>
              </Radio.Group>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddUpdateForm)