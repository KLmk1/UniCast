import React, { useState } from 'react';
import styles from './notfoundpage.module.scss';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className={styles.allpage}>
        <div className={styles.errortitle}>      
            <nav>
                <Link to="/">
                    This page does not founded
                    (click here to go mainpage)
                </Link>
            </nav>
        </div>
    </div>
  );
};

export default NotFoundPage;
