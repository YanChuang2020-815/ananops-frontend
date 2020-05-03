import React, { Component, } from 'react';
import { Button,Row,Col,Table,Input,Popconfirm,Tag,message,Modal } from 'antd';
import { Link } from 'react-router-dom'
import axios from 'axios'
import Add from './add'
import './index.styl'

const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;

class DictionaryItem extends Component{
  constructor(props){
    super(props)
    this.state={
      addVisible:false,
      addDetail: {},
      current: FIRST_PAGE,
      token:window.localStorage.getItem('token'),
      roleCode: window.localStorage.getItem('roleCode'),
      data:[],
      dictionaryDetail:{
      },
    }
    this.getDictItemListByDictId = this.getDictItemListByDictId.bind(this);
  }

  componentDidMount(){
    const { 
      match : { params : { dictId } }
    } = this.props
    this.getDictItemListByDictId(dictId); 
  }

    //根据字典库id获取字典项列表信息
    getDictItemListByDictId = (dictId) => { 
      axios({        
        method: 'GET',
        url: '/mdc/dictItem/getDictItemListByDictId?dictId='+dictId,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){
            console.log("字典库子项"+JSON.stringify(res));
            this.setState({
              data: res.data.result,
            }) ;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }
    //删除
    deleteDictItemByItemDictId=(record)=>{
      const { 
        match : { params : { dictId } }
      } = this.props
      console.log(record.id)
      axios({
        method:'POST',
        url:'/mdc/dictItem/deleteDictItemByItemDictId/'+record.id,
        headers:{
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        }           
      }) 
        .then((res) => {
          if(res && res.status === 200){
            console.log(res.data.result);
            this.getDictItemListByDictId(dictId);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    //showAdd
    showAdd = () => {
      this.setState({
        addVisible: true,
        addDetail: {}
      })
    }
    //showUpdate
    showUpdate = (dictItem) => {
      this.setState({
        addDetail: dictItem,
        addVisible: true
      })
    }
    //addOk
    addOk = e => {
      const { 
        match : { params : { dictId } }
      } = this.props
      this.setState({
        addVisible: false
      })
      const {addDetail}=this.state
      const values = this.form.getFieldsValue()
      if (values.name === undefined) {
        message.error('字典项名称为必填项');
        return;
      }
      if (values.code === undefined) {
        message.error('字典项编码为必填项');
        return;
      }
      if (values.sort === undefined) {
        message.error('字典项排序为必填项');
        return;
      }
      values.id=addDetail.id;
      values.dictId=dictId;
      axios({
        method: 'POST',
        url: '/mdc/dictItem/save',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(values)
      })
        .then((res) => {
          console.log(JSON.stringify(values))
          if(res && res.status === 200){ 
            this.form.resetFields();
            this.getDictItemListByDictId(dictId);
          }
  
        })
        .catch(function (error) {
          console.log(error);
        }); 
    }
    //addCancel
    addCancel = () => {
      this.setState({
        addVisible: false
      })
    }

    render(){
      const { 
        match : { params : { dictId} }
      } = this.props
      const {data,addDetail}=this.state
      
      return(
        <div>
          <div>
            <Row gutter={[16, 16]}>
              <Col span={3}>               
                <Link to={`/mds/dict/list`}>
                  <Button type="primary">
                        返回上一级
                  </Button> 
                </Link>
              </Col>
              <Col span={2}>
                <Button type="primary" style={{marginRight: '15px'}} onClick={() => this.showAdd()}>新建</Button>
              </Col>
            </Row> 
          </div>

          <Table
            className="group-list-module"
            bordered
            showHeader={true}
            rowKey="id"
            size='small'
            rowClassName={this.setRowClassName}
            dataSource={data}
            columns={[
              {
                title:'序号',
                width:50,
                fixed:'left',
                render:(text,record,index)=> `${index+1}`,
              },
              {
                title: '名称',
                key: 'name',
                render: (text, record) => {
                  return ((record.name && record.name) || '--')
                }   
              },
              {
                title: '编码',
                key: 'code',
                render: (text, record) => {
                  return (record.code && record.code) || '--'
                }
              },
              {
                title: '排序',
                key: 'sort',
                render: (text, record) => {
                  return (record.sort && record.sort) || '--'
                }
              },
              {
                title: '经度',
                key: 'longitude',
                render: (text, record) => {
                  return (record.longitude && record.longitude) || '--'
                }
              },
              {
                title: '纬度',
                key: 'latitude',
                render: (text, record) => {
                  return (record.latitude && record.latitude) || '--'
                }
              },
              {
                title: '操作',
                render: (text, record, index) => (
                  <div className="operate-btns"
                    style={{ display: 'block' }}
                  > 
                  {(record.groupId === '-1' && this.state.roleCode !== 'admin') ? <Tag color="#f50">系统字典项</Tag> :
                  <div>
                    <Button type="simple" onClick={() => this.showUpdate(record)} 
                    style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent'}}
                    >更新</Button>
                    <Popconfirm
                      title="确定要删除吗？"
                      onConfirm={()=> {this.deleteDictItemByItemDictId(record)}}
                    >
                      <Button 
                        type="simple"
                        style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent'}}
                      >删除</Button>
                    </Popconfirm>
                    </div>}
                  </div>
                ),
              }]}
          />
          <Modal
            title={addDetail.id ? '编辑字典项':'添加字典项'}
            visible={this.state.addVisible}
            onOk={this.addOk}
            onCancel={() => {this.setState({addVisible:false,addDetail:{}});this.form.resetFields();}}
          >
            <Add setSubmit={(form) => {
              this.form = form
            }} addDetail={addDetail}
            />
          </Modal>
        </div>
      )
    }
}
export default DictionaryItem;