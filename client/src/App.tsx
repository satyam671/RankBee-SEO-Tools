import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./lib/auth";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Blogs from "@/pages/blogs";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Contact from "@/pages/contact";
import CompetitionChecker from "@/pages/CompetitionChecker";
import TopSearchQueries from "@/pages/TopSearchQueries";
import TopReferrers from "@/pages/TopReferrers";
import AmazonKeywords from "@/pages/AmazonKeywords";
import YouTubeKeywords from "@/pages/YouTubeKeywords";
import KeywordResearchPage from "@/pages/KeywordResearchPage";
import DomainAuthorityPage from "@/pages/DomainAuthorityPage";
import BacklinkAnalyzerPage from "@/pages/BacklinkAnalyzerPage";
import KeywordDensityPage from "@/pages/KeywordDensityPage";
import MetaTagsPage from "@/pages/MetaTagsPage";
import RankTrackerPage from "@/pages/RankTrackerPage";
import ContentSEOPage from "@/pages/ContentSEOPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/blogs" component={Blogs} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path="/tools/competition-checker" component={CompetitionChecker} />
      <Route path="/tools/top-search-queries" component={TopSearchQueries} />
      <Route path="/tools/top-referrers" component={TopReferrers} />
      <Route path="/tools/amazon-keywords" component={AmazonKeywords} />
      <Route path="/tools/youtube-keywords" component={YouTubeKeywords} />
      <Route path="/tools/keyword-research" component={KeywordResearchPage} />
      <Route path="/tools/domain-authority" component={DomainAuthorityPage} />
      <Route path="/tools/backlink-analyzer" component={BacklinkAnalyzerPage} />
      <Route path="/tools/keyword-density" component={KeywordDensityPage} />
      <Route path="/tools/meta-tags" component={MetaTagsPage} />
      <Route path="/tools/rank-tracker" component={RankTrackerPage} />
      <Route path="/tools/content-seo" component={ContentSEOPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
