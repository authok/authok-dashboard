// src/access.ts
import { InitialState } from 'umi';

export default function accessFactory(initialState: InitialState) {
  return {
    'read:clients': initialState.name === 'haha',
  };
}