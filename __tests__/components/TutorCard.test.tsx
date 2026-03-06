import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

// Mock TutorCard component
const TutorCard = ({ tutor, onBook }: { tutor: any; onBook: () => void }) => (
  <div>
    <h3>{tutor.name}</h3>
    <p>{tutor.subject}</p>
    <p>Rating: {tutor.rating}</p>
    <button onClick={onBook}>Book Now</button>
  </div>
);

describe('Tutor Card Component', () => {
  test('renders tutor information', () => {
    const tutor = { name: 'John Doe', subject: 'Mathematics', rating: 4.5 };
    render(<TutorCard tutor={tutor} onBook={() => {}} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Rating: 4.5')).toBeInTheDocument();
  });

  test('calls onBook when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnBook = jest.fn();
    const tutor = { name: 'John Doe', subject: 'Mathematics', rating: 4.5 };

    render(<TutorCard tutor={tutor} onBook={mockOnBook} />);

    const button = screen.getByText('Book Now');
    await user.click(button);

    expect(mockOnBook).toHaveBeenCalledTimes(1);
  });
});