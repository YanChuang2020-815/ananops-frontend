import React,{Component,} from 'react'
import {Row,Col,Table,Icon } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
class SubLog extends Component{

    constructor(props){
        super(props)
        this.state={
            data:[],
            token:window.localStorage.getItem('token'),
        }
        this.getGroupList = this.getGroupList.bind(this);
    }
    componentDidMount(){
        const { 
            match : { params : { subId } }
          } = this.props
          console.log(subId)
        this.getGroupList(subId);   
    }
     //获取列表信息
     getGroupList = (id) => {
        axios({
            method: 'GET',
            url: '/mdmc/mdmcItem/getItemLogs/'+id,
            headers: {
               'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
          })
        .then((res) => {
            if(res && res.status === 200){
            console.log(res)
            this.setState({
                data: res.data.result,
            }) ;
            // console.log(this.state.data)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        
    }
    render(){
        const { 
            match : { params : { id } }
          } = this.props
        const {data}=this.state
        return(
            <div>
            <div className="searchPart">
            <Row>
                <Col span={5}>
                <Link to={`/cbd/service/sub/${id}`}>
                    <Icon type="arrow-left" ></Icon>返回
                </Link>
                </Col>
            </Row> 
            </div>
            <Table
            className="group-list-module"
            bordered
            size='small'
            showHeader={true}
            // pagination={{
            //     current,
            //     total,
            //     pageSize: size,
            //     onChange: this.handlePageChange,
               
            // }}
            rowClassName={this.setRowClassName}
            dataSource={data}
            columns={[
            {
                title:'序号',
                width:50,
                fixed:'left',
                render:(text,record,index)=> `${index+1}`,
            },{
                title: '日志ID',
                key: 'id',
                render: (text, record) => {
                return ((record.id && record.id) || '--')
                }   
            }, {
                title: '任务子项ID',
                key: 'taskItemId',
                render: (text, record) => {
                return (record.taskItemId && record.taskItemId) || '--'
                }
            }, {
                title: '状态',
                key: 'status',
                render: (text, record) => {
                return (record.status && record.status) || '--'
                }
            },
            {
                title: '状态时间戳', 
                key: 'statusTimestamp',
                render: (text, record) => {
                return (record.statusTimestamp && record.statusTimestamp) || '--'
                }
            }, {
                title: '创建时间',
                key: 'createdTime',
                render: (text, record) => {
                return (record.createdTime && record.createdTime) || '--'
                }
            },{
                title: '创建者',
                key: 'creator',
                render: (text, record) => {
                return (record.creator && record.creator) || '--'
                }
            },{
                title: '创建者ID',
                key: 'creatorId',
                render: (text, record) => {
                return (record.creatorId && record.creatorId) || '--'
                }
            },
            {
                title: '最终操作者',
                key: 'lastOperator',
                render: (text, record) => {
                return (record.lastOperator && record.lastOperator) || '--'
                }
            },{
                title: '最终操作者ID',
                key: 'lastOperatorId',
                render: (text, record) => {
                return (record.lastOperatorId && record.lastOperatorId) || '--'
                }
            },{
                title: '操作',
                key: 'movement',
                render: (text, record) => {
                return (record.movement && record.movement) || '--'
                }
            },
            {
                title: '更新时间',
                key: 'updateTime',
                render: (text, record) => {
                return (record.updateTime && record.updateTime) || '--'
                }
            },
        ]}
            />
     </div>
        )
    }
}
export default SubLog