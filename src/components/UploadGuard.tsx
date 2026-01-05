import { ReactNode } from "react";
import useUserHasUploads from "../hooks/useUserHasUploads";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

export default function UploadGuard({ children }: { children: ReactNode }) {
  const hasUploads = useUserHasUploads();
  const { toast } = useToast();

  if (!hasUploads) {
    toast({
      title: "Upload Required",
      description: "Please upload a FASTA/FASTQ file before using this feature.",
      variant: "destructive",
    });

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
