import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Database, CheckCircle, AlertCircle, Sparkles, ChevronRight } from "lucide-react";

interface TaxonomyMatch {
  id: string;
  sequence: string;
  similarity: number;
  matchType: 'exact' | 'high' | 'medium' | 'novel';
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  database: 'SILVA' | 'PR2' | 'NCBI' | 'BOLD';
  metadata?: {
    habitat: string;
    depth: string;
    characteristics: string;
    abundance: number;
  };
}

const Classification = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matches, setMatches] = useState<TaxonomyMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<TaxonomyMatch | null>(null);

  const startClassification = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setMatches([]);

    // Simulate analysis with progress
    const steps = [
      { step: 15, message: "Loading SILVA database..." },
      { step: 30, message: "Loading PR2 database..." },
      { step: 50, message: "Performing sequence alignment..." },
      { step: 70, message: "Computing similarity scores..." },
      { step: 85, message: "Taxonomic classification..." },
      { step: 100, message: "Finalizing results..." }
    ];

    for (const { step } of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step);
    }

    // Mock classification results
    const mockResults: TaxonomyMatch[] = [
      {
        id: "SEQ_001",
        sequence: "ATCGATCGATCGATCG...",
        similarity: 98.7,
        matchType: 'exact',
        taxonomy: {
          kingdom: "Eukaryota",
          phylum: "Bacillariophyta",
          class: "Coscinodiscophyceae",
          order: "Thalassiosirales",
          family: "Thalassiosiraceae",
          genus: "Thalassiosira",
          species: "Thalassiosira oceanica"
        },
        database: 'SILVA',
        metadata: {
          habitat: "Marine planktonic",
          depth: "0-200m",
          characteristics: "Centric diatom, forms chains",
          abundance: 1247
        }
      },
      {
        id: "SEQ_002",
        sequence: "GCTAGCTAGCTAGCTA...",
        similarity: 89.3,
        matchType: 'high',
        taxonomy: {
          kingdom: "Eukaryota",
          phylum: "Dinoflagellata",
          class: "Dinophyceae",
          order: "Gonyaulacales",
          family: "Gonyaulacaceae",
          genus: "Protoceratium",
          species: "Protoceratium reticulatum"
        },
        database: 'PR2',
        metadata: {
          habitat: "Marine, coastal waters",
          depth: "Surface to 100m",
          characteristics: "Photosynthetic dinoflagellate",
          abundance: 892
        }
      },
      {
        id: "SEQ_003",
        sequence: "TTAATTAATTAATTAA...",
        similarity: 73.2,
        matchType: 'medium',
        taxonomy: {
          kingdom: "Eukaryota",
          phylum: "Cercozoa",
          class: "Filosa",
          order: "Cryomonadida",
          family: "Cryomonadidae",
          genus: "Rhogostoma",
          species: "Rhogostoma sp."
        },
        database: 'SILVA',
        metadata: {
          habitat: "Deep-sea sediments",
          depth: "1000-4000m",
          characteristics: "Heterotrophic flagellate",
          abundance: 234
        }
      },
      {
        id: "SEQ_004",
        sequence: "AAAATTTTCCCCGGGG...",
        similarity: 52.1,
        matchType: 'novel',
        taxonomy: {
          kingdom: "Unknown",
          phylum: "Unknown",
          class: "Unknown",
          order: "Unknown",
          family: "Unknown",
          genus: "Unknown",
          species: "Candidate Species 1"
        },
        database: 'SILVA'
      }
    ];

    setMatches(mockResults);
    setIsAnalyzing(false);
  };

  const getMatchColor = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'text-success bg-success/10 border-success/20';
      case 'high': return 'text-primary bg-primary/10 border-primary/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'novel': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getMatchIcon = (matchType: string) => {
    switch (matchType) {
      case 'exact': return <CheckCircle className="w-4 h-4" />;
      case 'high': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'novel': return <Sparkles className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Taxonomic Classification</h1>
          <p className="text-muted-foreground">
            Match sequences against SILVA, PR2, and NCBI reference databases
          </p>
        </div>

        {/* Analysis Control */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Database Classification</span>
            </CardTitle>
            <CardDescription>
              Perform taxonomic classification using multiple reference databases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isAnalyzing && matches.length === 0 && (
                <Button 
                  onClick={startClassification}
                  className="w-full bg-gradient-ocean hover:opacity-90"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Start Classification Analysis
                </Button>
              )}

              {isAnalyzing && (
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-center text-muted-foreground">
                    {progress}% - Analyzing sequences against reference databases...
                  </p>
                </div>
              )}

              {matches.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-depth rounded-lg">
                    <p className="text-2xl font-bold text-success">{matches.filter(m => m.matchType === 'exact').length}</p>
                    <p className="text-sm text-muted-foreground">Exact Matches</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-depth rounded-lg">
                    <p className="text-2xl font-bold text-primary">{matches.filter(m => m.matchType === 'high').length}</p>
                    <p className="text-sm text-muted-foreground">High Similarity</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-depth rounded-lg">
                    <p className="text-2xl font-bold text-warning">{matches.filter(m => m.matchType === 'medium').length}</p>
                    <p className="text-sm text-muted-foreground">Medium Similarity</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-depth rounded-lg">
                    <p className="text-2xl font-bold text-destructive">{matches.filter(m => m.matchType === 'novel').length}</p>
                    <p className="text-sm text-muted-foreground">Novel Candidates</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {matches.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Matches List */}
            <Card className="shadow-bio">
              <CardHeader>
                <CardTitle>Classification Results</CardTitle>
                <CardDescription>
                  {matches.length} sequences classified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-smooth hover:shadow-md ${
                          selectedMatch?.id === match.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedMatch(match)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getMatchColor(match.matchType)}>
                              {getMatchIcon(match.matchType)}
                              <span className="ml-1 capitalize">{match.matchType}</span>
                            </Badge>
                            <Badge variant="outline">{match.database}</Badge>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-foreground">{match.taxonomy.species}</p>
                        <p className="text-sm text-muted-foreground">{match.similarity.toFixed(1)}% similarity</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Match Details */}
            <Card className="shadow-bio">
              <CardHeader>
                <CardTitle>Taxonomic Details</CardTitle>
                <CardDescription>
                  {selectedMatch ? "Detailed information for selected match" : "Select a match to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMatch ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Badge className={getMatchColor(selectedMatch.matchType)} variant="outline">
                        {getMatchIcon(selectedMatch.matchType)}
                        <span className="ml-1">{selectedMatch.similarity.toFixed(1)}% similarity</span>
                      </Badge>
                      <Badge variant="secondary">{selectedMatch.database}</Badge>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Taxonomy</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {Object.entries(selectedMatch.taxonomy).map(([rank, value]) => (
                          <div key={rank} className="flex justify-between">
                            <span className="capitalize text-muted-foreground">{rank}:</span>
                            <span className="font-medium text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedMatch.metadata && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Ecological Information</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Habitat:</span>
                            <span className="font-medium text-foreground">{selectedMatch.metadata.habitat}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Depth Range:</span>
                            <span className="font-medium text-foreground">{selectedMatch.metadata.depth}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Abundance:</span>
                            <span className="font-medium text-foreground">{selectedMatch.metadata.abundance.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Characteristics:</strong> {selectedMatch.metadata.characteristics}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a classification result to view detailed information</p>
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

export default Classification;