import React from 'react';
import { TimelineEvent, TimelineEventStatus, TimelineStage } from '../types/game';
import { formatTime } from '../utils/timeline';

interface TimelineBarProps {
  events: TimelineEvent[];
  currentTime: number;
  currentEvent: TimelineEvent | null;
  onEventClick: (event: TimelineEvent) => void;
  onFastForwardToEvent: (event: TimelineEvent) => void;
  onFastForwardToNextDecision: () => void;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({
  events,
  currentTime,
  currentEvent,
  onEventClick,
  onFastForwardToEvent,
  onFastForwardToNextDecision
}) => {
  const totalDuration = events.reduce((sum, e) => sum + e.duration, 0);
  const maxTime = events.length > 0 ? Math.max(...events.map(e => e.startTime + e.duration)) : 100;
  
  const getStageColor = (stage: TimelineStage): string => {
    switch (stage) {
      case 'prep': return 'bg-gray-600';
      case 'practice': return 'bg-green-600';
      case 'qualifying': return 'bg-yellow-600';
      case 'race': return 'bg-red-600';
      case 'post': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusColor = (status: TimelineEventStatus): string => {
    switch (status) {
      case 'pending': return 'opacity-50';
      case 'active': return 'opacity-100 animate-pulse';
      case 'completed': return 'opacity-100';
      case 'skipped': return 'opacity-30';
      default: return 'opacity-50';
    }
  };
  
  const getStatusIcon = (status: TimelineEventStatus): string => {
    switch (status) {
      case 'pending': return '⚪';
      case 'active': return '🔴';
      case 'completed': return '✅';
      case 'skipped': return '↩️';
      default: return '⚪';
    }
  };
  
  return (
    <div className="bg-carbon-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">比赛周时间轴</h3>
        <div className="flex gap-2">
          <button
            onClick={onFastForwardToNextDecision}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
          >
            快进到下一决策点
          </button>
        </div>
      </div>
      
      <div className="relative bg-carbon-900 rounded-lg p-4 h-24 overflow-hidden">
        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center">
          {events.map((event, index) => {
            const leftPercent = (event.startTime / maxTime) * 100;
            const widthPercent = (event.duration / maxTime) * 100;
            
            return (
              <div
                key={event.id}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`
                }}
                className={`absolute h-12 top-6 cursor-pointer transition-all duration-300
                  ${getStageColor(event.stage)}
                  ${getStatusColor(event.status)}
                  ${currentEvent?.id === event.id ? 'ring-2 ring-yellow-400 z-20' : ''}
                  hover:z-30 hover:brightness-110
                `}
                onClick={() => onEventClick(event)}
              >
                <div className="h-full flex items-center justify-center text-white text-xs font-medium px-1 text-center">
                  {event.name}
                </div>
                
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-lg">
                  {getStatusIcon(event.status)}
                </div>
              </div>
            );
          })}
        </div>
        
        <div 
          className="absolute top-0 bottom-0 w-1 bg-yellow-400 z-30 transform -translate-x-1/2"
          style={{ left: `${(currentTime / maxTime) * 100}%` }}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-yellow-400" />
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-yellow-400" />
        </div>
        
        <div className="absolute -top-1 left-0 right-0 flex justify-between text-xs text-gray-400 px-4">
          <span>{formatTime(0)}</span>
          <span>{formatTime(maxTime)}</span>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-600 rounded"></span>
          <span className="text-gray-300">准备阶段</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-600 rounded"></span>
          <span className="text-gray-300">练习赛</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-600 rounded"></span>
          <span className="text-gray-300">排位赛</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-600 rounded"></span>
          <span className="text-gray-300">正赛</span>
        </div>
      </div>
      
      {currentEvent && (
        <div className="mt-3 p-3 bg-carbon-900 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-white font-semibold">{currentEvent.name}</h4>
              <p className="text-gray-400 text-xs">
                {formatTime(currentEvent.startTime)} - {formatTime(currentEvent.startTime + currentEvent.duration)}
              </p>
            </div>
            <div className="flex gap-2">
              {currentEvent.canSkip && (
                <button
                  onClick={() => onFastForwardToEvent(currentEvent)}
                  className="bg-carbon-700 hover:bg-carbon-600 text-white text-xs px-3 py-1 rounded transition-colors"
                >
                  跳过
                </button>
              )}
              {currentEvent.decisions && currentEvent.decisions.length > 0 && (
                <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded animate-pulse">
                  需要决策
                </span>
              )}
            </div>
          </div>
          {currentEvent.summary && (
            <p className="text-gray-400 text-xs mt-2">{currentEvent.summary}</p>
          )}
        </div>
      )}
    </div>
  );
};
