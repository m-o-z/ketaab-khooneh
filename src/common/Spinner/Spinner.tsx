import { Spinner as TapsiSpinner } from "@tapsioss/react-components/Spinner";
import React from "react";

import styles from "./Spinner.module.scss";

const Spinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <TapsiSpinner />
      </div>
    </div>
  );
};

export default Spinner;
