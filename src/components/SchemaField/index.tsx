import React from 'react';

import { JSXComponent, createSchemaField } from '@formily/react'
import {
  Input,
  Select,
  Password,
  NumberPicker,
  Switch,
  DatePicker,
  TimePicker,
  Upload,
  Checkbox,
  Radio,
  Transfer,
  ArrayTable,
  ArrayCards,
  FormItem,
  FormGrid,
  FormButtonGroup,
  Submit,
} from '@formily/antd';
import 'antd/dist/antd.css';
import CodeEditor from '@/components/CodeEditor';
import ImgCrop from 'antd-img-crop';
import { UrlInput } from '../DynamicForm/components';
import * as ICONS from '@ant-design/icons'
import ScopeCheckbox from './components/ScopeCheckbox';
import CheckCardSelect from '@/components/CheckCardSelect';

// 参考: https://github.com/alibaba/formily/blob/79ab341fec37f7210456ee3bad51751b69c12c17/packages/antd/docs/components/DatePicker.zh-CN.md

const BuiltInComponents = {
  FormItem,
  Input,
  Select,
  Password,
  NumberPicker,
  Switch,
  DatePicker,
  TimePicker,
  Upload,
  Checkbox,
  Radio,
  Transfer,
  ImgCrop,
  Submit,
};

const LayoutComponents = {
  FormGrid,
  FormButtonGroup,
};

const ArrayComponents = {
  ArrayTable,
  ArrayCards,
};

const ExtraComponents = {
  UrlInput,
  CodeEditor,
  ScopeCheckbox,
  CheckCardSelect,
};

const components: Record<string, JSXComponent> = {
  ...BuiltInComponents,
  ...LayoutComponents,
  ...ArrayComponents,
  ...ExtraComponents,
};

export const SchemaField = createSchemaField({
  components,
  scope: {
    icon(name: string) {
      return React.createElement(ICONS[name]);
    },
    link(title: string, to: string) {
      return <a href={to} target="_blank">{title}</a>;
    }
  }
});

export default SchemaField