import React,{Component,} from 'react'
import {Button,Row,Col,Table,Input,Switch,Drawer,Modal,Badge, message} from 'antd';
import { Link } from 'react-router-dom';
import UploadPic from './uploadPic';
import AssignEngineer from '../../imcItemInfo/BindEngineer/assignEngineer'
import './index.styl'
import InspcInvoiceEdit from '../InvoiceEdit'
import axios from 'axios'
const FIRST_PAGE = 0;
const PAGE_SIZE = 10;

class InspectionItem extends Component{
  constructor(props){
    super(props)
    this.state={
      token:window.localStorage.getItem('token'),
      roleCode:window.localStorage.getItem('roleCode'),
      role:window.localStorage.getItem('role'),
      size: PAGE_SIZE,
      total: 0, 
      current:FIRST_PAGE,
      // total: 20, 
      nowCurrent:FIRST_PAGE,
      data:[],
      status:null,
      assignVisible: false,
      assignDetail: {},
      imcTaskId:null,
      imcTaskStatus:null,
      imcItemTaskDetail:null,
      display_button1:'none',
      display_button2:'none',
      display_button3:'none',
      display_button4:'none',
      maintainerId:window.localStorage.getItem('id'),
      uploadVisible:false,
      uploadDetail:{

      },
      invoiceVisible: false,
      checkIsFill: false,
      // 巡检单据列表页切换展示
      tabView: 0,
      invoiceData: [],
      invoiceDetail: {},
      invoicePreviews: []
    }
    this.getInfo=this.getInfo.bind(this)
  }
  componentDidMount(){
    const { 
      match : { params : { imcTaskId,imcTaskStatus } }
    } = this.props;
    this.setState({
      imcTaskId:imcTaskId,
      imcTaskStatus:imcTaskStatus,
    });
    this.initInvoiceColumns();
    this.getInfo(imcTaskId,imcTaskStatus,FIRST_PAGE);
  }

  getItemList = () => {
    const { size } = this.state;
    const values={orderBy:'string',pageSize:size,pageNum:FIRST_PAGE,maintainerId:this.state.maintainerId};
    axios({
      method: 'POST',
      url: '/imc/inspectionItem/getAllAcceptedItemListByMaintainer',
      headers: {
        'Content-Type':'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(values)
    })
      .then((res) => {
        if(res && res.status === 200){
          var taskItemList
          res.data.result==null?taskItemList=[]:taskItemList=res.data.result.list
          this.setState({
            data:taskItemList,
            total:res.data.result.total
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

    //获取工单对应的子项
    getInfo=(id,imcTaskStatus,page)=>{
      const { size } = this.state;
      var location = this.props.location.pathname;
      var status;
      //根据不同的url进行栏目的区分
      if(location.includes('/cbd/item/waitForMaintainer')){
        //如果当前状态是等待分配工程师
        status = 1;
        if(this.state.role && this.state.role.includes("服务商") && imcTaskStatus !=2){
          this.setState({
            display_button1:'block',
            display_button2:'none',
            display_button3:'none',
          })
        }else{
          this.setState({
            display_button1:'none',
            display_button2:'none',
            display_button3:'none',
          })
        }
        
      }
      if(location.includes('/cbd/item/waitForAccept')){
        status = 2;
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
        })
      }
      if(location.includes('/cbd/item/execute')){
        status = 3;
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
        })
      }
      if(location.includes('/cbd/item/finish')){
        status = 4;
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
        })
      }
      if(location.includes('/cbd/item/confirmed')){
        status = 5;
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'none',
        })
      }
      if(this.state.role && this.state.role.includes("维修工")&&location.includes('/cbd/inspection/waitForMaintainer'))
      {
        //如果当前是工程师账号，且处于工程师待接单状态
        this.setState({
          display_button1:'none',
          display_button2:'block',
          display_button3:'none',
        })
        const values={orderBy:'string',pageSize:size,pageNum:page,maintainerId:this.state.maintainerId,status:2};
        axios({
          method: 'POST',
          url: '/imc/inspectionItem/getItemListByMaintainerIdAndStatus',
          headers: {
            'Content-Type':'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify(values)
        })
          .then((res) => {
            if(res && res.status === 200){
              var taskItemList
              res.data.result===null?taskItemList=[]:taskItemList=res.data.result.list
              // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
              this.setState({
                data:taskItemList,
                total:res.data.result.total
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }else if(location.includes('/cbd/inspection/maintainerAccept')){
        //如果当前是工程师账号，且处于工程师已接单
        this.setState({
          display_button1:'none',
          display_button2:'none',
          display_button3:'block',
        })
        this.getItemList();
      }else if(location.includes('/cbd/inspection/alreadyAppoint')){
        const values={orderBy: "string",pageSize:size,pageNum:page,maintainerId:this.state.maintainerId,status:4}
        axios({
          method: 'POST',
          url: '/imc/inspectionItem/getAllFinishedImcItemByMaintainerId',
          headers: {
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:values
        })
          .then((res) => {
            if(res && res.status === 200){
              var taskItemList
              res.data.result==null?taskItemList=[]:taskItemList=res.data.result.list
              // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
              this.setState({
                data:taskItemList,
                total:res.data.result.total
              //   status:status,
              //  roleCode:roleCode,
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }else if(location.includes('/cbd/inspection/allItem')){
        const values = {
          orderBy: "string",
          pageSize:size,
          pageNum:page,
          maintainerId:this.state.maintainerId
        }
        axios({
          method: 'POST',
          url: '/imc/inspectionItem/getItemListByMaintainerId',
          headers: {
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:values
        })
          .then((res) => {
            if(res && res.status === 200){
              var taskItemList
              res.data.result==null?taskItemList=[]:taskItemList=res.data.result.list
              this.setState({
                data:taskItemList,
                nowCurrent:res.data.result.pageNum,
                total:res.data.result.total
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      else{
        const values={orderBy: "string",pageSize:size,pageNum:page,taskId:id,status:status}
        axios({
          method: 'POST',
          url: '/imc/inspectionItem/getAllItemListByTaskIdAndStatus',
          headers: {
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:values
        })
          .then((res) => {
            if(res && res.status === 200){
              var taskItemList
              res.data.result==null?taskItemList=[]:taskItemList=res.data.result.list
              // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
              this.setState({
                data:taskItemList,
                total:res.data.result.total
              //   status:status,
              //  roleCode:roleCode,
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    //工程师接单
    acceptImcItem=(itemId)=>{
      const data = {
        itemId:itemId
      }
      const { size } = this.state;
      axios({
        method: 'POST',
        url: '/imc/inspectionItem/acceptItemByMaintainer',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(data)
      })
        .then((res) => {
          if(res && res.status === 200){
            alert("工程师接单成功！")
            //如果当前是维修工账号
            this.setState({
              display_button1:'none',
              display_button2:'block',
            })
            const values={orderBy:'string',pageSize:size,pageNum:0,maintainerId:this.state.maintainerId,status:2};
            axios({
              method: 'POST',
              url: '/imc/inspectionItem/getItemListByMaintainerIdAndStatus',
              headers: {
                'Content-Type':'application/json',
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
              },
              data:JSON.stringify(values)
            })
              .then((res) => {
                if(res && res.status === 200){
                  var taskItemList
                  res.data.result==null?taskItemList=[]:taskItemList=res.data.result.list
                  // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
                  this.setState({
                    data:taskItemList,
                    total:res.data.result.total
                  //   status:status,
                  //  roleCode:roleCode,
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //工程师完成该巡检任务子项
    finishImcItem=(data)=>{
      data.status=4;
      const { size } = this.state;
      axios({
        method: 'POST',
        url: '/imc/inspectionItem/putResultByItemId',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(data)
      })
        .then((res) => {
          if(res && res.status === 200){
            alert("此次巡检完成！")
            this.setState({
              display_button1:'none',
              display_button2:'none',
              display_button3:'block',
            })
            const values={orderBy:'string',pageSize:size,pageNum:0,maintainerId:this.state.maintainerId};
            axios({
              method: 'POST',
              url: '/imc/inspectionItem/getAllAcceptedItemListByMaintainer',
              headers: {
                'Content-Type':'application/json',
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
              },
              data:JSON.stringify(values)
            })
              .then((res) => {
                if(res && res.status === 200){
                  var taskItemList
                  res.data.result==null?taskItemList=[]:taskItemList=res.data.result.list
                  this.setState({
                    data:taskItemList,
                    total:res.data.result.total
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //关闭模态框
    uploadCancel = e =>{
        this.setState({
            uploadVisible:false
        })
    }
    //打开模态框
    uploadModal=(id)=>{
        var info={}
        info.id=id
        this.setState({
            uploadVisible:true,
            uploadDetail:info
        })
    }
    
    //获取文件
    getAttachments(fileList) {
        var res = [];
        var size = fileList.length;
        for (var i=0; i<size; i++) {
        var attachmentId = fileList[i].response[0].attachmentId;
          res.push(attachmentId);
        }
        return res;
    }

    //确定上传
    uploadConfirm=()=>{
        this.setState({uploadVisible:false})
        const values = this.form.getFieldsValue() 
        if (values.attachmentIds != undefined) {
            var fileList = values.attachmentIds.fileList;
            values.attachmentIds = this.getAttachments(fileList);
        }
        if (values.actualStartTime===undefined || values.actualStartTime ===null) {
          message.error("请选择巡检任务实际开始时间！")
          return;
        }
        if (values.actualFinishTime===undefined || values.actualFinishTime ===null) {
          message.error("请选择巡检任务实际结束时间！")
          return;
        }
        const detail = this.state.uploadDetail;
        values.itemId=detail.id;
        values.actualStartTime=values.actualStartTime.format('YYYY-MM-DD HH:mm:ss')
        values.actualFinishTime=values.actualFinishTime.format('YYYY-MM-DD HH:mm:ss')
        this.finishImcItem(values)
    }

    //获取工程师信息
    assign=(record)=>{
      var info={}
      info.id=record.id
      this.setState({
        assignVisible:true,
        assignDetail:info,
        imcItemTaskDetail:record
      })
    }

    //取消指定
    assignCancel=e=>{
      this.setState({
        assignVisible:false
      })
    }

    assignOk=e=>{
      this.setState({assignVisible:false})
      const {imcItemTaskDetail} = this.state;
      const values = this.form.getFieldsValue()
      axios({
        method: 'POST',
        url: '/spc/workorder/distributeEngineerWithImcOrder',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(values)
      })
        .then((res) => {
          if(res && res.status === 200){
            alert("工程师分配成功！")
            this.getInfo(imcItemTaskDetail.inspectionTaskId,3,FIRST_PAGE)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    initInvoiceColumns = () => {
      this.invoiceColumns = [
        {
          title:'序号',
          width:50,
          fixed:'left',
          render:(text,record,index)=> `${index+1}`,
        },{
          title: '巡检单唯一编号',
          key: 'id',
          width: 180,
          render: (text, record) => {
            return ((record.id && record.id) || '--')
          }   
        },{
          title: '点位名称', 
          key: 'pointName',
          render: (text, record) => {
            return (record.pointName && record.pointName) || '--'
          }
        },{
          title: '点位地址', 
          key: 'pointAddress',
          render: (text, record) => {
            return (record.pointAddress && record.pointAddress) || '--'
          }
        },{
          title: '巡检结论', 
          key: 'inspcResult',
          render: (text, record) => {
            return (record.inspcResult && record.inspcResult) || '--'
          }
        },{
          title: '巡检日期', 
          key: 'inspcDate',
          render: (text, record) => {
            return (record.inspcDate && record.inspcDate) || '--'
          }
        },{
          title: '操作',
          width: 90,
          fixed:'right',
          render: (text, record, index) => (
            <div className="operate-btns"
              style={{ display: 'block' }}
            >
              <Button 
                  type="simple"
                  style={{border:'none',color:"#357aff",background:'transparent'}}
                  onClick={() => {
                    this.editInvoice(record);
                  }}
              >填写</Button>
            </div>
          ),
        }]
    }

    editInvoice = (record) => {
      this.setState({
        tabView: 1,
        invoiceDetail: record
      })
    }

    onClose = () => {
      this.setState({
        invoiceVisible: false,
        checkIsFill: false
      });
    };

    getInvoiceList = (itemId, status) => {
      const values = {
        "itemId": itemId,
        "status": status
      }
      axios({
        method: 'POST',
        url: '/imc/itemInvoice/queryInvoiceList',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify(values)
      })
        .then((res) => {
          if(res && res.status === 200){
            this.setState({
              invoiceData: res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    showDrawer = (record) => {
      this.getInvoiceList(record.id, 'N');
      this.setState({
        invoiceVisible: true,
        imcItemTaskDetail: record
      });
    };

    showAlreadyFill = async () => {
      const itemId = this.state.imcItemTaskDetail.id;
      if(this.state.checkIsFill){
        this.setState({checkIsFill:false})
        this.getInvoiceList(itemId, 'N')
      }else{
        this.setState({checkIsFill:true})
        this.getInvoiceList(itemId, 'Y')
      } 
    }

    backToInvoiceTable = () => {
      const {imcItemTaskDetail, checkIsFill} = this.state;
      const status = checkIsFill===true ? 'Y' : 'N';
      this.getInvoiceList(imcItemTaskDetail.id, status);
      this.getItemList(); // 更新一下子项列表
      this.setState({
        tabView: 0,
      });
    }

    //获取巡检单据预览
    getInvoicePreview=(id)=>{
      const{token}=this.state
      axios({
        method: 'GET',
        url: '/imc/itemInvoice/getInvoicePreview/' + id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
      })
      .then((res) => {
          if(res && res.status === 200){   
            var arr=[]  
            console.log("巡检报告url：")
            console.log(res.data)
            res.data.result&&res.data.result.filter((e,index)=>{
              arr[index]=e.url
            })
            this.setState({
              invoicePreviews:arr
            })  
            if(null!=arr[0])
              window.location.href=arr[0];
            else
              alert("巡检单据不存在或未生成，完成全部点位后生成！")
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    }

    render(){
      const {
        data,
        nowCurrent,
        size, 
        tabView,
        uploadDetail,
        assignDetail,
        invoiceData,
        invoiceDetail,
      } = this.state;
      const current = nowCurrent+1;
      const limit = size;

      // 巡检单据列表
      const invoiceTable = (
        <Table
          bordered
          size="small"
          showHeader={true}
          dataSource={invoiceData}
          columns={this.invoiceColumns}
          rowKey="id"
        />
      )

      // 编辑巡检单据
      const inspecInvoiceEdit = (
        <InspcInvoiceEdit setSubmit={(form) => {
          this.form = form
        }}
        invoiceDetail={invoiceDetail}
        backToInvoiceTable={this.backToInvoiceTable}
      />
      )

      return( 
        <div>
          <div className="searchPart">
            <Row>            
              <Col span={3}>
                
              </Col>
              {/* <Col span={3}>任务子项状态：</Col> */}
              <Col push={17}>
             </Col>
            </Row> 
          </div>
          <Table
            className="group-list-module"
            bordered
            showHeader={true}
            size='small'
            scroll={{ x: 1500 }}
            pagination={{
              pageSize: limit,
              defaultCurrent:1,
              total:this.state.total,
              current:this.state.current,
              onChange: (page,pageSize)=>{
                let imcTaskId = this.state.data.imcTaskId;
                let imcTaskStatus = this.state.data.imcTaskStatus;
                this.setState({
                  current:page
                })
                this.getInfo(imcTaskId,imcTaskStatus,page);
              },
            }}
            rowClassName={this.setRowClassName}
            dataSource={data}
            columns={[
            {
              title:'序号',
              width:50,
              fixed:'left',
              render:(text,record,index)=> `${index+1}`,
            },{
              title: '子项ID  ',
              key: 'id',
              width: 180,
              render: (text, record) => {
                return ((record.id && record.id) || '--')
              }   
            }, {
              title: '子项名称',
              key: 'itemName',
              width: 140,
              render: (text, record) => {
                return ((record.itemName && record.itemName) || '--')
              }   
            },{
              title: '循环周期',
              key: 'frequency',
              width: 80,
              render: (text, record) => {
                return ((record.frequency && record.frequency) || '--')+'（天）'
              }
            },{
              title: '持续时间',
              key: 'days',
              width: 80,
              render: (text, record) => {
                return ((record.days && record.days) || '--')+'（天）'
              }
            },{
              title: '点位数量', 
              key: 'count',
              width: 80,
              render: (text, record) => {
                return ((record.count && record.count) || '--')+'（个）'
              }
            },{
              title: '点位位置', 
              key: 'location',
              width: 140,
              render: (text, record) => {
                return (record.location && record.location) || '--'
              }
            },{
              title: '内容描述 ',
              key: 'description',
              render: (text, record) => {
                return (record.description && record.description) || '--'
              }
            },{
              title: '实际开始时间 ',
              key: 'actualStartTime',
              width: 170,
              render: (text, record) => {
                return (record.actualStartTime && record.actualStartTime) || '--'
              }
            },{
              title: '实际完成时间',
              key: 'actualFinishTime',
              width: 170,
              render: (text, record) => {
                return (record.actualFinishTime && record.actualFinishTime) || '--'
              }
            },{
              title: '操作',
              width: 160,
              fixed:'right',
              render: (text, record, index) => (
                <div className="operate-btns"
                  style={{ display: 'block' }}
                >
                  <Link
                    to={`/cbd/imcItemInfo/log/${record.inspectionTaskId}/${this.state.imcTaskStatus}/${record.id}`}
                    style={{marginRight:'12px'}}
                  >子项日志</Link>
                  <Link
                    to={`/cbd/imcItemInfo/detail/${record.inspectionTaskId}/${this.state.imcTaskStatus}/${record.id}`}
                    style={{marginRight:'12px'}}
                  >详情</Link>
                  {(record.status===4||record.status===5) ? <Button 
                    onClick={()=>{this.getInvoicePreview(record.id)}}
                    type="simple"
                    style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                  >巡检单据预览</Button> : ""}
                  {/* <Link
                    to={`/cbd/imcItemInfo/bindEngineer/${this.state.imcTaskId}/${this.state.imcTaskStatus}/${record.id}`}
                    style={{marginRight:'12px',display:this.state.display_button1}}
                  >分配工程师</Link> */}
                  <Button 
                    type="simple"
                    style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px',display:this.state.display_button1}}
                    onClick={()=>{this.assign(record)}}
                  >分配工程师</Button>
                  {/* <Link
                      to={`/cbd/imcItemInfo/bindEngineer/${this.state.imcTaskId}/${record.id}`}
                      style={{marginRight:'12px',display:this.state.display_button1}}
                    >发起维修维护申请</Link> */}
                  {/* <Popconfirm
                    title="确定接单？"
                    onConfirm={()=> {this.acceptImcItem(record.id)}}
                  >
                    <Button 
                      type="simple"
                      style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button2}}
                    >接单</Button>
                  </Popconfirm>  */}
                  {<span><Button 
                    type="simple"
                    style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button3}}
                    onClick={()=>this.showDrawer(record)}
                  >巡检单据<Badge count={record.result==='finish'?"0":record.result}></Badge></Button> {record.result==='finish' ? <Button 
                    type="simple"
                    style={{marginRight:'12px',border:'none',padding:0,color:"#357aff",background:'transparent',display:this.state.display_button3}}
                    onClick={()=>this.uploadModal(record.id)}
                  >完成巡检</Button> : ""}</span>}
                </div>
              ),
            }
            ]}
          />
          <Modal
            title="完成该巡检任务信息"
            visible={this.state.uploadVisible}
            onOk={this.uploadConfirm}
            onCancel={this.uploadCancel}
            >
              <UploadPic setUpload={(form)=>{this.form = form}}  uploadDetail={uploadDetail}/>
          </Modal>
          <Modal
            title="分配工程师"
            visible={this.state.assignVisible}
            onOk={this.assignOk}
            onCancel={this.assignCancel}
          >
            <AssignEngineer setAssign={(form)=>{this.form = form}} assignDetail={assignDetail}/>
          </Modal>
          <Drawer
              title={tabView === 0 ? <div>所需填写的巡检单据列表 <span style={{marginLeft: 40}}><Switch defaultChecked={this.state.checkIsFill} checked={this.state.checkIsFill} onChange={this.showAlreadyFill}/> 已填写</span></div> : "请逐项填写巡检记录单"}
              width={1000}
              destroyOnClose={true}
              onClose={this.onClose}
              visible={this.state.invoiceVisible}
            >
              {tabView === 0 ? invoiceTable : inspecInvoiceEdit}
            </Drawer>
        </div>  
      )
    }
}
export default InspectionItem