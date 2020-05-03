import React,{Component} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios';
const Item = Form.Item
let id=[]
class AssignEngineer extends Component{
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
    }
  }
  componentWillMount() {
    this.props.setAssign(this.props.form);
    this.getEngineer();
  }
  getEngineer=()=>{
    let value={
      position:"engineer",
      pageNum:0,
      pageSize:0
    }
    axios({
      method: 'POST',
      url: '/spc/engineer/queryListByGroupId',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(value)
    })
      .then((res) => {
        if(res && res.status === 200){
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
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }
    const {maintain}=this.state;
    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label="任务编号：">
          {
            getFieldDecorator('taskId',{
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
            getFieldDecorator('engineerId',{
              initialValue:assignDetail&&assignDetail.maintainerId,
              rules:[{
                required:true,
                message:'请选择工程师编号'
              }]
            })(
              <Select
                placeholder="请选择工程师编号"
                allowClear
              >
                {this.getOption()}
              </Select>
            )
          }       
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AssignEngineer)