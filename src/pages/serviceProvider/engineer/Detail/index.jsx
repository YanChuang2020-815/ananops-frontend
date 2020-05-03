import React,{Component,} from 'react'
import {Descriptions, Badge,Button, Form } from 'antd';
import moment from 'moment';
import './index.styl'
import { Link } from 'react-router-dom'
import Inspection from '../Index';

class EngineerDetail extends Component{
    constructor(props){
        super(props)
        this.state={
           
        }
    }
    render(){
        return(
            <div className="bg">
            <Descriptions bordered size='small' className="descriptions">
              <Descriptions.Item label="ID">1</Descriptions.Item>
              <Descriptions.Item label="姓名">23</Descriptions.Item>
              <Descriptions.Item label="性别">34</Descriptions.Item>
              <Descriptions.Item label="所在省市" span={1.5}>枫蓝国际电梯01号门</Descriptions.Item>         
              <Descriptions.Item label="身份证号码">34</Descriptions.Item>
              <Descriptions.Item label="身份证有效期">34</Descriptions.Item>           
              <Descriptions.Item label="职务" span={1.5}>44</Descriptions.Item>
              <Descriptions.Item label="职称">无</Descriptions.Item>
              <Descriptions.Item label="学历" span={1.5}>44</Descriptions.Item>
              <Descriptions.Item label="联系电话" span={1.5}>设备巡检</Descriptions.Item>  
              <Descriptions.Item label="从业开始时间" span={1.5}>设备巡检</Descriptions.Item>  
              <Descriptions.Item label="图片存放路径url" span={3}> </Descriptions.Item>          
            </Descriptions>
          
          </div>  
        )
    }
}
export default EngineerDetail
