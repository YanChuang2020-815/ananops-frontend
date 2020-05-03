import React,{Component,} from 'react'
import {Descriptions, Badge,Button, Form } from 'antd';
import moment from 'moment';
import './index.styl'
import { Link } from 'react-router-dom'
import Inspection from '../Index';

class ProviderDetail extends Component{
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
              <Descriptions.Item label="公司名称">23</Descriptions.Item>
              <Descriptions.Item label="法人姓名">34</Descriptions.Item>
              <Descriptions.Item label="法人身份账号" span={1.5}>枫蓝国际电梯01号门</Descriptions.Item>         
              <Descriptions.Item label="法人联系方式">34</Descriptions.Item>
              <Descriptions.Item label="主体机构类别">34</Descriptions.Item>           
              <Descriptions.Item label="主体行业" span={1.5}>44</Descriptions.Item>
              <Descriptions.Item label="国家地区">无</Descriptions.Item>
              <Descriptions.Item label="注册地" span={1.5}>44</Descriptions.Item>
              <Descriptions.Item label="详细地址" span={1.5}>设备巡检</Descriptions.Item>  
              <Descriptions.Item label="邮政编码" span={1.5}>设备巡检</Descriptions.Item>  
              <Descriptions.Item label="联系人" span={3}> </Descriptions.Item>
              <Descriptions.Item label="联系电话" span={3}> </Descriptions.Item>
              <Descriptions.Item label="基本账户名称" span={3}> </Descriptions.Item>
              <Descriptions.Item label="基本账号" span={3}> </Descriptions.Item>
              <Descriptions.Item label="营业执照类别" span={3}> </Descriptions.Item>
              <Descriptions.Item label="注册资本" span={3}> </Descriptions.Item>
              <Descriptions.Item label="统一社会信用编码" span={3}> </Descriptions.Item>
              <Descriptions.Item label="有效期" span={3}> </Descriptions.Item>
              <Descriptions.Item label="经营范围" span={3}> </Descriptions.Item>
              <Descriptions.Item label="供应产品类别" span={3}> </Descriptions.Item>            
            </Descriptions>
          
          </div>  
        )
    }
}
export default ProviderDetail
