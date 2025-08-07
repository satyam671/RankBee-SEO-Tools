import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  tool: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    category: string;
  };
  onClick: () => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Card 
      className="tool-card" 
      onClick={onClick}
      data-tool-card
      data-tool-title={tool.title}
      data-tool-description={tool.description}
    >
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{tool.title}</h4>
            <p className="text-sm text-gray-500 mb-3">{tool.category}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">{tool.description}</p>
        <div className="flex items-center text-sm text-green-600 font-medium">
          <span>Try Now</span>
          <span className="ml-1">→</span>
        </div>
      </CardContent>
    </Card>
  );
}
