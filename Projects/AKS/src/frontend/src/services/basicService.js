// Basic information management service for interacting with backend API

// Import mock data service
import { mockDataService } from './mockDataService';

// Township information related API
export const getTownships = async () => {
  try {
    const result = await mockDataService.getTownships();
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get township information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get township information',
      data: []
    });
  }
};

export const createTownship = async (townshipData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...townshipData,
      villageCount: townshipData.village_count,
      organization: townshipData.organization || 'Agricultural Bureau'
    };
    
    const newTownship = await mockDataService.createTownship(formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newTownship
    });
  } catch (error) {
    console.error('Failed to create township information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create township information',
      data: null
    });
  }
};

export const updateTownship = async (townshipId, townshipData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...townshipData,
      villageCount: townshipData.village_count,
      updateTime: new Date().toISOString()
    };
    
    const updatedTownship = await mockDataService.updateTownship(townshipId, formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: updatedTownship
    });
  } catch (error) {
    console.error('Failed to update township information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update township information',
      data: null
    });
  }
};

export const deleteTownship = async (townshipId) => {
  try {
    const result = await mockDataService.deleteTownship(townshipId);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to delete township information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to delete township information',
      data: null
    });
  }
};

// Village information related API
export const getVillages = async (townshipId = null) => {
  try {
    const result = await mockDataService.getVillages({ townshipId });
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get village information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get village information',
      data: []
    });
  }
};

export const createVillage = async (villageData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...villageData,
      townshipId: villageData.township_id,
      townshipName: villageData.township_name
    };
    
    const newVillage = await mockDataService.createVillage(formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newVillage
    });
  } catch (error) {
    console.error('Failed to create village information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create village information',
      data: null
    });
  }
};

// Farmer information related API
export const getFarmers = async (filters = {}) => {
  try {
    // Convert filter names to camelCase
    const formattedFilters = {
      townshipName: filters.township_name,
      villageName: filters.village_name,
      name: filters.name,
      idNumber: filters.id_number
    };
    
    const result = await mockDataService.getFarmers(formattedFilters);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get farmer information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get farmer information',
      data: []
    });
  }
};

export const createFarmer = async (farmerData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...farmerData,
      cardNumber: farmerData.card_number,
      idNumber: farmerData.id_number,
      farmerType: farmerData.farmer_type,
      townshipName: farmerData.township_name,
      villageName: farmerData.village_name
    };
    
    const newFarmer = await mockDataService.createFarmer(formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newFarmer
    });
  } catch (error) {
    console.error('Failed to create farmer information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create farmer information',
      data: null
    });
  }
};

// Update farmer information
export const updateFarmer = async (farmerId, farmerData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...farmerData,
      cardNumber: farmerData.card_number,
      idNumber: farmerData.id_number,
      farmerType: farmerData.farmer_type,
      townshipName: farmerData.township_name,
      villageName: farmerData.village_name,
      updateTime: new Date().toISOString()
    };
    
    const updatedFarmer = await mockDataService.updateFarmer(farmerId, formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: updatedFarmer
    });
  } catch (error) {
    console.error('Failed to update farmer information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update farmer information',
      data: null
    });
  }
};

// Delete farmer information
export const deleteFarmer = async (farmerId) => {
  try {
    const result = await mockDataService.deleteFarmer(farmerId);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to delete farmer information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to delete farmer information',
      data: null
    });
  }
};

// Land type price related API
export const getLandTypePrices = async (year = null) => {
  try {
    const result = await mockDataService.getLandTypePrices({ year });
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get land type prices:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get land type prices',
      data: []
    });
  }
};

// Land basic information related API
export const getLandInformation = async (filters = {}) => {
  try {
    // Convert filter names to camelCase
    const formattedFilters = {
      townshipId: filters.township_id,
      code: filters.code,
      name: filters.name
    };
    
    const result = await mockDataService.getLandInformation(formattedFilters);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get land basic information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get land basic information',
      data: []
    });
  }
};

export const createLandInformation = async (landData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...landData,
      townshipId: landData.township_id,
      townshipName: landData.township_name,
      totalArea: landData.total_area,
      contractedArea: landData.contracted_area,
      availableArea: landData.available_area
    };
    
    const newLand = await mockDataService.createLandInformation(formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newLand
    });
  } catch (error) {
    console.error('Failed to create land basic information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create land basic information',
      data: null
    });
  }
};

// Infrastructure information related API
export const getInfrastructures = async (filters = {}) => {
  try {
    // Convert filter names to camelCase
    const formattedFilters = {
      farmId: filters.farm_id,
      typeId: filters.type_id,
      code: filters.code,
      name: filters.name,
      status: filters.status
    };
    
    const result = await mockDataService.getInfrastructures(formattedFilters);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get infrastructure information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get infrastructure information',
      data: []
    });
  }
};

export const createInfrastructure = async (infrastructureData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...infrastructureData,
      farmId: infrastructureData.farm_id,
      farmName: infrastructureData.farm_name,
      typeId: infrastructureData.type_id,
      typeName: infrastructureData.type_name,
      landId: infrastructureData.land_id,
      landName: infrastructureData.land_name,
      buildYear: infrastructureData.build_year,
      images: infrastructureData.images || []
    };
    
    const newInfrastructure = await mockDataService.createInfrastructure(formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: newInfrastructure
    });
  } catch (error) {
    console.error('Failed to create infrastructure:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to create infrastructure',
      data: null
    });
  }
};

export const updateInfrastructure = async (infrastructureId, infrastructureData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...infrastructureData,
      farmId: infrastructureData.farm_id,
      farmName: infrastructureData.farm_name,
      typeId: infrastructureData.type_id,
      typeName: infrastructureData.type_name,
      landId: infrastructureData.land_id,
      landName: infrastructureData.land_name,
      buildYear: infrastructureData.build_year,
      updateTime: new Date().toISOString()
    };
    
    const updatedInfrastructure = await mockDataService.updateInfrastructure(infrastructureId, formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: updatedInfrastructure
    });
  } catch (error) {
    console.error('Failed to update infrastructure:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update infrastructure',
      data: null
    });
  }
};

export const deleteInfrastructure = async (infrastructureId) => {
  try {
    const result = await mockDataService.deleteInfrastructure(infrastructureId);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to delete infrastructure:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to delete infrastructure',
      data: null
    });
  }
};

// Infrastructure type related API
export const getInfrastructureTypes = async () => {
  try {
    const result = await mockDataService.getInfrastructureTypes();
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get infrastructure types:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get infrastructure types',
      data: []
    });
  }
};

// Infrastructure status related API
export const getInfrastructureStatuses = async () => {
  try {
    const result = await mockDataService.getInfrastructureStatuses();
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get infrastructure statuses:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get infrastructure statuses',
      data: []
    });
  }
};

// Land plot related API
export const getLandAreas = async (farmId = null) => {
  try {
    const result = await mockDataService.getLandAreas({ farmId });
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to get land plot information:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to get land plot information',
      data: []
    });
  }
};

export const updateLand = async (landId, landData) => {
  try {
    // Convert to camelCase naming convention
    const formattedData = {
      ...landData,
      farmId: landData.farm_id,
      updateTime: new Date().toISOString()
    };
    
    const updatedLand = await mockDataService.updateLandPlot(landId, formattedData);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: updatedLand
    });
  } catch (error) {
    console.error('Failed to update land plot:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to update land plot',
      data: null
    });
  }
};

export const deleteLand = async (landId) => {
  try {
    const result = await mockDataService.deleteLandPlot(landId);
    return Promise.resolve({
      code: 200,
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Failed to delete land plot:', error);
    return Promise.resolve({
      code: 500,
      message: error.message || 'Failed to delete land plot',
      data: null
    });
  }
};