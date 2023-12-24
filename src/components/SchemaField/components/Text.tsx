import React from 'react';

const Text: React.FC<{
  value?: string
  content?: string
  mode?: "normal" | "h1" | "h2" | "h3" | "p"
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === "normal" || !mode ? "div" : mode
  return React.createElement(tagName, props, value || content)
}

export default Text;