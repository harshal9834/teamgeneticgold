import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Table, 
  BarChart3, 
  Image, 
  FileJson,
  FileSpreadsheet,
  Archive,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportItem {
  id: string;
  title: string;
  description: string;
  format: string;
  size: string;
  icon: React.ElementType;
  status: 'available' | 'generating' | 'pending';
  lastGenerated: string;
}

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const reportItems: ReportItem[] = [
    {
      id: "summary",
      title: "Analysis Summary Report",
      description: "Comprehensive overview of all analyses with key findings",
      format: "PDF",
      size: "2.3 MB",
      icon: FileText,
      status: 'available',
      lastGenerated: "2024-01-15 14:30 UTC"
    },
    {
      id: "taxonomy",
      title: "Taxonomic Classification Table",
      description: "Detailed taxonomic assignments with similarity scores",
      format: "CSV",
      size: "890 KB",
      icon: Table,
      status: 'available',
      lastGenerated: "2024-01-15 14:28 UTC"
    },
    {
      id: "abundance",
      title: "Abundance Matrix",
      description: "OTU/ASV abundance table compatible with QIIME2",
      format: "TXT",
      size: "1.1 MB",
      icon: FileSpreadsheet,
      status: 'available',
      lastGenerated: "2024-01-15 14:25 UTC"
    },
    {
      id: "novelty",
      title: "Novel Taxa Report",
      description: "Detailed analysis of candidate new species",
      format: "JSON",
      size: "445 KB",
      icon: FileJson,
      status: 'available',
      lastGenerated: "2024-01-15 14:22 UTC"
    },
    {
      id: "visualizations",
      title: "Visualization Package",
      description: "All charts, graphs, and plots in high resolution",
      format: "ZIP",
      size: "15.7 MB",
      icon: Archive,
      status: 'available',
      lastGenerated: "2024-01-15 14:20 UTC"
    },
    {
      id: "sequences",
      title: "Processed Sequences",
      description: "Quality-filtered FASTA files with metadata",
      format: "FASTA",
      size: "8.9 MB",
      icon: FileText,
      status: 'generating',
      lastGenerated: ""
    },
    {
      id: "phylogenetic",
      title: "Phylogenetic Tree",
      description: "Neighbor-joining tree in Newick format",
      format: "NWK",
      size: "234 KB",
      icon: Image,
      status: 'pending',
      lastGenerated: ""
    }
  ];

  const handleDownload = async (reportId: string, title: string) => {
    // Simulate download process
    setIsGenerating(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    setIsGenerating(false);
    setProgress(0);

    toast({
      title: "Download Complete",
      description: `${title} has been downloaded successfully.`
    });
  };

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate report generation
    const steps = [
      { step: 25, message: "Collecting data..." },
      { step: 50, message: "Processing results..." },
      { step: 75, message: "Formatting output..." },
      { step: 100, message: "Finalizing report..." }
    ];

    for (const { step, message } of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(step);
    }

    setIsGenerating(false);
    setProgress(0);

    toast({
      title: "Report Generated",
      description: "Your report has been generated and is ready for download."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Ready</Badge>;
      case 'generating':
        return <Badge className="bg-warning text-warning-foreground animate-pulse"><Clock className="w-3 h-3 mr-1" />Generating</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Export</h1>
          <p className="text-muted-foreground">
            Download comprehensive analysis results and export data in various formats
          </p>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <Card className="shadow-bio">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary animate-pulse" />
                <span>Report Generation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-muted-foreground">
                  {progress}% - Processing your export request...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-primary" />
              <span>Quick Export</span>
            </CardTitle>
            <CardDescription>
              Download commonly requested files with one click
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="bg-gradient-ocean hover:opacity-90 h-16 flex-col space-y-1"
                onClick={() => handleDownload("all", "Complete Analysis Package")}
              >
                <Archive className="w-5 h-5" />
                <span className="text-sm">Complete Package</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-1"
                onClick={() => handleDownload("data", "Raw Data Export")}
              >
                <Table className="w-5 h-5" />
                <span className="text-sm">Raw Data Only</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-1"
                onClick={() => handleDownload("viz", "Visualizations")}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm">Visualizations</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Available Reports</span>
            </CardTitle>
            <CardDescription>
              Individual report files and datasets for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportItems.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-depth rounded-lg">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          {getStatusBadge(item.status)}
                          <Badge variant="outline" className="text-xs">
                            {item.format}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Size: {item.size}</span>
                          {item.lastGenerated && (
                            <span>Generated: {item.lastGenerated}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.status === 'available' && (
                        <Button
                          size="sm"
                          onClick={() => handleDownload(item.id, item.title)}
                          className="bg-gradient-bio hover:opacity-90"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {item.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReport(item.id)}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      )}
                      {item.status === 'generating' && (
                        <Button size="sm" disabled>
                          <Clock className="w-4 h-4 mr-2 animate-pulse" />
                          Processing...
                        </Button>
                      )}
                    </div>
                  </div>
                  {index < reportItems.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Formats Info */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Supported Export Formats</span>
            </CardTitle>
            <CardDescription>
              Compatible file formats for downstream analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Bioinformatics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">QIIME2 OTU Table:</span>
                    <Badge variant="outline">BIOM</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sequence Data:</span>
                    <Badge variant="outline">FASTA</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phylogenetic Tree:</span>
                    <Badge variant="outline">NWK</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Data Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spreadsheet Data:</span>
                    <Badge variant="outline">CSV/Excel</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statistical Data:</span>
                    <Badge variant="outline">R/Python</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metadata:</span>
                    <Badge variant="outline">JSON</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Visualization</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publication Plots:</span>
                    <Badge variant="outline">PNG/SVG</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interactive Charts:</span>
                    <Badge variant="outline">HTML</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reports:</span>
                    <Badge variant="outline">PDF</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Citation */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Data Citation & Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-depth rounded-lg">
                <h4 className="font-medium text-foreground mb-2">How to Cite This Analysis</h4>
                <p className="text-sm text-muted-foreground font-mono">
                  BioDiversity AI Platform. (2024). eDNA Biodiversity Analysis Report. 
                  Generated on {new Date().toLocaleDateString()}. 
                  Reference databases: SILVA 138, PR2 4.14.0, NCBI-nt.
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Data Usage Guidelines:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Results are based on computational analysis and should be validated experimentally</li>
                  <li>Novel taxa candidates require taxonomic verification before formal description</li>
                  <li>Reference database versions are provided for reproducibility</li>
                  <li>Raw sequence data should be deposited in public repositories (SRA, ENA)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;