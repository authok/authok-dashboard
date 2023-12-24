import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import FlowEditor from '../components/FlowEditor';
import { CheckOutlined, UserOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { NodeData } from '../components/FlowEditor/types';
import styles from './index.less';
import { notification, Col, Row, Button, Card, Breadcrumb, Dropdown, Menu, Spin } from 'antd';
import { Link } from 'umi';
import { useTriggerBindings, useTriggerBindingsUpdate } from '@/hooks/action';
import ActionWidget from '../components/ActionWidget';
import CreateActionModal from '../components/CreateActionModal';
import { history } from 'umi';
import { useResourcePagination, useResourceCreate, useResourceDetails } from '@/hooks/useResource';
import { ActionEntity } from '@/api';
import { TriggerEntity } from '@/api/entities/trigger.entity';
import { formatPath } from '@/utils/link.utils';

const defaultNodes = {
  'post-login': [
    {
      id: 'start',
      title: '用户登录成功',
      draggable: false,
      droppable: false,
    },
    {
      id: 'end',
      title: '获得token',
      draggable: false,
      droppable: false,
    },
  ],
  'm2m': [
    {
      id: 'start',
      title: '请求token',
      draggable: false,
      droppable: false,
    },
    {
      id: 'end',
      title: '颁发token',
      draggable: false,
      droppable: false,
    },
  ],
  'pre-register': [
    {
      id: 'start',
      title: '用户注册',
      draggable: false,
      droppable: false,
    },
    {
      id: 'end',
      title: '用户注册成功',
      draggable: false,
      droppable: false,
    },
  ],
  'post-register': [
    {
      id: 'start',
      title: '用户注册成功',
      draggable: false,
      droppable: false,
    },
    {
      id: 'end',
      title: '结束',
      draggable: false,
      droppable: false,
    },
  ],
  'change-password': [
    {
      id: 'start',
      title: '密码修改成功',
      draggable: false,
      droppable: false,
    },
    {
      id: 'end',
      title: '结束',
      draggable: false,
      droppable: false,
    },
  ],
  'send-phone-message': [
    {
      id: 'start',
      title: '开始(请求发消息)',
      description: '请求发消息',
      draggable: false,
      droppable: false,
    },
    {
      id: 'end',
      title: '结束',
      description: '消息发送成功',
      draggable: false,
      droppable: false,
    },
  ],
};

const FlowDetailsPage: React.FC<any> = ({ match }) => {
  const { trigger_id } = match.params;

  const { data: trigger } = useResourceDetails(TriggerEntity, trigger_id);

  const { data: bindings, loading: loadingBindings } = useTriggerBindings(trigger_id, {
    manual: false,
    formatResult: (page: API.Page<API.TriggerBinding>) => page.items,
  } as any);

  const { run: updateTriggerBindings, loading: loadingUpdateBindings } = useTriggerBindingsUpdate();

  const { data: installedActions } = useResourcePagination(ActionEntity, {
    manual: false,
    formatResult: (page: API.Page<API.Action>) => page.items,
  });

  const { run: createAction } = useResourceCreate(ActionEntity);

  const elementDatas = useMemo(() => {
    return installedActions?.map(it => ({
      id: it.id,
      draggable: true,
      droppable: true,
      title: it.name,
      data: {
        type: 'action_id', // TODO binding_id
        value: it.id,
      },
    }));
  }, [installedActions]);

  const [items, setItems] = useState<NodeData[]>(defaultNodes[trigger_id]);

  useEffect(() => {
    if (!bindings) return;

    const nodes = bindings.map(it => ({
      id: it.id,
      draggable: true,
      droppable: true,
      title: it.display_name,
      data: {
        type: 'binding_id',
        value: it.id,
      },
    }));

    const dNodes = defaultNodes[trigger_id];
    const newItems = [];
    if (dNodes && dNodes.length > 0) {
      const [start, ...rest] = dNodes;

      newItems.push(start);
      newItems.push(...nodes);
      newItems.push(...rest);
    } else {
      newItems.push(...nodes);
    }

    setItems(newItems);
  }, [bindings])

  const handleUpdateBindings = async () => {
    const _items = items.filter(it => !!it.data)
    const bindings = _items.map((item: NodeData) => ({
      ref: item.data,
      display_name: item.title,
    }));

    const bindingsReq = {
      bindings,
    };

    await updateTriggerBindings(trigger_id, bindingsReq);

    notification.success({
      key: 'trigger-binding.update',
      message: '保存成功',
      duration: 3,
    });
  }

  const handleChanged = (value?: any[]) => {
    setItems(value);
  };

  const handleDelete = useCallback((node: NodeData, index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);

    setItems(newItems);
  }, [items]);

  const handleCreateAction = useCallback(async (value: API.Action): Promise<boolean> => {
    const action = await createAction(value);
    history.push(formatPath(`/actions/library/${action.id}`));
    return true;
  }, []);

  const dropdownBtnMenu = <Menu>
    <Menu.Item key="browse">
      浏览应用市场
    </Menu.Item>
    <CreateActionModal initialValues={{ supported_triggers: [trigger_id] }} trigger={<Menu.Item key="custom">自定义</Menu.Item>} onFinish={handleCreateAction} />
  </Menu>;

  return <PageContainer 
    className={styles.flowEditorWrapper}
    pageHeaderRender={() => <>
      <Card bordered={false}>
        <Breadcrumb>
          <Breadcrumb.Item><Link to={formatPath('/actions/flows')}><ArrowLeftOutlined /> 选择流程</Link></Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{ marginTop: 32 }}>
          <Col flex="auto">
            <h1>{trigger?.display_name}</h1>
          </Col>
          <Col flex="300px">
            <Row justify="end">
              <Button size="large" type="primary" loading={loadingUpdateBindings} onClick={handleUpdateBindings}>保存</Button>
            </Row>
          </Col>
        </Row>
      </Card>
    </>}
  >
    <Spin spinning={loadingBindings}>
      <FlowEditor 
        value={items}
        onDelete={handleDelete}
        toolbarRender={() => 
          <Dropdown.Button overlay={dropdownBtnMenu} trigger="click" icon={<PlusOutlined />} />
        }
        renderItem={(node: NodeData, index: number, isOver: boolean) => {
          console.log('renderItem: ', node, index, isOver);
          if (node.id === 'start') {
            return <TipNode title={node.title} icon={<UserOutlined style={{ color: '#fff' }} />}/>;
          } if (node.id === 'end') {
            return <TipNode title={node.title} icon={<CheckOutlined style={{ color: '#fff' }} />}/>;
          }

          return <ActionWidget title={node.title} />;
        }} 
        elements={elementDatas} 
        onChange={handleChanged}
      />
    </Spin>
  </PageContainer>
};

const TipNode = ({ title, icon }) => {
  const ref= useRef();
  return <div ref={ref} style={{ position: 'relative', width: 300, alignContent: 'center', textAlign: 'center' }}>
    <Avatar size={56} style={{ backgroundColor: '#000' }} icon={icon}></Avatar>
    <div style={{ position: 'absolute', left: 188, top: 18 }}>
      <b>{title}</b>
    </div>
  </div>;
};

export default FlowDetailsPage;