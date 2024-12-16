import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../api/api-call';
import { allCities } from '../api/cities';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, Row, Col, DatePicker, Drawer, message, Breadcrumb } from 'antd';
import moment from 'moment';
import { CSVLink, CSVDownload } from "react-csv";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
    FilterOutlined,
    MailOutlined,
    DeleteOutlined,
    PhoneOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { random, set } from 'lodash';
// import { authenticationCheck } from '../vehicleModule/AuthChecker';
const { Option } = Select;

const FieldManagement = () => {
    const [fields, setFields] = useState([]);
    const [factoriesList, setFactoriesList] = useState([]);
    const [zonesList, setZonesList] = useState([]);
    const [customersList, setCustomersList] = useState([]);
    const [roadRoutings, setRoadRoutings] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [editStatus, setEditStatus] = useState(false);
    const [filterValues, setFilterValues] = useState([]);
    const [baseLocation, setBaseLocation] = useState(null);
    const [selectedField, setSelectedField] = useState({
        FieldID: 0,
        FieldName: "",
        FieldSize: null,
        FieldType: "",
        FieldAddress: "",
        TeaType: "",
        BaseLocation: "",
        BaseElevation: null,
        SoilType: "",
        Attitude: null,
        Longitude: null,
        FieldRegistrationDate: "",
        RouteID: null,
        OwnerID: null,
        ZoneID: null,
        FactoryID: null
    });
    const [dropdownValues, setDropdownValues] = useState('all');
    const [mappedData, setMappedData] = useState([]);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllAPICalling();
        fetchCityData();
        // authenticationCheck(navigate);
    }, []);

    const fetchCityData = async () => {
        setBaseLocation(allCities);
    };

    const fetchAllAPICalling = async () => {
        fetchAllFields();
        fetchAllRoadRoutings();
        fetchAllFactories();
        fetchAllZones();
        fetchAllCustomers();
    }

    const modelReset = () => {
        setEditStatus(false);
        setSelectedDetails({
            FieldID: 0,
            FieldName: "",
            FieldSize: null,
            FieldType: "",
            FieldAddress: "",
            TeaType: "",
            BaseLocation: "",
            BaseElevation: null,
            SoilType: "",
            Attitude: null,
            Longitude: null,
            FieldRegistrationDate: "",
            RouteID: null,
            OwnerID: null,
            ZoneID: null,
            FactoryID: null,
        });
    };

    const showInfoModel = () => {
        setOpenDetails(true);
        return true;
    };

    const hideInfoModel = () => {
        setOpenDetails(false);
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        modelReset();
        setOpen(false);
        hideInfoModel();
    };

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const confirmModel = () => {
        setOpen(false);
    };

    const confirmationModel = (data) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are You Want To Register New Field?",
            onOk: async () => {
                register(data);
            },
            onCancel() { },
        });
    };

    const register = async (requestBody) => {
        const response = await apiExecutions.registerNewField(requestBody);
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                message.success('Field Registered Successfully : ' + response.message);
                fetchAllFields();
                onClose();
            } else {
                message.error('Failed to Register Field : ' + response.message);
            }
        } else {
            message.error('Failed to Register Field');
        }
    }

    const fetchAllRoadRoutings = async () => {
        const response = await apiExecutions.getAllRoadRoutings();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setRoadRoutings(response.data);

                // filterationByFieldType('all');
                // setFilterValues(response.data);
            } else {
                message.error('Failed to fetch Road Routings');
            }
        }
    }

    const fetchAllFields = async () => {
        const response = await apiExecutions.getAllFieldInfo();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setFilterValues(response.data);
                setFields(response.data);
            } else {
                message.error('Failed to fetch Fields');
            }
        }
    }

    const fetchAllFactories = async () => {
        const response = await apiExecutions.getAllFactories();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setFactoriesList(response.data);
            } else {
                message.error('Failed to fetch Factories');
            }
        }
    }

    const fetchAllZones = async () => {
        const response = await apiExecutions.getAllEnvironmentZoneInfo();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setZonesList(response.data);
            } else {
                message.error('Failed to fetch Zones');
            }
        }
    }

    const fetchAllCustomers = async () => {
        const response = await apiExecutions.getAllCustomers();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setCustomersList(response.data);
            } else {
                message.error('Failed to fetch Customers');
            }
        }
    }

    const setSelectedDetails = (record) => {
        setSelectedField({
            FieldID: record.FieldID,
            FieldName: record.FieldName,
            FieldSize: record.FieldSize,
            FieldType: record.FieldType,
            FieldAddress: record.FieldAddress,
            TeaType: record.TeaType,
            BaseLocation: record.BaseLocation,
            BaseElevation: record.BaseElevation,
            SoilType: record.SoilType,
            Attitude: record.Attitude,
            Longitude: record.Longitude,
            FieldRegistrationDate: record.FieldRegistrationDate,
            RouteID: record.RouteID,
            OwnerID: record.OwnerID,
            ZoneID: record.ZoneID,
            FactoryID: record.FactoryID
        });

        showInfoModel();
    }

    const showEditDrawer = (record) => {
        setSelectedField({
            FieldID: record.FieldID,
            FieldName: record.FieldName,
            FieldSize: record.FieldSize,
            FieldType: record.FieldType,
            FieldAddress: record.FieldAddress,
            TeaType: record.TeaType,
            BaseLocation: record.BaseLocation,
            BaseElevation: record.BaseElevation,
            SoilType: record.SoilType,
            Attitude: record.Attitude,
            Longitude: record.Longitude,
            FieldRegistrationDate: record.FieldRegistrationDate,
            RouteID: record.RouteID,
            OwnerID: record.OwnerID,
            ZoneID: record.ZoneID,
            FactoryID: record.FactoryID
        });
        setEditStatus(true);
        showDrawer();
    }

    const confirmationModelForUpdate = (id, data) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are You Want To Update That Field Information?",
            onOk: async () => {
                fieldUpdateModelConfirmation(id, data);
            },
            onCancel() { },
        });
    };

    const fieldUpdateModelConfirmation = async (fieldID, requestBody) => {
        const response = await apiExecutions.updateFieldInfo(fieldID, requestBody);
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                message.success('Field Updated Successfully : ' + response.message);
                fetchAllFields();
                onClose();
            } else {
                message.error('Failed to Update Field : ' + response.message);
            }
        } else {
            message.error('Failed to Update Field');
        }
    }

    const confirmDeleteModel = (fieldID) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are You Want To Delete That Field?",
            onOk: async () => {
                deleteFieldByFieldID(fieldID);
            },
            onCancel() { },
        });
    };

    const deleteFieldByFieldID = async (fieldID) => {
        const response = await apiExecutions.deleteFieldInfo(fieldID);
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                message.success('Field Deleted Successfully : ' + response.message);
                fetchAllFields();
            } else {
                message.error('Failed to Delete Field : ' + response.message);
            }
        } else {
            message.error('Failed to Delete Field');
        }
    }

    const columns = [
        {
            title: 'FieldID',
            dataIndex: 'FieldID',
            key: 'FieldID',
            render: (value) => {
                return <span className='textStyle-small'>{value}</span>;
            }
        },
        {
            title: 'Field Type',
            dataIndex: 'FieldType',
            key: 'FieldType',
            render: (value) => {
                return <span className='textStyle-small'>{value}</span>;
            }
        },
        {
            title: 'Tea Type',
            dataIndex: 'TeaType',
            key: 'TeaType',
            render: (value) => {
                return <span className='textStyle-small' style={{ textTransform: 'lowercase' }}>
                    {value}
                </span>;
            }
        },
        {
            title: 'Base Location',
            dataIndex: 'BaseLocation',
            key: 'BaseLocation',
            render: (value) => {
                return <span className='textStyle-small'>{value}</span>;
            }
        },
        {
            title: 'Soil Type',
            dataIndex: 'SoilType',
            key: 'SoilType',
            render: (value) => {
                return <span className='textStyle-small'>{value}</span>;
            }
        },
        {
            title: 'Route',
            dataIndex: 'RouteID',
            key: 'RouteID',
            render: (value) => {
                return <span className='textStyle-small'>{roadRoutings.map((route) => {
                    if (route.RoutingID === value) {
                        return route.Destination;
                    }
                })}</span>;
            }
        },
        {
            title: 'Factory',
            dataIndex: 'FactoryID',
            key: 'FactoryID',
            render: (value) => {
                return <span className='textStyle-small'>{factoriesList.map((factory) => {
                    if (factory.FactoryID === value) {
                        return factory.FactoryName;
                    }
                })}</span>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        shape="circle"
                        size="small"
                        icon={<EyeOutlined style={{ color: 'white', fontSize: '12px' }} />}
                        style={{ background: '#3bb64b', borderColor: '#3bb64b' }}
                        onClick={() => setSelectedDetails(record)}
                    />
                    <Button
                        shape="circle"
                        size="small"
                        icon={<EditOutlined style={{ color: 'white', fontSize: '12px' }} />}
                        style={{ background: '#1979ff', borderColor: '#1979ff' }}
                        onClick={() => showEditDrawer(record)}
                    />
                    <Button
                        shape="circle"
                        size="small"
                        icon={<DeleteOutlined style={{ color: 'white', fontSize: '12px' }} />}
                        style={{ background: 'red', borderColor: 'red' }}
                        onClick={() => confirmDeleteModel(record.FieldID)}
                    />
                </Space>
            ),
        },
    ];


    const handleFormSubmit = (values) => {
        // onClose();
        const requestBody = {
            FieldName: values.fieldName,
            FieldSize: values.fieldSize,
            FieldType: values.fieldType,
            FieldAddress: values.fieldAddress,
            TeaType: values.teaType,
            BaseLocation: values.baseLocation,
            BaseElevation: values.baseElevation,
            SoilType: values.soilType,
            Attitude: values.latitude,
            Longitude: values.longitude,
            FieldRegistrationDate: values.fieldRegistrationDate,
            RouteID: values.routeId,
            OwnerID: values.ownerId,
            ZoneID: values.zoneId,
            FactoryID: values.factoryId
        };
        // confirmationModel(requestBody);

        if (editStatus !== true) {
            confirmationModel(requestBody);
        } else {
            confirmationModelForUpdate(selectedField?.FieldID, requestBody);
        }
    };

    const columnStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        marginTop: '10px'
    };

    const mapStyles = {
        height: "200px",
        width: "100%",
        borderRadius: "10px"
    };

    const onFinishFilter = (values) => {
        console.log(values);
        const { searchField, filterFieldType } = values;
        if (searchField !== undefined && filterFieldType !== undefined) {
            const filteredData = fields.filter((field) => {
                return field.FieldID === searchField || field.FieldType === filterFieldType.toUpperCase();
            });
            setFields(filteredData);
        }
    }

    const onFinishFilterModal = (values) => {
        let filterdData = fields?.filter((field) => {
            return (
                (values?.zoneId == null || field.ZoneID === values?.zoneId) &&
                (values?.factoryId == null || field.FactoryID === values?.factoryId) &&
                (values?.routeId == null || field.RouteID === values?.routeId) &&
                (values?.fieldType == null || field.FieldType === values?.fieldType)
            );
        });
        setMappedData(filterdData);
        setOpenFilterModal(false);
    }

    const DateTimeConverter = ({ isoDateTime }) => {
        const dateObj = new Date(isoDateTime);
        const formattedDateTime = dateObj.toLocaleString();
        return formattedDateTime;
    }

    const filterationByFieldID = (value) => {
        const dropdownValue = dropdownValues;
        if ((value === undefined || value === null || value === "") && dropdownValue === "all") {
            setMappedData(fields);
        } else if ((value !== undefined || value !== null || value !== "") && dropdownValue === "all") {
            const filteredData = fields.filter((field) => {
                return field.FieldID.toString().includes(value);
            });
            setMappedData(filteredData);
        } else if ((value !== undefined || value !== null || value !== "") && dropdownValue !== "all") {
            const filteredData = fields.filter((field) => {
                return field.FieldID.toString().includes(value)
                    && field.FieldType === dropdownValue.toUpperCase();
            });
            setMappedData(filteredData);
        } else {
            setMappedData(fields);
        }
    }


    const filterationByFieldType = (value) => {
        setDropdownValues(value);
        if (value === "all") {
            setMappedData(fields);
        } else if (value !== "") {
            const filteredData = fields?.filter((field) => {
                return field?.FieldType === value.toUpperCase();
            });
            setMappedData(filteredData);
        }
    }

    const resetAllFilters = () => {
        setMappedData(fields);
        setDropdownValues('all');
    }


    return (
        <>
            <div style={{ marginTop: 10, marginBottom: 15 }}>
                <Row span={24}>
                    <Col span={12}><span className='textStyles-small' style={{ fontSize: 20, fontWeight: 500 }}>Fields Management</span></Col>
                    <Col span={12}>
                        <div style={{ background: 'white' }}>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Input
                                    className='borderedInput'
                                    placeholder="Search Field By ID"
                                    prefix={<SearchOutlined />}
                                    onChange={(e) => filterationByFieldID(e.target.value)}
                                    style={{ width: 200, height: 34, borderRadius: 12 }}
                                />
                                <Button className='add-new-button' 
                                icon={<FilterOutlined />}
                                style={{ width: 140, height: 34, borderRadius: 12 }}
                                onClick={() => setOpenFilterModal(true)}>
                                    <span className='textStyle-small'>Filter Fields</span>
                                </Button>
                                <Button className='add-new-button-secondary textStyle-small' 
                                style={{ width: 140, height: 34, borderRadius: 12 }}
                                onClick={showDrawer}>
                                    <PlusOutlined /> New Field
                                </Button>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </div>

            <div style={{
                padding: 10,
                background: 'white',
                borderRadius: 10,
                marginTop: 10,
            }}>
                <Table
                className='textStyle-small'
                    columns={columns}
                    dataSource={mappedData.length > 0 ? mappedData : filterValues}
                    pagination={{ pageSize: 20 }}
                    loading={fields.length === 0}
                    size="small"
                />
            </div>

            <Modal title={<span className='textStyle-small' style={{ fontSize: '14px' }}>Filter Details</span>}
                footer={true}
                width={350}
                visible={openFilterModal}
                onCancel={() => setOpenFilterModal(false)}
                destroyOnClose={true}
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    overflow: 'auto',
                }}
            >
                <Form
                    style={{ marginTop: 10 }}
                    onFinish={onFinishFilterModal}
                    layout="vertical">
                    <Form.Item label={<span className='textStyle-small'>Zone Name</span>} name="zoneId">
                        <Select
                            placeholder="Select Base Zone Name"
                            className="borderedDropdown"
                            style={{ width: '100%', height: 34 }}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {zonesList.map((zone, index) => {
                                return <Option key={index} value={zone.ZoneID}>
                                    <span className='textStyle-small'>{zone.ZoneName}</span>
                                </Option>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label={<span className='textStyle-small'>Factory Name</span>} name="factoryId">
                        <Select
                            placeholder="Select Factory Name"
                            showSearch
                            className="borderedDropdown"
                            style={{ width: '100%', height: 34 }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {factoriesList.map((factory, index) => (
                                <Option key={index} value={factory.FactoryID}>
                                    <span className='textStyle-small'>{factory.FactoryName}</span>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label={<span className='textStyle-small'>Route Name</span>} name="routeId">
                        <Select
                            placeholder="Select Route ID"
                            className="borderedDropdown"
                            style={{ width: '100%', height: 34 }}
                            showSearch>
                            {roadRoutings.map((roadRouting, index) => {
                                return <Option key={index} value={roadRouting.RoutingID}>
                                    <span className='textStyle-small'>{roadRouting.Destination}</span>
                                </Option>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label={<span className='textStyle-small'>Field Type</span>}
                        name="fieldType">
                        <Select
                            placeholder="Select Field Type"
                            showSearch
                            className="borderedDropdown"
                            style={{ width: '100%', height: 34 }}
                        >
                            <Option value="SMALL"><span className='textStyle-small'>Small</span></Option>
                            <Option value="MEDIUM"><span className='textStyle-small'>Medium</span></Option>
                            <Option value="LARGE"><span className='textStyle-small'>Large</span></Option>
                        </Select>
                    </Form.Item>

                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='add-new-button' style={{ width: '99%', height: 34 }}>
                                    <span className='textStyle-small'>Filter Fields</span>
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item>
                                <Button className='add-new-button' type="primary" danger style={{ width: '99%', borderColor: 'red', height: 34, float: 'right' }} htmlType='reset'
                                    onClick={() => setMappedData(fields)}
                                >
                                    <span className='textStyle-small'>Reset Filters</span>
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title={<span className='textStyle-small' style={{ fontSize: '14px' }}>Field Details : {selectedField?.FieldName}</span>}
                open={openDetails}
                onClose={hideInfoModel}
                onCancel={hideInfoModel}
                selectedField={selectedField}
                destroyOnClose={true}
                width={850}
                footer={false}
            >
                <div style={{
                    borderRadius: '10px',
                }}>
                    <div>
                        <GoogleMap
                            options={{ disableDefaultUI: true }}
                            mapContainerStyle={mapStyles}
                            zoom={7}
                            center={{
                                lat: !isNaN(Number(selectedField?.Attitude)) ? Number(selectedField?.Attitude) : 0,
                                lng: !isNaN(Number(selectedField?.Longitude)) ? Number(selectedField?.Longitude) : 0
                            }}
                        >
                            <Marker position={{
                                lat: !isNaN(Number(selectedField?.Attitude)) ? Number(selectedField?.Attitude) : 0,
                                lng: !isNaN(Number(selectedField?.Longitude)) ? Number(selectedField?.Longitude) : 0
                            }} />
                        </GoogleMap>
                    </div>
                    <div style={{marginTop: 10}}>
                        <Descriptions layout="horizontal" bordered size='small'>
                            <Descriptions.Item label={<span className='textStyle-small'>Field ID</span>}>
                                <span className='textStyle-small'>{selectedField.FieldID}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Field Name</span>}>
                                <span className='textStyle-small'>{selectedField.FieldName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Field Size</span>}>
                                <span className='textStyle-small'>{selectedField.FieldSize} Hectare</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Field Type</span>}>
                                <span className='textStyle-small'>{selectedField.FieldType}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Field Address</span>}>
                                <span className='textStyle-small'>{selectedField.FieldAddress}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Field Registration Date</span>}>
                                <span className='textStyle-small'>{selectedField.FieldRegistrationDate ? moment(selectedField.FieldRegistrationDate).format('YYYY-MM-DD') : ""}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Route Name</span>}>
                                <span className='textStyle-small'>{roadRoutings.map((route) => {
                                    if (route.RoutingID === selectedField.RouteID) {
                                        return route.Destination;
                                    }
                                })}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Owner Name</span>}>
                                <span className='textStyle-small'>{customersList.map((customer) => {
                                    if (customer.CustomerID === selectedField.OwnerID) {
                                        return customer.CustomerName;
                                    }
                                })}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Zone Name </span>}>
                                <span className='textStyle-small'>{zonesList.map((zone) => {
                                    if (zone.ZoneID === selectedField.ZoneID) {
                                        return zone.ZoneName;
                                    }
                                })}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Factory Name</span>}>
                                <span className='textStyle-small'>{factoriesList.map((factory) => {
                                    if (factory.FactoryID === selectedField.FactoryID) {
                                        return factory.FactoryName;
                                    }
                                })}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Base Location</span>}>
                                <span className='textStyle-small'>{selectedField.BaseLocation}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Base Elevation</span>}>
                                <span className='textStyle-small'>{selectedField.BaseElevation}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Soil Type</span>}>
                                <span className='textStyle-small'>{selectedField.SoilType}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className='textStyle-small'>Location</span>}>
                                <span className='textStyle-small'>{selectedField.Attitude} , {selectedField.Longitude}</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Modal>

            <Modal title={<span className='textStyle-small' style={{ fontSize: '14px' }}>{
                editStatus == true ? "Update Field Information" : "Register New Field"
            }</span>}
                footer={false}
                width={800}
                visible={open}
                onCancel={onClose}
                destroyOnClose={true}
            >
                <Form
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    initialValues={{ size: 'default', fieldRegistrationDate: moment() }}
                >
                    <div style={{ padding: '10px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small' rules={[{ required: true, message: 'Please enter Field Name' }]}>
                                    Field Name
                                </span>}
                                    className='textStyle-small'
                                    initialValue={selectedField?.FieldName ? selectedField?.FieldName : "Field_" + random(100000000, 999999999)}
                                    name="fieldName">
                                    <Input
                                        className='borderedInput' style={{ width: '99%', height : 34 }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Field Size (Hectare)</span>}
                                    name="fieldSize" className='textStyle-small'
                                    initialValue={selectedField?.FieldSize}
                                    rules={[{ required: true, message: 'Please enter Field Size' }]}>
                                    <Input type="number" className='borderedInput' style={{ width: '99%', height : 34 }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Field Type</span>}
                                    name="fieldType" className='textStyle-small'
                                    rules={[{ required: true, message: 'Please enter Field Type' }]}
                                    initialValue={selectedField?.FieldType}
                                >
                                    <Select
                                    className='borderedDropdown' style={{ width: '99%', height : 34 }}
                                        placeholder="Select Field Type"
                                        showSearch
                                    >
                                        <Option value="SMALL">Small</Option>
                                        <Option value="MEDIUM">Medium</Option>
                                        <Option value="LARGE">Large</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Field Address</span>}
                                    name="fieldAddress" className='textStyle-small'
                                    initialValue={selectedField?.FieldAddress}
                                    rules={[{ required: true, message: 'Please enter Field Address' }]}>
                                    <Input className='borderedInput' style={{ width: '99%', height : 34 }}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Tea Type</span>}
                                    name="teaType" className='textStyle-small'
                                    initialValue={selectedField?.TeaType}
                                    rules={[{ required: true, message: 'Please enter Tea Type' }]}>
                                    <Select
                                        placeholder="Select Tea Type"
                                        className='borderedDropdown' style={{ width: '99%', height : 34 }}
                                        showSearch>
                                        <Option value="camellia cinensis">Sinensis - Chinese Veriety</Option>
                                        <Option value="camellia sinensis assamica">Assamica - Indian Veriety</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Base Location</span>} name="baseLocation"
                                    initialValue={selectedField?.BaseLocation}
                                    rules={[{ required: true, message: 'Please enter Base Location' }]}>
                                    <Select
                                        className='borderedDropdown' style={{ width: '99%', height : 34 }}
                                        placeholder="Select Base Location"
                                        showSearch>
                                        {baseLocation?.map((city, index) => {
                                            return <Option key={index} value={city}>
                                            <span className='textStyle-small'>{city}</span>
                                                </Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Base Elevation (Degrees)</span>} name="baseElevation"
                                    initialValue={selectedField?.BaseElevation}
                                    rules={[{ required: true, message: 'Please enter Base Elevation' }]}>
                                    <Input type="number" className='borderedInput' style={{ width: '99%', height : 34 }}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Soil Type</span>}
                                    name="soilType"
                                    initialValue={selectedField?.SoilType}
                                    rules={[{ required: true, message: 'Please enter Soil Type' }]}>
                                    <Select
                                        placeholder="Select Soil Type"
                                        className='borderedDropdown' style={{ width: '99%', height : 34 }}
                                        showSearch>
                                        <Option value="Reddish Brown Earths">Reddish Brown Earths</Option>
                                        <Option value="Low Humic Gley Soils">Low Humic Gley Soils</Option>
                                        <Option value="Non- Calcic Brown soils">Non- Calcic Brown soils</Option>
                                        <Option value="Red-Yellow Latosols">Red-Yellow Latosols</Option>
                                        <Option value="Alluvial Soils">Alluvial Soils</Option>
                                        <Option value="Solodized Solonetz">Solodized Solonetz</Option>
                                        <Option value="Regosols">Regosols</Option>
                                        <Option value="Soils on Old Alluvium">Soils on Old Alluvium</Option>
                                        <Option value="Grumusols">Grumusols</Option>
                                        <Option value="Immature Brown Loams">Immature Brown Loams</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Latitude</span>}
                                    name="latitude"
                                    initialValue={selectedField?.Attitude}
                                    rules={[{ required: true, message: 'Please enter Latitude' }]}>
                                    <Input type="number" className='borderedInput' style={{ width: '99%', height : 34 }}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Longitude</span>}
                                    name="longitude"
                                    initialValue={selectedField?.Longitude}
                                    rules={[{ required: true, message: 'Please enter Longitude' }]}>
                                    <Input type="number" className='borderedInput' style={{ width: '99%', height : 34 }}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Owner Name</span>}
                                    name="ownerId"
                                    initialValue={selectedField?.OwnerID}
                                    rules={[{ required: true, message: 'Please enter Owner ID' }]}>
                                    <Select
                                        placeholder="Select Owner ID"
                                        className='borderedDropdown' style={{ width: '99%', height : 34 }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {customersList.map((customer, index) => {
                                            return <Option key={index} value={customer.CustomerID}>
                                                <span className='textStyle-small'>{customer.CustomerName}</span>
                                            </Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Zone Name</span>} name="zoneId"
                                    initialValue={selectedField?.ZoneID}
                                    rules={[{ required: true, message: 'Please select Zone ID' }]}>
                                    <Select
                                        placeholder="Select Base Zone Name"
                                        className='borderedDropdown' style={{ width: '99%', height : 34 }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {zonesList.map((zone, index) => {
                                            return <Option key={index} value={zone.ZoneID}>
                                                <span className='textStyle-small'>{zone.ZoneName}</span>
                                            </Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Factory Name</span>} name="factoryId"
                                    initialValue={selectedField?.FactoryID}
                                    rules={[{ required: true, message: 'Please enter Factory ID' }]}>
                                    <Select
                                        placeholder="Select Base Factory Name"
                                        showSearch
                                        className='borderedDropdown' style={{ width: '99%', height : 34 }}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {factoriesList.map((factory, index) => (
                                            <Option key={index} value={factory.FactoryID}>
                                                <span className='textStyle-small'>{factory.FactoryName}</span>
                                            </Option>
                                        ))}
                                    </Select>

                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<span className='textStyle-small'>Route ID</span>} name="routeId"
                                    initialValue={selectedField?.RouteID}
                                    rules={[{ required: true, message: 'Please enter Route ID' }]}>
                                    <Select
                                        className='borderedDropdown' style={{ width: '99%', height : 34 }}
                                        placeholder="Select Route ID"
                                        showSearch>
                                        {roadRoutings.map((roadRouting, index) => {
                                            return <Option key={index} value={roadRouting.RoutingID}>
                                                <span className='textStyle-small'>{roadRouting.Destination}</span>
                                            </Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col >
                                <Form.Item>
                                    {editStatus == true ?
                                        <Button className='add-new-button textStyle-small'
                                        htmlType="submit">
                                            Update Field Info
                                        </Button> :
                                        <Button  htmlType="submit" className='add-new-button textStyle-small'>
                                            Register New Field
                                        </Button>
                                    }
                                </Form.Item>
                            </Col>
                            <Col>
                            <Form.Item>
                                    <Button type="primary" danger className='textStyle-small' htmlType='reset' style={{ borderRadius: 12, width: '120px', height: 34, marginLeft: 10 }}>
                                        Reset Form
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default FieldManagement;