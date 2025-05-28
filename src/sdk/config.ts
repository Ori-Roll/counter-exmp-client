import axios from 'axios';
import type { AxiosInstance } from 'axios';

/**
 * SDK Configuration options
 */
export interface SDKConfig {
  /**
   * Base URL for all API requests
   */
  baseURL: string;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Default headers to send with each request
   */
  headers?: Record<string, string>;

  /**
   * Whether to include credentials in cross-site requests
   */
  withCredentials?: boolean;
}

/**
 * Default SDK configuration
 */
export const DEFAULT_CONFIG: SDKConfig = {
  baseURL: 'http://localhost:3000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
};

/**
 * SDK Configuration manager
 */
export class SDKConfigManager {
  private static instance: SDKConfigManager;
  private config: SDKConfig;
  private axiosInstance: AxiosInstance;

  private constructor(config: SDKConfig = DEFAULT_CONFIG) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
      withCredentials: this.config.withCredentials,
    });
  }

  /**
   * Get the singleton instance of the config manager
   */
  public static getInstance(config?: SDKConfig): SDKConfigManager {
    if (!SDKConfigManager.instance) {
      SDKConfigManager.instance = new SDKConfigManager(config);
    } else if (config) {
      // Update config if provided
      SDKConfigManager.instance.updateConfig(config);
    }

    return SDKConfigManager.instance;
  }

  /**
   * Update the SDK configuration
   */
  public updateConfig(config: Partial<SDKConfig>): void {
    this.config = { ...this.config, ...config };

    // Update Axios instance with new config
    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
      withCredentials: this.config.withCredentials,
    });
  }

  /**
   * Get the current configuration
   */
  public getConfig(): SDKConfig {
    return { ...this.config };
  }

  /**
   * Get the Axios instance configured with the current settings
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

/**
 * Helper function to get the configured Axios instance
 */
export const getApiClient = (config?: SDKConfig): AxiosInstance => {
  return SDKConfigManager.getInstance(config).getAxiosInstance();
};
