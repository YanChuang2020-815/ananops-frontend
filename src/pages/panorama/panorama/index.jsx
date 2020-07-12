import React,{Component} from 'react';
import {Select,Modal} from 'antd';
import Viewer from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';
import './index.styl';
import axios from 'axios';
import arrow from './icons/arrow.gif';
import StompJS from 'stompjs/lib/stomp.js';


const Stomp = StompJS.Stomp;
const userId = window.localStorage.getItem("id");
export default class Panorama extends Component{
    constructor(props){
        super(props)
        this.state={
            token:window.localStorage.getItem('token'),
            viewer:null,
            PSV:null,
            markers:[],
            clickMode:0,//marker的点击模式：0无效，1添加，2删除
            sceneInfo:null,
            visible:false,//添加设备的模态框
            visible2:false,//添加场景的模态框
            deviceList:[],
            curDevice:null,
            curClickInfo:null,
            bindedDeviceList:[

            ],
            deviceDict:[],
            sceneList:[

            ],
            sceneDict:[],
            selectedScene:null,
            arrowList:[],
            arrowDict:[],
            // 全局状态
            connected: false,  // 是否已经建立连接
            // controlled components相关状态
            url: 'wss://www.ananops.com/wss/ws',
            stompSubscribeDestination: '/user/queue/chat',
            curAlarmDevice:null,
        }

    }
    componentDidMount(){
        let {sceneItem} = this.props.history.location.state;
        console.log(sceneItem);
        this.setState({
            sceneInfo:sceneItem,
        })
        this.getAllDevice();
        this.getAllScene(sceneItem);
        let viewer = document.getElementById('viewer');
        let panorama = this;
        let PSV = new Viewer({
            container: viewer,
            panorama: sceneItem.url,
            size: {
                width: '85vw',
                height: '84vh'
            },
            default_fov:179,
            caption:sceneItem.sceneName,
            navbar: [
                'autorotate',
                {
                    id:'addDevice',
                    title:'添加设备',
                    className:'plus-device-button',
                    onClick:function(){
                        panorama.setState({
                            clickMode:1,
                        })
                        alert("请在图中选择添加位置");
                    }
                },
                {
                    id:'addScene',
                    title:'添加场景',
                    className:'add-scene-button',
                    onClick:function(){
                        panorama.setState({
                            clickMode:3,
                        })
                        alert("请在图中选择添加位置");
                    }
                },
                {
                    id:'deleteMarker',
                    title:'删除标记',
                    className:'delete-device-button',
                    onClick:function(){
                        panorama.setState({
                            clickMode:2,
                        })
                        alert("请选择要删除的设备");
                    }
                },
                'caption',
                'fullscreen',
                'markers',
                {
                    id:'goBack',
                    title:'返回',
                    className:'custom-button',
                    content:'返回',
                    onClick:function(){
                        panorama.disconnect()
                        panorama.props.history.push({
                            pathname:'/cbd/panorama/scene',
                        })
                    }
                },
            ],
        });
        this.setState({
            viewer:viewer,
            PSV:PSV,
        })
        console.log(PSV)
        //加载当前场景下的设备
        PSV.on('panorama-load-progress',function(){
            panorama.getBindedDevice(sceneItem,PSV);
            panorama.getBindedArrow(sceneItem,PSV)
        })
        //监听点击场景事件
        PSV.on('click',function(e){
            let e1 = {
                latitude: e.latitude,
                longitude: e.longitude
            }
            let e2 = {
                latitude: 0,
                longitude: 0
            }
            console.log(e1)
            // panorama.gps2d(e1,e2)
            panorama.addMarker(e);
        })
        //监听标记事件
        PSV.on('select-marker',function(e){
            panorama.handleMarkerClick(e);
        })

    
        this.disconnect();
        this.connect(userId);
    }


    /**
     * 关闭连接
     */
    disconnect = () => {
        if (!this.state.connected) {
        console.log(`Not Connected Yet`);
        return;
        }
        try {
        this.client.disconnect();
        console.log('Close Connection Success');
        this.setState({connected: false});
        } catch (e) {
        console.log(`disconnect fail, message = ${e.message}, view chrome console for detail`);
        }
    };

    /**
     * 连接服务端
     */
    connect = (userId) => {
        const that = this;
        try {
        let client = Stomp.over(new WebSocket(this.state.url));

        client.connect({"userId": userId}, () => {
            that.setState({connected: true});
            console.log(`Connect STOMP server success, url = ${that.state.url}, connectHeader = ${userId}`);

            try {
            client.subscribe(this.state.stompSubscribeDestination, this.getSubscribeCallback(this.state.stompSubscribeDestination));
            
            console.log(`subscribe destination ${this.state.stompSubscribeDestination} success`);
            
            } catch (e) {
            console.log(`subscribe destination ${this.state.stompSubscribeDestination} fail, message = ${e.message}`);
            }
            
        }, () => {
            that.setState({connected: false});
            console.log('连接断开，5秒后重新连接');
            window.setTimeout(() => {
            this.connect(userId);
            }, 5000);
        });
        this.client = client;
        } catch (e) {
        console.error('Connect error %o', e);
        console.log(`Connect error, message = ${e.message}, view chrome console for detail`);
        that.setState({connected: false});
        return;
        }
    };
    
    getSubscribeCallback = (destination) =>{
        return content => {
            let{PSV,deviceDict,curAlarmDevice} = this.state;
            if(window.location.href.substr(22)!="cbd/panorama/panorama"){
                this.disconnect();
                return;
            }
            const contentBody = JSON.parse(content.body)
            const msgBody = contentBody.content;
            console.log(contentBody)
            if (contentBody.topic != 'alarm') return
            const position = {
                longitude:this.changeTwoDecimal_f(msgBody.longitude),
                latitude:this.changeTwoDecimal_f(msgBody.latitude)
            }
            
            let cameraPosition = PSV.getPosition();
            cameraPosition.longitude = this.changeTwoDecimal_f(cameraPosition.longitude);
            cameraPosition.latitude = this.changeTwoDecimal_f(cameraPosition.latitude)
            let deviceId = msgBody.deviceId;
            try{
                if(PSV.getMarker(deviceId)!=null){
                    if(position.longitude!=cameraPosition.longitude || position.latitude != cameraPosition.latitude){
                        console.log(position)
                        console.log(cameraPosition)
                        PSV.animate(position,1500)
                    }
                }
            }catch(err){
                return
            }
            
        };
    }

    
    //处理浮点数
     changeTwoDecimal_f = (x)=>{
        var f_x = parseFloat(x);
        if (isNaN(f_x)) {
            alert('function:changeTwoDecimal->parameter error');
            return false;
        }
        var f_x = Math.round(x * 100) / 100;
        var s_x = f_x.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    }
    

    //获取全部的箭头
    getBindedArrow=(sceneItem,PSV)=>{
        axios({
            method: 'GET',
            url: '/rdc/rdcScene/getArrowBySceneId/'+sceneItem.id,
            headers: {
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
          .then((res) => {
            if(res && res.status === 200){
                this.setState({
                    arrowList:res.data.result,
                });
                let arrowDict=[];
                res.data.result.map((value,index)=>{
                    arrowDict[value.id]=value;
                })
                this.setState({
                    arrowDict:arrowDict,
                })
                for(let i=0;i<res.data.result.length;i++){
                    PSV.addMarker({
                        id: res.data.result[i].id,
                        longitude: res.data.result[i].longitude,
                        latitude: res.data.result[i].latitude,
                        image: arrow,
                        width: 40,
                        height: 40,
                        anchor:'bottom center',
                        type:'arrow',
                        tooltip:{
                            content:"前往" + res.data.result[i].sceneName,
                            fontsize:'xx-large',
                        },
                    });
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    //获取全部的场景
    getAllScene=(sceneItem)=>{
        axios({
            method: 'GET',
            url: '/rdc/rdcScene/getAllScene',
            headers: {
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
          .then((res) => {
            if(res && res.status === 200){
                this.setState({
                    sceneList:res.data.result,
                });
                let sceneDict=[];
                res.data.result.map((value,index)=>{
                    if(value.id != sceneItem.id){
                        sceneDict[value.id]=value;
                    }
                })
                this.setState({
                    sceneDict:sceneDict,
                })
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    //获取场景选项
    getSceneOption=()=>{
        let sceneOption;
        let {sceneList,sceneInfo} = this.state;
        console.log(sceneList)
        sceneOption=sceneList&&sceneList.map((item, index) => (
            item.id!=sceneInfo.id&&
            <Select.Option key={item.id} value={item.id}> 
                <div>
                    {item.sceneName}
                </div>
            </Select.Option>
        ));
        return sceneOption;
    }

    handleMarkerClick=(e)=>{
        console.log(e)
        let{PSV,clickMode,deviceDict,arrowDict,sceneDict} = this.state;
        if(clickMode==2){
            //如果是设备删除
            if(deviceDict[e.id]!=undefined){
                this.deleteDevice(e,PSV);
            }else if(arrowDict[e.id]!=undefined){
                this.deleteArrow(e,PSV);
            }
            
            
        }else{
            //如果只是查看
            if(deviceDict[e.id]!=undefined){
                // alert("经度为：" + e.longitude + "\n" + "纬度为：" + e.latitude + "\n" + "类型为：" + e.type);
                // this.computeRadio(deviceDict[e.id],e);
                this.getDeviceData(deviceDict[e.id]);
            }else if(arrowDict[e.id]!=undefined){
                let arrowItem = arrowDict[e.id];
                let sceneItem = {
                    id:arrowItem.sceneId,
                    sceneName:arrowItem.sceneName,
                    url:arrowItem.url,
                }
                console.log(sceneItem);
                this.props.history.push({
                    pathname:'/cbd/panorama/panorama',
                    state:{
                        sceneItem:sceneItem,
                    },
                })
            }
            
        }
    }

    //查看设备最新数据
    getDeviceData=(device)=>{
        console.log(device)
        axios({
            method: 'GET',
            url: '/deviceaccess/data/alllatestdata/' + device.deviceId,
        })
        .then((res) => {
            if(res && res.status === 200){
                let dataList = res.data;
                let content = "设备数据：\n";
                for(let i=0;i<dataList.length;i++){
                    content+="key:" + dataList[i].key + "，value:" + dataList[i].value + "\n";
                }
                alert(content);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    //删除设备
    deleteDevice=(marker,PSV)=>{
        let {sceneInfo} = this.state;
        let value={
            deviceId:marker.id,
            sceneId:sceneInfo.id,
        };
        console.log(value);
        axios({
            method: 'DELETE',
            url: '/rdc/rdcScene/deleteBindedDevice',
            headers: {
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
            data:value
        })
        .then((res) => {
            if(res && res.status === 200){
                PSV.removeMarker(marker);
                this.setState({
                    clickMode:0,
                })
                alert("删除成功！")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    //删除箭头
    deleteArrow=(marker,PSV)=>{
        axios({
            method: 'DELETE',
            url: '/rdc/rdcScene/deleteRdcArrow/'+marker.id,
            headers: {
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
        })
        .then((res) => {
            if(res && res.status === 200){
                PSV.removeMarker(marker);
                this.setState({
                    clickMode:0,
                })
                alert("删除成功！")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    addMarker=(e)=>{
        let{PSV,clickMode} = this.state;
        if(clickMode==1){
            this.setState({
                curClickInfo:e,
                visible:true,
            })
        }else if(clickMode==3){
            this.setState({
                curClickInfo:e,
                visible2:true,
            })
        }
    }


    //获取当前场景下的全部设备
    getBindedDevice=(sceneItem,PSV)=>{
        axios({
            method: 'GET',
            url: '/rdc/rdcScene/getDeviceBySceneId/'+sceneItem.id,
            headers: {
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
        })
        .then((res) => {
            if(res && res.status === 200){
                console.log(res.data.result)
                this.setState({
                    bindedDeviceList:res.data.result,
                })
                for(let i=0;i<res.data.result.length;i++){
                    PSV.addMarker({
                        id: res.data.result[i].deviceId,
                        longitude: res.data.result[i].longitude,
                        latitude: res.data.result[i].latitude,
                        image: res.data.result[i].url,
                        width: 40,
                        height: 40,
                        anchor:'bottom center',
                        type:'device',
                        tooltip:{
                            content:res.data.result[i].name,
                            fontsize:'xx-large',
                        },
                    });
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    //获取全部设备

    getAllDevice=()=>{
        axios({
            method: 'GET',
            url: '/rdc/rdcDevice/getAllDevice',
            headers: {
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
        })
        .then((res) => {
            if(res && res.status === 200){
                console.log(res.data.result)
                this.setState({
                    deviceList:res.data.result,
                })
                let deviceDict=[];
                res.data.result.map((value,index)=>{
                    deviceDict[value.id]=value;
                })
                this.setState({
                    deviceDict:deviceDict,
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    //获取设备选项
    getDeviceOption=()=>{
        let deviceOption;
        let {deviceList} = this.state;
        console.log(deviceList)
        deviceOption=deviceList&&deviceList.map((item, index) => (
            <Select.Option key={item.id} value={item.id}> 
                <div>
                    {item.name}
                    <img src={item.url} className='device-img'></img>
                </div>
            </Select.Option>
        ));
        return deviceOption;
    }

    //处理模态框的取消
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
            visible2: false,
            clickMode: 0,
        });
    };

    handleDeviceSelect=(deviceId)=>{
        let{deviceDict} = this.state;
        this.setState({
            curDevice:deviceDict[deviceId],
        })
    }

    handleSceneSelect=(sceneId)=>{
        let{sceneDict} = this.state;
        console.log(sceneDict)
        console.log(sceneId)
        this.setState({
            selectedScene:sceneDict[sceneId],
        })
    }

    handleSceneBindDevice=()=>{
        let {curDevice,sceneInfo,curClickInfo} = this.state;
        console.log(curDevice);
        console.log(sceneInfo)
        let value={
            deviceId:curDevice.id,
            sceneId:sceneInfo.id,
            longitude:curClickInfo.longitude,
            latitude:curClickInfo.latitude,
        };
        console.log(value)
        console.log(curClickInfo)
        axios({
            method: 'POST',
            url: '/rdc/rdcScene/sceneBindDevice',
            headers: {
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
            data:value
        })
        .then((res) => {
            if(res && res.status === 200){
                console.log(res.data.result)
                alert("设备添加成功")
                this.setState({
                    clickMode:0,
                })
                this.props.history.push({
                    pathname:'/cbd/panorama/panorama',
                    state:{
                        sceneItem:this.state.sceneInfo
                    },
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    handleSceneBindArrow=()=>{
        let {selectedScene,sceneInfo,curClickInfo} = this.state;
        console.log(selectedScene);
        console.log(sceneInfo)
        let value={
            curSceneId:sceneInfo.id,
            nextSceneId:selectedScene.id,
            longitude:curClickInfo.longitude,
            latitude:curClickInfo.latitude,
        };
        console.log(value)
        console.log(curClickInfo)
        axios({
            method: 'POST',
            url: '/rdc/rdcScene/createRdcArrow',
            headers: {
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
            data:value
        })
        .then((res) => {
            if(res && res.status === 200){
                console.log(res.data.result)
                alert("箭头添加成功")
                this.setState({
                    clickMode:0,
                })
                this.props.history.push({
                    pathname:'/cbd/panorama/panorama',
                    state:{
                        sceneItem:this.state.sceneInfo
                    },
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    gps2d=(e1,e2)=>{
        let d =
        Math.cos(e1.latitude) *
        Math.cos(e2.latitude) *
        Math.cos(e1.longitude - e2.longitude) +
        Math.sin(e1.latitude) *
        Math.sin(e2.latitude)
        d = Math.acos(d)*180/Math.PI
        if (e1.longitude<=3) {
            alert("顺时针旋转：" + d + "°")
        } else {
            alert("逆时针旋转：" + d + "°")
        }
        return d
    }

    computeRadio=(device,marker)=>{
        const data = {
            userId: userId,
            sceneId: this.state.sceneInfo.id,
            deviceId: device.id,
            longitude: marker.longitude,
            latitude: marker.latitude
        }
        console.log(data)
        axios({
            method: 'POST',
            url: '/rdc/rdcScene/computeRadio',
            headers: {
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
            },
            data:data
        })
        .then((res) => {
            if(res && res.status === 200){
                console.log(res.data.result)
                let radio = res.data.result
                if (radio > 0){
                    alert("摄像机需顺时针转向：" + res.data.result + "°")
                } else {
                    alert("摄像机需逆时针转向：" + (-res.data.result) + "°")
                }
                
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render(){
        
        return(
            <div>
                <div id='viewer' ref='viewer' className='viewer'></div>
                <Modal
                    title="设备选择"
                    visible={this.state.visible}
                    onOk={()=>{this.handleSceneBindDevice()}}
                    onCancel={this.handleCancel}
                >
                    <Select
                        placeholder="请选择设备"
                        className="device-select"
                        onChange={(value) => { this.handleDeviceSelect(value) }}
                        allowClear
                    >
                        {this.getDeviceOption()}
                    </Select>
                </Modal>
                <Modal
                    title="场景选择"
                    visible={this.state.visible2}
                    onOk={()=>{this.handleSceneBindArrow()}}
                    onCancel={this.handleCancel}
                >
                    <Select
                        placeholder="请选择场景"
                        className="device-select"
                        onChange={(value) => { this.handleSceneSelect(value) }}
                        allowClear
                    >
                        {this.getSceneOption()}
                    </Select>
                </Modal>
            </div>
            
        ) 
      }
  }