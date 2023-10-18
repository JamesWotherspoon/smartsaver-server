const ScheduledTransaction = require('../models/ScheduledTransactionModel');
const scheduledTransactionService = require('../services/scheduledTransaction/retrieveScheduledTransactions');

const getScheduledTransactions = async (req, res, next) => {
  try {
    const scheduledTransactions = await scheduledTransactionService.retrieveScheduledTransactions(
      req.user.id,
      req.query,
    );

    if (scheduledTransactions.length !== 0) {
      res.status(200).json(scheduledTransactions);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed fetching scheduled transactions. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Fetch a specific scheduled transaction by ID
const getScheduledTransactionById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };
    const scheduledTransaction = await ScheduledTransaction.findOne({ where: whereClause });
    if (scheduledTransaction) {
      res.status(200).json(scheduledTransaction);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed fetching scheduled transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    next(enhancedError);
  }
};

const createScheduledTransaction = async (req, res, next) => {
  try {
    const createObj = { ...req.body, userId: req.user.id };
    const scheduledTransaction = await ScheduledTransaction.create(createObj);
    res.status(201).json(scheduledTransaction);
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed creating scheduled transaction. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Update a scheduled transaction by ID
const updateScheduledTransactionById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };

    const updated = await ScheduledTransaction.update(req.body, {
      where: whereClause,
    });

    if (updated.length) {
      res.status(200).json({ updated: true });
    } else {
      res.status(404).json({ updated: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed updating scheduled transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Delete a scheduled transaction by ID
const deleteScheduledTransactionById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };
    const deleted = await ScheduledTransaction.destroy({ where: whereClause });

    if (deleted) {
      res.status(200).json({ deleted: true });
    } else {
      res.status(404).json({ deleted: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed deleting scheduled transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

module.exports = {
  getScheduledTransactions,
  getScheduledTransactionById,
  createScheduledTransaction,
  updateScheduledTransactionById,
  deleteScheduledTransactionById,
};
