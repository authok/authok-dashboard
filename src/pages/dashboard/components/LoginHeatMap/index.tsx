import React, { useMemo, useState } from 'react';
import { Heatmap, G2 } from '@ant-design/plots';
import moment from 'moment';
import { Space, Card, Row } from 'antd';
import * as _ from 'lodash';
import { useStats } from '@/hooks/stats';


G2.registerShape('polygon', 'boundary-polygon', {
  draw(cfg, container) {
    const group = container.addGroup();
    const attrs = {
      stroke: '#fff',
      lineWidth: 1,
      fill: cfg.color,
      path: [],
    };

    const points = cfg.points;
    const path = [
      ['M', points[0].x, points[0].y],
      ['L', points[1].x, points[1].y],
      ['L', points[2].x, points[2].y],
      ['L', points[3].x, points[3].y],
      ['Z'],
    ]; // @ts-ignore

    attrs.path = this.parsePath(path);
    group.addShape('path', {
      attrs,
    });

    /*
    if (cfg.data.lastWeek) {
      const linePath = [
        ['M', points[2].x, points[2].y],
        ['L', points[3].x, points[3].y],
      ]; // 最后一周的多边形添加右侧边框

      group.addShape('path', {
        attrs: {
          path: this.parsePath(linePath),
          lineWidth: 4,
          stroke: '#404040',
        },
      });

      if (cfg.data.lastDay) {
        group.addShape('path', {
          attrs: {
            path: this.parsePath([
              ['M', points[1].x, points[1].y],
              ['L', points[2].x, points[2].y],
            ]),
            lineWidth: 4,
            stroke: '#404040',
          },
        });
      }
    }
    */
    return group;
  },
});

export default function() {
  const now = new Date();
  const begin_time = moment(now).endOf('month').subtract('year', 1).add('day', 1);
  const end_time = moment(now).endOf('month').add('day', 1);

  const { data: _data } = useStats({
    defaultParams: [
      'login',
      {
        period: 'daily',
        begin_time: begin_time.format('YYYY-MM-DD'),
        end_time: end_time.format('YYYY-MM-DD'),
      },
    ]
  } as any);

  const dataMap = useMemo(() => _.keyBy(_data, (it) => it.time), [_data]);

  const data = useMemo(() => {
    const days =  end_time.diff(begin_time, 'day');

    let day = begin_time;
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = day.format('YYYY-MM-DD');
      const item = dataMap[date];

      data[i] = {
        value: item?.value || 0,
        date,
        month: day.month(),
        week: day.weeks(),
        day: day.weekday(),
        lastWeek: moment(day).endOf('week').format('YYYY-MM-DD') === moment(day).endOf('month').endOf('week').format('YYYY-MM-DD'),
        lastDay: moment(day).format('YYYY-MM-DD') === moment(day).endOf('month').format('YYYY-MM-DD'),
      };

      day = day.add('day', 1);
    }
    return data;
  }, [_data]);

  const renderHeatMap = (data: any[], index: number) => {
    const first = _.first(data);
    const m = moment(first.date);
    const month = m.month();
    const year = m.year();

    let weeks: number = Object.entries(_.groupBy(data, 'week')).length;
// console.log(`month: ${month}, weeks: ${weeks}, width: ${(weeks * 24) + (month === 0 ? 40 : 0)}`);
    
    let i = 0;

    const config = {
      data,
      width: (weeks * 24) + (index === 0 ? 40 : 0),
      height: 160,
      autoFit: false,
      xField: 'week',
      yField: 'day',
      colorField: 'value',
      reflect: 'y',
      shape: 'boundary-polygon',
      meta: {
        day: {
          type: 'cat',
          values: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        },
        week: {
          type: 'cat',
        },
        value: {
          sync: true,
        },
        date: {
          type: 'cat',
        },
      },
      yAxis: {
        grid: null,
        ...( index !== 0 && { label: false }),
      },
      tooltip: {
        title: 'date',
        showMarkers: false,
      },
      interactions: [
        {
          type: 'element-active',
        },
      ],
      xAxis: {
        position: 'top',
        tickLine: null,
        line: null,
        label: false /*{
          offset: 10,
          style: {
            fontSize: 10,
            fill: '#666',
            textBaseline: 'top',
          },
          formatter: (val, c) => {
            // console.log('formatter: ', val, c);
            if (++i === 3) {
              return `${month+1}月`;
            }

            return '';
          },
        },*/
      },
    };

    return (
      <Space direction="vertical" size={4}>
        <Heatmap key={`${year}-${month}`} {...config} />
        <Row justify="center">{`${month+1}月`}</Row>
      </Space>
    );
  };
  
  const months = [];
  let month = [];
  for (let i = 0; i < data.length; i++) {
    month.push(data[i]);
    if (data[i].lastDay) {
      months.push(month);
      month = [];
    }
  }
  
  return <Card title="登录热力图">
    <Space size={4}>{months.map((data, i) => renderHeatMap(data, i))}</Space>
  </Card>;
}