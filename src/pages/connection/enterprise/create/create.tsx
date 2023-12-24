import React, { useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Breadcrumb, Space } from 'antd';
import { history, Link } from 'umi';
import { useMarketplaceCatalogDetails } from '@/hooks/marketplace-catalog';
import Avatar from 'antd/lib/avatar/avatar';
import { ArrowLeftOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import ConnectionEditForm from '../../components/ConnectionEditForm';
import { useResourceCreate } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { formatPath } from '@/utils/link.utils';

const EnterpriseConnectionCreatePage: React.FC<any> = ({ match }) => {
  const { strategy } = match.params;

  const { data: catalog } = useMarketplaceCatalogDetails('enterprise-connections', strategy);

  const { run: create } = useResourceCreate(ConnectionEntity);

  const handleCreate = useCallback(async (data: API.Connection): Promise<boolean> => {
    const connection = { ...data, strategy };
    console.log('创建身份源', connection);
    await create(connection);

    history.push(formatPath(`/connections/enterprise`));
    return true;
  }, []);

  return (
    <PageContainer 
      pageHeaderRender={false}
      className="page-middle"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Breadcrumb style={{ color: '#65676e'}}>
            <Breadcrumb.Item>
              <Link to={formatPath('/connections/enterprise/create')}><ArrowLeftOutlined /> 选择企业身份源</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Space size="large">
            <Avatar shape="square" size={42} src={catalog?.icon} />
            <span style={{ fontSize: 32 }}><b>{catalog?.name}</b></span>
          </Space>
        </Space>
        <ConnectionEditForm strategy={strategy} onFinish={handleCreate} />
      </Space>
    </PageContainer>
  );
};

export default EnterpriseConnectionCreatePage;