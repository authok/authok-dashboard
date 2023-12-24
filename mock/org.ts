import { Request, Response } from 'express';

// mock tableListDataSource
const genOrgTree = () => {
  const orgs: API.Organization[] = [
    {
      id: '1',
      code: '1',
      name: '企业微信1',
      children: [
        {
          id: '101',
          code: '101',
          name: '销售部',
          children: [
            {
              id: '1011',
              code: '1011',
              name: '销售一组',
            },
          ],
        },
        {
          id: '102',
          code: '102',
          name: '运营部',
          children: [
            {
              id: '1021',
              code: '1021',
              name: '数据运营组',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      code: '2',
      name: '钉钉2',
    },
    {
      id: '3',
      code: '3',
      name: '自定义3',
    },
  ];
  return orgs;
};

const orgTree = genOrgTree();

function getOrgTree(req: Request, res: Response, u: string) {
  return res.json({ code: 0, data: orgTree });
}

function editOrg(req: Request, res: Response, u: string) {
  return new Promise((resolver, _) => {
    setTimeout(() => {
      const r = res.json({ code: 0 });
      resolver(r);
    }, 3000);
  });
}

export default {
  'GET /api/orgs/getOrgTree': getOrgTree,
  'PUT /api/orgs/:id': editOrg,
};
