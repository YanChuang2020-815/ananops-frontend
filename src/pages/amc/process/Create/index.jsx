import React, {Component,} from 'react';
import {Form, Input, Select, Button, message, DatePicker, Radio} from 'antd';
import axios from 'axios'
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import 'moment/locale/zh-cn';

const token = window.localStorage.getItem('token')


class WorkOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginAfter: window.localStorage.getItem('loginAfter'),
      workOrderDetail: {},
      projectList:[],

    }

  }

  componentDidMount() {
    const {
      match: {params: {id}}
    } = this.props

  }

  getProjectListByGroupId() {
    const groupId = JSON.parse(this.state.loginAfter).loginAuthDto.groupId
    axios({
      method: 'POST',
      url: '/pmc/project/getProjectListByGroupId/'+groupId,
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization': 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          this.setState({
            projectList: res.data.result,
          }) ;
        }
        console.log(res.data.result)
      })
      .catch(function (error) {
        console.log(error);
      });

  }

    handleSubmit = e => {
      e.preventDefault();
      const {
        form,
        history,
        match: {params: {id}},
      } = this.props
      const {getFieldValue} = form;
      const values = form.getFieldsValue()
      if (!getFieldValue('title')) {
        message.error('请填写维修维护任务名称')
      }
      if (!getFieldValue('level')) {
        message.error('请填写故障等级')
      }
      if (!getFieldValue('call')) {
        message.error('请填写联系方式')
      }
      values.appointTime = getFieldValue('appointTime').format('YYYY-MM-DD HH:mm:ss')
      axios({
        method: 'POST',
        url: '/amc/alarm/saveTask',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization': 'Bearer ' + token,
        },
        data: JSON.stringify(values)
      })
        .then((res) => {
          if (res && res.status === 200) {
            history.push('/cbd/amc/process')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    render() {
      const createFormItemLayout = {
        labelCol: {span: 8},
        wrapperCol: {span: 8},
      }
      // const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
      // const {
      //     // form: {getFieldDecorator},
      //     match: {params: {id}}
      // } = this.props
      // const {workOrderDetail,} = this.state
      return (
        <div>
          <Form
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              {...createFormItemLayout}
              label="维修任务名称"
            >
              <Input placeholder="请输入维修维护任务名称"/>
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="故障等级"
            >
              <Input placeholder="请输入故障等级"/>
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="挂载项目"
            >
              <Input placeholder="请输入故障等级"/>
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="预约时间"
            >
              <DatePicker
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择开始时间"
                showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
              />
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="联系方式"
            >
              <Input placeholder="联系方式"/>
            </Form.Item>

            <section className="operator-container">
              <div style={{textAlign: "center"}}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="default"
                >发起工单
                </Button>
                <Button
                  style={{marginLeft: "28px"}}
                  size="default"
                  onClick={() => {
                    const {
                      history,
                    } = this.props
                    history.push('/cbd/amc/process')
                  }}
                >取消
                </Button>
              </div>
            </section>
          </Form>
        </div>
      )
    }
}

export default WorkOrder