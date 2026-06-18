import {
  Contact,
  ContactField,
  ContactsSortOrder,
  requestPermissionsAsync,
} from 'expo-contacts';

import type { BridgeContact } from '../contracts';

const CONTACT_FIELDS = [
  ContactField.FULL_NAME,
  ContactField.PHONES,
  ContactField.EMAILS,
] as const;

export async function getContacts(limit: number): Promise<BridgeContact[]> {
  const permission = await requestPermissionsAsync();

  if (!permission.granted) {
    throw new Error('PERMISSION_DENIED');
  }

  const contacts = await Contact.getAllDetails(CONTACT_FIELDS, {
    limit,
    offset: 0,
    sortOrder: ContactsSortOrder.GivenName,
  });

  return contacts.map((contact) => ({
    id: contact.id,
    name: contact.fullName || 'Sin nombre',
    phones: contact.phones
      .filter((phone) => Boolean(phone.number))
      .map((phone) => ({
        label: phone.label ?? null,
        number: phone.number ?? '',
      })),
    emails: contact.emails
      .filter((email) => Boolean(email.address))
      .map((email) => ({
        label: email.label ?? null,
        address: email.address ?? '',
      })),
  }));
}
