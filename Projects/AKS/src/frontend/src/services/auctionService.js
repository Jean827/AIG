// Land auction management service for interacting with backend API

// Import mock data service
import { mockDataService } from './mockDataService';

// Auction related API
export const getAuctions = async (filters = {}) => {
  try {
    // Apply filtering conditions
    const result = await mockDataService.getBiddingInfos(filters);
    
    // Sort by creation time in descending order
    const sortedResult = result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: sortedResult
    });
  } catch (error) {
    console.error('Failed to get auction list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get auction list',
      data: []
    });
  }
};

export const getAuctionById = async (auctionId) => {
  try {
    const auction = await mockDataService.getBiddingInfo(auctionId);
    if (!auction) {
      throw new Error(`Auction does not exist: ${auctionId}`);
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: auction
    });
  } catch (error) {
    console.error('Failed to get auction details:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get auction details',
      data: null
    });
  }
};

export const createAuction = async (auctionData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...auctionData,
      landId: auctionData.landId || auctionData.land_id,
      landName: auctionData.landName || auctionData.land_name,
      landType: auctionData.landType || auctionData.land_type,
      startingPrice: auctionData.startingPrice || auctionData.starting_price,
      deposit: auctionData.deposit || auctionData.deposit,
      startTime: auctionData.startTime || auctionData.start_time,
      endTime: auctionData.endTime || auctionData.end_time,
      createdBy: auctionData.createdBy || auctionData.created_by
    };
    
    const newAuction = await mockDataService.createBiddingInfo(formattedData);
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newAuction
    });
  } catch (error) {
    console.error('Failed to create auction:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create auction',
      data: null
    });
  }
};

export const updateAuction = async (auctionId, auctionData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...auctionData,
      landId: auctionData.landId || auctionData.land_id,
      landName: auctionData.landName || auctionData.land_name,
      landType: auctionData.landType || auctionData.land_type,
      startingPrice: auctionData.startingPrice || auctionData.starting_price,
      deposit: auctionData.deposit || auctionData.deposit,
      startTime: auctionData.startTime || auctionData.start_time,
      endTime: auctionData.endTime || auctionData.end_time
    };
    
    const updatedAuction = await mockDataService.updateBiddingInfo(auctionId, formattedData);
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: updatedAuction
    });
  } catch (error) {
    console.error('Failed to update auction:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update auction',
      data: null
    });
  }
};

export const cancelAuction = async (auctionId, reason) => {
  try {
    const auction = await mockDataService.getBiddingInfo(auctionId);
    if (!auction) {
      throw new Error(`Auction does not exist: ${auctionId}`);
    }
    
    if (auction.status === 'completed') {
      throw new Error('Auction has been completed, cannot be canceled');
    }
    
    await mockDataService.updateBiddingInfo(auctionId, {
      status: 'canceled',
      cancelReason: reason,
      updateTime: new Date().toISOString()
    });
    
    const updatedAuction = await mockDataService.getBiddingInfo(auctionId);
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: updatedAuction
    });
  } catch (error) {
    console.error('Failed to cancel auction:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to cancel auction',
      data: null
    });
  }
};

// Bid record related API
export const placeBid = async (auctionId, userId, price, userInfo) => {
  try {
    const result = await mockDataService.createBidRecord({
      biddingId: auctionId,
      userId: userId,
      price: price,
      bidTime: new Date().toISOString()
    });
    
    // Get the updated auction information
    const updatedAuction = await mockDataService.getBiddingInfo(auctionId);
    
    // Update current price
    await mockDataService.updateBiddingInfo(auctionId, {
      currentPrice: price,
      updateTime: new Date().toISOString()
    });
    
    // Check if it's the final bid
    const now = new Date();
    const endTime = new Date(updatedAuction.endTime);
    
    if (now >= endTime || (endTime - now) < 60000) { // Last minute bid
      await mockDataService.updateBiddingInfo(auctionId, {
        status: 'completed',
        winnerId: userId,
        winnerName: userInfo.name || 'Unknown User'
      });
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Bid successful',
      data: {
        success: true,
        currentPrice: price,
        bidTime: result.bidTime
      }
    });
  } catch (error) {
    console.error('Failed to place bid:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to place bid',
      data: null
    });
  }
};

// Bidder management related API
export const getBidders = async (filters = {}) => {
  try {
    const result = await mockDataService.getBidders(filters);
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get bidder list:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidder list',
      data: []
    });
  }
};

export const getBidderById = async (bidderId) => {
  try {
    const bidder = await mockDataService.getBidder(bidderId);
    if (!bidder) {
      throw new Error(`Bidder does not exist: ${bidderId}`);
    }
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: bidder
    });
  } catch (error) {
    console.error('Failed to get bidder details:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get bidder details',
      data: null
    });
  }
};

export const createBidder = async (bidderData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...bidderData,
      idCard: bidderData.idCard || bidderData.id_card
    };
    
    const newBidder = await mockDataService.createBidder(formattedData);
    
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newBidder
    });
  } catch (error) {
    console.error('Failed to register bidder:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to register bidder',
      data: null
    });
  }
};

export const approveBidder = async (bidderId) => {
  try {
    await mockDataService.updateBidder(bidderId, {
      status: 'approved'
    });
    
    return Promise.resolve({
      code: 200,
      message: 'Approved successfully',
      data: {
        success: true,
        message: 'Approved successfully'
      }
    });
  } catch (error) {
    console.error('Failed to approve bidder:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to approve bidder',
      data: null
    });
  }
};

export const rejectBidder = async (bidderId, reason) => {
  try {
    await mockDataService.updateBidder(bidderId, {
      status: 'rejected',
      rejectReason: reason
    });
    
    return Promise.resolve({
      code: 200,
      message: 'Rejected successfully',
      data: {
        success: true,
        message: 'Rejected successfully'
      }
    });
  } catch (error) {
    console.error('Failed to reject bidder:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to reject bidder',
      data: null
    });
  }
};