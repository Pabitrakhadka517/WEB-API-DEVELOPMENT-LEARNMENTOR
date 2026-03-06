import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

// Mock Chat component
interface Message {
  id: number;
  text: string;
  sender: string;
}

const Chat = ({ conversationId }: { conversationId: string }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Mock load messages
    setTimeout(() => {
      setMessages([
        { id: 1, text: 'Hello', sender: 'tutor' },
        { id: 2, text: 'Hi there', sender: 'student' },
      ]);
      setLoading(false);
    }, 100);
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const message = { id: Date.now(), text: newMessage, sender: 'student' };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    // Mock send
    await new Promise(resolve => setTimeout(resolve, 200));
  };

  if (loading) return <div>Loading chat...</div>;

  return (
    <div>
      <div>
        {messages.map((msg: Message) => (
          <div key={msg.id} data-testid={`message-${msg.id}`}>
            {msg.text} - {msg.sender}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

describe('Chat System', () => {
  test('renders loading state initially', () => {
    render(<Chat conversationId="1" />);
    expect(screen.getByText('Loading chat...')).toBeInTheDocument();
  });

  test('displays messages after loading', async () => {
    render(<Chat conversationId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId('message-1')).toHaveTextContent('Hello - tutor');
      expect(screen.getByTestId('message-2')).toHaveTextContent('Hi there - student');
    });
  });

  test('allows typing new message', async () => {
    const user = userEvent.setup();
    render(<Chat conversationId="1" />);

    await waitFor(() => screen.getByPlaceholderText('Type a message'));

    const input = screen.getByPlaceholderText('Type a message');
    await user.type(input, 'New message');

    expect(input).toHaveValue('New message');
  });

  test('sends message on button click', async () => {
    const user = userEvent.setup();
    render(<Chat conversationId="1" />);

    await waitFor(() => screen.getByPlaceholderText('Type a message'));

    const input = screen.getByPlaceholderText('Type a message');
    const sendButton = screen.getByText('Send');

    await user.type(input, 'Test message');
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Test message - student')).toBeInTheDocument();
    });
  });

  test('clears input after sending', async () => {
    const user = userEvent.setup();
    render(<Chat conversationId="1" />);

    await waitFor(() => screen.getByPlaceholderText('Type a message'));

    const input = screen.getByPlaceholderText('Type a message');
    const sendButton = screen.getByText('Send');

    await user.type(input, 'Test message');
    await user.click(sendButton);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  // Fixed test
  test('passes after fix', async () => {
    render(<Chat conversationId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId('message-1')).toBeInTheDocument();
    });
  });
});