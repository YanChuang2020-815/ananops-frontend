import React,{Component} from 'react';
import {Card} from 'antd';
import {Modal} from 'antd';
import './index.styl';
import axios from 'axios';
import smokeImg from '../static/icons/smoke.png';

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
      url: '/deviceaccess/customerdevices/2/105?limit=1000',
    })
    .then((res) => {
      console.log(res)
      if(res && res.status === 200){
        this.setState({
          deviceList:res.data.data,
        });
        console.log(res.data.data)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
    // axios({
    //   method: 'GET',
    //   url: '/rdc/rdcDevice/getAllDevice',
    //   headers: {
    //     'deviceId': this.deviceId,
    //     'Authorization':'Bearer '+this.state.token,
    //   },
    // })
    // .then((res) => {
    //   if(res && res.status === 200){
    //     this.setState({
    //       deviceList:res.data.result,
    //     });
    //     console.log(res.data.result)
    //   }
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }

  //获得全部设备
  getAllDevice=()=>{
    let {deviceList} = this.state;

    console.log(deviceList)
    let allDevice = deviceList && deviceList.map((item,index)=>(
      <Card.Grid className="gridStyle" key={index}>
        <div>
          <h3>{item.name}</h3>
          <img src={smokeImg} className='device-img'></img>
        </div>
      </Card.Grid>
    ))
    return allDevice;
  }

  render(){
    return (
      <div>
        <Card title="全部设备">
          {this.getAllDevice()}
        </Card>
      </div>
    )
  }
}