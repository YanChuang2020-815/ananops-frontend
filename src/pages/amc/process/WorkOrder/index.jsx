import React, { Component, } from 'react';
import { Form,Input,Select,Button,message,DatePicker,Tooltip,Icon,Upload } from 'antd';
import { Link } from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/zh-cn';
import AMap from 'AMap'
import  './index.styl'
const token=window.localStorage.getItem('token')
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
            alarmDetail: {},
            userList:[],
        }
        // this.createBill=this.createBill.bind(this)
        // this.getAlarmDetailById = this.getAlarmDetailById.bind(this);
        this.getProject=this.getProject.bind(this)
    }
    componentWillUnmount() {
        marker = 0
    }
    componentDidMount(){
        const {
            match: {params: {alarmId}}
        } = this.props
        this.getAlarmDetailById(alarmId);
        this.initMapPoint()
        this.setState({id:id})
        this.getProject()
    }
    //获取告警信息
    getAlarmDetailById=(id)=>{
        if (id) {
            axios({
                method: 'POST',
                url: '/amc/alarm/getAlarmById/' + id,
                headers: {
                    'deviceId': this.deviceId,
                    'Authorization': 'Bearer ' + token,
                },
            })
                .then((res) => {
                    console.info("res: "+res);
                    if (res && res.status === 200) {
                        console.log(res.data.result)
                        this.setState({
                            alarmDetail: res.data.result
                        })
                        this.getUserList(res.data.result.groupId)

                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    //获取组织的值机员列表
    getUserList(groupId){
        console.info("groupId: "+groupId)
        if (groupId) {
            axios({
                method: 'POST',
                url: '/uac/group/getBindUser/' + groupId,
                headers: {
                    'deviceId': this.deviceId,
                    'Authorization': 'Bearer ' + token,
                },
            })
                .then((res) => {
                    if (res && res.status === 200) {
                        console.log(res.data.result)
                        this.setState({
                            userList: res.data.result.allUserSet
                        })

                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    //初始化Select选择器
    getUserListOptions=()=>{
        const {userList}=this.state
        var useritem=userList&&userList.map((item, index) => (
            <Select.Option key={index} value={item.mobileNo}>
                {item.userName}
            </Select.Option>
        ))
        return useritem
    }
    //onChange函数
    selectUserOnChange=(value)=>{
        let info = {};
        info.call = value;
        this.setState({
            orderDetail: info
        })

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
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    //如果用户是用户负责人
    getProjectListByGroup=()=>{
        const {groupId}=this.state
        axios({
            method: 'POST',
            url: '/pmc/project/getProjectListByGroupId/'+groupId,
            headers: {
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
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
        }
        if(!getFieldValue('userId')){
            message.error('请选择值机员')
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
        values.scheduledStartTime=getFieldValue('scheduledStartTime').format('YYYY-MM-DD HH:mm:ss')
        values.scheduledFinishTime=getFieldValue('scheduledFinishTime').format('YYYY-MM-DD HH:mm:ss')
        values.requestLatitude=this.state.point[0]
        values.requestLongitude=this.state.point[1]
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
                    history.push('/cbd/amc/process')
                    this.createBill(res.data.result)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    createBill=(data)=>{
        var values={}
        values.workorderid=data.id
        values.userid=data.userId
        values.supplier=data.facilitatorId
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
    //

    //根据所选项目，获取其用户值机员
    getUserInfo=(value)=>{
        axios({
            method: 'GET',
            url: '/uac/user/getSubordinateUserList/'+value,
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
        values.userid=this.state.id
        values.supplier=this.state.idConvertName.facilitatorId
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
                    var convert={}
                    info.principalId=res.data.result.aleaderId
                    info.facilitatorId=res.data.result.bleaderId
                    this.principleConvert(info.principalId)
                    this.providerConvert(info.facilitatorId)
                    this.setState({
                        idConvertName:info
                    })

                    this.getUserInfo(info.principalId);
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
    getUser=()=>{
        const {user}=this.state
        var useritem=user&&user.map((item, index) => (
            <Select.Option key={index} value={item.loginName}>
                {item.userName}
            </Select.Option>
        ))
        return useritem
    }
    selectUser=(value)=>{
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
            fileType: 'png',
            bucketName: 'ananops',
            filePath: 'maintainOrder'
        };
    };

    fileUpload() {
        return {
            fileType: 'png',
            bucketName: 'ananops',
            filePath: 'maintainOrder'
        };
    };
    initMapPoint=()=>{
        this.map = new AMap.Map('container', {
            zoom:13,
            center: [116.397428, 39.90923],//中心点坐标
        });
        //监听双击事件
        this.map.on('click', (e) => {
            console.log(`您点击了地图的[${e.lnglat.getLng()},${e.lnglat.getLat()}]`)
            var position=[e.lnglat.getLng(),e.lnglat.getLat()]
            this.setState({ point: position })
            if (marker) {
                marker.setPosition(position)
            }
            else{
                marker = new AMap.Marker({
                    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position: position
                });
                marker.setMap(this.map);
            }
        })
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
        const { orderDetail } = this.state
        var deviceId=new Date().getTime()
        const uploadProps = {
            name: 'file',
            action: '/mdmc/mdmcTask/uploadTaskPicture',
            headers: {
                authorization: 'Bearer ' + this.state.token,
                'deviceId': deviceId,
            },
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
                                message:"请选择项目",
                            }]
                        })(
                            <Select
                                placeholder="请选择项目"
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
                        label="审核人编号"
                    >
                        {getFieldDecorator('principalId',{
                            initialValue:orderDetail.principalId,
                            rules:[{
                                required:false,
                                message:"请选择审核人名称",
                            }]
                        })(
                            <Input placeholder="请选择审核人名称" disabled='true'/>,
                        )}
                    </Form.Item>
                    <Form.Item
                        {...createFormItemLayout}
                        label="服务商编号"
                    >
                        {getFieldDecorator('facilitatorId',{
                            initialValue: orderDetail.facilitatorId,
                            rules:[{
                                required:false,
                                message:"请输入服务商名称",
                            }]
                        })(
                            <Input placeholder="请输入服务商名称" disabled='true'/>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...createFormItemLayout}
                        label="值机员姓名"
                    >
                        {getFieldDecorator('userId',{
                            initialValue:orderDetail.userId,
                            rules:[{
                                required:false,
                                message:"请输入值机员姓名",
                            }]
                        })(
                            <Select
                                placeholder="请选择值机员姓名"
                                className="inspection-log-abnormal-select"
                                onChange={(value) => { this.selectUserOnChange(value) }}
                                allowClear
                            >
                                {this.getUserListOptions()}
                            </Select>
                        )}
                    </Form.Item>
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
                        label="计划开始时间"
                    >
                        {getFieldDecorator('scheduledStartTime',{
                            initialValue: id && moment(orderDetail.scheduledStartTime),
                            rules:[{
                                required:true,
                                message:"请选择计划开始时间",
                            }]
                        })(
                            <DatePicker
                                locale={locale}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="请选择计划开始时间"
                                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...createFormItemLayout}
                        label="计划完成时间"
                    >
                        {getFieldDecorator('scheduledFinishTime',{
                            initialValue: id && moment(orderDetail.scheduledFinishTime),
                            rules:[{
                                required:true,
                                message:"请选择计划完成时间",
                            }]
                        })(
                            <DatePicker
                                locale={locale}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="请选择计划完成时间"
                                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        {...createFormItemLayout}
                        label="紧急程度"
                    >
                        {getFieldDecorator('level',{
                            initialValue: id && moment(orderDetail.level),
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
                                <Select.Option value='0'>
                                    一般
                                </Select.Option>
                                <Select.Option value='1'>
                                    紧急
                                </Select.Option>
                                <Select.Option value='2'>
                                    非常紧急
                                </Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                    {/* <Form.Item
                {...createFormItemLayout}
                label="紧急程度"
                >
                {getFieldDecorator('level',{
                    initialValue: id && moment(orderDetail.level),
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
                            <Select.Option value='0'>
                                一般
                            </Select.Option>
                            <Select.Option value='1'>
                                紧急
                            </Select.Option>
                            <Select.Option value='2'>
                                非常紧急
                            </Select.Option>
                        </Select>
                )}
                </Form.Item>
                {/* <Form.Item
                {...createFormItemLayout}
                label="地址"
                >
                {getFieldDecorator('addressName',{
                    initialValue: id && orderDetail.addressName,
                    rules:[{
                    required:true,
                    message:"请输入地址",
                    }]
                })(
                    <Input placeholder="请输入地址" />
                )}
                </Form.Item> */}
                    <Form.Item
                        {...createFormItemLayout}
                        label="总花费"
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
                        label="上传"
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
                        <div className='maintain-map-word'>位置：</div>
                        <div className='maintainer-map-description' id="container"></div>
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
                                    history.push('/cbd/amc/process')
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