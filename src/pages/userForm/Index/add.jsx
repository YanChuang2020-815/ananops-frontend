import React,{Component} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
import axios from 'axios';

const Item = Form.Item
const { Option } = Select;

class Add extends Component{
    //接收父组件参数
    static propTypes = {
      setSubmit:PropTypes.func.isRequired,
      addDetail:PropTypes.object
    }

    constructor(props){
      super(props)
      this.state={
        groupId:JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId,
        token:window.localStorage.getItem('token'),
        projectList:[],
        projectId: ''
      }
    }
  
    componentWillMount() {
      this.props.setSubmit(this.props.form);
      this.getProjectListByGroup();
    }

    //获取巡检项目列表
    getProjectListByGroup=()=>{
      const {groupId}=this.state
      const values={groupId: groupId, projectType: "巡检项目"}
      axios({
        method: 'POST',
        url: '/pmc/project/getProjectList',
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
              projectList:res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //选择项目
    selectProject=(value)=>{
      if (value === undefined) {
        this.setState({
          projectId: ''
        })
      }
      const {projectList} = this.state;
      projectList.map(item => {
        if (item.projectName === value) {
          this.setState({
            projectId: item.id
          })
        }
      })
    }

    //获取项目名
    getOption=()=>{
      const {projectList}=this.state
      var projectitem=projectList&&projectList.map((item, index) => (
        <Select.Option key={index} value={item.projectName}> 
          {item.projectName}
        </Select.Option>
      ))
      return projectitem
    }

    render(){
      const addDetail = this.props.addDetail;
      const {projectId} = this.state;
      const formItemLayout = {
        labelCol:{span:5},
        wrapperCol:{span:15}
      }
  
      const {getFieldDecorator} = this.props.form
      return (
        <Form {...formItemLayout}>
          <Item label="模板说明">
            {getFieldDecorator('mark',{
              initialValue: addDetail.mark,
              rules:[{
                required:true,
                message:"请选择类型",
              }]
            })(
              <Input placeholder="请输入内容" /> 
            )} 
          </Item>
          <Item label="模板类型">
            {getFieldDecorator('type',{
              initialValue: addDetail.type || "system",
              rules:[{
                required:true,
                message:"请选择类型",
              }]
            })(
              <Select>
                <Option value='system'>系统</Option>
                <Option value='biz'>业务</Option>
              </Select>
            )}  
          </Item>

          <Item label="模板状态">
            {getFieldDecorator('status',{
              initialValue: addDetail.status || "Y",
              rules:[{
                required:true,
                message:"请选择状态",
              }]
            })(
              <Select>
                <Option value='Y'>有效</Option>
                <Option value='N'>无效</Option>
              </Select>
            )}  
          </Item>
          <Item label="项目名称"
            >
              {getFieldDecorator('projectName',{
                initialValue: addDetail.projectName || ''
              })(
                <Select
                  placeholder="请选择项目"
                  className="inspection-log-abnormal-select"
                  onChange={(value) => { this.selectProject(value) }}
                  allowClear
                >
                  {this.getOption()}
                </Select>
              )}  
            </Item>
            <Item label="项目编号">
            {getFieldDecorator('projectId',{
              initialValue: projectId
            })(
              <Input placeholder="请填入项目编号" disabled={true}/> 
            )} 
          </Item>
        </Form>
      )
    }
}
export default Form.create()(Add)