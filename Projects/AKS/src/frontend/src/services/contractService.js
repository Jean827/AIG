// Contract management service, used to interact with backend API

// Mock contract data
const mockContracts = [
  {
    id: '1',
    contractNo: 'HT202306001',
    auctionId: '2',
    auctionName: 'Kuche New City Farm Auction',
    farmerId: '5',
    farmerName: 'Zhang San',
    landId: '102',
    landName: 'New City Farm West Area',
    landType: 'Type B Land',
    area: 80.0,
    unit: 'mu',
    annualRent: 1350,
    totalAmount: 108000, // 1350 * 80
    paymentTerm: 'Annual Payment',
    startDate: '2023-07-01',
    endDate: '2024-06-30',
    status: 'active', // draft, pending, active, expired, terminated
    createdBy: 'admin',
    createTime: '2023-06-11T10:00:00Z',
    updateTime: '2023-06-15T14:30:00Z',
    remark: 'First year rent paid',
    attachments: [
      { name: 'Contract Scan.pdf', url: '/attachments/contract1.pdf', size: '2.5MB' },
      { name: 'ID Card Copy.jpg', url: '/attachments/id5.jpg', size: '1.2MB' }
    ]
  },
  {
    id: '2',
    contractNo: 'HT202306002',
    auctionId: null,
    auctionName: null,
    farmerId: '3',
    farmerName: 'Li Si',
    landId: '105',
    landName: 'Aksu Tuanjie Township Farmland',
    landType: 'Type A Land',
    area: 30.0,
    unit: 'mu',
    annualRent: 1500,
    totalAmount: 45000, // 1500 * 30
    paymentTerm: 'Annual Payment',
    startDate: '2023-07-01',
    endDate: '2024-06-30',
    status: 'pending', // draft, pending, active, expired, terminated
    createdBy: 'admin',
    createTime: '2023-06-12T15:20:00Z',
    updateTime: '2023-06-12T15:20:00Z',
    remark: 'Pending farmer confirmation',
    attachments: [
      { name: 'Contract Draft.pdf', url: '/attachments/contract2_draft.pdf', size: '1.8MB' }
    ]
  },
  {
    id: '3',
    contractNo: 'HT202206001',
    auctionId: '10',
    auctionName: 'Aksu 2022 Second Batch Land Auction',
    farmerId: '20',
    farmerName: 'Wang Wu',
    landId: '108',
    landName: 'Aksu Hongguang Farm',
    landType: 'Type B Land',
    area: 50.0,
    unit: 'mu',
    annualRent: 1200,
    totalAmount: 60000, // 1200 * 50
    paymentTerm: 'Annual Payment',
    startDate: '2022-07-01',
    endDate: '2023-06-30',
    status: 'expired', // draft, pending, active, expired, terminated
    createdBy: 'admin',
    createTime: '2022-06-15T09:30:00Z',
    updateTime: '2023-06-30T18:00:00Z',
    remark: 'Contract expired',
    attachments: [
      { name: 'Contract Scan.pdf', url: '/attachments/contract3.pdf', size: '2.1MB' }
    ]
  },
  {
    id: '4',
    contractNo: 'HT202305001',
    auctionId: '8',
    auctionName: 'Xayar 2023 First Batch Land Auction',
    farmerId: '15',
    farmerName: 'Zhao Liu',
    landId: '110',
    landName: 'Xayar Oasis Farm',
    landType: 'Type C Land',
    area: 100.0,
    unit: 'mu',
    annualRent: 900,
    totalAmount: 90000, // 900 * 100
    paymentTerm: 'Annual Payment',
    startDate: '2023-05-01',
    endDate: '2024-04-30',
    status: 'terminated', // draft, pending, active, expired, terminated
    createdBy: 'admin',
    createTime: '2023-04-10T14:15:00Z',
    updateTime: '2023-05-15T11:45:00Z',
    remark: 'Contract terminated early due to farmer reasons',
    attachments: [
      { name: 'Contract Scan.pdf', url: '/attachments/contract4.pdf', size: '2.3MB' },
      { name: 'Termination Agreement.pdf', url: '/attachments/termination4.pdf', size: '1.5MB' }
    ]
  }
];

// Contract related APIs

export const getContracts = async (filters = {}) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    let result = [...mockContracts];
    
    // Apply filter conditions
    if (filters.contractNo) {
      result = result.filter(contract => contract.contractNo.includes(filters.contractNo));
    }
    if (filters.farmerName) {
      result = result.filter(contract => contract.farmerName.includes(filters.farmerName));
    }
    if (filters.landName) {
      result = result.filter(contract => contract.landName.includes(filters.landName));
    }
    if (filters.status) {
      result = result.filter(contract => contract.status === filters.status);
    }
    if (filters.startDate && filters.endDate) {
      result = result.filter(contract => {
        const contractDate = new Date(contract.createTime);
        return contractDate >= new Date(filters.startDate) && contractDate <= new Date(filters.endDate);
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
    console.error('Failed to get contract list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get contract list',
      data: mockContracts
    });
  }
};

export const getContractById = async (contractId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const contract = mockContracts.find(item => item.id === contractId);
    if (!contract) {
      return Promise.resolve({
        code: 200,
        message: 'Contract not found',
        data: null
      });
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: contract
    });
  } catch (error) {
    console.error('Failed to get contract details:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get contract details',
      data: null
    });
  }
};

export const createContract = async (contractData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate contract number (more strict rules should be applied in actual projects)
    const contractNo = `HT${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Calculate total amount
    const totalAmount = contractData.annualRent * contractData.area;
    
    const newContract = {
      ...contractData,
      id: `new-${Date.now()}`,
      contractNo: contractNo,
      totalAmount: totalAmount,
      status: contractData.status || 'draft',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      attachments: contractData.attachments || []
    };
    
    mockContracts.push(newContract);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newContract
    });
  } catch (error) {
    console.error('Failed to create contract:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create contract',
      data: null
    });
  }
};

export const updateContract = async (contractId, contractData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockContracts.findIndex(item => item.id === contractId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Contract does not exist: ${contractId}`,
        data: null
      });
    }
    
    const currentContract = mockContracts[index];
    
    // If contract status is not draft, do not allow modification of key information
    if (currentContract.status !== 'draft' && 
        (contractData.annualRent !== undefined || 
         contractData.area !== undefined || 
         contractData.startDate !== undefined || 
         contractData.endDate !== undefined)) {
      return Promise.resolve({
        code: 400,
        message: 'Contract is already active, cannot modify key terms',
        data: null
      });
    }
    
    // Calculate total amount (if rent or area changes)
    let totalAmount = currentContract.totalAmount;
    if (contractData.annualRent !== undefined && contractData.area !== undefined) {
      totalAmount = contractData.annualRent * contractData.area;
    } else if (contractData.annualRent !== undefined) {
      totalAmount = contractData.annualRent * currentContract.area;
    } else if (contractData.area !== undefined) {
      totalAmount = currentContract.annualRent * contractData.area;
    }
    
    const updatedContract = {
      ...currentContract,
      ...contractData,
      totalAmount: totalAmount,
      updateTime: new Date().toISOString()
    };
    
    mockContracts[index] = updatedContract;
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: updatedContract
    });
  } catch (error) {
    console.error('Failed to update contract:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update contract',
      data: null
    });
  }
};

export const submitContract = async (contractId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockContracts.findIndex(item => item.id === contractId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Contract does not exist: ${contractId}`,
        data: null
      });
    }
    
    const contract = mockContracts[index];
    if (contract.status !== 'draft') {
      return Promise.resolve({
        code: 400,
        message: 'Only contracts in draft status can be submitted for review',
        data: null
      });
    }
    
    contract.status = 'pending';
    contract.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: contract
    });
  } catch (error) {
    console.error('Failed to submit contract for review:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to submit contract for review',
      data: null
    });
  }
};

export const approveContract = async (contractId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockContracts.findIndex(item => item.id === contractId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Contract does not exist: ${contractId}`,
        data: null
      });
    }
    
    const contract = mockContracts[index];
    if (contract.status !== 'pending') {
      return Promise.resolve({
        code: 400,
        message: 'Only contracts in pending status can be approved',
        data: null
      });
    }
    
    contract.status = 'active';
    contract.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: contract
    });
  } catch (error) {
    console.error('Failed to approve contract:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to approve contract',
      data: null
    });
  }
};

export const rejectContract = async (contractId, reason) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockContracts.findIndex(item => item.id === contractId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Contract does not exist: ${contractId}`,
        data: null
      });
    }
    
    const contract = mockContracts[index];
    if (contract.status !== 'pending') {
      return Promise.resolve({
        code: 400,
        message: 'Only contracts in pending status can be rejected',
        data: null
      });
    }
    
    contract.status = 'draft';
    contract.rejectReason = reason;
    contract.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: contract
    });
  } catch (error) {
    console.error('Failed to reject contract review:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to reject contract review',
      data: null
    });
  }
};

export const terminateContract = async (contractId, reason) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockContracts.findIndex(item => item.id === contractId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Contract does not exist: ${contractId}`,
        data: null
      });
    }
    
    const contract = mockContracts[index];
    if (contract.status !== 'active') {
      return Promise.resolve({
        code: 400,
        message: 'Only active contracts can be terminated',
        data: null
      });
    }
    
    const now = new Date();
    const contractEndDate = new Date(contract.endDate);
    
    // Check if contract has already expired
    if (now > contractEndDate) {
      return Promise.resolve({
        code: 400,
        message: 'Contract has already expired, termination not needed',
        data: null
      });
    }
    
    contract.status = 'terminated';
    contract.terminationReason = reason;
    contract.terminationTime = now.toISOString();
    contract.updateTime = now.toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: contract
    });
  } catch (error) {
    console.error('Failed to terminate contract:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to terminate contract',
      data: null
    });
  }
};

// Contract attachment related APIs

export const addContractAttachment = async (contractId, attachmentData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockContracts.findIndex(item => item.id === contractId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Contract does not exist: ${contractId}`,
        data: null
      });
    }
    
    const contract = mockContracts[index];
    
    // Check if attachment already exists
    const existingAttachment = contract.attachments.find(att => att.name === attachmentData.name);
    if (existingAttachment) {
      return Promise.resolve({
        code: 400,
        message: 'Attachment with the same name already exists',
        data: null
      });
    }
    
    contract.attachments.push({
      ...attachmentData,
      id: `att-${Date.now()}`
    });
    
    contract.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Attachment added successfully',
      data: {
        success: true,
        message: 'Attachment added successfully',
        attachment: contract.attachments[contract.attachments.length - 1]
      }
    });
  } catch (error) {
    console.error('Failed to add contract attachment:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to add contract attachment',
      data: null
    });
  }
};

export const deleteContractAttachment = async (contractId, attachmentId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockContracts.findIndex(item => item.id === contractId);
    if (index === -1) {
      return Promise.resolve({
        code: 404,
        message: `Contract does not exist: ${contractId}`,
        data: null
      });
    }
    
    const contract = mockContracts[index];
    const attachmentIndex = contract.attachments.findIndex(att => att.id === attachmentId);
    
    if (attachmentIndex === -1) {
      return Promise.resolve({
        code: 404,
        message: `Attachment does not exist: ${attachmentId}`,
        data: null
      });
    }
    
    contract.attachments.splice(attachmentIndex, 1);
    contract.updateTime = new Date().toISOString();
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: {
        success: true,
        message: 'Attachment deleted successfully'
      }
    });
  } catch (error) {
    console.error('Failed to delete contract attachment:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to delete contract attachment',
      data: null
    });
  }
};