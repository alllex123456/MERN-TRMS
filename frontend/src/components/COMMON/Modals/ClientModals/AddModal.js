import React, { useState, useContext } from 'react';

import { VALIDATOR_REQUIRE } from '../../../../utilities/form-validator';

import Button from '../../UIElements/Button';
import Input from '../../FormElements/Input';
import Modal from '../../UIElements/Modal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import ErrorModal from '../MessageModals/ErrorModal';

import { useForm } from '../../../../hooks/useForm';
import { useHttpClient } from '../../../../hooks/useHttpClient';
import { AuthContext } from '../../../../context/auth-context';

import '../../CSS/modals-form.css';
import { CloudArrowDown } from 'phosphor-react';

const AddModal = (props) => {
  const { token, units, currencies } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState();
  const [formState, inputHandler, setFormData] = useForm(
    {
      avatar: { value: '', isValid: true },
      name: { value: '', isValid: false },
      translationRate: { value: '', isValid: true },
      proofreadingRate: { value: '', isValid: true },
      posteditingRate: { value: '', isValid: true },
      currency: { value: '', isValid: false },
      unit: { value: '', isValid: false },
      registeredOffice: { value: '', isValid: true },
      registrationNumber: { value: '', isValid: true },
      taxNumber: { value: '', isValid: true },
      vatPayer: { value: '', isValid: true },
      bank: { value: '', isValid: true },
      iban: { value: '', isValid: true },
      representative: { value: '', isValid: true },
      email: { value: '', isValid: true },
      phone: { value: '', isValid: true },
      notes: { value: '', isValid: true },
      invoiceDue: { value: '', isValid: true },
      decimalPoints: { value: 0, isValid: true },
    },
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  const getCompanyData = async () => {
    try {
      const responseData = await sendRequest(
        `https://infocui.ro/system/api/data/?key=92b5c3228259207f49fce773ed9694b0e3f985c8&cui=${formState.inputs.taxNumber.value}`
      );

      setFormData(
        {
          ...formState.inputs,
          name: { value: responseData.data.nume, isValid: true },
          registeredOffice: { value: responseData.data.adresa, isValid: true },
          registrationNumber: {
            value: responseData.data.cod_inmatriculare,
            isValid: true,
          },
          taxNumber: {
            value: responseData.data.cod_fiscal,
            isValid: true,
          },
          vatPayer: {
            value: responseData.data.tva === 'DA' ? true : false,
            isValid: true,
          },
          phone: { value: responseData.data.tel, isValid: true },
        },
        false
      );
    } catch (error) {}
  };

  const addHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        'http://localhost:8000/clients/add-client',
        'POST',
        JSON.stringify({
          avatar: formState.inputs.avatar.value,
          name: formState.inputs.name.value,
          translationRate: formState.inputs.translationRate.value,
          proofreadingRate: formState.inputs.proofreadingRate.value,
          posteditingRate: formState.inputs.posteditingRate.value,
          unit: formState.inputs.unit.value,
          currency: formState.inputs.currency.value,
          email: formState.inputs.email.value,
          phone: formState.inputs.phone.value,
          registeredOffice: formState.inputs.registeredOffice.value,
          registrationNumber: formState.inputs.registrationNumber.value,
          taxNumber: formState.inputs.taxNumber.value,
          vatPayer: formState.inputs.vatPayer.value,
          bank: formState.inputs.bank.value,
          iban: formState.inputs.iban.value,
          representative: formState.inputs.representative.value,
          notes: formState.inputs.notes.value,
          invoiceDue: formState.inputs.invoiceDue.value,
          decimalPoints: formState.inputs.decimalPoints.value,
        }),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );
      setSuccessMessage('Client adăugat cu succes');
      setFormData(
        {
          avatar: { value: '', isValid: true },
          name: { value: '', isValid: false },
          translationRate: { value: '', isValid: true },
          proofreadingRate: { value: '', isValid: true },
          posteditingRate: { value: '', isValid: true },
          currency: { value: '', isValid: false },
          unit: { value: '', isValid: false },
          registeredOffice: { value: '', isValid: true },
          registrationNumber: {
            value: '',
            isValid: true,
          },
          taxNumber: {
            value: '',
            isValid: true,
          },
          vatPayer: { value: '', isValid: true },
          bank: { value: '', isValid: true },
          iban: { value: '', isValid: true },
          representative: { value: '', isValid: true },
          email: { value: '', isValid: true },
          phone: { value: '', isValid: true },
          notes: { value: '', isValid: true },
          invoiceDue: { value: '', isValid: true },
          decimalPoints: { value: '', isValid: true },
        },
        false
      );
      props.refreshClients();
    } catch (error) {}
    props.refreshClients();
  };
  console.log(formState.inputs.decimalPoints.value);
  const closeModalHandler = () => {
    props.onCloseModal();
    setSuccessMessage(null);
  };

  const header = `Adaugă client nou`;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        form
        header={header}
        show={props.show}
        close={closeModalHandler}
        onSubmit={addHandler}
      >
        {isLoading && <LoadingSpinner asOverlay />}

        {!isLoading && (
          <div className="addClient">
            <div className="formGroup flexColumn">
              <div className="getCompanyData">
                <Input
                  className="input taxNumberInput"
                  label="Cod fiscal*"
                  element="input"
                  id="taxNumber"
                  type="text"
                  validators={[]}
                  defaultValue={formState.inputs.taxNumber.value}
                  defaultValidity={formState.inputs.taxNumber.isValid}
                  onInput={inputHandler}
                />
                <CloudArrowDown
                  className="getCompanyDataBtn"
                  onClick={getCompanyData}
                  size={32}
                />
              </div>
              <Input
                className="input"
                label="Nume*"
                element="input"
                id="name"
                defaultValue={formState.inputs.name.value}
                defaultValidity={formState.inputs.name.isValid}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Nu a fost introdus un nume"
                onInput={inputHandler}
              />

              <Input
                className="input"
                label="Email"
                element="input"
                id="email"
                type="email"
                validators={[]}
                defaultValue={formState.inputs.email.value}
                defaultValidity={formState.inputs.email.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="Telefon"
                element="input"
                id="phone"
                type="phone"
                validators={[]}
                defaultValue={formState.inputs.phone.value}
                defaultValidity={formState.inputs.phone.isValid}
                onInput={inputHandler}
              />

              <Input
                className="input"
                label="Moneda*"
                element="select"
                id="currency"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Nu a fost selectată moneda"
                defaultValidity={formState.inputs.currency.isValid}
                onInput={inputHandler}
              >
                <option>selectează moneda...</option>
                {currencies.map((currency, index) => (
                  <option key={index} value={currency}>
                    {currency}
                  </option>
                ))}
              </Input>

              <Input
                className="input"
                label="Unitatea de măsură*"
                element="select"
                id="unit"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Nu a fost selectată unitatea de măsură"
                defaultValue={formState.inputs.unit.value}
                defaultValidity={formState.inputs.unit.isValid}
                onInput={inputHandler}
              >
                <option>selectează unitatea...</option>
                {units.map((unit, index) => (
                  <option key={index} value={unit.value}>
                    {unit.displayedValue}
                  </option>
                ))}
              </Input>
            </div>

            <div className="formGroup flexColumn">
              <Input
                className="input"
                label="Sediul"
                element="input"
                id="registeredOffice"
                type="text"
                validators={[]}
                defaultValue={formState.inputs.registeredOffice.value}
                defaultValidity={formState.inputs.registeredOffice.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="Nr. de înregistrare"
                element="input"
                id="registrationNumber"
                type="text"
                validators={[]}
                defaultValue={formState.inputs.registrationNumber.value}
                defaultValidity={formState.inputs.registrationNumber.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="Banca"
                element="input"
                id="bank"
                type="text"
                validators={[]}
                defaultValidity={formState.inputs.bank.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="IBAN"
                element="input"
                id="iban"
                type="text"
                validators={[]}
                defaultValidity={formState.inputs.iban.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="Reprezentant legal"
                element="input"
                id="representative"
                type="text"
                validators={[]}
                defaultValidity={formState.inputs.bank.isValid}
                onInput={inputHandler}
              />
            </div>

            <div className="formGroup flexColumn">
              <Input
                className="input"
                label="Termen de plata facturi (zile)"
                element="input"
                id="invoiceDue"
                type="number"
                validators={[]}
                defaultValue={formState.inputs.invoiceDue.value}
                defaultValidity={formState.inputs.invoiceDue.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="Zecimale facturi"
                element="select"
                type="number"
                id="decimalPoints"
                validators={[]}
                defaultValue={formState.inputs.decimalPoints.value}
                defaultValidity={formState.inputs.decimalPoints.isValid}
                onInput={inputHandler}
              >
                <option value="0">0</option>
                <option value="2">2</option>
              </Input>
              <Input
                className="input"
                label="Tarif traducere"
                element="input"
                id="translationRate"
                type="number"
                step="0.01"
                validators={[]}
                defaultValue={formState.inputs.translationRate.value}
                defaultValidity={formState.inputs.translationRate.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="Tarif corectura"
                element="input"
                id="proofreadingRate"
                type="number"
                step="0.01"
                validators={[]}
                defaultValue={formState.inputs.proofreadingRate.value}
                defaultValidity={formState.inputs.proofreadingRate.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="Tarif post-editare"
                element="input"
                id="posteditingRate"
                type="number"
                step="0.01"
                validators={[]}
                defaultValue={formState.inputs.posteditingRate.value}
                defaultValidity={formState.inputs.posteditingRate.isValid}
                onInput={inputHandler}
              />
              <Input
                className="input"
                label="Note"
                element="input"
                id="notes"
                validators={[]}
                defaultValidity={formState.inputs.notes.isValid}
                onInput={inputHandler}
              />
            </div>

            <div className="formActions">
              <Button primary type="submit" disabled={!formState.isValid}>
                SALVEAZĂ
              </Button>
              {successMessage && <p className="successPar">{successMessage}</p>}
            </div>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default AddModal;
