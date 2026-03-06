import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

// Mock PaymentButton component for eSewa
const PaymentButton = ({ amount, onSuccess, onFailure }: { amount: number; onSuccess: () => void; onFailure: () => void }) => {
  const handlePayment = async () => {
    try {
      // Mock eSewa payment
      await new Promise(resolve => setTimeout(resolve, 100));
      onSuccess();
    } catch (error) {
      onFailure();
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay {amount} with eSewa
    </button>
  );
};

describe('Payment Button Component', () => {
  test('renders payment button with amount', () => {
    render(<PaymentButton amount={100} onSuccess={() => {}} onFailure={() => {}} />);
    expect(screen.getByText('Pay 100 with eSewa')).toBeInTheDocument();
  });

  test('calls onSuccess on successful payment', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();

    render(<PaymentButton amount={100} onSuccess={mockOnSuccess} onFailure={() => {}} />);

    const button = screen.getByText('Pay 100 with eSewa');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });
});