import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/LOGOGDGC.png";


import {
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  BarChart,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

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

    const valid = Array.from(files).filter(
      (file) =>
        file.name.endsWith(".fasta") ||
        file.name.endsWith(".fa") ||
        file.name.endsWith(".fastq") ||
        file.name.endsWith(".fq")
    );

    if (valid.length === 0) {
      toast({
        title: "Invalid file format",
        description: "Upload FASTA / FASTQ files only.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles(valid);

    toast({
      title: "Files added",
      description: `${valid.length} file(s) ready.`,
    });
  }, [toast]);


  const saveResultsToFirestore = async (fileName: string, qc: QCStats) => {
    if (!auth.currentUser) return;

    await addDoc(collection(db, "uploads"), {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      fileName,
      ...qc,
      createdAt: serverTimestamp(),
    });
  };


  const processFiles = async () => {
    if (uploadedFiles.length === 0) return;

    if (!auth.currentUser) {
      toast({
        title: "Login required",
        description: "Please log in to process & save uploads.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const steps = [
      { step: 20, msg: "Reading sequence files..." },
      { step: 40, msg: "Running quality control..." },
      { step: 60, msg: "Filtering adapters..." },
      { step: 80, msg: "Length & GC filtering..." },
      { step: 100, msg: "Generating QC report..." },
    ];

    for (const s of steps) {
      await new Promise((res) => setTimeout(res, 900));
      setProgress(s.step);
    }

    const qc: QCStats = {
      totalReads: 45678,
      qualityPassed: 42341,
      averageLength: 287,
      gcContent: 52.4,
      duplicates: 1247,
    };

    setQcResults(qc);
    await saveResultsToFirestore(uploadedFiles[0].name, qc);

    setIsProcessing(false);
  };


  return (
    <div className="container mx-auto px-4 py-8">

      <div className="max-w-4xl mx-auto space-y-8">

        {/* BLUE HERO CARD */}
     <div className="relative rounded-2xl overflow-hidden shadow-bio mb-12"> <img src={heroImage} alt="Deep ocean biodiversity analysis" className="w-full h-64 object-cover" /> <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center"> <div className="container mx-auto px-8"> <h1 className="text-4xl font-bold text-primary-foreground mb-3"> eDNA Biodiversity Analysis Platform </h1> <p className="text-xl text-primary-foreground/90 mb-4"> Advanced taxonomic classification using BLAST,GENBANK and BOLD databases </p> <div className="flex items-center space-x-4 text-primary-foreground/80"> <Badge className="bg-primary/20 text-primary border-primary/30 shadow-glow"> AI-Powered Classification </Badge> <Badge className="bg-accent/20 text-accent border-accent/30 shadow-glow"> Novelty Detection </Badge> <Badge className="bg-success/20 text-success border-success/30 shadow-glow"> Real-time Analysis </Badge> </div> </div> </div> </div>


        {/* UPLOAD CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Upload & Quality Control</CardTitle>
            <CardDescription>
              Upload your eDNA sequence files (.fasta / .fastq)
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <UploadIcon className="mx-auto mb-3" />
              <p>Drag & drop or click to select files</p>

              <input
                id="fileInput"
                type="file"
                multiple
                accept=".fasta,.fastq,.fa,.fq"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>


            {uploadedFiles.length > 0 && (
              <>
                <div className="mt-6 space-y-3">
                  {uploadedFiles.map((file, i) => (
                    <div key={i}
                      className="flex justify-between items-center bg-muted p-3 rounded-lg">

                      <div className="flex items-center gap-3">
                        <FileText />
                        <div>
                          <p>{file.name}</p>
                          <p className="text-xs">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <Badge>Ready</Badge>
                    </div>
                  ))}
                </div>

                {!qcResults && (
                  <Button
                    className="w-full mt-4"
                    disabled={isProcessing}
                    onClick={processFiles}
                  >
                    {isProcessing ? "Processing..." : "Start Quality Control"}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>


        {isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle>
                <BarChart className="inline-block mr-2" />
                Processing Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} />
              <p className="text-center mt-2">{progress}% Complete</p>
            </CardContent>
          </Card>
        )}


        {qcResults && (
          <Card>
            <CardHeader>
              <CardTitle>
                <CheckCircle className="inline-block mr-2 text-success" />
                Quality Control Report
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <p>Total Reads — {qcResults.totalReads}</p>
                <p>Passed — {qcResults.qualityPassed}</p>
                <p>Avg Length — {qcResults.averageLength}</p>
                <p>GC Content — {qcResults.gcContent}%</p>
                <p>Duplicates — {qcResults.duplicates}</p>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default Upload;
