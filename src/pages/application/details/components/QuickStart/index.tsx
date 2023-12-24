import React from 'react';
import { Card, Row, Col } from 'antd';
import styles from './index.less';

interface QuickStartProps {
  application: API.Application;
}

const QuickStart: React.FC<QuickStartProps> = ({ application }) => {
  console.log('quickstart');

  return <Card>
    请选择您使用的WEB技术
    <Row>
      <Col span={6}>
        <div className={styles['platform']}>
          <div data-name="angular2" className={styles['circle-logo']}>
            <div className={styles['logo']}>
            </div>
          </div>
        </div>
      </Col>
      <Col span={6}>
        <div className={styles['platform']}>
          <div data-name="react" className={styles['circle-logo']}>
            <div className={styles['logo']}>
            </div>
          </div>
        </div>
      </Col>
      <Col span={6}>
        <div className={styles['platform']}>
          <div data-name="vue" className={styles['circle-logo']}>
            <div className={styles['logo']}>
            </div>
          </div>
        </div>
      </Col>
      <Col span={6}>
        <div className={styles['platform']}>
          <div data-name="javascript" className={styles['circle-logo']}>
            <div className={styles['logo']}>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </Card>;
}

export default QuickStart;