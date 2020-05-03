import React, {Component,} from 'react';
import {Descriptions, Badge, Button, Modal, Upload, Icon, message ,List, Typography} from 'antd';
import moment from 'moment';
import './index.styl'
import {Link} from 'react-router-dom'
import axios from 'axios'

const token = window.localStorage.getItem('token')
const role = window.localStorage.getItem('role')

class ManagementDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contractDetail: {},
            attachmentList: [],
            visible: false,
        }
        this.getDetail = this.getDetail.bind(this);
        this.downloadContractAttachment = this.downloadContractAttachment.bind(this);
    }

    componentDidMount() {
        const {
            match: {params: {id}}
        } = this.props
        this.getDetail(id);
        this.downloadContractAttachment(id);
    }

    getDetail = (id) => {
        axios({
            method: 'POST',
            url: '/pmc/contract/getContractById/' + id,
            headers: {
                'deviceId': this.deviceId,
                'Authorization': 'Bearer ' + token,
            },
        })
            .then((res) => {
                console.log(res);
                if (res && res.status === 200) {

                    this.setState({
                        contractDetail: res.data.result
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    downloadContractAttachment = (id) => {
        let deviceId = new Date().getTime();
        axios({
            method: 'POST',
            url: '/pmc/file/getContractAttachment/' + id,
            headers: {
                'deviceId': deviceId,
                'Authorization': 'Bearer ' + token,
            }
        })
            .then((res) => {
                console.log("downloadContractAttachment: " + res);
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


    visible = () => {
        this.setState({visible: true})
    }
    onOk = () => {
        this.setState({visible: false})
    }
    handleCancel = () => {
        this.setState({visible: false})
    }
    handleChange = (info) => {

    }
    open_win = () => {
        alert("gfgg");
        window.open("www.baidu.com")
    }

    render() {
        const {contractDetail, visible, attachmentList} = this.state
        // const props = {
        //   onChange: this.handleChange,
        //   multiple: true,
        // };
        let urlList = [];
        urlList = this.getUrlList(attachmentList);
        return (
            <div className="bg">
                <Descriptions bordered size='small' className="descriptions">
                    <Descriptions.Item label="合同ID" span={1}>{contractDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="合同编号" span={2}>{contractDetail.contractCode}</Descriptions.Item>
                    <Descriptions.Item label="合同名称" span={1}>{contractDetail.contractName}</Descriptions.Item>
                    <Descriptions.Item label="合同类型" span={2}>{contractDetail.contractType}</Descriptions.Item>
                    <Descriptions.Item label="用户方名称" span={1}>{contractDetail.partyAName}</Descriptions.Item>
                    <Descriptions.Item label="用户方ID" span={2}>{contractDetail.partyAId}</Descriptions.Item>
                    <Descriptions.Item label="服务方名称" span={1}>{contractDetail.partyBName}</Descriptions.Item>
                    <Descriptions.Item label="服务方ID" span={2}>{contractDetail.partyBId}</Descriptions.Item>
                    <Descriptions.Item label="用户方法人" span={1}>{contractDetail.alegalName}</Descriptions.Item>
                    <Descriptions.Item label="服务方法人" span={2}>{contractDetail.blegalName}</Descriptions.Item>
                    <Descriptions.Item label="服务方代理内容" span={1}>{contractDetail.agentContent}</Descriptions.Item>
                    <Descriptions.Item label="服务方开户银行" span={2}>{contractDetail.bankName}</Descriptions.Item>
                    <Descriptions.Item label="服务方银行账号" span={1}>{contractDetail.bankAccount}</Descriptions.Item>
                    <Descriptions.Item label="服务方供辅助金额" span={2}>{contractDetail.assitMoney}</Descriptions.Item>
                    <Descriptions.Item label="合同开始时间" span={1}>{contractDetail.startTime}</Descriptions.Item>
                    <Descriptions.Item label="合同结束时间" span={2}>{contractDetail.endTime}</Descriptions.Item>
                    <Descriptions.Item label="合同签订时间" span={1}>{contractDetail.signTime}</Descriptions.Item>
                    <Descriptions.Item label="合同存放路径" span={2}>{contractDetail.filePath}</Descriptions.Item>
                    <Descriptions.Item label="付款时间" span={1}>{contractDetail.paymentTime}</Descriptions.Item>
                    <Descriptions.Item label="支付方式"
                                       span={2}>{contractDetail.paymentType === 1 ? '现结' : (contractDetail.paymentType === 2 ? '账期' : '年结')}</Descriptions.Item>
                    <Descriptions.Item label="项目金额" span={1}>{contractDetail.projectMoney}</Descriptions.Item>
                    <Descriptions.Item label="服务方是否包备品备件"
                                       span={2}>{contractDetail.isSparePart === 0 ? "不包括" : "包括"}</Descriptions.Item>
                    <Descriptions.Item label="服务方是否提供备品备件替换服务"
                                       span={1}>{contractDetail.isSpareService === 0 ? "不提供" : "提供"}</Descriptions.Item>
                    <Descriptions.Item label="维修维护最迟响应时间（小时）"
                                       span={2}>{contractDetail.lastResponseTime}</Descriptions.Item>
                    <Descriptions.Item label="月度记录表提交周期（天）" span={1}>{contractDetail.recordTime}</Descriptions.Item>
                    <Descriptions.Item label="维修工身份验证流程" span={2}>{contractDetail.verification}</Descriptions.Item>
                    <Descriptions.Item label="合同是否变更">{contractDetail.isChange === 0 ? "否" : "是"}</Descriptions.Item>
                    <Descriptions.Item label="合同是否作废">{contractDetail.isDestory === 0 ? "有效" : "作废"}</Descriptions.Item>
                    <Descriptions.Item label="是否自动顺延">{contractDetail.isPostpone === 0 ? "否" : "是"}</Descriptions.Item>
                    <Descriptions.Item label="描述" span={3}>{contractDetail.description}</Descriptions.Item>
                    <Descriptions.Item label="附件下载链接">
                        <List
                            size="small"
                            bordered
                            dataSource={urlList }
                            renderItem={item => <List.Item><a href={item}>点击下载</a></List.Item>}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="操作">
                        <Link to={`/cbd/pro/contract`} style={{marginRight: '12px'}}>返回上级</Link>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }
}

export default ManagementDetail