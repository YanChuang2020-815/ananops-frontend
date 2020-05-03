import React,{Component} from 'react'
import {Form,Input,Select,Icon,Radio} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

class Confirm extends Component{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    detail:PropTypes.object
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){

    const detail = this.props.detail
  
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }
    console.log(detail)
    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="工单编码：">
          {
            getFieldDecorator('objectId',{
              initialValue:detail.objectId,
              rules:[{
                required:true,
                message:'请输入工单编码',
              }]
            })(
              <Input placeholder="请输入工单编码"  disabled='true'></Input>
            )
          }
         
        </Item>
        <Item label="备品备件订单申请人 ：">
          {
            getFieldDecorator('applicant',{
              initialValue:detail.applicant,
              rules:[{
                required:true,
                message:'请输入备品备件订单申请人 ',
              }]
            })(
              <Input placeholder="请输入备品备件订单申请人 "  disabled='true'></Input>
            )
          }
         
        </Item>
        <Item label="备品备件订单申请人编号：">
          {
            getFieldDecorator('applicantId',{
              initialValue:detail.applicantId,
              rules:[{
                required:true,
                message:'请输入备品备件订单申请人编号',
              }]
            })(
              <Input placeholder="请输入备品备件订单申请人编号"  disabled='true'></Input>
            )
          }
         
        </Item>
        <Item label="备品备件订单审批人：">
          {
            getFieldDecorator('currentApprover',{
              initialValue:detail.applicantId,
              rules:[{
                required:true,
                message:'请输入备品备件订单审批人',
              }]
            })(
              <Input placeholder="请输入备品备件订单审批人"></Input>
            )
          }
         
        </Item>
        <Item label="备品备件订单审批人编号：">
          {
            getFieldDecorator('currentApprover',{
              initialValue:detail.applicantId,
              rules:[{
                required:true,
                message:'请输入备品备件订单审批人编号',
              }]
            })(
              <Input placeholder="请输入备品备件订单审批人编号"></Input>
            )
          }
         
        </Item>
        <Item label="备件添加：">
          {getFieldDecorator('DeviceOrderItemInfoDto')(
            <div>
              {detail.DeviceOrderItemInfoDto &&
                detail.DeviceOrderItemInfoDto.map((item, index) => (
                  <div className="inspection-log-abnormal" key={index}>
                    <div className="inspection-log-abnormal-flex">
                      <Radio.Group onChange={(value) => {this.selectStatus(value, index) }} value={item.status}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                      </Radio.Group>
                      {item.value===1?
                        <div>
                          <Select
                            placeholder="请选择备件编号"
                            className="inspection-log-abnormal-select"
                            value={item.deviceID}
                            onChange={(value) => { this.selectdeviceID(value, index) }}
                            allowClear
                          >
                            {/* {
                          SELECT_INSPECTION_ABNORMA_ITEM &&
                          SELECT_INSPECTION_ABNORMA_ITEM.map((cur, index) => (
                            <Select.Option key={index}
                              value={cur.id}
                            >{cur.name}</Select.Option>
                          ))
                        } */}
                            <Select.Option key='1'
                            >{1}
                            </Select.Option>
                            <Select.Option key='1'
                            >{1}
                            </Select.Option>
                          </Select>
                          <Input
                            value={item.manufacture}
                            onChange={(value) => { this.manufactureChange(value, index) }}
                            onBlur={this.descriptionTextJudge}
                            placeholder="请输入设备服务商"
                          /></div>
                        :<div>
                          <Input
                            value={item.manufacture}
                            onChange={(value) => { this.manufactureChange(value, index) }}
                            onBlur={this.descriptionTextJudge}
                            placeholder="请输入设备服务商"
                          />
                        </div>
                      }
                      
                    </div>
                    <Icon type="minus-circle" className="inspection-log-abnormal-delete"
                      style={{ display: (item.deleteDisplay === true) ? '' : 'none' }}
                      onClick={() => { this.deleteAbnormalItem(index) }}
                    />
                    <Icon type="plus-circle" className="inspection-log-abnormal-plus"
                      style={{ display: (item.addDisplay === true) ? '' : 'none' }}
                      onClick={this.addAbnormalItem}
                    />
                  </div>
                ))
              }
            </div>
          )}
        </Item>
        {/* <Item label="负责人ID：">
          {
            getFieldDecorator('principalId',{
              initialValue:detail.principalId,
              disabled:true,
              rules:[{
                required:true,
                message:'请输入负责人ID'
              }]
            })(
              <Input  disabled='true' placeholder="请输入负责人ID"></Input>
            )
          }       
        </Item>
        <Item label="维修工ID：">
          {
            getFieldDecorator('maintainerId',{
              initialValue:detail.maintainerId,
              rules:[{
                required:false,
                message:'请输入维修工ID'
              }]
            })(
              <Input placeholder="请输入维修工ID"></Input>
            )
          }
         
        </Item>
      
        <Item label="设备ID：">
          {
            getFieldDecorator('deviceId',{
              initialValue:detail.deviceId,
              rules:[{
                required:true,
                message:'请输入设备ID'
              }]
            })(
              <Input placeholder="请输入设备ID"></Input>
            )
          }
         
        </Item>
        <Item label="设备类型：">
          {
            getFieldDecorator('deviceType',{
              initialValue:detail.deviceType,
              rules:[{
                required:true,
                message:'请输入设备类型'
              }]
            })(
              <Input placeholder="请输入设备类型"></Input>
            )
          }
         
        </Item>
        <Item label="总花费：">
          {
            getFieldDecorator('cost',{
              initialValue:detail.cost,
              rules:[{
                required:false,
                message:'请输入总花费'
              }]
            })(
              <Input  placeholder="请输入总花费（¥）"></Input>
            )
          }
         
        </Item>
        <Item label="总计：">
          {
            getFieldDecorator('count',{
              initialValue:detail.count,
              rules:[{
                required:false,
                message:'请输入总计'
              }]
            })(
              <Input  placeholder="请输入总计"></Input>
            )
          }
         
        </Item> */}
      </Form>
    )
  }
}
export default Form.create()(Confirm)