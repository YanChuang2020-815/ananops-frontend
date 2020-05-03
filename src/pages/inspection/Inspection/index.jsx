import React,{Component,} from 'react'
import { Row,Table,Input,Badge  } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
const { TextArea } = Input;


const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;
class Inspection extends Component{
  constructor(props){
    super(props)
    this.state={
      id:window.localStorage.getItem('id'),
      token:window.localStorage.getItem('token'),
      role:window.localStorage.getItem('role'),
      status:1,
      statusMsg:'',
      roleCode:window.localStorage.getItem('roleCode'),
      current: FIRST_PAGE,
      size: PAGE_SIZE,
      total: 0, 
      nowCurrent:FIRST_PAGE,
      imcTaskIdList:[],
      imcTaskList:{
      },
      data:[],
      reviewRank:null,
      reviewContent:null,
      display_button1:'none',//用户方负责人同意任务按钮
      display_button2:'none',//用户方负责人否决人物按钮
      display_button3:'none',//服务商接单按钮
      display_button4:'none',//用户方负责人确认巡检完成按钮
      display_button5:'none',//用户方负责人付款按钮
      display_button6:'none',//用户方负责人评论按钮
      display_button7:'none',//服务商拒单
      display_button8:'none',//删除任务
      display_button9:'none',//分配工程师
    }
    this.getInfo=this.getInfo.bind(this)
  }
  componentDidMount(){
    this.getInfo(FIRST_PAGE)
  }

  //根据不同的路由，加载不同的信息
  getInfo(page){  
    var location=this.props.location.pathname
    var status
    var getAll = false
    if(location ==='/cbd/inspection'||location ==='/cbd/inspection/'){
      if(this.state.role!==null && this.state.role.includes('用户')){
        status=0
        getAll = true
      }
      else if(this.state.role!==null && this.state.role.includes('服务商')){
        status=2
        getAll = true
      }
      else if(this.state.role!==null && this.state.role.includes('维修工')){
        status=3
      }
    }
    if(location == '/cbd/inspection/waitForPrincipal'){
      status=0
    }
    if(location == '/cbd/inspection/deny'){
      status=-1
      this.setState({
        display_button1:'none',
        display_button2:'none',
        display_button3:'none',
        display_button4:'none',
        display_button5:'none',
        display_button6:'none',
        display_button7:'none',
        display_button8:'block',
        display_button9:'none',
      })
    }
    if(location == '/cbd/inspection/waitForFacilitator'){
      status=2
    }
    if(location == '/cbd/inspection/check'){
      status=0
      if(this.state.role!=null && this.state.role.includes('用户')){
        this.setState({
          display_button1:'block',
          display_button2:'block',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'block',
          display_button9:'none',
        })
      }else{
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }
    }
    if(location=='/cbd/inspection/accept'){  
      status=2
      if(this.state.role!=null && this.state.role.includes('服务商')){
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'block',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'block',
          display_button8:'none',
          display_button9:'none',
        })
      }else{
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }
        
    }
    if(location==='/cbd/inspection/execute'){
      status=3
      if(this.state.role!=null && this.state.role.includes('服务商')){
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'block',
        })
      }else{
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }
          
    }
    if(location==='/cbd/inspection/confirm'){
      status=4
      if(this.state.role!=null && this.state.role.includes('用户')){
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'block',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }else{
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }
        
    }
    if(location==='/cbd/inspection/pay'){
      status=5
      if(this.state.role!=null && this.state.role.includes('用户')){
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'block',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }else{
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }
        
    }
    if(location==='/cbd/inspection/comment'){
      status=6
      if(this.state.role!=null && this.state.role.includes('用户')){
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'block',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }else{
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
          display_button4:'none',
          display_button5:'none',
          display_button6:'none',
          display_button7:'none',
          display_button8:'none',
          display_button9:'none',
        })
      }
        
    }
    if(location==='/cbd/inspection/finish'){
      status=7
      this.setState({
        display_button1:'none',
        display_button2:'none',
        display_button3:'none',
        display_button4:'none',
        display_button5:'none',
        display_button6:'none',
        display_button7:'none',
        display_button8:'none',
        display_button9:'block',
      })
    }
    if(location === '/cbd/inspection/appoint'){
      status=3
      this.setState({
        display_button1:'none',
        display_button2:'none',
        display_button3:'none',
        display_button4:'none',
        display_button5:'none',
        display_button6:'none',
        display_button7:'none',
        display_button8:'none',
        display_button9:'block',
      })
    }
    if(location === '/cbd/inspection/alreadyAppoint'){
      status=4
      this.setState({
        display_button1:'none',
        display_button2:'none',
        display_button3:'none',
        display_button4:'none',
        display_button5:'none',
        display_button6:'none',
        display_button7:'none',
        display_button8:'none',
        display_button9:'block',
      })
    }
    if(location === '/cbd/inspection/waitForMaintainer'){
      status=3
      this.setState({
        display_button1:'none',
        display_button2:'none',
        display_button3:'none',
        display_button4:'none',
        display_button5:'none',
        display_button6:'none',
        display_button7:'none',
        display_button8:'none',
        display_button9:'block',
      })
    }
    const { size, } = this.state;
    var whichRole=null
    const {role}=this.state
    if(role==='用户管理员'||role==='用户负责人'||role==='用户值机员')
      whichRole=1;
    else if(role==='服务商管理员'||role==='服务商负责人'||role==='服务商业务员')
      whichRole=2 ;
    else if(role && role.includes('维修工'))
      whichRole=3;
    if(whichRole===1 && getAll){
      //如果当前是用户方，并且要获取全部任务
      this.getAllPartyAImcTask(page,size);
    }else if(whichRole===1){
      //如果当前是用户方
      const values={orderBy: "string",pageSize:size,pageNum:page,userId:this.state.id,role:whichRole,status:status,projectId:null}
      console.log(values)
      axios({
        method: 'POST',
        url: '/imc/inspectionTask/getTaskListByUserIdAndStatus',
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:values
      })
        .then((res) => {
          if(res && res.status === 200){
            this.setState({
              data: res.data.result.list,
              nowCurrent:res.data.result.pageNum,
              status:status,
              total:res.data.result.total
              // roleCode:roleCode,
            });
            console.log(res.data)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }else if(whichRole==2&&getAll){
      //如果当前是服务商，并且需要获得全部的任务
      this.getAllImcTaskOfFacilitator(size,page);
    }else if(whichRole==2){
      //如果当前是服务方
      if(status==2){
        //如果处于服务商待接单状态
        //获取全部未审批的巡检工单
        this.getAllUnConfirmedImcTask(size,page);
      }else if (status==3){
        //如果处于巡检任务执行状态
        this.getAllUnDistributedImcTask(size,page);
      }else if(status==4){
        //如果处于服务商已完成状态
        this.getAllFinishedImcTask(size,page);
      }
    }
  }

  //根据用户负责人id获取全部任务
  getAllPartyAImcTask=(page,size)=>{
    const data = {
      orderBy:"string",
      pageNum:page,
      pageSize:size,
      role:1,
      userId:this.state.id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/getTaskListByUserId',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(data)
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.setState({
            data:res.data.result.list,
            nowCurrent:res.data.result.pageNum,
            total:res.data.result.total
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //获取全部未审批的巡检工单
  getAllUnConfirmedImcTask = async(size,page)=>{
    const data = {
      orderBy:"string",
      pageNum:page,
      pageSize:size
    }
    const res1 = await axios({
      method: 'POST',
      url: '/imc/inspectionTask/getAllUnConfirmedTask',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(data)
    })
    if(res1 && res1.status ===200){
      console.log("ppppp:" + JSON.stringify(res1.data.result))
      let imcTaskOrderList = res1.data.result.list;
      let length=0;
      // for(let imcTaskOrder in imcTaskOrderList){
      //   length++;
      // }
      // let imcTaskIdList = [];
      // for(let i = 0;i<length;i++){
      //   imcTaskIdList.push(imcTaskOrderList[i].id)
      // }
      this.setState({
        data:res1.data.result.list,
        nowCurrent:res1.data.result.pageNum,
        total:res1.data.result.total
      })
      console.log("未审批的巡检任务的id列表：" + this.state.imcTaskIdList);
    }
  }
  //获取全部为分配工程师的巡检任务
  getAllUnDistributedImcTask = async(size,page)=>{
    const data = {
      orderBy:"string",
      pageNum:page,
      pageSize:size
    }
    const res1 = await axios({
      method: 'POST',
      url: '/imc/inspectionTask/getAllUnDistributedTask',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(data)
    })
    if(res1 && res1.status ===200){
      let imcTaskOrderList = res1.data.result.list;
      let length=0;
      // for(let imcTaskOrder in imcTaskOrderList){
      //   length++;
      // }
      // let imcTaskIdList = [];
      // for(let i = 0;i<length;i++){
      //   let res2
      //   imcTaskIdList.push(imcTaskOrderList[i].id)
      // }
      this.setState({
        data:res1.data.result.list,
        nowCurrent:res1.data.result.pageNum,
        total:res1.data.result.total
      })
    }
  }

  //获取全部服务商已完成的巡检任务
  getAllFinishedImcTask = async(size,page)=>{
    const data = {
      orderBy:"string",
      pageNum:page,
      pageSize:size
    }
    const res1 = await axios({
      method: 'POST',
      url: '/imc/inspectionTask/getAllFinishedTaskByFacilitatorId',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(data)
    })
    if(res1 && res1.status ===200){
      this.setState({
        data:res1.data.result.list,
        nowCurrent:res1.data.result.pageNum,
        total:res1.data.result.total
      })
      console.log("服务商已完成的巡检任务的列表：" + JSON.stringify(this.state.data));
    }
  }

  //获得全部服务商下的任务
  getAllImcTaskOfFacilitator=async(size,page)=>{
    const data = {
      orderBy:"string",
      pageNum:page,
      pageSize:size
    }
    const res1 = await axios({
      method: 'POST',
      url: '/imc/inspectionTask/getAllTaskByFacilitatorId',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(data)
    })
    if(res1 && res1.status ===200){
      this.setState({
        data:res1.data.result.list,
        nowCurrent:res1.data.result.pageNum,
        total:res1.data.result.total
      })
      console.log("服务商全部的巡检任务的列表：" + JSON.stringify(this.state.data));
    }
  }

  //用户方负责人同意该巡检任务的执行
  approveImcTaskByA=(id)=>{
    console.log("当前巡检任务id为：" + id)
    const data={
      taskId:id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/acceptImcTaskByPrincipal',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //用户方负责人否决该巡检任务的执行
  denyImcTaskByA=(id)=>{
    console.log("当前巡检任务id为：" + id)
    const data={
      taskId:id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/denyImcTaskByPrincipal',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //服务商接单
  acceptImcTaskByB=(id)=>{
    console.log("当前巡检任务id为：" + id)
    const data={
      taskId:id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/acceptTaskByFacilitator',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //服务商拒单
  denyImcTaskByB=(id)=>{
    console.log("当前巡检任务id为：" + id)
    const data={
      taskId:id
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/refuseTaskByFacilitator',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:data
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //删除巡检任务
  deleteTask=(id)=>{
    console.log("当前巡检任务id为：" + id)
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/deleteTaskByTaskId/' + id,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //用户方用户确认巡检完成
  confirmFinished=(imcTaskId)=>{
    const data = {
      status:5,
      taskId:imcTaskId
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/modifyTaskStatusByTaskId',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(data)
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          alert("巡检任务已经确认完成！")
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //用户方付款
  payImcTask=(imcTaskId)=>{
    const data = {
      status:6,
      taskId:imcTaskId
    }
    axios({
      method: 'POST',
      url: '/imc/inspectionTask/modifyTaskStatusByTaskId',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(data)
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data)
          alert("巡检任务付款成功！")
          this.getInfo(FIRST_PAGE)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //获取任务的评价
  getTaskReview = (taskId)=>{
    axios({
      method: 'GET',
      url: '/imc/inspectionReview/getReviewByTaskId/' + taskId,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(JSON.stringify(res.data.result))
          this.setState({
            reviewRank:res.data.result.score,
            reviewContent:res.data.result.contents,
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //返回不同的状态按钮

  render(){
    const {
      data,
      nowCurrent,
      size, 
      status,
    } = this.state;
    const current = nowCurrent+1
    const limit = size

    return(
      
      <div>
          
        <div className="searchPart">
          <Row>
            {/* <Col span={2}>巡检人姓名：</Col> */}
            {/* <Col span={5}>
              <Search
                placeholder="搜索从这里开始"
                enterButton
                onSearch={value => this.selectActivity(value)}
              />
            </Col> */}
          </Row> 
        </div>
        <Table
          className="group-list-module"
          bordered
          showHeader={true}
          size='small'
          scroll={{x: 1500}}
          pagination={{
            // current,
            pageSize: limit,
            defaultCurrent:1,
            total:this.state.total,
            current:this.state.current,
            onChange: (page,pageSize)=>{
              console.log('current page:',page)
              this.setState({
                current:page
              })
              this.getInfo(page);
            },
            // showTotal: () => `共${allCount} 条数据`
          }}
          rowClassName={this.setRowClassName}
          dataSource={data}
          columns={[
          //   {
          //   title: 'ID ',
          //   key: 'id',
          //   render: (text, record) => {
          //     return ((record.id && record.id) || '--')
          //   }   
          // }, 
            {
              title:'序号',
              width:50,
              fixed:'left',
              render:(text,record,index)=> `${index+1}`,
            },
            {
              title: '任务名称',
              key: 'taskName',
              render: (text, record) => {
                return (record.taskName && record.taskName) || '--'
              }
            },{
              title: '任务唯一编号 ',
              key: 'id',
              width: 180,
              render: (text, record) => {
                return (record.id && record.id) || '--'
              }
            },{
              title: '应巡检点位数',
              key: 'pointSum',
              width: 110,
              render: (text, record) => {
                return ((record.pointSum && record.pointSum) || '--')+'（个）'
              }
            },{
              title: '已安排点位数',
              key: 'alreadyPoint',
              width: 110,
              render: (text, record) => {
                return ((record.alreadyPoint && record.alreadyPoint) || '--')+'（个）'
              }
            },{
              title: '项目名称', 
              key: 'projectName',
              render: (text, record) => {
                return (record.projectName && record.projectName) || '--'
              }
            },{
              title: '审核人',
              key: 'principalName',
              width: 80,
              render: (text, record) => {
                return (record.principalName && record.principalName) || '--'
              }
            },{
              title: '服务商',
              key: 'facilitatorName',
              render: (text, record) => {
                return (record.facilitatorName && record.facilitatorName) || '--'
              }
            },{
              title: '任务类型',
              key: 'inspectionType',
              render: (text, record) => {
                var type = record.inspectionType;
                if (type) {
                  type = type === 1 ? '计划巡检' : '临时巡检';
                }
                return (type) || '--'
              }
            },
            // {
            //   title: '合同ID',
            //   key: 'contractId',
            //   render: (text, record) => {
            //     return (record.contractId && record.contractId) || '--'
            //   }
            // },
            {
              title: '操作',
              fixed:'right',
              render: (text, record, index) => (
                <div className="operate-btns"
                  style={{ display: 'block' }}
                >
                  {this.state.role!==null && this.state.role.includes('服务商') 
                  && (this.props.location.pathname==='/cbd/inspection/appoint')
                  && <Link
                    to={{
                      pathname:`/cbd/item/waitForMaintainer/${record.id}/${record.status}`,
                      query: data[index],
                    }}
                    style={{marginRight:'12px'}}
                  >安排任务<Badge count={(record.pointSum - record.alreadyPoint)<0 ? 0 : (record.pointSum - record.alreadyPoint)}></Badge></Link>} 
                  <Link
                    to={`/cbd/imcTaskInfo/log/${record.id}`}
                    style={{marginRight:'12px'}}
                  >巡检日志</Link>
                  <Link
                    to={`/cbd/imcTaskInfo/detail/${record.id}`}
                    style={{marginRight:'12px'}}
                  >详情</Link> 
                  {/*
                  <Popconfirm
                    title="确定同意该巡检任务的执行？"
                    onConfirm={()=> {this.approveImcTaskByA(record.id)}}
                  >
                    <Button 
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button1}}
                    >同意执行</Button>
                  </Popconfirm>  
                  <Popconfirm
                    title="确定否决该巡检任务的执行？"
                    onConfirm={()=> {this.denyImcTaskByA(record.id)}}
                  >
                    <Button 
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button2}}
                    >否决执行</Button>
                  </Popconfirm>      
                  <Popconfirm
                    title="确定接单？"
                    onConfirm={()=> {this.acceptImcTaskByB(record.id)}}
                  >
                    <Button 
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button3}}
                    >接单</Button>
                  </Popconfirm>  
                  <Popconfirm
                    title="确定拒单？"
                    onConfirm={()=> {this.denyImcTaskByB(record.id)}}
                  >
                    <Button 
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button7}}
                    >拒单</Button>
                  </Popconfirm> 
                  <Popconfirm
                    title="确认巡检结果？"
                    onConfirm={()=> {this.confirmFinished(record.id)}}
                  >
                    <Button 
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button4}}
                    >确认完成</Button>
                  </Popconfirm>  
                  <Popconfirm
                    title="确定付款？"
                    onConfirm={()=> {this.payImcTask(record.id)}}
                  >
                    <Button 
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button5}}
                    >付款</Button>
                  </Popconfirm> 
                  <Link
                    to={`/cbd/imcTaskInfo/review/${record.id}`}
                    style={{marginRight:'12px',display:this.state.display_button6}}
                  >服务评价</Link>  
                  <Popconfirm
                    title="确定删除该任务？"
                    onConfirm={()=> {this.deleteTask(record.id)}}
                  >
                    <Button 
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button8}}
                    >删除</Button>
                  </Popconfirm> 
                  <Popover 
                    content={
                      <div>
                        <TextArea rows={4} value={this.state.reviewContent} />
                        <Rate value = {this.state.reviewRank}></Rate>
                      </div>
                    } 
                    title="任务评价情况"
                    trigger="click"
                  >
                    <Button 
                      onClick={()=>{this.getTaskReview(record.id)}}
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button9}}
                    >查看评论</Button>
                  </Popover> */}
                </div>
              ),
            }]}
        />
      </div>  
    )
  }
}
export default Inspection;