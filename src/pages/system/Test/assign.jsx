import React,{Component} from 'react'
import {Form,Input,DatePicker,Select} from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/zh_CN';
const Item = Form.Item
let id=[]
class Assign extends Component{
  //接收父组件参数
  static propTypes = {
    setAssign:PropTypes.func.isRequired,
    assignDetail:PropTypes.object
  }
  constructor(props){
    super(props)
    this.state={
      maintainers:{},
      token:window.localStorage.getItem('token'),
      projectId:'',
    }
    this.getUser=this.getUser.bind(this)
    //  this.getOption=this.getOption.bind(this)
  }
  componentWillMount() {
    this.props.setAssign(this.props.form)
  }
  componentDidMount(){
    this.getUser(window.localStorage.getItem('id'))
    //  this.getOption()
  }
  getUser=()=>{
    const assignDetail = this.props.assignDetail
    console.log(assignDetail)
    axios({
      method: 'GET',
      url: '/mdmc/mdmcTask/getTaskByTaskId/'+assignDetail.id,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){     
          console.log(res.data.result)
          this.setState({
            projectId:res.data.result.projectId
          })
          this.getEngineer()
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getEngineer=()=>{
    //const {projectId}=this.state
    let value={
      position:"engineer",
      pageNum:0,
      pageSize:0
    }
    axios({
      method: 'POST',
      url: '/spc/engineer/queryListByGroupId',//+projectId,
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(value)
    })
      .then((res) => {
        if(res && res.status === 200){     
          console.log(res.data.result)
          this.setState({
            maintain:res.data.result.list
          })
        }
      })
      .catch(function (error){
        console.log(error);
      });
  }
  selectMaintainerID=(id)=>{  
    id=id
  }
  getOption(){
    const {maintain}=this.state
    var maintainer=maintain&&maintain.map((item, index) => (
      <Select.Option key={index} value={item.userId}> 
        {item.loginName}
      </Select.Option>
    ))
    return maintainer
  }
  
  render(){

    const assignDetail = this.props.assignDetail
    console.log(assignDetail)
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }
    const {maintain}=this.state
    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="任务编号：">
          {
            getFieldDecorator('id',{
              initialValue:assignDetail&&assignDetail.id,
              rules:[{
                required:true,
                message:'请输入任务编号',
              }]
            })(
              <Input placeholder="请输入任务编号"  disabled='true'></Input>
            )
          }
         
        </Item>
        <Item label="工程师编号">
          {
            getFieldDecorator('maintainerId',{
              initialValue:assignDetail&&assignDetail.maintainerId,
              rules:[{
                required:true,
                message:'请选择工程师编号'
              }]
            })(
              <Select
                placeholder="请选择工程师编号"
                // value={id}
                // onChange={(value) => {this.selectMaintainerID(value) }}
                allowClear
              >
                {this.getOption()}
                {/* { maintain&&maintain.map((item, index) => (
                <Select.Option key={index} value={item.id}> 
                    {item.name}
                </Select.Option>
               ))
               } */}
              </Select>
            )
          }       
        </Item>
        <Item label="最晚维修时间">
          {
            getFieldDecorator('deadline',{
              initialValue:assignDetail&&assignDetail.deadline,
              rules:[{
                required:true,
                message:'请选择最晚维修时间'
              }]
            })(
              <DatePicker
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择最晚维修时间"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
            )
          }
         
        </Item>
      
        
      </Form>
    )
  }
}
export default Form.create()(Assign)