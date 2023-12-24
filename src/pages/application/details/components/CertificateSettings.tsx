import React, { useCallback } from 'react';
import { ProFormGroup, ProFormSelect, ProFormTextArea, ProFormText } from '@ant-design/pro-form';
import ClipboardButton from '@/components/ClipboardButton';
import useClipboard from '@/hooks/useClipboard';

interface CertificateSettingsProps {
  signingKey?: API.SigningKey;
}

const CertificateSettings: React.FC<CertificateSettingsProps> = ({ signingKey }) => {
  const { ref: certRef, copy: copyCert } = useClipboard();
  const { ref: fingerprintRef, copy: copyFingerprint } = useClipboard();

  const fingerprint = '38:44:22';

  const handleDownload = useCallback((v) => {
    switch(v) {
      case 'cer': {
        break;
      }
      case 'pem': {
        break;
      } 
      case 'pcsk8': {
        break;
      }
    }
  }, [fingerprint]);

  return <>
    {
      signingKey ? (
      <ProFormGroup direction="vertical">
        <ProFormTextArea 
          width="xl"
          rows={8}
          label="签名证书"
          value={signingKey.cert}
          disabled
          fieldProps={{
            ref: certRef,
            suffix: (<ClipboardButton onCopy={()=> copyCert(certRef.current?.input?.value)} />),
          }}
        />
        <ProFormText
          width="xl"
          label="签名证书指纹(Fingerprint)"
          value={fingerprint}
          disabled
          fieldProps={{
            ref: fingerprintRef,
            suffix: (<ClipboardButton onCopy={()=> copyFingerprint(fingerprintRef.current?.input?.value)} />),
          }}
        />
        <ProFormText
          width="xl"
          label="签名证书指纹(Thumbprint)"
          disabled
          value={fingerprint}
          fieldProps={{
            ref: fingerprintRef,
            suffix: (<ClipboardButton onCopy={()=> copyFingerprint(fingerprintRef.current?.input?.value)} />),
          }}
        />
        <ProFormSelect 
          onChange={handleDownload}
          fieldProps={{
            defaultValue: ''
          }}
          options={[
            {
              label: '下载证书',
              value: '',
            },
            {
              label: 'CER',
              value: 'cer',
            },
            {
              label: 'PEM',
              value: 'pem',
            },
            {
              label: 'PKCS#8',
              value: 'pkcs8',
            }
          ]}
        />
      </ProFormGroup>) : undefined
    }
  </>;
};

export default CertificateSettings;