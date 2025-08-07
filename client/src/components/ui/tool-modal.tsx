import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";
import KeywordResearch from "@/components/seo-tools/keyword-research";
import DomainAuthority from "@/components/seo-tools/domain-authority";
import BacklinkAnalyzer from "@/components/seo-tools/backlink-analyzer";
import KeywordDensity from "@/components/seo-tools/keyword-density";
import MetaTags from "@/components/seo-tools/meta-tags";
import RankTracker from "@/components/seo-tools/rank-tracker";
import ContentSEO from "@/components/seo-tools/content-seo";
import CompetitionChecker from "@/components/seo-tools/competition-checker";

interface ToolModalProps {
  toolId: string;
  tool: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    category: string;
  };
  onClose: () => void;
}

const toolComponents: Record<string, React.ComponentType> = {
  'keyword-research': KeywordResearch,
  'domain-authority': DomainAuthority,
  'backlink-analyzer': BacklinkAnalyzer,
  'keyword-density': KeywordDensity,
  'meta-tags': MetaTags,
  'rank-tracker': RankTracker,
  'content-seo': ContentSEO,
  'competition-checker': CompetitionChecker,
};

export default function ToolModal({ toolId, tool, onClose }: ToolModalProps) {
  const ToolComponent = toolComponents[toolId];
  const Icon = tool.icon;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="flex flex-row justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-medium text-gray-900">
                {tool.title}
              </DialogTitle>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {ToolComponent ? <ToolComponent /> : (
            <div className="text-center py-8">
              <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-900 mb-2">
                {tool.title}
              </h4>
              <p className="text-gray-600">
                This tool is coming soon. Please check back later.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
