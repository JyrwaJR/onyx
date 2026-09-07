import React from 'react';

type Props = {
  condition: boolean;
  truthy: React.ReactNode;
  falsy: React.ReactNode;
};

export const Ternary = ({ condition, truthy, falsy }: Props) => {
  return condition ? truthy : falsy;
};
