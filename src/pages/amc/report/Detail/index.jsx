import React, {Component,} from 'react';
import {Descriptions, List, Typography} from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios'

const token = window.localStorage.getItem('token')

class AlarmDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alarmDetail: {},
            attachmentList: [],
        }
        this.getAlarmDetailById = this.getAlarmDetailById.bind(this);
    }

    componentDidMount() {
        const {
            match: {params: {id}}
        } = this.props
        this.getAlarmDetailById(id);
        this.downloadAlarmAttachment(id);
    }

    getAlarmDetailById = (id) => {
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
                    this.setState({
                        alarmDetail: res.data.result
                    });
                }
                console.log(res.data.result);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    downloadAlarmAttachment = (id) => {
        let deviceId = new Date().getTime();
        axios({
            method: 'POST',
            url: '/amc/alarm/getAlarmAttachment/' + id,
            headers: {
                'deviceId': deviceId,
                'Authorization': 'Bearer ' + token,
            }
        })
            .then((res) => {
                if (res && res.status === 200) {
                    console.log(res);
                    this.setState({
                        attachmentList: res.data.result
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getUrls(attachmentList) {
        var urls = [];
        var size = attachmentList.length;
        for (var i = 0; i < size; i++) {
            var url = attachmentList[i].url;
            urls.push(url);
        }
        return urls.toString();
    }

    getUrlList(attachmentList) {
        var urls = [];
        var size = attachmentList.length;
        for (var i = 0; i < size; i++) {
            var url = attachmentList[i].url;
            urls.push(url);
        }
        return urls;
    }

    render() {
        const {
            alarmDetail,
            attachmentList
        } = this.state
        let urlList = [];
        urlList = this.getUrlList(attachmentList);
        return (
            <div>
                <Descriptions bordered size='small'>
                    <Descriptions.Item label="告警ID" span={1.5}>{alarmDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="告警名称" span={1.5}>{alarmDetail.alarmName}</Descriptions.Item>
                    <Descriptions.Item label="告警类型" span={1.5}>{alarmDetail.alarmType}</Descriptions.Item>
                    <Descriptions.Item label="告警等级"
                                       span={1.5}>{alarmDetail.alarmLevel === 1 ? '紧急' : (alarmDetail.alarmLevel === 2 ? '可疑' : '提醒')}</Descriptions.Item>
                    <Descriptions.Item label="告警资产" span={1.5}>{alarmDetail.alarmAsset}</Descriptions.Item>
                    <Descriptions.Item label="资产类型" span={1.5}>{alarmDetail.assetType}</Descriptions.Item>
                    <Descriptions.Item label="告警状态"
                                       span={1.5}>{alarmDetail.alarmStatus === 1 ? '未处理' : '已处理'}</Descriptions.Item>
                    <Descriptions.Item label="最近发生时间" span={1.5}>{alarmDetail.lastOccurTime}</Descriptions.Item>
                    <Descriptions.Item label="告警位置" span={1.5}>{alarmDetail.alarmLocation}</Descriptions.Item>
                    <Descriptions.Item label="描述信息" span={1.5}>{alarmDetail.description}</Descriptions.Item>
                    <Descriptions.Item label="附件下载链接" span={3}>
                        <List
                            size="small"
                            bordered
                            dataSource={urlList}
                            renderItem={item => <List.Item><a href={item}>点击下载</a></List.Item>}
                        /></Descriptions.Item>
                    <Descriptions.Item label="操作">
                        <Link to={`/cbd/amc/report`} style={{marginRight: '12px'}}>返回上级</Link>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }
}

export default AlarmDetail