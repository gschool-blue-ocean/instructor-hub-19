import React, { useState, useEffect, useContext } from "react";
import styles from "./StudentsPage.module.css";
import StudentsTable from "./StudentsTable/StudentsTable";
import CohortContext from "../../../../../Context/CohortContext";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const { cohort } = useContext(CohortContext);

  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:8000/students/${cohort}`);
      const studs = await response.json();
      setStudents(studs);
    })();
    return () => {};
  }, [cohort]);

  return (
    <div className={styles["student-container"]}>
      <div className={styles["student-title"]}>Student Dashboard</div>
      <div className={styles["table-container"]}>
        <div className={styles["student-container-bar"]}>
          <div className={styles["page-header"]}>
            {`MCSP-${cohort} Students`}
          </div>
          <div className={styles["add-button-container"]}></div>
          <button className={styles["add-btn"]}>Add Student</button>
        </div>
        <StudentsTable studs={students} />
      </div>
    </div>
  );
};

export default StudentsPage;