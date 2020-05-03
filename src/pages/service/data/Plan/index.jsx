import React,{Component} from 'react'
import {Form,Input,Select,Icon,Radio,InputNumber,message,Button} from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios'
const Item = Form.Item
let newArr = []
let device=[]
class Plan extends Component{
    constructor(props){
        super(props)
        this.state={
          detail:{},
          DeviceOrderItemInfoDto: [
            {
            status:null,//是否选择提供的备品备件
            id: undefined,// 设备ID
            manufacture: '',// 供货商
            type:'', //设备类型
            name:'', //设备名称
            count:null,//设备个数
            deleteDisplay: false,//删除异常设备按钮是否出现
            addDisplay: true,//添加异常项按钮是否出现
            }
        ],
        devices:{},
        getPrinciple:{},
        taskDetail:{},
        token:window.localStorage.getItem('token')
        }
       this.getDevice=this.getDevice.bind(this)
       this.getPrinciple=this.getPrinciple.bind(this)
    }
    componentDidMount(){
      const { 
        match : { params : { id } }
      } = this.props
        this.getDevice();
        this.getPrinciple(id)
    }
    //设置是否从备件库拉取备件
    selectStatus=(value, index)=>{      
        newArr = this.state.DeviceOrderItemInfoDto
        newArr[index].status = value
        this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //获取所有的备件信息
    getDevice=()=>{
          axios({
            method: 'GET',
            url: '/rdc/deviceOrder/devices',
            headers: {
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
          .then((res) => {
            if(res && res.status === 200){     
               device=res.data.result
            }
        })
          .catch(function (error) {
              console.log(error);
          });
    }
    //设备选择下拉框
    getOption(){
        //获取下拉框数据写法1
        //var deviceitem=[]
        // for(var i=0;i<device.length;i++){
        //    deviceitem.push(<Select.Option key={device[i].id} value={device[i].id}>{device[i].name}</Select.Option>)
        // }
        //获取下拉框数据写法2
             var deviceitem=device&&device.map((item, index) => (
                <Select.Option key={index} value={item.id}> 
                    {item.name}
                </Select.Option>
            ))
       return deviceitem
       
    }
    //获取审批人ID
    getPrinciple=(id)=>{
      axios({
        method: 'GET',
        url: '/mdmc/mdmcTask/getTaskByTaskId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
      .then((res) => {
        if(res && res.status === 200){    
          // this.setState({
          //   taskDetail:res.data.result
          // })
          var principleId=res.data.result.facilitatorId
          this.getPrincipleName(principleId)
        }
    })
      .catch(function (error) {
          console.log(error);
      });
    }

    //获取审批人姓名
    getPrincipleName=(id)=>{
      const {taskDetail}=this.state
      axios({
        method: 'POST',
        url: '/uac/user/getUacUserById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
      .then((res) => {
        if(res && res.status === 200){    
          // this.setState({
          //   taskDetail:res.data.result
          // })
          var info={}
          info.currentApproverId=id
          info.currentApprover=res.data.result.userName
          this.setState({
            taskDetail:info
          })
        }
    })
      .catch(function (error) {
          console.log(error);
      });
    }
    //设备ID的改变，其他信息自动补充
    selectdeviceID=(value,index)=>{
        newArr = this.state.DeviceOrderItemInfoDto
        newArr[index].id = value
        var obj=device.find(ele=>ele.id === value)
        newArr[index].manufacture=value&&obj.manufacture
        newArr[index].type=value&&obj.type
        newArr[index].model=value&&obj.model
        newArr[index].name=value&&obj.name
        this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //用户手动输入服务商
    manufactureChange=(value,index)=>{
      console.log(value)
      newArr = this.state.DeviceOrderItemInfoDto
      newArr[index].manufacture = value
      this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //设备计数
    countChange=(value,index)=>{
      newArr = this.state.DeviceOrderItemInfoDto
      newArr[index].count = value
      this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //用户手填设备类型
    typeChange=(value,index)=>{
      newArr = this.state.DeviceOrderItemInfoDto
      newArr[index].type = value
      this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //用户手填设备型号
    modelChange=(value,index)=>{
      newArr = this.state.DeviceOrderItemInfoDto
      newArr[index].model = value
      this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //用户手填设备名称
    nameChange=(value,index)=>{
      newArr = this.state.DeviceOrderItemInfoDto
      newArr[index].name = value
      this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //减项
    deleteAbnormalItem = (value) => {
      if (newArr.length === 1) {
        newArr[0].addDisplay = true
        newArr[0].deleteDisplay = false
        return
      }
      newArr.splice(value, 1)
      let len = newArr.length
      if (len === 1) {
        newArr[len - 1].addDisplay = true
        newArr[len - 1].deleteDisplay = false
      } else {
        newArr[len - 1].addDisplay = true
        newArr[len - 1].deleteDisplay = true
      }
      this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //加项
    addAbnormalItem=()=>{
      const item = {
        status:null,//是否选择提供的备品备件
        id: undefined,// 设备ID
        manufacture: '',// 供货商
        type:'', //设备类型
        name:'', //设备名称
        count:null,//设备个数
        deleteDisplay: true,
        addDisplay: true,
      }
      newArr = this.state.DeviceOrderItemInfoDto
      newArr.push(item)
      for (let i = 0; i < newArr.length - 1; i++) {
        newArr[i].addDisplay = false
        newArr[i].deleteDisplay = true
      }
      this.setState({ DeviceOrderItemInfoDto: newArr })
    }
    //提交信息
    handleSubmit = (e) => {
      e.preventDefault()
      const {
        form,
        history,
      } = this.props
      const { getFieldValue } = form;
      const values = form.getFieldsValue()
      if (!getFieldValue('objectId')) {
        message.error('请输入工单编码');
        return;
      }
      if (!getFieldValue('applicant')) {
        message.error('请输入备品备件订单申请人');
        return;
      }
      if (!getFieldValue('applicantId')) {
        message.error('请输入备品备件订单申请人编号');
        return;
      }
      if (!getFieldValue('currentApprover')) {
        message.error('请输入备品备件订单审批人');
        return;
      }
      if (!getFieldValue('currentApproverId')) {
        message.error('请输入备品备件订单审批人编号');
        return;
      }
      newArr.map((item) => (
        delete item.deleteDisplay,
        delete item.addDisplay,
        delete item.status
        )
      )
      values.items = newArr   
      values.objectType=1 
      console.log(values)
      axios({
        method: 'POST',
        url: '/rdc/deviceOrder/create',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(values)
        })
      .then((res) => {
          if(res && res.status === 200){     
          // this.setState({
          //    projectDetail:res.data.result
          // });
          history.push('/cbd/maintain/data')
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    
  }
  render(){ 
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }
    const { 
        form: { getFieldDecorator }, 
        match : { params : { id } }
      } = this.props
    const { DeviceOrderItemInfoDto,taskDetail } = this.state

    return (
      <Form {...formItemLayout}
      onSubmit={this.handleSubmit}
      >

        <Item label="工单编码：">
          {
            getFieldDecorator('objectId',{
              initialValue:id,
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
              initialValue:JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.userName,
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
              initialValue:window.localStorage.getItem('id'),
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
              initialValue:taskDetail.currentApprover,
              rules:[{
                required:true,
                message:'请输入备品备件订单审批人',
              }]
            })(
              <Input placeholder="请输入备品备件订单审批人" disabled="true"></Input>
            )
          }
         
        </Item>
        <Item label="备品备件订单审批人编号：">
          {
            getFieldDecorator('currentApproverId',{
              initialValue:taskDetail.currentApproverId,
              rules:[{
                required:true,
                message:'请输入备品备件订单审批人编号',
              }]
            })(
              <Input placeholder="请输入备品备件订单审批人编号" disabled="true"></Input>
            )
          }
         
        </Item>
        <Item label="备件添加：">
            {getFieldDecorator('items')(
              <div>
              {DeviceOrderItemInfoDto &&
                DeviceOrderItemInfoDto.map((item, index) => (
                  <div className="inspection-log-abnormal" key={index}>
                    <div className="inspection-log-abnormal-flex">
                    <Radio.Group 
                        onChange={(e) => {this.selectStatus(e.target.value, index) }} 
                        value={item.status}>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                    {console.log(item)}
                    {item.status===1?
                    <div>
                      <Select
                        placeholder="请选择设备编号"
                        className="inspection-log-abnormal-select"
                        value={item.id}
                        onChange={(value) => { this.selectdeviceID(value, index) }}
                        allowClear
                      >
                          {/* <Select.Option key='1'
                            value='1'
                            >1
                            </Select.Option>
                            <Select.Option key='2'
                            value='2'
                            >2
                            </Select.Option> */}
                            {this.getOption()}
                      </Select>
                      <Input
                        value={item.manufacture}
                    //  onChange={(value) => { this.manufactureChange(value, index) }}
                        placeholder="请输入设备服务商"
                        disabled='true'
                      /> 
                       <Input
                        value={item.model}
                    //  onChange={(value) => { this.manufactureChange(value, index) }}
                        placeholder="请输入设备型号"
                        disabled='true'
                      /> 
                       <Input
                        value={item.name}
                    //  onChange={(value) => { this.manufactureChange(value, index) }}
                        placeholder="请输入设备名称"
                        disabled='true'
                      /> 
                       <Input
                        value={item.type}
                    //  onChange={(value) => { this.manufactureChange(value, index) }}
                        placeholder="请输入设备类型"
                        disabled='true'
                      /> 
                       <InputNumber
                        value={item.count}
                        onChange={(value) => { this.countChange(value, index) }}
                        placeholder="设备数"
                        min={0}
                        defaultValue={0}
                      /> 
                      </div>
                      :<div>
                    <Input
                      value={item.manufacture}
                      onChange={(e) => { this.manufactureChange(e.target.value, index) }}
                      placeholder="请输入设备服务商"
                    />
                      <Input
                        value={item.model}
                        onChange={(e) => { this.modelChange(e.target.value, index) }}
                        placeholder="请输入设备型号"
                      /> 
                       <Input
                        value={item.name}
                        onChange={(e) => { this.nameChange(e.target.value, index) }}
                        placeholder="请输入设备名称"
                      /> 
                       <Input
                        value={item.type}
                        onChange={(e) => { this.typeChange(e.target.value, index) }}
                        placeholder="请输入设备类型"
                      /> 
                       <InputNumber
                        value={item.count}
                        onChange={(value) => { this.countChange(value, index) }}
                        placeholder="设备数"
                        min={0}
                        defaultValue={0}
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
          <section className="operator-container">
              <div style={{ textAlign: "center" }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="default"
                >新建
                </Button>
                <Button
                  style={{ marginLeft: "28px" }}
                  size="default"
                  onClick={() => {
                    const {
                      history,
                    } = this.props
                    history.push('/cbd/maintain/data')
                  }}
                >取消
                </Button>
              </div>
            </section>
      </Form>
    )
  }
}
export default Form.create()(Plan)