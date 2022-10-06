import React, { useState, useEffect } from 'react';
import { CalendarPlus, Clock } from 'phosphor-react';

import styles from './DateTime.module.css';

const DateTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div>
        {/* <CalendarPlus className={styles.dateTimeIcon} size={48} />
        <p>
          {time.toLocaleDateString('ro', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p> */}
      </div>
      <div>
        <Clock size={48} className={styles.dateTimeIcon} />
        <p>
          {time.toLocaleDateString('ro', {
            hour: 'numeric',
            minute: 'numeric',

            hour12: false,
          })}
        </p>
      </div>
    </div>
  );
};

export default DateTime;
