// Payment management service for interacting with backend API

// Mock payment data
const mockPayments = [
  {
    id: '1',
    contractId: '1',
    contractNo: 'HT202306001',
    farmerId: '5',
    farmerName: 'Zhang San',
    landId: '102',
    landName: 'New City Farm West District',
    amount: 108000,
    year: '2023',
    paymentType: 'Rent',
    paymentStatus: 'paid', // unpaid, paid, partially_paid
    paymentMethod: 'Bank Transfer',
    transactionNo: 'TR202306150001',
    paymentDate: '2023-06-15',
    createdBy: 'admin',
    createTime: '2023-06-15T10:00:00Z',
    updateTime: '2023-06-15T14:30:00Z',
    remark: '2023 Annual Land Rent',
    receiptNo: 'FP202306150001'
  },
  {
    id: '2',
    contractId: '2',
    contractNo: 'HT202306002',
    farmerId: '3',
    farmerName: 'Li Si',
    landId: '105',
    landName: 'Aksu Tuanjie Township Farmland',
    amount: 45000,
    year: '2023',
    paymentType: 'Rent',
    paymentStatus: 'unpaid', // unpaid, paid, partially_paid
    paymentMethod: null,
    transactionNo: null,
    paymentDate: null,
    createdBy: 'admin',
    createTime: '2023-06-12T15:20:00Z',
    updateTime: '2023-06-12T15:20:00Z',
    remark: '2023 Annual Land Rent Pending',
    receiptNo: null
  },
  {
    id: '3',
    contractId: '3',
    contractNo: 'HT202206001',
    farmerId: '20',
    farmerName: 'Wang Wu',
    landId: '108',
    landName: 'Aksu Hongguang Farm',
    amount: 60000,
    year: '2022',
    paymentType: 'Rent',
    paymentStatus: 'paid', // unpaid, paid, partially_paid
    paymentMethod: 'Cash Payment',
    transactionNo: 'TR202206200001',
    paymentDate: '2022-06-20',
    createdBy: 'admin',
    createTime: '2022-06-15T09:30:00Z',
    updateTime: '2022-06-20T16:45:00Z',
    remark: '2022 Annual Land Rent',
    receiptNo: 'FP202206200001'
  },
  {
    id: '4',
    contractId: '4',
    contractNo: 'HT202305001',
    farmerId: '15',
    farmerName: 'Zhao Liu',
    landId: '110',
    landName: 'Shaya County Oasis Farm',
    amount: 30000,
    year: '2023',
    paymentType: 'Rent Refund',
    paymentStatus: 'paid', // unpaid, paid, partially_paid
    paymentMethod: 'Bank Transfer',
    transactionNo: 'TR202305150001',
    paymentDate: '2023-05-15',
    createdBy: 'admin',
    createTime: '2023-04-10T14:15:00Z',
    updateTime: '2023-05-15T11:45:00Z',
    remark: 'Contract terminated early, refund of remaining rent',
    receiptNo: 'FP202305150001'
  },
  {
    id: '5',
    contractId: null,
    contractNo: null,
    farmerId: '3',
    farmerName: 'Li Si',
    landId: null,
    landName: null,
    amount: 5000,
    year: '2023',
    paymentType: 'Deposit',
    paymentStatus: 'paid', // unpaid, paid, partially_paid
    paymentMethod: 'Bank Transfer',
    transactionNo: 'TR202305200001',
    paymentDate: '2023-05-20',
    createdBy: 'admin',
    createTime: '2023-05-20T10:00:00Z',
    updateTime: '2023-05-20T10:30:00Z',
    remark: 'Auction deposit',
    receiptNo: 'FP202305200001'
  }
];

// Mock farmer account information
const mockFarmerAccounts = [
  {
    id: '1',
    farmerId: '3',
    farmerName: 'Li Si',
    balance: 5000,
    status: 'active',
    lastUpdateTime: '2023-05-20T10:30:00Z'
  },
  {
    id: '2',
    farmerId: '5',
    farmerName: 'Zhang San',
    balance: 0,
    status: 'active',
    lastUpdateTime: '2023-06-15T14:30:00Z'
  },
  {
    id: '3',
    farmerId: '15',
    farmerName: 'Zhao Liu',
    balance: 30000,
    status: 'active',
    lastUpdateTime: '2023-05-15T11:45:00Z'
  },
  {
    id: '4',
    farmerId: '20',
    farmerName: 'Wang Wu',
    balance: 0,
    status: 'inactive',
    lastUpdateTime: '2022-06-20T16:45:00Z'
  }
];

// Mock transaction details
const mockTransactionDetails = [
  {
    id: '1',
    accountId: '1',
    farmerId: '3',
    farmerName: 'Li Si',
    amount: 5000,
    type: 'deposit', // deposit, withdraw, payment, refund
    relatedId: '5', // Related payment ID
    relatedType: 'payment',
    transactionTime: '2023-05-20T10:30:00Z',
    description: 'Auction deposit recharge'
  },
  {
    id: '2',
    accountId: '2',
    farmerId: '5',
    farmerName: 'Zhang San',
    amount: 108000,
    type: 'payment', // deposit, withdraw, payment, refund
    relatedId: '1', // Related payment ID
    relatedType: 'payment',
    transactionTime: '2023-06-15T14:30:00Z',
    description: 'Payment for 2023 annual land rent'
  },
  {
    id: '3',
    accountId: '3',
    farmerId: '15',
    farmerName: 'Zhao Liu',
    amount: 30000,
    type: 'refund', // deposit, withdraw, payment, refund
    relatedId: '4', // Related payment ID
    relatedType: 'payment',
    transactionTime: '2023-05-15T11:45:00Z',
    description: 'Contract terminated early, refund of remaining rent'
  }
];

// Payment related API
export const getPayments = async (filters = {}) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockPayments];
    
    // Apply filtering conditions
    if (filters.contractNo) {
      result = result.filter(payment => payment.contractNo && payment.contractNo.includes(filters.contractNo));
    }
    if (filters.farmerName) {
      result = result.filter(payment => payment.farmerName.includes(filters.farmerName));
    }
    if (filters.year) {
      result = result.filter(payment => payment.year === filters.year);
    }
    if (filters.paymentType) {
      result = result.filter(payment => payment.paymentType === filters.paymentType);
    }
    if (filters.paymentStatus) {
      result = result.filter(payment => payment.paymentStatus === filters.paymentStatus);
    }
    if (filters.startDate && filters.endDate) {
      result = result.filter(payment => {
        if (!payment.paymentDate) return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= new Date(filters.startDate) && paymentDate <= new Date(filters.endDate);
      });
    }
    
    // Sort by creation time in descending order
    result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get payment list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get payment list',
      data: mockPayments
    });
  }
};

export const getPaymentById = async (paymentId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const payment = mockPayments.find(item => item.id === paymentId);
    if (!payment) {
      throw new Error(`Payment does not exist: ${paymentId}`);
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: payment
    });
  } catch (error) {
    console.error('Failed to get payment details:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get payment details',
      data: null
    });
  }
};

export const createPayment = async (paymentData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert snake_case to camelCase
    const formattedData = {
      ...paymentData,
      contractId: paymentData.contractId || paymentData.contract_id,
      contractNo: paymentData.contractNo || paymentData.contract_no,
      farmerId: paymentData.farmerId || paymentData.farmer_id,
      farmerName: paymentData.farmerName || paymentData.farmer_name,
      landId: paymentData.landId || paymentData.land_id,
      landName: paymentData.landName || paymentData.land_name,
      paymentType: paymentData.paymentType || paymentData.payment_type,
      paymentStatus: paymentData.paymentStatus || paymentData.payment_status || 'unpaid',
      paymentMethod: paymentData.paymentMethod || paymentData.payment_method,
      transactionNo: paymentData.transactionNo || paymentData.transaction_no,
      paymentDate: paymentData.paymentDate || paymentData.payment_date,
      createdBy: paymentData.createdBy || paymentData.created_by,
    };
    
    const newPayment = {
      ...formattedData,
      id: `new-${Date.now()}`,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    mockPayments.push(newPayment);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newPayment
    });
  } catch (error) {
    console.error('Failed to create payment:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create payment',
      data: null
    });
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockPayments.findIndex(item => item.id === paymentId);
    if (index === -1) {
      throw new Error(`Payment does not exist: ${paymentId}`);
    }
    
    const currentPayment = mockPayments[index];
    
    // If payment is already paid, do not allow amount modification
    if (currentPayment.paymentStatus === 'paid' && paymentData.amount !== undefined) {
      throw new Error('Cannot modify amount for already paid payments');
    }
    
    // Convert snake_case to camelCase
    const formattedData = {
      ...paymentData,
      contractId: paymentData.contractId || paymentData.contract_id,
      contractNo: paymentData.contractNo || paymentData.contract_no,
      farmerId: paymentData.farmerId || paymentData.farmer_id,
      farmerName: paymentData.farmerName || paymentData.farmer_name,
      landId: paymentData.landId || paymentData.land_id,
      landName: paymentData.landName || paymentData.land_name,
      paymentType: paymentData.paymentType || paymentData.payment_type,
      paymentStatus: paymentData.paymentStatus || paymentData.payment_status,
      paymentMethod: paymentData.paymentMethod || paymentData.payment_method,
      transactionNo: paymentData.transactionNo || paymentData.transaction_no,
      paymentDate: paymentData.paymentDate || paymentData.payment_date,
    };
    
    const updatedPayment = {
      ...currentPayment,
      ...formattedData,
      updateTime: new Date().toISOString()
    };
    
    mockPayments[index] = updatedPayment;
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: updatedPayment
    });
  } catch (error) {
    console.error('Failed to update payment:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update payment',
      data: null
    });
  }
};

export const markPaymentAsPaid = async (paymentId, paymentDetails) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockPayments.findIndex(item => item.id === paymentId);
    if (index === -1) {
      throw new Error(`Payment does not exist: ${paymentId}`);
    }
    
    const payment = mockPayments[index];
    if (payment.paymentStatus === 'paid') {
      throw new Error('Payment has already been marked as paid');
    }
    
    // Generate receipt number
    const receiptNo = `FP${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Convert snake_case to camelCase
    const formattedDetails = {
      paymentMethod: paymentDetails.paymentMethod || paymentDetails.payment_method,
      transactionNo: paymentDetails.transactionNo || paymentDetails.transaction_no,
      paymentDate: paymentDetails.paymentDate || paymentDetails.payment_date || new Date().toISOString().split('T')[0]
    };
    
    payment.paymentStatus = 'paid';
    payment.paymentMethod = formattedDetails.paymentMethod || payment.paymentMethod;
    payment.transactionNo = formattedDetails.transactionNo || payment.transactionNo;
    payment.paymentDate = formattedDetails.paymentDate;
    payment.receiptNo = receiptNo;
    payment.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: payment
    });
  } catch (error) {
    console.error('Failed to mark payment as paid:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to mark payment as paid',
      data: null
    });
  }
};

// Farmer account related API
export const getFarmerAccount = async (farmerId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const account = mockFarmerAccounts.find(item => item.farmerId === farmerId);
    if (!account) {
      throw new Error(`Farmer account does not exist: ${farmerId}`);
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: account
    });
  } catch (error) {
    console.error('Failed to get farmer account:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get farmer account',
      data: null
    });
  }
};

export const rechargeAccount = async (farmerId, amount, paymentMethod) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let account = mockFarmerAccounts.find(item => item.farmerId === farmerId);
    
    // If account does not exist, create a new one
    if (!account) {
      const farmerName = mockPayments.find(p => p.farmerId === farmerId)?.farmerName || 'Unknown Farmer';
      account = {
        id: `acc-new-${Date.now()}`,
        farmerId: farmerId,
        farmerName: farmerName,
        balance: 0,
        status: 'active',
        lastUpdateTime: new Date().toISOString()
      };
      mockFarmerAccounts.push(account);
    }
    
    // Increase account balance
    account.balance += amount;
    account.lastUpdateTime = new Date().toISOString();
    
    // Create transaction detail
    const transactionDetail = {
      id: `trans-new-${Date.now()}`,
      accountId: account.id,
      farmerId: farmerId,
      farmerName: account.farmerName,
      amount: amount,
      type: 'deposit',
      relatedId: null,
      relatedType: null,
      transactionTime: new Date().toISOString(),
      description: `Recharge ${amount} yuan, payment method: ${paymentMethod}`
    };
    mockTransactionDetails.push(transactionDetail);
    
    return Promise.resolve({
      code: 200,
      message: `Recharge successful, current balance: ${account.balance} yuan`,
      data: {
        success: true,
        account: account,
        transaction: transactionDetail
      }
    });
  } catch (error) {
    console.error('Failed to recharge account:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to recharge account',
      data: null
    });
  }
};

// Transaction detail related API
export const getTransactionDetails = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockTransactionDetails];
    
    // Apply filtering conditions
    if (filters.farmerId) {
      result = result.filter(transaction => transaction.farmerId === filters.farmerId);
    }
    if (filters.type) {
      result = result.filter(transaction => transaction.type === filters.type);
    }
    if (filters.startDate && filters.endDate) {
      result = result.filter(transaction => {
        const transactionDate = new Date(transaction.transactionTime);
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
    console.error('Failed to get transaction details:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get transaction details',
      data: mockTransactionDetails
    });
  }
};

// Payment statistics related API
export const getPaymentStatistics = async (year = null, month = null) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredPayments = mockPayments;
    
    // Filter by year and month
    if (year) {
      filteredPayments = filteredPayments.filter(payment => payment.year === year);
    }
    if (month) {
      filteredPayments = filteredPayments.filter(payment => {
        if (!payment.paymentDate) return false;
        return new Date(payment.paymentDate).getMonth() + 1 === parseInt(month);
      });
    }
    
    // Statistical data
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidAmount = filteredPayments.filter(p => p.paymentStatus === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const unpaidAmount = filteredPayments.filter(p => p.paymentStatus === 'unpaid').reduce((sum, payment) => sum + payment.amount, 0);
    const paidCount = filteredPayments.filter(p => p.paymentStatus === 'paid').length;
    const unpaidCount = filteredPayments.filter(p => p.paymentStatus === 'unpaid').length;
    
    // Statistics by type
    const typeStats = {};
    filteredPayments.forEach(payment => {
      if (!typeStats[payment.paymentType]) {
        typeStats[payment.paymentType] = { amount: 0, count: 0 };
      }
      typeStats[payment.paymentType].amount += payment.amount;
      typeStats[payment.paymentType].count += 1;
    });
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: {
        totalAmount: totalAmount,
        paidAmount: paidAmount,
        unpaidAmount: unpaidAmount,
        paidCount: paidCount,
        unpaidCount: unpaidCount,
        typeStats: typeStats,
        year: year,
        month: month
      }
    });
  } catch (error) {
    console.error('Failed to get payment statistics:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get payment statistics',
      data: {
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        paidCount: 0,
        unpaidCount: 0,
        typeStats: {},
        year: year,
        month: month
      }
    });
  }
};