import React, { useCallback } from 'react';
import { Empty, Divider, Space, Alert, Button } from 'antd';
import ConnectionList from './ConnectionList';
import { PageContainer } from '@ant-design/pro-layout';
import { useResourceDetails } from '@/hooks/useResource';
import ProSkeleton from '@ant-design/pro-skeleton';
import { Link } from 'umi';
import { formatPath } from '@/utils/link.utils';
import { OrganizationEntity } from '@/api/entities/organization.entity';

interface ConnectionSettingsProps {
  organization: API.Organization;
}

export const AddConnectionPage: React.FC<ConnectionSettingsProps> = ({ match }) => {
  const { org_id } = match.params;
  const { error, data: organization, loading, refresh } = useResourceDetails(OrganizationEntity, org_id);
  
  if (loading && !organization) {
    return <PageContainer className="page-middle"><ProSkeleton type="descriptions" error={error}/></PageContainer>;
  }

  if (!organization) {
    return <PageContainer className="page-middle">
      <Empty 
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>记录不存在</span>
        }
      >
        <Link to={formatPath('/organization')}><Button type="primary">返回</Button></Link>
      </Empty>
    </PageContainer>
  }

  return (
    <PageContainer className="page-middle">
      <ConnectionList
        organization={organization}
        params={{
          pageSize: 100,
        }}
      />
    </PageContainer>
  );
}

export default AddConnectionPage;