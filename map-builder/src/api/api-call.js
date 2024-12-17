import axios from 'axios';
import { baseDetails } from './api-config';
import { LocalStroage } from './localstorage';
import { get, random } from 'lodash';

const apiExecutions = {
    // authEmployee: async (username, password) => {
    //     /*
    //     {
    //         "success": true,
    //         "message": "Employee authenticated successfully",
    //         "traceId": "7fe844ee-3198-46db-a349-f70e3682b7a3",
    //         "responseTime": "2024-02-09T16:40:36.958Z",
    //         "data": {
    //             "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNpZ25EYXRhIjp7InVzZXJFbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGU1LmNvbSIsInVzZXJOYW1lIjoiSm9obiBEb2UiLCJ1c2VySWQiOjQzMDE2Mjg3MCwidXNlclR5cGUiOiJBRE1JTiIsImxvZ2luVGltZSI6IjIwMjQtMDItMDlUMTY6NDA6MzYuMDE5WiJ9fSwiaWF0IjoxNzA3NDk2ODM2LCJleHAiOjE3MDc3NTYwMzZ9.8D1qNdahDROd8RXl0LXcK8aZWSjOOJimWczuceU5JsI",
    //             "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNpZ25EYXRhIjp7InVzZXJFbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGU1LmNvbSIsInVzZXJOYW1lIjoiSm9obiBEb2UiLCJ1c2VySWQiOjQzMDE2Mjg3MCwidXNlclR5cGUiOiJBRE1JTiIsImxvZ2luVGltZSI6IjIwMjQtMDItMDlUMTY6NDA6MzYuMDE5WiJ9fSwiaWF0IjoxNzA3NDk2ODM2LCJleHAiOjE3MDgxMDE2MzZ9.rtqnaGB3safg0ZJsalQN-H4QSf6cKC2SNuW6jvQiVI8"
    //         }
    //     }*/
    //     try {
    //         const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/auth/employee', {
    //             email: username,
    //             password: password
    //         });
    //         console.log(response);
    //         // if response success then store the token in localStorage
    //         if (response?.data?.success) {
    //             console.log('Access Token:', response.data.accessToken);
    //             console.log('Refresh Token:', response.data.refreshToken);

    //             //localStorage.setItem('atoken', response.data.accessToken);
    //             //localStorage.setItem('rtoken', response.data.refreshToken);
    //         }
    //         //return response.data;
    //     } catch (error) {
    //         console.error('Axios error:', error);
    //         if (error.response) {
    //             console.error('Server responded with:', error.response.data);
    //         } else if (error.request) {
    //             console.error('No response received:', error.request);
    //         } else {
    //             console.error('Error setting up the request:', error.message);
    //         }
    //         return null;
    //     }
    // },
    authEmployee: async (username, password) => {
        try {
            const response = await fetch(baseDetails.CORE_SERVICE_URL + '/auth/employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    password: password,
                }),
            });
            const responseData = await response.json();
            if (responseData?.success) {
                localStorage.setItem('atoken', responseData.data.accessToken);
                localStorage.setItem('rtoken', responseData.data.refreshToken);
                localStorage.setItem('loginTime', new Date().getTime());
                localStorage.setItem('atokenExpireDate', responseData.data.accessTokenExpireDate);
                localStorage.setItem('rtokenExpireDate', responseData.data.refreshTokenExpireDate);
                localStorage.setItem('userRole', responseData.data.userRole);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('empName', responseData.data.employeeNameRegistered);
                localStorage.setItem('empID', responseData.data.authEmplyeeID);
            }
            return responseData;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    authCustomers: async (username, password) => {
        try {
            const response = await fetch(baseDetails.CORE_SERVICE_URL + '/auth/customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerEmail: username,
                    password: password,
                }),
            });
            const responseData = await response.json();
            if (responseData?.success) {
                localStorage.setItem('atoken', responseData.data.accessToken);
                localStorage.setItem('rtoken', responseData.data.refreshToken);
                localStorage.setItem('loginTime', new Date().getTime());
                localStorage.setItem('atokenExpireDate', responseData.data.accessTokenExpireDate);
                localStorage.setItem('rtokenExpireDate', responseData.data.refreshTokenExpireDate);
                localStorage.setItem('userRole', responseData.data.userRole);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('empName', responseData.data.customerName);
                localStorage.setItem('custID', responseData.data.customerID);
                localStorage.setItem('custEmail', responseData.data.customerEmail);
            }
            return responseData;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    updateEmployeePassword: async (oldPassword, newPassword, empID, mail) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/employee/passUpdate', {
                EmployeeID : empID,
                email: mail,
                oldPassword: oldPassword,
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    updateCustomerPassword: async (oldPassword, newPassword, custID, mail) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/customers/updatePassword', {
                customerID : custID,
                email: mail,
                oldPassword: oldPassword,
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getFieldInfoByOwnerID: async (ownerID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fieldInfo/getByFieldListByUID/' + ownerID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllEmployeeRoles: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roles', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
registerNewEmployee: async (employeeDetails) => {
    try {
        const response = await axios.post(
            baseDetails.CORE_SERVICE_URL + '/employees/add', 
            {
                EmployeeName: employeeDetails.name,
                EmployeeMobile: employeeDetails.mobile,
                EmployeeEmail: employeeDetails.email,
                EmployeeType: employeeDetails.type,
                FactoryID: employeeDetails.factory,
                Password: employeeDetails.password
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return error.request.data;
        } else {
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
},
updateEmployee: async (employeeID, employeeDetails) => {
    try {
        const response = await axios.put(
            baseDetails.CORE_SERVICE_URL + '/employees/update/' + employeeID, 
            {
                EmployeeName: employeeDetails.name,
                EmployeeMobile: employeeDetails.mobile,
                EmployeeEmail: employeeDetails.email,
                EmployeeType: employeeDetails.type,
                FactoryID: employeeDetails.factory,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            console.error('Server responded with:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
},
    getAllEmployees: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/employees', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    }, 
deleteEmployee: async (employeeID) => {
    try {
        const response = await axios.delete(
            baseDetails.CORE_SERVICE_URL + '/employees/drop/' + employeeID, 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            return error.response.data;
        }
        return null;
    }
},
getEmployeeDetailsByID: async (employeeID) => {
    try {
        const response = await axios.get(
            baseDetails.CORE_SERVICE_URL + '/employees/' + employeeID, 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            return error.response.data;
        }
        return null;
    }
},
    getAllCustomers: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/customers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllFieldInfo: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fieldInfo', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getFieldInfoByID: async (fieldID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fieldInfo/' + fieldID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    registerNewField: async (values) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/fieldInfo/add', {
                fieldSize: values.FieldSize,
                fieldType: values.FieldType,
                fieldAddress: values.FieldAddress,
                teaType: values.TeaType,
                baseLocation: values.BaseLocation,
                baseElevation: values.BaseElevation,
                soilType: values.SoilType,
                latitude: values.Attitude,
                longitude: values.Longitude,
                routeID: values.RouteID,
                ownerID: values.OwnerID,
                zoneID: values.ZoneID,
                factoryID: values.FactoryID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllEnvironmentZoneInfo: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/environmentalists', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllFactories : async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/factories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllRoadRoutings : async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roadRouting', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    updateFieldInfo: async (fieldID, values) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/fieldInfo/update/' + fieldID, {
                fieldSize: values.FieldSize,
                fieldType: values.FieldType,
                fieldAddress: values.FieldAddress,
                teaType: values.TeaType,
                baseLocation: values.BaseLocation,
                baseElevation: values.BaseElevation,
                soilType: values.SoilType,
                attitude: values.Attitude,
                longitude: values.Longitude,
                routeID: values.RouteID,
                ownerID: values.OwnerID,
                zoneID: values.ZoneID,
                factoryID: values.FactoryID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    
    deleteFieldInfo: async (fieldID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/fieldInfo/drop/' + fieldID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllRoadRoutings: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roadRouting', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    addNewRoadRouting: async (values) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/roadRouting/add', {
                SourceFactoryID: values.SourceFactoryID,
                Destination: values.Destination,
                RoundTrip: values.RoundTrip,
                StartLongitude: values.StartLongitude,
                StartLatitude: values.StartLatitude,
                EndLongitude: values.EndLongitude,
                EndLatitude: values.EndLatitude,
                CollectorID: values.CollectorID,
                Duration: values.duration,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /roadRouting/update/:RoadRoutingID
    updateRoadRouting: async (roadRoutingID, values) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/roadRouting/update/' + roadRoutingID, {
                SourceFactoryID: values.SourceFactoryID,
                Destination: values.Destination,
                RoundTrip: values.RoundTrip,
                StartLongitude: values.StartLongitude,
                StartLatitude: values.StartLatitude,
                EndLongitude: values.EndLongitude,
                EndLatitude: values.EndLatitude,
                CollectorID: values.CollectorID,
                Duration: values.duration,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    deleteRoutes : async (routeID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/roadRouting/drop/' + routeID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getRoadRoutingDetailsByID: async (routeID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roadRouting/' + routeID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllCoordinates: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/location', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // customerName: values?.customerName,
    // customerMobile: values?.customerMobile,
    // customerAddress: values?.customerAddress,
    // customerEmail: values?.customerEmail,
    // customerType: 'ROLE.CUSTOMER',
    // customerPassword: randomPassword(),
    // factoryID: values?.factoryID,
    // customerNIC: values?.customerNIC
    registerCustomer: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/customers/add', {
                customerName: data.customerName,
                customerMobile: data.customerMobile,
                customerAddress: data.customerAddress,
                customerEmail: data.customerEmail,
                customerType: data.customerType,
                customerPassword: data.customerPassword,
                factoryID: data.factoryID,
                customerNIC: data.customerNIC
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getCustomerByCustomerID: async (customerID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/customers/getById/' + customerID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    updateCustomerDetailsById: async (customerID, data) => {
        console.log(data);
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/customers/update/' + customerID, {
                CustomerName: data.customerName,
                CustomerMobile: data.customerMobile,
                CustomerAddress: data.customerAddress,
                CustomerEmail: data.customerEmail,
                CustomerType: data.customerType,
                FactoryID: data.factoryID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }); return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    deleteCustomerAccount: async (customerID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/customers/drop/' + customerID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }); return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // vehicles
    getAllVehicles: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/vehicles', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    addVehicle: async (data) => {
        console.log(data);
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/vehicles/add', {
                VehicleNumber: data.VehicleNumber,
                VehicleType: data.VehicleType,
                VolumeCapacity: data.VolumeCapacity,
                WeightCapacity: data.WeightCapacity,
                NumberPlateID: data.NumberPlateID,
                FactoryID: data.FactoryID,
                DriverID: data.DriverID,
                RouteID: data.RouteID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    }
    ,
    getVehicleDetailsByID: async (vehicleID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/vehicles/' + vehicleID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    updateVehicleDetailsByID: async (vehicleID, data) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/vehicles/update/' + vehicleID, {
                VehicleNumber: data.VehicleNumber,
                VehicleType: data.VehicleType,
                VolumeCapacity: data.VolumeCapacity,
                WeightCapacity: data.WeightCapacity,
                NumberPlateID: data.NumberPlateID,
                FactoryID: data.FactoryID,
                DriverID: data.DriverID,
                RouteID: data.RouteID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    deleteVehicleByID: async (vehicleID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/vehicles/drop/' + vehicleID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllDriversWithNoVehicleMappings: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/employees/drivers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllCollectors: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/employees/collectors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllRoadRoutingsWithoutMappings: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roadRouting/withoutMappings', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // dailyTeaCollection
    getAllDailyTeaCollection: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /dailyTeaCollection/getDataBetweenTwoDates
    getDailyTeaCollectionBetweenTwoDates: async (startDate, endDate) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/getDataBetweenTwoDates', {
                    startDate: startDate,
                    endDate: endDate
                },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /dailyTeaCollection/add
    addDailyTeaCollection: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/add', {
                FactoryID: data.FactoryID,
                FieldID: data.FieldID,
                CollectionDate: data.CollectionDate,
                CollectionTime: data.CollectionTime,
                CollectionWeight: data.CollectionWeight,
                CollectionType: data.CollectionType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /dailyTeaCollection/update/:DailyTeaCollectionID
    updateDailyTeaCollection: async (dailyTeaCollectionID, data) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/update/' + dailyTeaCollectionID, {
                FactoryID: data.FactoryID,
                FieldID: data.FieldID,
                CollectionDate: data.CollectionDate,
                CollectionTime: data.CollectionTime,
                CollectionWeight: data.CollectionWeight,
                CollectionType: data.CollectionType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /dailyTeaCollection/:DailyTeaCollectionID
    getDailyTeaCollectionByID: async (dailyTeaCollectionID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/' + dailyTeaCollectionID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /dailyTeaCollection/drop/:DailyTeaCollectionID
    deleteDailyTeaCollectionByID: async (dailyTeaCollectionID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/drop/' + dailyTeaCollectionID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }); return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    bulkEmployeeRegistration: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/employees/addBulkEmployees', {
                data
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    bulkDailyTeaCollection: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/admin/addBulk', {
                data : data
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    bulkCustomerRegisteration : async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/customers/addBulk', {
                data : data
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllFertilizerInfo: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fertilizers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    }
    ,
    addFertilizerInfo: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/fertilizers/add', {
                FertilizerName: data.FertilizerName,
                FertilizerType: data.FertilizerType,
                FertilizerPrice: data.FertilizerPrice,
                FertilizerQuantity: data.FertilizerQuantity,
                VendorName: data.VendorName,
                CodeName: data.CodeName,
                InstructionsToStore: data.InstructionsToStore,
                InstructionsToUse: data.InstructionsToUse,
                FertilizerDescription: data.FertilizerDescription
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getFertilizerInfoByID: async (fertilizerID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fertilizers/' + fertilizerID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    updateFertilizerInfo: async (fertilizerID, data) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/fertilizers/update/' + fertilizerID, {
                FertilizerName: data.FertilizerName,
                FertilizerType: data.FertilizerType,
                FertilizerPrice: data.FertilizerPrice,
                FertilizerQuantity: data.FertilizerQuantity,
                VendorName: data.VendorName,
                CodeName: data.CodeName,
                InstructionsToStore: data.InstructionsToStore,
                InstructionsToUse: data.InstructionsToUse,
                FertilizerDescription: data.FertilizerDescription
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    deleteFertilizerInfo: async (fertilizerID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/fertilizers/drop/' + fertilizerID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getBulkSumOfTeaCollection: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/bulkSum', {
                startDate : data?.startDate, 
                numOfDays : data?.numOfDays
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getDashboardStats: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/dashboard/stats', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getCollectionRouteWise: async (targetDate) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/dashboard/collectionSum/' + targetDate, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /fertilizers/order/getall
    getAllDertilizerOrdersList: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fertilizers/order/getall', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    approveFertilizerOrder: async (orderID, data) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/fertilizers/order/admin/approve/' + orderID, {
                ApprovalStatus: data?.ApprovalStatus,
                ApprovedQuantity: data?.ApprovedQuantity,
                ApprovedBy: data?.ApprovedBy,
                PaymentStatus: data?.PaymentStatus,
                Remarks: data?.Remarks,
                ApproveDate: data?.ApproveDate,
                SupposedDeliveryDate: data?.SupposedDeliveryDate,
                IsDelivered: data?.IsDelivered
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getFertilizerOrdersByFertilizerID: async (fertilizerID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fertilizers/order/getByFertilizerID/' + fertilizerID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /fertilizers/order/dashboard/getPendingPayments
    getPendingPaymentsDashboard: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fertilizers/order/dashboard/getPendingPayments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
//     router.get('/dailyTeaCollection/fieldSumovertime/:FieldID', DailyTeaCollectionController.getCollectionSumByFieldIDFunc);
    getCollectionSumByFieldID: async (fieldID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/fieldSumovertime/' + fieldID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },

// router.post('/dailyTeaCollection/fieldSumByDateRange', DailyTeaCollectionController.getCollectionSumOverTimeRangeFunc);
    getCollectionSumOverTimeRange: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/fieldSumByDateRange', {
                FieldID: data?.FieldID,
                startDate: data?.startDate,
                endDate: data?.endDate
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
// router.post('/dailyTeaCollection/fieldDataByDateRange', DailyTeaCollectionController.getCollectionByFieldIDandTimeRangeFunc);
    getCollectionByFieldIDandTimeRange: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/fieldDataByDateRange', {
                FieldID: data?.FieldID,
                startDate: data?.startDate,
                endDate: data?.endDate
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /dailyTeaCollection/fieldSumByDateRangeAndZone
    getCollectionSumByDateRangeAndZone: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/fieldSumByDateRangeAndZone', {
                FieldID: data?.FieldID,
                CollectionDate: data?.startDate,
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /fertilizers/order/getAll/:fieldID
    getFertilizerOrdersByFieldID: async (fieldID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fertilizers/order/getAll/' + fieldID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    placeFertilizerOrder: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/fertilizers/order/place', {
                FertilizerID: data?.FertilizerID,
                FieldID: data?.FieldID,
                OrderQuentity: data?.OrderQuentity,
                OrderDate: data?.OrderDate,
                RequestedDeadLine: data?.RequestedDeadLine,
                CustomerOrderStatus: data?.CustomerOrderStatus
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    rejectFertilizerOrder: async (orderID) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/fertilizers/order/reject/' + orderID, {
                CustomerOrderStatus: 'REJECTED'
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /dailyTeaCollection/getByMonthlyCount/:FieldID
    getCollectionByMonthlyCount: async (fieldID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/dailyTeaCollection/getByMonthlyCount/' + fieldID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // http://localhost:8000/weatherPrediction
getWeatherPrediction: async (data) => {
    try {
        const response = await axios.post(baseDetails.ML_MODEL_SERVICE_URL + 'weatherPrediction', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('atoken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return error.request.data;
        } else {
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
},
getAllComplaints: async () => {
    try {
        const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/complaints', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('atoken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return error.request.data;
        } else {
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
},
getRoutingMatrix: async (jsonData) => {
    try {
        const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/routing/routingMatrix', {
            "transportType": "driving-car",
            "locations": jsonData?.locations
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('atoken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return error.request.data;
        } else {
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
},
getFieldInfoByRouteID: async (routeID) => {
    try {
        const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fieldInfo/getByRouteID/' + routeID, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('atoken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return error.request.data;
        } else {
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
},
};

export { apiExecutions };
