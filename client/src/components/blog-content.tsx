import { useLocation } from "wouter";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const [, setLocation] = useLocation();

  // Function to handle link clicks and redirect to correct paths
  const handleLinkClick = (url: string) => {
    // Handle tool links - map tool names to correct paths
    const toolMappings: Record<string, string> = {
      '/tools/keyword-research': '/seo-tools/keyword-research',
      '/tools/domain-authority': '/seo-tools/domain-authority', 
      '/tools/backlink-analyzer': '/seo-tools/backlink-analyzer',
      '/tools/rank-tracker': '/seo-tools/rank-tracker',
      '/tools/meta-tags': '/seo-tools/meta-tags',
      '/tools/keyword-density': '/seo-tools/keyword-density',
      '/tools/content-seo': '/seo-tools/content-seo',
      '/tools/competition-checker': '/seo-tools/competition-checker',
      '/tools/website-authority': '/seo-tools/website-authority'
    };

    // Check if it's a tool link that needs mapping
    if (toolMappings[url]) {
      setLocation(toolMappings[url]);
      return;
    }
    
    // Handle other tool links with /tools/ pattern
    if (url.includes('/tools/')) {
      const toolPath = url.replace('/tools/', '/seo-tools/');
      setLocation(toolPath);
      return;
    }
    
    // Handle blog navigation
    if (url === '/blogs') {
      setLocation('/blogs');
      return;
    }
    
    // Handle external links
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Default navigation
    setLocation(url);
  };

  // Convert markdown links to clickable elements
  const convertLinksToClickable = (text: string) => {
    // Pattern to match markdown links [text](url)
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkPattern.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add the clickable link
      const linkText = match[1];
      const linkUrl = match[2];
      
      parts.push(
        <button
          key={match.index}
          onClick={() => handleLinkClick(linkUrl)}
          className="text-green-600 hover:text-green-800 underline font-medium"
        >
          {linkText}
        </button>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts;
  };

  // Split content into lines and process each one
  const renderContent = () => {
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-4xl font-bold mb-6 text-gray-900">
            {line.slice(2)}
          </h1>
        );
      }
      
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-3xl font-bold mb-4 mt-8 text-gray-900">
            {line.slice(3)}
          </h2>
        );
      }
      
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-semibold mb-3 mt-6 text-gray-900">
            {line.slice(4)}
          </h3>
        );
      }
      
      if (line.startsWith('#### ')) {
        return (
          <h4 key={index} className="text-xl font-semibold mb-2 mt-4 text-gray-900">
            {line.slice(5)}
          </h4>
        );
      }
      
      // Handle bold text
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-bold mb-3 text-gray-900">
            {line.slice(2, -2)}
          </p>
        );
      }
      
      // Handle list items
      if (line.startsWith('- ')) {
        const content = convertLinksToClickable(line.slice(2));
        return (
          <li key={index} className="mb-2 text-gray-700">
            {content}
          </li>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\. /.test(line)) {
        const content = convertLinksToClickable(line.replace(/^\d+\. /, ''));
        return (
          <li key={index} className="mb-2 text-gray-700">
            {content}
          </li>
        );
      }
      
      // Handle code blocks
      if (line.startsWith('`') && line.endsWith('`')) {
        return (
          <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {line.slice(1, -1)}
          </code>
        );
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Handle regular paragraphs with potential links
      const content = convertLinksToClickable(line);
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-lg max-w-none">
      {renderContent()}
    </div>
  );
}