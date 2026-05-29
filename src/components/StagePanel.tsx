import React, { useState } from 'react';
import { TimelineEvent, DecisionItem } from '../types/game';

interface StagePanelProps {
  event: TimelineEvent;
  practiceResult?: any;
  qualifyingResult?: any;
  onDecisionChange: (decisionId: string, optionId: string) => void;
  onComplete: () => void;
  onSkip?: () => void;
}

export const StagePanel: React.FC<StagePanelProps> = ({
  event,
  practiceResult,
  qualifyingResult,
  onDecisionChange,
  onComplete,
  onSkip
}) => {
  const [showResults, setShowResults] = useState(false);
  
  const getEventIcon = (stage: string): string => {
    switch (stage) {
      case 'prep': return '📦';
      case 'practice': return '🏎️';
      case 'qualifying': return '⚡';
      case 'race': return '🏁';
      case 'post': return '🎉';
      default: return '📅';
    }
  };
  
  const getDecisionTypeIcon = (type: string): string => {
    switch (type) {
      case 'setup': return '⚙️';
      case 'tire': return '🛞';
      case 'fuel': return '⛽';
      case 'driver': return '👤';
      case 'strategy': return '📋';
      default: return '📝';
    }
  };
  
  return (
    <div className="bg-carbon-800 rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="text-2xl">{getEventIcon(event.stage)}</span>
            {event.name}
          </h3>
          <p className="text-gray-400 text-sm">
            进行关键决策，为比赛做准备
          </p>
        </div>
        {practiceResult && (
          <button
            onClick={() => setShowResults(!showResults)}
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
          >
            {showResults ? '隐藏结果' : '查看结果'}
          </button>
        )}
      </div>
      
      {showResults && practiceResult && (
        <div className="mb-4 p-4 bg-carbon-900 rounded-lg border border-green-600">
          <h4 className="text-green-400 font-semibold mb-2">练习赛结果</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>🏆 排名: P{practiceResult.position}</p>
            <p>📊 最快圈速: {practiceResult.lapTimes[0]}s</p>
            <p>📈 轮胎衰减: {practiceResult.tireDegradation}%</p>
            <div className="mt-2 p-3 bg-carbon-800 rounded border-l-4 border-blue-500">
              <p className="text-gray-200 font-medium">💬 工程师反馈:</p>
              <p className="text-gray-400 mt-1">{practiceResult.feedback}</p>
              <p className="text-yellow-400 mt-2">💡 {practiceResult.setupRecommendation}</p>
            </div>
          </div>
        </div>
      )}
      
      {showResults && qualifyingResult && (
        <div className="mb-4 p-4 bg-carbon-900 rounded-lg border border-yellow-600">
          <h4 className="text-yellow-400 font-semibold mb-2">排位赛结果</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>🏆 最终发车位: P{qualifyingResult.finalGridPosition}</p>
            <p>⏱️ 最快单圈: {qualifyingResult.fastestLap}s</p>
            <p>⚠️ 事故次数: {qualifyingResult.incidents}</p>
          </div>
        </div>
      )}
      
      {event.decisions && event.decisions.length > 0 && (
        <div className="space-y-4">
          {event.decisions.map((decision) => (
            <div key={decision.id} className="bg-carbon-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{getDecisionTypeIcon(decision.type)}</span>
                <h4 className="text-white font-medium">{decision.label}</h4>
              </div>
              <p className="text-gray-400 text-sm mb-3">{decision.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {decision.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => onDecisionChange(decision.id, option.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all
                      ${decision.selectedOption === option.id
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-carbon-600 bg-carbon-800 hover:border-carbon-500 hover:bg-carbon-700'
                      }
                    `}
                  >
                    <div className="font-medium text-white">{option.label}</div>
                    {option.description && (
                      <div className="text-gray-400 text-xs mt-1">{option.description}</div>
                    )}
                    {Object.keys(option.effects).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(option.effects).map(([key, value]) => (
                          <span 
                            key={key} 
                            className={`text-xs px-2 py-0.5 rounded
                              ${(value as number) > 0 ? 'bg-green-500/20 text-green-400' :
                                (value as number) < 0 ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }
                            `}
                          >
                            {key}: {(value as number) > 0 ? '+' : ''}{value}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 flex justify-end gap-3">
        {event.canSkip && onSkip && (
          <button
            onClick={onSkip}
            className="px-4 py-2 bg-carbon-600 text-white rounded-lg hover:bg-carbon-500 transition-colors"
          >
            跳过
          </button>
        )}
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
        >
          确认决策，继续
        </button>
      </div>
    </div>
  );
};
