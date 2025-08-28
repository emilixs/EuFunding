import { ArrowLeft, ChevronDown, CheckCircle, XCircle, MessageSquare, Eye, Building2 } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./components/ui/collapsible";
import { Separator } from "./components/ui/separator";
import { useState } from "react";

export default function App() {
  const [ineligibleOpen, setIneligibleOpen] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  const toggleProgram = (programId: string) => {
    setExpandedProgram(expandedProgram === programId ? null : programId);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center gap-3 text-slate-600 hover:text-slate-800 cursor-pointer transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Search</span>
        </div>

        {/* Company Profile Card */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">NEURONY SOLUTIONS SRL</h1>
                    <p className="text-sm text-slate-500 mt-1">Software Development Company</p>
                  </div>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-3 py-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                Live API Data
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Company Information */}
              <div className="space-y-5">
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Company Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">CUI</span>
                    <span className="font-medium text-slate-900">37108517</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Fiscal Activity</span>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Legal Form</span>
                    <span className="font-medium text-slate-900">SRL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">NACE Code</span>
                    <span className="font-medium text-slate-900">6202</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Registration</span>
                    <span className="font-medium text-slate-900">Feb 27, 2017</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-5">
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Location</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">City</span>
                    <span className="font-medium text-slate-900">Sectorul 3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">County</span>
                    <span className="font-medium text-slate-900">București</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-slate-500 text-sm">Address</span>
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      STR. Alexander von Humboldt, Nr. 18<br />
                      Et. 2, Ap. CAM. 2, Cod 031472
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="space-y-5">
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Financial Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Employees</span>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      47 employees
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Turnover</span>
                    <span className="font-semibold text-slate-900">€22,538,871</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Profit</span>
                    <span className="font-semibold text-emerald-600">€2,008,333</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligible Programs Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-emerald-700">Eligible Programs</h2>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              3 programs
            </Badge>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Green Technology Initiative */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
                      <h3 className="font-semibold text-slate-900">Green Technology Initiative</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Support for companies developing or implementing environmentally friendly 
                      technologies, renewable energy solutions, and sustainable business practices.
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">🤖 AI Analysis:</span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
                      ✓ ELIGIBLE
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                      7
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                      4
                    </Badge>
                  </div>
                </div>

                <Collapsible 
                  open={expandedProgram === "green-tech"} 
                  onOpenChange={() => toggleProgram("green-tech")}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                      <span>View detailed AI analysis</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        expandedProgram === "green-tech" ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-4 space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="font-medium text-amber-700">Missing Information (3)</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-4">
                        • Specific criteria for Green Technology Initiative cannot be validated as they were not provided in documentation
                      </p>
                      <Separator className="my-2" />
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="font-medium text-emerald-700">Criteria Met (5)</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-slate-300 hover:bg-slate-50">
                      <Eye className="w-3 h-3 mr-1.5" />
                      Details
                    </Button>
                    <Button size="sm" className="h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="w-3 h-3 mr-1.5" />
                      Chat with AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Transformation Grant */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
                      <h3 className="font-semibold text-slate-900">Digital Transformation Grant</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Accelerate your company's digital transformation with funding for technology 
                      adoption, digital infrastructure, and employee training in digital skills.
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">🤖 AI Analysis:</span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
                      ✓ ELIGIBLE
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                      8
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                      3
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                  View detailed AI analysis
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-slate-300 hover:bg-slate-50">
                      <Eye className="w-3 h-3 mr-1.5" />
                      Details
                    </Button>
                    <Button size="sm" className="h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="w-3 h-3 mr-1.5" />
                      Chat with AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SME Innovation Support - Full Width */}
          <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
                    <h3 className="font-semibold text-slate-900">SME Innovation Support</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                    Support for small and medium enterprises to develop innovative products and 
                    services. Focus on digitalization, green technology, and export capabilities enhancement.
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">🤖 AI Analysis:</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
                    ✓ ELIGIBLE
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                    7
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                    7
                  </Badge>
                </div>
              </div>

              <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                View detailed AI analysis
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-slate-300 hover:bg-slate-50">
                    <Eye className="w-3 h-3 mr-1.5" />
                    Details
                  </Button>
                  <Button size="sm" className="h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="w-3 h-3 mr-1.5" />
                    Chat with AI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ineligible Programs Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-600">Ineligible Programs</h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
              2 programs
            </Badge>
          </div>

          <Collapsible open={ineligibleOpen} onOpenChange={setIneligibleOpen}>
            <CollapsibleTrigger className="w-full group">
              <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 group-hover:text-slate-900">
                      View ineligible programs and reasons
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                      ineligibleOpen ? 'rotate-180' : ''
                    }`} />
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-4 border-0 shadow-sm bg-slate-50">
                <CardContent className="p-6">
                  <p className="text-slate-600">
                    2 programs are not eligible for this company based on current criteria analysis. 
                    Detailed reasoning available upon request.
                  </p>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}