import React, { useImperativeHandle, ReactNode, Ref } from 'react';
import { SchemaForm, createFormActions } from '@formily/antd';
import {
  Input,
  Select,
  Password,
  NumberPicker,
  Switch,
  DatePicker,
  TimePicker,
  Range,
  Upload,
  Checkbox,
  Radio,
  Rating,
  Transfer,
  FormCard,
  ArrayTable,
  ArrayCards,
} from '@formily/antd-components';
import 'antd/dist/antd.css';
import CodeEditor from '@/components/CodeEditor';
import { FormInstance } from 'antd/lib/form';
import ImgCrop from 'antd-img-crop';
import { UrlInput } from './components';

const BuiltInComponents = {
  Input,
  Select,
  TextArea: Input.TextArea,
  Password,
  NumberPicker,
  Switch,
  DatePicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  MonthPicker: DatePicker.MonthPicker,
  YearPicker: DatePicker.YearPicker,
  TimePicker,
  Range,
  Upload,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Radio,
  RadioGroup: Radio.Group,
  Rating,
  Transfer,
  ImgCrop,
};

const LayoutComponents = {
  FormCard,
};

const ArrayComponents = {
  ArrayTable,
  ArrayCards,
};

const ExtraComponents = {
  UrlInput,
  CodeEditor,
};

const components = {
  ...BuiltInComponents,
  ...LayoutComponents,
  ...ArrayComponents,
  ...ExtraComponents,
};

const actions = createFormActions();

export interface DynamicFormProps<T = Record<string, any>> {
  formRef?: Ref<Pick<FormInstance<T>, 'submit' | 'resetFields'>> | null | undefined;
  schema: any;
  value?: T;
  onFinish?: (formData: T) => Promise<boolean | void>;
  renderHeader?: (v: T | undefined) => ReactNode | undefined;
  renderFooter?: (v: T | undefined) => ReactNode | undefined;
}

export function DynamicForm<T = Record<string, any>>({
  formRef,
  schema,
  value,
  onFinish,
  renderHeader,
  renderFooter,
}: DynamicFormProps<T>) {
  useImperativeHandle(formRef, () => ({
    submit() {
      actions.submit();
    },
    resetFields() {
      actions.reset();
    },
  }));
  return (
    <>
      {renderHeader && renderHeader(value)}
      <SchemaForm
        actions={actions}
        components={components}
        schema={schema}
        value={value}
        onSubmit={onFinish}
      />
      {renderFooter && renderFooter(value)}
    </>
  );
}
