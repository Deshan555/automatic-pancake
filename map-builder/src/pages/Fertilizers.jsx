import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { authenticationCheck } from './AuthChecker';
import { apiExecutions } from '../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb } from 'antd';
import {
    MailOutlined,
    DeleteOutlined,
    PhoneOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { CSVLink, CSVDownload } from "react-csv";
import dayjs from 'dayjs';


const Fertilizers = () => {
    const [selectedRecord, setSelectedRecord] = useState({});
    const [allRecords, setAllRecords] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isView, setIsView] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllRecords();
        // authenticationCheck(navigate);
    }, []);

    const onFinishForm = (values) => {
        if (isEdit) {
            confirmUpdateModal(selectedRecord.FertilizerID, values);
            return;
        } else {
            confirmationCreateModal(values);
        }
    }

    const fetchAllRecords = async () => {
        const result = await apiExecutions.getAllFertilizerInfo();
        try {
            if (result !== null) {
                if (result.success === true) {
                    setAllRecords(result.data);
                } else {
                    message.error('Error : ' + result?.message);
                }
            }
        } catch (error) {
            message.error('An unexpected error occurred: ' + result?.message);
        }
    }

    const insertNewFertilizerRecord = async (data) => {
        const result = await apiExecutions.addFertilizerInfo(data);
        if (result !== null) {
            if (result.success === true) {
                message.success('Fertilizer Record Added Successfully');
                fetchAllRecords();
                modalClose();
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const updateRecords = async (id, data) => {
        const result = await apiExecutions.updateFertilizerInfo(id, data);
        if (result !== null) {
            if (result.success === true) {
                message.success('Fertilizer Record Updated Successfully');
                fetchAllRecords();
                modalClose();
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const deleteRecordByID = async (id) => {
        const result = await apiExecutions.deleteFertilizerInfo(id);
        if (result !== null) {
            if (result.success === true) {
                message.success('Fertilizer Record Deleted Successfully');
                fetchAllRecords();
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const fetchDataByID = async (id) => {
        const result = await apiExecutions.getFertilizerInfoByID(id);
        if (result !== null) {
            if (result.success === true) {
                setSelectedRecord(result.data[0]);
                setIsModalVisible(true);
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const confirmationCreateModal = (data) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are you sure you want to add this Fertilizer Record?",
            onOk: async () => {
                insertNewFertilizerRecord(data);
            },
            onCancel() { },
        });
    };

    const confirmUpdateModal = (id, data) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are you sure you want to update this Fertilizer Record?",
            onOk: async () => {
                updateRecords(id, data);
            },
            onCancel() { },
        });
    }

    const confirmDeleteModal = (id) => {
        const { confirm } = Modal;
        confirm({
            title: "Are you sure you want to delete this Fertilizer Record?",
            onOk: async () => {
                deleteRecordByID(id);
            },
            onCancel() { },
        });
    }

    const modalClose = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
        setIsEdit(false);
        setIsView(false);
    }

    const columns = [
        {
            title: <span className="textStyles-small">Fertilizer Name</span>,
            dataIndex: 'FertilizerName',
            key: 'FertilizerName',
            render: (text) => <span className="textStyle-small">{text}</span>,
        },
        {
            title: <span className="textStyles-small">Code Name</span>,
            dataIndex: 'CodeName',
            key: 'CodeName',
            render: (text) => <span className="textStyle-small">{text}</span>,
        },
        {
            title: <span className="textStyles-small">Fertilizer Type</span>,
            dataIndex: 'FertilizerType',
            key: 'FertilizerType',
            render: (text) => <span className="textStyle-small">{text}</span>,
        },
        {
            title: <span className="textStyles-small">Fertilizer Price (Per L/Kg)</span>,
            dataIndex: 'FertilizerPrice',
            key: 'FertilizerPrice',
            render: (text) => <span className="textStyle-small">{text}</span>,
        },
        {
            title: <span className="textStyles-small">Fertilizer Quantity (L/Kg)</span>,
            dataIndex: 'FertilizerQuantity',
            key: 'FertilizerQuantity',
            render: (text) => <span className="textStyle-small">{text}</span>,
        },
        {
            title: <span className="textStyles-small">Vendor Name</span>,
            dataIndex: 'VendorName',
            key: 'VendorName',
            render: (text) => <span className="textStyle-small">{text}</span>,
        },
        {
            title: <span className="textStyles-small">Last Update</span>,
            dataIndex: 'LastUpdate',
            key: 'LastUpdate',
            render: (text) => <span className="textStyle-small">{dayjs(text).format('MMMM D, YYYY')}</span>,
        },
        {
            title: <span className="textStyles-small">Action</span>,
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined style={{ fontSize: '12px' }} />}
                        shape="circle"
                        size="small"
                        onClick={() => {
                            setIsEdit(true);
                            setIsView(false);
                            fetchDataByID(record.FertilizerID);
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<EyeOutlined style={{ fontSize: '12px' }} />}
                        shape="circle"
                        size="small"
                        onClick={() => {
                            setSelectedRecord([]);
                            setIsEdit(false);
                            setIsView(true);
                            fetchDataByID(record.FertilizerID);
                        }}
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={
                            <DeleteOutlined
                                style={{ fontSize: '12px' }} />}
                        danger
                        onClick={() => {
                            confirmDeleteModal(record.FertilizerID);
                        }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <h1 className="headingStyle2">Fertilizer Management </h1>
            <Breadcrumb
                size="small"
                className="textStyle-small"
                style={{ marginBottom: 20 }}
                items={[
                    {
                        href: '/free',
                        title: <HomeOutlined />,
                    },
                    {
                        title: (
                            <>
                                <span>Admin Utils</span>
                            </>
                        ),
                    },
                    {
                        href: '',
                        title: 'Data Importer',
                    },
                ]}
            />

            <Modal
                title={
                    isEdit ? (
                        <span className="textStyles-small" style={{ fontSize: '14px' }}>Edit Fertilizer Record</span>
                    ) : isView ? (
                        <span className="textStyles-small" style={{ fontSize: '14px' }}>View Fertilizer Record</span>
                    ) : (
                        <span className="textStyles-small" style={{ fontSize: '14px' }}>Add Fertilizer Record</span>
                    )
                }
                visible={isModalVisible}
                footer={null}
                handleOk={modalClose}
                handleCancel={modalClose}
                width={800}
                destroyOnClose={true}
            >
                <div style={{ margin: '20px 20px 20px 20px' }}>
                    {
                        isView === false ? (

                            <Form
                                layout="vertical"
                                name="basic"
                                onFinish={onFinishForm}
                                className="textStyles-small"
                            >
                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Fertilizer Name</span>}
                                            name="FertilizerName"
                                            rules={[{ required: true, message: 'Please input Fertilizer Name!' }]}
                                            initialValue={isEdit ? selectedRecord?.FertilizerName : null}
                                        >
                                            <Input style={{ width: '80%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Code Name</span>}
                                            name="CodeName"
                                            rules={[{ required: true, message: 'Please input Code Name!' }]}
                                            initialValue={isEdit ? selectedRecord?.CodeName : null}
                                        >
                                            <Input style={{ width: '80%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Fertilizer Price</span>}
                                            name="FertilizerPrice"
                                            rules={[{ required: true, message: 'Please input Fertilizer Price!' }]}
                                            initialValue={isEdit ? selectedRecord?.FertilizerPrice : null}
                                        >
                                            <Input style={{ width: '80%' }} type="number" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Fertilizer Quantity</span>}
                                            name="FertilizerQuantity"
                                            rules={[{ required: true, message: 'Please input Fertilizer Quantity!' }]}
                                            initialValue={isEdit ? selectedRecord?.FertilizerQuantity : null}
                                        >
                                            <Input style={{ width: '80%' }} type="number" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Vendor Name</span>}
                                            name="VendorName"
                                            rules={[{ required: true, message: 'Please input Vendor Name!' }]}
                                            initialValue={isEdit ? selectedRecord?.VendorName : null}
                                        >
                                            <Input style={{ width: '80%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Fertilizer Type</span>}
                                            name="FertilizerType"
                                            rules={[{ required: true, message: 'Please input Fertilizer Type!' }]}
                                            initialValue={isEdit ? selectedRecord?.FertilizerType : null}
                                        >
                                            <Select
                                                style={{ width: '80%' }}
                                                placeholder="Select Fertilizer Type"
                                                allowClear
                                                className="textStyle-small"
                                            >
                                                <Select.Option value="Inorganic_Fertilizers" className="textStyle-small">Inorganic Fertilizers</Select.Option>
                                                <Select.Option value="Organic_Fertilizers" className="textStyle-small">Organic Fertilizers</Select.Option>
                                                <Select.Option value="Bio_Fertilizers" className="textStyle-small">Bio Fertilizers</Select.Option>
                                                <Select.Option value="Liquid_Fertilizers" className="textStyle-small">Liquid Fertilizers</Select.Option>
                                                <Select.Option value="Granular_Fertilizers" className="textStyle-small">Granular Fertilizers</Select.Option>
                                                <Select.Option value="Chemical_Fertilizers" className="textStyle-small">Chemical Fertilizers</Select.Option>
                                                <Select.Option value="Slow-Release_Fertilizers" className="textStyle-small">Slow-Release Fertilizers</Select.Option>
                                                <Select.Option value="Undefine" className="textStyle-small">Undefine</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Instructions To Store</span>}
                                            name="InstructionsToStore"
                                            initialValue={isEdit ? selectedRecord?.InstructionsToStore : null}
                                        >
                                            <Input.TextArea style={{ width: '80%' }} size="small" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Instructions To Use</span>}
                                            name="InstructionsToUse"
                                            initialValue={isEdit ? selectedRecord?.InstructionsToUse : null}
                                        >
                                            <Input.TextArea style={{ width: '80%' }} size="small" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            label={<span className="textStyles-small">Fertilizer Description</span>}
                                            name="FertilizerDescription"
                                            initialValue={isEdit ? selectedRecord?.FertilizerDescription : null}
                                        >
                                            <Input.TextArea style={{ width: '90%' }} size="small" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24}>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" style={{ width: '180px' }}>
                                                <span className="textStyles-small">
                                                    {isEdit ? 'Update Fertilizer Record' : 'Add Fertilizer Record'}
                                                </span>
                                            </Button>
                                            <Button type="primary" style={{ width: '150px', marginLeft: '10px' }} danger onClick={modalClose}>
                                                <span className="textStyles-small">Close</span>
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                            </Form>) : null
                    }

                    {
                        isView ? (
                            <div>
                                <Descriptions
                                    bordered
                                    size="small"
                                    column={2}
                                    style={{ marginTop: 20 }}>
                                    <Descriptions.Item label="Fertilizer Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerName}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Code Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.CodeName}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Type" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerType}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Price" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerPrice} Per Unit</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Quantity" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerQuantity}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Vendor Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.VendorName}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Description" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerDescription}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Instructions To Store" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.InstructionsToStore}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Instructions To Use" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.InstructionsToUse}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Last Update" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{dayjs(selectedRecord?.LastUpdate).format('MMMM D, YYYY h:mm A')}</span>
                                    </Descriptions.Item>
                                </Descriptions>

                                <Button type="primary" style={{ width: '150px', marginTop: '10px' }} danger onClick={modalClose}>
                                    <span className="textStyles-small">Close View</span>
                                </Button>
                            </div>
                        ) : null
                    }
                </div>
            </Modal>

            <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: '20px' }}
                    onClick={() => {
                        setIsEdit(false);
                        setIsView(false);
                        setIsModalVisible(true);
                    }}
                >
                    <span className="textStyle-small">Add New Fertilizer Record</span>
                </Button>

                <Table
                    columns={columns}
                    dataSource={allRecords}
                    pagination={true}
                    size="medium"
                />
            </div>

        </>
    )
}

export default Fertilizers;