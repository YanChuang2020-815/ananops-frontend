import React, { Component, } from 'react';
import { Form,Input,Select,Button,message,DatePicker,Tooltip,Icon,Upload } from 'antd';
import { Link } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/zh-cn';
import AMap from 'AMap'
import  './index.styl'
const id=window.localStorage.getItem('id')
let marker
//let project=[]
let name=''
class OrderNew extends Component{
    constructor(props){
        super(props)
        this.state={
            orderDetail:{},
            id:'',
            project:[],
            user:[],
            parentGroupId:'',
            token:window.localStorage.getItem('token'),
            groupId:JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId,
            roleCode:window.localStorage.getItem('roleCode'),
            idConvertName:{},
            point:[],
            troubleInfo:{},
            address:'',
            fileType:'',
        }
        // this.createBill=this.createBill.bind(this)
        this.getProject=this.getProject.bind(this)
    }
    componentWillUnmount() {
      marker = 0
    }
    componentDidMount(){
        this.initMapPoint();      
        this.setState({id:id});
        this.getProject(); 
        this.getTroubleList();
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
    getProject=()=>{
      const {roleCode}=this.state
      if(roleCode==='user_watcher'){
        this.getProjectListByUser()
      }
      else this.getProjectListByGroup()
        
      // const {groupId}=this.state
      // axios({
      //     method: 'POST',
      //     url: '/pmc/project/getProjectListByGroupId/'+groupId,
      //     headers: {
      //       'deviceId': this.deviceId,
      //       'Authorization':'Bearer '+this.state.token,
      //     },
      // })
      // .then((res) => {
      //     if(res && res.status === 200){  
      //        console.log(res.data.result)                 
      //        this.setState({
      //            project:res.data.result
      //        })
      //     }
      // })
      // .catch(function (error) {
      //       console.log(error);
      // });
    }
    //如果用户是user
    getProjectListByUser=()=>{
      let username=JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.loginName
      console.log(typeof(username))
      axios({
        method: 'GET',
        url: '/uac/user/getPGIdByUserId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){  
            console.log(res.data.result)                 
            this.setState({
              groupId:res.data.result
            })
            this.getProjectListByGroup()
            this.state.roleCode&&this.state.roleCode==='user_watcher'&&this.selectUser(username)   
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    //如果用户是用户负责人
    getProjectListByGroup=()=>{
      const {groupId}=this.state;
      const values = {groupId: groupId, projectType: "维修项目"}
      axios({
        method: 'POST',
        url: '/pmc/project/getProjectList',
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:values
      })
        .then((res) => {
          if(res && res.status === 200){  
            console.log(res.data.result)                 
            this.setState({
              project:res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    beforeUpload = (file) => {
      var fileName = file.name;
      var type = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length);
      if (type != null) {
        this.setState({
          fileType: type,
        });
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
          message.error('图片大于5MB!');
      }
      return isLt5M;
    }

    //提交
    handleSubmit = (e) => {
        e.preventDefault()
        const {
            form,
            history,
            match : { params : {id } },
        } = this.props
        const { getFieldValue } = form;
        const values = form.getFieldsValue()
        console.log(values)
        if (values.attachmentIdList != undefined) {
            var fileList = values.attachmentIdList.fileList;
            console.log(fileList)
            values.attachmentIdList = this.getAttachments(fileList);
        }
        if(!getFieldValue('title')){
            message.error('请输入维修任务名称')
            return;
        }
        if(this.state.roleCode&&this.state.roleCode!=='user_watcher'&&!getFieldValue('userId')){
            message.error('请选择值机员')
            return;
        }
        if(!getFieldValue('projectId')){
            message.error('请选择维修项目')
            return;
        }
        if(!getFieldValue('facilitatorId')){
            message.error('服务商名称')
            return;
        }
        if(!getFieldValue('call')){
            message.error('请输入值机员电话')
            return;
        }
        if(!getFieldValue('appointTime')){
            message.error('请选择预约时间')
            return;
        }
        if(!getFieldValue('deadline')){
            message.error('请选择最晚维修时间')
            return;
        }
        if(!getFieldValue('level')){
            message.error('请选择紧急程度')
            return;
        }
        if(!getFieldValue('troubleType')){
            message.error('请选择故障类型')
            return;
        } 
        if(!getFieldValue('deviceType')){
          message.error('请选择设备类型')
          return;
        }
        if(!getFieldValue('troubleAddress')){
          message.error('请选择故障地址')
          return;
        }
        if(!getFieldValue('description')){
          message.error('请输入描述')
          return;
        }

        if(!id){
            values.id=null
            values.userId=this.state.id
        }
     //   values.mdmcAddTaskItemDtoList=[{id:null}]
        values.principalId=this.state.idConvertName.principalId
        values.facilitatorId=this.state.idConvertName.facilitatorId
        values.appointTime=getFieldValue('appointTime').format('YYYY-MM-DD HH:mm:ss')
        values.deadline=getFieldValue('deadline').format('YYYY-MM-DD HH:mm:ss')
        values.requestLatitude=this.state.point[0]
        values.requestLongitude=this.state.point[1]
        values.addressName=this.state.address
        const mdmcAddTaskItemDtoList = {};
        mdmcAddTaskItemDtoList.deviceType=values.deviceType;
        mdmcAddTaskItemDtoList.level=values.level;
        mdmcAddTaskItemDtoList.troubleType=values.troubleType;
        mdmcAddTaskItemDtoList.troubleAddress=values.troubleAddress;
        mdmcAddTaskItemDtoList.description=values.description;
        values.mdmcAddTaskItemDtoList=[mdmcAddTaskItemDtoList];
        values.userId=(this.state.roleCode&&this.state.roleCode==='user_watcher')?window.localStorage.getItem('id'):this.state.orderDetail.userId
        console.log(values)
        axios({
            method: 'POST',
            url: '/mdmc/mdmcTask/save',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
            data:JSON.stringify(values)
            })
        .then((res) => {
          if(res && res.status === 200){  
            console.log(res.data.result.id)
            // var id=res.data.result.id
            // this.changeStatus(id,2,'维修申请提交后，进入审核')   
            history.push('/cbd/maintain/data')
            this.createBill(res.data.result)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    createBill=(data)=>{
      var values={}
      values.workOrderId=data.id
      values.userId=id
      values.supplier=data.facilitatorId
      values.projectId=this.state.idConvertName.projectId
      // values.userid='2'
      // values.supplier='4'
      values.state="创建中"
      axios({
        method: 'POST',
        url: '/bill/bill/create',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:values
      })
        .then((res) => {
          if(res && res.status === 200){  
            console.log(res.data)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }
    //获取文件
    getAttachments(fileList) {
        console.log(fileList)
        var res = [];
        var size = fileList.length;
        for (var i=0; i<size; i++) {
          var attachmentId = fileList[i].response[0].attachmentId;
          res.push(attachmentId);
        }
        return res;
      }
    //获取项目名
    getOption=()=>{
      const {project}=this.state
      var projectitem=project&&project.map((item, index) => (
        <Select.Option key={index} value={item.id}> 
          {item.projectName}
        </Select.Option>
      ))
      return projectitem
    }
    //根据所选项目，获取其用户值机员
    getUserInfo=(value)=>{
      axios({
        method: 'GET',
        url: '/mdmc/mdmcTask/getUserList/?userId='+value,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){  
            this.setState({
              user:res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });       
    }
    //根据所选项目，预生成金额
    getMoney=()=>{
      let values={}
      values.userId=id
      values.supplier=this.state.idConvertName.facilitatorId
      values.projectId=this.state.idConvertName.projectId
      // values.supplier='4'
      // values.userid='2'
      axios({
        method: 'POST',
        url: '/bill/bill/createFakeOrder',
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:values
      })
        .then((res) => {
          if(res && res.status === 200){  
            var info=this.state.orderDetail               
            info.totalCost=res.data.result
            this.setState({
              orderDetail:info
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });     
    }
    //选择项目
    selectProject=(value)=>{
       const {user,idConvertName}=this.state
       axios({
        method: 'POST',
        url: '/pmc/project/getById/'+value,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){  
            var info={}
            var {orderDetail,roleCode}=this.state
            info.principalId=res.data.result.aleaderId 
            info.facilitatorId=res.data.result.bleaderId
            info.projectId=value
            if(info.principalId){
              this.principleConvert(info.principalId)
            }else {
              var infoPrincipal=orderDetail
              infoPrincipal.principalId=null
              this.setState({
                orderDetail:infoPrincipal
              })
            }
            if(info.facilitatorId){
              // this.providerConvert(info.facilitatorId)
              var infoProvider=orderDetail
              infoProvider.facilitatorId=res.data.result.partyBName
              this.setState({
                orderDetail:infoProvider
              })
            }else{
              var infoProvider=orderDetail
              infoProvider.facilitatorId=null
              this.setState({
                orderDetail:infoProvider
              })
            }         
            this.setState({
              idConvertName:info
            })    
           
            roleCode&&roleCode!=='user_watcher'&&this.getUserInfo(info.principalId);
            this.getMoney()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    principleConvert=(id)=>{
      const {orderDetail}=this.state
      var info=orderDetail
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
            info.principalId=res.data.result.userName
            this.setState({
              orderDetail:info
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    providerConvert=(id)=>{
      const {orderDetail}=this.state
      var infoProvider=orderDetail
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
            infoProvider.facilitatorId=res.data.result.userName
            this.setState({
              orderDetail:infoProvider
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      return name
    }
    principleConvert=(id)=>{
        const {orderDetail}=this.state
        var info=orderDetail
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
                    info.principalId=res.data.result.userName
                    this.setState({
                        orderDetail:info
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    getUser=()=>{
      const {user}=this.state
      var useritem=user&&user.map((item, index) => (
        <Select.Option key={index} value={item.userName}> 
          {item.userName}
        </Select.Option>
      ))
      return useritem
    }
    selectUser=(value)=>{
      console.log("userInfo:" + value)
      axios({
        method: 'POST',
        url: '/uac/user/queryUserInfo/'+value,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){  
            var info=this.state.orderDetail
                
            info.userId=res.data.result.id
            info.call=res.data.result.mobileNo 
            console.log(res.data.result.mobileNo)
            this.setState({
              orderDetail:info
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    fileUpload() {
      return {
        fileType: this.state.fileType,
        bucketName: 'ananops',
        filePath: 'maintainOrder'
      };
    };
   
    initMapPoint=()=>{
      var position=[]
      var address=''
        this.map = new AMap.Map('container', {
            zoom:13,
            center: [116.397428, 39.90923],//中心点坐标
          });
          AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],()=>{
            var autoOptions = {
              // 城市，默认全国 
              city: "北京",
              // 使用联想输入的input的id
              input: "input"
            }
            var autocomplete= new AMap.Autocomplete(autoOptions)
          
            var placeSearch = new AMap.PlaceSearch({
              city:'北京',
              map:this.map,
              pageSize: 2,//每页显示多少行
              pageIndex: 1,//显示的下标从那个开始
              panel: "result"//服务显示的面板
            })
            AMap.event.addListener(autocomplete, 'select', function(e){
              //TODO 针对选中的poi实现自己的功能
              placeSearch.search(e.poi.name)
            })
            AMap.event.addListener(placeSearch,'listElementClick',(e)=>{
              position=[e.data.location.lng,e.data.location.lat]
              address=e.data.address
              this.setState({
                point : position,
                address : address
              })
            })
           })
          //  console.log(position)
          //  this.getGeo(position,address)
          //监听双击事件
      //     this.map.on('click', (e) => {
      //       console.log(`您点击了地图的[${e.lnglat.getLng()},${e.lnglat.getLat()}]`)
      //       var position=[e.lnglat.getLng(),e.lnglat.getLat()]
      //       this.setState({ point: position })
      //       if (marker) {
      //           marker.setPosition(position)
      //       }
      //       else{
      //         marker = new AMap.Marker({
      //           icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      //           position: position
      //       });
      //       marker.setMap(this.map);
      //     }
      // })
    }

    // 获取紧急程度的list
    getEmergencyLevel=()=>{
      const {troubleInfo}=this.state
      var emergencyList=troubleInfo.emergencyLevelList
      var item=emergencyList&&emergencyList.map((item, index) => (
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
      var item=typeList&&typeList.map((item, index) => (
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

    render(){

      const createFormItemLayout = {
        labelCol: {span:8},
        wrapperCol : {span:8},
      }
      const { 
        form: { getFieldDecorator }, 
        match : { params : { id } }
      } = this.props
      const { orderDetail,roleCode } = this.state
      var deviceId=new Date().getTime()
      const uploadProps = {
        name: 'file',
        action: '/mdmc/mdmcTask/uploadTaskPicture',
        headers: {
          authorization: 'Bearer ' + this.state.token,
          'deviceId': deviceId,
        },
        beforeUpload: this.beforeUpload,
        data: this.fileUpload,
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            console.log(info.file)
            console.log(`${info.file.name} 上传成功！`)
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
          }
          console.log(info)
        },  
      };
      return(
        <div className="inpection-plan-create-page">
          <Form
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              {...createFormItemLayout}
              label="维修任务名称"
            >
              {getFieldDecorator('title',{
                initialValue: id && orderDetail.title,
                rules:[{
                  required:true,
                  message:"请输入维修任务名称",
                }]
              })(
                <Input placeholder="请输入维修任务名称" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="项目名称"
            >
              {getFieldDecorator('projectId',{
                initialValue: id && orderDetail.projectId,
                rules:[{
                  required:true,
                  message:"请选择维修项目",
                }]
              })(
                <Select
                  placeholder="请选择维修项目"
                  className="inspection-log-abnormal-select"
                  onChange={(value) => { this.selectProject(value) }}
                  allowClear
                >
                  {this.getOption()}
                </Select>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="审核人名称"
            >
              {getFieldDecorator('principalId',{
                initialValue:orderDetail.principalId,
                rules:[{
                  required:true,
                  message:"请选择审核人名称",
                }]
              })(
                <Input placeholder="请选择审核人名称" disabled='true'/>,
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="服务商名称"
            >
              {getFieldDecorator('facilitatorId',{
                initialValue: orderDetail.facilitatorId,
                rules:[{
                  required:true,
                  message:"请输入服务商名称",
                }]
              })(
                <Input placeholder="请输入服务商名称" disabled='true'/>
              )}  
            </Form.Item>
            {roleCode&&roleCode!=='user_watcher'&&(<Form.Item
              {...createFormItemLayout}
              label="值机员姓名"
            >
              {getFieldDecorator('userId',{
                initialValue:orderDetail.userId,
                rules:[{
                  required:true,
                  message:"请输入值机员姓名",
                }]
              })(
                <Select
                  placeholder="请选择值机员姓名"
                  className="inspection-log-abnormal-select"
                  onChange={(value) => { this.selectUser(value) }}
                  allowClear
                >
                  {this.getUser()}
                </Select>
              )}  
            </Form.Item>)}
            <Form.Item
              {...createFormItemLayout}
              label="值机员电话"
            >
              {getFieldDecorator('call',{
                initialValue: orderDetail.call,
                rules:[{
                  required:true,
                  message:"请输入值机员电话",
                }]
              })(
                <Input placeholder="请输入值机员电话"/>
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="预约时间"
            >
              {getFieldDecorator('appointTime',{
                initialValue: id && moment(orderDetail.appointTime),
                rules:[{
                  required:true,
                  message:"请选择预约时间",
                }]
              })(
                <DatePicker
                  locale={locale}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择预约时间"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="最晚维修时间"
            >
              {getFieldDecorator('deadline',{
                initialValue: id && moment(orderDetail.deadline),
                rules:[{
                  required:true,
                  message:"请选择最晚维修时间",
                }]
              })(
                <DatePicker
                  locale={locale}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择最晚维修时间"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />
              )}  
            </Form.Item> 
            <Form.Item
              {...createFormItemLayout}
              label="紧急程度"
            >
              {getFieldDecorator('level',{
                initialValue: id && moment(orderDetail.level) || '1',
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
              label="故障描述"
            >
              {getFieldDecorator('description',{
                rules:[{
                  required:true,
                  message:"请输入描述",
                }]
              })(
                <Input.TextArea auto={{minRows: 4, maxRows: 6}} placeholder="请输入描述" />
              )}  
            </Form.Item>   
            <Form.Item
              {...createFormItemLayout}
              label="预算费用"
            >
              {getFieldDecorator('totalCost',{
                initialValue: orderDetail.totalCost,
                rules:[{
                  required:false,
                  message:"请选择总花费",
                }]
              })(
                <Input placeholder="请输入总花费" />
              )}  
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="故障现场"
            >
              {getFieldDecorator('attachmentIdList')(
                // <div className="inspection-log-upload">
                <Upload  {...uploadProps}>
                  <Tooltip placement="right" title={'支持图片上传'}>
                    <Button><Icon type="upload" />上传图片</Button>
                  </Tooltip>
                </Upload>
                // </div>
              )}
            </Form.Item>
            <div className='maintain-map-container'>
              <div className='maintain-map-word'>地理位置：</div>
              <div className='maintainer-map-description' id="container"></div> 
              <Input id="input" placeholder="请输入地址" />
              <div id="result"></div>
            </div>
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
                  onClick={()=> {
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
        </div>
          
      )
    }
}
export default Form.create()(OrderNew)