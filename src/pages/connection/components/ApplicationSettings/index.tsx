import React, { useCallback } from 'react';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import { Avatar, Switch, Typography } from 'antd';
import { formatProTablePagination } from '@/utils/formatter';
import { useResourcePagination } from '@/hooks/useResource';
import { ClientEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { FormattedMessage } from 'umi';
const { Text } = Typography;

interface ApplicationSettingsProps {
  connection?: API.Connection;
  onUpdate: (connection: Partial<API.Connection>) => void;
}

const ApplicationSettings: React.FC<ApplicationSettingsProps> = ({ connection, onUpdate }) => {
  const { run: paginate } = useResourcePagination(ClientEntity, { 
    manual: true,
    formatResult: formatProTablePagination,
  });

  const handleSwitch = (client_id: string) => async (val: boolean) => {
    if (!connection) return;
    
    const clients = new Set<string>(connection?.enabled_clients);
    if (val) {
      clients.add(client_id);
    } else {
      clients.delete(client_id);
    }

    const data = { enabled_clients: Array.from(clients) };
    await onUpdate(data);
  };

  const metas: ProListMetas<API.Application> = {
    avatar: {
      // dataIndex: 'logo',
      render: (_, row) => <Avatar src={row.logo_uri} size={48} shape="square" />,
    },
    title: {
      dataIndex: 'name',
      // render: (_, row) => <h3>{row.name}</h3>,
    },
    description: {
      render: (_, row) => <FormattedMessage id={`app.settings.application.app_type.${row.app_type}`}/>,
    },
    content: {
      render: (_, row) => {
        return <p>Client ID: <Text code>{row.client_id}</Text></p>;
      },
    },
    actions: {
      render: (_, row) => [<Switch key={row.client_id} defaultChecked={connection?.enabled_clients?.some((it) => it === row.client_id)} onChange={handleSwitch(row.client_id)}/>],
    },
  };

  return (
    <ProList<API.Application>
      headerTitle="开启的应用"
      request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
      metas={metas}
      pagination={{
        pageSize: 10,
      }}
    />
  );
};

export default ApplicationSettings;