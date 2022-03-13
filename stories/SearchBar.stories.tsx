import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SearchBar, SearchBarProps } from '../src';

const meta: Meta = {
  title: 'SearchBar',
  component: SearchBar,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<SearchBarProps> = (args) => <SearchBar {...args} />;

export const Default = Template.bind({});

// Edit these cause its easier than using the variable arguments
Default.args = {
  apiKey: '',
  setIDs: [],
  children: <div>Click Here To Search!</div>,
  placeholderText: 'Discover something...',
  feedback: false,
  keyboardShortcut: 'cmd+k',
};
