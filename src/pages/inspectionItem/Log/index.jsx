import React,{Component,} from 'react'
import {Row,Col,Table,Icon } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
class Log extends Component{

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
        var values={"orderBy": "string","pageNum": 0,"pageSize": 100,"taskId": id}
        axios({
            method: 'POST',
            url: '/imc/inspectionTask/getTaskLogs',
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
                <Link to={`/cbd/inspection`}>
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
                title: 'ID',
                key: 'id',
                render: (text, record) => {
                return ((record.id && record.id) || '--')
                }   
            }, {
                title: '巡检任务名称',
                key: 'taskName',
                render: (text, record) => {
                return (record.taskName && record.taskName) || '--'
                }
            }, {
                title: 'IP地址',
                key: 'ipAddress',
                render: (text, record) => {
                return (record.ipAddress && record.ipAddress) || '--'
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
        ]}
            />
          </div>
        )
    }
}
export default Log