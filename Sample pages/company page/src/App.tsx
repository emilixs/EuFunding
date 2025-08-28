import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Search, Euro, Building2, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
import { CompanyDashboard } from './components/CompanyDashboard';
import { AIChat } from './components/AIChat';

export default function App() {
  const [cui, setCui] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'ai-chat'>('landing');
  const [companyData, setCompanyData] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cui.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock company data based on the design
      const mockCompanyData = {
        cui: '37108517',
        name: 'NEURONY SOLUTIONS SRL',
        type: 'Software Development Company',
        fiscalActivity: 'Active',
        legalForm: 'SRL',
        naceCode: '6202',
        registration: 'Feb 27, 2017',
        city: 'Sectorul 3',
        county: 'București',
        address: 'STR. Alexander von Humboldt, Nr. 18, Et. 2, Ap. CAM_3, Cod 031472',
        employees: 47,
        turnover: '€22,538,871',
        profit: '€2,008,333'
      };
      setCompanyData(mockCompanyData);
      setCurrentPage('dashboard');
    }, 2000);
  };

  const formatCUI = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Ensure it starts with RO if it doesn't already
    if (cleaned.length > 0 && !cleaned.startsWith('RO')) {
      return 'RO' + cleaned;
    }
    
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCUI(e.target.value);
    setCui(formatted);
  };

  const handleChatNavigation = (programName: string) => {
    setSelectedProgram(programName);
    setCurrentPage('ai-chat');
  };

  if (currentPage === 'dashboard') {
    return <CompanyDashboard companyData={companyData} onBack={() => setCurrentPage('landing')} onChatWithAI={handleChatNavigation} />;
  }

  if (currentPage === 'ai-chat') {
    return (
      <AIChat 
        programName={selectedProgram}
        companyName={companyData?.name || 'Your Company'}
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-blue-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-60 right-16 w-24 h-24 bg-gradient-to-br from-yellow-200/40 to-yellow-300/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-purple-300/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 right-8 w-28 h-28 bg-gradient-to-br from-green-200/30 to-green-300/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header section with abstract logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                {/* Abstract geometric logo */}
                <div className="w-20 h-20 relative">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300/60 to-purple-300/50 rounded-full blur-xl"></div>
                  
                  {/* Main hexagonal structure */}
                  <div className="absolute inset-2 relative">
                    {/* Primary hexagon */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/70 to-yellow-400/60 transform rotate-12 rounded-lg blur-sm"></div>
                    
                    {/* Secondary hexagon */}
                    <div className="absolute inset-1 bg-gradient-to-tr from-purple-400/75 to-blue-500/65 transform -rotate-12 rounded-lg blur-xs"></div>
                    
                    {/* Tertiary layer */}
                    <div className="absolute inset-2 bg-gradient-to-bl from-yellow-500/60 to-green-400/50 transform rotate-45 rounded-md"></div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-gradient-to-br from-blue-500/80 to-blue-600/70 rounded-full blur-[0.5px]"></div>
                  <div className="absolute bottom-2 left-1 w-1 h-1 bg-gradient-to-br from-yellow-500/75 to-yellow-600/65 rounded-full blur-[0.5px]"></div>
                  <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-gradient-to-br from-purple-500/85 to-purple-600/75 rounded-full"></div>
                  <div className="absolute bottom-1 right-1 w-1 h-1 bg-gradient-to-br from-green-500/70 to-green-600/60 rounded-full blur-[0.5px]"></div>
                  
                  {/* Center focal point */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-gradient-to-br from-white/90 to-blue-100/80 rounded-full shadow-md backdrop-blur-sm border border-white/40"></div>
                  </div>
                  
                  {/* Orbital rings */}
                  <div className="absolute inset-3 border border-blue-300/50 rounded-full"></div>
                  <div className="absolute inset-5 border border-purple-300/40 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-foreground mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent whitespace-nowrap">
              Verificare Finanțare UE
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Introduceți CUI-ul companiei dvs. românești pentru a descoperi instantaneu programele de finanțare UE eligibile.
            </p>
          </div>

          <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/10 shadow-lg shadow-blue-500/5 border border-blue-100/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <label htmlFor="cui" className="text-foreground">
                    CUI Companie
                  </label>
                </div>
                <div className="relative">
                  <Input
                    id="cui"
                    type="text"
                    value={cui}
                    onChange={handleInputChange}
                    placeholder="Introduceți CUI (ex., RO12345678)"
                    className="bg-white/50 border border-blue-200/30 text-foreground placeholder:text-muted-foreground focus:ring-blue-500 focus:border-blue-400/50 pl-4 pr-12 py-3 rounded-xl transition-all duration-200 hover:border-blue-300/50"
                    disabled={isLoading}
                    maxLength={15}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg shadow-blue-500/25"
                disabled={isLoading || !cui.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Se caută...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Caută Finanțări Eligibile</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-blue-100/50">
              <div className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  Vom prelua datele companiei dvs. din surse oficiale și vom analiza eligibilitatea pentru programele de finanțare UE active.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature highlights */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">Date Oficiale</p>
            </div>
            <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">Analiză Rapidă</p>
            </div>
            <div className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Euro className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">Finanțări UE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}