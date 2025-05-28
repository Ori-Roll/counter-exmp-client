import { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { getApiClient } from './config';
import type { SDKConfig } from './config';
import type {
  CountDTO,
  CountResponse,
  CountsResponse,
  CreateCountDTO,
  SDKError,
  UpdateCountDTO,
} from './types';

/**
 * Count SDK for interacting with the count API
 */
export class CountSDK {
  private axiosInstance: AxiosInstance;
  private basePath: string = '/counts';

  /**
   * Create a new instance of the CountSDK
   * @param config Optional SDK configuration
   */
  constructor(config?: SDKConfig) {
    this.axiosInstance = getApiClient(config);
  }

  /**
   * Get all counts
   * @returns Promise resolving to an array of counts
   */
  async getAllCounts(): Promise<CountDTO[]> {
    try {
      const response = await this.axiosInstance.get<CountsResponse>(
        this.basePath
      );

      if (!response.data.success) {
        throw this.createError(
          response.data.error || 'Failed to get counts',
          response.status
        );
      }

      return response.data.data || [];
    } catch (error) {
      throw this.handleAxiosError(error as AxiosError, 'Failed to get counts');
    }
  }

  /**
   * Get a count by ID
   * @param id The count ID
   * @returns Promise resolving to a count
   */
  async getCountById(id: number): Promise<CountDTO> {
    try {
      const response = await this.axiosInstance.get<CountResponse>(
        `${this.basePath}/${id}`
      );

      if (!response.data.success) {
        throw this.createError(
          response.data.error || `Failed to get count with id ${id}`,
          response.status
        );
      }

      if (!response.data.data) {
        throw this.createError(`Count with id ${id} not found`, 404);
      }

      return response.data.data;
    } catch (error) {
      throw this.handleAxiosError(
        error as AxiosError,
        `Failed to get count with id ${id}`
      );
    }
  }

  /**
   * Create a new count
   * @param data The count data to create
   * @returns Promise resolving to the created count
   */
  async createCount(data: CreateCountDTO): Promise<CountDTO> {
    try {
      const response = await this.axiosInstance.post<CountResponse>(
        this.basePath,
        data
      );

      if (!response.data.success) {
        throw this.createError(
          response.data.error || 'Failed to create count',
          response.status
        );
      }

      if (!response.data.data) {
        throw this.createError(
          'Failed to create count - no data returned',
          500
        );
      }

      return response.data.data;
    } catch (error) {
      throw this.handleAxiosError(
        error as AxiosError,
        'Failed to create count'
      );
    }
  }

  /**
   * Update a count by ID
   * @param id The count ID
   * @param data The count data to update
   * @returns Promise resolving to the updated count
   */
  async updateCount(id: number, data: UpdateCountDTO): Promise<CountDTO> {
    try {
      const response = await this.axiosInstance.put<CountResponse>(
        `${this.basePath}/${id}`,
        data
      );

      if (!response.data.success) {
        throw this.createError(
          response.data.error || `Failed to update count with id ${id}`,
          response.status
        );
      }

      if (!response.data.data) {
        throw this.createError(`Count with id ${id} not found`, 404);
      }

      return response.data.data;
    } catch (error) {
      throw this.handleAxiosError(
        error as AxiosError,
        `Failed to update count with id ${id}`
      );
    }
  }

  /**
   * Delete a count by ID
   * @param id The count ID
   * @returns Promise resolving to the deleted count
   */
  async deleteCount(id: number): Promise<CountDTO> {
    try {
      const response = await this.axiosInstance.delete<CountResponse>(
        `${this.basePath}/${id}`
      );

      if (!response.data.success) {
        throw this.createError(
          response.data.error || `Failed to delete count with id ${id}`,
          response.status
        );
      }

      if (!response.data.data) {
        throw this.createError(`Count with id ${id} not found`, 404);
      }

      return response.data.data;
    } catch (error) {
      throw this.handleAxiosError(
        error as AxiosError,
        `Failed to delete count with id ${id}`
      );
    }
  }

  /**
   * Increment a count by ID
   * @param id The count ID
   * @returns Promise resolving to the incremented count
   */
  async incrementCount(id: number): Promise<CountDTO> {
    try {
      const response = await this.axiosInstance.patch<CountResponse>(
        `${this.basePath}/${id}/increment`
      );

      if (!response.data.success) {
        throw this.createError(
          response.data.error || `Failed to increment count with id ${id}`,
          response.status
        );
      }

      if (!response.data.data) {
        throw this.createError(`Count with id ${id} not found`, 404);
      }

      return response.data.data;
    } catch (error) {
      throw this.handleAxiosError(
        error as AxiosError,
        `Failed to increment count with id ${id}`
      );
    }
  }

  /**
   * Decrement a count by ID
   * @param id The count ID
   * @returns Promise resolving to the decremented count
   */
  async decrementCount(id: number): Promise<CountDTO> {
    try {
      const response = await this.axiosInstance.patch<CountResponse>(
        `${this.basePath}/${id}/decrement`
      );

      if (!response.data.success) {
        throw this.createError(
          response.data.error || `Failed to decrement count with id ${id}`,
          response.status
        );
      }

      if (!response.data.data) {
        throw this.createError(`Count with id ${id} not found`, 404);
      }

      return response.data.data;
    } catch (error) {
      throw this.handleAxiosError(
        error as AxiosError,
        `Failed to decrement count with id ${id}`
      );
    }
  }

  /**
   * Create a standardized SDK error
   */
  private createError(message: string, status?: number): SDKError {
    return { message, status };
  }

  /**
   * Handle Axios errors and convert them to SDK errors
   */
  private handleAxiosError(
    error: AxiosError,
    fallbackMessage: string
  ): SDKError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const responseData = error.response.data as Record<string, unknown>;
      return {
        // @ts-expect-error - error.response.data implicitly has an 'any' type so this is a local solution
        message: responseData?.error || fallbackMessage,
        status: error.response.status,
        originalError: error,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'No response received from server',
        originalError: error,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message || fallbackMessage,
        originalError: error,
      };
    }
  }
}

// Export a default instance for easy usage
const countSDK = new CountSDK();
export default countSDK;

// Also export a create function for custom configuration
export const createCountSDK = (config?: SDKConfig): CountSDK => {
  return new CountSDK(config);
};
