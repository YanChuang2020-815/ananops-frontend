import React, {Component,} from 'react';
import {Form, Input, Button, message, DatePicker, Radio, Select, Upload, Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/zh_CN';

const token = window.localStorage.getItem('token')
const {Option} = Select;

class AlarmNew extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alarmDetail: {}
        }
    }

    componentDidMount() {
        const {match: {params: {id}}} = this.props
        if (id) {
            axios({
                method: 'POST',
                url: '/amc/alarm/getAlarmById/' + id,
                headers: {
                    'deviceId': this.deviceId,
                    'Authorization': 'Bearer ' + token,
                },
            })
                .then((res) => {
                    if (res && res.status === 200) {
                        console.log(res.data.result)
                        this.setState({
                            alarmDetail: res.data.result
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const {
            form,
            history,
            match: {params: {id}},
        } = this.props
        const {getFieldValue} = form;
        const values = form.getFieldsValue()
        if (values.alarmPhoto != undefined) {
            let fileList = values.alarmPhoto.fileList;
            values.alarmPhoto = this.getAttachments(fileList);
        }
        if (!getFieldValue('alarmName')) {
            message.error('请填写告警名称')
        }
        if (!getFieldValue('alarmType')) {
            message.error('请填写告警类型')
        }
        if (!getFieldValue('alarmType')) {
            message.error('请填写告警等级')
        }
        if (!getFieldValue('alarmType')) {
            message.error('请填写告警位置')
        }
        if (!getFieldValue('lastOccurTime')) {
            message.error('请填写最近发生时间')
        }
        if (id) {
            values.id = id
        }
        values.lastOccurTime = getFieldValue('lastOccurTime').format('YYYY-MM-DD HH:mm:ss')
        axios({
            method: 'POST',
            url: '/amc/alarm/save',
            headers: {
                'Content-Type': 'application/json',
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + token,
            },
            data: JSON.stringify(values)
        })
            .then((res) => {
                if (res && res.status === 200) {
                    message.success("操作成功")
                    history.push('/cbd/amc/report')
                }
            })
            .catch(function (error) {
                console.log(error);
                message.error("创建失败！")
            });
    }

    getAttachments(fileList) {
        var res = [];
        var size = fileList.length;
        for (var i = 0; i < size; i++) {
            if(fileList[i].response[0].attachmentId != null){
                var attachmentId = fileList[i].response[0].attachmentId;
                res.push(attachmentId);
            }
        }
        return res.toString();
    }
    getOptUploadFileReqDto1() {
        return {
            fileType: 'png',
            bucketName: 'ananops',
            filePath: 'alarm'
        };
    };
    render() {
        let deviceId = new Date().getTime();
        const props = {
            name: 'file',
            action: '/amc/alarm/uploadAlarmPhoto',
            headers: {
                authorization: 'Bearer ' + window.localStorage.getItem('token'),
                'deviceId': deviceId,
            },
            data: this.getOptUploadFileReqDto1,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
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
        const {alarmDetail} = this.state
        return (
            <div>
                <div>
                    <Form
                        onSubmit={this.handleSubmit}
                    >
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警名称"
                        >
                            {getFieldDecorator('alarmName', {
                                initialValue: id && alarmDetail.alarmName,
                                rules: [{
                                    required: true,
                                    message: "告警名称",
                                }]
                            })(
                                <Input placeholder="告警名称"/>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警类型"
                        >
                            {getFieldDecorator('alarmType', {
                                initialValue: id && alarmDetail.alarmType,
                                rules: [{
                                    required: true,
                                    message: "请填写告警类型",
                                }]
                            })(
                                <Select initialValue="磁控开关报警" style={{width: 200}}>
                                    <Option value="磁控开关报警">磁控开关报警</Option>
                                    <Option value="震动报警">震动报警</Option>
                                    <Option value="声报警">声报警</Option>
                                    <Option value="超声波报警">超声波报警</Option>
                                    <Option value="电场报警">电场报警</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警等级"
                        >
                            {getFieldDecorator('alarmLevel', {
                                initialValue: id && alarmDetail.alarmLevel,
                                rules: [{
                                    required: true,
                                    message: "请选择告警等级",
                                }]
                            })(
                                <Radio.Group defaultValue={1}>
                                    <Radio value={1}>紧急</Radio>
                                    <Radio value={2}>可疑</Radio>
                                    <Radio value={3}>提醒</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警资产"
                        >
                            {getFieldDecorator('alarmAsset', {
                                initialValue: id && alarmDetail.alarmAsset,
                                rules: [{
                                    required: true,
                                    message: "请填写告警资产",
                                }]
                            })(
                                <Select initialValue="工程机械" style={{width: 200}}>
                                    <Option value="工程机械">磁控开关报警</Option>
                                    <Option value="电工机械">电工机械</Option>
                                    <Option value="仪器仪表">仪器仪表</Option>
                                    <Option value="包装机械">包装机械</Option>
                                    <Option value="环保机械">环保机械</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="告警设备位置"
                        >
                            {getFieldDecorator('alarmLocation', {
                                initialValue: id && alarmDetail.alarmLocation,
                                rules: [{
                                    required: true,
                                    message: "请填写告警位置",
                                }]
                            })(
                                <Input placeholder="请输入告警位置"/>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="最近发生时间"
                        >
                            {getFieldDecorator('lastOccurTime', {
                                initialValue: id && moment(alarmDetail.lastOccurTime),
                                rules: [{
                                    required: true,
                                    message: "请选择最近发生时间",
                                }]
                            })(
                                <DatePicker
                                    locale={locale}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择最近发生时间"
                                    showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="描述信息"
                        >
                            {getFieldDecorator('description', {
                                initialValue: id && alarmDetail.description,
                                rules: [{
                                    required: false,
                                    message: "请填写描述信息",
                                }]
                            })(
                                <Input placeholder="请输入描述信息"/>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...createFormItemLayout}
                            label="图片上传 (png格式)"
                        >
                            {getFieldDecorator('alarmPhoto')(
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
                                        history.push('/cbd/amc/report')
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

export default Form.create()(AlarmNew);