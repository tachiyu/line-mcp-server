"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineMessagingClient = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
/**
 * Line Messaging API Client
 *
 * This client uses the Line Messaging API to send messages to users or groups.
 * Configuration is loaded from environment variables.
 */
class LineMessagingClient {
    /**
     * Constructor
     * Initializes the client with settings from environment variables
     * @throws Error if required environment variables are missing
     */
    constructor() {
        this.apiUrl = 'https://api.line.me/v2/bot/message/push';
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
    sendTextMessage(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // sendTextMessage関数内に追加
            console.log('Sending request with data:', {
                to,
                messages: [{ type: 'text', text: message }],
                token: this.channelAccessToken
            });
            try {
                const response = yield axios_1.default.post(this.apiUrl, {
                    to,
                    messages: [
                        {
                            type: 'text',
                            text: message
                        }
                    ]
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.channelAccessToken}`
                    }
                });
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    const status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
                    const responseData = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data;
                    console.error(`Line API Error (${status}):`, JSON.stringify(responseData, null, 2));
                    console.error('Full error response:', JSON.stringify(error.response, null, 2));
                    throw new Error(`Failed to send message: ${error.message}`);
                }
                throw error;
            }
        });
    }
    /**
     * Send multiple messages at once to a user or group
     *
     * @param to - User ID or Group ID to send the messages to
     * @param messages - Array of message objects (must follow Line Messaging API format)
     * @returns Promise with the API response
     */
    sendMessages(to, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield axios_1.default.post(this.apiUrl, {
                    to,
                    messages
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.channelAccessToken}`
                    }
                });
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    const status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
                    const responseData = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data;
                    console.error(`Line API Error (${status}):`, responseData);
                    throw new Error(`Failed to send messages: ${error.message}`);
                }
                throw error;
            }
        });
    }
    /**
     * Send an image message
     *
     * @param to - User ID or Group ID to send the message to
     * @param originalUrl - URL of the original image
     * @param previewUrl - URL of the preview image
     * @returns Promise with the API response
     */
    sendImageMessage(to, originalUrl, previewUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield axios_1.default.post(this.apiUrl, {
                    to,
                    messages: [
                        {
                            type: 'image',
                            originalContentUrl: originalUrl,
                            previewImageUrl: previewUrl
                        }
                    ]
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.channelAccessToken}`
                    }
                });
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    const status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
                    const responseData = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data;
                    console.error(`Line API Error (${status}):`, responseData);
                    throw new Error(`Failed to send image message: ${error.message}`);
                }
                throw error;
            }
        });
    }
}
exports.LineMessagingClient = LineMessagingClient;
// Usage example
function example() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lineClient = new LineMessagingClient();
            // Example: Send a text message
            const userId = process.env.LINE_USER_ID;
            if (!userId) {
                throw new Error('LINE_USER_ID environment variable is required for the example');
            }
            const result = yield lineClient.sendTextMessage(userId, 'Hello from TypeScript Line Messaging API Client!');
            console.log('Message sent successfully:', result);
            // Example: Send multiple messages
            yield lineClient.sendMessages(userId, [
                {
                    type: 'text',
                    text: 'First message'
                },
                {
                    type: 'text',
                    text: 'Second message'
                }
            ]);
        }
        catch (error) {
            console.error('Error in example:', error);
        }
    });
}
// Run the example if this file is executed directly
if (require.main === module) {
    example();
}
