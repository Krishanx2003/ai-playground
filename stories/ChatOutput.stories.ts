import type { Meta, StoryObj } from '@storybook/react';
import { ChatOutput } from '@/components/ChatOutput';

const meta: Meta<typeof ChatOutput> = {
  title: 'Components/ChatOutput',
  component: ChatOutput,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMessages = [
  {
    id: '1',
    role: 'user' as const,
    content: 'What is the capital of France?',
    timestamp: new Date('2024-01-15T10:00:00'),
    status: 'sent' as const,
  },
  {
    id: '2',
    role: 'assistant' as const,
    content: 'The capital of France is Paris. It is the largest city in France and has been the country\'s capital since 508 AD. Paris is known for its rich history, beautiful architecture, world-class museums like the Louvre, and iconic landmarks such as the Eiffel Tower, Notre-Dame Cathedral, and the Arc de Triomphe.',
    timestamp: new Date('2024-01-15T10:00:30'),
    status: 'sent' as const,
  },
  {
    id: '3',
    role: 'user' as const,
    content: 'Can you tell me more about its history?',
    timestamp: new Date('2024-01-15T10:01:00'),
    status: 'sent' as const,
  },
];

export const Empty: Story = {
  args: {
    messages: [],
    onClear: () => console.log('Clear messages'),
    isGenerating: false,
  },
};

export const WithMessages: Story = {
  args: {
    messages: mockMessages,
    onClear: () => console.log('Clear messages'),
    isGenerating: false,
  },
};

export const Generating: Story = {
  args: {
    messages: mockMessages,
    onClear: () => console.log('Clear messages'),
    isGenerating: true,
  },
};

export const SingleMessage: Story = {
  args: {
    messages: [mockMessages[0]],
    onClear: () => console.log('Clear messages'),
    isGenerating: false,
  },
};