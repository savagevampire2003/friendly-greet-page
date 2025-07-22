
import React from 'react';
import { parseMarkdownToHtml } from '../utils/markdownUtils';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  const formattedHtml = parseMarkdownToHtml(text);
  
  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
};

export default FormattedText;
