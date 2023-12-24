import React, { useState, useCallback } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import { Tooltip } from 'antd';

interface ClipboardButtonProps {
  onCopy: () => Promise<void>;
}

const ClipboardButton: React.FC<ClipboardButtonProps> = ({ onCopy, }) => {
  const [title, setTitle] = useState<string>(formatMessage({ id: 'component.clipboard.clickToCopy' }));

  const handleVisibleChange = useCallback((visible) => {
    if (visible) setTitle(formatMessage({ id: 'component.clipboard.clickToCopy' }));
  }, []);

  return (
    <Tooltip title={title} onVisibleChange={handleVisibleChange}>
      <CopyOutlined onClick={() => {
        onCopy().then(() => {
          setTitle(formatMessage({ id: 'component.clipboard.copied' }));
        });
      }} />
    </Tooltip>
  );
};

export default ClipboardButton;