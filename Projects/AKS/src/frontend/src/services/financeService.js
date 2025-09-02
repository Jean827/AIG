// Finance and land rights management service, used to interact with backend API

// Mock financing information data
const mockFinancingInfo = [
  {
    id: '1',
    farmerId: '3',
    farmerName: 'Li Si',
    contractId: '2',
    contractNo: 'HT202306002',
    landId: '105',
    landName: 'Aksu Tuanjie Township Farmland',
    applicationNo: 'RZ202306001',
    applicationAmount: 30000,
    approvedAmount: 25000,
    loanPeriod: 12, // months
    interestRate: 4.5, // annual interest rate %
    status: 'approved', // pending, approved, rejected, disbursed, repaid
    applicationDate: '2023-06-20',
    approvalDate: '2023-06-25',
    disbursementDate: '2023-06-30',
    repaymentDate: '2024-06-30',
    bankName: 'Agricultural Bank',
    contactPerson: 'Zhang San',
    contactPhone: '13800138000',
    createdBy: 'admin',
    createTime: '2023-06-20T10:00:00Z',
    updateTime: '2023-06-25T14:30:00Z',
    remark: 'For purchasing agricultural production materials',
    documents: [
      { name: 'Financing Application Form.pdf', url: '/financing/app1.pdf', size: '1.5MB' },
      { name: 'Contract Copy.pdf', url: '/financing/contract2.pdf', size: '2.0MB' }
    ]
  },
  {
    id: '2',
    farmerId: '5',
    farmerName: 'Zhang San',
    contractId: '1',
    contractNo: 'HT202306001',
    landId: '102',
    landName: 'New City Farm West Area',
    applicationNo: 'RZ202307001',
    applicationAmount: 50000,
    approvedAmount: 50000,
    loanPeriod: 12,
    interestRate: 4.2,
    status: 'disbursed', // pending, approved, rejected, disbursed, repaid
    applicationDate: '2023-07-05',
    approvalDate: '2023-07-10',
    disbursementDate: '2023-07-15',
    repaymentDate: '2024-07-15',
    bankName: 'Construction Bank',
    contactPerson: 'Li Si',
    contactPhone: '13900139000',
    createdBy: 'admin',
    createTime: '2023-07-05T15:20:00Z',
    updateTime: '2023-07-15T11:45:00Z',
    remark: 'For expanding planting scale',
    documents: [
      { name: 'Financing Application Form.pdf', url: '/financing/app2.pdf', size: '1.8MB' },
      { name: 'Contract Copy.pdf', url: '/financing/contract1.pdf', size: '2.2MB' }
    ]
  },
  {
    id: '3',
    farmerId: '15',
    farmerName: 'Zhao Liu',
    contractId: null,
    contractNo: null,
    landId: '110',
    landName: 'Xayar Oasis Farm',
    applicationNo: 'RZ202306002',
    applicationAmount: 40000,
    approvedAmount: 0,
    loanPeriod: 12,
    interestRate: 0,
    status: 'rejected', // pending, approved, rejected, disbursed, repaid
    applicationDate: '2023-06-10',
    approvalDate: '2023-06-15',
    disbursementDate: null,
    repaymentDate: null,
    bankName: 'Bank of China',
    contactPerson: 'Wang Wu',
    contactPhone: '13700137000',
    createdBy: 'admin',
    createTime: '2023-06-10T09:30:00Z',
    updateTime: '2023-06-15T16:20:00Z',
    remark: 'Contract has been terminated, does not meet financing conditions',
    rejectReason: 'Contract status is abnormal, cannot provide financing',
    documents: [
      { name: 'Financing Application Form.pdf', url: '/financing/app3.pdf', size: '1.6MB' }
    ]
  },
  {
    id: '4',
    farmerId: '20',
    farmerName: 'Wang Wu',
    contractId: '3',
    contractNo: 'HT202206001',
    landId: '108',
    landName: 'Aksu Hongguang Farm',
    applicationNo: 'RZ202207001',
    applicationAmount: 35000,
    approvedAmount: 35000,
    loanPeriod: 12,
    interestRate: 4.8,
    status: 'repaid', // pending, approved, rejected, disbursed, repaid
    applicationDate: '2022-07-05',
    approvalDate: '2022-07-10',
    disbursementDate: '2022-07-15',
    repaymentDate: '2023-07-15',
    bankName: 'Agricultural Bank',
    contactPerson: 'Zhang San',
    contactPhone: '13800138000',
    createdBy: 'admin',
    createTime: '2022-07-05T14:15:00Z',
    updateTime: '2023-07-15T10:00:00Z',
    remark: 'For agricultural production input',
    documents: [
      { name: 'Financing Application Form.pdf', url: '/financing/app4.pdf', size: '1.7MB' },
      { name: 'Contract Copy.pdf', url: '/financing/contract3.pdf', size: '2.1MB' }
    ]
  }
];

// Mock fund flow monitoring data
const mockFundFlows = [
  {
    id: '1',
    transactionId: 'TX202306300001',
    relatedId: '1',
    relatedType: 'financing',
    farmerId: '3',
    farmerName: 'Li Si',
    amount: 25000,
    type: 'inflow', // inflow, outflow
    direction: 'disbursement', // disbursement, repayment, interest, fee
    transactionTime: '2023-06-30T10:30:00Z',
    description: 'Financing disbursement',
    source: 'Agricultural Bank',
    destination: 'Farmer Account'
  },
  {
    id: '2',
    transactionId: 'TX202307150001',
    relatedId: '2',
    relatedType: 'financing',
    farmerId: '5',
    farmerName: 'Zhang San',
    amount: 50000,
    type: 'inflow',
    direction: 'disbursement',
    transactionTime: '2023-07-15T11:45:00Z',
    description: 'Financing disbursement',
    source: 'Construction Bank',
    destination: 'Farmer Account'
  },
  {
    id: '3',
    transactionId: 'TX202307150002',
    relatedId: '4',
    relatedType: 'financing',
    farmerId: '20',
    farmerName: 'Wang Wu',
    amount: 35000,
    type: 'outflow',
    direction: 'repayment',
    transactionTime: '2023-07-15T10:00:00Z',
    description: 'Financing repayment',
    source: 'Farmer Account',
    destination: 'Agricultural Bank'
  },
  {
    id: '4',
    transactionId: 'TX202307150003',
    relatedId: '4',
    relatedType: 'financing',
    farmerId: '20',
    farmerName: 'Wang Wu',
    amount: 1680,
    type: 'outflow',
    direction: 'interest',
    transactionTime: '2023-07-15T10:00:00Z',
    description: 'Financing interest',
    source: 'Farmer Account',
    destination: 'Agricultural Bank'
  }
];

// Mock land rights information data
const mockLandRights = [
  {
    id: '1',
    landId: '102',
    landName: 'New City Farm West Area',
    rightType: 'Contract Right',
    rightStatus: 'valid', // valid, expired, pending
    certificateNo: 'QT202306001',
    issueDate: '2023-06-15',
    expireDate: '2033-06-14',
    farmerId: '5',
    farmerName: 'Zhang San',
    area: 80.0,
    unit: 'mu',
    location: 'Kuche New City Farm',
    createdBy: 'admin',
    createTime: '2023-06-15T09:00:00Z',
    updateTime: '2023-06-15T09:00:00Z',
    remark: 'Land rights certificate has been issued',
    attachments: [
      { name: 'Land Rights Certificate.pdf', url: '/landrights/cert1.pdf', size: '2.5MB' },
      { name: 'Land Survey Report.pdf', url: '/landrights/survey1.pdf', size: '3.2MB' }
    ]
  },
  {
    id: '2',
    landId: '105',
    landName: 'Aksu Tuanjie Township Farmland',
    rightType: 'Contract Right',
    rightStatus: 'pending', // valid, expired, pending
    certificateNo: null,
    issueDate: null,
    expireDate: null,
    farmerId: '3',
    farmerName: 'Li Si',
    area: 30.0,
    unit: 'mu',
    location: 'Aksu Tuanjie Township',
    createdBy: 'admin',
    createTime: '2023-06-20T14:30:00Z',
    updateTime: '2023-06-20T14:30:00Z',
    remark: 'Land rights application under review',
    attachments: [
      { name: 'Land Rights Application Form.pdf', url: '/landrights/app1.pdf', size: '1.8MB' }
    ]
  },
  {
    id: '3',
    landId: '108',
    landName: 'Aksu Hongguang Farm',
    rightType: 'Contract Right',
    rightStatus: 'expired', // valid, expired, pending
    certificateNo: 'QT202206001',
    issueDate: '2022-06-20',
    expireDate: '2023-06-19',
    farmerId: '20',
    farmerName: 'Wang Wu',
    area: 50.0,
    unit: 'mu',
    location: 'Aksu Hongguang Farm',
    createdBy: 'admin',
    createTime: '2022-06-20T10:15:00Z',
    updateTime: '2023-06-20T16:45:00Z',
    remark: 'Land rights certificate has expired',
    attachments: [
      { name: 'Land Rights Certificate.pdf', url: '/landrights/cert2.pdf', size: '2.3MB' }
    ]
  }
];

// Financing information related APIs

export const getFinancingInfo = async (filters = {}) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockFinancingInfo];
    
    // Apply filter conditions
    if (filters.applicationNo) {
      result = result.filter(financing => financing.applicationNo.includes(filters.applicationNo));
    }
    if (filters.farmerName) {
      result = result.filter(financing => financing.farmerName.includes(filters.farmerName));
    }
    if (filters.status) {
      result = result.filter(financing => financing.status === filters.status);
    }
    if (filters.bankName) {
      result = result.filter(financing => financing.bankName.includes(filters.bankName));
    }
    if (filters.startDate && filters.endDate) {
      result = result.filter(financing => {
        const applicationDate = new Date(financing.applicationDate);
        return applicationDate >= new Date(filters.startDate) && applicationDate <= new Date(filters.endDate);
      });
    }
    
    // Sort by application date in descending order
    result.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get financing information list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get financing information list',
      data: mockFinancingInfo
    });
  }
};

export const getFinancingById = async (financingId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const financing = mockFinancingInfo.find(item => item.id === financingId);
    if (!financing) {
      return Promise.resolve({
        code: 404,
        message: `Financing information does not exist: ${financingId}`,
        data: null
      });
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: financing
    });
  } catch (error) {
    console.error('Failed to get financing information details:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get financing information details',
      data: null
    });
  }
};

export const createFinancingApplication = async (financingData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate application number
    const applicationNo = `RZ${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const newFinancing = {
      ...financingData,
      id: `new-${Date.now()}`,
      applicationNo: applicationNo,
      status: 'pending',
      approvedAmount: 0,
      approvalDate: null,
      disbursementDate: null,
      repaymentDate: null,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      documents: financingData.documents || []
    };
    
    mockFinancingInfo.push(newFinancing);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newFinancing
    });
  } catch (error) {
    console.error('Failed to create financing application:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create financing application',
      data: null
    });
  }
};

export const approveFinancing = async (financingId, approvedAmount) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockFinancingInfo.findIndex(item => item.id === financingId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Financing information does not exist: ${financingId}`,
        data: null
      });
    }
    
    const financing = mockFinancingInfo[index];
    if (financing.status !== 'pending') {
      return Promise.resolve({
        code: 400,
        message: 'Only financing applications in pending status can be approved',
        data: null
      });
    }
    
    financing.status = 'approved';
    financing.approvedAmount = approvedAmount;
    financing.approvalDate = new Date().toISOString().split('T')[0];
    financing.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: financing
    });
  } catch (error) {
    console.error('Failed to approve financing application:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to approve financing application',
      data: null
    });
  }
};

export const rejectFinancing = async (financingId, reason) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockFinancingInfo.findIndex(item => item.id === financingId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Financing information does not exist: ${financingId}`,
        data: null
      });
    }
    
    const financing = mockFinancingInfo[index];
    if (financing.status !== 'pending') {
      return Promise.resolve({
        code: 400,
        message: 'Only financing applications in pending status can be rejected',
        data: null
      });
    }
    
    financing.status = 'rejected';
    financing.approvedAmount = 0;
    financing.rejectReason = reason;
    financing.approvalDate = new Date().toISOString().split('T')[0];
    financing.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: financing
    });
  } catch (error) {
    console.error('Failed to reject financing application:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to reject financing application',
      data: null
    });
  }
};

export const markFinancingAsDisbursed = async (financingId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockFinancingInfo.findIndex(item => item.id === financingId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Financing information does not exist: ${financingId}`,
        data: null
      });
    }
    
    const financing = mockFinancingInfo[index];
    if (financing.status !== 'approved') {
      return Promise.resolve({
        code: 400,
        message: 'Only approved financing applications can be marked as disbursed',
        data: null
      });
    }
    
    financing.status = 'disbursed';
    financing.disbursementDate = new Date().toISOString().split('T')[0];
    
    // Calculate repayment date
    const disbursementDate = new Date(financing.disbursementDate);
    disbursementDate.setMonth(disbursementDate.getMonth() + financing.loanPeriod);
    financing.repaymentDate = disbursementDate.toISOString().split('T')[0];
    
    financing.updateTime = new Date().toISOString();
    
    // Record fund flow
    const fundFlow = {
      id: `fund-new-${Date.now()}`,
      transactionId: `TX${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      relatedId: financingId,
      relatedType: 'financing',
      farmerId: financing.farmerId,
      farmerName: financing.farmerName,
      amount: financing.approvedAmount,
      type: 'inflow',
      direction: 'disbursement',
      transactionTime: new Date().toISOString(),
      description: 'Financing disbursement',
      source: financing.bankName,
      destination: 'Farmer Account'
    };
    mockFundFlows.push(fundFlow);
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: financing
    });
  } catch (error) {
    console.error('Failed to mark financing as disbursed:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to mark financing as disbursed',
      data: null
    });
  }
};

export const markFinancingAsRepaid = async (financingId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockFinancingInfo.findIndex(item => item.id === financingId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Financing information does not exist: ${financingId}`,
        data: null
      });
    }
    
    const financing = mockFinancingInfo[index];
    if (financing.status !== 'disbursed') {
      return Promise.resolve({
        code: 400,
        message: 'Only disbursed financing can be marked as repaid',
        data: null
      });
    }
    
    financing.status = 'repaid';
    financing.updateTime = new Date().toISOString();
    
    // Calculate interest
    const interest = financing.approvedAmount * (financing.interestRate / 100) * (financing.loanPeriod / 12);
    
    // Record principal repayment fund flow
    const principalFlow = {
      id: `fund-new-${Date.now()}`,
      transactionId: `TX${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      relatedId: financingId,
      relatedType: 'financing',
      farmerId: financing.farmerId,
      farmerName: financing.farmerName,
      amount: financing.approvedAmount,
      type: 'outflow',
      direction: 'repayment',
      transactionTime: new Date().toISOString(),
      description: 'Financing repayment',
      source: 'Farmer Account',
      destination: financing.bankName
    };
    mockFundFlows.push(principalFlow);
    
    // Record interest repayment fund flow
    const interestFlow = {
      id: `fund-new-${Date.now() + 1}`,
      transactionId: `TX${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
      relatedId: financingId,
      relatedType: 'financing',
      farmerId: financing.farmerId,
      farmerName: financing.farmerName,
      amount: interest,
      type: 'outflow',
      direction: 'interest',
      transactionTime: new Date().toISOString(),
      description: 'Financing interest',
      source: 'Farmer Account',
      destination: financing.bankName
    };
    mockFundFlows.push(interestFlow);
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: financing
    });
  } catch (error) {
    console.error('Failed to mark financing as repaid:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to mark financing as repaid',
      data: null
    });
  }
};

// Fund flow monitoring related APIs

export const getFundFlows = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockFundFlows];
    
    // Apply filter conditions
    if (filters.farmerName) {
      result = result.filter(flow => flow.farmerName.includes(filters.farmerName));
    }
    if (filters.type) {
      result = result.filter(flow => flow.type === filters.type);
    }
    if (filters.direction) {
      result = result.filter(flow => flow.direction === filters.direction);
    }
    if (filters.startDate && filters.endDate) {
      result = result.filter(flow => {
        const transactionDate = new Date(flow.transactionTime);
        return transactionDate >= new Date(filters.startDate) && transactionDate <= new Date(filters.endDate);
      });
    }
    
    // Sort by transaction time in descending order
    result.sort((a, b) => new Date(b.transactionTime) - new Date(a.transactionTime));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get fund flows:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get fund flows',
      data: mockFundFlows
    });
  }
};

export const getFundFlowById = async (flowId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const flow = mockFundFlows.find(item => item.id === flowId);
    if (!flow) {
      return Promise.resolve({
        code: 404,
        message: `Fund flow record does not exist: ${flowId}`,
        data: null
      });
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: flow
    });
  } catch (error) {
    console.error('Failed to get fund flow details:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get fund flow details',
      data: null
    });
  }
};

// Land rights related APIs

export const getLandRights = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockLandRights];
    
    // Apply filter conditions
    if (filters.certificateNo) {
      result = result.filter(right => right.certificateNo && right.certificateNo.includes(filters.certificateNo));
    }
    if (filters.farmerName) {
      result = result.filter(right => right.farmerName.includes(filters.farmerName));
    }
    if (filters.rightStatus) {
      result = result.filter(right => right.rightStatus === filters.rightStatus);
    }
    if (filters.landName) {
      result = result.filter(right => right.landName.includes(filters.landName));
    }
    
    // Sort by creation time in descending order
    result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get land rights information list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get land rights information list',
      data: mockLandRights
    });
  }
};

export const getLandRightById = async (rightId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const right = mockLandRights.find(item => item.id === rightId);
    if (!right) {
      return Promise.resolve({
        code: 404,
        message: `Land rights information does not exist: ${rightId}`,
        data: null
      });
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: right
    });
  } catch (error) {
    console.error('Failed to get land rights information details:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get land rights information details',
      data: null
    });
  }
};

export const createLandRight = async (rightData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRight = {
      ...rightData,
      id: `new-${Date.now()}`,
      rightStatus: rightData.rightStatus || 'pending',
      certificateNo: rightData.rightStatus === 'valid' ? `QT${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}` : null,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      attachments: rightData.attachments || []
    };
    
    mockLandRights.push(newRight);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newRight
    });
  } catch (error) {
    console.error('Failed to create land rights information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create land rights information',
      data: null
    });
  }
};

export const updateLandRightStatus = async (rightId, status, certificateNo = null, issueDate = null, expireDate = null) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockLandRights.findIndex(item => item.id === rightId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Land rights information does not exist: ${rightId}`,
        data: null
      });
    }
    
    const right = mockLandRights[index];
    right.rightStatus = status;
    
    if (status === 'valid') {
      right.certificateNo = certificateNo || right.certificateNo || `QT${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      right.issueDate = issueDate || right.issueDate || new Date().toISOString().split('T')[0];
      
      if (expireDate) {
        right.expireDate = expireDate;
      } else if (!right.expireDate) {
        // If no expiration date is specified, default to 10 years after issue date
        const issueDt = new Date(right.issueDate);
        issueDt.setFullYear(issueDt.getFullYear() + 10);
        right.expireDate = issueDt.toISOString().split('T')[0];
      }
    } else if (status === 'pending') {
      right.certificateNo = null;
      right.issueDate = null;
      right.expireDate = null;
    }
    
    right.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: right
    });
  } catch (error) {
    console.error('Failed to update land rights status:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update land rights status',
      data: null
    });
  }
};