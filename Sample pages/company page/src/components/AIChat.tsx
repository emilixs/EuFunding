import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Send,
  Bot
} from 'lucide-react';

interface AIChatProps {
  programName: string;
  companyName: string;
  onBack: () => void;
}

interface ChatMessage {
  id: number;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export function AIChat({ programName, companyName, onBack }: AIChatProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content: `👋 Hello! I'm your dedicated EU Funding Assistant.\n\nI've analyzed your company profile and I'm here to help you with the **${programName}** program. I can provide personalized guidance based on ${companyName}'s specific situation.\n\n💬 **What would you like to discuss?**\n• Application requirements and eligibility\n• Step-by-step application process\n• Success factors and best practices\n• Required documentation checklist\n• Budget planning and co-financing\n• Timeline and key deadlines\n• Risk assessment and mitigation\n\nFeel free to ask me anything - I'm here to help you succeed! 🚀`,
      timestamp: new Date()
    }
  ]);



  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(textToSend),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('eligibility') || lowerQuestion.includes('requirements')) {
      return `Based on ${companyName}'s profile, here are the key eligibility requirements for ${programName}:\n\n✅ **You meet these requirements:**\n• SME classification (47 employees)\n• Annual turnover €22.5M (within program limits)\n• Technology sector alignment\n• Bucharest location (eligible region)\n\n⚠️ **Additional requirements to verify:**\n• Project must demonstrate innovation\n• Minimum 25% co-financing required\n• Environmental impact assessment needed\n• State aid compliance documentation\n\nWould you like me to explain any of these requirements in detail?`;
    }
    
    if (lowerQuestion.includes('success') || lowerQuestion.includes('factors')) {
      return `Here are the key success factors for ${programName} applications:\n\n🎯 **High Priority Factors:**\n• Clear innovation component (weights 25%)\n• Detailed financial projections\n• Strong technical team credentials\n• Environmental sustainability measures\n\n💡 **Your Company's Strengths:**\n• Established business (7+ years)\n• Strong financial position\n• Technology sector experience\n• EU market presence\n\n📈 **Improvement Areas:**\n• Green technology integration\n• Export market expansion plans\n• Digital transformation roadmap\n\nShall I help you develop any of these areas?`;
    }
    
    if (lowerQuestion.includes('documents') || lowerQuestion.includes('documentation')) {
      return `Required documentation for ${programName}:\n\n📋 **Company Documents:**\n• Certificate of incorporation\n• Latest financial statements (2022-2023)\n• Tax compliance certificates\n• Employee records and contracts\n\n📊 **Project Documents:**\n• Detailed project proposal\n• Technical specifications\n• Budget breakdown and timeline\n• Market analysis and business plan\n\n🏛️ **Legal Documents:**\n• State aid compliance declaration\n• Environmental impact assessment\n• Partnership agreements (if applicable)\n• Intellectual property documentation\n\n⏰ **Timeline:** Most documents must be submitted within 90 days of application. Would you like a detailed preparation checklist?`;
    }
    
    if (lowerQuestion.includes('risks') || lowerQuestion.includes('challenges')) {
      return `Key risks and challenges for ${programName}:\n\n⚠️ **Application Risks:**\n• High competition (acceptance rate ~35%)\n• Complex application process\n• Strict deadline compliance\n• Co-financing requirement (25% minimum)\n\n🚧 **Project Implementation Risks:**\n• Technology development delays\n• Market changes during project period\n• Regulatory compliance changes\n• Team retention and scaling\n\n✅ **Mitigation Strategies:**\n• Start application preparation early\n• Engage experienced consultants\n• Develop contingency plans\n• Establish strong project governance\n\n💪 **Your Risk Profile:** Medium-Low\n• Stable financial position\n• Experienced management team\n• Established market presence\n\nWould you like specific risk mitigation advice for your project?`;
    }
    
    return `Thank you for your question about "${question}". Based on ${companyName}'s profile and the ${programName} requirements, I can provide detailed guidance.\n\nCould you be more specific about what aspect you'd like to explore? For example:\n• Application process details\n• Budget planning assistance\n• Timeline and milestones\n• Technical requirements\n• Partnership opportunities\n\nI'm here to help you navigate this funding opportunity successfully!`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  AI Consultation
                </h1>
                <p className="text-muted-foreground mt-1">{programName} • {companyName}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online Assistant
            </Badge>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex flex-col h-[calc(100vh-250px)]">
          
          {/* Chat Messages Area */}
          <Card className="flex-1 overflow-y-auto p-6 bg-white/60 backdrop-blur-sm border-white/10 shadow-lg shadow-blue-500/5 mb-6">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'ai' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] ${msg.type === 'user' ? 'order-2' : ''}`}>
                    {/* Chat Bubble */}
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-md' 
                        : 'bg-white/80 backdrop-blur-sm border border-white/20 rounded-bl-md'
                    }`}>
                      <div className={`${msg.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                        {msg.content.split('\n').map((line, index) => {
                          if (line.startsWith('•')) {
                            return (
                              <div key={index} className="flex items-start gap-2 my-2">
                                <span className={`${msg.type === 'user' ? 'text-blue-200' : 'text-blue-500'} mt-0.5 flex-shrink-0 text-sm`}>•</span>
                                <span className="text-sm leading-relaxed">{line.substring(1).trim()}</span>
                              </div>
                            );
                          }
                          if (line.includes('**')) {
                            // Handle bold text
                            const parts = line.split('**');
                            return (
                              <p key={index} className="my-1 text-sm leading-relaxed">
                                {parts.map((part, partIndex) => 
                                  partIndex % 2 === 1 ? 
                                    <strong key={partIndex} className="font-semibold">{part}</strong> : 
                                    part
                                )}
                              </p>
                            );
                          }
                          if (line.startsWith('👋') || line.startsWith('💬') || line.startsWith('🚀') || line.startsWith('✅') || line.startsWith('⚠️') || line.startsWith('🎯') || line.startsWith('💡') || line.startsWith('📈') || line.startsWith('📋') || line.startsWith('📊') || line.startsWith('🏛️') || line.startsWith('⏰') || line.startsWith('🚧') || line.startsWith('💪')) {
                            return <p key={index} className="font-medium my-2 text-sm">{line}</p>;
                          }
                          return line ? <p key={index} className="my-1 text-sm leading-relaxed">{line}</p> : <br key={index} />;
                        })}
                      </div>
                    </div>
                    
                    {/* Message timestamp */}
                    <div className={`text-xs text-gray-500 mt-1 px-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.type === 'ai' ? 'EU Funding Expert' : 'You'} • Just now
                    </div>
                  </div>
                  
                  {msg.type === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg text-white text-sm font-semibold order-3">
                      {companyName.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="max-w-[75%]">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm text-gray-600">AI is typing...</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 px-3">EU Funding Expert • typing...</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Chat Input Area */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/10 shadow-lg shadow-blue-500/5">
            <div className="space-y-4">
              


              {/* Message Input */}
              <div className="relative">
                <div className="flex items-end gap-3 p-3 bg-white/50 rounded-2xl border border-border/30 shadow-sm focus-within:border-blue-400/50 focus-within:shadow-md transition-all duration-200">
                  <div className="flex-1">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message about the funding program..."
                      className="border-none bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm placeholder:text-muted-foreground"
                      disabled={isTyping}
                    />
                  </div>
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim() || isTyping}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Character count or hint */}
                <div className="flex justify-between items-center mt-2 px-3">
                  <p className="text-xs text-muted-foreground">
                    Ask about requirements, deadlines, success factors, or any other funding questions
                  </p>
                  {message.length > 0 && (
                    <span className="text-xs text-muted-foreground">{message.length}/500</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}