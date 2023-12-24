import React, { Suspense } from 'react';
import { GridContent, PageLoading } from '@ant-design/pro-layout';
import { Row, Col, Card, Tooltip, Space } from 'antd';
import { InfoCircleOutlined, KeyOutlined } from '@ant-design/icons';
import { ChartCard, Field } from './components/Charts';
import numeral from 'numeral';
import { TinyArea } from '@ant-design/charts';
import UserMap from './components/UserMap';
import UserTrend from './components/UserTrend';
import LoginHeatMap from './components/LoginHeatMap';
import UserLatestEventList from './components/UserLatestEventList';
import { useStats } from '@/hooks/stats';
import * as _ from 'lodash';
import CountUp from 'react-countup';
import { StatisticCard } from '@ant-design/pro-card';

const data = [
  100,120,130,100,112,222,
  333,222,333,222,111,223,
];

const iconStyle = {
  fontSize: 42,
  width: 42,
  height: 42,
};

export default function () {
  const { data: totalUsers, loading: loadingTotalUsers } = useStats({
    defaultParams: [
      'user_count', {},
    ],
    formatResult: (data: API.Metric[]) => _.first(data)?.value || 0,
  } as any);

  const { data: totalLogins, loading: loadingTotalLogins } = useStats({
    defaultParams: [
      'login', {},
    ],
    formatResult: (data: API.Metric[]) => _.first(data)?.value || 0,
  } as any);

  const { data: totalAccessTokens, loading: loadingTotalAccessTokens } = useStats({
    defaultParams: [
      'access_token', {},
    ],
    formatResult: (data: API.Metric[]) => _.first(data)?.value || 0,
  } as any);

  return <Card bordered={false} style={{ minWidth: 1280 }}>
    <GridContent>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <StatisticCard.Group bordered>
          <StatisticCard
            loading={loadingTotalUsers}
            statistic={{
              title: <b>总用户数</b>,
              valueRender: () => <CountUp
                start={0}
                end={totalUsers}
                duration={0.75}
                useEasing={true}
              />,
              icon: <img style={iconStyle} src="//cdn.authok.cn/assets/icon/user.png" alt=""/>, 
            }}
          />
          <StatisticCard
            loading={loadingTotalLogins}
            statistic={{
              title: <b>总登录数</b>,
              valueRender: () => <CountUp
                start={0}
                end={totalLogins}
                duration={0.75}
                useEasing={true}
              />,
              icon: <img style={iconStyle} src="//cdn.authok.cn/assets/icon/login.svg" alt=""/>, 
            }}
          />
          <StatisticCard
            loading={loadingTotalAccessTokens}
            statistic={{
              title: <b>总退登数</b>,
              valueRender: () => <CountUp
                start={0}
                end={totalAccessTokens}
                duration={0.75}
                useEasing={true}
              />,
              icon: <img style={iconStyle} src="//cdn.authok.cn/assets/icon/logout.svg" alt=""/>, 
            }}
          />
          <StatisticCard
            loading={loadingTotalAccessTokens}
            statistic={{
              title: '总令牌数',
              valueRender: () => <CountUp
                start={0}
                end={totalAccessTokens}
                duration={0.75}
                useEasing={true}
              />,
              icon: <KeyOutlined style={iconStyle} />, 
            }}
          />
        </StatisticCard.Group>
       
        <Row gutter={16}>
          <Col span={6}>
            <ChartCard
              bordered={true}
              title="今日新增用户"
              action={
                <Tooltip title="今日新增用户">
                  <InfoCircleOutlined />
                </Tooltip>
              }
              total={
                <CountUp
                  start={0}
                  end={8846}
                  formattingFn={(v) => numeral(v).format('0,0')}
                  duration={0.75}
                  useEasing={true}
                />
              }
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={46}
            >
              <TinyArea
                color="#975FE4"
                height={46}
                forceFit
                smooth
                data={data}
              />
            </ChartCard>
          </Col>
          <Col span={6}>
            <Suspense fallback={<PageLoading />}>
              <ChartCard
                bordered={true}
                title="今日登录用户"
                action={
                  <Tooltip title="今日登录用户">
                    <InfoCircleOutlined />
                  </Tooltip>
                }
                total={
                  <CountUp
                    start={0}
                    end={8846}
                    formattingFn={(v) => numeral(v).format('0,0')}
                    duration={0.75}
                    useEasing={true}
                  />
                }
                contentHeight={46}
              >
                <TinyArea
                  color="#975FE4"
                  height={46}
                  forceFit
                  smooth
                  data={data}
                />
              </ChartCard>
            </Suspense>
          </Col>
          <Col span={12}>
          </Col>
        </Row>
        <Suspense fallback={null}>
          <LoginHeatMap />
        </Suspense>
        <UserTrend />
        <Row gutter={16}>
          <Col flex="960px">
            <Card title="用户地理分布">
              <Suspense fallback={null}>
                <UserMap />
              </Suspense>
            </Card>
          </Col>
          <Col flex="auto">
            <Suspense fallback={null}>
              <UserLatestEventList />
            </Suspense>
          </Col>
        </Row>
      </Space>
    </GridContent>
  </Card>;
}