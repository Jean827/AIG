// Import mock data service
import mockDataService from './mockDataService';

/**
 * Get bidding information list
 */
export const getBiddingInfos = async () => {
  try {
    const biddingInfos = await mockDataService.getBiddingInfos();
    // Transform data format to match previous structure
    const transformedData = biddingInfos.map(info => ({
      id: info.id.replace('bidding_', ''),
      code: `BID-${new Date(info.createTime).getFullYear()}-${info.id.split('_')[1].padStart(3, '0')}`,
      name: info.title,
      landId: info.landId.replace('land_', ''),
      landCode: `LAND-${info.landId.split('_')[1].padStart(3, '0')}`,
      landName: mockDataService.getLands().find(land => land.id === info.landId)?.name || '',
      startPrice: info.startingPrice,
      currentPrice: mockDataService.getCurrentBiddingPrice(info.id) || info.startingPrice,
      increment: info.increment,
      startTime: info.startTime.toISOString().slice(0, 19),
      endTime: info.endTime.toISOString().slice(0, 19),
      status: {
        'pending': 1,
        'ongoing': 2,
        'completed': 3,
        'cancelled': 4
      }[info.status],
      auctioneerId: '1', // Default auctioneer
      auctioneerName: 'Auctioneer1', // Default auctioneer name
      description: info.description,
      createdAt: info.createTime.toISOString().slice(0, 19),
      updatedAt: info.updateTime.toISOString().slice(0, 19)
    }));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: transformedData
    });
  } catch (error) {
    console.error('Failed to get bidding information list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidding information list',
      data: []
    });
  }
};

/**
 * Get bidding status list
 */
export const getBiddingStatuses = async () => {
  try {
    // Return predefined statuses as before
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: [
        { id: '1', name: 'Not Started', color: '#d9d9d9' },
        { id: '2', name: 'Ongoing', color: '#1890ff' },
        { id: '3', name: 'Completed', color: '#52c41a' },
        { id: '4', name: 'Cancelled', color: '#ff4d4f' }
      ]
    });
  } catch (error) {
    console.error('Failed to get bidding status list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidding status list',
      data: []
    });
  }
};

/**
 * Get land information list
 */
export const getLands = async () => {
  try {
    const lands = await mockDataService.getLands();
    // Transform data format to match previous structure
    const transformedData = lands.map(land => ({
      id: land.id.replace('land_', ''),
      code: `LAND-${land.id.split('_')[1].padStart(3, '0')}`,
      name: land.name
    }));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: transformedData
    });
  } catch (error) {
    console.error('Failed to get land information list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get land information list',
      data: []
    });
  }
};

/**
 * Get auctioneer information list
 */
export const getAuctioneers = async () => {
  try {
    const auctioneers = await mockDataService.getAuctioneers();
    // Transform data format to match previous structure
    const transformedData = auctioneers.map((auctioneer, index) => ({
      id: String(index + 1),
      name: auctioneer.name
    }));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: transformedData
    });
  } catch (error) {
    console.error('Failed to get auctioneer information list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get auctioneer information list',
      data: []
    });
  }
};

/**
 * Get single bidding information
 * @param {string} id - Bidding information ID
 */
export const getBiddingInfo = async (id) => {
  try {
    const biddingInfo = await mockDataService.getBiddingInfoById(`bidding_${id}`);
    if (!biddingInfo) {
      return Promise.resolve({
        code: 200,
        message: 'Success',
        data: {}
      });
    }
    
    // Transform data format to match previous structure
    const transformedData = {
      id: id,
      code: `BID-${new Date(biddingInfo.createTime).getFullYear()}-${id.padStart(3, '0')}`,
      name: biddingInfo.title,
      landId: biddingInfo.landId.replace('land_', ''),
      landCode: `LAND-${biddingInfo.landId.split('_')[1].padStart(3, '0')}`,
      landName: mockDataService.getLands().find(land => land.id === biddingInfo.landId)?.name || '',
      startPrice: biddingInfo.startingPrice,
      currentPrice: mockDataService.getCurrentBiddingPrice(biddingInfo.id) || biddingInfo.startingPrice,
      increment: biddingInfo.increment,
      startTime: biddingInfo.startTime.toISOString().slice(0, 19),
      endTime: biddingInfo.endTime.toISOString().slice(0, 19),
      status: {
        'pending': 1,
        'ongoing': 2,
        'completed': 3,
        'cancelled': 4
      }[biddingInfo.status],
      auctioneerId: '1', // Default auctioneer
      auctioneerName: 'Auctioneer1', // Default auctioneer name
      description: biddingInfo.description,
      createdAt: biddingInfo.createTime.toISOString().slice(0, 19),
      updatedAt: biddingInfo.updateTime.toISOString().slice(0, 19)
    };
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: transformedData
    });
  } catch (error) {
    console.error('Failed to get bidding information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidding information',
      data: {}
    });
  }
};

/**
 * Create bidding information
 * @param {object} data - Bidding information data
 */
export const createBiddingInfo = async (data) => {
  try {
    // Transform data format to match mockDataService requirements
    const transformedData = {
      landId: `land_${data.landId}`,
      title: data.name,
      description: data.description,
      startingPrice: data.startPrice,
      increment: data.increment,
      depositAmount: data.startPrice * 0.2, // 20% of start price as deposit
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString()
    };
    
    const createdInfo = await mockDataService.createBiddingInfo(transformedData);
    
    // Transform back to match previous structure
    const resultData = {
      id: createdInfo.id.replace('bidding_', ''),
      code: `BID-${new Date(createdInfo.createTime).getFullYear()}-${createdInfo.id.split('_')[1].padStart(3, '0')}`,
      name: createdInfo.title,
      landId: createdInfo.landId.replace('land_', ''),
      landCode: `LAND-${createdInfo.landId.split('_')[1].padStart(3, '0')}`,
      landName: mockDataService.getLands().find(land => land.id === createdInfo.landId)?.name || '',
      startPrice: createdInfo.startingPrice,
      currentPrice: createdInfo.startingPrice,
      increment: createdInfo.increment,
      startTime: createdInfo.startTime.toISOString().slice(0, 19),
      endTime: createdInfo.endTime.toISOString().slice(0, 19),
      status: 1, // Not Started
      auctioneerId: '1', // Default auctioneer
      auctioneerName: 'Auctioneer1', // Default auctioneer name
      description: createdInfo.description,
      createdAt: createdInfo.createTime.toISOString().slice(0, 19),
      updatedAt: createdInfo.updateTime.toISOString().slice(0, 19)
    };
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: resultData
    });
  } catch (error) {
    console.error('Failed to create bidding information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create bidding information',
      data: null
    });
  }
};

/**
 * Update bidding information
 * @param {string} id - Bidding information ID
 * @param {object} data - Bidding information data
 */
export const updateBiddingInfo = async (id, data) => {
  try {
    // Transform data format to match mockDataService requirements
    const transformedData = {
      title: data.name,
      description: data.description,
      startingPrice: data.startPrice,
      increment: data.increment,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      status: {
        1: 'pending',
        2: 'ongoing',
        3: 'completed',
        4: 'cancelled'
      }[data.status]
    };
    
    const updatedInfo = await mockDataService.updateBiddingInfo(`bidding_${id}`, transformedData);
    if (!updatedInfo) {
      return Promise.resolve({
        code: 200,
        message: 'Success',
        data: data
      });
    }
    
    // Transform back to match previous structure
    const resultData = {
      id: id,
      code: `BID-${new Date(updatedInfo.createTime).getFullYear()}-${id.padStart(3, '0')}`,
      name: updatedInfo.title,
      landId: updatedInfo.landId.replace('land_', ''),
      landCode: `LAND-${updatedInfo.landId.split('_')[1].padStart(3, '0')}`,
      landName: mockDataService.getLands().find(land => land.id === updatedInfo.landId)?.name || '',
      startPrice: updatedInfo.startingPrice,
      currentPrice: mockDataService.getCurrentBiddingPrice(updatedInfo.id) || updatedInfo.startingPrice,
      increment: updatedInfo.increment,
      startTime: updatedInfo.startTime.toISOString().slice(0, 19),
      endTime: updatedInfo.endTime.toISOString().slice(0, 19),
      status: {
        'pending': 1,
        'ongoing': 2,
        'completed': 3,
        'cancelled': 4
      }[updatedInfo.status],
      auctioneerId: '1', // Default auctioneer
      auctioneerName: 'Auctioneer1', // Default auctioneer name
      description: updatedInfo.description,
      createdAt: updatedInfo.createTime.toISOString().slice(0, 19),
      updatedAt: updatedInfo.updateTime.toISOString().slice(0, 19)
    };
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: resultData
    });
  } catch (error) {
    console.error('Failed to update bidding information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update bidding information',
      data: null
    });
  }
};

/**
 * Delete bidding information
 * @param {string} id - Bidding information ID
 */
export const deleteBiddingInfo = async (id) => {
  try {
    const result = await mockDataService.deleteBiddingInfo(`bidding_${id}`);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: { success: result }
    });
  } catch (error) {
    console.error('Failed to delete bidding information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to delete bidding information',
      data: null
    });
  }
};

/**
 * Get bidding records list
 */
export const getBiddingRecords = async () => {
  try {
    const bidRecords = await mockDataService.getBidRecords();
    const biddingInfos = await mockDataService.getBiddingInfos();
    const bidderRegistrations = await mockDataService.getApprovedRegistrations();
    
    // Transform data format to match previous structure
    const transformedData = bidRecords.map((record, index) => {
      const biddingInfo = biddingInfos.find(info => info.id === record.biddingId);
      const bidder = bidderRegistrations.find(reg => reg.userId === record.userId) || 
                     { realName: `Bidder${index + 1}` };
      
      return {
        id: String(index + 1),
        code: `BIDREC-${new Date(record.bidTime).getFullYear()}-${(index + 1).toString().padStart(4, '0')}`,
        biddingId: record.biddingId.replace('bidding_', ''),
        biddingCode: biddingInfo ? 
          `BID-${new Date(biddingInfo.createTime).getFullYear()}-${biddingInfo.id.split('_')[1].padStart(3, '0')}` : 
          'Unknown Bidding',
        biddingName: biddingInfo ? biddingInfo.title : 'Unknown Bidding',
        bidderId: record.userId.replace('user_', ''),
        bidderName: bidder.realName,
        bidPrice: record.bidPrice,
        bidTime: record.bidTime.toISOString().slice(0, 19),
        status: {
          'pending': 1,
          'valid': 1,
          'confirmed': 2,
          'winning': 2,
          'cancelled': 3,
          'invalid': 4
        }[record.status],
        isWinningBid: record.status === 'winning',
        remark: record.status === 'winning' ? 'Final Transaction Price' : 'Bid Price',
        createdAt: record.bidTime.toISOString().slice(0, 19),
        updatedAt: record.bidTime.toISOString().slice(0, 19)
      };
    });
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: transformedData
    });
  } catch (error) {
    console.error('Failed to get bidding records list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidding records list',
      data: []
    });
  }
};

/**
 * Get bidders information list
 */
export const getBidders = async () => {
  try {
    const bidderRegistrations = await mockDataService.getApprovedRegistrations();
    // Transform data format to match previous structure
    const transformedData = bidderRegistrations.map((registration, index) => ({
      id: registration.userId.replace('user_', ''),
      name: registration.realName
    }));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: transformedData
    });
  } catch (error) {
    console.error('Failed to get bidders information list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidders information list',
      data: []
    });
  }
};

/**
 * Get bidding record statuses list
 */
export const getBiddingRecordStatuses = async () => {
  try {
    // Return predefined statuses as before
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: [
        { id: '1', name: 'Pending Confirmation', color: '#faad14' },
        { id: '2', name: 'Confirmed', color: '#52c41a' },
        { id: '3', name: 'Cancelled', color: '#ff4d4f' },
        { id: '4', name: 'Invalid', color: '#8c8c8c' }
      ]
    });
  } catch (error) {
    console.error('Failed to get bidding record statuses list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidding record statuses list',
      data: []
    });
  }
};

/**
 * Get single bidding record
 * @param {string} id - Bidding record ID
 */
export const getBiddingRecord = async (id) => {
  try {
    const bidRecords = await mockDataService.getBidRecords();
    const record = bidRecords.find((_, index) => index === parseInt(id) - 1);
    
    if (!record) {
      return Promise.resolve({
        code: 200,
        message: 'Success',
        data: {}
      });
    }
    
    const biddingInfo = await mockDataService.getBiddingInfoById(record.biddingId);
    const bidder = await mockDataService.getBidderRegistrations(record.userId);
    
    // Transform data format to match previous structure
    const transformedData = {
      id: id,
      code: `BIDREC-${new Date(record.bidTime).getFullYear()}-${id.padStart(4, '0')}`,
      biddingId: record.biddingId.replace('bidding_', ''),
      biddingCode: biddingInfo ? 
        `BID-${new Date(biddingInfo.createTime).getFullYear()}-${biddingInfo.id.split('_')[1].padStart(3, '0')}` : 
        'Unknown Bidding',
      biddingName: biddingInfo ? biddingInfo.title : 'Unknown Bidding',
      bidderId: record.userId.replace('user_', ''),
      bidderName: bidder.length > 0 ? bidder[0].realName : `Bidder${id}`,
      bidPrice: record.bidPrice,
      bidTime: record.bidTime.toISOString().slice(0, 19),
      status: {
        'pending': 1,
        'valid': 1,
        'confirmed': 2,
        'winning': 2,
        'cancelled': 3,
        'invalid': 4
      }[record.status],
      isWinningBid: record.status === 'winning',
      remark: record.status === 'winning' ? 'Final Transaction Price' : 'Bid Price',
      createdAt: record.bidTime.toISOString().slice(0, 19),
      updatedAt: record.bidTime.toISOString().slice(0, 19)
    };
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: transformedData
    });
  } catch (error) {
    console.error('Failed to get bidding record:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidding record',
      data: {}
    });
  }
};

/**
 * Update bidding record
 * @param {string} id - Bidding record ID
 * @param {object} data - Bidding record data
 */
export const updateBiddingRecord = async (id, data) => {
  try {
    const bidRecords = await mockDataService.getBidRecords();
    const recordIndex = bidRecords.findIndex((_, index) => index === parseInt(id) - 1);
    
    if (recordIndex !== -1) {
      // Transform status format to match mockDataService requirements
      const statusMap = {
        1: 'pending',
        2: 'confirmed',
        3: 'cancelled',
        4: 'invalid'
      };
      
      // Create a transformed record to update
      const updatedRecord = {
        ...bidRecords[recordIndex],
        status: statusMap[data.status] || 'pending',
        bidPrice: data.bidPrice || bidRecords[recordIndex].bidPrice
      };
      
      // In a real scenario, we would update the record in mockDataService
      // For now, we'll just return the transformed data
    }
    
    // Return the transformed data in the original format
    const biddingInfo = await mockDataService.getBiddingInfoById(`bidding_${data.biddingId}`);
    const bidder = await mockDataService.getBidderRegistrations(`user_${data.bidderId}`);
    
    const resultData = {
      id: id,
      code: data.code,
      biddingId: data.biddingId,
      biddingCode: biddingInfo ? 
        `BID-${new Date(biddingInfo.createTime).getFullYear()}-${biddingInfo.id.split('_')[1].padStart(3, '0')}` : 
        'Unknown Bidding',
      biddingName: biddingInfo ? biddingInfo.title : 'Unknown Bidding',
      bidderId: data.bidderId,
      bidderName: bidder.length > 0 ? bidder[0].realName : `Bidder${data.bidderId}`,
      bidPrice: data.bidPrice,
      bidTime: data.bidTime,
      status: data.status,
      isWinningBid: data.isWinningBid,
      remark: data.remark,
      createdAt: data.createdAt,
      updatedAt: new Date().toISOString().slice(0, 19)
    };
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: resultData
    });
  } catch (error) {
    console.error('Failed to update bidding record:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update bidding record',
      data: null
    });
  }
};

/**
 * Delete bidding record
 * @param {string} id - Bidding record ID
 */
export const deleteBiddingRecord = async (id) => {
  try {
    // In a real scenario, we would delete the record in mockDataService
    // For now, we'll just return success
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: { success: true }
    });
  } catch (error) {
    console.error('Failed to delete bidding record:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to delete bidding record',
      data: null
    });
  }
};

/**
 * Get bidding statistics information
 */
export const getBiddingStatistics = async () => {
  try {
    const biddingInfos = await mockDataService.getBiddingInfos();
    const bidRecords = await mockDataService.getBidRecords();
    
    // Calculate statistics
    const totalBiddings = biddingInfos.length;
    const activeBiddings = biddingInfos.filter(info => info.status === 'ongoing').length;
    const completedBiddings = biddingInfos.filter(info => info.status === 'completed').length;
    const totalBidAmount = bidRecords.reduce((sum, record) => sum + record.bidPrice, 0);
    
    const statisticsData = {
      totalBiddings,
      activeBiddings,
      completedBiddings,
      totalBidAmount
    };
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: statisticsData
    });
  } catch (error) {
    console.error('Failed to get bidding statistics information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidding statistics information',
      data: {
        totalBiddings: 0,
        activeBiddings: 0,
        completedBiddings: 0,
        totalBidAmount: 0
      }
    });
  }
};