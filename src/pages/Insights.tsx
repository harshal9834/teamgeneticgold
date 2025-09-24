import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, PieChart, Network, Sparkles, TrendingUp, Users } from "lucide-react";

interface CommunityData {
  taxa: string;
  abundance: number;
  percentage: number;
  color: string;
  kingdom: string;
}

interface EcologicalInsight {
  title: string;
  description: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}

const Insights = () => {
  const [communityData, setCommunityData] = useState<CommunityData[]>([]);
  const [insights, setInsights] = useState<EcologicalInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateInsights = async () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate analysis progress
    const steps = [20, 40, 60, 80, 100];
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step);
    }

    // Mock community composition data
    const mockCommunityData: CommunityData[] = [
      { taxa: "Bacillariophyta", abundance: 12450, percentage: 42.3, color: "#0891b2", kingdom: "Eukaryota" },
      { taxa: "Dinoflagellata", abundance: 8920, percentage: 30.4, color: "#059669", kingdom: "Eukaryota" },
      { taxa: "Cercozoa", abundance: 4230, percentage: 14.4, color: "#7c3aed", kingdom: "Eukaryota" },
      { taxa: "Copepoda", abundance: 2100, percentage: 7.1, color: "#dc2626", kingdom: "Metazoa" },
      { taxa: "Ciliophora", abundance: 1650, percentage: 5.6, color: "#ea580c", kingdom: "Eukaryota" },
      { taxa: "Unknown", abundance: 130, percentage: 0.4, color: "#6b7280", kingdom: "Unknown" }
    ];

    const mockInsights: EcologicalInsight[] = [
      {
        title: "Biodiversity Index",
        description: "Shannon diversity index indicates high community diversity",
        value: "3.42",
        trend: 'up',
        icon: Sparkles
      },
      {
        title: "Dominant Group",
        description: "Diatoms (Bacillariophyta) dominate the community",
        value: "42.3%",
        trend: 'stable',
        icon: TrendingUp
      },
      {
        title: "Novel Taxa",
        description: "Potential new species detected in deep-sea samples",
        value: "7",
        trend: 'up',
        icon: Users
      },
      {
        title: "Trophic Structure",
        description: "Balanced primary producers and consumers",
        value: "Healthy",
        trend: 'stable',
        icon: Network
      }
    ];

    setCommunityData(mockCommunityData);
    setInsights(mockInsights);
    setIsGenerating(false);
  };

  useEffect(() => {
    // Auto-generate insights on page load
    generateInsights();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ecological Insights</h1>
          <p className="text-muted-foreground">
            Community composition analysis and biodiversity metrics
          </p>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <Card className="shadow-bio">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="w-5 h-5 text-primary animate-pulse" />
                <span>Generating Ecological Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-muted-foreground">
                  {progress}% - Computing biodiversity metrics and community structure...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Insights */}
        {insights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="shadow-bio hover:shadow-glow transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-ocean rounded-lg">
                      <insight.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg">{getTrendIcon(insight.trend)}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-foreground">{insight.value}</p>
                    <h3 className="font-medium text-foreground">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Community Composition */}
        {communityData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-bio">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  <span>Community Composition</span>
                </CardTitle>
                <CardDescription>
                  Relative abundance of major taxonomic groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium text-foreground">{item.taxa}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.kingdom}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.percentage}%
                        </span>
                      </div>
                      <Progress 
                        value={item.percentage} 
                        className="h-2"
                        style={{ 
                          background: `linear-gradient(to right, ${item.color} 0%, ${item.color} ${item.percentage}%, hsl(var(--border)) ${item.percentage}%)`
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        {item.abundance.toLocaleString()} sequences
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-bio">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="w-5 h-5 text-primary" />
                  <span>Ecological Networks</span>
                </CardTitle>
                <CardDescription>
                  Species interaction and co-occurrence patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-depth rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Simplified network visualization */}
                  <div className="relative w-full h-full">
                    {/* Central nodes */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-ocean rounded-full shadow-glow flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">Core</span>
                    </div>
                    
                    {/* Satellite nodes */}
                    {[
                      { top: '20%', left: '20%', color: 'bg-success' },
                      { top: '20%', right: '20%', color: 'bg-warning' },
                      { bottom: '20%', left: '20%', color: 'bg-accent' },
                      { bottom: '20%', right: '20%', color: 'bg-destructive' },
                      { top: '50%', left: '10%', color: 'bg-secondary' },
                      { top: '50%', right: '10%', color: 'bg-primary' }
                    ].map((node, index) => (
                      <div
                        key={index}
                        className={`absolute w-8 h-8 ${node.color} rounded-full opacity-80 animate-pulse`}
                        style={{
                          top: node.top,
                          left: node.left,
                          right: node.right,
                          bottom: node.bottom,
                          animationDelay: `${index * 0.5}s`
                        }}
                      />
                    ))}
                    
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-30">
                      <defs>
                        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                      </defs>
                      {/* Sample connection lines */}
                      <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="url(#connectionGradient)" strokeWidth="1" />
                      <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="url(#connectionGradient)" strokeWidth="1" />
                      <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="url(#connectionGradient)" strokeWidth="1" />
                      <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="url(#connectionGradient)" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Interactive network analysis showing species co-occurrence patterns and potential ecological relationships
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Network className="w-4 h-4 mr-2" />
                    View Full Network
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Biodiversity Metrics */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-primary" />
              <span>Biodiversity Metrics</span>
            </CardTitle>
            <CardDescription>
              Statistical measures of community diversity and structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-depth rounded-lg">
                <p className="text-3xl font-bold text-foreground mb-2">3.42</p>
                <p className="font-medium text-foreground">Shannon Index</p>
                <p className="text-sm text-muted-foreground">High diversity</p>
              </div>
              <div className="text-center p-6 bg-gradient-depth rounded-lg">
                <p className="text-3xl font-bold text-foreground mb-2">0.89</p>
                <p className="font-medium text-foreground">Simpson Index</p>
                <p className="text-sm text-muted-foreground">Low dominance</p>
              </div>
              <div className="text-center p-6 bg-gradient-depth rounded-lg">
                <p className="text-3xl font-bold text-foreground mb-2">47</p>
                <p className="font-medium text-foreground">Species Richness</p>
                <p className="text-sm text-muted-foreground">Total taxa observed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;