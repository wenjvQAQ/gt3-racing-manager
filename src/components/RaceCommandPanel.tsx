import React, { useState } from 'react';
import { Radio, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { RaceCommand, generateRaceCommands, LiveRaceData } from '../utils/raceSimulation';

interface RaceCommandPanelProps {
  onCommand: (command: RaceCommand) => void;
  liveData: LiveRaceData;
  currentLap?: number;
  totalLaps?: number;
  isSafetyCar?: boolean;
  commands?: RaceCommand[];
}

export const RaceCommandPanel: React.FC<RaceCommandPanelProps> = ({
  onCommand,
  liveData,
  currentLap = liveData.currentLap,
  totalLaps = liveData.totalLaps,
  isSafetyCar = liveData.isSafetyCar,
  commands: propsCommands
}) => {
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const commands = propsCommands || generateRaceCommands();

  const handleCommand = (command: RaceCommand) => {
    setSelectedCommand(command.type);
    onCommand(command);
    
    const timestamp = new Date().toLocaleTimeString();
    setMessageLog(prev => [
      ...prev.slice(-9),
      `[${timestamp}] 指令已发送: ${command.description}`
    ]);

    setTimeout(() => setSelectedCommand(null), 2000);
  };

  const pitWindowStart = Math.floor(totalLaps * 0.25);
  const pitWindowEnd = Math.floor(totalLaps * 0.4);
  const isInPitWindow = currentLap >= pitWindowStart && currentLap <= pitWindowEnd;

  return (
    <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Radio className="text-tire-green" size={20} />
          比赛指令
        </h3>
        <div className="text-xs text-gray-400">
          进站窗口: {pitWindowStart}-{pitWindowEnd}圈
        </div>
      </div>

      {isSafetyCar && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 flex items-center gap-3">
          <AlertTriangle className="text-yellow-500" size={24} />
          <div>
            <div className="font-bold text-yellow-500">安全车阶段</div>
            <div className="text-xs text-gray-300 mt-1">
              这是进站的绝佳时机！对手也在减速
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {commands.map((cmd) => {
          const isDisabled = cmd.type === 'box' && !isInPitWindow && !isSafetyCar;
          const isRecommended = 
            (cmd.type === 'push' && currentLap > pitWindowEnd) ||
            (cmd.type === 'save' && currentLap < pitWindowStart) ||
            (cmd.type === 'box' && isSafetyCar);

          return (
            <button
              key={cmd.type}
              onClick={() => !isDisabled && handleCommand(cmd)}
              disabled={isDisabled}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${selectedCommand === cmd.type 
                  ? 'bg-tire-green/20 border-tire-green text-white' 
                  : isDisabled 
                  ? 'bg-carbon-700/50 border-carbon-600 text-gray-500 cursor-not-allowed'
                  : isRecommended
                  ? 'bg-racing-blue/20 border-racing-blue text-white hover:bg-racing-blue/30'
                  : 'bg-carbon-700 border-carbon-600 text-white hover:bg-carbon-600'
                }
              `}
            >
              <div className="font-bold text-sm mb-1">{cmd.description}</div>
              <div className="text-xs opacity-70 space-y-0.5">
                {cmd.impact.pace && <div>速度 {cmd.impact.pace > 0 ? '+' : ''}{cmd.impact.pace}</div>}
                {cmd.impact.fuel && <div>燃油 {cmd.impact.fuel > 0 ? '+' : ''}{cmd.impact.fuel}</div>}
                {cmd.impact.tire && <div>轮胎 {cmd.impact.tire > 0 ? '+' : ''}{cmd.impact.tire}</div>}
                {cmd.impact.risk && <div className="text-red-400">风险: {(cmd.impact.risk * 100).toFixed(0)}%</div>}
              </div>
              {isRecommended && !isDisabled && (
                <div className="text-xs text-racing-blue mt-1">⭐ 推荐</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-carbon-900 rounded-lg p-3 max-h-32 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="text-gray-400" size={14} />
          <span className="text-xs text-gray-400 font-semibold">消息记录</span>
        </div>
        <div className="space-y-1">
          {messageLog.length === 0 ? (
            <div className="text-xs text-gray-500 italic">
              暂无消息...
            </div>
          ) : (
            messageLog.map((msg, idx) => (
              <div key={idx} className="text-xs text-gray-300 font-mono">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-carbon-700 p-3 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">快速提示</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-tire-green" size={12} />
            <span>安全车时进站可节省约15秒</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-tire-green" size={12} />
            <span>比赛末段推进可获得位置</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-tire-green" size={12} />
            <span>轮胎&lt;30%时考虑进站</span>
          </div>
        </div>
      </div>
    </div>
  );
};
