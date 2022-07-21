import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../UIElements/Button';

import styles from './Modal.module.css';

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onHideModal} />;
};

const Overlay = (props) => {
  return <div className={styles.overlay}>{props.children}</div>;
};

export const Modal = (props) => {
  let modalElement;

  if (props.complete) {
    modalElement = ReactDOM.createPortal(
      <Overlay>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="editClient">Client:</label>
            <select id="editClient" ref={props.clientRef}>
              <option defaultValue={props.orderData.client}>
                {props.orderData.client}
              </option>
              <option>CLIENT</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editReceived">Data primirii:</label>
            <input
              id="editReceived"
              type="datetime"
              defaultValue={props.orderData.received}
              ref={props.receivedRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editDeadline">Termen:</label>
            <input
              id="editDeadline"
              type="datetime"
              defaultValue={props.orderData.deadline}
              ref={props.deadlineRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editRate">Tarif:</label>
            <input
              id="editRate"
              type="number"
              step="0.01"
              defaultValue={props.orderData.rate}
              ref={props.rateRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editCount">Volum final:</label>
            <input
              id="editCount"
              type="number"
              step="0.01"
              defaultValue={props.orderData.count}
              ref={props.countRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editNotes">Note:</label>
            <textarea
              id="editNotes"
              defaultValue={props.orderData.notes}
              ref={props.notesRef}
            />
          </div>
          <div className={styles.formActions}>
            <Button type="submit">FINALIZEAZĂ</Button>
            <Button type="button" danger onClick={props.onHideModal}>
              ANULEAZĂ
            </Button>
          </div>
        </form>
      </Overlay>,
      document.getElementById('modal')
    );
  }

  if (props.edit) {
    modalElement = ReactDOM.createPortal(
      <Overlay>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="editClient">Client:</label>
            <select id="editClient" ref={props.clientRef}>
              <option defaultValue={props.orderData.client}>
                {props.orderData.client}
              </option>
              <option>CLIENT</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editReceived">Data primirii:</label>
            <input
              id="editReceived"
              type="datetime"
              defaultValue={props.orderData.received}
              ref={props.receivedRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editDeadline">Termen:</label>
            <input
              id="editDeadline"
              type="datetime"
              defaultValue={props.orderData.deadline}
              ref={props.deadlineRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editRate">Tarif:</label>
            <input
              id="editRate"
              type="number"
              step="0.01"
              defaultValue={props.orderData.rate}
              ref={props.rateRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editCount">Volum estimat:</label>
            <input
              id="editCount"
              type="number"
              step="0.01"
              defaultValue={props.orderData.count}
              ref={props.countRef}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editNotes">Note:</label>
            <textarea
              id="editNotes"
              defaultValue={props.orderData.notes}
              ref={props.notesRef}
            />
          </div>
          <div className={styles.formActions}>
            <Button type="submit">SALVEAZĂ</Button>
            <Button type="button" danger onClick={props.onHideModal}>
              ANULEAZĂ
            </Button>
          </div>
        </form>
      </Overlay>,
      document.getElementById('modal')
    );
  }

  if (props.delete) {
    modalElement = ReactDOM.createPortal(
      <Overlay>
        <form>
          <h2 className="center">
            Sigur dorești să ștergi comanda pentru {props.orderData.client}?{' '}
          </h2>
          <div className={styles.formActions}>
            <Button type="submit">ȘTERGE</Button>
            <Button type="button" danger onClick={props.onHideModal}>
              ANULEAZĂ
            </Button>
          </div>
        </form>
      </Overlay>,
      document.getElementById('modal')
    );
  }

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onHideModal={props.onHideModal} />,
        document.getElementById('modal')
      )}
      {modalElement}
    </React.Fragment>
  );
};
