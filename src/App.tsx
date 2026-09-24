import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LinearQueueFlowSimulation } from './components/LinearQueueFlowSimulation';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { QueueSystemArchitecture } from './components/QueueSystemArchitecture';
import { FormulaCalculator } from './components/FormulaCalculator';
import { EconomicOptimization } from './components/EconomicOptimization';
import { RealWorldApplications } from './components/RealWorldApplications';
import { KnowledgeQuiz } from './components/KnowledgeQuiz';
import { Footer } from './components/Footer';
import { Activity, LayoutGrid } from 'lucide-react';

export default function App() {
  const [simulationView, setSimulationView] = useState<'linear' | 'studio'>('linear');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Hero />

        {/* Section 1: Real-time Visual Interactive Simulator with View Switcher */}
        <section id="simulator" className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-cyan-400 tracking-wider">MÔ PHỎNG ĐỘNG HỆ THỐNG</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-0.5">
                Quan Sát Dòng Khách & Cơ Chế Phục Vụ
              </h2>
            </div>

            {/* View switcher tabs */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit">
              <button
                onClick={() => setSimulationView('linear')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  simulationView === 'linear'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Mô Phỏng Tuyến Tính (Theo hình mẫu)</span>
              </button>
              <button
                onClick={() => setSimulationView('studio')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  simulationView === 'studio'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Studio Đa Quầy Chi Tiết</span>
              </button>
            </div>
          </div>

          {/* Render selected simulation view */}
          {simulationView === 'linear' ? (
            <LinearQueueFlowSimulation />
          ) : (
            <InteractiveSimulator />
          )}
        </section>

        {/* Section 2: Architecture & Principles of Queueing Models */}
        <QueueSystemArchitecture />

        {/* Section 3: Mathematical Formulas Stage-by-Stage Breakdown */}
        <FormulaCalculator />

        {/* Section 4: Economic Cost Optimization */}
        <EconomicOptimization />

        {/* Section 5: Real-World Applications & Case Studies */}
        <RealWorldApplications />

        {/* Section 6: Knowledge Verification Quiz */}
        <KnowledgeQuiz />
      </main>

      <Footer />
    </div>
  );
}
