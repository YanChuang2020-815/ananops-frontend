import React,{Component} from 'react';
import {Card,Popconfirm} from 'antd';
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
    
  }

  


  render(){
    return (
      "边缘设备管理"
    )
  }
}