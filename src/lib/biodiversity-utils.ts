/**
 * Utility functions for biodiversity analysis
 */

export interface SequenceData {
  id: string;
  sequence: string;
  length: number;
  gcContent: number;
  quality?: number;
}

export interface TaxonomicMatch {
  sequence: string;
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  similarity: number;
  database: 'SILVA' | 'PR2' | 'NCBI' | 'BOLD';
  confidence: number;
}

export interface BiodiversityMetrics {
  shannonIndex: number;
  simpsonIndex: number;
  speciesRichness: number;
  evenness: number;
}

/**
 * Calculate sequence similarity using k-mer analysis
 */
export function calculateSequenceSimilarity(seq1: string, seq2: string, kmerSize: number = 4): number {
  const getKmers = (sequence: string, k: number): Set<string> => {
    const kmers = new Set<string>();
    for (let i = 0; i <= sequence.length - k; i++) {
      kmers.add(sequence.slice(i, i + k));
    }
    return kmers;
  };

  const kmers1 = getKmers(seq1.toUpperCase(), kmerSize);
  const kmers2 = getKmers(seq2.toUpperCase(), kmerSize);
  
  const intersection = new Set([...kmers1].filter(x => kmers2.has(x)));
  const union = new Set([...kmers1, ...kmers2]);
  
  return (intersection.size / union.size) * 100;
}

/**
 * Compute GC content of a DNA sequence
 */
export function calculateGCContent(sequence: string): number {
  const gcCount = (sequence.match(/[GC]/gi) || []).length;
  return (gcCount / sequence.length) * 100;
}

/**
 * Calculate Shannon diversity index
 */
export function calculateShannonIndex(abundances: number[]): number {
  const total = abundances.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  
  return -abundances
    .filter(count => count > 0)
    .map(count => {
      const proportion = count / total;
      return proportion * Math.log(proportion);
    })
    .reduce((sum, value) => sum + value, 0);
}

/**
 * Calculate Simpson diversity index
 */
export function calculateSimpsonIndex(abundances: number[]): number {
  const total = abundances.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  
  const sumSquares = abundances
    .map(count => Math.pow(count / total, 2))
    .reduce((sum, value) => sum + value, 0);
    
  return 1 - sumSquares;
}

/**
 * Calculate species richness (number of unique species)
 */
export function calculateSpeciesRichness(abundances: number[]): number {
  return abundances.filter(count => count > 0).length;
}

/**
 * Calculate Pielou's evenness index
 */
export function calculateEvenness(abundances: number[]): number {
  const shannon = calculateShannonIndex(abundances);
  const richness = calculateSpeciesRichness(abundances);
  
  if (richness <= 1) return 0;
  return shannon / Math.log(richness);
}

/**
 * Generate novelty score based on similarity to known sequences
 */
export function calculateNoveltyScore(maxSimilarity: number, clusterSize: number, intraSimilarity: number): number {
  // Higher novelty for lower similarity to known sequences
  const similarityScore = (100 - maxSimilarity) * 0.6;
  
  // Higher novelty for larger, more cohesive clusters
  const clusterScore = Math.min(clusterSize * 2, 20);
  const cohesionScore = (intraSimilarity - 70) * 0.3;
  
  return Math.min(similarityScore + clusterScore + cohesionScore, 100);
}

/**
 * Mock reference database for demonstration
 */
export const mockReferenceDB = {
  sequences: [
    {
      id: "SILVA_001",
      sequence: "ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG",
      taxonomy: {
        kingdom: "Eukaryota",
        phylum: "Bacillariophyta", 
        class: "Coscinodiscophyceae",
        order: "Thalassiosirales",
        family: "Thalassiosiraceae",
        genus: "Thalassiosira",
        species: "Thalassiosira oceanica"
      },
      database: "SILVA" as const,
      habitat: "Marine planktonic",
      depth: "0-200m"
    },
    {
      id: "PR2_001",
      sequence: "GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA",
      taxonomy: {
        kingdom: "Eukaryota",
        phylum: "Dinoflagellata",
        class: "Dinophyceae", 
        order: "Gonyaulacales",
        family: "Gonyaulacaceae",
        genus: "Protoceratium",
        species: "Protoceratium reticulatum"
      },
      database: "PR2" as const,
      habitat: "Marine, coastal waters",
      depth: "Surface to 100m"
    }
  ]
};

/**
 * Perform taxonomic classification against reference database
 */
export function classifySequence(querySequence: string): TaxonomicMatch | null {
  let bestMatch: TaxonomicMatch | null = null;
  let bestSimilarity = 0;

  for (const ref of mockReferenceDB.sequences) {
    const similarity = calculateSequenceSimilarity(querySequence, ref.sequence);
    
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = {
        sequence: querySequence,
        taxonomy: ref.taxonomy,
        similarity: similarity,
        database: ref.database,
        confidence: similarity > 90 ? 95 : similarity > 70 ? 80 : 60
      };
    }
  }

  return bestMatch;
}

/**
 * Quality control metrics for sequence data
 */
export function analyzeSequenceQuality(sequences: SequenceData[]) {
  const totalSequences = sequences.length;
  const avgLength = sequences.reduce((sum, seq) => sum + seq.length, 0) / totalSequences;
  const avgGC = sequences.reduce((sum, seq) => sum + seq.gcContent, 0) / totalSequences;
  
  const lengthDistribution = {
    short: sequences.filter(seq => seq.length < 200).length,
    medium: sequences.filter(seq => seq.length >= 200 && seq.length < 400).length,
    long: sequences.filter(seq => seq.length >= 400).length
  };

  return {
    totalSequences,
    averageLength: Math.round(avgLength),
    averageGCContent: Math.round(avgGC * 10) / 10,
    lengthDistribution,
    qualityPassed: sequences.filter(seq => seq.quality && seq.quality > 20).length
  };
}