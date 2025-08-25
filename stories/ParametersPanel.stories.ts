import type { Meta, StoryObj } from '@storybook/react';
import { ParametersPanel } from '@/components/ParametersPanel';

const meta: Meta<typeof ParametersPanel> = {
  title: 'Components/ParametersPanel',
  component: ParametersPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultParameters = {
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.9,
  topK: 40,
  frequencyPenalty: 0,
  presencePenalty: 0
};

export const Default: Story = {
  args: {
    parameters: defaultParameters,
    onChange: (params) => console.log('Parameters changed:', params),
  },
};

export const HighTemperature: Story = {
  args: {
    parameters: { ...defaultParameters, temperature: 1.5 },
    onChange: (params) => console.log('Parameters changed:', params),
  },
};

export const LowTemperature: Story = {
  args: {
    parameters: { ...defaultParameters, temperature: 0.1 },
    onChange: (params) => console.log('Parameters changed:', params),
  },
};

export const HighTokenLimit: Story = {
  args: {
    parameters: { ...defaultParameters, maxTokens: 4000 },
    maxTokensLimit: 8000,
    onChange: (params) => console.log('Parameters changed:', params),
  },
};