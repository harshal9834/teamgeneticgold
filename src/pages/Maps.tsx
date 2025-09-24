import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, MapPin, Layers, Filter, TrendingUp, Waves } from "lucide-react";

interface SampleLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  depth: number;
  temperature: number;
  taxaCount: number;
  dominantTaxa: string;
  noveltyScore: number;
  abundance: number;
}

const Maps = () => {
  const [locations, setLocations] = useState<SampleLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<SampleLocation | null>(null);
  const [mapFilter, setMapFilter] = useState<string>("all");
  const [depthLayer, setDepthLayer] = useState<string>("all");

  useEffect(() => {
    // Mock location data
    const mockLocations: SampleLocation[] = [
      {
        id: "LOC_001",
        name: "Pacific Abyssal Plain",
        latitude: 15.2435,
        longitude: -130.8765,
        depth: 3200,
        temperature: 2.1,
        taxaCount: 34,
        dominantTaxa: "Bacillariophyta",
        noveltyScore: 78.5,
        abundance: 12450
      },
      {
        id: "LOC_002", 
        name: "Mariana Trench Wall",
        latitude: 11.3733,
        longitude: 142.5917,
        depth: 4100,
        temperature: 1.8,
        taxaCount: 19,
        dominantTaxa: "Cercozoa",
        noveltyScore: 94.2,
        abundance: 8920
      },
      {
        id: "LOC_003",
        name: "Mid-Atlantic Ridge",
        latitude: 26.1367,
        longitude: -44.9833,
        depth: 2800,
        temperature: 3.4,
        taxaCount: 28,
        dominantTaxa: "Dinoflagellata",
        noveltyScore: 65.8,
        abundance: 15320
      },
      {
        id: "LOC_004",
        name: "Antarctic Deep Basin",
        latitude: -62.8333,
        longitude: -57.5167,
        depth: 3800,
        temperature: 0.9,
        taxaCount: 22,
        dominantTaxa: "Ciliophora",
        noveltyScore: 87.3,
        abundance: 6750
      },
      {
        id: "LOC_005",
        name: "Japan Trench",
        latitude: 36.2833,
        longitude: 142.3667,
        depth: 4500,
        temperature: 1.2,
        taxaCount: 16,
        dominantTaxa: "Novel Cluster",
        noveltyScore: 96.7,
        abundance: 3420
      }
    ];

    setLocations(mockLocations);
    setSelectedLocation(mockLocations[0]);
  }, []);

  const getNoveltyColor = (score: number) => {
    if (score >= 90) return "#dc2626"; // High novelty - red
    if (score >= 70) return "#ea580c"; // Medium novelty - orange  
    return "#059669"; // Low novelty - green
  };

  const getDepthColor = (depth: number) => {
    if (depth >= 4000) return "#1e40af"; // Hadal - dark blue
    if (depth >= 3000) return "#2563eb"; // Abyssal - blue
    if (depth >= 2000) return "#3b82f6"; // Bathyal - light blue
    return "#60a5fa"; // Mesopelagic - lightest blue
  };

  const filteredLocations = locations.filter(loc => {
    if (mapFilter === "high-novelty" && loc.noveltyScore < 80) return false;
    if (mapFilter === "deep" && loc.depth < 3000) return false;
    if (depthLayer !== "all") {
      const depthRange = parseInt(depthLayer);
      if (depthRange === 2000 && (loc.depth < 2000 || loc.depth >= 3000)) return false;
      if (depthRange === 3000 && (loc.depth < 3000 || loc.depth >= 4000)) return false;
      if (depthRange === 4000 && loc.depth < 4000) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Geographic Biodiversity Maps</h1>
          <p className="text-muted-foreground">
            3D visualization of sampling locations and taxonomic distribution
          </p>
        </div>

        {/* Map Controls */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span>Map Filters & Layers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dataset Filter</label>
                <Select value={mapFilter} onValueChange={setMapFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Samples</SelectItem>
                    <SelectItem value="high-novelty">High Novelty (&gt;80%)</SelectItem>
                    <SelectItem value="deep">Deep Sea (&gt;3000m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Depth Layer</label>
                <Select value={depthLayer} onValueChange={setDepthLayer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Depths</SelectItem>
                    <SelectItem value="2000">Bathyal (2000-3000m)</SelectItem>
                    <SelectItem value="3000">Abyssal (3000-4000m)</SelectItem>
                    <SelectItem value="4000">Hadal (&gt;4000m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Visualization</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Layers className="w-4 h-4 mr-2" />
                    3D Globe
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Waves className="w-4 h-4 mr-2" />
                    Bathymetry
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-bio">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Interactive 3D Map</span>
                </CardTitle>
                <CardDescription>
                  {filteredLocations.length} sampling locations displayed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-b from-sky-200 to-blue-900 rounded-lg relative overflow-hidden">
                  {/* Simplified 3D Globe representation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-blue-800 rounded-full relative shadow-2xl">
                      {/* Continents outline */}
                      <div className="absolute inset-4 bg-gradient-to-br from-green-600 to-green-800 rounded-full opacity-40" />
                      
                      {/* Sample points */}
                      {filteredLocations.map((location, index) => (
                        <div
                          key={location.id}
                          className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all hover:scale-150 ${
                            selectedLocation?.id === location.id ? 'scale-150 ring-4 ring-primary/50' : ''
                          }`}
                          style={{
                            backgroundColor: getNoveltyColor(location.noveltyScore),
                            left: `${30 + (index * 15) % 40}%`,
                            top: `${20 + (index * 20) % 60}%`,
                            animationDelay: `${index * 0.2}s`
                          }}
                          onClick={() => setSelectedLocation(location)}
                        />
                      ))}
                      
                      {/* Depth layers visualization */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent rounded-full" />
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                    <h4 className="text-sm font-bold text-gray-800">Novelty Score</h4>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                      <span className="text-gray-700">High (&gt;90%)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-orange-600" />
                      <span className="text-gray-700">Medium (70-90%)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      <span className="text-gray-700">Low (&lt;70%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Details */}
          <Card className="shadow-bio">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Location Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{selectedLocation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.latitude.toFixed(4)}°, {selectedLocation.longitude.toFixed(4)}°
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-depth rounded-lg">
                      <p className="text-lg font-bold text-foreground">{selectedLocation.depth}m</p>
                      <p className="text-xs text-muted-foreground">Depth</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-depth rounded-lg">
                      <p className="text-lg font-bold text-foreground">{selectedLocation.temperature}°C</p>
                      <p className="text-xs text-muted-foreground">Temperature</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Taxa Count:</span>
                      <Badge variant="secondary">{selectedLocation.taxaCount}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Dominant Taxa:</span>
                      <Badge className="bg-gradient-bio text-white">{selectedLocation.dominantTaxa}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Novelty Score:</span>
                      <Badge 
                        className="text-white border-0"
                        style={{ backgroundColor: getNoveltyColor(selectedLocation.noveltyScore) }}
                      >
                        {selectedLocation.noveltyScore.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Abundance:</span>
                      <span className="font-medium text-foreground">{selectedLocation.abundance.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button className="w-full bg-gradient-ocean hover:opacity-90" size="sm">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Full Analysis
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click on a sample location to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Summary */}
        <Card className="shadow-bio">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Geographic Distribution Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-depth rounded-lg">
                <p className="text-2xl font-bold text-foreground">{locations.length}</p>
                <p className="text-sm text-muted-foreground">Total Locations</p>
                <p className="text-xs text-muted-foreground mt-1">Across 5 ocean basins</p>
              </div>
              <div className="text-center p-4 bg-gradient-depth rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {(locations.reduce((sum, loc) => sum + loc.depth, 0) / locations.length).toFixed(0)}m
                </p>
                <p className="text-sm text-muted-foreground">Average Depth</p>
                <p className="text-xs text-muted-foreground mt-1">Range: 2800-4500m</p>
              </div>
              <div className="text-center p-4 bg-gradient-depth rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {locations.filter(loc => loc.noveltyScore >= 80).length}
                </p>
                <p className="text-sm text-muted-foreground">High Novelty Sites</p>
                <p className="text-xs text-muted-foreground mt-1">&gt;80% novelty score</p>
              </div>
              <div className="text-center p-4 bg-gradient-depth rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {locations.reduce((sum, loc) => sum + loc.taxaCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Taxa</p>
                <p className="text-xs text-muted-foreground mt-1">Across all samples</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Maps;