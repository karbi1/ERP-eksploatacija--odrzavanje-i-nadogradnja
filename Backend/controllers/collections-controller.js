const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const CollectionName = require("../models/CollectionName");

const getCollections = async (req, res, next) => {
  let collections;
  try {
    collections = await CollectionName.find();
  } catch (err) {
    const error = new HttpError("Fetching collections failed", 500);
    return next(error);
  }
  res.json({ collections: collections });
};

const getCollectionById = async (req, res, next) => {
  const collectionId = req.params.id;

  let collection;

  try {
    collection = await CollectionName.findById(collectionId);
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (!collection) {
    const error = new HttpError(
      "Could not find a collection for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ collection: collection.toObject({ getters: true }) });
};

const createCollection = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.status(422);
    throw new HttpError("Invalid inputs passed, check data", 422);
  }

  const { seller, name, description, created } = req.body;

  const createdCollection = new CollectionName({
    seller,
    name,
    description,
    created,
  });

  if (seller !== req.userData.userId) {
    const Error = new HttpError(
      "You are not allowed to delete this collection",
      401
    );
    return next(Error);
  }

  try {
    await createdCollection.save();
  } catch (err) {
    const error = new HttpError(
      "Creating collection failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ collection: createdCollection });
};

const updateCollection = async (req, res, next) => {
  const { seller, name, description, created } = req.body;
  const collectionId = req.params.id;

  let collection;
  try {
    collection = await CollectionName.findById(collectionId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }

  if (collection.seller.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this collection",
      401
    );
    return next(error);
  }

  collection.seller = seller;
  collection.name = name;
  collection.description = description;
  collection.created = created;

  try {
    await collection.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }

  res.status(200).json({ collection: collection.toObject({ getters: true }) });
};

const deleteCollection = async (req, res, next) => {
  const collectionId = req.params.id;

  let collection;
  try {
    collection = await CollectionName.findById(collectionId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  let sellerId = collection.seller.toString();

  if (sellerId !== req.userData.userId && req.userData.role !== ROLE.ADMIN) {
    const Error = new HttpError(
      "You are not allowed to delete this collection",
      401
    );
    return next(Error);
  }

  try {
    collection.remove();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted collection" });
};

const getCollectionsBySeller = async (req, res, next) => {
  const sellerId = req.params.id;

  let collections;
  try {
    collections = await CollectionName.find({ seller: sellerId });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  res.json({ collections: collections });
};

exports.getCollectionsBySeller = getCollectionsBySeller;
exports.getCollections = getCollections;
exports.getCollectionById = getCollectionById;
exports.createCollection = createCollection;
exports.deleteCollection = deleteCollection;
exports.updateCollection = updateCollection;
