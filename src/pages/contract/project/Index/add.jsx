import React,{Component} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios';
const token = window.localStorage.getItem('token')
const { Option } = Select;
const Item = Form.Item

class Add extends Component{
  //接收父组件参数
  // static propTypes = {
  //   setAdd:PropTypes.func.isRequired,
  //   add:PropTypes.object
  // }
  constructor(props){
      super(props)
      this.state={
          projectDetail:{ 
                          
          },
          partyBUserList:{

          },
          BindUserIdList:{

          },
          BUserId:null,
          BList:[],
          BUserLength:0,
          BindLength:0,
          partyBNameList: [],
      }
      this.getAllPreparedData1 = this.getAllPreparedData1.bind(this);
      this.getAllPreparedData2 = this.getAllPreparedData2.bind(this);
  }

  componentDidMount(){
    this.props.setAdd(this.props.form)
    const add = this.props.add;
    const flag = this.props.add.flag;
    console.log(add);
    console.log(flag);
    //const projectId = this.props.data.projectId;
    if(flag == 0){//如果当前是关联工程师
      if(add.projectId){
        this.getAllPreparedData1(add.projectId);
      }
    }else if(flag == 1){//如果当前是解绑工程师
      if(add.projectId){
        this.getAllPreparedData2(add.projectId);
      }
    }
    
  }

  getAllPreparedData1 = async(projectId) => {
    console.log("项目id：" + projectId)
    const res1 = await axios({
      method: 'POST',
      url: '/pmc/project/getById/'+projectId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
    if(res1 && res1.status === 200){
      console.log("res1:" + JSON.stringify(res1));
      this.setState({
        projectDetail:res1.data.result
      })
    }
    const res2 = await axios({
      method: 'POST',
      url: '/uac/group/getBindUser/'+this.state.projectDetail.partyBId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
    if(res2 && res2.status === 200){
      console.log("res2:" + JSON.stringify(res2));
      this.setState({
        partyBUserList:res2.data.result
      })
      this.state.BList = this.state.partyBUserList.allUserSet
      let i = 0;
      for(let B in this.state.BList){
        i++;
      }
      this.state.BUserLength = i;
      console.log("B长度：" + this.state.BUserLength)
    }
    this.setState({
      partyBNameList: this.prepareOptions()
    })
  }

  getAllPreparedData2 = async(projectId) =>{
    const res1 = await axios({
      method: 'POST',
      url: '/pmc/project/getById/'+projectId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
    if(res1 && res1.status === 200){
      console.log("res1:" + res1);
      this.setState({
        projectDetail:res1.data.result
      })
    }
    const res3 = await axios({
      method: 'POST',
      url: '/pmc/project/queryProUserByProjectId/'+projectId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
    if(res3 && res3.status === 200)
    {
      console.log("res3:" + JSON.stringify(res3));
      this.setState({
        BindUserIdList:res3.data.result
      })
      let i=0;
      for(let B in this.state.BindUserIdList){
        i++;
      }
      this.setState({
        BindLength:i
      })
    }
    const res2 = await axios({
      method: 'POST',
      url: '/uac/group/getBindUser/'+this.state.projectDetail.partyBId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
    if(res2 && res2.status === 200){
      console.log("res2:" + res2);
      this.setState({
        partyBUserList:res2.data.result
      })
      this.state.BList = this.state.partyBUserList.allUserSet
      let i = 0;
      for(let B in this.state.BList){
        i++;
      }
      this.setState({
        BUserLength:i
      })
      console.log("B长度：" + this.state.BUserLength)
    }
    this.setState({
      partyBNameList: this.prepareOptions()
    })
  }
  handlePartyBMSelect=(e)=>{
    const {
      form,
    } = this.props
    const { setFieldsValue } = form;
    form.setFieldsValue({
      userId:e,
    })
  }

  handlePartyBMDelete = (e) =>{
    const {
      form,
    } = this.props
    const { setFieldsValue } = form;
    form.setFieldsValue({
      userId:null,
    })
  }

  prepareOptions() {
    const partyBNameList = [];
    if(this.props.add.flag==1)
    {
      for(let j=0;j<this.state.BUserLength;j++){
        if(!this.state.BList[j].disabled){
          let mark=0;
          for(let i = 0;i<this.state.BindLength;i++){
            if(this.state.BList[j].userId == this.state.BindUserIdList[i].userId && this.state.BList[j].roleCode == 'engineer'){
              mark=1;
              break;
            }
          }
          if(mark==1){
            partyBNameList.push(<Option key={this.state.BList[j].userId}>{this.state.BList[j].userName}</Option>)
          }
        }
      }
    }
    else if(this.props.add.flag==0){
      for(let j=0;j<this.state.BUserLength;j++){
        if(!this.state.BList[j].disabled && this.state.BList[j].roleCode == 'engineer'){
          partyBNameList.push(<Option key={this.state.BList[j].userId}>{this.state.BList[j].userName}</Option>)
        }
      }
    }
    return partyBNameList;
  }

  render(){
    const add = this.props.add
    const formItemLayout = {
      labelCol:{span:5},
      wrapperCol:{span:15}
    }
    const {BUserId} = this.state;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form {...formItemLayout}>
        <Item label="项目ID">
          {
            getFieldDecorator('projectId',{
              initialValue:add.projectId,
              rules:[{
                required:true,
                message:'请输入项目ID',
              }]
            })(
              <Input placeholder="请输入项目ID" />
            )
          }
        </Item>
        <Item label="工程师">
          {
            getFieldDecorator('userName',{
              disabled:true,
              rules:[{
                required:true,
                message:'请选择工程师'
              }]
            })(
              <Select mode="tags" style={{ width: '100%' }} placeholder="请选择与该项目关联的工程师" onSelect={this.handlePartyBMSelect} onDeselect={this.handlePartyBMDelete} >
                {this.state.partyBNameList}
              </Select>
            )
          }       
        </Item>
        <Item label="工程师id">
          {
            getFieldDecorator('userId',{
              initialValue:BUserId,
              disabled:true,
              rules:[{
                required:true,
                message:'请填写工程师id'
              }]
            })(
              <Input  placeholder="请填写与该项目关联的工程师id" />
            )
          }       
        </Item>
      </Form>
    )
  }
}
export default Form.create()(Add)