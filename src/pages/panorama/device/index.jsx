import React,{Component} from 'react';
import {Card,Popconfirm} from 'antd';
import './index.styl';
import axios from 'axios';

export default class Device extends Component{
  constructor(props){
      super(props)
      this.state={
        token:window.localStorage.getItem('token'),
        deviceList:[

        ],
      }

  }
  componentDidMount(){
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
        this.setState({
          deviceList:res.data.result,
        });
        console.log(res.data.result)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleDeviceDelete=(device)=>{
    console.log(device)
    let deviceId = device.id;
    axios({
      method: 'DELETE',
      url: '/rdc/rdcDevice/deleteDevice/' + deviceId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
    .then((res) => {
      if(res && res.status === 200){
        alert("设备删除成功！")
        this.props.history.push({
          pathname:'/cbd/panorama/device',
      })
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //获得全部设备
  getAllDevice=()=>{
    let {deviceList} = this.state;
    console.log(deviceList)
    let allDevice = deviceList && deviceList.map((item,index)=>(
      <Popconfirm
        title={"设备名称：" + item.name
         + "\n设备厂商：" + item.manufacture
         + "\n设备类型：" + item.type
        }
        okText="删除"
        cancelText="取消"
        onConfirm={()=>this.handleDeviceDelete(item)}
      >
        <Card.Grid className="gridStyle" key={index}>
          <div>
            <h3>{item.name}</h3>
            <img src={item.url} className='device-img'></img>
          </div>
      </Card.Grid>
      </Popconfirm>
    ))
    return allDevice;
  }


  render(){
    return (
      <Card title="全部设备">
        {this.getAllDevice()}
      </Card>
    )
  }
}