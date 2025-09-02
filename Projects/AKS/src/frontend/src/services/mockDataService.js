// Mock Data Service for Land Bidding Module
// This service mocks the backend API endpoints and business logic

import { v4 as uuidv4 } from 'uuid';

// Mock data storage
const mockData = {
  // Bidder registrations
  bidderRegistrations: [
    {
      id: 'bidder_reg_001',
      userId: 'user_001',
      userType: 'contractor',
      realName: 'Zhang San',
      idCardNumber: '110101199001011234',
      phoneNumber: '13800138001',
      address: 'Chaoyang District, Beijing',
      businessLicense: 'license_001.jpg',
      status: 'approved',
      reviewTime: new Date('2023-05-01T10:00:00'),
      reviewRemark: 'Approved',
      createTime: new Date('2023-04-28T14:30:00')
    },
    {
      id: 'bidder_reg_002',
      userId: 'user_002',
      userType: 'contractor',
      realName: 'Li Si',
      idCardNumber: '110101199202022345',
      phoneNumber: '13900139002',
      address: 'Haidian District, Beijing',
      businessLicense: null,
      status: 'pending',
      reviewTime: null,
      reviewRemark: null,
      createTime: new Date('2023-05-02T09:15:00')
    },
    {
      id: 'bidder_reg_003',
      userId: 'user_003',
      userType: 'admin',
      realName: 'Wang Wu',
      idCardNumber: '110101198803033456',
      phoneNumber: '13700137003',
      address: 'Xicheng District, Beijing',
      businessLicense: 'license_003.jpg',
      status: 'approved',
      reviewTime: new Date('2023-04-30T16:45:00'),
      reviewRemark: 'Approved',
      createTime: new Date('2023-04-25T11:20:00')
    }
  ],

  // Bidding information
  biddingInfos: [
    {
      id: 'bidding_001',
      landId: 'land_001',
      title: 'Unity Village Quality Farmland Bidding',
      description: '15.5 acres of quality farmland in Unity Village, suitable for wheat, corn and other crops',
      startingPrice: 7750.0,
      increment: 500.0,
      depositAmount: 1550.0,
      startTime: new Date('2023-05-10T09:00:00'),
      endTime: new Date('2023-05-17T16:00:00'),
      status: 'pending',
      winnerId: null,
      finalPrice: null,
      createTime: new Date('2023-05-01T10:00:00'),
      updateTime: new Date('2023-05-01T10:00:00')
    },
    {
      id: 'bidding_002',
      landId: 'land_002',
      title: 'Happiness Village Orchard Bidding',
      description: '8 acres of orchard in Happiness Village, with apple trees, pear trees and other fruit trees',
      startingPrice: 12000.0,
      increment: 1000.0,
      depositAmount: 2400.0,
      startTime: new Date('2023-05-05T09:00:00'),
      endTime: new Date('2023-05-12T16:00:00'),
      status: 'ongoing',
      winnerId: null,
      finalPrice: null,
      createTime: new Date('2023-04-28T14:30:00'),
      updateTime: new Date('2023-05-05T09:00:00')
    },
    {
      id: 'bidding_003',
      landId: 'land_003',
      title: 'Peace Village Fishpond Bidding',
      description: '5 acres of fishpond in Peace Village, sufficient water source, suitable for fish farming',
      startingPrice: 10000.0,
      increment: 800.0,
      depositAmount: 2000.0,
      startTime: new Date('2023-04-20T09:00:00'),
      endTime: new Date('2023-04-27T16:00:00'),
      status: 'completed',
      winnerId: 'user_001',
      finalPrice: 12400.0,
      createTime: new Date('2023-04-15T11:20:00'),
      updateTime: new Date('2023-04-27T16:00:00')
    },
    {
      id: 'bidding_004',
      landId: 'land_004',
      title: 'Democracy Village Mountain Land Bidding',
      description: '20 acres of mountain land in Democracy Village, suitable for planting walnuts, chestnuts and other economic crops',
      startingPrice: 8000.0,
      increment: 600.0,
      depositAmount: 1600.0,
      startTime: new Date('2023-04-15T09:00:00'),
      endTime: new Date('2023-04-22T16:00:00'),
      status: 'cancelled',
      winnerId: null,
      finalPrice: null,
      createTime: new Date('2023-04-10T13:45:00'),
      updateTime: new Date('2023-04-18T10:30:00')
    }
  ],

  // Deposit transactions
  depositTransactions: [
    {
      id: 'deposit_001',
      userId: 'user_001',
      biddingId: 'bidding_001',
      amount: 1550.0,
      transactionType: 'payment',
      status: 'paid',
      transactionTime: new Date('2023-05-03T14:20:00'),
      remark: 'Bidding deposit'
    },
    {
      id: 'deposit_002',
      userId: 'user_002',
      biddingId: 'bidding_001',
      amount: 1550.0,
      transactionType: 'payment',
      status: 'pending',
      transactionTime: null,
      remark: 'Bidding deposit'
    },
    {
      id: 'deposit_003',
      userId: 'user_001',
      biddingId: 'bidding_003',
      amount: 2000.0,
      transactionType: 'refund',
      status: 'refunded',
      transactionTime: new Date('2023-04-28T10:15:00'),
      remark: 'Deposit refund after bidding ended'
    },
    {
      id: 'deposit_004',
      userId: 'user_003',
      biddingId: 'bidding_002',
      amount: 2400.0,
      transactionType: 'payment',
      status: 'paid',
      transactionTime: new Date('2023-05-04T09:30:00'),
      remark: 'Bidding deposit'
    }
  ],

  // Bid records
  bidRecords: [
    {
      id: 'bid_001',
      biddingId: 'bidding_002',
      userId: 'user_001',
      bidPrice: 13000.0,
      bidTime: new Date('2023-05-05T10:15:00'),
      status: 'valid'
    },
    {
      id: 'bid_002',
      biddingId: 'bidding_002',
      userId: 'user_003',
      bidPrice: 14000.0,
      bidTime: new Date('2023-05-05T11:20:00'),
      status: 'valid'
    },
    {
      id: 'bid_003',
      biddingId: 'bidding_002',
      userId: 'user_001',
      bidPrice: 15000.0,
      bidTime: new Date('2023-05-05T13:45:00'),
      status: 'valid'
    },
    {
      id: 'bid_004',
      biddingId: 'bidding_003',
      userId: 'user_001',
      bidPrice: 12400.0,
      bidTime: new Date('2023-04-27T15:50:00'),
      status: 'winning'
    },
    {
      id: 'bid_005',
      biddingId: 'bidding_003',
      userId: 'user_002',
      bidPrice: 11600.0,
      bidTime: new Date('2023-04-27T15:45:00'),
      status: 'valid'
    }
  ],

  // Winning payments
  winningPayments: [
    {
      id: 'payment_001',
      biddingId: 'bidding_003',
      userId: 'user_001',
      totalAmount: 12400.0,
      paidAmount: 12400.0,
      paymentStatus: 'paid',
      dueDate: new Date('2023-05-27T16:00:00'),
      penaltyAmount: 0.0,
      createTime: new Date('2023-04-27T16:00:00'),
      updateTime: new Date('2023-04-28T09:30:00')
    }
  ],

  // Land information
  lands: [
    {
      id: 'land_001',
      name: 'Unity Village Farmland',
      area: 15.5,
      type: 'farmland',
      location: 'East of Unity Village',
      description: 'Quality farmland with fertile soil and convenient irrigation'
    },
    {
      id: 'land_002',
      name: 'Happiness Village Orchard',
      area: 8.0,
      type: 'orchard',
      location: 'North of Happiness Village',
      description: 'Existing fruit trees with excellent varieties and stable yield'
    },
    {
      id: 'land_003',
      name: 'Peace Village Fishpond',
      area: 5.0,
      type: 'water area',
      location: 'South of Peace Village',
      description: 'Sufficient water source with good water quality, suitable for fish farming'
    },
    {
      id: 'land_004',
      name: 'Democracy Village Mountain Land',
      area: 20.0,
      type: 'mountain land',
      location: 'West of Democracy Village',
      description: 'Suitable for planting walnuts, chestnuts and other economic crops'
    }
  ],

  // Auctioneers
  auctioneers: [
    {
      id: 'auctioneer_001',
      name: 'Auctioneer Zhang',
      level: 'senior',
      experience: 10,
      status: 'online'
    },
    {
      id: 'auctioneer_002',
      name: 'Auctioneer Li',
      level: 'intermediate',
      experience: 5,
      status: 'online'
    },
    {
      id: 'auctioneer_003',
      name: 'Auctioneer Wang',
      level: 'junior',
      experience: 2,
      status: 'offline'
    }
  ]
};

// Helper function to simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Service Class
class MockDataService {
  // Bidder Registration Management
  async getBidderRegistrations(userId = null, status = null) {
    await simulateDelay();
    let registrations = [...mockData.bidderRegistrations];

    if (userId) {
      registrations = registrations.filter(r => r.userId === userId);
    }

    if (status) {
      registrations = registrations.filter(r => r.status === status);
    }

    return {
      code: 200,
      message: 'Success',
      data: registrations
    };
  }

  async getBidderRegistrationById(id) {
    await simulateDelay();
    const registration = mockData.bidderRegistrations.find(r => r.id === id);
    if (!registration) {
      return {
        code: 404,
        message: 'Bidder registration not found',
        data: null
      };
    }
    return {
      code: 200,
      message: 'Success',
      data: registration
    };
  }

  async createBidderRegistration(data) {
    await simulateDelay();
    const newRegistration = {
      id: `bidder_reg_${Date.now()}`,
      userId: data.userId,
      userType: data.userType,
      realName: data.realName,
      idCardNumber: data.idCardNumber,
      phoneNumber: data.phoneNumber,
      address: data.address,
      businessLicense: data.businessLicense,
      status: 'pending',
      reviewTime: null,
      reviewRemark: null,
      createTime: new Date()
    };
    mockData.bidderRegistrations.push(newRegistration);
    return {
      code: 201,
      message: 'Bidder registration created successfully',
      data: newRegistration
    };
  }

  async updateBidderRegistration(id, data) {
    await simulateDelay();
    const index = mockData.bidderRegistrations.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Bidder registration not found',
        data: null
      };
    }
    mockData.bidderRegistrations[index] = {
      ...mockData.bidderRegistrations[index],
      ...data,
      updateTime: new Date()
    };
    return {
      code: 200,
      message: 'Bidder registration updated successfully',
      data: mockData.bidderRegistrations[index]
    };
  }

  async deleteBidderRegistration(id) {
    await simulateDelay();
    const index = mockData.bidderRegistrations.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Bidder registration not found',
        data: null
      };
    }
    const deletedRegistration = mockData.bidderRegistrations.splice(index, 1)[0];
    return {
      code: 200,
      message: 'Bidder registration deleted successfully',
      data: deletedRegistration
    };
  }

  // Bidding Information Management
  async getBiddingInfos(status = null, keyword = null) {
    await simulateDelay();
    let biddingInfos = [...mockData.biddingInfos];

    if (status) {
      biddingInfos = biddingInfos.filter(b => b.status === status);
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      biddingInfos = biddingInfos.filter(b => 
        b.title.toLowerCase().includes(lowerKeyword) ||
        b.description.toLowerCase().includes(lowerKeyword)
      );
    }

    return {
      code: 200,
      message: 'Success',
      data: biddingInfos
    };
  }

  async getBiddingInfoById(id) {
    await simulateDelay();
    const biddingInfo = mockData.biddingInfos.find(b => b.id === id);
    if (!biddingInfo) {
      return {
        code: 404,
        message: 'Bidding information not found',
        data: null
      };
    }
    return {
      code: 200,
      message: 'Success',
      data: biddingInfo
    };
  }

  async createBiddingInfo(data) {
    await simulateDelay();
    const newBiddingInfo = {
      id: `bidding_${Date.now()}`,
      landId: data.landId,
      title: data.title,
      description: data.description,
      startingPrice: data.startingPrice,
      increment: data.increment,
      depositAmount: data.depositAmount,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'pending',
      winnerId: null,
      finalPrice: null,
      createTime: new Date(),
      updateTime: new Date()
    };
    mockData.biddingInfos.push(newBiddingInfo);
    return {
      code: 201,
      message: 'Bidding information created successfully',
      data: newBiddingInfo
    };
  }

  async updateBiddingInfo(id, data) {
    await simulateDelay();
    const index = mockData.biddingInfos.findIndex(b => b.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Bidding information not found',
        data: null
      };
    }
    mockData.biddingInfos[index] = {
      ...mockData.biddingInfos[index],
      ...data,
      updateTime: new Date()
    };
    return {
      code: 200,
      message: 'Bidding information updated successfully',
      data: mockData.biddingInfos[index]
    };
  }

  async deleteBiddingInfo(id) {
    await simulateDelay();
    const index = mockData.biddingInfos.findIndex(b => b.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Bidding information not found',
        data: null
      };
    }
    const deletedBiddingInfo = mockData.biddingInfos.splice(index, 1)[0];
    return {
      code: 200,
      message: 'Bidding information deleted successfully',
      data: deletedBiddingInfo
    };
  }

  // Deposit Transaction Management
  async getDepositTransactions(userId = null, biddingId = null, status = null) {
    await simulateDelay();
    let transactions = [...mockData.depositTransactions];

    if (userId) {
      transactions = transactions.filter(t => t.userId === userId);
    }

    if (biddingId) {
      transactions = transactions.filter(t => t.biddingId === biddingId);
    }

    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    return {
      code: 200,
      message: 'Success',
      data: transactions
    };
  }

  async getDepositTransactionById(id) {
    await simulateDelay();
    const transaction = mockData.depositTransactions.find(t => t.id === id);
    if (!transaction) {
      return {
        code: 404,
        message: 'Deposit transaction not found',
        data: null
      };
    }
    return {
      code: 200,
      message: 'Success',
      data: transaction
    };
  }

  async createDepositTransaction(data) {
    await simulateDelay();
    const newTransaction = {
      id: `deposit_${Date.now()}`,
      userId: data.userId,
      biddingId: data.biddingId,
      amount: data.amount,
      transactionType: data.transactionType,
      status: data.status || 'pending',
      transactionTime: data.status === 'paid' ? new Date() : null,
      remark: data.remark
    };
    mockData.depositTransactions.push(newTransaction);
    return {
      code: 201,
      message: 'Deposit transaction created successfully',
      data: newTransaction
    };
  }

  async updateDepositTransaction(id, data) {
    await simulateDelay();
    const index = mockData.depositTransactions.findIndex(t => t.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Deposit transaction not found',
        data: null
      };
    }
    mockData.depositTransactions[index] = {
      ...mockData.depositTransactions[index],
      ...data,
      transactionTime: data.status === 'paid' ? new Date() : mockData.depositTransactions[index].transactionTime
    };
    return {
      code: 200,
      message: 'Deposit transaction updated successfully',
      data: mockData.depositTransactions[index]
    };
  }

  // Confirm deposit payment
  async confirmDepositPayment(id) {
    await simulateDelay();
    const index = mockData.depositTransactions.findIndex(t => t.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Deposit transaction not found',
        data: null
      };
    }
    mockData.depositTransactions[index] = {
      ...mockData.depositTransactions[index],
      status: 'paid',
      transactionTime: new Date()
    };
    return {
      code: 200,
      message: 'Deposit payment confirmed successfully',
      data: mockData.depositTransactions[index]
    };
  }

  // Bid Record Management
  async getBidRecords(biddingId = null, userId = null, status = null) {
    await simulateDelay();
    let records = [...mockData.bidRecords];

    if (biddingId) {
      records = records.filter(r => r.biddingId === biddingId);
    }

    if (userId) {
      records = records.filter(r => r.userId === userId);
    }

    if (status) {
      records = records.filter(r => r.status === status);
    }

    return {
      code: 200,
      message: 'Success',
      data: records
    };
  }

  async createBidRecord(data) {
    await simulateDelay();
    // Check if user has paid deposit
    const depositPaid = mockData.depositTransactions.some(t => 
      t.userId === data.userId && 
      t.biddingId === data.biddingId && 
      t.status === 'paid'
    );
    
    if (!depositPaid) {
      return {
        code: 400,
        message: 'User has not paid the deposit',
        data: null
      };
    }

    // Check if bidding is ongoing
    const biddingInfo = mockData.biddingInfos.find(b => b.id === data.biddingId);
    if (!biddingInfo || biddingInfo.status !== 'ongoing') {
      return {
        code: 400,
        message: 'Bidding is not ongoing',
        data: null
      };
    }

    // Check if bid price is higher than current highest price
    const currentHighest = Math.max(
      biddingInfo.startingPrice,
      ...mockData.bidRecords
        .filter(r => r.biddingId === data.biddingId)
        .map(r => r.bidPrice)
    );

    if (data.bidPrice <= currentHighest) {
      return {
        code: 400,
        message: 'Bid price must be higher than current highest price',
        data: null
      };
    }

    // Create new bid record
    const newBidRecord = {
      id: `bid_${Date.now()}`,
      biddingId: data.biddingId,
      userId: data.userId,
      bidPrice: data.bidPrice,
      bidTime: new Date(),
      status: 'valid'
    };
    mockData.bidRecords.push(newBidRecord);

    // Auto extend bidding time if bid is placed near end time
    const now = new Date();
    const timeLeft = biddingInfo.endTime - now;
    if (timeLeft < 300000) { // 5 minutes = 300,000 ms
      const extendedEndTime = new Date(now.getTime() + 300000);
      biddingInfo.endTime = extendedEndTime;
      biddingInfo.updateTime = now;
    }

    return {
      code: 201,
      message: 'Bid record created successfully',
      data: newBidRecord
    };
  }

  // Winning Payment Management
  async getWinningPayments(biddingId = null, userId = null, status = null) {
    await simulateDelay();
    let payments = [...mockData.winningPayments];

    if (biddingId) {
      payments = payments.filter(p => p.biddingId === biddingId);
    }

    if (userId) {
      payments = payments.filter(p => p.userId === userId);
    }

    if (status) {
      payments = payments.filter(p => p.paymentStatus === status);
    }

    return {
      code: 200,
      message: 'Success',
      data: payments
    };
  }

  async createWinningPayment(data) {
    await simulateDelay();
    const newPayment = {
      id: `payment_${Date.now()}`,
      biddingId: data.biddingId,
      userId: data.userId,
      totalAmount: data.totalAmount,
      paidAmount: 0,
      paymentStatus: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      penaltyAmount: 0,
      createTime: new Date(),
      updateTime: new Date()
    };
    mockData.winningPayments.push(newPayment);
    return {
      code: 201,
      message: 'Winning payment created successfully',
      data: newPayment
    };
  }

  // Bidding Review Management
  async reviewBidderRegistration(id, reviewResult, remark) {
    await simulateDelay();
    const index = mockData.bidderRegistrations.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: 'Bidder registration not found',
        data: null
      };
    }
    mockData.bidderRegistrations[index] = {
      ...mockData.bidderRegistrations[index],
      status: reviewResult,
      reviewTime: new Date(),
      reviewRemark: remark
    };
    return {
      code: 200,
      message: 'Bidder registration reviewed successfully',
      data: mockData.bidderRegistrations[index]
    };
  }

  // Check Bidder Qualification
  async checkBidderQualification(userId, biddingId) {
    await simulateDelay();
    // Check if user has completed registration
    const registration = mockData.bidderRegistrations.find(r => 
      r.userId === userId && r.status === 'approved'
    );
    
    if (!registration) {
      return {
        code: 400,
        message: 'User has not completed registration or registration not approved',
        data: { isQualified: false, reason: 'Registration not approved' }
      };
    }

    // Check if user has paid deposit for this bidding
    const depositPaid = mockData.depositTransactions.some(t => 
      t.userId === userId && 
      t.biddingId === biddingId && 
      t.status === 'paid'
    );
    
    if (!depositPaid) {
      return {
        code: 400,
        message: 'User has not paid the deposit for this bidding',
        data: { isQualified: false, reason: 'Deposit not paid' }
      };
    }

    // Check if bidding is ongoing
    const biddingInfo = mockData.biddingInfos.find(b => b.id === biddingId);
    if (!biddingInfo || biddingInfo.status !== 'ongoing') {
      return {
        code: 400,
        message: 'Bidding is not ongoing',
        data: { isQualified: false, reason: 'Bidding not ongoing' }
      };
    }

    return {
      code: 200,
      message: 'User is qualified to bid',
      data: { isQualified: true, reason: 'Qualified' }
    };
  }

  // Get Bidding Status
  async getBiddingStatus(biddingId) {
    await simulateDelay();
    const biddingInfo = mockData.biddingInfos.find(b => b.id === biddingId);
    if (!biddingInfo) {
      return {
        code: 404,
        message: 'Bidding not found',
        data: null
      };
    }

    // Check if bidding time is active
    const now = new Date();
    let currentStatus = biddingInfo.status;
    let timeStatus = '';

    if (now < biddingInfo.startTime && currentStatus === 'pending') {
      timeStatus = 'upcoming';
    } else if (now >= biddingInfo.startTime && now < biddingInfo.endTime && currentStatus === 'pending') {
      currentStatus = 'ongoing';
      timeStatus = 'ongoing';
    } else if (now >= biddingInfo.endTime && ['pending', 'ongoing'].includes(currentStatus)) {
      currentStatus = 'completed';
      timeStatus = 'ended';
    }

    // Get current highest bid price
    const highestBid = Math.max(
      biddingInfo.startingPrice,
      ...mockData.bidRecords
        .filter(r => r.biddingId === biddingId)
        .map(r => r.bidPrice)
    );

    // Get number of bidders
    const bidderIds = new Set(mockData.bidRecords
      .filter(r => r.biddingId === biddingId)
      .map(r => r.userId)
    );

    return {
      code: 200,
      message: 'Success',
      data: {
        id: biddingInfo.id,
        status: currentStatus,
        timeStatus: timeStatus,
        highestBid: highestBid,
        bidderCount: bidderIds.size,
        startTime: biddingInfo.startTime,
        endTime: biddingInfo.endTime,
        remainingTime: timeStatus === 'ongoing' ? biddingInfo.endTime - now : 0
      }
    };
  }

  // Get Bidding History
  async getBiddingHistory(userId) {
    await simulateDelay();
    const userBids = mockData.bidRecords.filter(r => r.userId === userId);
    const biddingIds = [...new Set(userBids.map(r => r.biddingId))];
    const biddingInfos = mockData.biddingInfos.filter(b => biddingIds.includes(b.id));

    const history = biddingInfos.map(bidding => {
      const userBidRecords = userBids.filter(b => b.biddingId === bidding.id);
      const maxUserBid = userBidRecords.length > 0 ? 
        Math.max(...userBidRecords.map(r => r.bidPrice)) : 0;
      const isWinner = bidding.winnerId === userId;
      
      return {
        biddingId: bidding.id,
        title: bidding.title,
        startTime: bidding.startTime,
        endTime: bidding.endTime,
        status: bidding.status,
        finalPrice: bidding.finalPrice,
        userMaxBid: maxUserBid,
        isWinner: isWinner,
        bidCount: userBidRecords.length
      };
    });

    return {
      code: 200,
      message: 'Success',
      data: history
    };
  }

  // Get Bidding List with Filters
  async getFilteredBiddingList(filters) {
    await simulateDelay();
    let biddingList = [...mockData.biddingInfos];

    // Apply filters
    if (filters.status) {
      biddingList = biddingList.filter(b => b.status === filters.status);
    }
    
    if (filters.landType) {
      const landIds = mockData.lands
        .filter(l => l.type === filters.landType)
        .map(l => l.id);
      biddingList = biddingList.filter(b => landIds.includes(b.landId));
    }
    
    if (filters.keyword) {
      const lowerKeyword = filters.keyword.toLowerCase();
      biddingList = biddingList.filter(b => 
        b.title.toLowerCase().includes(lowerKeyword) ||
        b.description.toLowerCase().includes(lowerKeyword)
      );
    }
    
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      biddingList = biddingList.filter(b => 
        b.startingPrice >= filters.minPrice && b.startingPrice <= filters.maxPrice
      );
    }

    // Add additional information
    const enhancedList = biddingList.map(bidding => {
      const land = mockData.lands.find(l => l.id === bidding.landId);
      const bidCount = mockData.bidRecords.filter(r => r.biddingId === bidding.id).length;
      const bidderCount = new Set(mockData.bidRecords
        .filter(r => r.biddingId === bidding.id)
        .map(r => r.userId)
      ).size;
      const currentHighestBid = Math.max(
        bidding.startingPrice,
        ...mockData.bidRecords
          .filter(r => r.biddingId === bidding.id)
          .map(r => r.bidPrice)
      );

      return {
        ...bidding,
        landInfo: land,
        bidCount: bidCount,
        bidderCount: bidderCount,
        currentHighestBid: currentHighestBid
      };
    });

    return {
      code: 200,
      message: 'Success',
      data: enhancedList
    };
  }

  // Create multiple bidders in batch
  async batchCreateBidders(bidderDataList) {
    await simulateDelay();
    const createdBidders = [];

    for (const bidderData of bidderDataList) {
      const newBidder = {
        id: `bidder_reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: bidderData.userId,
        userType: bidderData.userType,
        realName: bidderData.realName,
        idCardNumber: bidderData.idCardNumber,
        phoneNumber: bidderData.phoneNumber,
        address: bidderData.address,
        businessLicense: bidderData.businessLicense,
        status: 'pending',
        reviewTime: null,
        reviewRemark: null,
        createTime: new Date()
      };
      mockData.bidderRegistrations.push(newBidder);
      createdBidders.push(newBidder);
    }

    return {
      code: 201,
      message: `${createdBidders.length} bidders created successfully`,
      data: createdBidders
    };
  }

  // Get approved registrations
  async getApprovedRegistrations() {
    await simulateDelay();
    const approvedRegistrations = mockData.bidderRegistrations.filter(r => r.status === 'approved');
    return {
      code: 200,
      message: 'Success',
      data: approvedRegistrations
    };
  }

  // Create bidding review
  async createBiddingReview(biddingId, reviewData) {
    await simulateDelay();
    // This is a mock implementation
    // In a real system, this would create a review record in the database
    return {
      code: 201,
      message: 'Bidding review created successfully',
      data: {
        id: `review_${Date.now()}`,
        biddingId: biddingId,
        ...reviewData,
        createTime: new Date()
      }
    };
  }

  // Get Lands
  async getLands() {
    await simulateDelay();
    return {
      code: 200,
      message: 'Success',
      data: mockData.lands
    };
  }

  // Get Auctioneers
  async getAuctioneers() {
    await simulateDelay();
    return {
      code: 200,
      message: 'Success',
      data: mockData.auctioneers
    };
  }

  // Get current bid price for a specific bidding
  async getCurrentBidPrice(biddingId) {
    await simulateDelay();
    const biddingInfo = mockData.biddingInfos.find(b => b.id === biddingId);
    if (!biddingInfo) {
      return {
        code: 404,
        message: 'Bidding not found',
        data: null
      };
    }

    const highestBid = Math.max(
      biddingInfo.startingPrice,
      ...mockData.bidRecords
        .filter(r => r.biddingId === biddingId)
        .map(r => r.bidPrice)
    );

    return {
      code: 200,
      message: 'Success',
      data: { currentBidPrice: highestBid }
    };
  }

  // Get number of participants for a specific bidding
  async getParticipantCount(biddingId) {
    await simulateDelay();
    const bidderIds = new Set(mockData.bidRecords
      .filter(r => r.biddingId === biddingId)
      .map(r => r.userId)
    );

    return {
      code: 200,
      message: 'Success',
      data: { participantCount: bidderIds.size }
    };
  }

  // Get number of bids for a specific bidding
  async getBidCount(biddingId) {
    await simulateDelay();
    const bidCount = mockData.bidRecords.filter(r => r.biddingId === biddingId).length;

    return {
      code: 200,
      message: 'Success',
      data: { bidCount: bidCount }
    };
  }

  // Export data
  async exportData(dataType, filters) {
    await simulateDelay();
    let exportData = [];

    switch (dataType) {
      case 'bidderRegistrations':
        exportData = mockData.bidderRegistrations;
        break;
      case 'biddingInfos':
        exportData = mockData.biddingInfos;
        break;
      case 'bidRecords':
        exportData = mockData.bidRecords;
        break;
      case 'depositTransactions':
        exportData = mockData.depositTransactions;
        break;
      default:
        return {
          code: 400,
          message: 'Invalid data type',
          data: null
        };
    }

    // Apply filters if provided
    if (filters) {
      // Simple filtering logic
      Object.keys(filters).forEach(key => {
        exportData = exportData.filter(item => item[key] === filters[key]);
      });
    }

    return {
      code: 200,
      message: 'Data exported successfully',
      data: {
        fileName: `${dataType}_export_${Date.now()}.json`,
        data: exportData,
        exportTime: new Date()
      }
    };
  }
}

// Export the service instance
export default new MockDataService();