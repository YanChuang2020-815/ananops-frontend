import React, { Component, } from 'react';
import { Form,Input,Select,Button,message,DatePicker,Radio } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/zh_CN';
const token = window.localStorage.getItem('token')
const { Option } = Select;
class ProjectNew extends Component{
  //接收父组件参数
  constructor(props){
    super(props)
    this.state={
      contractDetail:{

      },
      projectDetail:{ 
                      
      },
      partyAUserList:{

      },
      partyBUserList:{

      },
      AUserList:[],
      ALeaderList:[],
      BUserList:[],
      BLeaderList:[],
      AList:[],
      BList:[],
      // AUserLength:0,
      // BUserLength:0,
    }
    this.getAllPreparedData = this.getAllPreparedData.bind(this);
  }
  handleEmail (e) {
    let value = e.target.value;
    if(!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value))) {
      message.info('请填写有效邮箱信息');
    }
  }

  componentDidMount(){
    
    const contractDetail = this.props.contractDetail;
    const projectDetail = this.props.projectDetail;
    var id = projectDetail.id;
    const contractId = contractDetail.id;
    this.setState({
      contractDetail
    })
    if(id){
      axios({
        method: 'POST',
        url: '/pmc/project/getById/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
      })
      .then((res) => {
        if(res && res.status === 200){
          // 修改项目的时候，也需要准备好甲服务方负责人、联系人信息
          this.getAllPreparedData(res.data.result.contractId);
          this.setState({
            projectDetail:res.data.result
          })
        }
      })
      .catch(function (error) {
          console.log(error);
      });
    }else{//如果项目id为空，则说明不是修改项目，而是从合同创建的项目
      if (contractId != null || contractId != undefined) {
        if(contractId){
          console.log("合同id为：" + contractId);
          this.getAllPreparedData(contractId);
        }
      } else {
        this.props.history.push('/cbd/pro/contract');
      }
    }
  }
  //获得所有接下来需要的数据
  getAllPreparedData = async (contractId) => {
    //首先获取项目对应的合同详情
    const res1 = await axios({
      method: 'POST',
      url: '/pmc/contract/getContractById/'+contractId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
    if(res1 && res1.status === 200){     
      this.setState({
          contractDetail:res1.data.result
      });
      console.log("合同：" + JSON.stringify(this.state.contractDetail))
    }
    //然后获得项目对应的合同对应的用户方用户列表
    const res2 = await axios({
      method: 'POST',
      url: '/uac/group/getBindUser/'+this.state.contractDetail.partyAId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
    if(res2 && res2.status === 200){    
      console.log(res2)
      this.setState({
        //partyAUserList:res2.data.result,
        AList:res2.data.result.allUserSet
      }) ;
      let AUserList = [];
      let ALeaderList = [];
      this.state.AList.map(item=>{
        if(item.roleCode=='user_leader'){
          ALeaderList.push(item);
        }else{
          AUserList.push(item);
        }
      })
      this.setState({
        AUserList:AUserList,
        ALeaderList:ALeaderList
      })
      console.log("用户方用户："+JSON.stringify(this.state.AUserList))
      console.log("用户方负责人："+JSON.stringify(this.state.ALeaderList))
    }
    //然后获得项目对应的合同对应的服务方用户列表
    const res3 = await axios({
      method: 'POST',
      url: '/uac/group/getBindUser/'+this.state.contractDetail.partyBId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
    if(res3 && res3.status === 200){   
      console.log(res3) 
      this.setState({
        //partyBUserList:res3.data.result,
        BList:res3.data.result.allUserSet
      }) ;
      let BUserList = [];
      let BLeaderList = [];
      this.state.BList.map(item=>{
        if(item.roleCode=='fac_leader'){
          BLeaderList.push(item);
        }else{
          BUserList.push(item);
        }
      })
      this.setState({
        BUserList:BUserList,
        BLeaderList:BLeaderList
      })
      console.log("服务方用户："+JSON.stringify(this.state.BUserList))
      console.log("服务方负责人："+JSON.stringify(this.state.BLeaderList))
    }

  }
  
  //根据用户方用户的id获取用户方用户的信息
  getAUserInfo = (userId) =>{
    let AList = this.state.AList;
    let result = {};
    AList.map(item=>{
      if(userId==item.userId){
        result = item;
      }
    })
    return result;
  }
  //根据服务方用户的id获取服务方用户的id
  getBUserInfo = (userId) =>{
    let BList = this.state.BList;
    console.log(BList)
    let result = {};
    BList.map(item=>{
      if(userId==item.userId){
        console.log("userId:" + userId)
        result = item;
      }
    })
    return result;
  }

  handlePartyAMSelect = (e) =>{
    const {
      form,
    } = this.props
    const { setFieldsValue } = form;
    const userInfo = this.getAUserInfo(e);
    form.setFieldsValue({
      aleaderId:e,
      aleaderTel:userInfo.mobileNo,
      aleaderName:userInfo.userName,
    })
  }

  handlePartyAMDelete = (e) =>{
    const {
      form,
    } = this.props
    const { setFieldsValue } = form;
    form.setFieldsValue({
      aleaderId:null,
      aleaderTel:null,
      aleaderName:null,
    })
  }
  
  handlePartyA1Select = (e) =>{
    const {
      form,
    } = this.props
    const { setFieldsValue } = form;
    const userInfo = this.getAUserInfo(e);
    form.setFieldsValue({
      partyAOne:userInfo.mobileNo,
      aoneName:userInfo.userName,
    })
  }

  handlePartyA1Delete = (e) =>{
    const {
      form,
      history,
      match : { params : {id } },
    } = this.props
    const { setFieldsValue } = form;
    form.setFieldsValue({
      partyAOne:null,
      aoneName:null,
    })
  }

  handlePartyA2Select = (e) =>{
    const {
      form,
    } = this.props
    const { setFieldsValue } = form;
    const userInfo = this.getAUserInfo(e);
    form.setFieldsValue({
      partyATwo:userInfo.mobileNo,
      atwoName:userInfo.userName,
    })
  }

  handlePartyA2Delete = (e) =>{
    const {
      form,
      history,
      match : { params : {id } },
    } = this.props
    const { setFieldsValue } = form;
    form.setFieldsValue({
      partyATwo:null,
      atwoName:null,
    })
  }
  
  handlePartyA3Select = (e) =>{
    const {
      form,
      history,
      match : { params : {id } },
    } = this.props
    const { setFieldsValue } = form;
    const userInfo = this.getAUserInfo(e);
    form.setFieldsValue({
      partyAThree:userInfo.mobileNo,
      athreeName:userInfo.userName,
    })
  }

  handlePartyA3Delete = (e) =>{
    const {
      form,
      history,
      match : { params : {id } },
    } = this.props
    const { setFieldsValue } = form;
    form.setFieldsValue({
      partyAThree:null,
      athreeName:null,
    })
  }


  handlePartyBSelect = (e) =>{
    const {
      form,
    } = this.props
    const { setFieldsValue } = form;
    const userInfo = this.getBUserInfo(e);
    console.log(userInfo)
    form.setFieldsValue({
      bleaderId:e,
      bleaderTel:userInfo.mobileNo,
      bleaderName:userInfo.userName,
    })
  }

  handlePartyBDelete = (e) =>{
    const {
      form,
      history,
      match : { params : {id } },
    } = this.props
    const { setFieldsValue } = form;
    form.setFieldsValue({
      bleaderId:null,
      bleaderTel:null,
      bleaderName:null,
    })
  }

  handleSubmit = (e) => { 
    e.preventDefault()
    const {
      form,
    } = this.props
    const id = this.state.projectDetail.id;
    const { getFieldValue } = form;
    const values = form.getFieldsValue()
    if(!getFieldValue('projectName')){
      message.error('请填写项目名称')
    }
    if(!getFieldValue('projectType')){
      message.error('请填写项目类型')
    }
    if(!getFieldValue('startTime')){
      message.error('请选择开始时间')
    }
    if(!getFieldValue('endTime')){
      message.error('请选择结束时间')
    }
    if(!getFieldValue('partyAName')){
      message.error('请输入用户方名称')
    }
    if(!getFieldValue('aleaderName')){
      message.error('用户方项目负责人（关联选择）')
    }
    if(!getFieldValue('aleaderId')){
      message.error('请输入用户方负责人id')
    }
    if(!getFieldValue('aleaderTel')){
      message.error('用户方项目负责人电话')
    }
    if(!getFieldValue('aoneName')){
      message.error('用户方联系人1（关联选择）')
    }
    if(!getFieldValue('partyAOne')){
      message.error('用户方联系人1联系方式')
    }
    if(!getFieldValue('partyBName')){
      message.error('请输入服务方名称')
    }
    if(!getFieldValue('bleaderName')){
      message.error('请输入服务方负责人姓名')
    }
    if(!getFieldValue('bleaderTel')){
      message.error('请输入服务方项目负责人联系方式')
    }
    if(id){
      values.id=id
    }
    values.startTime=getFieldValue('startTime').format('YYYY-MM-DD HH:mm:ss')
    values.endTime=getFieldValue('endTime').format('YYYY-MM-DD HH:mm:ss')
    console.log(values.isContract)
    axios({
      method: 'POST',
      url: '/pmc/project/save',
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
      data:JSON.stringify(values)
    })
    .then((res) => {
        if(res && res.status === 200){
          this.props.backToTable(values.contractId);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
  }

    render(){
        const createFormItemLayout = {
            labelCol: {span:8},
            wrapperCol : {span:8},
          }
        const { 
          form: { getFieldDecorator }
        } = this.props
        const{projectDetail,contractDetail,AUserList,ALeaderList,BUserList,BLeaderList,AList,BList} = this.state;
        const id = projectDetail.id;
        return(
            <div>
                <div className="inpection-plan-create-page">
          
          <Form
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              {...createFormItemLayout}
              label="项目名称"
            >
              {getFieldDecorator('projectName',{
                initialValue: id && projectDetail.projectName,
                rules:[{
                  required:true,
                  message:"请填写项目名称",
                }]
              })(
                <Input placeholder="请输入项目名称" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="项目类型"
            >
              {getFieldDecorator('projectType',{
                initialValue: id && projectDetail.projectType || '维修项目',
                rules:[{
                  required:true,
                  message:"请选择项目类型",
                }]
              })(
                <Select>
                    <Option value="维修项目">维修项目</Option>
                    <Option value="巡检项目">巡检项目</Option>
                    <Option value="其他项目">其他项目</Option>
                </Select>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="开始时间"
            >
              {getFieldDecorator('startTime',{
                initialValue: id && moment(projectDetail.startTime),
                rules:[{
                  required:true,
                  message:"请选择开始时间",
                }]
              })(
                <DatePicker
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择开始时间"
              />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="结束时间"
            >
              {getFieldDecorator('endTime',{
                initialValue: id && moment(projectDetail.endTime),
                rules:[{
                  required:true,
                  message:"请选择结束时间",
                }]
              })(
                <DatePicker
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择结束时间"
              />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户公司编号"
            >
              {getFieldDecorator('partyAId',{
                initialValue: id && projectDetail.partyAId || contractDetail.partyAId,
                rules:[{
                  required:true,
                  message:"请输入用户方ID",
                }]
              })(
                <Input placeholder="请输入用户方ID" disabled='true'/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户公司名称"
            >
              {getFieldDecorator('partyAName',{
                initialValue: id && projectDetail.partyAName || contractDetail.partyAName,
                rules:[{
                  required:true,
                  message:"请输入用户方名称",
                }]
              })(
                <Input placeholder="请输入用户方名称" disabled='true'/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方项目负责人（关联选择）"
            >
              {getFieldDecorator('aleaderName',{
                initialValue: id && projectDetail.aleaderName,
                rules:[{
                  required:true,
                  message:"请选择用户方负责人",
                }]
              })(
                <Select style={{ width: '100%' }} 
                placeholder="请选择用户方负责人" 
                onSelect={this.handlePartyAMSelect} 
                onDeselect={this.handlePartyAMDelete}>
                  {ALeaderList.map(item => (
                    <Option key={item.userId}>{item.userName}</Option>
                  ))}
                </Select>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方项目负责人id"
            >
              {getFieldDecorator('aleaderId',{
                initialValue: id && projectDetail.aleaderId,
                rules:[{
                  required:true,
                  message:"请输入用户方项目负责人id",
                }]
              })(
                <Input placeholder="请输入用户方项目负责人id" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方项目负责人电话"
            >
              {getFieldDecorator('aleaderTel',{
                initialValue: id && projectDetail.aleaderTel,
                rules:[{
                  required:true,
                  message:"请输入用户方项目负责人电话",
                }]
              })(
                <Input placeholder="请输入用户方项目负责人电话" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方联系人1（关联选择）"
            >
              {getFieldDecorator('aoneName',{
                initialValue: id && projectDetail.aoneName,
                rules:[{
                  required:true,
                  message:"请选择用户方联系人1",
                }]
              })(
                <Select style={{ width: '100%' }} placeholder="请选择用户方联系人1" onSelect={this.handlePartyA1Select} onDeselect={this.handlePartyA1Delete}>
                  {AUserList.map(item => (
                    <Option key={item.userId}>{item.userName}</Option>
                  ))}
                </Select>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方联系人1联系方式"
            >
              {getFieldDecorator('partyAOne',{
                initialValue: id && projectDetail.partyAOne,
                rules:[{
                  required:true,
                  message:"请输入用户方联系人1联系方式",
                }]
              })(
                <Input placeholder="请输入用户方联系人1联系方式" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方联系人2（关联选择）"
            >
              {getFieldDecorator('atwoName',{
                initialValue: id && projectDetail.atwoName,
                rules:[{
                  required:false,
                  message:"请选择用户方联系人2",
                }]
              })(
                <Select style={{ width: '100%' }} placeholder="请选择用户方联系人2" onSelect={this.handlePartyA2Select} onDeselect={this.handlePartyA2Delete}>
                  {AUserList.map(item => (
                    <Option key={item.userId}>{item.userName}</Option>
                  ))}
                </Select>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方联系人2联系方式"
            >
              {getFieldDecorator('partyATwo',{
                initialValue: id && projectDetail.partyATwo,
                rules:[{
                  required:false,
                  message:"请输入用户方联系人2联系方式",
                }]
              })(
                <Input placeholder="请输入用户方联系人2联系方式" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方联系人3（自行输入）"
            >
              {getFieldDecorator('athreeName',{
                initialValue: id && projectDetail.athreeName,
                rules:[{
                  required:false,
                  message:"请输入用户方联系人3",
                }]
              })(
                <Input placeholder="请输入用户方联系人3联系方式" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="用户方联系人3联系方式"
            >
              {getFieldDecorator('partyAThree',{
                initialValue: id && projectDetail.partyAThree,
                rules:[{
                  required:false,
                  message:"请输入用户方联系人3联系方式",
                }]
              })(
                <Input placeholder="请输入用户方联系人3联系方式" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务商公司编号"
            >
              {getFieldDecorator('partyBId',{
                initialValue: id && projectDetail.partyBId || contractDetail.partyBId,
                rules:[{
                  required:true,
                  message:"请输入服务方ID",
                }]
              })(
                <Input placeholder="请输入服务方ID" disabled='true'/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务商公司名称"
            >
              {getFieldDecorator('partyBName',{
                initialValue: id && projectDetail.partyBName || contractDetail.partyBName,
                rules:[{
                  required:true,
                  message:"请输入服务方名称",
                }]
              })(
                <Input placeholder="请输入服务方名称" disabled='true'/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务方项目负责人（关联选择）"
            >
              {getFieldDecorator('bleaderName',{
                initialValue: id && projectDetail.bleaderName,
                rules:[{
                  required:true,
                  message:"请选择服务方项目负责人",
                }]
              })(
                <Select style={{ width: '100%' }} placeholder="请选择服务方项目负责人" onSelect={this.handlePartyBSelect} onDeselect={this.handlePartyBDelete}>
                  {BLeaderList.map(item => (
                    <Option key={item.userId}>{item.userName}</Option>
                  ))}
                </Select>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务方项目负责人ID"
            >
              {getFieldDecorator('bleaderId',{
                initialValue: id && projectDetail.bleaderId,
                rules:[{
                  required:true,
                  message:"请输入服务方项目负责人ID",
                }]
              })(
                <Input placeholder="请输入服务方项目负责人ID" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务方项目负责人电话"
            >
              {getFieldDecorator('bleaderTel',{
                initialValue: id && projectDetail.bleaderTel,
                rules:[{
                  required:true,
                  message:"请输入服务方项目负责人电话",
                }]
              })(
                <Input placeholder="请输入服务方项目负责人电话" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务方24小时移动电话"
            >
              {getFieldDecorator('partyBPhone',{
                initialValue: id && projectDetail.partyBPhone,
                rules:[{
                  required:false,
                  message:"请输入服务方24小时移动电话",
                }]
              })(
                <Input placeholder="请输入服务方24小时移动电话" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务方24小时值班电话"
            >
              {getFieldDecorator('partyBTel',{
                initialValue: id && projectDetail.partyBTel,
                rules:[{
                  required:false,
                  message:"请输入服务方24小时值班电话",
                }]
              })(
                <Input placeholder="请输入服务方24小时值班电话" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务方24小时开通邮箱"
            >
              {getFieldDecorator('partyBEmail',{
                initialValue: id && projectDetail.partyBEmail,
                rules:[{
                  required:false,
                  message:"请输入服务方24小时开通邮箱",
                }]
              })(
                <Input onChange={this.handleEmail.bind(this)} placeholder="请输入服务方24小时开通邮箱" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="是否签署合同"
            >
              {getFieldDecorator('isContract',{
                initialValue: projectDetail.isContract || 1,
                rules:[{
                  required:true,
                  message:"请选择是否签署合同",
                }]
              })(
                // <Input placeholder="请输入是否签署合同" />
                <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="关联的合同编号"
            >
              {getFieldDecorator('contractId',{
                initialValue: id && projectDetail.contractId || contractDetail.id,
                rules:[{
                  required:false,
                  message:"请输入合同ID",
                }]
              })(
                <Input placeholder="请输入合同ID" disabled='true'/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="关联的合同名称"
            >
              {getFieldDecorator('contractName',{
                initialValue: id && projectDetail.contractName || contractDetail.contractName,
                rules:[{
                  required:false,
                  message:"请输入合同名称",
                }]
              })(
                <Input placeholder="请输入合同名称" disabled='true'/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="项目是否作废"
            >
              {getFieldDecorator('isDestroy',{
                initialValue: projectDetail.isDestroy || 0,
                rules:[{
                  required:true,
                  message:"请选择项目是否作废",
                }]
              })(
              // <Input placeholder="请输入项目是否作废" />
              <Radio.Group>
                <Radio value={0}>有效</Radio>
                <Radio value={1}>作废</Radio>
              </Radio.Group>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="描述"
            >
              {getFieldDecorator('description',{
                initialValue: id && projectDetail.description,
                rules:[{
                  required:false,
                  message:"请输入描述",
                }]
              })(
                <Input placeholder="请输入描述" />
              )}  
            </Form.Item>
            <section className="operator-container">
              <div style={{textAlign:"center"}}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="default"
                >{id ? '编辑' : '新建'}
                </Button>
                <Button
                  style={{marginLeft:"28px"}}
                  size="default"
                  onClick={() => {
                    this.props.backToTable(contractDetail.id);
                  }}
                >取消
                </Button>
              </div>
            </section>
          </Form>
        </div>
            </div>
        )
    }
}
export default Form.create()(ProjectNew);