
export const parseMarkdownToHtml = (text: string): string => {
  if (!text) return '';
  
  let html = text;
  
  // Convert headers (improved hierarchy)
  html = html.replace(/#### (.*?)(?=\n|$)/g, '<h4 class="text-base font-semibold text-gray-800 mt-3 mb-2">$1</h4>');
  html = html.replace(/### (.*?)(?=\n|$)/g, '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>');
  html = html.replace(/## (.*?)(?=\n|$)/g, '<h2 class="text-xl font-bold text-gray-900 mt-5 mb-3">$1</h2>');
  html = html.replace(/# (.*?)(?=\n|$)/g, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h1>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
  
  // Convert horizontal rules
  html = html.replace(/---/g, '<hr class="border-t border-gray-300 my-4">');
  
  // Convert bullet points with better spacing
  html = html.replace(/^- (.*?)(?=\n|$)/gm, '<li class="ml-6 mb-2 text-gray-700 list-disc">$1</li>');
  
  // Convert numbered lists with better spacing
  html = html.replace(/^\d+\. (.*?)(?=\n|$)/gm, '<li class="ml-6 mb-2 text-gray-700 list-decimal">$1</li>');
  
  // Wrap consecutive list items in proper ul/ol tags
  html = html.replace(/(<li class="ml-6 mb-2 text-gray-700 list-disc">.*?<\/li>(\s|<li class="ml-6 mb-2 text-gray-700 list-disc">.*?<\/li>)*)/gs, '<ul class="my-3">$1</ul>');
  html = html.replace(/(<li class="ml-6 mb-2 text-gray-700 list-decimal">.*?<\/li>(\s|<li class="ml-6 mb-2 text-gray-700 list-decimal">.*?<\/li>)*)/gs, '<ol class="my-3">$1</ol>');
  
  // Convert tables (basic support)
  html = html.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map((cell: string) => cell.trim());
    const cellsHtml = cells.map((cell: string) => `<td class="px-3 py-2 border border-gray-300">${cell}</td>`).join('');
    return `<tr>${cellsHtml}</tr>`;
  });
  
  // Wrap table rows in table element
  html = html.replace(/(<tr>.*?<\/tr>)+/gs, '<table class="w-full border-collapse border border-gray-300 my-4">$&</table>');
  
  // Convert line breaks to paragraphs (improved)
  html = html.replace(/\n\n+/g, '</p><p class="mb-3 text-gray-700 leading-relaxed">');
  html = `<div class="prose max-w-none"><p class="mb-3 text-gray-700 leading-relaxed">${html}</p></div>`;
  
  // Clean up empty paragraphs
  html = html.replace(/<p class="mb-3 text-gray-700 leading-relaxed"><\/p>/g, '');
  
  // Fix spacing around headings
  html = html.replace(/<\/p>(\s*<h[1-6])/g, '$1');
  html = html.replace(/(<\/h[1-6]>)\s*<p class="mb-3 text-gray-700 leading-relaxed">/g, '$1<p class="mb-3 text-gray-700 leading-relaxed">');
  
  return html;
};

export const parseMarkdownForPDF = (text: string): string => {
  if (!text) return '';
  
  let cleanText = text;
  
  // Remove markdown syntax for PDF (enhanced)
  cleanText = cleanText.replace(/####\s*/g, '');
  cleanText = cleanText.replace(/###\s*/g, '');
  cleanText = cleanText.replace(/##\s*/g, '');
  cleanText = cleanText.replace(/#\s*/g, '');
  cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1');
  cleanText = cleanText.replace(/\*(.*?)\*/g, '$1');
  cleanText = cleanText.replace(/---/g, '');
  cleanText = cleanText.replace(/^- /gm, '• ');
  cleanText = cleanText.replace(/^\d+\. /gm, '');
  
  // Clean up table formatting
  cleanText = cleanText.replace(/\|/g, ' ');
  
  // Enhanced text normalization for Arabic and English
  cleanText = cleanText.replace(/\s+/g, ' ');
  
  // Handle Arabic-specific text processing
  if (/[\u0600-\u06FF]/.test(cleanText)) {
    // Contains Arabic text
    cleanText = cleanText.replace(/\u200C/g, ''); // Remove zero-width non-joiner
    cleanText = cleanText.replace(/\u200D/g, ''); // Remove zero-width joiner
    cleanText = cleanText.replace(/\u202A/g, ''); // Remove left-to-right embedding
    cleanText = cleanText.replace(/\u202B/g, ''); // Remove right-to-left embedding
    cleanText = cleanText.replace(/\u202C/g, ''); // Remove pop directional formatting
    cleanText = cleanText.replace(/\u202D/g, ''); // Remove left-to-right override
    cleanText = cleanText.replace(/\u202E/g, ''); // Remove right-to-left override
    
    // Normalize Arabic punctuation for PDF
    cleanText = cleanText.replace(/\u060C/g, '،'); // Arabic comma
    cleanText = cleanText.replace(/\u061B/g, '؛'); // Arabic semicolon
    cleanText = cleanText.replace(/\u061F/g, '؟'); // Arabic question mark
  }
  
  return cleanText.trim();
};
