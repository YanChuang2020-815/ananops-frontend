import React,{Component} from 'react';
import {Select,Modal} from 'antd';
import Viewer from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import './index.styl'
import axios from 'axios';


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
            visible:false,
            deviceList:[],
            curDevice:null,
            curClickInfo:null,
            bindedDeviceList:[

            ],
            deviceDict:[],
        }

    }
    componentDidMount(){
        let {sceneItem} = this.props.history.location.state;
        console.log(sceneItem);
        this.setState({
            sceneInfo:sceneItem,
        })
        this.getAllDevice();
        let viewer = document.getElementById('viewer');
        let panorama = this;
        let PSV = new Viewer({
            container: viewer,
            panorama: sceneItem.url,
            size: {
                width: '85vw',
                height: '84vh'
            },
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
        //加载当前场景下的设备
        PSV.on('panorama-load-progress',function(){
            panorama.getBindedDevice(sceneItem,PSV);
        })
        //监听点击场景事件
        PSV.on('click',function(e){
            panorama.addDevice(e);
        })
        //监听标记事件
        PSV.on('select-marker',function(e){
            panorama.handleMarkerClick(e);
        })

    }

    handleMarkerClick=(e)=>{
        let{PSV,clickMode} = this.state;
        if(clickMode==2){
            //如果是设备删除
            this.deleteDevice(e,PSV);
            
        }else{
            //如果只是查看
            alert("经度为：" + e.longitude + "\n" + "纬度为：" + e.latitude);
        }
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

    addDevice=(e)=>{
        let{PSV,clickMode} = this.state;
        if(clickMode==1){
            this.setState({
                curClickInfo:e,
                visible:true,
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
            clickMode: 0,
        });
    };

    handleDeviceSelect=(deviceId)=>{
        let{deviceDict} = this.state;
        this.setState({
            curDevice:deviceDict[deviceId],
        })
    }

    handleSceneBindDevice=()=>{
        let {PSV,curDevice,sceneInfo,curClickInfo} = this.state;
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
        this.setState({
            visible:false,
            clickMode:0,
        })
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
            </div>
            
        ) 
      }
  }