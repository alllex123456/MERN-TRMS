import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Input from '../COMMON/FormElements/Input';
import Button from '../COMMON/UIElements/Button';
import ErrorModal from '../COMMON/Modals/MessageModals/ErrorModal';
import LoadingSpinner from '../COMMON/UIElements/LoadingSpinner';

import { useForm } from '../../hooks/useForm';
import { useHttpClient } from '../../hooks/useHttpClient';
import { AuthContext } from '../../context/auth-context';
import { VALIDATOR_REQUIRE } from '../../utilities/form-validator';

import styles from './Notes.module.css';

const Notes = () => {
  const [notes, setNotes] = useState();
  const { token, language } = useContext(AuthContext);

  const { t } = useTranslation();

  const [formState, inputHandler, setFormData] = useForm(
    {
      note: { value: '', isValid: false },
    },
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  useEffect(() => {
    const getNotes = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/notes/get-notes`,
          'GET',
          null,
          { Authorization: 'Bearer ' + token, 'Accept-Language': language }
        );
        setNotes(responseData.message);
      } catch (error) {}
    };

    getNotes();
  }, [sendRequest, token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/notes/save-note`,
        'POST',
        JSON.stringify({ note: formState.inputs.note.value }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        }
      );
      setNotes((prev) => [...prev, { ...responseData.message }]);
      setFormData(
        {
          note: { value: '', isValid: false },
        },
        false
      );
    } catch (error) {}
  };

  const removeNoteBtn = async (noteId) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/notes/remove-note/${noteId}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
    } catch (error) {}
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/notes/get-notes`,
        'GET',
        null,
        { Authorization: 'Bearer ' + token, 'Accept-Language': language }
      );
      setNotes(responseData.message);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal show={error} onClear={clearError} />
      <section className={styles.notes}>
        {isLoading && <LoadingSpinner asOverlay className="center" />}
        <form className={styles.notesForm} onSubmit={submitHandler}>
          <Input
            placeholder={t('dashboard.add')}
            id="note"
            element="input"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            defaultValue={formState.inputs.note.value}
            defaultValidity={formState.inputs.note.isValid}
            onInput={inputHandler}
          />
          <Button disabled={!formState.isValid} type="submit">
            {t('buttons.saveBtn')}
          </Button>
        </form>
        <ul className={styles.notesList}>
          {notes &&
            notes.map((note) => (
              <li key={note.id} className={`${styles.notesItem}`}>
                {note.note}
                <span
                  className={styles.removeNoteBtn}
                  onClick={() => removeNoteBtn(note.id)}
                >
                  x
                </span>
              </li>
            ))}
        </ul>
      </section>
    </React.Fragment>
  );
};

export default Notes;
