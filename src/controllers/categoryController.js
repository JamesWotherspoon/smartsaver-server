const categoryService = require('../services/categoryService');

const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    const categories = await categoryService.retrieve(userId, type);

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Fetch a specific category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const category = await categoryService.retrieveById(userId, id);

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categoryData = req.body;

    const category = await categoryService.create(userId, categoryData);

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// Update a category by ID
const updateCategoryById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const categoryData = req.body;

    await categoryService.updateById(userId, id, categoryData);

    res.status(200).json({ updated: true });
  } catch (error) {
    next(error);
  }
};

// Delete a category by ID
const deleteCategoryById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await categoryService.deleteById(userId, id);

    res.status(200).json({ deleted: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
