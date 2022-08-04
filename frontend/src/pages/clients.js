import React from 'react';
import ClientsList from '../components/clients/ClientsList';

export const ClientsPage = () => {
  const CLIENTS = [
    {
      name: 'TEST CLIENT 1',
      rate: 12,
      currency: 'RON',
      unit: '2000',
      registeredOffice: 'Adresa sediului',
      registrationNumber: 'Numarul de inregistrare',
      taxNumber: 'Codul fiscal',
      bank: 'Banca clientului',
      iban: 'Contul bancar al clientului',
      email: 'Adresa@de.email',
      phone: '+40123456789',
      notes: 'Note pentru client',
      dateAdded: 'Data adaugarii',
    },
    {
      name: 'TEST CLIENT 2',
      rate: 10,
      currency: 'EUR',
      unit: '300',
      registeredOffice: 'Adresa sediului',
      registrationNumber: 'Numarul de inregistrare',
      taxNumber: 'Codul fiscal',
      bank: 'Banca clientului',
      iban: 'Contul bancar al clientului',
      email: 'Adresa@de.email',
      phone: '+40123456789',
      notes: 'Note pentru client',
      dateAdded: 'Data adaugarii',
    },
  ];
  return <ClientsList clients={CLIENTS} />;
};
