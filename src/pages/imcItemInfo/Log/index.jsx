import React,{Component,} from 'react'
import {Row,Col,Table,Icon,Button } from 'antd';
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
            match : { params : { taskId,itemId } }
          } = this.props
          console.log(itemId)
        this.getGroupList(itemId);   
    }
     //获取列表信息
     getGroupList = (id) => {
        var values={orderBy: "string",pageNum: 0,pageSize: 100,itemId:id}
        console.log("巡检子项日志请求信息：" + JSON.stringify(values))
        axios({
            method: 'POST',
            url: '/imc/inspectionItem/getItemLogs',
            headers: {
               'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
            },
            data:values
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
            match : { params : { taskId,itemId,taskStatus } }
          } = this.props
        const {data}=this.state
        console.log("巡检子项日志+++：" + JSON.stringify(data))
        return(
            <div>
                <div className="searchPart">
                <Row>
                    <Col span={5}>
                    {/* <Link to={`/cbd/item/${taskId}/${taskStatus}`}>
                        <Icon type="arrow-left" ></Icon>返回
                    </Link> */}
                    </Col> 
                </Row> 
                </div>
                <Table
                className="group-list-module"
                bordered
                showHeader={true}
                size='small'
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
                    title: '序号',
                    width: 50,
                    render:(text,record,index)=> `${index+1}`,
                },{
                    title: '巡检任务日志ID',
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
                    title: '操作者IP地址',
                    key: 'ipAddress',
                    render: (text, record) => {
                    return (record.ipAddress && record.ipAddress) || '--'
                    }
                },{
                    title: '操作者浏览器',
                    key: 'browser',
                    render: (text, record) => {
                    return (record.browser && record.browser) || '--'
                    }
                },{
                    title: '操作者OS',
                    key: 'os',
                    render: (text, record) => {
                    return (record.os && record.os) || '--'
                    }
                },
                // {
                //     title: '状态时间戳', 
                //     key: 'statusTimestamp',
                //     render: (text, record) => {
                //     return (record.statusTimestamp && record.statusTimestamp) || '--'
                //     }
                // }
                , {
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
                    title: '任务所处状态',
                    key: 'statusMsg',
                    render: (text, record) => {
                    return (record.statusMsg && record.statusMsg) || '--'
                    }
                },
                // {
                //     title: '最终操作者',
                //     key: 'lastOperator',
                //     render: (text, record) => {
                //     return (record.lastOperator && record.lastOperator) || '--'
                //     }
                // },{
                //     title: '最终操作者ID',
                //     key: 'lastOperatorId',
                //     render: (text, record) => {
                //     return (record.lastOperatorId && record.lastOperatorId) || '--'
                //     }
                // }
                ,{
                    title: '操作',
                    key: 'movement',
                    render: (text, record) => {
                    return (record.movement && record.movement) || '--'
                    }
                },
            ]}
        />
        <div style={{textAlign:"right"}}>
            <Button type="primary" onClick={()=>this.props.history.goBack()} style={{marginRight:20, marginTop:10}}><Icon type='arrow-left'/>返回列表</Button>
        </div>
     </div>
        )
    }
}
export default Log