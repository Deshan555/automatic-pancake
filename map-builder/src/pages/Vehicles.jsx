import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  HomeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { number } from 'prop-types';
import { CSVLink, CSVDownload } from "react-csv";
// import { authenticationCheck } from '../vehicleModule/AuthChecker';

const VehicleModule = () => {
  const [factoryList, setFactoryList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [infoMoadl, setInfoModal] = useState(false);
  const [getAllVehicles, setAllVehicles] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [getAllDrivers, setAllDrivers] = useState([]);
  const [getAllRoutes, setAllRoutes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllVehicles();
    fetchAllFactories();
    allDriversForMapping();
    getAllAvailableRoutes();
    // authenticationCheck(navigate);
  }, []);

  const fetchAllFactories = async () => {
    const response = await apiExecutions.getAllFactories();
    if (response.success === true) {
      setFactoryList(response.data);
    } else {
      message.error('Failed to fetch factories');
    }
  }

  const fetchAllVehicles = async () => {
    const response = await apiExecutions.getAllVehicles();
    if (response !== null) {
      if (response.success === true) {
        setAllVehicles(response.data);
        setFilteredData(response.data);
      } else {
        message.error(response?.message);
      }
    }
  }

  const allDriversForMapping = async () => {
    const response = await apiExecutions.getAllDriversWithNoVehicleMappings();
    if (response !== null) {
      if (response.success === true) {
        setAllDrivers(response.data);
      } else {
        message.error(response.message);
      }
    }
  }

  const getAllAvailableRoutes = async () => {
    const response = await apiExecutions.getAllRoadRoutingsWithoutMappings();
    if (response !== null) {
      if (response.success === true) {
        setAllRoutes(response.data);
      } else {
        message.error('Failed to fetch routes');
      }
    }
  }

  const columns = [
    {
      title: <span className='textStyles-small'>Vehicle Master Number</span>,
      dataIndex: 'VehicleNumber',
      key: 'VehicleNumber',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>Vehicle Type</span>,
      dataIndex: 'VehicleType',
      key: 'VehicleType',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>Volume Capacity</span>,
      dataIndex: 'VolumeCapacity',
      key: 'VolumeCapacity',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>Weight Capacity</span>,
      dataIndex: 'WeightCapacity',
      key: 'WeightCapacity',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>Number Plate ID</span>,
      dataIndex: 'NumberPlateID',
      key: 'NumberPlateID',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>Factory ID</span>,
      dataIndex: 'FactoryID',
      key: 'FactoryID',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>Driver ID</span>,
      dataIndex: 'DriverID',
      key: 'DriverID',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>Route ID</span>,
      dataIndex: 'RouteID',
      key: 'RouteID',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },

    {
      title: <span className='textStyles-small'>Action</span>,
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            shape="circle"
            style={{ background: '#3bb64b' }}
            icon={<EyeOutlined style={{ color: 'white', fontSize: 12 }} />}
            onClick={() => getVehicleDetailsByIDFunction(record.VehicleID, 'VIEW')}
            size="small"
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined style={{ color: 'white', fontSize: 12 }} />}
            onClick={() => getVehicleDetailsByIDFunction(record.VehicleID, 'EDIT')}
            size="small"
          />
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined style={{ color: 'white', fontSize: 12 }} />}
            onClick={() => confirmationModelDelete(record.VehicleID)}
            size="small"
            danger
          />

        </Space>
      ),
    },
  ];

  const confirmationModelDelete = (vehicleID) => {
    const { confirm } = Modal;
    confirm({
      title:
        "Are You Want To Delete This Vehicle Information Record ?",
      onOk: async () => {
        deleteVehicleByID(vehicleID);
      },
      onCancel() { },
    });
  };

  const confirmUpdateVehicle = (vehicleID, requestJson) => {
    const { confirm } = Modal;
    confirm({
      title: "Are You Sure You Want To Update Vehicle Information Details?",
      onOk: async () => {
        updateVehicleFunction(vehicleID, requestJson);
      },
      onCancel() { },
    });
  }

  const confirmCreateVehicle = (requestJson) => {
    const { confirm } = Modal;
    confirm({
      title: "Are You Sure You Want To Create New Vehicle?",
      onOk: async () => {
        registerNewVehicle(requestJson);
      },
      onCancel() { },
    });
  }

  const onFinish = (values) => {
    if (isEdit !== true) {
      const requestJson = {
        VehicleNumber: values.VehicleNumber,
        VehicleType: values.VehicleType,
        VolumeCapacity: values.VolumeCapacity,
        WeightCapacity: values.WeightCapacity,
        NumberPlateID: values.NumberPlateID,
        FactoryID: values.FactoryID,
        DriverID: values.DriverID,
        RouteID: values.RouteID
      }
      confirmCreateVehicle(requestJson);
    } else {
      const requestBody = {
        VehicleNumber: values.VehicleNumber,
        VehicleType: values.VehicleType,
        VolumeCapacity: values.VolumeCapacity,
        WeightCapacity: values.WeightCapacity,
        NumberPlateID: values.NumberPlateID,
        FactoryID: values.FactoryID,
        DriverID: values.DriverID,
        RouteID: values.RouteID
      }
      confirmUpdateVehicle(vehicleDetails?.VehicleID, requestBody);
    }
  }

  const registerNewVehicle = async (requestJson) => {
    const result = await apiExecutions.addVehicle(requestJson);
    if (result !== null) {
      if (result.success === true) {
        message.success('Vehicle Registered Successfully');
        fetchAllVehicles();
        modelClose();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const updateVehicleFunction = async (vehicleID, requestJson) => {
    const result = await apiExecutions.updateVehicleDetailsByID(vehicleID, requestJson);
    if (result !== null) {
      if (result.success === true) {
        message.success('Vehicle Updated Successfully');
        fetchAllVehicles();
        modelClose();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const deleteVehicleByID = async (vehicleID) => {
    const result = await apiExecutions.deleteVehicleByID(vehicleID);
    if (result !== null) {
      if (result.success === true) {
        message.success('Vehicle Deleted Successfully');
        fetchAllVehicles();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const getVehicleDetailsByIDFunction = async (vehicleID, type) => {
    const fetchVehicleInfo = await apiExecutions.getVehicleDetailsByID(vehicleID);
    console.log(fetchVehicleInfo);
    if (fetchVehicleInfo !== null) {
      if (fetchVehicleInfo.success === true) {
        setVehicleDetails(fetchVehicleInfo?.data[0]);
        if (type === 'EDIT') {
          showModel(true);
        } else {
          showDetailsModel();
        }
      } else {
        message.error('Failed to fetch vehicle details');
      }
    }
  }

  const modelClose = () => {
    setIsModalVisible(false);
    setIsEdit(false);
  }

  const showModel = (editTrue) => {
    setIsModalVisible(true);
    setIsEdit(editTrue);
  }

  const showDetailsModel = () => {
    setInfoModal(true);
  }

  const modelCloseDetails = () => {
    setInfoModal(false);
  }

  const filterByIncludeData = (registerNumber) => {
    if (registerNumber === '' || registerNumber === null) {
      setFilteredData(getAllVehicles);
    } else {
      const filteredDataSet = getAllVehicles.filter((item) => {
        return item.VehicleNumber.toLowerCase().includes(registerNumber.toLowerCase());
      });
      setFilteredData(filteredDataSet);
    }
  }

  return (
    <>
      <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
        <Space>
          <div style={{ padding: 10, background: 'white', borderRadius: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Space align="end">
              <Input
                placeholder="Search Vehicle By Number"
                className='textStyle-small'
                onChange={(e) => filterByIncludeData(e.target.value)}
                suffix={<SearchOutlined />}
                style={{ width: 200, borderRadius: 10, height: 30 }}
              />
              <CSVLink
                data={getAllVehicles}
                filename={`Vehicles_${new Date().toISOString()}.csv`}
                target='_blank'
              >
                <Button type="primary"
                  className="textStyles-small"
                  style={{ borderRadius: "50px", background: '#3bb64b', borderColor: '#3bb64b' }}>
                  <DownloadOutlined /> Export List
                </Button>
              </CSVLink>
              <Button type="primary"
                onClick={showModel}
                style={{ borderRadius: "50px" }}>
                <PlusOutlined /> <span className='textStyle-small'>New Vehicle</span>
              </Button>
            </Space>
          </div>
        </Space>
      </div>

      <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
        <Table
          dataSource={filteredData}
          columns={columns}
          loading={getAllVehicles.length === 0 ? true : false}
          pagination={true}
          size="small"
        />
      </div>


      <Modal
        title={
          <span className="textStyles-small" style={{ fontSize: 16 }}>
            Vehicle Details - VID{vehicleDetails?.VehicleID}
          </span>
        }
        visible={infoMoadl}
        onOk={modelCloseDetails}
        onCancel={modelCloseDetails}
        footer={null}
        width={800}
        destroyOnClose={true}
      >
        <Descriptions
          bordered
          size="small"
          column={2}
          style={{ marginTop: 20 }}
        >
          <Descriptions.Item label="Vehicle Number" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.VehicleNumber}</Descriptions.Item>
          <Descriptions.Item label="Vehicle Type" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.VehicleType}</Descriptions.Item>
          <Descriptions.Item label="Volume Capacity" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.VolumeCapacity}</Descriptions.Item>
          <Descriptions.Item label="Weight Capacity" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.WeightCapacity}</Descriptions.Item>
          <Descriptions.Item label="Number Plate ID" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.NumberPlateID}</Descriptions.Item>
          <Descriptions.Item label="Factory ID" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.FactoryID}</Descriptions.Item>
          <Descriptions.Item label="Driver ID" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.DriverID}</Descriptions.Item>
          <Descriptions.Item label="Route ID" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.RouteID}</Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title={
          isEdit === true ? <span className='textStyles-small' style={{ fontSize: 16 }}>
            Edit Vehicle Details
          </span> :
            <span className='textStyles-small' style={{ fontSize: 16 }}>
              Register New Vehicle</span>
        }
        visible={isModalVisible}
        onOk={modelClose}
        onCancel={modelClose}
        footer={null}
        width={800}
        destroyOnClose={true}
      >
        <Form
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          className="textStyles-small"
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Vehicle Number</span>}
                name="VehicleNumber"
                rules={[{ required: true, message: 'Please input vehicle number!' }]}
                initialValue={vehicleDetails?.VehicleNumber}
                style={{ width: '90%' }}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Vehicle Type</span>}
                name="VehicleType"
                rules={[{ required: true, message: 'Please input vehicle type!' }]}
                initialValue={vehicleDetails?.VehicleType}
                style={{ width: '90%' }}
              >
                <Select
                  placeholder="Select Vehicle Type"
                  allowClear
                >
                  <Select.Option value="TRUCK">Truck</Select.Option>
                  <Select.Option value="LORRY">Lorry</Select.Option>
                  <Select.Option value="MINI_LORRY">Mini Lorry</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Volume Capacity</span>}
                name="VolumeCapacity"
                rules={[{ required: true, message: 'Please input volume capacity!' }]}
                initialValue={vehicleDetails?.VolumeCapacity}
                style={{ width: '90%' }}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Weight Capacity</span>}
                name="WeightCapacity"
                rules={[{ required: true, message: 'Please input weight capacity!' }]}
                initialValue={vehicleDetails?.WeightCapacity}
                style={{ width: '90%' }}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Number Plate ID</span>}
                name="NumberPlateID"
                rules={[{ required: true, message: 'Please input number plate ID!' }]}
                initialValue={vehicleDetails?.NumberPlateID}
                style={{ width: '90%' }}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Factory ID</span>}
                name="FactoryID"
                rules={[{ required: true, message: 'Please input factory ID!' }]}
                initialValue={vehicleDetails?.FactoryID}
                style={{ width: '90%' }}
              >
                <Select
                  placeholder="Select Factory"
                  allowClear
                >
                  {
                    factoryList.map((item, index) => {
                      return <Select.Option key={index} value={item.FactoryID}>{item.FactoryName}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Driver ID</span>}
                name="DriverID"
                rules={[{ required: true, message: 'Please input driver ID!' }]}
                initialValue={vehicleDetails?.DriverID}
                style={{ width: '90%' }}
              >
                <Select
                  placeholder="Select Driver"
                  allowClear
                >
                  {
                    isEdit ? <Select.Option value={vehicleDetails?.DriverID}>{vehicleDetails?.DriverID}</Select.Option> : null
                  }
                  {
                    getAllDrivers?.map((item, index) => {
                      return <Select.Option key={index} value={item.EmployeeID}>{item.EmployeeName}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Route ID</span>}
                name="RouteID"
                rules={[{ required: true, message: 'Please input route ID!' }]}
                initialValue={vehicleDetails?.RouteID}
                style={{ width: '90%' }}
              >
                <Select
                  placeholder="Select Route"
                  allowClear
                >
                  {
                    isEdit ? <Select.Option value={vehicleDetails?.RouteID}>{vehicleDetails?.RouteID}</Select.Option> : null
                  }
                  {
                    getAllRoutes?.map((item, index) => {
                      return <Select.Option key={index} value={item.RoutingID}>{item.RoutingID}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "10px" }}
              className="textStyles-small"
            >
              {
                isEdit === true ? 'Update Vehicle' : 'Register Vehicle'
              }
            </Button>

            <Button
              type="danger"
              style={{ borderRadius: "10px", borderColor: 'gray', width: 150, marginLeft: 10 }}
              className="textStyles-small"
              onClick={modelClose}
            >
              Cancel
            </Button>
          </Row>

        </Form>
      </Modal>
    </>
  )
}

export default VehicleModule;