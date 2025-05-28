import { useState, useEffect } from 'react';
import countSDK from '../sdk/count';
import type { CountDTO, SDKError } from '../sdk/types';
import type { CountSDK } from '../sdk/count';

export const useCountApi = (customSDK?: CountSDK) => {
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

  return {
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
  };
};
