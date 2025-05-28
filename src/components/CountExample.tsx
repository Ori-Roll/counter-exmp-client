import React, { useState, useEffect } from 'react';
import countSDK, { CountSDK } from '../sdk/count';
import type { CountDTO, SDKError } from '../sdk/types';
import styles from './CountExample.module.css';

// Component Props
interface CountExampleProps {
  // Optional custom SDK instance
  customSDK?: CountSDK;
}

const CountExample: React.FC<CountExampleProps> = ({ customSDK }) => {
  // Use either the provided SDK or the default one
  const sdk = customSDK || countSDK;

  // State
  const [counts, setCounts] = useState<CountDTO[]>([]);
  const [selectedCount, setSelectedCount] = useState<CountDTO | null>(null);
  const [newValue, setNewValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load counts on component mount
  useEffect(() => {
    fetchCounts();
  }, []);

  // Fetch all counts from the API
  const fetchCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCounts = await sdk.getAllCounts();
      setCounts(fetchedCounts);
      setSelectedCount(null);
    } catch (err) {
      const sdkError = err as SDKError;
      setError(sdkError.message || 'Failed to fetch counts');
      console.error('Error fetching counts:', sdkError);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single count by ID
  const fetchCountById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const count = await sdk.getCountById(id);
      setSelectedCount(count);
    } catch (err) {
      const sdkError = err as SDKError;
      setError(sdkError.message || `Failed to fetch count with ID ${id}`);
      console.error(`Error fetching count with ID ${id}:`, sdkError);
    } finally {
      setLoading(false);
    }
  };

  // Create a new count
  const createCount = async () => {
    setLoading(true);
    setError(null);
    try {
      await sdk.createCount({ value: newValue });
      setNewValue(0);
      fetchCounts(); // Refresh the list after creating
    } catch (err) {
      const sdkError = err as SDKError;
      setError(sdkError.message || 'Failed to create count');
      console.error('Error creating count:', sdkError);
    } finally {
      setLoading(false);
    }
  };

  // Update a count
  const updateCount = async () => {
    if (!selectedCount) return;

    setLoading(true);
    setError(null);
    try {
      await sdk.updateCount(selectedCount.id, { value: newValue });
      fetchCounts(); // Refresh the list after updating
    } catch (err) {
      const sdkError = err as SDKError;
      setError(
        sdkError.message || `Failed to update count with ID ${selectedCount.id}`
      );
      console.error(
        `Error updating count with ID ${selectedCount.id}:`,
        sdkError
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a count
  const deleteCount = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await sdk.deleteCount(id);
      fetchCounts(); // Refresh the list after deleting
    } catch (err) {
      const sdkError = err as SDKError;
      setError(sdkError.message || `Failed to delete count with ID ${id}`);
      console.error(`Error deleting count with ID ${id}:`, sdkError);
    } finally {
      setLoading(false);
    }
  };

  // Increment a count
  const incrementCount = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await sdk.incrementCount(id);
      fetchCounts(); // Refresh the list after incrementing
    } catch (err) {
      const sdkError = err as SDKError;
      setError(sdkError.message || `Failed to increment count with ID ${id}`);
      console.error(`Error incrementing count with ID ${id}:`, sdkError);
    } finally {
      setLoading(false);
    }
  };

  // Decrement a count
  const decrementCount = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await sdk.decrementCount(id);
      fetchCounts(); // Refresh the list after decrementing
    } catch (err) {
      const sdkError = err as SDKError;
      setError(sdkError.message || `Failed to decrement count with ID ${id}`);
      console.error(`Error decrementing count with ID ${id}:`, sdkError);
    } finally {
      setLoading(false);
    }
  };

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
