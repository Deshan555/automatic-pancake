import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
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
import { CSVLink, CSVDownload } from "react-csv";
// import { authenticationCheck } from '../vehicleModule/AuthChecker';

const Customers = () => {
  // const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [factoryList, setFactoryList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [infoMoadl, setInfoModal] = useState(false);
  const [filterList, setFilterList] = useState([]);

  useEffect(() => {
    getAllCustomers();
    fetchAllFactories();
    // authenticationCheck(navigate);
  }, []);

  const getAllCustomers = async () => {
    try {
      const customers = await apiExecutions.getAllCustomers();
      if (customers && customers.success === true) {
        setCustomers(customers.data);
        setFilterList(customers.data);
      } else {
        message.error(customers ? customers.message : 'Failed to fetch customers');
      }
    } catch (error) {
      message.error('An error occurred while fetching customers');
    }
  }
  
  const fetchAllFactories = async () => {
    try {
      const response = await apiExecutions.getAllFactories();
      if (response && response.success === true) {
        setFactoryList(response.data);
      } else {
        message.error(response ? response.message : 'Failed to fetch factories');
      }
    } catch (error) {
      message.error('An error occurred while fetching factories');
    }
  }

  const columns = [
    {
      title: <span className='textStyles-small'>CustomerID</span>,
      dataIndex: 'CustomerID',
      key: 'CustomerID',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>CustomerName</span>,
      dataIndex: 'CustomerName',
      key: 'CustomerName',
      render: (value) => {
        return <span className='textStyle-small'>
          {value}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>CustomerMobile</span>,
      dataIndex: 'CustomerMobile',
      key: 'CustomerMobile',
      render: (number) => {
        return (
          <a href={`tel:${number}`}>
            <span className='textStyle-small'>
              <PhoneOutlined /> {number}
            </span>
          </a>
        );
      }
    },
    {
      title: <span className='textStyles-small'>CustomerEmail</span>,
      dataIndex: 'CustomerEmail',
      key: 'CustomerEmail',
      render: (email) => {
        return (
          <a href={`mailto:${email}`}>
            <span className='textStyle-small'>
              <MailOutlined /> {email}
            </span>
          </a>
        );
      }
    },
    {
      title: <span className='textStyles-small'>CustomerAddress</span>,
      dataIndex: 'CustomerAddress',
      key: 'CustomerAddress',
      render: (address) => {
        return <span className='textStyle-small'>
          {address}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>FactoryID</span>,
      dataIndex: 'FactoryID',
      key: 'FactoryID',
      render: (value) => {
        return <span className='textStyle-small'>
          {factoryList?.map((factory) => {
            if (factory.FactoryID === value) {
              return factory.FactoryName;
            }
          })}
        </span>
      }
    },
    {
      title: <span className='textStyles-small'>Action</span>,
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            shape="circle"
            size="small"
            icon={<EyeOutlined style={{ color: 'white', fontSize: '12px' }} />}
            style={{ background: '#3bb64b', borderColor: '#3bb64b' }}
            onClick={() => getCustomersByCustomerID(record.CustomerID, 'INFO')}
          />
          <Button
            shape="circle"
            size="small"
            icon={<EditOutlined style={{ color: 'white', fontSize: '12px' }} />}
            style={{ background: '#1677ff', borderColor: '#1677ff' }}
            onClick={() => getCustomersByCustomerID(record.CustomerID, 'EDIT')}
          />
          <Button
            shape="circle"
            size="small"
            icon={<DeleteOutlined style={{ color: 'white', fontSize: '12px' }} />}
            style={{ background: 'red', borderColor: 'red' }}
            onClick={() => confirmationModelDelete(record.CustomerID)}
          />
        </Space>
      ),
    },
  ];

  const confirmationModelDelete = (fieldID) => {
    const { confirm } = Modal;
    confirm({
      title:
        "Are you sure you want to delete this customer?",
      onOk: async () => {
        deleteCustomerFunction(fieldID);
      },
      onCancel() { },
    });
  };

  const confirmationModelEdit = (fieldID, condition) => {
    const { confirm } = Modal;
    confirm({
      title: "Are you sure you want to edit this customer?",
      onOk: async () => {
        updateCustomerFunction(fieldID, condition);
      },
      onCancel() { },
    });
  };

  const confirmationRegisterCustomer = (data) => {
    const { confirm } = Modal;
    confirm({
      title: "Are you sure you want to register new customer?",
      onOk: async () => {
        registerCustomerFunction(data);
      },
      onCancel() { },
    });
  };

  const randomPassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  const onFinish = (values) => {
    console.log(values);
    if (isEdit === true) {
      const requestJson = {
        customerID: customerDetails?.CustomerID,
        customerName: values?.customerName,
        customerMobile: values?.customerMobile,
        customerAddress: values?.customerAddress,
        customerEmail: values?.customerEmail,
        customerType: 'ROLE.CUSTOMER',
        registrationDate: customerDetails?.RegistrationDate,
        factoryID: values?.factoryID,
        identitiCardNumber: values?.customerNIC
      }
      confirmationModelEdit(customerDetails?.CustomerID, requestJson);
    } else {
      const requestJson = {
        customerName: values?.customerName,
        customerMobile: values?.customerMobile,
        customerAddress: values?.customerAddress,
        customerEmail: values?.customerEmail,
        customerType: 'ROLE.CUSTOMER',
        customerPassword: randomPassword(),
        factoryID: values?.factoryID,
        customerNIC: values?.customerNIC
      }
      confirmationRegisterCustomer(requestJson);
    }
  }

  const registerCustomerFunction = async (requestJson) => {
    const result = await apiExecutions.registerCustomer(requestJson);
    if (result !== null) {
      if (result.success === true) {
        message.success('Customer Registered Successfully');
        getAllCustomers();
        modelClose();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const updateCustomerFunction = async (customerID, requestJson) => {
    console.log(requestJson);
    const result = await apiExecutions.updateCustomerDetailsById(customerID, requestJson);
    if (result !== null) {
      if (result.success === true) {
        message.success('Customer Updated Successfully');
        getAllCustomers();
        modelClose();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const deleteCustomerFunction = async (customerID) => {
    const result = await apiExecutions.deleteCustomerAccount(customerID);
    if (result !== null) {
      if (result.success === true) {
        message.success('Customer Deleted Successfully');
        getAllCustomers();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const getCustomersByCustomerID = async (customerID, type) => {
    const fetchCustomerInfo = await apiExecutions.getCustomerByCustomerID(customerID);
    console.log(fetchCustomerInfo);
    if (fetchCustomerInfo !== null) {
      if (fetchCustomerInfo.success === true) {
        setCustomerDetails(fetchCustomerInfo?.data[0]);
        if (type === 'EDIT') {
          showModel(true);
        } else {
          showDetailsModel();
        }
      } else {
        message.error('Failed to fetch customer details');
      }
    }
  }

  const filterByUserName = (value) => {
    if (value === '') {
      setFilterList(customers);
    } else {
      const filteredData = customers.filter((customer) => {
        return customer.CustomerName.toLowerCase().includes(value.toLowerCase()) || 
        customer.CustomerMobile.includes(value) || 
        customer.CustomerEmail.toLowerCase().includes(value.toLowerCase());
      });
      setFilterList(filteredData);
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

  return (
    <>

      <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
        <Space>
          <div style={{ padding: 10, background: 'white', borderRadius: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Space align="end">
              <Input
                placeholder="Search employee"
                onChange={(e) => filterByUserName(e.target.value)}
                suffix={<SearchOutlined />}
              />
              <CSVLink
                data={customers}
                filename={`Customers_${new Date().toISOString()}.csv`}
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
                <PlusOutlined /> <span className='textStyle-small'>New Customer</span>
              </Button>
            </Space>
          </div>
        </Space>
      </div>
      <Table
        dataSource={filterList}
        columns={columns}
        loading={customers?.length === 0}
        pagination={true}
      />

      <Modal
        title={
          <span className="textStyles-small" style={{ fontSize: 16 }}>
            Customer Details
          </span>
        }
        visible={infoMoadl}
        onOk={modelCloseDetails}
        onCancel={modelCloseDetails}
        footer={null}
        width={800}
      >
        <Descriptions
          bordered
          size="small"
          column={2}
        >
          <Descriptions.Item label="Customer Name" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.CustomerName}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Mobile" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.CustomerMobile}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Address" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.CustomerAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Email" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.CustomerEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Factory ID" className="textStyles-small" style={{ fontSize: 12 }}>
            {factoryList?.map((factory) => {
              if (factory.FactoryID === customerDetails?.FactoryID) {
                return factory.FactoryName;
              }
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Customer NIC" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.IdentitiCardNumber}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title={
          isEdit === true ? <span className='textStyles-small' style={{ fontSize: 16 }}>
            Edit Customer Details
          </span> :
            <span className='textStyles-small' style={{ fontSize: 16 }}>
              Register New Customer</span>
        }
        visible={isModalVisible}
        onOk={modelClose}
        onCancel={modelClose}
        footer={null}
        width={800}
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
                label={<span className="textStyles-small">Customer Name</span>}
                name="customerName"
                rules={[{ required: true, message: 'Please input customer name!' }]}
                initialValue={customerDetails?.CustomerName}
                style={{ width: '90%' }}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Customer Mobile</span>}
                name="customerMobile"
                rules={[{ required: true, message: 'Please input customer mobile!' },
                { pattern: new RegExp(/^[0-9\b]+$/), message: 'Please enter only number' },
                { max: 10, message: 'Please enter 10 digit number' },
                { min: 10, message: 'Please enter 10 digit number' }]}
                initialValue={customerDetails?.CustomerMobile}
                style={{ width: '90%' }}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Customer Address</span>}
                name="customerAddress"
                rules={[{ required: true, message: 'Please input customer address!' }]}
                initialValue={customerDetails?.CustomerAddress}
                style={{ width: '90%' }}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Customer Email</span>}
                name="customerEmail"
                rules={[{ required: true, message: 'Please input customer email!' },
                { type: 'email', message: 'Please enter valid email' }]}
                initialValue={customerDetails?.CustomerEmail}
                style={{ width: '90%' }}
              >
                <Input type="email" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Factory ID</span>}
                name="factoryID"
                rules={[{ required: true, message: 'Please input factory ID!' }]}
                initialValue={customerDetails?.FactoryID}
                style={{ width: '90%' }}
              >
                <Select
                  showSearch
                  placeholder="Select a factory"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {factoryList.map((factory) => (
                    <Select.Option key={factory.FactoryID} value={factory.FactoryID}>
                      {factory.FactoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Customer NIC</span>}
                name="customerNIC"
                rules={[{ required: true, message: 'Please input customer NIC!' }]}
                initialValue={customerDetails?.IdentitiCardNumber}
                style={{ width: '90%' }}
              >
                <Input type="text" />
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
                isEdit === true ? 'Update Customer' : 'Register Customer'
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

export default Customers;