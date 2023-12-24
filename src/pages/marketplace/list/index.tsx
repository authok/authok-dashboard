import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useMarketplaceCatalogSearch } from '@/hooks/marketplace-catalog';
import StandardFormRow from '../components/StandardFormRow';
import TagSelect from '../components/TagSelect';
import { Radio, Avatar, Card, List, Form } from 'antd';
import { formatPageQuery } from '@/utils/utils';
import { formatFormTablePagination } from '@/utils/formatter';
import { Link } from 'umi';
import { formatPath } from '@/utils/link.utils';
import useFormList from '@/hooks/useFormList';
import { PaginatedParams } from '@umijs/hooks/lib/useFormTable';

const MarketplaceListPage: React.FC = () => {
  const { run: _fetchCatalogs, data: catalogPage } = useMarketplaceCatalogSearch({
    manual: true,
  } as any);

  const [form] = Form.useForm();
  
  const fetchCatalogs = async (params: PaginatedParams[0], formData: Object): Promise<{ list: API.Catalog[]; total: number; }> => {
    const data = form.getFieldsValue();
    Object.entries(data).forEach(([key, value]) => {
      params[key] = value;
    });

    const query = formatPageQuery(params);
    return await _fetchCatalogs(query);
  };

  const { listProps, search } = useFormList(fetchCatalogs, {
    form,
    formatResult: (page: API.Page<API.Catalog>) => formatFormTablePagination<API.Catalog>(page),
    defaultPageSize: 30,
  });
  const { submit } = search;
  
  return <PageContainer className="page-middle">
    <Card bordered={false} style={{ marginBottom: 24 }}>
      <Form form={form} onValuesChange={(v) => {
        console.log('vv: ', v, form.getFieldsValue());
        submit()
      }} layout="inline">
        <StandardFormRow title={"分类"} block style={{ paddingBottom: 8 }}>
          <Form.Item name="category" noStyle>
            <TagSelect onChange={() => form.setFieldsValue({ feature: '' })}>
              {catalogPage?.meta?.categories.map(it => <TagSelect.Option key={it.category.slug} value={it.category.slug}>{it.category.name}</TagSelect.Option>)}
            </TagSelect>
          </Form.Item>
        </StandardFormRow>
        <StandardFormRow title="功能">
          <Form.Item name="feature" noStyle>
            <Radio.Group defaultValue="" buttonStyle="solid">
              <Radio.Button value="">全部</Radio.Button>
              {catalogPage?.meta?.features.map(it => <Radio.Button key={it.feature.slug} value={it.feature.slug}>{it.feature.name}({it.count})</Radio.Button>)}
            </Radio.Group>
          </Form.Item>
        </StandardFormRow>
      </Form>
    </Card>
    <List<API.Catalog>
      rowKey="id"
      {...listProps}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
        xxl: 3,
      }}
      renderItem={(item: API.Catalog) => (
        <List.Item key={item.id}>
          <Link to={formatPath(`/marketplace/${item.slug}`)}>
            <Card
              hoverable
              bodyStyle={{ paddingBottom: 20 }}
              actions={[
              ]}
            >
              <Card.Meta avatar={<Avatar size="default" src={item.icon} />} title={item.metaTitle} description={item.metaDescription}/>
            </Card>
          </Link>
        </List.Item>
      )}
    />
  </PageContainer>
};

export default MarketplaceListPage;