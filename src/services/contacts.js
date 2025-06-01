import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = { userId };

  if (filter.contactType) {
    contactsQuery.contactType = filter.contactType;
  }
  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.isFavourite = filter.isFavourite;
  }
  if (filter.updatedAfter) {
    contactsQuery.updatedAt = {
      ...contactsQuery.updatedAt,
      $gte: filter.updatedAfter,
    };
  }
  if (filter.updatedBefore) {
    contactsQuery.updatedAt = {
      ...contactsQuery.updatedAt,
      $lte: filter.updatedBefore,
    };
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactsQuery),
    ContactsCollection.find(contactsQuery)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload, userId) => {
  return await ContactsCollection.create({ ...payload, userId });
};

export const deleteContact = async (contactId, userId) => {
  return await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );

  if (!updatedContact && options.upsert) {
    return {
      contact: updatedContact,
      isNew: true,
    };
  }

  return updatedContact ? { contact: updatedContact, isNew: false } : null;
};
