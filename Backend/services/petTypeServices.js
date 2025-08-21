const PetType = require('../models/PetType'); // Adjust path accordingly

const createPetType = async (data) => {
  try {
    return await PetType.create(data);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Pet type with this name or slug already exists.');
    }
    throw new Error('Failed to create pet type: ' + error.message);
  }
};

const getAllPetTypes = async () => {
  try {
    return await PetType.find({});
  } catch (error) {
    throw new Error('Failed to retrieve pet types: ' + error.message);
  }
};

const getPetTypeById = async (id) => {
  try {
    return await PetType.findById(id);
  } catch (error) {
    throw new Error('Failed to retrieve pet type: ' + error.message);
  }
};

const updatePetType = async (id, updateData) => {
  try {
    const updated = await PetType.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return updated;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Another pet type with this name or slug already exists.');
    }
    throw new Error('Failed to update pet type: ' + error.message);
  }
};

const deletePetType = async (id) => {
  try {
    return await PetType.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Failed to delete pet type: ' + error.message);
  }
};

module.exports = {
  createPetType,
  getAllPetTypes,
  getPetTypeById,
  updatePetType,
  deletePetType,
};
