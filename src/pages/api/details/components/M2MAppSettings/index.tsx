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
import { useResourcePagination } from '@/hooks/useResource';
import { ClientEntity, ClientGrantEntity } from '@/api';
import { useResourceCreate, useResourceDelete } from '@/hooks/useResource';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';

interface M2MAppSettingsProps {
  resourceServer: API.ResourceServer;
  refresh?: () => void;
}

const M2MAppSettings: React.FC<M2MAppSettingsProps> = ({ resourceServer, refresh }) => {
  const { run: paginate } = useResourcePagination(
    ClientEntity,
    {
      manual: true,
      formatResult: formatProTablePagination,
    }
  );

  const { data: clientGrants  } = useResourcePagination(ClientGrantEntity, {
    manual: false,
    formatResult: (page: API.Page<API.ClientGrant>) => page.items,
    defaultParams: [{
      audience: resourceServer.identifier,
      page_size: 1000,
    }],
    refreshDeps: [resourceServer],
  });

  const { run: createClientGrant, loading: loadingCreate } = useResourceCreate(ClientGrantEntity);

  const { run: deleteClientGrant, loading: loadingDelete } = useResourceDelete(ClientGrantEntity);

  const client_id2clientGrant = useMemo(() => _.keyBy(clientGrants, 'client_id'), [clientGrants]);

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

  const handleGrantChanged = (application: API.Application, clientGrant?: API.ClientGrant) => (e: boolean) => {
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
    <ProList<API.Application>
      rowKey="id"
      pagination={{
        page_size: 20,
      }}
      params={{
        app_type: ['web', 'non_interactive'],
      }}
      request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
      renderItem={(row, index, dom) => {
        const clientGrant = client_id2clientGrant[row.client_id]
        
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="ant-list-item ant-pro-list-row" style={{ width: '100%', cursor: 'auto' }}>
              <div className="ant-pro-list-row-header">
                <div className="ant-list-item-meta">
                  <div className="ant-list-item-meta-content">
                    <h4 className="ant-list-item-meta-title">
                      <div className="ant-pro-list-row-header-title">
                        <div className="ant-pro-list-row-title"><Link to={formatPath(`/app/applications/${row.client_id}`)}>{row.name}</Link></div>
                      </div>
                    </h4>
                    <div className="ant-list-item-meta-description">
                      <div className="ant-pro-list-row-description">
                        Client id: <Text code>{row.client_id}</Text>                
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
            { clientGrant && dom.props.expand && <ClientGrantBlock clientGrant={clientGrant} resourceServer={resourceServer} refresh={refresh} />
            }
          </Space>
        );
      }}
    />
  </>;
};

export default M2MAppSettings;