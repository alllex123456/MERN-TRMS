import React from 'react';
import ReactDOM from 'react-dom';

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onHideModal} />;
};

const Overlay = (props) => {
  return <div className={styles.overlay}>{props.children}</div>;
};

export const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onHideModal={props.onHideModal} />,
        document.getElementById('modal')
      )}
      {ReactDOM.createPortal(
        <Overlay>{props.children}</Overlay>,
        document.getElementById('modal')
      )}
    </React.Fragment>
  );
};
