import copy from 'clipboard-copy';
import { useCallback, useRef } from 'react';
import { useToggle } from '@umijs/hooks';

function useClipboard() {
  const { state: isCopied, toggle: toggleCopied } = useToggle(false);

  const targetRef = useRef(null);

  function clipboardCopy(text) {
    return copy(text).then(() => {
      if (!isCopied) toggleCopied();
    });
  }

  function isSupported() {
    return !!(
      navigator.clipboard ||
      (document.execCommand &&
        document.queryCommandSupported &&
        document.queryCommandSupported('copy'))
    );
  }

  const copyHandler = useCallback((text?) => {
    if (typeof text === 'string') {
      return clipboardCopy(text);
    }

    if (targetRef.current) {
      return clipboardCopy(targetRef.current.value);
    }

    return Promise.resolve();
  }, []);

  return {
    isCopied,
    copy: copyHandler,
    isSupported,
    ref: targetRef,
  };
}

export default useClipboard;
