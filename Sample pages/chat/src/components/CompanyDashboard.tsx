import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  Euro, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Target,
  Award,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CompanyData {
  cui: string;
  name: string;
  type: string;
  fiscalActivity: string;
  legalForm: string;
  naceCode: string;
  registration: string;
  city: string;
  county: string;
  address: string;
  employees: number;
  turnover: string;
  profit: string;
}

interface CompanyDashboardProps {
  companyData: CompanyData;
  onBack: () => void;
  onChatWithAI: (programName: string) => void;
}

export function CompanyDashboard({ companyData, onBack, onChatWithAI }: CompanyDashboardProps) {
  const [expandedPrograms, setExpandedPrograms] = useState<number[]>([]);

  const toggleExpanded = (programId: number) => {
    setExpandedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'from-green-400 to-green-500';
    if (score >= 4) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const eligiblePrograms = [
    {
      id: 1,
      name: 'Green Technology Initiative',
      description: 'Support for companies developing or implementing environmentally friendly technologies, renewable energy solutions, and sustainable business practices.',
      scores: [8, 4],
      status: 'eligible',
      analysis: {
        eligible: [
          'Company operates in software development (NACE 6202) which qualifies for green tech digitalization',
          'Annual turnover of €22.5M meets program requirements (€1M-€50M)',
          'Medium-sized enterprise with 47 employees fits target demographic'
        ],
        challenging: [
          'Limited green technology experience in current business model',
          'Need to demonstrate environmental impact of proposed project'
        ],
        disqualified: []
      }
    },
    {
      id: 2,
      name: 'Digital Transformation Grant',
      description: 'Accelerate your company\'s digital transformation with funding for technology adoption, digital infrastructure, and employee training in digital skills.',
      scores: [9, 3],
      status: 'eligible',
      analysis: {
        eligible: [
          'Perfect match: Software development company with proven digital expertise',
          'Strong financial position with €2M+ profit demonstrates project sustainability',
          'Located in Bucharest - eligible development region'
        ],
        challenging: [
          'High competition due to perfect sector match',
          'Must demonstrate significant innovation beyond current capabilities'
        ],
        disqualified: []
      }
    },
    {
      id: 3,
      name: 'SME Innovation Support',
      description: 'Support for small and medium enterprises to develop innovative products and services. Focus on digitalization, green technology, and export capabilities enhancement.',
      scores: [7, 7],
      status: 'eligible',
      analysis: {
        eligible: [
          'SME classification perfectly matches program criteria',
          'Technology sector aligns with innovation focus areas',
          'Company age (7+ years) shows stability for innovation projects'
        ],
        challenging: [
          'Balanced scoring means moderate competition expected',
          'Export capabilities enhancement may require new market research'
        ],
        disqualified: []
      }
    }
  ];

  const ineligiblePrograms = [
    {
      id: 4,
      name: 'Manufacturing Excellence Program',
      description: 'Support for traditional manufacturing companies to upgrade equipment and processes.',
      scores: [2, 8],
      status: 'ineligible',
      analysis: {
        eligible: [],
        challenging: [
          'Company has strong financial capacity for equipment investment'
        ],
        disqualified: [
          'NACE code 6202 (Software Development) not eligible for manufacturing program',
          'No physical manufacturing operations or equipment to upgrade',
          'Business model incompatible with program objectives'
        ]
      }
    },
    {
      id: 5,
      name: 'Rural Development Initiative',
      description: 'Funding for businesses operating in rural areas to boost local economic development.',
      scores: [6, 1],
      status: 'ineligible',
      analysis: {
        eligible: [
          'Company size and sector could benefit rural economic development'
        ],
        challenging: [],
        disqualified: [
          'Located in Bucharest (urban area) - program restricted to rural regions',
          'No rural operations or development plans demonstrated'
        ]
      }
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-blue-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-60 right-16 w-24 h-24 bg-gradient-to-br from-yellow-200/40 to-yellow-300/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-purple-300/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 right-8 w-28 h-28 bg-gradient-to-br from-green-200/30 to-green-300/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  {companyData.name}
                </h1>
                <p className="text-muted-foreground mt-1">{companyData.type}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live API Data
            </Badge>
          </div>
        </div>

        {/* Dashboard Layout with Clear Separation */}
        <div className="space-y-8">
          {/* Company Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Details */}
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/10 shadow-lg shadow-blue-500/5">
              <h3 className="mb-4 uppercase tracking-wide text-sm font-medium text-muted-foreground">Company Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <label className="text-muted-foreground text-xs">CUI</label>
                    <p className="text-sm font-medium">{companyData.cui}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs">City</label>
                    <p className="text-sm font-medium">{companyData.city}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs">Fiscal Activity</label>
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs mt-1">
                      {companyData.fiscalActivity}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs">County</label>
                    <p className="text-sm font-medium">{companyData.county}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs">Legal Form</label>
                    <p className="text-sm font-medium">{companyData.legalForm}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs">NACE Code</label>
                    <p className="text-sm font-medium">{companyData.naceCode}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/30">
                  <label className="text-muted-foreground text-xs">Registration</label>
                  <p className="text-sm font-medium">{companyData.registration}</p>
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/10 shadow-lg shadow-blue-500/5">
              <h3 className="mb-4 uppercase tracking-wide text-sm font-medium text-muted-foreground">Location</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-xs">{companyData.city}</label>
                  <p className="text-sm font-medium">{companyData.city}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs">Employees</label>
                  <p className="text-sm font-medium text-blue-600">{companyData.employees} employees</p>
                </div>
                <div className="pt-2 border-t border-border/30">
                  <label className="text-muted-foreground text-xs">Address</label>
                  <p className="text-sm">{companyData.address}</p>
                </div>
              </div>
            </Card>

            {/* Financial Overview */}
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/10 shadow-lg shadow-blue-500/5">
              <h3 className="mb-4 uppercase tracking-wide text-sm font-medium text-muted-foreground">Financial Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-xs">Turnover</label>
                  <p className="text-sm font-medium">{companyData.turnover}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs">Profit</label>
                  <p className="text-sm font-medium text-green-600">{companyData.profit}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Programs Section - Full Width */}
          <div className="space-y-6">
            {/* Eligible Programs */}
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/10 shadow-lg shadow-blue-500/5">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="text-green-600 uppercase tracking-wide text-sm font-medium">Eligible Programs</h3>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  {eligiblePrograms.length} programs
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {eligiblePrograms.map((program) => (
                  <div key={program.id} className="border border-border/30 rounded-xl p-5 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:border-blue-200/50 hover:shadow-md transition-all duration-200">
                    <h4 className="font-medium text-foreground mb-3">{program.name}</h4>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{program.description}</p>
                    
                    <div className="space-y-4">
                      {/* Scoring Section */}
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium">
                          ELIGIBLE
                        </Badge>
                        <div className="flex gap-1 ml-auto">
                          {program.scores.map((score, scoreIndex) => (
                            <div key={scoreIndex} className={`w-6 h-6 bg-gradient-to-br ${getScoreColor(score)} rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
                              {score}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Analysis Toggle */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleExpanded(program.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 text-xs w-full justify-between p-2"
                      >
                        <span>View detailed analysis</span>
                        {expandedPrograms.includes(program.id) ? 
                          <ChevronUp className="w-3 h-3" /> : 
                          <ChevronDown className="w-3 h-3" />
                        }
                      </Button>

                      {/* Expanded Analysis */}
                      {expandedPrograms.includes(program.id) && (
                        <div className="mt-4 p-4 bg-white/60 rounded-lg border border-border/20 space-y-3">
                          {/* Eligible Reasons */}
                          {program.analysis.eligible.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-green-700">Why you're eligible</span>
                              </div>
                              <ul className="space-y-1 ml-5">
                                {program.analysis.eligible.map((reason, index) => (
                                  <li key={index} className="text-xs text-muted-foreground leading-relaxed">• {reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Challenging Aspects */}
                          {program.analysis.challenging.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-xs font-medium text-yellow-700">Challenging aspects</span>
                              </div>
                              <ul className="space-y-1 ml-5">
                                {program.analysis.challenging.map((reason, index) => (
                                  <li key={index} className="text-xs text-muted-foreground leading-relaxed">• {reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs hover:bg-accent/30"
                        >
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          onClick={() => onChatWithAI(program.name)}
                        >
                          Chat with AI
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Ineligible Programs */}
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/10 shadow-lg shadow-blue-500/5">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-gray-600" />
                <h3 className="text-gray-600 uppercase tracking-wide text-sm font-medium">Ineligible Programs</h3>
                <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                  {ineligiblePrograms.length} programs
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ineligiblePrograms.map((program) => (
                  <div key={program.id} className="border border-gray-200/50 rounded-xl p-5 bg-gray-50/30 backdrop-blur-sm hover:bg-gray-50/50 hover:border-gray-300/50 transition-all duration-200">
                    <h4 className="font-medium text-foreground mb-3">{program.name}</h4>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{program.description}</p>
                    
                    <div className="space-y-4">
                      {/* Scoring Section */}
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs font-medium">
                          NOT ELIGIBLE
                        </Badge>
                        <div className="flex gap-1 ml-auto">
                          {program.scores.map((score, scoreIndex) => (
                            <div key={scoreIndex} className={`w-6 h-6 bg-gradient-to-br ${getScoreColor(score)} rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
                              {score}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Analysis Toggle */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleExpanded(program.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 text-xs w-full justify-between p-2"
                      >
                        <span>View detailed analysis</span>
                        {expandedPrograms.includes(program.id) ? 
                          <ChevronUp className="w-3 h-3" /> : 
                          <ChevronDown className="w-3 h-3" />
                        }
                      </Button>

                      {/* Expanded Analysis */}
                      {expandedPrograms.includes(program.id) && (
                        <div className="mt-4 p-4 bg-white/60 rounded-lg border border-border/20 space-y-3">
                          {/* Eligible Reasons */}
                          {program.analysis.eligible.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-green-700">Positive aspects</span>
                              </div>
                              <ul className="space-y-1 ml-5">
                                {program.analysis.eligible.map((reason, index) => (
                                  <li key={index} className="text-xs text-muted-foreground leading-relaxed">• {reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Challenging Aspects */}
                          {program.analysis.challenging.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-xs font-medium text-yellow-700">Challenging aspects</span>
                              </div>
                              <ul className="space-y-1 ml-5">
                                {program.analysis.challenging.map((reason, index) => (
                                  <li key={index} className="text-xs text-muted-foreground leading-relaxed">• {reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Disqualified Reasons */}
                          {program.analysis.disqualified.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-xs font-medium text-red-700">Why you're not eligible</span>
                              </div>
                              <ul className="space-y-1 ml-5">
                                {program.analysis.disqualified.map((reason, index) => (
                                  <li key={index} className="text-xs text-muted-foreground leading-relaxed">• {reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs hover:bg-accent/30"
                          disabled
                        >
                          Not Available
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 text-xs border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}