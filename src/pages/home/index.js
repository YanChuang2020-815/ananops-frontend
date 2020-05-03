import React, { Component,} from 'react'
import { Empty,Card,Col,Row,Statistic,Icon,Divider,Progress} from 'antd'
import axios from 'axios'
import './index.styl'


class Home extends Component{
  constructor(props){
    super(props)
    this.state={
      id:window.localStorage.getItem('id'),
      groupId:window.localStorage.getItem('loginAfter').loginAuthDto && JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId && JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId,
      token:window.localStorage.getItem('token'),
      role:window.localStorage.getItem('role') && window.localStorage.getItem('role'),
      contractCount:0,
      inspectionCount:0,
      projectCount:0,
      dealedCount:0,
      urgencyCount:0,
      allAlarmCount:0,
      dealingCount:0
    }
    this.getProjectCount=this.getProjectCount.bind(this)
    this.getContractCount=this.getContractCount.bind(this)
    this.getInspectionCount=this.getInspectionCount.bind(this)
    this.getDealedCount=this.getDealedCount.bind(this)
    this.getUrgencyCount=this.getUrgencyCount.bind(this)
    this.getAllAlarmCount=this.getAllAlarmCount.bind(this)
    this.getDealingCount=this.getDealingCount.bind(this)
  }
  componentDidMount(){
    this.state.groupId && this.getProjectCount()
    this.state.groupId && this.getContractCount()
    this.state.role && this.getInspectionCount()
    this.getDealedCount()
    this.getUrgencyCount()
    this.getAllAlarmCount()
    this.getDealingCount()
  }
  
  //获取项目总数
  getProjectCount=()=>{
    const {groupId}=this.state
    axios({
      method: 'POST',
      url: '/pmc/project/getProjectCount/'+groupId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){  
          console.log(res.data.result)                 
          this.setState({
            projectCount:res.data.result
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //获取合同总数
  getContractCount=()=>{
    const {groupId}=this.state
    axios({
      method: 'POST',
      url: '/pmc/contract/getContractCount/'+groupId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){  
          console.log(res.data.result)                 
          this.setState({
            contractCount:res.data.result
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //获取巡检总数
  getInspectionCount=()=>{
    const {role}=this.state
    console.log(role)
    var whichRole = 1
    if(role==='用户管理员'||role==='用户负责人'||role==='用户值机员')
      whichRole=1;
    else if(role==='服务商管理员'||role==='服务商负责人'||role==='服务商业务员')
      whichRole=2 ;
    const values={orderBy: "string",userId:this.state.id,role:whichRole}
    console.log(values)
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/getImcTaskNumberByUserIdAndRole',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:values
    })
      .then((res) => {
        if(res && res.status === 200){  
          console.log(res.data.result)                 
          this.setState({
            inspectionCount:res.data.result
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  //获取已处理告警数
  getDealedCount=()=>{
    axios({
      method: 'POST',
      url:'/amc/alarm/getDealedCount',
      headers:{
        'deviceId':this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data.result)
          this.setState({
            dealedCount:res.data.result
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  //获取急需处理告警数
  getUrgencyCount=()=>{
    axios({
      method: 'POST',
      url:'/amc/alarm/getUrgencyCount',
      headers:{
        'deviceId':this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res)=>{
        if(res && res.status === 200){
          console.log(res.data.result)
          this.setState({
            urgencyCount:res.data.result
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
   //获取总告警数
   getAllAlarmCount=()=>{
     axios({
       method: 'POST',
       url:'/amc/alarm/getAllAlarmCount',
       headers:{
         'deviceId':this.deviceId,
         'Authorization':'Bearer '+this.state.token,
       },
     })
       .then((res)=>{
         if(res && res.status=== 200){
           console.log(res.data.result)
           this.setState({
             dealedCount:res.data.result
           })
         }
       })
       .catch(function (error) {
         console.log(error);
       });
   }
   //获取待处理告警数
   getDealingCount=()=>{
     axios({
       method:'POST',
       url:'/amc/alarm/getDealingCount',
       headers:{
         'deviceId':this.deviceId,
         'Authorization':'Bearer '+this.state.token,
       },
     }).then((res)=>{ 
       if( res && res.result === 200){
         console.log(res.data.result)
         this.setState({
           dealingCount:res.data.result
         })
       }
     }).catch(function (error){
       console.log(error)
     })
   }

 

   render () {
     const {projectCount} = this.state
     const {contractCount} = this.state
     const {inspectionCount}=this.state
     const {dealedCount}=this.state
     const {dealingCount}=this.state
     const {urgencyCount}=this.state
     const {allAlarmCount}=this.state
     // const {dealingCount}=this.state
     return (
       <div className="container">
         <Row  gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
           <Col span={5}>
             <Card bordered={false} style={{marginBottom:25}} >
               <Statistic title="项目总数" value={projectCount} />
             </Card>
             <Card bordered={false} style={{marginBottom:25}}>
               <Statistic title="合同总数" value={contractCount}/>
             </Card>
             <Card bordered={false} style={{marginBottom:25}}>
               <Statistic title="巡检总数" value={inspectionCount}/>
             </Card>
         
           </Col>
           <Col span={5}>
             <Card bordered={false} style={{marginBottom:25}} >
               <Statistic title="已处理告警数" value={dealedCount} />
             </Card>
             {/* <Card bordered={false} style={{marginBottom:25}} >
               <Statistic title="急需处理告警数" value={urgencyCount} />
             </Card>*/}
             <Card bordered={false} style={{marginBottom:25}} >
               <Statistic title="总告警数" value={allAlarmCount} />
             </Card>
             <Card bordered={false} style={{marginBottom:25}} >
               <Statistic title="待处理告警数" value={dealingCount} />
             </Card>
           </Col>
          
           <Col span={7}>
             <Card title={"完成量"} bordered={false} style={{marginBottom:30}} >
               <Progress type="circle" percent={75} />              
             </Card>
             <Card title={"故障率"} bordered={false} >
               <Progress type="circle" strokeColor="red" percent={5} />              
             </Card>
           </Col>
           <Col span={7}>
             <Card bordered={false} style={{marginBottom:20}}> 
               <Statistic
                 title="活跃度"
                 value={11.28}
                 precision={2}
                 valueStyle={{ color: '#3f8600' }}
                 prefix={<Icon type="arrow-up" />}
                 suffix="%"
               />
               <Statistic
                 title="操作率"
                 value={9.3}
                 precision={2}
                 valueStyle={{ color: '#cf1322' }}
                 prefix={<Icon type="arrow-down" />}
                 suffix="%"
               />
                
             </Card>
             <Card bordered={false} >
               <Statistic title="在线时长" value={12} suffix="h"/>
             </Card>
           </Col>
         </Row>
       </div>
       
     )
   }
}
export default Home