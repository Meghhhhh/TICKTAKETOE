import React from 'react';
import styles from '../module/dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.content}>
        <div className={styles.grid}>
          {/* Total Earnings Card */}
          <div className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.icon}>
                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd"></path>
                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Total Earnings</p>
              <h4 className={styles.cardValue}>₹10,000</h4>
            </div>
            <div className={styles.cardFooter}>
              <p className={styles.cardStats}>
                <strong className={styles.cardStatsGreen}>+55%</strong>&nbsp;than last month
              </p>
            </div>
          </div>
          
          {/* Today's Views Card */}
          <div className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.cardIconPink}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.icon}>
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Today's Views</p>
              <h4 className={styles.cardValue}>2,300</h4>
            </div>
            <div className={styles.cardFooter}>
              <p className={styles.cardStats}>
                <strong className={styles.cardStatsGreen}>+3%</strong>&nbsp;than yesterday
              </p>
            </div>
          </div>
          
          {/* Total Views Card */}
          <div className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.cardIconGreen}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.icon}>
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Total Views</p>
              <h4 className={styles.cardValue}>3,462</h4>
            </div>
            <div className={styles.cardFooter}>
              <p className={styles.cardStats}>
                <strong className={styles.cardStatsRed}>-2%</strong>&nbsp;than yesterday
              </p>
            </div>
          </div>
          
          {/* Resources Posted Card */}
          <div className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.cardIconOrange}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.icon}>
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardLabel}>Resources Posted</p>
              <h4 className={styles.cardValue}>103,430</h4>
            </div>
            <div className={styles.cardFooter}>
              <p className={styles.cardStats}>
                <strong className={styles.cardStatsGreen}>+5%</strong>&nbsp;than last month
              </p>
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div>
              <h6 className={styles.tableTitle}>Resources</h6>
              <p className={styles.tableSubtitle}>
                <svg className={styles.tableIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                </svg>
                <p><strong>30 posted</strong> this month</p>
              </p>
            </div>
            <button className={styles.tableMenuBtn} type="button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currenColor" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" aria-hidden="true" className={styles.menuIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"></path>
              </svg>
            </button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Earnings</th>
                  <th>Revenue %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Introduction to ML</td>
                  <td>₹5,000</td>
                  <td>
                    <div className={styles.progress}>
                      <p className={styles.progressValue}>50%</p>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: '50%'}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Front-end development</td>
                  <td>₹3,000</td>
                  <td>
                    <div className={styles.progress}>
                      <p className={styles.progressValue}>30%</p>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: '30%'}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Java programming</td>
                  <td>₹100</td>
                  <td>
                    <div className={styles.progress}>
                      <p className={styles.progressValue}>1%</p>
                      <div className={styles.progressBar}>
                        <div className={`${styles.progressFill} ${styles.progressFillGreen}`} style={{width: '1%'}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Backend development</td>
                  <td>₹150</td>
                  <td>
                    <div className={styles.progress}>
                      <p className={styles.progressValue}>1.5%</p>
                      <div className={styles.progressBar}>
                        <div className={`${styles.progressFill} ${styles.progressFillGreen}`} style={{width: '1.5%'}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Introduction to AI</td>
                  <td>₹1,750</td>
                  <td>
                    <div className={styles.progress}>
                      <p className={styles.progressValue}>17.5%</p>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: '17.5%'}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;