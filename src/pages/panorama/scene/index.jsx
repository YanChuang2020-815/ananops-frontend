import React, { Component } from "react";
import {Select,Modal,Button,Popconfirm,message} from 'antd';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './index.styl';
import axios from 'axios';

export default class Scene extends Component {
  constructor(props){
      super(props)
      this.state={
        token:window.localStorage.getItem('token'),
        sceneList:[

        ],
        slideIndex:0,
        sceneDict:[],
        visible:false,
        curSceneItem:null,
      }

  }
  componentDidMount(){
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
          sceneDict[value.id]=index;
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

  //处理场景选择
  handleSceneSelect=(item)=>{
    this.setState({
      visible:true,
      curSceneItem:item,
    })
  }

  enterScene=()=>{
    let{curSceneItem} = this.state;
    this.props.history.push({
      pathname:'/cbd/panorama/panorama',
      state:{
        sceneItem:curSceneItem
      },
    })
  }

  deleteScene=()=>{
    let{curSceneItem} = this.state;
    console.log(curSceneItem)
    axios({
      method: 'DELETE',
      url: '/rdc/rdcScene/deleteScene/'+curSceneItem.id,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
    .then((res) => {
      if(res && res.status === 200){
        console.log(res.data.result)
        alert("删除成功")
        this.props.history.push({
          pathname:'/cbd/panorama/scene',
        })
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //获得全部场景列表
  getAllScene=()=>{
    let {sceneList} = this.state;
    console.log(sceneList)
    let allScene = sceneList && sceneList.map((item,index)=>(
      <div 
        className='scene-slide' 
        key={index}
        onClick={()=>this.handleSceneSelect(item)}
        >
        <h3>{item.sceneName}</h3>
        <img src={item.url} className='scene-img'></img>
      </div>
    ))
    return allScene;
  }

  //处理场景查询
  handleSceneSearch=(value)=>{
    let {sceneDict} = this.state;
    let index = sceneDict[value];
    this.slider.slickGoTo(index);
  }

  //获取场景选项
  getOption=()=>{
    let {sceneList}=this.state
    let sceneOption=sceneList&&sceneList.map((item, index) => (
      <Select.Option key={index} value={item.id}> 
        {item.sceneName}
      </Select.Option>
    ))
    return sceneOption;
  }

  showModal=()=>{
    this.setState({
      visible:true,
    })
  }

  handleCancel=e=>{
    this.setState({
      visible:false,
    })
  }


  render() {
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 3,
      speed: 500,
      lazyLoad: true,
      dots: true,
    };

    return (
      <div>
        <Select
            placeholder="请选择场景"
            className="scene-select"
            onChange={(value) => { this.handleSceneSearch(value) }}
            allowClear
          >
            {this.getOption()}
        </Select>
        <h2>场景管理</h2>
        <Slider ref={slider => (this.slider =slider)} {...settings}>
          {this.getAllScene()}
        </Slider>
        <Modal
          title="场景操作"
          visible={this.state.visible}
          footer={null}
          ghost={true}
          onCancel={this.handleCancel}
        >
          <Button type="primary" onClick={this.enterScene}>进入场景</Button>
          <Popconfirm
            title="确定删除？"
            onConfirm={this.deleteScene}
            okText="是"
            cancelText="否"
            type="danger"
          >
            <Button type="danger">删除场景</Button>
          </Popconfirm>
        </Modal>
      </div>
    );
  }
}