import { ReactNode } from "react";

export interface Node {
  id: string;
  type: string;
  draggable: boolean;
  droppable: boolean;
  data: NodeData;
}

export interface NodeData {
  id: string;
  draggable: boolean;
  droppable: boolean;
  title: string;
  data?: any;
}

export interface ElementData {
  id: string;
  title: string;
  draggable: boolean;
  droppable: boolean;
  data: any;
}

export interface Item {
  sourceIndex?: number;
  destinationIndex: number;
  source: string;
  destination: string;
  data: any;
}