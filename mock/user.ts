import { Request, Response } from 'express';

// mock tableListDataSource
const genList = (pageNo: number, pageSize: number) => {
  const tableListDataSource: API.User[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (pageNo - 1) * 10 + i;
    tableListDataSource.push({
      id: index,
      disabled: i % 6 === 0,
      href: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
      loginCount: 0,
      lastLoginTime: new Date(),
      checkEmail: true,
      nickname: '麻花',
      username: '测试',
      email: '599012428@qq.com',
      mobile: '16620981522',
      registerTime: new Date(),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function listUsers(req: Request, res: Response, u: string, b: Request) {
  const pageQuery = (b && b.body) || req.body;
  const { pageNo = 1, pageSize = 10, sorter, filter } = pageQuery;
  // console.log('listUsers pageQuery: ', pageQuery);

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

  if (pageQuery.filter) {
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
    pageSize,
    pageNo: parseInt(`${pageNo}`, 10) || 1,
  };

  return res.json({ code: 0, data: result });
}

function postUser(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => key.indexOf(item.key) === -1);
      break;
    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newUser = {
          key: tableListDataSource.length,
          href: 'https://ant.design',
          avatar: [
            'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
            'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          ][i % 2],
          name,
          owner: '曲丽丽',
          desc,
          callNo: Math.floor(Math.random() * 1000),
          status: Math.floor(Math.random() * 10) % 2,
          updatedAt: new Date(),
          createdAt: new Date(),
          progress: Math.ceil(Math.random() * 100),
        };
        tableListDataSource.unshift(newUser);
        return res.json(newUser);
      })();
      return;

    case 'update':
      (() => {
        let newUser = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.key === key) {
            newUser = { ...item, desc, name };
            return { ...item, desc, name };
          }
          return item;
        });
        return res.json(newUser);
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

function retrieve(req: Request, res: Response, u: string, b: Request) {
  const index = tableListDataSource.length - Number(req.params.id) - 1;
  if (index >= 0 && index < tableListDataSource.length) {
    const user = tableListDataSource[index];
    return res.json({ code: 0, data: user });
  }
  return res.json({ code: -1, msg: '找不到指定用户' });
}

function createUser(req: Request, res: Response, u: string, b: Request) {
  const i = Math.ceil(Math.random() * 10000);
  const newUser = {
    id: tableListDataSource.length,
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    nickname: '曲丽丽',
    blocked: false,
    registerTime: new Date(),
    lastLoginTime: new Date(),
  };
  tableListDataSource.unshift(newUser);
  return res.json({ code: 0, data: newUser });
}

function updateUser(req: Request, res: Response, u: string, b: Request) {
  const user = tableListDataSource[0];
  return res.json(user);
}

function getUserLocation(req: Request, res: Response, u: string, b: Request) {
  // console.log('getUserLocation query: ', u);
  const location = {
    latitude: 32.4627142,
    longitude: 113.9629412,
  };
  return res.json({ code: 0, data: location });
}


export default {
  'POST /api/users/list': listUsers,
  'GET /api/users/:id': retrieve,
  'POST /api/users': createUser,
  'PUT /api/users/:id': updateUser,
  'GET /api/users/:id/location': getUserLocation,
};
