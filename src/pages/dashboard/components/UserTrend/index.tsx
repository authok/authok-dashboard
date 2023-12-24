import React, { useState } from 'react';
import { Line } from '@ant-design/plots';
import { Space, Card, Radio, DatePicker } from 'antd';
import { useStats } from '@/hooks/stats';
const { RangePicker } = DatePicker;

export default function() {
  const [period, setPeriod] = useState<string>('day');
  const [dates, setDates] = useState<string[]>();

  const { data = [], loading } = useStats({
    defaultParams: [
      'user.created',
      {
        period,
        ...(!!dates && { begin_time: dates[0] }),
        ...(!!dates && { end_time: dates[1] }),
      }
    ],
    refreshDeps: [period, dates],
  } as any);

  const config = {
    data,
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: {
      tickCount: 5,
    },
  };

  return <Card loading={loading} title="用户趋势图" extra={
    <Space>
      <Radio.Group value={period} onChange={(e) => setPeriod(e.target.value)}>
        <Radio.Button value="daily">日</Radio.Button>
        <Radio.Button value="weekly">周</Radio.Button>
        <Radio.Button value="monthly">月</Radio.Button>
      </Radio.Group>
      <RangePicker picker={period} onChange={(dates, dateStrings) => setDates(dateStrings)}/>
    </Space>
  }>
    <Line {...config} />
  </Card>;
}