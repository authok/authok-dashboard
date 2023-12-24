// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';

// mock tableListDataSource
const genList = (pageNo: number, pageSize: number) => {
  const tableListDataSource: API.Resource[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (pageNo - 1) * 10 + i;
    tableListDataSource.push({
      id: index,
      code: `Resource-${i}`,
      type: 'DATA',
      isDefault: [true, false][i % 2],
      description: `description-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

const tableListDataSource = genList(1, 100);

function listResources(req: Request, res: Response, u: string) {
  const pageQuery = req.body;
  const { pageNo = 1, pageSize = 10, sorter, filter } = pageQuery;

  let dataSource = [...tableListDataSource].slice(
    ((pageNo as number) - 1) * (pageSize as number),
    (pageNo as number) * (pageSize as number),
  );

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

  if (filter) {
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

  const result = {
    items: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    pageNo: parseInt(`${pageNo}`, 10) || 1,
  };

  return res.json({ code: 0, data: result });
}

export default {
  'POST /api/resources/list': listResources,
};
