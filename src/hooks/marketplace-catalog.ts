import { BaseOptions, OptionsWithFormat } from '@ahooksjs/use-request/lib/types';
import { useRequest } from 'umi';
import { useBackendAPI } from '@/providers/backend-api/context';
import { CatalogEntity } from '@/api/entities/catalog.entity';
import { CategoryEntity } from '@/api/entities/category.entity';
import { FeatureEntity } from '@/api/entities/feature.entity';

export const useMarketplaceCatalogPaginationByFeature = <U = any, UU extends U = any>(
  feature_slug: string,
  options?: OptionsWithFormat<API.Page<API.Catalog>, [API.PageQuery], U, UU>
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.PageQuery) => client.get(FeatureEntity).listCatalogs(feature_slug, query),
    {
      formatResult: (page: API.Page<API.Catalog>) => page as unknown as U,
      ...options,
    }
  );
}

export const useMarketplaceCatalogSearch = <U = any, UU extends U = any>(
  options?: OptionsWithFormat<API.Page<API.Catalog>, [API.PageQuery], U, UU>
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.PageQuery) => client.get(CatalogEntity).search(query),
    {
      formatResult: (page: API.Page<API.Catalog>) => page as unknown as U,
      ...options,
    }
  );
}

export const useMarketplaceCatalogDetailsBySlug = (
  slug?: string,
  options?: BaseOptions<API.Catalog, [string, string]>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (slug: string) => client.get(CatalogEntity).findBySlug(slug),
    {
      manual: false,
      defaultParams: [slug],
      formatResult: (data: API.Catalog) => data,
      ...options,
    } as any
  );
}

export const useMarketplaceCatalogDetails = (
  feature_slug: string,
  catalog_id?: string,
  options?: BaseOptions<API.Catalog, [string, string]>,
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (feature_slug: string, catalog_id: string) => client.get(FeatureEntity).findCatalog(feature_slug, catalog_id),
    {
      manual: false,
      defaultParams: [feature_slug, catalog_id],
      formatResult: (data: API.Catalog) => data,
      ...options,
    } as any
  );
}

export const useMarketplaceCategoryPagination = <U = any, UU extends U = any>(
  options?: OptionsWithFormat<API.Page<API.Category>, [API.PageQuery], U, UU>
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.PageQuery) => client.get(CategoryEntity).paginate(query),
    {
      formatResult: (page: API.Page<API.Category>) => page as unknown as U,
      ...options,
    }
  );
}

export const useMarketplaceFeaturePagination = <U = any, UU extends U = any>(
  options?: OptionsWithFormat<API.Page<API.Feature>, [API.PageQuery], U, UU>
) => {
  const { client } = useBackendAPI();
  return useRequest(
    (query: API.PageQuery) => client.get(FeatureEntity).paginate(query),
    {
      formatResult: (page: API.Page<API.Feature>) => page as unknown as U,
      ...options,
    }
  );
}