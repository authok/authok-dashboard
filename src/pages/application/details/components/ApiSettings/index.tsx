import React, { useMemo, useCallback } from 'react';
import ProList from '@ant-design/pro-list';
import { formatProTablePagination } from '@/utils/formatter';
import { Space, Typography, Switch, Row } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
const { Text } = Typography;
import classNames from 'classnames';
import * as _ from 'lodash';
import { Link } from 'umi';
import ClientGrantBlock from '@/components/ClientGrantBlock';
import { useResourceCreate, useResourcePagination, useResourceDelete } from '@/hooks/useResource';
import { ClientGrantEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { ResourceServerEntity } from '@/api/entities/resource-server.entity';
import { formatPath } from '@/utils/link.utils';

interface ApiSettingsProps {
  application: API.Application;
  refresh?: () => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({ application, refresh }) => {
  const { run: paginate } = useResourcePagination(ResourceServerEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const { data: clientGrants  } = useResourcePagination(ClientGrantEntity, {
    manual: false,
    formatResult: (page: API.Page<API.ClientGrant>) => page.items,
    defaultParams: [{
      client_id: application.client_id,
      page_size: 1000,
    }],
    refreshDeps: [application],
  });

  const { run: createClientGrant } = useResourceCreate(ClientGrantEntity);

  const { run: deleteClientGrant } = useResourceDelete(ClientGrantEntity);

  const audience2clientGrant = useMemo(() => _.keyBy(clientGrants, 'audience'), [clientGrants]);

  const handleCreateClientGrant = useCallback(async (clientGrant: API.ClientGrant) => {
    await createClientGrant(clientGrant);
    refresh?.();

    return true;
  }, [clientGrants]);

  const handleDeleteClientGrant = useCallback(async (id: string) => {
    await deleteClientGrant(id);
    refresh?.();

    return true;
  }, [clientGrants]);

  const handleGrantChanged = (resourceServer: API.ResourceServer, clientGrant?: API.ClientGrant) => (e: boolean) => {
    if (e) {
      handleCreateClientGrant({
        audience: resourceServer.identifier,
        client_id: application.client_id,
      });
    } else {
      handleDeleteClientGrant(clientGrant.id);
    }
  }

  return <>
    <ProList<API.ResourceServer>
      rowKey="id"
      pagination={{
        pageSize: 20,
      }}
      request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
      renderItem={(row, index, dom) => {
        const clientGrant = audience2clientGrant[row.identifier]
        
        return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div className="ant-list-item ant-pro-list-row" style={{ width: '100%', cursor: 'auto' }}>
            <div className="ant-pro-list-row-header">
              <div className="ant-list-item-meta">
                <div className="ant-list-item-meta-content">
                  <h4 className="ant-list-item-meta-title">
                    <div className="ant-pro-list-row-header-title">
                      <div className="ant-pro-list-row-title"><Link to={formatPath(`/app/apis/${row.id}`)}>{row.name}</Link></div>
                    </div>
                  </h4>
                  <div className="ant-list-item-meta-description">
                    <div className="ant-pro-list-row-description">
                      Identifier: <Text code>{row.identifier}</Text>                
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul className="ant-list-item-action">
              <li>
                <Row justify="end" style={{ height: '100%' }}>
                  <Space direction="horizontal" size="middle">
                    <span>{ !!clientGrant ? '已授权' : '未授权' }</span>
                    <Switch checked={!!clientGrant} onChange={handleGrantChanged(row, clientGrant)}/>
                    <div style={{ width: 32 }}>
                    {
                      !!clientGrant && <span
                        className={classNames('ant-pro-list-row-expand-icon')}
                        style={{ cursor: 'pointer' }}
                        onClick={(event) => {
                          dom.props.onExpand(!dom.props.expand);
                          event.stopPropagation();
                        }}
                      >
                        {dom.props.expand ? <UpOutlined /> : <DownOutlined />}
                      </span>
                    }
                    </div>
                  </Space>
                </Row>
              </li>
            </ul>
          </div>
          { clientGrant && dom.props.expand && <ClientGrantBlock clientGrant={clientGrant} resourceServer={row} refresh={refresh} />
          }
        </Space>);
      }}
    />
  </>;
};

export default ApiSettings;