import CryptoJS from "crypto-js";
import api from "./api";

export interface EsewaConfig {
    amount: number;
    tax_amount: number;
    total_amount: number;
    transaction_uuid: string;
    product_code: string;
    secret: string;
    success_url: string;
    failure_url: string;
}

export const paymentService = {
    /**
     * Generate HMAC-SHA256 signature for eSewa
     */
    generateSignature: (total_amount: number, transaction_uuid: string, product_code: string, secret: string) => {
        const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const hash = CryptoJS.HmacSHA256(hashString, secret);
        return CryptoJS.enc.Base64.stringify(hash);
    },

    /**
     * Initialize transaction for a booking
     */
    initBookingTransaction: async (bookingId: string) => {
        const response = await api.get(`/transactions/bookings/transaction/${bookingId}`);
        return response.data;
    },

    /**
     * Verify payment on backend
     */
    verifyPayment: async (transactionId: string, transactionCode: string) => {
        const response = await api.post(`/transactions/bookings/transaction/${transactionId}/pay`, {
            transactionCode
        });
        return response.data;
    }
};
