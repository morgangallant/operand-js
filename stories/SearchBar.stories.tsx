import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SearchBar, SearchBarProps } from '../src';

const meta: Meta = {
  title: 'SearchBar',
  component: SearchBar,
  argTypes: {
    apiKey: {
      control: {
        type: 'text',
      },
    },
    setId: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<SearchBarProps> = (args) => <SearchBar {...args} />;

export const Default = Template.bind({});

Default.args = {};
