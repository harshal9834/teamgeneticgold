import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Users, Search, AlertTriangle, ChevronRight, Dna } from "lucide-react";

interface NovelCluster {
  id: string;
  name: string;
  sequenceCount: number;
  intraSimilarity: number;
  representativeSequence: string;
  potentialTaxonomy: {
    closestMatch: string;
    similarity: number;
    kingdom: string;
    confidence: 'high' | 'medium' | 'low';
  };
  ecologicalContext: {
    depth: string;
    location: string;
    temperature: string;
    habitat: string;
  };
  noveltyScore: number;
}

const Novelty = () => {
  const [clusters, setClusters] = useState<NovelCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<NovelCluster | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const performNoveltyAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis steps
    const steps = [
      { step: 20, message: "Extracting unassigned sequences..." },
      { step: 40, message: "Computing pairwise similarities..." },
      { step: 60, message: "Clustering novel sequences..." },
      { step: 80, message: "Analyzing cluster characteristics..." },
      { step: 100, message: "Generating novelty scores..." }
    ];

    for (const { step } of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(step);
    }

    // Mock novel cluster data
    const mockClusters: NovelCluster[] = [
      {
        id: "NOVEL_001",
        name: "Candidate Species Alpha",
        sequenceCount: 47,
        intraSimilarity: 87.3,
        representativeSequence: "ATCGATCGATCGATCGATCGATCGATCGATCG...",
        potentialTaxonomy: {
          closestMatch: "Kinetoplastida sp.",
          similarity: 68.2,
          kingdom: "Eukaryota",
          confidence: 'medium'
        },
        ecologicalContext: {
          depth: "3200-3800m",
          location: "Abyssal Plain",
          temperature: "2.1°C",
          habitat: "Deep-sea sediment"
        },
        noveltyScore: 94.7
      },
      {
        id: "NOVEL_002", 
        name: "Candidate Species Beta",
        sequenceCount: 23,
        intraSimilarity: 82.1,
        representativeSequence: "GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA...",
        potentialTaxonomy: {
          closestMatch: "Cercozoa incertae sedis",
          similarity: 71.5,
          kingdom: "Eukaryota",
          confidence: 'medium'
        },
        ecologicalContext: {
          depth: "2800-3200m",
          location: "Seamount Flank",
          temperature: "3.4°C",
          habitat: "Carbonate crust"
        },
        noveltyScore: 89.3
      },
      {
        id: "NOVEL_003",
        name: "Candidate Species Gamma", 
        sequenceCount: 34,
        intraSimilarity: 91.7,
        representativeSequence: "TTAATTAATTAATTAATTAATTAATTAATTAA...",
        potentialTaxonomy: {
          closestMatch: "Stramenopiles",
          similarity: 64.8,
          kingdom: "Eukaryota",
          confidence: 'low'
        },
        ecologicalContext: {
          depth: "4100-4500m",
          location: "Hadal Trench",
          temperature: "1.8°C",
          habitat: "Trench wall"
        },
        noveltyScore: 97.2
      },
      {
        id: "NOVEL_004",
        name: "Candidate Species Delta",
        sequenceCount: 19,
        intraSimilarity: 85.9,
        representativeSequence: "AAAATTTTCCCCGGGGAAAATTTTCCCCGGGG...",
        potentialTaxonomy: {
          closestMatch: "Radiolaria",
          similarity: 73.1,
          kingdom: "Eukaryota", 
          confidence: 'high'
        },
        ecologicalContext: {
          depth: "1500-2000m",
          location: "Continental Slope",
          temperature: "4.2°C",
          habitat: "Soft sediment"
        },
        noveltyScore: 85.6
      }
    ];

    setClusters(mockClusters);
    setIsAnalyzing(false);
    setSelectedCluster(mockClusters[0]);
  };

  useEffect(() => {
    performNoveltyAnalysis();
  }, []);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getNoveltyScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Novelty Detection & Clustering</h1>
          <p className="text-muted-foreground">
            Identify and analyze potential new species from unassigned sequences
          </p>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card className="shadow-bio">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span>Novelty Analysis Pipeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-muted-foreground">
                  {progress}% - Clustering unassigned sequences for novel taxa detection...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Statistics */}
        {clusters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-bio">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">{clusters.length}</p>
                <p className="text-sm text-muted-foreground">Novel Clusters</p>
              </CardContent>
            </Card>
            <Card className="shadow-bio">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">
                  {clusters.reduce((sum, c) => sum + c.sequenceCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Sequences</p>
              </CardContent>
            </Card>
            <Card className="shadow-bio">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">
                  {clusters.filter(c => c.noveltyScore >= 90).length}
                </p>
                <p className="text-sm text-muted-foreground">High Novelty</p>
              </CardContent>
            </Card>
            <Card className="shadow-bio">
              <CardContent className="p-6 text-center">
                <Dna className="w-8 h-8 text-secondary mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">
                  {(clusters.reduce((sum, c) => sum + c.intraSimilarity, 0) / clusters.length).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Similarity</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cluster Results */}
        {clusters.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cluster List */}
            <Card className="shadow-bio">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span>Novel Clusters</span>
                </CardTitle>
                <CardDescription>
                  Candidate new species detected from sequence clustering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {clusters.map((cluster) => (
                      <div
                        key={cluster.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-smooth hover:shadow-md ${
                          selectedCluster?.id === cluster.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedCluster(cluster)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-gradient-bio text-white">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Novel
                            </Badge>
                            <Badge 
                              className={getConfidenceColor(cluster.potentialTaxonomy.confidence)}
                              variant="outline"
                            >
                              {cluster.potentialTaxonomy.confidence} confidence
                            </Badge>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        
                        <h3 className="font-medium text-foreground mb-2">{cluster.name}</h3>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {cluster.sequenceCount} sequences
                          </span>
                          <span className={`font-bold ${getNoveltyScoreColor(cluster.noveltyScore)}`}>
                            {cluster.noveltyScore.toFixed(1)}% novel
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Cluster Details */}
            <Card className="shadow-bio">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Dna className="w-5 h-5 text-primary" />
                  <span>Cluster Analysis</span>
                </CardTitle>
                <CardDescription>
                  Detailed information for selected cluster
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCluster ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground">{selectedCluster.name}</h3>
                      <Badge 
                        className={`${getNoveltyScoreColor(selectedCluster.noveltyScore)} bg-transparent border`}
                        variant="outline"
                      >
                        {selectedCluster.noveltyScore.toFixed(1)}% Novel
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-depth rounded-lg">
                        <p className="text-xl font-bold text-foreground">{selectedCluster.sequenceCount}</p>
                        <p className="text-sm text-muted-foreground">Sequences</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-depth rounded-lg">
                        <p className="text-xl font-bold text-foreground">{selectedCluster.intraSimilarity}%</p>
                        <p className="text-sm text-muted-foreground">Intra-Similarity</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Closest Taxonomic Match</h4>
                        <div className="p-3 bg-muted rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">
                              {selectedCluster.potentialTaxonomy.closestMatch}
                            </span>
                            <Badge className={getConfidenceColor(selectedCluster.potentialTaxonomy.confidence)}>
                              {selectedCluster.potentialTaxonomy.confidence}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Kingdom:</span>
                            <span className="text-foreground">{selectedCluster.potentialTaxonomy.kingdom}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Similarity:</span>
                            <span className="text-foreground">{selectedCluster.potentialTaxonomy.similarity}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">Ecological Context</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="text-muted-foreground">Depth Range:</span>
                            <span className="font-medium text-foreground">{selectedCluster.ecologicalContext.depth}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium text-foreground">{selectedCluster.ecologicalContext.location}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="text-muted-foreground">Temperature:</span>
                            <span className="font-medium text-foreground">{selectedCluster.ecologicalContext.temperature}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="text-muted-foreground">Habitat:</span>
                            <span className="font-medium text-foreground">{selectedCluster.ecologicalContext.habitat}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">Representative Sequence</h4>
                        <div className="p-3 bg-muted rounded-lg font-mono text-xs break-all">
                          {selectedCluster.representativeSequence}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Search className="w-4 h-4 mr-2" />
                        BLAST Search
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-bio hover:opacity-90">
                        <Dna className="w-4 h-4 mr-2" />
                        Export Sequences
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a cluster to view detailed analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Novelty;