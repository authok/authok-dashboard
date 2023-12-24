import React, { useMemo } from 'react';
import { Card, Spin, Row, Alert } from 'antd';
import { NavigationControl, Map, Marker, InfoWindow } from 'react-bmap';
import { useUserLogPagination } from '@/hooks/user';
import * as _ from 'lodash';

interface UserLocationProps {
  user: API.User;
}

const UserLocation: React.FC<UserLocationProps> = ({ user }) => {
  const { data: loginHistory, loading } = useUserLogPagination<API.Log[], API.Log[]>(user.user_id, {
    defaultParams: [{
      type: 'login',
      first: 3,
    }],
    formatResult: (page: API.CursorResult<API.Log>): API.Log[] => page.data.map(it => it.node),
  });

  const defaultLoc = { lng: 116.402544, lat: 39.928216 };
  
  const loc = useMemo(() => {
    if (!loginHistory || loginHistory.length === 0) return undefined;

    const loc = loginHistory[0].location;
    if (!loc) {
      return undefined;
    }

    return { lng: loc.longitude, lat: loc.latitude }    
  }, [loginHistory]);

  return <Card bordered={false}>
    <Spin spinning={!loc} indicator={(!loading && !loc) ? <></> : true} tip={!loading && !loc && (<Row justify="center"><Alert style={{ width: 360 }} type="info" showIcon description="用户暂无GPS访问轨迹" /></Row>)}>
      <Map style={{ width: '100%', height: '700px' }} center={loc || defaultLoc} zoom="15" enableScrollWheelZoom enableContinuousZoom>
        <NavigationControl />
        {loginHistory?.map(it => {
          const loc = it.location;
          if (loc) {
            return (<>
              <Marker position={{ lng: it.location_info?.longitude, lat: it.location?.latitude }} />
              <InfoWindow position={{ lng: it.location_info?.longitude, lat: it.location?.latitude }} text={user.nickname} title={user.nickname} />
            </>);
          }
          return undefined;
        })}
      </Map>
    </Spin>
  </Card>;
};

export default UserLocation;