import React from 'react';
import { CountSDK } from '../sdk/count';
import styles from './CountExample.module.css';
import { useCountApi } from './useCountApi';

// Component Props
interface CountExampleProps {
  // Optional custom SDK instance
  customSDK?: CountSDK;
}

const CountExample: React.FC<CountExampleProps> = ({ customSDK }) => {
  const {
    counts,
    loading,
    error,
    createCount,
    updateCount,
    deleteCount,
    incrementCount,
    decrementCount,
    newValue,
    setNewValue,
    selectedCount,
    fetchCounts,
    setSelectedCount,
  } = useCountApi(customSDK);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Count Manager</h1>

      {/* Error Message */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Loading Indicator */}
      {loading && <div className={styles.loading}>Loading...</div>}

      {/* Create New Count Form */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Create New Count</h2>
        <div className={styles.formGroup}>
          <label htmlFor="newValue" className={styles.label}>
            Value:
          </label>
          <input
            type="number"
            id="newValue"
            className={styles.input}
            value={newValue}
            onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
          />
          <button
            className={styles.button}
            onClick={createCount}
            disabled={loading}
          >
            Create Count
          </button>
        </div>
      </div>

      {/* Update Selected Count Form */}
      {selectedCount && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Update Count</h2>
          <p>Selected Count ID: {selectedCount.id}</p>
          <p>Current Value: {selectedCount.value}</p>
          <div className={styles.formGroup}>
            <label htmlFor="updateValue" className={styles.label}>
              New Value:
            </label>
            <input
              type="number"
              id="updateValue"
              className={styles.input}
              value={newValue}
              onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
            />
            <button
              className={styles.button}
              onClick={updateCount}
              disabled={loading}
            >
              Update Count
            </button>
          </div>
        </div>
      )}

      {/* Count List */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Counts</h2>
        <button
          className={`${styles.button} ${styles.refreshButton}`}
          onClick={fetchCounts}
          disabled={loading}
        >
          Refresh Counts
        </button>

        {counts.length === 0 ? (
          <div className={styles.emptyState}>No counts found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Value</th>
                <th>Last Updated</th>
                <th className={styles.actionsCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {counts.map((count) => (
                <tr key={count.id}>
                  <td>{count.id}</td>
                  <td>{count.value}</td>
                  <td>{formatDate(count.updatedAt)}</td>
                  <td className={styles.actionsCell}>
                    <button
                      className={`${styles.button} ${styles.actionButton}`}
                      onClick={() => {
                        setSelectedCount(count);
                        setNewValue(count.value);
                      }}
                      disabled={loading}
                    >
                      Select
                    </button>
                    <button
                      className={`${styles.button} ${styles.actionButton} ${styles.incrementButton}`}
                      onClick={() => incrementCount(count.id)}
                      disabled={loading}
                    >
                      +
                    </button>
                    <button
                      className={`${styles.button} ${styles.actionButton} ${styles.decrementButton}`}
                      onClick={() => decrementCount(count.id)}
                      disabled={loading}
                    >
                      -
                    </button>
                    <button
                      className={`${styles.button} ${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => deleteCount(count.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CountExample;
