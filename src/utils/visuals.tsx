import React from 'react';

// Structural Shopdrawing Schematic (Rebar Beam/Column Connection Detail)
export const TechnicalDrawingBeamRebar: React.FC<{ className?: string; interactive?: boolean }> = ({ className = '', interactive = false }) => {
  return (
    <div className={`relative w-full overflow-hidden bg-[#181818] border border-[#333] text-[#A0A09A] p-6 font-mono-tech select-none ${className}`}>
      {/* CAD Grid Overlay */}
      <div className="absolute inset-0 bg-blueprint-dark opacity-30 pointer-events-none" />
      
      {/* Title Block Header */}
      <div className="relative z-10 flex justify-between items-start border-b border-[#333] pb-3 mb-4 text-xs">
        <div>
          <span className="text-[#F27D26] font-semibold tracking-wider">DWG-RC-04 //</span> TYPICAL BEAM-COLUMN TRANSFER JOINT
          <p className="text-[10px] text-[#777] mt-0.5">SCALE 1:20 • HIGH-DENSITY REBAR DETAILING • SPEC: TCVN 5574:2018</p>
        </div>
        <div className="text-right text-[10px] text-[#888]">
          <span className="bg-[#242424] px-2 py-0.5 border border-[#444] text-[#DDD]">APPROVED SHOPDRAWING</span>
        </div>
      </div>

      {/* SVG Technical Drawing */}
      <div className="relative z-10 w-full aspect-[16/9] flex items-center justify-center">
        <svg viewBox="0 0 800 450" className="w-full h-full stroke-current" fill="none">
          {/* Coordinate axes */}
          <line x1="40" y1="410" x2="760" y2="410" stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="400" y1="30" x2="400" y2="420" stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
          
          {/* Concrete Column Outline */}
          <rect x="340" y="40" width="120" height="370" stroke="#666" strokeWidth="2" fill="#202020" fillOpacity="0.6" />
          
          {/* Left Concrete Beam Outline */}
          <rect x="60" y="150" width="280" height="140" stroke="#666" strokeWidth="2" fill="#202020" fillOpacity="0.6" />
          
          {/* Right Concrete Beam Outline */}
          <rect x="460" y="150" width="280" height="140" stroke="#666" strokeWidth="2" fill="#202020" fillOpacity="0.6" />

          {/* Column Main Vertical Bars (Red/Orange accent for primary rebar) */}
          <line x1="355" y1="40" x2="355" y2="410" stroke="#F27D26" strokeWidth="3.5" />
          <line x1="375" y1="40" x2="375" y2="410" stroke="#F27D26" strokeWidth="2.5" />
          <line x1="425" y1="40" x2="425" y2="410" stroke="#F27D26" strokeWidth="2.5" />
          <line x1="445" y1="40" x2="445" y2="410" stroke="#F27D26" strokeWidth="3.5" />

          {/* Column Ties / Stirrups */}
          {[60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390].map((y, idx) => (
            <line key={`tie-${idx}`} x1="348" y1={y} x2="452" y2={y} stroke="#888" strokeWidth="1.5" />
          ))}

          {/* Beam Top Longitudinal Bars passing through column with anchorage hooks */}
          <path d="M 60 165 L 435 165 L 435 240" stroke="#E05624" strokeWidth="3" fill="none" />
          <path d="M 740 165 L 365 165 L 365 240" stroke="#E05624" strokeWidth="3" fill="none" />

          {/* Beam Bottom Longitudinal Bars */}
          <path d="M 60 275 L 435 275 L 435 210" stroke="#E05624" strokeWidth="3" fill="none" />
          <path d="M 740 275 L 365 275 L 365 210" stroke="#E05624" strokeWidth="3" fill="none" />

          {/* Beam Stirrups with 135 deg seismic hooks */}
          {[90, 120, 150, 180, 210, 240, 270, 300].map((x, idx) => (
            <rect key={`stirrup-l-${idx}`} x={x} y="160" width="12" height="120" stroke="#AAA" strokeWidth="1.2" strokeDasharray="3 2" />
          ))}
          {[480, 510, 540, 570, 600, 630, 660, 690].map((x, idx) => (
            <rect key={`stirrup-r-${idx}`} x={x} y="160" width="12" height="120" stroke="#AAA" strokeWidth="1.2" strokeDasharray="3 2" />
          ))}

          {/* Dimension Witness Lines */}
          <g stroke="#555" strokeWidth="1">
            <line x1="60" y1="310" x2="340" y2="310" />
            <line x1="60" y1="305" x2="60" y2="315" />
            <line x1="340" y1="305" x2="340" y2="315" />
            <text x="200" y="325" fill="#888" fontSize="11" textAnchor="middle">L/3 CRITICAL CONFINEMENT ZONE</text>
            
            <line x1="340" y1="425" x2="460" y2="425" />
            <line x1="340" y1="420" x2="340" y2="430" />
            <line x1="460" y1="420" x2="460" y2="430" />
            <text x="400" y="440" fill="#F27D26" fontSize="11" textAnchor="middle">COL C1: 600x600mm</text>
          </g>

          {/* Rebar Callout Tags */}
          <g fill="#F27D26" fontSize="10">
            <circle cx="200" cy="165" r="3" />
            <line x1="200" y1="165" x2="160" y2="120" stroke="#F27D26" strokeWidth="1" />
            <line x1="160" y1="120" x2="100" y2="120" stroke="#F27D26" strokeWidth="1" />
            <text x="95" y="116" fill="#FFF" textAnchor="start">4Φ25 TOP (GR.420)</text>

            <circle cx="600" cy="275" r="3" />
            <line x1="600" y1="275" x2="640" y2="330" stroke="#F27D26" strokeWidth="1" />
            <line x1="640" y1="330" x2="710" y2="330" stroke="#F27D26" strokeWidth="1" />
            <text x="645" y="325" fill="#FFF" textAnchor="start">4Φ25 BOT + BBS OPTIMIZED</text>
          </g>
        </svg>
      </div>

      {/* Footer Notes */}
      <div className="relative z-10 mt-3 pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-[10px] text-[#777]">
        <div>DEBRIQ VERIFIED SHOPDRAWING • ZERO SITE CONGESTION</div>
        <div className="flex gap-4">
          <span>CONCRETE: C40/50</span>
          <span>STEEL: CB500-V</span>
        </div>
      </div>
    </div>
  );
};

// Architecture Finishing Detail (Waterproofing & Floor Junction Detail)
export const TechnicalDrawingFinishingJunction: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden bg-[#181818] border border-[#333] text-[#A0A09A] p-6 font-mono-tech select-none ${className}`}>
      <div className="absolute inset-0 bg-blueprint-dark opacity-30 pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start border-b border-[#333] pb-3 mb-4 text-xs">
        <div>
          <span className="text-[#F27D26] font-semibold tracking-wider">FIN-DET-02 //</span> ARCHITECTURAL WALL-FLOOR JUNCTION
          <p className="text-[10px] text-[#777] mt-0.5">DETAIL AT WET AREA • SKIRTING & WATERPROOFING MEMBRANE</p>
        </div>
        <div className="text-right text-[10px] text-[#888]">
          <span className="bg-[#242424] px-2 py-0.5 border border-[#444] text-[#DDD]">FINISH SPEC V.03</span>
        </div>
      </div>

      <div className="relative z-10 w-full aspect-[16/9] flex items-center justify-center">
        <svg viewBox="0 0 800 450" className="w-full h-full" fill="none">
          {/* Structural Concrete Slab */}
          <rect x="50" y="280" width="700" height="120" stroke="#666" strokeWidth="2" fill="#222" />
          
          {/* Rebar mesh inside slab */}
          <line x1="60" y1="340" x2="740" y2="340" stroke="#777" strokeDasharray="6 4" strokeWidth="1.5" />
          <line x1="60" y1="370" x2="740" y2="370" stroke="#777" strokeDasharray="6 4" strokeWidth="1.5" />

          {/* Brick Wall Section */}
          <rect x="180" y="50" width="160" height="230" stroke="#666" strokeWidth="2" fill="#2A221C" />
          
          {/* Brick hatching */}
          {[80, 110, 140, 170, 200, 230, 260].map((y, idx) => (
            <line key={`brick-${idx}`} x1="180" y1={y} x2="340" y2={y} stroke="#554433" strokeWidth="1.5" />
          ))}

          {/* Plaster Layer */}
          <rect x="165" y="50" width="15" height="230" stroke="#777" strokeWidth="1" fill="#303030" />
          <rect x="340" y="50" width="15" height="230" stroke="#777" strokeWidth="1" fill="#303030" />

          {/* Waterproofing Membrane (Orange Accent Line turning up wall 300mm) */}
          <path d="M 150 180 L 150 280 L 750 280" stroke="#F27D26" strokeWidth="3" fill="none" strokeLinecap="round" />
          
          {/* Mortar Screed Slope */}
          <path d="M 150 280 L 750 280 L 750 250 L 150 240 Z" stroke="#666" strokeWidth="1" fill="#2B2B2B" opacity="0.8" />
          
          {/* Granite Tiles Layer */}
          {[150, 330, 510, 690].map((x, idx) => (
            <g key={`tile-${idx}`}>
              <rect x={x} y="235" width="176" height="8" stroke="#888" strokeWidth="1.2" fill="#3A3A3A" />
              <line x1={x + 178} y1="233" x2={x + 178} y2="245" stroke="#F27D26" strokeWidth="1.5" />
            </g>
          ))}

          {/* Skirting Tile against wall */}
          <rect x="145" y="225" width="12" height="60" stroke="#E05624" strokeWidth="1.5" fill="#151515" />

          {/* Annotations */}
          <g fontSize="10" fill="#DDD">
            <line x1="140" y1="180" x2="80" y2="180" stroke="#F27D26" />
            <text x="75" y="176" fill="#F27D26" textAnchor="end">WATERPROOFING UPSTAND H=300mm</text>

            <line x1="340" y1="90" x2="420" y2="90" stroke="#888" />
            <text x="425" y="94" fill="#AAA">WALL: TUYNEL BRICK + 15mm PLASTER</text>

            <line x1="550" y1="240" x2="620" y2="180" stroke="#888" />
            <text x="625" y="184" fill="#AAA">FINISH: GRANITE 600x600mm ANTI-SLIP</text>

            <line x1="500" y1="260" x2="500" y2="200" stroke="#888" />
            <text x="500" y="195" fill="#888" textAnchor="middle">SLOPE i=1.5% TO FLOOR DRAIN</text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 mt-3 pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-[10px] text-[#777]">
        <div>ARCHITECTURAL DETAIL CATALOG • SHOPDRAWING COMPLIANCE</div>
        <div>TOLERANCE ±2mm</div>
      </div>
    </div>
  );
};

// BIM Coordination Isometric Schematic (3D Clashing Resolution)
export const TechnicalDrawingBIMClash: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden bg-[#181818] border border-[#333] text-[#A0A09A] p-6 font-mono-tech select-none ${className}`}>
      <div className="absolute inset-0 bg-blueprint-dark opacity-30 pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start border-b border-[#333] pb-3 mb-4 text-xs">
        <div>
          <span className="text-[#F27D26] font-semibold tracking-wider">BIM-REVIT-01 //</span> 3D MULTI-DISCIPLINARY COORDINATION
          <p className="text-[10px] text-[#777] mt-0.5">STRUCTURAL BEAM PENETRATION // ZERO SITE CLASHES</p>
        </div>
        <div className="text-right text-[10px] text-[#888]">
          <span className="bg-[#242424] px-2 py-0.5 border border-[#444] text-[#DDD]">REVIT 2024 / NAVISWORKS</span>
        </div>
      </div>

      <div className="relative z-10 w-full aspect-[16/9] flex items-center justify-center">
        <svg viewBox="0 0 800 450" className="w-full h-full" fill="none">
          {/* Isometric Structural Beam (Grey Wireframe & Shading) */}
          <g stroke="#666" strokeWidth="1.5">
            {/* Front Beam Face */}
            <polygon points="150,150 550,70 550,220 150,300" fill="#262626" fillOpacity="0.8" />
            {/* Top Beam Face */}
            <polygon points="150,150 250,90 650,10 550,70" fill="#333" fillOpacity="0.9" />
            {/* Right Beam Face */}
            <polygon points="550,70 650,10 650,160 550,220" fill="#1F1F1F" />
          </g>

          {/* MEP Duct penetrating the Beam through sleeve opening (Blue & Orange highlight) */}
          <g stroke="#3B82F6" strokeWidth="2">
            {/* Duct Body passing through */}
            <polygon points="200,280 280,230 560,150 480,200" fill="#1D4ED8" fillOpacity="0.4" />
            <polygon points="100,220 180,170 460,90 380,140" fill="#2563EB" fillOpacity="0.5" />
          </g>

          {/* Rebar sleeve reinforcement collar in orange around penetration */}
          <polygon points="320,230 400,210 400,270 320,290" stroke="#F27D26" strokeWidth="2.5" fill="#F27D26" fillOpacity="0.2" />
          <line x1="300" y1="210" x2="420" y2="290" stroke="#F27D26" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="300" y1="290" x2="420" y2="210" stroke="#F27D26" strokeWidth="2" strokeDasharray="3 3" />

          {/* Coordinate system node HUD */}
          <g stroke="#F27D26" strokeWidth="1.5">
            <line x1="680" y1="360" x2="740" y2="360" />
            <line x1="680" y1="360" x2="680" y2="300" />
            <line x1="680" y1="360" x2="640" y2="400" />
            <text x="745" y="364" fill="#F27D26" fontSize="10">X</text>
            <text x="676" y="295" fill="#F27D26" fontSize="10">Z</text>
            <text x="630" y="405" fill="#F27D26" fontSize="10">Y</text>
          </g>

          {/* BIM metadata callouts */}
          <g fontSize="11" fill="#EEE">
            <text x="120" y="310">DUCT: 600x300mm (AIR SUPPLY)</text>
            <text x="120" y="325" fill="#F27D26">OPENING SLEEVE: 700x400mm w/ DIAGONAL TRIM BARS</text>
            <text x="120" y="340" fill="#777">LOD 350 • REVIT FAMILY PARAMETRIC</text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 mt-3 pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-[10px] text-[#777]">
        <div>NAVISWORKS CLASH DETECTED & RESOLVED IN PRE-CONSTRUCTION</div>
        <div>STATUS: CLASH FREE (0 CONFLICTS)</div>
      </div>
    </div>
  );
};

// Construction Method Statement (Top-down Basement Excavation & Diaphragm Wall)
export const TechnicalDrawingMethodStatement: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden bg-[#181818] border border-[#333] text-[#A0A09A] p-6 font-mono-tech select-none ${className}`}>
      <div className="absolute inset-0 bg-blueprint-dark opacity-30 pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start border-b border-[#333] pb-3 mb-4 text-xs">
        <div>
          <span className="text-[#F27D26] font-semibold tracking-wider">MTH-TOPDOWN-03 //</span> DEEP BASEMENT SEQUENCING
          <p className="text-[10px] text-[#777] mt-0.5">SEMI TOP-DOWN METHOD • DIAPHRAGM WALL & STEEL KINGPOST</p>
        </div>
        <div className="text-right text-[10px] text-[#888]">
          <span className="bg-[#242424] px-2 py-0.5 border border-[#444] text-[#DDD]">METHOD DRAWING</span>
        </div>
      </div>

      <div className="relative z-10 w-full aspect-[16/9] flex items-center justify-center">
        <svg viewBox="0 0 800 450" className="w-full h-full" fill="none">
          {/* Diaphragm Wall Left & Right */}
          <rect x="80" y="40" width="40" height="370" stroke="#666" strokeWidth="2" fill="#2D2D2D" />
          <rect x="680" y="40" width="40" height="370" stroke="#666" strokeWidth="2" fill="#2D2D2D" />
          <text x="100" y="240" fill="#888" fontSize="10" transform="rotate(-90 100,240)" textAnchor="middle">D-WALL T=800mm (DEPTH=32m)</text>
          <text x="700" y="240" fill="#888" fontSize="10" transform="rotate(90 700,240)" textAnchor="middle">D-WALL T=800mm (DEPTH=32m)</text>

          {/* Kingposts (Steel Columns) in center */}
          <rect x="280" y="40" width="20" height="370" stroke="#F27D26" strokeWidth="2" fill="#382218" />
          <rect x="500" y="40" width="20" height="370" stroke="#F27D26" strokeWidth="2" fill="#382218" />

          {/* Ground Floor Slab (Level ±0.000) */}
          <rect x="120" y="90" width="560" height="25" stroke="#888" strokeWidth="1.5" fill="#333" />

          {/* Soil Excavation Level (Phase 2) */}
          <path d="M 120 220 Q 200 230 400 220 T 680 220 L 680 410 L 120 410 Z" fill="#1C1814" stroke="#443322" strokeWidth="1" />
          <text x="400" y="280" fill="#F27D26" fontSize="12" textAnchor="middle">▼ EXCAVATION PHASE TO BASEMENT B2 (-8.500m)</text>

          {/* Steel Strutting / Kingpost Bracing */}
          <line x1="120" y1="95" x2="280" y2="105" stroke="#F27D26" strokeWidth="2" />
          <line x1="300" y1="105" x2="500" y2="105" stroke="#F27D26" strokeWidth="2" />
          <line x1="520" y1="105" x2="680" y2="95" stroke="#F27D26" strokeWidth="2" />

          {/* Grab / Excavator indicator */}
          <g stroke="#EAB308" strokeWidth="1.5">
            <circle cx="400" cy="180" r="12" fill="#854D0E" fillOpacity="0.3" />
            <text x="400" y="184" fill="#FDE047" fontSize="10" textAnchor="middle">EXCAVATOR</text>
          </g>

          {/* Elevation Markers */}
          <g fill="#F27D26" fontSize="10">
            <text x="50" y="95">±0.000</text>
            <text x="50" y="225">-4.200</text>
            <text x="50" y="375">-8.500</text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 mt-3 pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-[10px] text-[#777]">
        <div>PHASE 2 METHOD SUBMISSION // CONTRACTOR: DEBRIQ TECH</div>
        <div>MONITORING: INCLINOMETER I-01 TO I-06 PASS</div>
      </div>
    </div>
  );
};

// Aliases for page imports
export const TechnicalFinishingDetail = TechnicalDrawingFinishingJunction;
export const TechnicalBimClashNode = TechnicalDrawingBIMClash;
export const TechnicalBasementMethod = TechnicalDrawingMethodStatement;

