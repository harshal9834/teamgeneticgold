import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-neon-biodiversity.jpg";

interface QCStats {
  totalReads: number;
  qualityPassed: number;
  averageLength: number;
  gcContent: number;
  duplicates: number;
}

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qcResults, setQcResults] = useState<QCStats | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => 
      file.name.endsWith('.fasta') || 
      file.name.endsWith('.fastq') || 
      file.name.endsWith('.fa') ||
      file.name.endsWith('.fq')
    );

    if (validFiles.length === 0) {
      toast({
        title: "Invalid file format",
        description: "Please upload FASTA or FASTQ files only.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFiles(validFiles);
    toast({
      title: "Files uploaded successfully",
      description: `${validFiles.length} file(s) ready for processing.`
    });
  }, [toast]);

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    const steps = [
      { step: 20, message: "Reading sequence files..." },
      { step: 40, message: "Quality control analysis..." },
      { step: 60, message: "Adapter removal..." },
      { step: 80, message: "Length filtering..." },
      { step: 100, message: "Generating QC report..." }
    ];

    for (const { step, message } of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(step);
      toast({
        title: "Processing",
        description: message
      });
    }

    // Mock QC results
    setQcResults({
      totalReads: 45678,
      qualityPassed: 42341,
      averageLength: 287,
      gcContent: 52.4,
      duplicates: 1247
    });

    setIsProcessing(false);
    toast({
      title: "QC Complete",
      description: "Quality control analysis finished successfully."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-bio mb-12">
          <img 
            src={heroImage} 
            alt="Deep ocean biodiversity analysis" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center">
            <div className="container mx-auto px-8">
              <h1 className="text-4xl font-bold text-primary-foreground mb-3">
                eDNA Biodiversity Analysis Platform
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-4">
                Advanced taxonomic classification using SILVA, PR2, and NCBI databases
              </p>
              <div className="flex items-center space-x-4 text-primary-foreground/80">
                <Badge className="bg-primary/20 text-primary border-primary/30 shadow-glow">
                  AI-Powered Classification
                </Badge>
                <Badge className="bg-accent/20 text-accent border-accent/30 shadow-glow">
                  Novelty Detection
                </Badge>
                <Badge className="bg-success/20 text-success border-success/30 shadow-glow">
                  Real-time Analysis
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Upload & Quality Control</h2>
          <p className="text-muted-foreground">
            Upload your eDNA sequence files for preprocessing and quality assessment
          </p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UploadIcon className="w-5 h-5 text-primary" />
              <span>File Upload</span>
            </CardTitle>
            <CardDescription>
              Upload FASTA or FASTQ files containing your eDNA sequences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-gradient-depth hover:border-primary transition-smooth cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: .fasta, .fastq, .fa, .fq (max 50MB each)
              </p>
              <input
                id="fileInput"
                type="file"
                multiple
                accept=".fasta,.fastq,.fa,.fq"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-foreground">Uploaded Files:</h3>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                ))}
                
                <Button 
                  onClick={processFiles} 
                  disabled={isProcessing}
                  className="w-full mt-4 bg-gradient-ocean hover:opacity-90"
                >
                  {isProcessing ? "Processing..." : "Start Quality Control"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processing Progress */}
        {isProcessing && (
          <Card className="shadow-bio">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="w-5 h-5 text-primary animate-pulse" />
                <span>Processing Pipeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-muted-foreground">
                  {progress}% complete
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QC Results */}
        {qcResults && (
          <Card className="shadow-bio">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Quality Control Report</span>
              </CardTitle>
              <CardDescription>
                Summary of preprocessing and quality metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-depth rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{qcResults.totalReads.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Reads</p>
                </div>
                <div className="text-center p-4 bg-gradient-depth rounded-lg">
                  <p className="text-2xl font-bold text-success">{qcResults.qualityPassed.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Quality Passed</p>
                </div>
                <div className="text-center p-4 bg-gradient-depth rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{qcResults.averageLength}</p>
                  <p className="text-sm text-muted-foreground">Avg Length (bp)</p>
                </div>
                <div className="text-center p-4 bg-gradient-depth rounded-lg">
                  <p className="text-2xl font-bold text-accent">{qcResults.gcContent}%</p>
                  <p className="text-sm text-muted-foreground">GC Content</p>
                </div>
                <div className="text-center p-4 bg-gradient-depth rounded-lg">
                  <p className="text-2xl font-bold text-warning">{qcResults.duplicates.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Duplicates Removed</p>
                </div>
                <div className="text-center p-4 bg-gradient-depth rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <span className="text-sm font-medium text-success">PASSED</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Quality</p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button className="bg-gradient-bio hover:opacity-90">
                  Proceed to Classification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Upload;