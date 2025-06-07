import mongoose from 'mongoose';
import createHttpError from 'http-errors';

import { getEnvVar } from '../utils/getEnvVar.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
  updateContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);

    const { sortBy, sortOrder } = parseSortParams(req.query);

    const filter = parseFilterParams(req.query);

    const userId = req.user._id;

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts',
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'invalid contact ID');
    }

    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, contactType } = req.body;
    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(
        400,
        'Missing required fields: name, phoneNumber or contactType',
      );
    }

    const userId = req.user._id;
    const contact = await createContact(req.body, userId);

    res.status(201).json({
      status: 201,
      message: `Successfully created a contact!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'invalid contact ID');
    }

    const contact = await deleteContact(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await updateContact(contactId, req.body, {
      upsert: true,
    });

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: `Successfully upserted a contact!`,
      data: result.contact,
    });
  } catch (err) {
    next(err);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const photo = req.file;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'Invalid contact ID');
    }

    let photoUrl;

    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const result = await updateContact(
      contactId,
      { ...req.body, photo: photoUrl },
      userId,
    );

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result.contact,
    });
  } catch (err) {
    next(err);
  }
};
