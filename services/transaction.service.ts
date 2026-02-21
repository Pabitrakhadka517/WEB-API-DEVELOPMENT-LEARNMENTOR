
import api from './api';

export interface Transaction {
    _id: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    currency: string;
    transactionId?: string;
    createdAt: string;
    sender?: {
        _id: string;
        name: string;
    };
    receiver?: {
        _id: string;
        name: string;
    };
}

export const transactionService = {
    /**
     * Initialize a transaction for a specific job/booking
     */
    initTransaction: async (jobId: string): Promise<{ success: boolean; transaction: Transaction }> => {
        const response = await api.get(`/transactions/jobs/transaction/${jobId}`);
        return response.data;
    },

    /**
     * Process payment for a transaction
     */
    payTransaction: async (transactionId: string, paymentMethod: string): Promise<{ success: boolean; transaction: Transaction }> => {
        const response = await api.post(`/transactions/jobs/transaction/${transactionId}/pay`, { paymentMethod });
        return response.data;
    },

    /**
     * Get sent transactions (Student)
     */
    getSentTransactions: async (): Promise<{ success: boolean; transactions: Transaction[] }> => {
        const response = await api.get('/transactions/transactions/sent');
        return response.data;
    },

    /**
     * Get received transactions (Tutor)
     */
    getReceivedTransactions: async (): Promise<{ success: boolean; transactions: Transaction[] }> => {
        const response = await api.get('/transactions/transactions/received');
        return response.data;
    }
};
