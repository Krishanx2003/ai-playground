import type { Meta, StoryObj } from '@storybook/react';
import { ModelSelector } from '@/components/ModelSelector';

const meta: Meta<typeof ModelSelector> = {
  title: 'Components/ModelSelector',
  component: ModelSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockModel = {
  id: 'gpt-4-turbo',
  name: 'GPT-4 Turbo',
  provider: 'OpenAI',
  description: 'Most capable GPT-4 model with 128k context',
  maxTokens: 128000,
  category: 'chat'
};

export const Default: Story = {
  args: {
    selectedModel: null,
    onModelSelect: (model) => console.log('Selected model:', model),
  },
};

export const WithSelectedModel: Story = {
  args: {
    selectedModel: mockModel,
    onModelSelect: (model) => console.log('Selected model:', model),
  },
};

export const CustomClassName: Story = {
  args: {
    selectedModel: mockModel,
    onModelSelect: (model) => console.log('Selected model:', model),
    className: 'w-80',
  },
};