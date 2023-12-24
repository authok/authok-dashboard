import React, { useRef, useImperativeHandle, useCallback, Ref, forwardRef, useEffect, CSSProperties } from 'react';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { Spin } from 'antd';

export interface CodeEditorRef {
  getValue(): string;
  editor(): editor.IStandaloneCodeEditor;
}

export interface CodeEditorProps {
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
  language?: string;
  theme?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string | undefined, ev: any) => void;
  options?: Record<string, any>;
  ref?: Ref<CodeEditorRef | undefined>;
  style?: CSSProperties;
}

const CodeEditor: React.FC<CodeEditorProps> = forwardRef(({
  defaultValue,
  width,
  height,
  disabled,
  language,
  theme,
  value,
  onChange,
  options,
  style,
}, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>({});

  useImperativeHandle(ref, () => ({
    getValue: (): string  => {
      return editorRef.current?.getValue() || '';
    },
    editor: () => editorRef.current,
  }));

  useEffect(() => {
    function resizeHandler() {
      if (editorRef.current !== undefined) {
        editorRef.current.layout();
      }
    }

    if (editorRef.current !== undefined) {
      window.addEventListener('resize', resizeHandler);
      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    }

    return () => {};
  }, [editorRef.current]);

  const onMount: EditorDidMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  return (
    <Spin indicator={<></>} spinning={disabled}>
      <MonacoEditor
        style={style}
        editorDidMount={onMount}
        defaultValue={defaultValue}
        width={width}
        height={height}
        language={language}
        theme={theme}
        value={value}
        options={options}
        onChange={onChange}
      />
    </Spin>
  );
});

CodeEditor.defaultProps = {
  width: '100%',
  height: '400px',
  language: 'javascript',
  theme: 'vs-dark',
  disabled: false,
};

export default CodeEditor;
