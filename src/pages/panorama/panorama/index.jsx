import React,{Component} from 'react';
import Viewer from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import './index.styl'
import pin1 from './icons/pin1.png'


export default class Panorama extends Component{
    constructor(props){
        super(props)
        this.state={
            viewer:null,
            PSV:null,
            markers:[],
            clickMode:0,//marker的点击模式：0无效，1添加，2删除
            sceneInfo:null,
        }

    }
    componentDidMount(){
        let {sceneItem} = this.props.history.location.state;
        console.log(sceneItem);
        this.setState({
            sceneInfo:sceneItem,
        })
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
        console.log(PSV)
        this.setState({
            viewer:viewer,
            PSV:PSV,
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
            PSV.removeMarker(e);
            this.setState({
                clickMode:0,
            })
        }else{
            //如果只是查看
            // PSV.gotoMarker(e,1000);
            alert("经度为：" + e.longitude + "\n" + "纬度为：" + e.latitude);
        }
    }

    addDevice=(e)=>{
        let{PSV,clickMode} = this.state;
        if(clickMode==1){
            PSV.addMarker({
                id: `#${Math.random()}`,
                longitude: e.longitude,
                latitude: e.latitude,
                image: pin1,
                width: 32,
                height: 32,
                anchor:'bottom center',
                tooltip:{
                    content:'deviceName',
                    fontsize:'xx-large',
                },
            });
            this.setState({
                clickMode:0,
            })
        }
    }

    render(){
        
        return(
            <div>
                <div id='viewer' ref='viewer' className='viewer'></div>
            </div>
            
        ) 
      }
  }