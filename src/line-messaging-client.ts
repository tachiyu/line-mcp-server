import axios from 'axios';
import dotenv from 'dotenv';
import { env } from 'process';

// Load environment variables from .env file
dotenv.config();

/**
 * Line Messaging API Client
 * 
 * This client uses the Line Messaging API to send messages to users or groups.
 * Configuration is loaded from environment variables.
 */
export class LineMessagingClient {
  private readonly channelAccessToken: string;
  private readonly apiUrl: string = 'https://api.line.me/v2/bot/message/push';
  
  /**
   * Constructor
   * Initializes the client with settings from environment variables
   * @throws Error if required environment variables are missing
   */
  constructor() {
    // Check for required environment variables
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    
    if (!token) {
      throw new Error('LINE_CHANNEL_ACCESS_TOKEN environment variable is required');
    }
    
    this.channelAccessToken = token;
  }
  
  /**
   * Send a text message to a user or group
   * 
   * @param to - User ID or Group ID to send the message to
   * @param message - Text message to send
   * @returns Promise with the API response
   */
  async sendTextMessage(to: string, message: string): Promise<any> {
    // sendTextMessage関数内に追加
    console.log('Sending request with data:', {
      to,
      messages: [{ type: 'text', text: message }],
      token: this.channelAccessToken
    });
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          to,
          messages: [
            {
              type: 'text',
              text: message
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.channelAccessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const responseData = error.response?.data;
            
            console.error(`Line API Error (${status}):`, JSON.stringify(responseData, null, 2));
            console.error('Full error response:', JSON.stringify(error.response, null, 2));
            throw new Error(`Failed to send message: ${error.message}`);
          }
      throw error;
    }
  }
  
  /**
   * Send multiple messages at once to a user or group
   * 
   * @param to - User ID or Group ID to send the messages to
   * @param messages - Array of message objects (must follow Line Messaging API format)
   * @returns Promise with the API response
   */
  async sendMessages(to: string, messages: any[]): Promise<any> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          to,
          messages
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.channelAccessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;
        
        console.error(`Line API Error (${status}):`, responseData);
        throw new Error(`Failed to send messages: ${error.message}`);
      }
      
      throw error;
    }
  }
  
  /**
   * Send an image message
   * 
   * @param to - User ID or Group ID to send the message to
   * @param originalUrl - URL of the original image
   * @param previewUrl - URL of the preview image
   * @returns Promise with the API response
   */
  async sendImageMessage(to: string, originalUrl: string, previewUrl: string): Promise<any> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          to,
          messages: [
            {
              type: 'image',
              originalContentUrl: originalUrl,
              previewImageUrl: previewUrl
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.channelAccessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;
        
        console.error(`Line API Error (${status}):`, responseData);
        throw new Error(`Failed to send image message: ${error.message}`);
      }
      
      throw error;
    }
  }
}

// Usage example
async function example() {
  try {
    const lineClient = new LineMessagingClient();
    
    // Example: Send a text message
    const userId = process.env.LINE_USER_ID;
    if (!userId) {
      throw new Error('LINE_USER_ID environment variable is required for the example');
    }
    
    const result = await lineClient.sendTextMessage(userId, 'Hello from TypeScript Line Messaging API Client!');
    console.log('Message sent successfully:', result);
    
    // Example: Send multiple messages
    await lineClient.sendMessages(userId, [
      {
        type: 'text',
        text: 'First message'
      },
      {
        type: 'text',
        text: 'Second message'
      }
    ]);
    
  } catch (error) {
    console.error('Error in example:', error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  example();
}