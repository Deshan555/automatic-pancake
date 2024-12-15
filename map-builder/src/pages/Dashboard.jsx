import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../api/api-call';
import { Line, Area } from '@ant-design/charts';
import { Row, Col, DatePicker, Card, Table } from 'antd';
import { TeamOutlined, EnvironmentOutlined, PartitionOutlined, CarOutlined, NodeCollapseOutlined } from '@ant-design/icons';
import MapWithClusters from './maps/MapGoogle';
import AreaChart from './charts/AreaChart';
import PendingPaymentTable from '../components/PendingPaymentTable';
import SiderChart from './charts/SliderChart';
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import './../'
import moment from 'moment';

const Dashboard = () => {
  const [weeklyWiseCollection, setWeeklyWiseCollection] = useState([]);
  const [lastWeekCollection, setLastWeekCollection] = useState([]);
  const [chartNameCollection, setChartNameCollection] = useState('week');
  const [dashStatus, setDashStatusCount] = useState([]);
  const [routingWiseCollection, setRoutingWiseCollection] = useState([]);
  const [EnvironmentalZones, setEnvironmentalZones] = useState([]);
  const [showRoutingViseCollection, setShowRoutingViseCollection] = useState(false);

  useEffect(() => {
    fetchWeeklyCollectionSum(new Date().toISOString().split('T')[0], 7);
    fetchLastWeekCollectionSum(new Date().toISOString().split('T')[0]);
    fetchDashboardsStatus();
    fetchRoutingWiseCollectionSum();
    fetchAllEnvironmentalZones();
  }, []);

  const fetchAllEnvironmentalZones = async () => {
    try {
      const response = await apiExecutions.getAllEnvironmentZoneInfo();
      if (response !== null && response.success === true) {
        setEnvironmentalZones(response.data);
      }
    } catch (error) {
      console.error('Error fetching environmental zones:', error);
    }
  }

  const fetchRoutingWiseCollectionSum = async (fetchingDate) => {
    try {
      setShowRoutingViseCollection(false);
      const startDate = fetchingDate;
      const response = await apiExecutions.getCollectionRouteWise(startDate);
      if (response !== null && response.success === true) {
        setRoutingWiseCollection(response.data);
        setShowRoutingViseCollection(true);
      }
    } catch (error) {
      console.error('Error fetching routing wise collection sum:', error);
    }
  }

  const fetchDashboardsStatus = async () => {
    try {
      const response = await apiExecutions.getDashboardStats();
      if (response !== null && response.success === true) {
        setDashStatusCount(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard status:', error);
    }
  }

  const fetchWeeklyCollectionSum = async (startDate, prevDates) => {
    try {
      const requestJson = {
        startDate: startDate,
        numOfDays: prevDates
      }
      const response = await apiExecutions.getBulkSumOfTeaCollection(requestJson);
      if (response !== null && response.success === true) {
        setWeeklyWiseCollection(response.data);
      }
    } catch (error) {
      console.error('Error fetching weekly collection sum:', error);
    }
  }

  const fetchLastWeekCollectionSum = async () => {
    try {
      const requestJson = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        numOfDays: 7
      };
      const response = await apiExecutions.getBulkSumOfTeaCollection(requestJson);
      if (response !== null && response.success === true) {
        setLastWeekCollection(response.data);
      }
    } catch (error) {
      console.error('Error fetching last week collection sum:', error);
    }
  }

  const staticData = [
    { labelName: 'Customers', value: dashStatus[0]?.row_count, icon: <TeamOutlined style={{ fontSize: '1.5rem', color: '#003eb3' }} />, secondaryColor: '#e6f4ff' },
    { labelName: 'Field Info', value: dashStatus[1]?.row_count, icon: <EnvironmentOutlined style={{ fontSize: '1.5rem', color: '#237804' }} />, secondaryColor: '#d9f7be' },
    { labelName: 'Employees', value: dashStatus[2]?.row_count, icon: <PartitionOutlined style={{ fontSize: '1.5rem', color: '#c41d7f' }} />, secondaryColor: '#ffd6e7' },
    { labelName: 'Vehicles', value: dashStatus[3]?.row_count, icon: <CarOutlined style={{ fontSize: '1.5rem', color: '#531dab' }} />, secondaryColor: '#d3adf7' },
    { labelName: 'Routes', value: dashStatus[4]?.row_count, icon: <NodeCollapseOutlined style={{ fontSize: '1.5rem', color: '#d48806' }} />, secondaryColor: '#fff7e6' },
  ]


  const mapData = EnvironmentalZones.map((zone) => {
    const [latitude, longitude] = zone?.BaseLocation.split(',').map(Number);
    return {
      id: zone?.id,
      lat: latitude,
      lng: longitude,
      city: zone?.ZoneName,
      fieldCount: zone?.NumberOfFieldsRegistered,
    }
  })

  return (
    <>
      <Row span={24}>
        {
          staticData?.map((item, index) => (
            <Col style={{ width: '20%' }} key={index}>
              <div style={{ backgroundColor: 'white', borderRadius: '15px', margin: 10, padding: 20, borderColor: 'gray', borderWidth: 0.5, borderStyle: 'solid' }}>
                <Row>
                  <Col span={12}>
                    <span className="textStyles-small" style={{ fontSize: 12, color: 'gray', fontWeight: 'bold' }}>
                      {item.labelName}
                    </span> <br />
                    <span className="textStyles-small" style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>
                      {item.value}
                    </span>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: item.secondaryColor,
                        borderColor: item.secondaryColor,
                        borderRadius: 12,
                        padding: 10,
                        width: '40px',
                        height: '40px',
                      }}
                    >
                      {item.icon}
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          ))
        }
      </Row>

      <Row span={24} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card
            style={{ width: '99%', height: '400px' }}
            title={<span className="textStyles-small" style={{ fontSize: 14, fontWeight: 450 }}>Weekly Collection Summery</span>}
            extra={<DatePicker
              style={{
                width: '200px',
              }}
              className="borderedSelect"
              onChange={(date, dateString) => fetchWeeklyCollectionSum(dateString, 7)}
            />}
          >
            <AreaChart
              data={weeklyWiseCollection?.map((item) => ({ date: moment(item?.date).format('DD-MM'), sum: item?.sum }))}
              allDataEmpty={weeklyWiseCollection.map((item) => item?.sum).reduce((a, b) => a + b, 0) === 0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="custom-scroll"
            style={{ width: '100%', height: '400px', padding: 0, margin: 0, overflowY: 'auto' }}
            title={<span className="textStyles-small" style={{ fontSize: 14, fontWeight: 450 }}>Field Count By Zone</span>}
          >
            <Table
              pagination={false}
              bordered={false}
              size='small'
              style={{ width: '100%', height: '100%', overflowY: 'auto' }}
              dataSource={mapData}
              className='custom-table'
              columns={[
                {
                  dataIndex: 'city',
                  key: 'city',
                  render: (text) => <span className='textStyles-small'>{text}</span>
                },
                {
                  dataIndex: 'fieldCount',
                  key: 'fieldCount',
                  render: (text) => <span className='textStyles-small'>{text}</span>
                }
              ]} />

          </Card>
        </Col>
      </Row>

      <Row span={24} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card
            style={{ width: '100%', height: '350px' }}
            title={<span className="textStyles-small" style={{ fontSize: 14, fontWeight: 480 }}>Daily Routewise Collection Summery</span>}
            extra={<DatePicker
              style={{
                width: '200px',
              }}
              className="borderedSelect"
              onChange={(date, dateString) => fetchRoutingWiseCollectionSum(dateString)}
            />}
          >
            <SiderChart
              data={routingWiseCollection}
              allDataEmpty={routingWiseCollection.map((item) => item?.TotalTeaWeight).reduce((a, b) => a + b, 0) === 0}
            />
          </Card>
        </Col>
      </Row>

      <Row span={24} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card
            style={{ width: '100%', height: '350px' }}
            title={<span className="textStyles-small" style={{ fontSize: 14, fontWeight: 450 }}>Pending Payments</span>}
          >
            <PendingPaymentTable />
          </Card>
        </Col>
      </Row>

    </>);

};

export default Dashboard;
