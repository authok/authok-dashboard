import React from 'react';
import { createListActions, SchemaList, ListLifeCycleTypes } from '@alist/antd';
import 'antd/dist/antd.css';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import request from 'umi-request';
import { message } from 'antd';
import useConfig from '@/hooks/useConfig';

interface ModelListProps {
  location?: any;
  match?: any;
}

const ModalList: React.FC<ModelListProps> = ({ match }) => {
  const {
    params: { model },
    pageSize = 10,
  } = match;

  const actions = createListActions();

  const effects = ($, actions) => {
    $(ListLifeCycleTypes.ON_LIST_SORT).subscribe((payload) => {
      console.log('ON_LIST_SORT', payload);
    });

    $(ListLifeCycleTypes.ON_LIST_ERROR).subscribe((payload) => {
      console.log('ON_LIST_ERROR', payload);
      message.error(payload);
    });
  };

  const customQuery = async (opts) => {
    const { data, url, method } = opts;
    const { currentPage } = data;

    const d = await request(url);
    if (d.code !== 0) {
      // show error
      message.error(d.msg);
      return;
    }

    const page = d.data;

    return {
      dataList: page.items,
      pageSize,
      total: page.total,
      totalPages: (page.total + pageSize - 1) / pageSize,
      currentPage,
    };
  };

  const funcRegistry = {
    renderOper: (val, index, record) => {
      return <div>操作</div>;
    },
    onSelectChange: (ids, records) => {
      console.log('onSelectChange', ids, records);
    },
    customQuery,
  };

  const key = `${model}.list`;
  const schema = useConfig(model, key);
  console.log('schema', schema);

  return (
    <PageHeaderWrapper>
      {schema && (
        <SchemaList
          actions={actions}
          effects={effects}
          funcRegistry={funcRegistry}
          schema={schema}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default ModalList;
