import { Request, Response } from 'express';
import { parse } from 'url';

// mock tableListDataSource
const genList = (pageNo: number, pageSize: number) => {
  const tableListDataSource: API.Group[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    tableListDataSource.push({
      id: i,
      code: `Group-${i}`,
      name: `分组名称-${i}`,
      description: `description-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function listGroups(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as API.PageQuery;

  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  let sorter = null;
  if (params != null && params.sorter != null) {
    sorter = JSON.parse(params.sorter as any);
  }

  if (sorter) {
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach((key) => {
        if (sorter[key] === 'descend') {
          if (prev[key] - next[key] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }
          return;
        }
        if (prev[key] - next[key] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }

  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return Object.keys(filter).some((key) => {
          if (!filter[key]) {
            return true;
          }
          if (filter[key].includes(`${item[key]}`)) {
            return true;
          }
          return false;
        });
      });
    }
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data.name.includes(params.name || ''));
  }
  const result = {
    items: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    pageNo: parseInt(`${params.pageNo}`, 10) || 1,
  };

  return res.json(result);
}

function postGroup(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, code, description, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => key.indexOf(item.key) === -1);
      break;
    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule = {
          id: tableListDataSource.length,
          isSystem: [true, false] % 2,
          code,
          description,
          updatedAt: new Date(),
          createdAt: new Date(),
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();
      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.key === key) {
            newRule = { ...item, desc, name };
            return { ...item, desc, name };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

const proxy = {
  'GET /api/groups/list': listGroups,
};

export default proxy;