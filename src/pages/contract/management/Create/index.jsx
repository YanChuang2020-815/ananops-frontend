import React, {Component,} from 'react';
import {Form,Input,Select,Button, message,DatePicker,Radio,Icon,Upload} from 'antd';
import {Link} from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/zh_CN';
import querystring from 'querystring';

const { Option } = Select;
const token = window.localStorage.getItem('token')

let timeout;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  
  function fake() {
    axios({
      method: 'POST',
      url: '/spc/company/getSpcCompanyByLikeName/' + value,
      headers: {
        'deviceId': this.deviceId,
        'Authorization': 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          const resData = [];
          res.data.result.forEach(r => {
            resData.push({
              value: r.id,
              text: r.groupName + ',' + r.legalPersonName,
            });
          });
          callback(resData);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  timeout = setTimeout(fake, 300);
}

class ProjectNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractDetail: {},
      data: [],
      value: undefined,
      legalPersonData: [],
      fileType: '',
    }
  }
  componentDidMount() {
    const {match: {params: {id}}} = this.props
    if (id) {
      axios({
        method: 'POST',
        url: '/pmc/contract/getContractById/' + id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization': 'Bearer ' + token,
        },
      })
        .then((res) => {
          if (res && res.status === 200) {
            this.setState({
              contractDetail: res.data.result
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
    handleResult = value => {
      const data = [];
      const legalPersonData = [];
      value.forEach(r => {
        var companyName = r.text;
        data.push({
          value: r.value,
          text: companyName.substring(0,companyName.indexOf(',')),
        });
        legalPersonData.push({
          value: r.value,
          text: companyName.substring(companyName.indexOf(',')+1, companyName.length),
        });
      });
      this.setState({ data });
      this.setState({ legalPersonData });
    }
    handleSearch = value => {
      if (value) {
        fetch(value, res => this.handleResult(res));
      } else {
        this.setState({ data: [] });
      }
    };
    getCompanyInfo = value => {
      var groupName = undefined;
      this.state.data.map(d => {
        if (d.value === value) {
          groupName = d.text;
        }
      });
      var legalPersonName = undefined;
      this.state.legalPersonData.map(d => {
        if (d.value === value) {
          legalPersonName = d.text;
        }
      });
      return {
        groupName: groupName,
        legalPersonName: legalPersonName,
      };
    }
    handleChangeA = value => {
      const companyInfo = this.getCompanyInfo(value);
      const {
        form,
      } = this.props
      form.setFieldsValue({
        partyAName: companyInfo.groupName,
        partyACompanyName: companyInfo.groupName,
        partyAId: value,
        alegalName: companyInfo.legalPersonName
      })
    };
    handleChangeB = value => {
      const companyInfo = this.getCompanyInfo(value);
      const {
        form,
      } = this.props
      form.setFieldsValue({
        partyBName: companyInfo.groupName,
        partyBCompanyName: companyInfo.groupName,
        partyBId: value,
        blegalName: companyInfo.legalPersonName,
      })
    };
    getAttachments(fileList) {
      var res = [];
      var size = fileList.length;
      for (var i = 0; i < size; i++) {
        if(fileList[i].response[0].attachmentId!=null){
          var attachmentId = fileList[i].response[0].attachmentId;
          res.push(attachmentId);
        }
      }
      return res.toString();
    }
    handleSubmit = (e) => {
      e.preventDefault()
      const {
        form,
        history,
        match: {params: {id}},
      } = this.props
      const {getFieldValue} = form;
      const values = form.getFieldsValue();
      console.log("value: " + values);
      if (values.filePath != undefined) {
        let fileList = values.filePath.fileList;
        values.filePath = this.getAttachments(fileList);
      }
      if (!getFieldValue('contractCode')) {
        message.error('请填写合同编号')
      }
      if (!getFieldValue('contractName')) {
        message.error('请填写合同名称')
      }
      if (!getFieldValue('contractType')) {
        message.error('请输入合同类型')
      }
      if (!getFieldValue('partyAId')) {
        message.error('请输入用户方ID')
      }
      if (!getFieldValue('alegalName')) {
        message.error('请输入用户方法人')
      }
      if (!getFieldValue('partyAName')) {
        message.error('请输入用户方名称')
      }
      if (!getFieldValue('partyBId')) {
        message.error('请输入服务方ID')
      }
      if (!getFieldValue('partyBName')) {
        message.error('请输入服务方名称')
      }
      if (!getFieldValue('blegalName')) {
        message.error('请输入服务方法人')
      }
      if (!getFieldValue('signTime')) {
        message.error('请选择合同签订时间')
      }
      if (!getFieldValue('startTime')) {
        message.error('请选择合同开始时间')
      }
      if (!getFieldValue('endTime')) {
        message.error('请输入合同结束时间')
      }
      // if(!getFieldValue('filePath')){
      //   message.error('请输入合同存放路径')
      // }
      // if(!getFieldValue('isSparePart')){
      //   message.error('请输入服务方是否包备品备件')
      // }
      // if(!getFieldValue('isSpareService')){
      //   message.error('请输入服务方是否提供备品备件替换服务')
      // }
      if (!getFieldValue('paymentTime')) {
        message.error('请输入付款时间')
      }
      // if(!getFieldValue('paymentType')){
      //   message.error('请选择支付方式')
      // }
      // if(!getFieldValue('isChange')){
      //   message.error('请选择合同是否变更')
      // }
      // if(!getFieldValue('isDestory')){
      //   message.error('请选择合同是否作废')
      // }
      // if(!getFieldValue('isPostpone')){
      //   message.error('请选择是否自动顺延')
      // }
      if (id) {
        values.id = id
      }
      values.signTime = getFieldValue('signTime').format('YYYY-MM-DD HH:mm:ss')
      values.startTime = getFieldValue('startTime').format('YYYY-MM-DD HH:mm:ss')
      values.endTime = getFieldValue('endTime').format('YYYY-MM-DD HH:mm:ss')
      values.paymentTime = getFieldValue('paymentTime').format('YYYY-MM-DD HH:mm:ss')
      axios({
        method: 'POST',
        url: '/pmc/contract/save',
        headers: {
          'Content-Type': 'application/json',
          'deviceId': this.deviceId,
          'Authorization': 'Bearer ' + token,
        },
        data: JSON.stringify(values)
      })
        .then((res) => {
          if (res && res.status === 200) {
            // this.setState({
            //    projectDetail:res.data.result
            // });
            history.push('/cbd/pro/contract')
          }
        })
        .catch(function (error) {
          console.log(error);
          message.info("您不具备该权限")
        });
    }

    getOptUploadFileReqDto1 = () => {
      return {
        fileType: this.state.fileType,
        bucketName: 'ananops',
        filePath: 'contractA'
      };
    };
    beforeUpload = (file) => {
      var fileName = file.name;
      var type = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length);
      if (type != null) {
        this.setState({
          fileType: type,
        });
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('文件大于5MB!');
      }
      return isLt5M;
    }
    render() {
      let deviceId = new Date().getTime();
      const companyOptions = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
      const props = {
        name: 'file',
        action: '/pmc/file/uploadContractAttachment',
        headers: {
          authorization: 'Bearer ' + window.localStorage.getItem('token'),
          'deviceId': deviceId,
        },
        data: this.getOptUploadFileReqDto1,
        beforeUpload: this.beforeUpload,
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
          console.log(info)
        },
      };
      const createFormItemLayout = {
        labelCol: {span: 8},
        wrapperCol: {span: 8},
      }
      const {
        form: {getFieldDecorator},
        match: {params: {id}}
      } = this.props
      const {contractDetail} = this.state;
      moment.locale('zh-cn');
      return (
        <div>
          <div className="inpection-plan-create-page">

            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                {...createFormItemLayout}
                label="合同编号"
              >
                {getFieldDecorator('contractCode', {
                  initialValue: id && contractDetail.contractCode,
                  rules: [{
                    required: true,
                    message: "请填写合同编号",
                  }]
                })(
                  <Input placeholder="请输入合同编号"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="合同名称"
              >
                {getFieldDecorator('contractName', {
                  initialValue: id && contractDetail.contractName,
                  rules: [{
                    required: true,
                    message: "请填写合同名称",
                  }]
                })(
                  <Input.TextArea autoSize={{minRows: 2, maxRows: 6}} placeholder="请输入合同名称"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="合同类型"
              >
                {getFieldDecorator('contractType', {
                  initialValue: id && contractDetail.contractType || '制式合同',
                  rules: [{
                    required: true,
                    message: "请选择合同类型",
                  }]
                })(
                  <Select>
                    <Option value="制式合同">制式合同</Option>
                    <Option value="自定义合同">自定义合同</Option>
                    <Option value="其他">其他</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="用户方公司查询"
              >
                {getFieldDecorator('partyACompanyName')(
                  <Select
                    showSearch
                    // value={this.state.value}
                    placeholder={'请输入公司名称'}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch}
                    onChange={this.handleChangeA}
                    notFoundContent={null}
                  >
                    {companyOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="用户方名称"
              >
                {getFieldDecorator('partyAName', {
                  initialValue: id && contractDetail.partyAName,
                  rules: [{
                    required: true,
                    message: "请输入用户方名称",
                  }]
                })(
                  <Input placeholder="请输入用户方名称" disabled={true}/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="用户方ID"
              >
                {getFieldDecorator('partyAId', {
                  initialValue: id && contractDetail.partyAId,
                  rules: [{
                    required: true,
                    message: "请输入用户方ID",
                  }]
                })(
                  <Input placeholder="请输入用户方ID" disabled={true}/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="用户方法人"
              >
                {getFieldDecorator('alegalName', {
                  initialValue: id && contractDetail.alegalName,
                  rules: [{
                    required: true,
                    message: "请输入用户方法人",
                  }]
                })(
                  <Input placeholder="请输入用户方法人" disabled={true}/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方公司查询"
              >
                {getFieldDecorator('partyBCompanyName')(
                  <Select
                    showSearch
                    // value={this.state.value}
                    placeholder={'请输入公司名称'}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch}
                    onChange={this.handleChangeB}
                    notFoundContent={null}
                  >
                    {companyOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方名称"
              >
                {getFieldDecorator('partyBName', {
                  initialValue: id && contractDetail.partyBName,
                  rules: [{
                    required: true,
                    message: "请输入服务方名称",
                  }]
                })(
                  <Input placeholder="请输入服务方名称" disabled={true}/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方ID"
              >
                {getFieldDecorator('partyBId', {
                  initialValue: id && contractDetail.partyBId,
                  rules: [{
                    required: true,
                    message: "请输入服务方ID",
                  }]
                })(
                  <Input placeholder="请输入服务方ID" disabled={true}/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方法人"
              >
                {getFieldDecorator('blegalName', {
                  initialValue: id && contractDetail.blegalName,
                  rules: [{
                    required: true,
                    message: "请输入服务方法人",
                  }]
                })(
                  <Input placeholder="请输入服务方法人" disabled={true}/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="合同签订时间"
              >
                {getFieldDecorator('signTime', {
                  initialValue: id && moment(contractDetail.signTime),
                  rules: [{
                    required: true,
                    message: "请选择合同签订时间",
                  }]
                })(
                  <DatePicker
                    locale={locale}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择合同签订时间"
                    showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                  />,
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="合同开始时间"
              >
                {getFieldDecorator('startTime', {
                  initialValue: id && moment(contractDetail.startTime),
                  rules: [{
                    required: true,
                    message: "请选择合同开始时间",
                  }]
                })(
                  <DatePicker
                    locale={locale}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择合同开始时间"
                    showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                  />,
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="合同结束时间"
              >
                {getFieldDecorator('endTime', {
                  initialValue: id && moment(contractDetail.endTime),
                  rules: [{
                    required: true,
                    message: "请选择合同结束时间",
                  }]
                })(
                  <DatePicker
                    locale={locale}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择合同结束时间"
                    showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                  />,
                )}
              </Form.Item>
              {/*<Form.Item*/}
              {/*    {...createFormItemLayout}*/}
              {/*    label="合同存放路径"*/}
              {/*>*/}
              {/*    {getFieldDecorator('filePath', {*/}
              {/*        initialValue: id && contractDetail.filePath,*/}
              {/*        rules: [{*/}
              {/*            required: false,*/}
              {/*            message: "请输入合同存放路径",*/}
              {/*        }]*/}
              {/*    })(*/}
              {/*        <Input placeholder="请输入合同存放路径"/>*/}
              {/*    )}*/}
              {/*</Form.Item>*/}
              <Form.Item
                {...createFormItemLayout}
                label="服务方代理内容"
              >
                {getFieldDecorator('agentContent', {
                  initialValue: id && contractDetail.agentContent,
                  rules: [{
                    required: false,
                    message: "请输入服务方代理内容",
                  }]
                })(
                  <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} placeholder="请输入服务方代理内容"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方开户银行"
              >
                {getFieldDecorator('bankName', {
                  initialValue: id && contractDetail.bankName,
                  rules: [{
                    required: false,
                    message: "请输入服务方开户银行",
                  }]
                })(
                  <Input placeholder="请输入服务方开户银行"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方银行账号"
              >
                {getFieldDecorator('bankAccount', {
                  initialValue: id && contractDetail.bankAccount,
                  rules: [{
                    required: false,
                    message: "请输入服务方银行账号",
                  }]
                })(
                  <Input placeholder="请输入服务方银行账号"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="乙供辅料金额"
              >
                {getFieldDecorator('assitMoney', {
                  initialValue: id && contractDetail.assitMoney,
                  rules: [{
                    required: false,
                    message: "请输入乙供辅料金额",
                  }]
                })(
                  <Input placeholder="请输入乙供辅料金额"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方是否包备品备件"
              >
                {getFieldDecorator('isSparePart', {
                  initialValue: id && contractDetail.isSparePart || 1,
                  rules: [{
                    required: true,
                    message: "请选择服务方是否包备品备件",
                  }]
                })(
                  <Radio.Group>
                    <Radio value={1}>包括</Radio>
                    <Radio value={0}>不包括</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="服务方是否提供备品备件替换服务"
              >
                {getFieldDecorator('isSpareService', {
                  initialValue: id && contractDetail.isSpareService || 1,
                  rules: [{
                    required: true,
                    message: "请输入服务方是否提供备品备件替换服务",
                  }]
                })(
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="维修维护最迟响应时间（小时）"
              >
                {getFieldDecorator('lastResponseTime', {
                  initialValue: id && contractDetail.lastResponseTime,
                  rules: [{
                    required: false,
                    message: "请输入维修维护最迟响应时间（小时）",
                  }]
                })(
                  <Input placeholder="请输入维修维护最迟响应时间（小时）"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="付款时间"
              >
                {getFieldDecorator('paymentTime', {
                  initialValue: id && moment(contractDetail.paymentTime),
                  rules: [{
                    required: true,
                    message: "请输入付款时间",
                  }]
                })(
                  <DatePicker
                    locale={locale}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择付款时间"
                    showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                  />
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="支付方式"
              >
                {getFieldDecorator('paymentType', {
                  initialValue: id && contractDetail.paymentType || 1,
                  rules: [{
                    required: true,
                    message: "请选择支付方式",
                  }]
                })(
                  <Radio.Group>
                    <Radio value={1}>现结</Radio>
                    <Radio value={2}>账期</Radio>
                    <Radio value={3}>年结</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="项目金额"
              >
                {getFieldDecorator('projectMoney', {
                  initialValue: id && contractDetail.projectMoney,
                  rules: [{
                    required: false,
                    message: "请输入项目金额",
                  }]
                })(
                  <Input placeholder="请输入项目金额"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="月度记录表提交周期（天）"
              >
                {getFieldDecorator('recordTime', {
                  initialValue: id && contractDetail.recordTime,
                  rules: [{
                    required: false,
                    message: "请输入月度记录表提交周期（天）",
                  }]
                })(
                  <Input placeholder="请输入月度记录表提交周期（天）"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="合同是否变更"
              >
                {getFieldDecorator('isChange', {
                  initialValue: id && contractDetail.isChange || 0,
                  rules: [{
                    required: true,
                    message: "请选择合同是否变更",
                  }]
                })(
                  <Radio.Group>
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="合同是否作废"
              >
                {getFieldDecorator('isDestory', {
                  initialValue: id && contractDetail.isDestory || 0,
                  rules: [{
                    required: true,
                    message: "请选择合同是否作废",
                  }]
                })(
                  <Radio.Group>
                    <Radio value={0}>有效</Radio>
                    <Radio value={1}>作废</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="是否自动顺延"
              >
                {getFieldDecorator('isPostpone', {
                  initialValue: id && contractDetail.isPostpone || 0,
                  rules: [{
                    required: true,
                    message: "请选择是否自动顺延",
                  }]
                })(
                  <Radio.Group>
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="维修工身份验证流程"
              >
                {getFieldDecorator('verification', {
                  initialValue: id && contractDetail.verification,
                  rules: [{
                    required: false,
                    message: "请输入维修工身份验证流程",
                  }]
                })(
                  <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} placeholder="请输入维修工身份验证流程"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="描述"
              >
                {getFieldDecorator('description', {
                  initialValue: id && contractDetail.description,
                  rules: [{
                    required: false,
                    message: "请输入描述",
                  }]
                })(
                  <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} placeholder="请输入描述"/>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="附件上传"
              >
                {getFieldDecorator('filePath')(
                  <Upload {...props}>
                    <Button>
                      <Icon type="upload"/> 附件上传
                    </Button>
                  </Upload>
                )}
              </Form.Item>
              <section className="operator-container">
                <div style={{textAlign: "center"}}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="default"
                  >{id ? '保存' : '新建'}
                  </Button>
                  <Button
                    style={{marginLeft: "28px"}}
                    size="default"
                    onClick={() => {
                      const {
                        history,
                      } = this.props
                      history.push('/cbd/pro/contract')
                    }}
                  >取消
                  </Button>
                </div>
              </section>
            </Form>
          </div>
        </div>
      )
    }
}

export default Form.create()(ProjectNew);