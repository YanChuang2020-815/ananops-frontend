import React, { Component, } from 'react';
import { Button,Table,Input,Popconfirm,Drawer,Modal,Divider,message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import AMap from 'AMap'
import ProjectNew from'../../project/Create/index'
import ProjectDetail from'../../project/Detail/index'
import InspectionNew from'../../inspection/Create/index'
import InspectionDetail from'../../inspection/Detail/index'

const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;
let marker //打点
class Management extends Component{
    constructor(props){
        super(props)
        this.state={
          token:window.localStorage.getItem('token'),
          loginAfter:window.localStorage.getItem('loginAfter'),
          role:window.localStorage.getItem('role'),
          current: FIRST_PAGE,
          // size: PAGE_SIZE,
          // total: 20, 
          // nowCurrent:FIRST_PAGE,
          data:[],
          projectData:[],
          inspectionData: [],
          contractDetail: {},
          projectDetail: {},
          inspectionDetail: {},
          partA:null,
          partB:null,
          roleCode:window.localStorage.getItem('roleCode'),
          troubleButton: 'none',
          troubleModalVisible: false,
          troubleModalConfirmLoading: false,
          mapVisible:false,
          position:[], //打点位置
          addressName:'', //位置名称
          type:'',//故障类型
          address:'',
          searchText: '',
          searchedColumn: '',
          // 控制抽屉显示
          visible: false,
          // 项目列表页切换展示
          tabView: 0,
          // 巡检方案列表页切换展示
          inspeTabView: 0,
          childrenDrawer: false
        }
        this.resultRef=React.createRef()
        this.getGroupList = this.getGroupList.bind(this);
    }

    initProjectsColumns = () => {
      this.projectColumns = [
        {
          title:'序号',
          width:50,
          fixed:'left',
          render:(text,record,index)=> `${index+1}`,
        },{
          title: '项目名称',
          key: 'projectName',
          dataIndex:'projectName',
          ...this.getColumnSearchProps('projectName'),
          render: (text, record) => {
          return (record.projectName && record.projectName) || '--'
          }
        },{
          title: '项目ID',
          key: 'id',
          render: (text, record) => {
          return ((record.id && record.id) || '--')
          }   
        },{
          title: '类型',
          key: 'projectType',
          dataIndex:'projectType',
          filters: [
            { text: '维修项目', value: '维修项目' },
            { text: '巡检项目', value: '巡检项目' },
            { text: '其他项目', value: '其他项目' },
          ],
          filterMultiple: false,
          onFilter: (value, record) => record.projectType.indexOf(value) === 0,
          render: (text, record) => {
            return (record.projectType && record.projectType) || '--'
          }
        },{
          title: '状态',
          key: 'isDestroy',
          filters: [
            { text: '有效', value: 0 },
            { text: '作废', value: 1 },
          ],
          filterMultiple: false,
          onFilter: (value, record) => record.isDestroy === value,
          render: (text, record) => {
            return  record.isDestroy==0?'有效':'作废' || '--'
          }
        },{
          title: '合同',
          key: 'isContract',
          filters: [
            { text: '无', value: 0 },
            { text: '有', value: 1 },
          ],
          filterMultiple: false,
          onFilter: (value, record) => record.isContract === value,
          render: (text, record) => {
            return record.isContract==0?'无':'有' || '--'
          }
        },{
          title: '操作',
          render: (text, record, index) => (
          <div className="operate-btns"
              style={{ display: 'block' }}
          >
              <Button  
                  type="simple"
                  style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                  onClick={() => {
                    this.showProjectDetail(record);
                  }}
              >详情</Button>
              {this.state.roleCode === 'user_manager' ? <span>
                <Button 
                    type="simple"
                    style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                    onClick={() => {
                      this.editProject(record);
                    }}
                >修改</Button>
                <Popconfirm
                    title="确定要删除吗？"
                    onConfirm={()=> {this.deleteProject(record)}}
                >
                    <Button 
                    type="simple"
                    style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
                    >删除</Button>
                </Popconfirm>
              </span> : ""}
              {record.projectType=="巡检项目" ?
                <Button 
                  type="simple"
                  style={{border:'none',color:"#357aff",background:'transparent'}}
                  onClick={()=>{
                      this.showChildrenDrawer(record)
                    }
                  }
                >巡检计划</Button>  :
                ""
                }
              <br/>
          </div>
          ),
        }
      ]
    }

    initInspectionColumns = () => {
      this.inspectionColumns = [
        {
          title:'序号',
          width:50,
          fixed:'left',
          render:(text,record,index)=> `${index+1}`,
        },{
          title: '巡检计划ID',
          key: 'id',
          render: (text, record) => {
            return ((record.id && record.id) || '--')
          }   
        },{
          title: '计划名称', 
          key: 'taskName',
          render: (text, record) => {
            return (record.taskName && record.taskName) || '--'
          }
        },
        // {
        //   title: '计划类型', 
        //   key: 'taskType',
        //   filters: [
        //     { text: '日常巡视', value: '0' },
        //     { text: '项目配套', value: '1' },
        //     { text: '其他计划', value: '2' },
        //   ],
        //   filterMultiple: false,
        //   onFilter: (value, record) => record.taskType.indexOf(value) === 0,
        //   render: (text, record) => {
        //     var type = record.taskType;
        //     if (type !== null || type != undefined) {
        //       type = type === '0' ? '日常巡视' : (type === '1') ? '项目配套' : '其他计划';
        //     }
        //     return (type && type) || '--'
        //   }
        // }
        ,{
          title: '巡检内容',
          key: 'inspectionContent',
          dataIndex:'inspectionContent',
          ...this.getColumnSearchProps('inspectionContent'),
          render: (text, record) => {
            return (record.inspectionContent && record.inspectionContent) || '--'
          }
        },{
          title: '巡检周期', 
          key: 'cycleTime',
          render: (text, record) => {
            return ((record.cycleTime && record.cycleTime) || '--')+'（天）'
          }
        },{
          title: '持续时间',
          key: 'scheduledFinishTime',
          render: (text, record) => { 
            return ((record.scheduledFinishTime && record.scheduledFinishTime) || '--')+'（天）'
          }
        },{
          title: '总点位数',
          key: 'pointSum',
          render: (text, record) => { 
            return ((record.pointSum && record.pointSum) || '--')+'（个）'
          }
        },{
          title: '操作',
          width: 90,
          render: (text, record, index) => (
            <div className="operate-btns"
              style={{ display: 'block' }}
            >
              <Button 
                  type="simple"
                  style={{border:'none',color:"#357aff",background:'transparent'}}
                  onClick={() => {
                    this.showInspectionDetail(record);
                  }}
              >详情</Button>    
              {this.state.roleCode === 'user_manager' ? <span>
                <Button 
                    type="simple"
                    style={{border:'none',color:"#357aff",background:'transparent'}}
                    onClick={() => {
                      this.editInspection(record);
                    }}
                >修改</Button>
                <Popconfirm
                  title="确定要删除吗？"
                  onConfirm={()=> {this.deleteInspection(record)}}
                >
                  <Button 
                    type="simple"
                    style={{border:'none',color:"#357aff",background:'transparent'}}
                  >删除</Button>
                </Popconfirm> 
              </span> : ""}
            </div>
          ),
        }]
    }

    componentDidMount(){
      // this.getGroupList(FIRST_PAGE); 
      //保存当前页面的路由路径
      this.getGroupList();
      this.initProjectsColumns();   
      this.initInspectionColumns();
      if(this.state.roleCode.startsWith("user") && this.state.roleCode != "user"){
        this.setState({troubleButton:'block'});
      }
    }

    componentWillUnmount() {
      marker = 0
    }

    showDrawer = (record) => {
      this.getProjectsList(record.id);
      this.setState({
        visible: true,
        contractDetail: record,
      });
    };

    newProject = () => {
      this.setState({
        tabView: 1,
        projectDetail: {},
      });
    };
    
    newInspection = () => {
      this.setState({
        inspeTabView: 1,
        inspectionDetail: {},
      });
    };

    editProject = (record) => {
      this.setState({
        tabView: 1,
        projectDetail: record,
      });
    };

    editInspection = (record) => {
      this.setState({
        inspeTabView: 1,
        inspectionDetail: record,
      });
    };

    backToTable = (constractId) => {
      this.getProjectsList(constractId);
      this.setState({
        tabView: 0,
      });
    }

    backToInspectionTable = (projectId) => {
      this.getInspectionList(projectId);
      this.setState({
        inspeTabView: 0,
      });
    }

    showProjectDetail = (record) => {
      this.setState({
        tabView: 2,
        projectDetail: record,
      });
    }

    showInspectionDetail = (record) => {
      this.setState({
        inspeTabView: 2,
        inspectionDetail: record,
      });
    }
  
    onClose = () => {
      this.setState({
        visible: false,
      });
    };
  
    showChildrenDrawer = (record) => {
      this.getInspectionList(record.id);
      this.setState({
        childrenDrawer: true,
        projectDetail: record,
      });
    };

    //获取项目下的全部巡检列表信息
    getInspectionList = (id) => {
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/getTasksByProjectId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer ' + this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){
            console.log(res)
            this.setState({
              inspectionData: res.data.result,
            }) ;
            // console.log(this.state.data)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }
  
    onChildrenDrawerClose = () => {
      this.setState({
        childrenDrawer: false,
      });
    };
    //搜索
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon='<SearchOutlined />'
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    清空
                </Button>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    //分页
    handlePageChange = (page) => {
      this.getGroupList(page-1)
    }

    //获取信息列表 无分页
    getProjectsList = (contractId) => {
      const id=JSON.parse(this.state.loginAfter).loginAuthDto.groupId
      const role = this.state.role
      if(role!=null && role.includes("平台"))
      {
          axios({
              method: 'POST',
              url: '/pmc/project/getProjectListWithPage',
              headers: {
                'Content-Type':'application/json',
                'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
              },
              data:JSON.stringify({
                'baseQuery':null
              })
            })
          .then((res) => {
              if(res && res.status === 200){
              console.log(res)
              this.setState({
                projectData: res.data.result.list,
              }) ;
              }
          })
          .catch(function (error) {
              console.log(error);
          });
      }else{
          axios({
              method: 'POST',
              url: '/pmc/project/getProjectByContractId/'+contractId,
              headers: {
                 'deviceId': this.deviceId,
                'Authorization':'Bearer '+this.state.token,
              },
            })
          .then((res) => {
              if(res && res.status === 200){
              console.log(res)
              this.setState({
                projectData: res.data.result,
              }) ;
              console.log("当前合同信息：" + contractId)
              // console.log(this.state.data)
              }
          })
          .catch(function (error) {
              console.log(error);
          });
      }
  }

     //获取信息列表 无分页
     getGroupList = () => {
      //从父组件获取用户的登录组织信息
      const id=JSON.parse(this.state.loginAfter).loginAuthDto.groupId
      const role = this.state.role
      if(role!=null && role.includes("平台"))
      {
        axios({
          method: 'POST',
          url: '/pmc/contract/getContractListWithPage',
          headers: {
            'Content-Type':'application/json',
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
          },
          data:JSON.stringify({
            'baseQuery':null
          })
        })
        .then((res) => {
          if(res && res.status === 200){
          this.setState({
              data: res.data.result.list,
          }) ;
          console.log(this.state.data)
          }
        })
        .catch(function (error) {
            console.log(error);
        });
      }else{
        axios({
          method: 'POST',
          url: '/pmc/contract/getContractListByGroupId/'+id,
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
      
  }
  // 删除该合同
  deleteContract=(record)=>{
      console.log(record)
      axios({
          method:'POST',
          url:'/pmc/contract/deleteContractById/'+record.id,
          headers:{
              'deviceId': this.deviceId,
              'Authorization':'Bearer '+this.state.token,
          }           
      }) 
      .then((res) => {
          if(res && res.status === 200){
          console.log(res.data.result)
          // this.getGroupList(this.state.nowCurrent)
          this.getGroupList()
          }
      })
      .catch(function (error) {
        message.error('删除失败，请先删除与该合同关联的项目');
        console.log(error);
      });
  }

  //删除该项目
  deleteProject=(record)=>{
    console.log(record)
    axios({
        method:'POST',
        url:'/pmc/project/deleteProjectById/'+record.id,
        headers:{
            'deviceId': this.deviceId,
            'Authorization':'Bearer '+this.state.token,
        }           
    }) 
    .then((res) => {
        if(res && res.status === 200){
          this.getProjectsList(record.contractId);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
    this.backToTable(record.contractId);
  }
  // 删除一条巡检方案记录
  deleteInspection=(record)=>{
    axios({
      method:'POST',
      url:'/pmc/InspectDevice/deleteTaskById/'+record.id,
      headers:{
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      }           
    }) 
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data.result)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
      this.backToInspectionTable(record.projectId);
  }

  //用户方ID
  partA=(e)=>{
    this.setState({
      partA:e.target.value
    })
  }
  partB=(value)=>{
    this.setState({
      partB:value.target.value
    })
  }

  //甲、服务方搜索
  search(partyName,who){
    // const{partA,partB}=this.state
    var baseQueryUrl;
    if(partyName === "" && this.state.role != null && this.state.role.includes("平台")){
      axios({
        method: 'POST',
        url: '/pmc/contract/getContractListWithPage',
        headers: {
          'Content-Type':'application/json',
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:JSON.stringify({
          'baseQuery':null
        })
      })
      .then((res) => {
        if(res && res.status === 200){
        this.setState({
            data: res.data.result.list,
        }) ;
        console.log(this.state.data)
        }
      })
      .catch(function (error) {
          console.log(error);
      });
    }else{
      if(who === 'A'){
        baseQueryUrl = '/pmc/contract/getContractListByLikePartyAName/'
      }else if(who === 'B'){
        baseQueryUrl = '/pmc/contract/getContractListByLikePartyBName/'
      }
      axios({
        method: 'POST',
        url: baseQueryUrl+partyName,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
      .then((res) => {
          if(res && res.status === 200){
          console.log(res.data.result)
          this.setState({
              data: res.data.result,
            //  nowCurrent:0
          }) ;
          console.log(this.res.data.result)
          }
      })
      .catch(function (error) {
          console.log(error);
      });
    }
    
  }

  //重置
  blur=()=>{
    this.setState({
      partA:null,
      partB:null
    })
  // this.getGroupList(0)
   this.getGroupList()
  }

  showModal = () =>{
    this.setState({
      troubleModalVisible: true,
    });
  };

  handleOk = () =>{
    this.setState({
      troubleModalConfirmLoading: true,
    });

  };
  
  handleCancel =()=>{
    this.setState({
      troubleModalVisible:false,
    });
  }

  //故障信息录入显示
  showMapModule=()=>{
    var position=[]
 //   var address=''
    this.setState({
      mapVisible:true
    })
    var map = new AMap.Map('container', {
    zoom:13,
    center: [116.397428, 39.90923],//中心点坐标
    });
    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],()=>{
      var autoOptions = {
        // 城市，默认全国 
        city: "北京",
        // 使用联想输入的input的id
        input: "input"
      }
      var autocomplete= new AMap.Autocomplete(autoOptions)
    
      var placeSearch = new AMap.PlaceSearch({
        city:'北京',
        map:map,
        pageSize: 1,//每页显示多少行
        pageIndex: 1,//显示的下标从那个开始
        panel: "result"//服务显示的面板
      })
      AMap.event.addListener(autocomplete, 'select', function(e){
        //TODO 针对选中的poi实现自己的功能
        placeSearch.search(e.poi.name)
      })
      AMap.event.addListener(placeSearch,'listElementClick',(e)=>{
        position=[e.data.location.lng,e.data.location.lat]
      //  address=''
        this.setState({
          position : position,
        //  address : address
        })
      })
     })
  }

  //故障信息录入确定
  mapModuleConfirm=()=>{
    const {position,addressName,type,loginAfter}=this.state
    var detail={}
    var tem=[]
    detail.userId=JSON.parse(loginAfter).loginAuthDto.userId
    tem=[type]
    detail.troubleTypeList=tem
    var troubleInfo={}
    troubleInfo.troubleAddress=addressName
    troubleInfo.troubleLatitude=position[0]
    troubleInfo.troubleLongitude=position[1]
    tem=[troubleInfo]
    detail.troubleAddressList=tem
    axios({
      method: 'POST',
      url: '/mdmc/mdmcTask/saveTroubleTypeAndAddress',
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:detail
    })
    .then((res) => {
        if(res && res.status === 200){
        console.log(res.data.result)
        this.setState({
          mapVisible:false,
          position:[],
          addressName:'',
          type:'',
          address:'',
        })
        // document.getElementById('result').innerHTML = ""
        this.resultRef.current.innerHTML = null
        }
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  //关闭故障信息显示
  closeMapModule=()=>{
    this.setState({
      mapVisible:false,
      position:[],
      addressName:'',
      type:'',
      address:'',
    })
    this.resultRef.current.innerHTML = null
  }

  //初始化地图
  initMapPoint=()=>{
    var marker=0
    this.map = new AMap.Map('container', {
      center: [116.397428, 39.90923],//中心点坐标
    });
    //监听双击事件
    this.map.on('click', (e) => {
      console.log(`您点击了地图的[${e.lnglat.getLng()},${e.lnglat.getLat()}]`)
      var position=[e.lnglat.getLng(),e.lnglat.getLat()]
      this.setState({ point: position })
      if (marker) {
        marker.setPosition(position)
      }
      marker = new AMap.Marker({
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: position
      });
      marker.setMap(this.map);
    })
  }
 
  //地理位置名称
    setAddressName=(val)=>{
      console.log(val.target.value)
      this.setState({
        addressName:val.target.value
      })
    }
    //地理位置
    setAddress=(val)=>{
      console.log(val.target.value)
      this.setState({
        address:val.target.value
      })
    }
  //故障类型
  setType=(e)=>{
    this.setState({
      type:e.target.value
    })
  }
    render(){
      const {
        data,
        // nowCurrent,
        // size,
        projectData,
        contractDetail,
        tabView,
        projectDetail,
        inspeTabView,
        inspectionData,
        inspectionDetail,
        roleCode
       } = this.state;
       const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      };
      const mapContainer={
        height:'570px',
        width:'500px',
        marginLeft:'-15%',
        marginTop:'-25%',
        borderRadius:'25px',
        zIndex:99,
        display:'',
        position:'fixed',
        top: '50%',
        left: '50%',
      }
      const mapHidden={
        display:'none'
      }
      const setAble={
        content:'',
        background:'rgba(0, 0, 0, 0.6)',
        position:'fixed',
        top:0,
        left:0,
        right:0,
        bottom:0,
        zIndex:9,
        display:'',
      }
      const setUnable={
        display:'none',
      }
      // 项目列表
      const projectTable = (
        <Table
          bordered
          size="small"
          showHeader={true}
          dataSource={projectData}
          columns={this.projectColumns}
          rowKey="id"
        />
      )
      // 新建/编辑项目表单
      const newProjectForm = (
        <ProjectNew setSubmit={(form) => {
              this.form = form
          }} 
          contractDetail={contractDetail}
          projectDetail={projectDetail}
          backToTable={this.backToTable}
        />
      )
      // 项目详情
      const detailProject = (
        <ProjectDetail 
          projectId={projectDetail.id}
          backToTable={this.backToTable}
        />
      )

      // 巡检方案列表
      const inspectionTable = (
        <Table
          bordered
          size="small"
          showHeader={true}
          dataSource={inspectionData}
          columns={this.inspectionColumns}
          rowKey="id"
        />
      )
      // 新建巡检方案
      const newInspectionForm = (
        <InspectionNew setSubmit={(form) => {
            this.form = form
          }}
          projectDetail={projectDetail}
          inspectionDetail={inspectionDetail}
          backToInspectionTable={this.backToInspectionTable}
        />
      )

      // 项目详情
      const detailInspection = (
        <InspectionDetail
          inspectionDetail={inspectionDetail}
          backToInspectionTable={this.backToInspectionTable}
        />
      )

        return(
            <div>
            <Table
              className="group-list-module"
              bordered
              showHeader={true}
              size="small"
              rowClassName={this.setRowClassName}
              dataSource={data}
              rowKey={row=>row.id}
              columns={[
              {
                title:'序号',
                width:50,
                fixed:'left',
                render:(text,record,index)=> `${index+1}`,
              },
              {
                title: '合同名称',
                key: 'contractName',
                dataIndex:'contractName',
                ...this.getColumnSearchProps('contractName'),
                render: (text, record) => {
                  return (record.contractName && record.contractName) || '--'
                }
              },{
                title: '合同唯一ID',
                key: 'id',
                dataIndex:'id',
                render: (text, record) => {
                  return (record.id && record.id) || '--'
                }
              },{
                title: '合同编号',
                key: 'contractCode',
                dataIndex:'contractCode',
                ...this.getColumnSearchProps('contractCode'),
                render: (text, record) => {
                  return ((record.contractCode && record.contractCode) || '--')
                }   
              }, {
                title: '合同类型',
                key: 'contractType',
                dataIndex:'contractType',
                filters: [
                  { text: '制式合同', value: '制式合同' },
                  { text: '自定义合同', value: '自定义合同' },
                  { text: '其他', value: '其他' },
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.contractType.indexOf(value) === 0,
                render: (text, record) => {
                  return (record.contractType && record.contractType) || '--'
                }
              }, {
                title: '服务方组织名称',
                key: 'partyBName',
                  dataIndex:'partyBName',
                  ...this.getColumnSearchProps('partyBName'),
                  render: (text, record) => {
                  return (record.partyBName && record.partyBName) || '--'
                }
              },{
                title: '操作',
                render: (text, record, index) => (
                  <div className="operate-btns"
                    style={{ display: 'block' }}
                  >
                    <Link
                      to={`/cbd/pro/contract/detail/${record.id}`}
                      style={{marginRight:'12px'}}
                    >详情</Link>
                    {roleCode === 'user_manager' ? <span>
                      <Link
                        to={`/cbd/pro/contract/edit/${record.id}`}
                        style={{marginRight:'12px'}}
                      >修改</Link>
                      <Popconfirm
                          title="确定要删除吗？"
                          onConfirm={()=> {this.deleteContract(record)}}
                      >
                      <Button 
                      type="simple"
                      style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                      >删除</Button>
                      </Popconfirm>
                    </span> : ""}
                    <Button 
                        type="simple"
                        style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                        onClick={()=>{
                            this.showDrawer(record)
                          }
                        }
                    >所有项目</Button>  
                  </div>
                ),
              }]}
            />
            <div className='setUnable'  style={(this.state.mapVisible===true)?setAble:setUnable}>
            <div className='map-container' style={(this.state.mapVisible===true)?mapContainer:mapHidden}>
            <div className='title' >
              <h1 className='titile-description'>故障信息录入</h1>
             <Divider />
            </div>
            <div className='type'>
                <span className='type-name-description'>故障类型：</span>
                <Input className='type-name-entity' 
                onChange={(e)=>this.setType(e)}
                placeholder="请输入故障类型"
                value={this.state.type}
                />
              </div>
              <div className='address'>
                <span className='address-name-description'>地理位置：</span>
                <Input className='address-name-entity' 
                onChange={(e)=>this.setAddressName(e)}
                placeholder="请输入地理位置名称"
                value={this.state.addressName}
                />
              </div>
              <div className='map'>
                <div className='map-description'>选取位置：</div>
                <div className='map-entity' id="container"></div> 
                <div className='map-detail'>
                  <Input id="input" 
                  value={this.state.address} 
                  onChange={(e)=>this.setAddress(e)}
                  placeholder="请输入地址" />
                  <div id="result" ref={this.resultRef}></div>
                </div>
              </div>
              <div className='button-group'>
              <Divider/>
                <Button className='button-group-confirm'onClick={this.mapModuleConfirm}>确定</Button>
                <Button onClick={this.closeMapModule}>取消</Button>
              </div>           
              
            </div>
                         
            </div>
            <Modal
              title="故障信息录入"
              visible={this.state.troubleModalVisible}
              onOk={this.handleOk}
              confirmLoading={this.state.troubleModalConfirmLoading}
              onCancel={this.handleCancel}
            >
              <div>故障录入内容</div>
            </Modal>
            <Drawer
              title={<div>该合同下的项目列表 {roleCode === 'user_manager' ? <Button type="primary" style={{marginLeft: 20}} onClick={() => this.newProject()}>新建项目</Button> : ""}</div>}
              width={1000}
              destroyOnClose={true}
              onClose={this.onClose}
              visible={this.state.visible}
            >
              {tabView === 0 ? projectTable : (tabView === 1) ? newProjectForm : detailProject}
              <Drawer
                title={<div>该项目下的巡检计划列表 {roleCode === 'user_manager' ? <Button type="primary" style={{marginLeft: 20}} onClick={() => this.newInspection()}>新建计划</Button> : ""}</div>}
                width={1000}
                destroyOnClose={true}
                onClose={this.onChildrenDrawerClose}
                visible={this.state.childrenDrawer}
              >
                {inspeTabView === 0 ? inspectionTable : (inspeTabView === 1) ? newInspectionForm : detailInspection}
              </Drawer>
            </Drawer>
          </div>  
        )
    }
}
export default Management;