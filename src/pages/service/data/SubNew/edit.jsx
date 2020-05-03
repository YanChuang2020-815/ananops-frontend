import React,{Component,} from 'react'
import { Form,Input,Select,Button,message,DatePicker,Tooltip,Icon,Upload } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
import AMap from 'AMap'
import  './index.styl'
let marker
class SubNew extends Component{
  constructor(props){
    super(props)
    this.state={
      itemDetail:{},
      subDetail:{},
      token:window.localStorage.getItem('token'),
      userId:JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.userId,
      troubleInfo:{},
      point:[],
      mapVisible:false
     
    }
    this.getTroubleList=this.getTroubleList.bind(this)
    this.getItemDetailByItemId=this.getItemDetailByItemId.bind(this);
  }
  componentWillMount(){
    marker=0
  }
  componentDidMount(){ 
    const { match : { params : { id,subId} }
    } = this.props    

    this.getTroubleList()
    this.getItemDetailByItemId(subId);
    
  }

    //获取子项信息
    getItemDetailByItemId=(itemId)=>{
      axios({        
        method: 'GET',
        url: '/mdmc/mdmcItem/getItemByItemId?itemId='+itemId,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){
            console.log(res.data.result)
            this.setState({
              itemDetail:res.data.result,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }




    //获取故障信息
    getTroubleList=()=>{
      axios({
        method: 'GET',
        url: '/mdc/dictItem/getSysDictItemList',
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){              
            this.setState({
              troubleInfo:res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    // 获取紧急程度的list
    getEmergencyLevel=()=>{
      const {troubleInfo}=this.state
      var emergencyList=troubleInfo.emergencyLevelList
      var item=emergencyList&&emergencyList.map((item,index) => (
        <Select.Option key={index} value={item.code}> 
          {item.name}
        </Select.Option>
      ))
      return item
    }


    // 获取故障类型的list
    getTroubleType=()=>{
      const {troubleInfo}=this.state
      var typeList=troubleInfo.troubleTypeList
      var item=typeList&&typeList.map((item,index) => (
        <Select.Option key={index} value={item.name}> 
          {item.name}
        </Select.Option>
      ))
      return item
    }

    //获取故障地址
    getTroubleAddress=()=>{
      const {troubleInfo}=this.state
      var address=troubleInfo.troubleAddressList
      var item=address&&address.map((item,index) => (
        <Select.Option key={index} value={item.name}> 
          {item.name}
        </Select.Option>
      ))
      return item
    }

    //获取设备类型
    getDeviceType=()=>{
      const {troubleInfo}=this.state
      var deviceType=troubleInfo.deviceTypeList
      var item=deviceType&&deviceType.map((item,index) => (
        <Select.Option key={index} value={item.name}> 
          {item.name}
        </Select.Option>
      ))
      return item
    }

    //设定经纬度
    selectTroubleAddress=(e)=>{
      const {subDetail,troubleInfo}=this.state
      var info=subDetail        
      info.troubleAddress=troubleInfo.troubleAddressList[e].name
      console.log(info.troubleAddress)
      info.deviceLatitude=troubleInfo.troubleAddressList[e].longitude
      info.deviceLongitude=troubleInfo.troubleAddressList[e].latitude
      console.log(info)
      this.setState({
        subDetail:info,
        position:[info.deviceLatitude,info.deviceLongitude],
        mapVisible: false,
      })
    }
    handleSubmit = (e) => {
      e.preventDefault()
      const {
        form,
        history,
        match : { params : {id,subId } },
      } = this.props
      const {troubleInfo}=this.state
      const { getFieldValue } = form;
      const values = form.getFieldsValue()
      if(!getFieldValue('level')){
        message.error('请填写紧急程度')
        return;
      } 
  
      if(getFieldValue('level')==='不紧急'){
        values.level=1
      }else if(getFieldValue('level')==='一般'){
        values.level=2
      }else if(getFieldValue('level')==='紧急'){
        values.level=3
      }else if(getFieldValue('level')==='非常紧急'){
        values.level=4
      }else
      {
        values.level=getFieldValue('level')
      }
      
      if(!getFieldValue('troubleType')){
        message.error('请输入故障类型')
        return;
      } 
      if(!getFieldValue('deviceId')){
        message.error('请输入设备编码')
        return;
      }
      if(!getFieldValue('deviceName')){
        message.error('请输入设备名称')
        return;
      }
      if(!getFieldValue('description')){
        message.error('请输入描述')
        return;
      }
      console.log(getFieldValue('level'))
      values.id=subId
      values.taskId=id   
      var index=getFieldValue('troubleAddress')
      values.deviceLatitude=this.state.point[0]
      values.deviceLongitude=this.state.point[1]
      axios({
        method: 'POST',
        url: '/mdmc/mdmcItem/save',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:values
      })
        .then((res) => {
          if(res && res.status === 200){     
            history.push(`/cbd/service/sub/${id}`)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    showMapModal = () => {
      this.setState({
        mapVisible: true,
      });
      let count=0
      console.log(count++)
      const {position}=this.state
      let mapInfo=[116.397428, 39.90923]
      if(position&&position[0]&&position[1])
        mapInfo=[position[0],position[1]]
      var map = new AMap.Map('routeMap', {
        zoom:13,
        center: mapInfo,//中心点坐标
      });
      if(position && position[0]!==null&&position[1]!==null){
        var marker = new AMap.Marker({
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: position
        });
        map.add(marker);
      }
     
    }
    //关地图
    closeMapModal = e => {
      console.log(e);
      this.setState({
        mapVisible: false,
      });
    };
    render(){
      
      const createFormItemLayout = {
        labelCol: {span:8},
        wrapperCol : {span:8},
      }
      const { 
        form: { getFieldDecorator }, 
        match : { params : { id,subId} }
      } = this.props
      const { subDetail } = this.state
      const {itemDetail} =this.state
      console.log("pppppppppppppp"+itemDetail.deviceType);

      return(
        <div>
          <div className="inpection-plan-create-page">
                
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                {...createFormItemLayout}
                label="紧急程度"
              >
                {getFieldDecorator('level',{
                  initialValue:  itemDetail.level===1?'不紧急':(itemDetail.level===2?'一般':(itemDetail.level===3?'紧急':'非常紧急')),
                  rules:[{
                    required:true,
                    message:"请选择紧急程度",
                  }]
                })(
                  <Select
                    placeholder="请选择紧急程度"
                    className="inspection-log-abnormal-select"
                    //  onChange={(value) => { this.selectTroubleType(value) }}
                    allowClear
                  >
                    {this.getEmergencyLevel()}
                  </Select>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="故障类型"
              >
                {getFieldDecorator('troubleType',{
                  initialValue: itemDetail.troubleType,
                  rules:[{
                    required:true,
                    message:"请选择故障类型",
                  }]
                })(
                  <Select
                    placeholder="请选择故障类型"
                    className="inspection-log-abnormal-select"
                    //  onChange={(value) => { this.selectTroubleType(value) }}
                    allowClear
                  >
                    {this.getTroubleType()}
                  </Select>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="设备类型"
              >
                {getFieldDecorator('deviceType',{
                  initialValue: itemDetail.deviceType,
                  rules:[{
                    required:true,
                    message:"请选择设备类型",
                  }]
                })(
                  <Select
                    placeholder="请选择设备类型"
                    className="inspection-log-abnormal-select"
                    // onChange={(key) => { this.selectTroubleAddress(key) }}
                    allowClear
                  >
                    {this.getDeviceType()}
                  </Select>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="故障地址"
              >
                {getFieldDecorator('troubleAddress',{
                  initialValue: itemDetail.troubleAddress,
                  rules:[{
                    required:true,
                    message:"请输入故障地址",
                  }]
                })(
                  <Select
                    placeholder="请选择故障地址"
                    className="inspection-log-abnormal-select"
                    // onChange={(key) => { this.selectTroubleAddress(key) }}
                  >
                    {this.getTroubleAddress()}
                  </Select>
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="设备编码"
              >
                {getFieldDecorator('deviceId',{
                  initialValue: itemDetail.deviceId,
                  rules:[{
                    required:true,
                    message:"请填写设备编码",
                  }]
                })(
                  <Input placeholder="请输入设备编码" />
                )}  
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="设备名称"
              >
                {getFieldDecorator('deviceName',{
                  initialValue: itemDetail.deviceName,
                  rules:[{
                    required:true,
                    message:"请填写设备名称",
                  }]
                })(
                  <Input placeholder="请输入设备名称" />
                )}  
              </Form.Item>
              <div className='map-container'>
                  地图查看：<Button onClick={this.showMapModal}>故障位置</Button>
                <div className="path-map" style={{ display: (this.state.mapVisible === true) ? "" : "none" }} >
                  <Icon className="path-map-icon" type="close-circle" onClick={this.closeMapModal} /> 
                  <div style={{ width: '400px', height: '250px' }} id="routeMap"></div>
                </div>
              </div>   
              <Form.Item
                {...createFormItemLayout}
                label="故障描述"
              >
                {getFieldDecorator('description',{
                  initialValue: itemDetail.description,
                  rules:[{
                    required:true,
                    message:"请输入描述",
                  }]
                })(
                  <Input.TextArea auto={{minRows: 4, maxRows: 6}} placeholder="请输入描述" />
                )}  
              </Form.Item>   

              <section className="operator-container">
                <div style={{textAlign:"center"}}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="default"
                  >{subId ? '编辑' : '新建'}
                  </Button>
                  <Button
                    style={{marginLeft:"28px"}}
                    size="default"
                    onClick={()=> {
                      const {
                        history,
                      } = this.props
                      history.push(`/cbd/service/sub/${id}`)
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
export default Form.create()(SubNew)