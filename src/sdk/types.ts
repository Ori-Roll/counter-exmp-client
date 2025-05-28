/**
 * Count data transfer object
 */
export interface CountDTO {
  id: number;
  value: number;
  updatedAt: string; // ISO date string format
}

/**
 * Request DTO for creating a new count
 */
export interface CreateCountDTO {
  value: number;
}

/**
 * Request DTO for updating a count
 */
export interface UpdateCountDTO {
  value: number;
}

/**
 * Response for single count operations
 */
export interface CountResponse {
  success: boolean;
  data?: CountDTO;
  error?: string;
}

/**
 * Response for operations returning multiple counts
 */
export interface CountsResponse {
  success: boolean;
  data?: CountDTO[];
  error?: string;
}

/**
 * Type for SDK errors
 */
export interface SDKError {
  message: string;
  status?: number;
  originalError?: unknown;
}

