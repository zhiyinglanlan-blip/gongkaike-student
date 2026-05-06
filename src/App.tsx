/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Key, LockOpen, ArrowRight, CheckCircle2, ChevronRight, Zap, 
  Trophy, Orbit, Fingerprint, BrainCircuit 
} from 'lucide-react';

// === Mock Data ===
const dict = {
  stopWords: ["的","了","在","然而","是","都","很","于是乎","最","可是","还是","着","去","虽然","但是","们","并没有","并且","也","接着","非常","而且","这","只得","于是","这时候","啊","向","给","因为","正","却","叫","和","上","用","才","能","个"],
  synonyms: { "孔明": "诸葛亮", "林妹妹": "林黛玉", "宝玉": "贾宝玉", "梁山泊": "梁山" }
};

const themeData: Record<string, { title: string, rawText: string }> = {
  scifi: {
    title: "科幻小说",
    rawText: "在 遥远 的 未来 时代，庞大 的 宇宙 飞船 缓慢 地 穿梭 在 黑暗 的 星云 之中。然而，勇敢 的 船长 突然 发现 了 屏幕 上 闪烁 的 外星人 的 踪迹。其实 外星人 是 非常 危险 的，所以 大家 都 很 害怕。于是乎，飞船 立刻 开启 了 最 强 的 护盾。可是，敌人 的 激光 还是 打中 了 我们 的 引擎。船长 大喊 着 让 工程师 快点 去 修理。虽然 情况 十分 危急，但是 勇敢 的 船员 们 并没有 放弃 希望，最终 成功 地 击退 了 可怕 的 外星人，并且 安全 地 返回 了 地球 的 基地。"
  },
  landscape: {
    title: "风景景物",
    rawText: "美丽 的 校园 里 种着 许多 高大 的 树木，还有 各种各样 鲜艳 的 花朵。然后 我们 每天 都 会 在 宽阔 的 操场 上 尽情 地 玩耍。其实 操场 是 大家 最 快乐 的 地方。每当 到了 春天 的 时候，树木 非常 茂盛，而且 小鸟 也 会 在 枝头 上 叽叽喳喳 地 唱 着 动听 的 歌曲。接着，一阵 微风 吹过，树叶 发出 了 沙沙 的 声音。虽然 学习 的 任务 很 繁重，但是 只要 看到 这 充满 生机 的 校园 风景，同学们 的 心情 就会 变得 特别 的 舒畅，于是 纷纷 拿起 书本，坐在 温暖 的 阳光 下 认真 地 阅读 起来。"
  },
  shuihu: {
    title: "水浒传",
    rawText: "在 那个 混乱 的 时代，及时雨 宋江 带领 着 一群 兄弟 们 聚集 在 险峻 的 梁山泊 上。可是，朝廷 的 高俅 却 总是 想要 消灭 他们。于是乎，黑旋风 李逵 拿起 了 锋利 的 斧头，大喊 着 要 去 砍下 敌人 的 脑袋。然而 智多星 吴用 却 摇了摇 头，因为 他 觉得 必须 要 用 巧妙 的 计谋 才 能 取得 胜利。虽然 官兵 的 数量 很多，但是 梁山 好汉 们 个个 都 是 勇猛 无比 的。最后，在 宋江 的 指挥 下，加上 吴用 的 妙计，好汉 们 成功 地 打败 了 进攻 的 官兵，并且 缴获 了 大批 的 粮草 和 武器，大家 的 心里 都 非常 的 高兴。"
  },
  sanguo: {
    title: "三国演义",
    rawText: "这时候，聪明 的 诸葛亮 正 悠闲 地 摇着 手中 的 羽扇。于是，孔明 微微 一笑，向 周瑜 提出 了 那个 著名 的 草船借箭 的 计谋。然而 多疑 的 曹操 果然 还是 上当 了。其实 诸葛亮 真 的 是 非常 聪明 的，他 早就 算准 了 江面上 会 刮起 浓浓 的 大雾。而且 鲁肃 也 被 孔明 的 智慧 给 深深 地 折服 了。虽然 曹操 的 军队 疯狂 地 射 出 了 数万 支 箭，但是 最终 全 都 扎 在 了 草船 上。接着，孔明 带着 满满 的 箭 顺利 地 返航 了。周瑜 看到 之后，不得不 叹息 说 自己 真的 不如 诸葛亮 啊。"
  },
  honglou: {
    title: "红楼梦",
    rawText: "在 豪华 的 贾府 里面，多愁善感 的 林黛玉 又 伤心 地 流下 了 眼泪。因为 贾宝玉 不小心 惹 恼 了 她。其实 宝玉 的 心里 是 非常 喜欢 林妹妹 的。可是，薛宝钗 却 总是 懂事 地 陪伴 在 王夫人 的 身边。于是乎，大观园 里 的 丫鬟 们 都 在 悄悄 地 议论 着 这 件 事情。然而 聪明 的 王熙凤 走 了 过来，大声 地 笑着 并且 巧妙 地 化解 了 这场 尴尬 的 矛盾。虽然 贾府 表面 上 看起来 十分 的 繁华 和 热闹，但是 林黛玉 的 心里 却 总是 感到 一丝丝 的 孤独 和 忧伤，只能 默默 地 看着 窗外 的 落花 发呆。"
  }
};

const neonColors = ['#f472b6', '#c084fc', '#818cf8', '#2dd4bf', '#34d399', '#facc15', '#fb923c', '#38bdf8'];
const getRandomColor = () => neonColors[Math.floor(Math.random() * neonColors.length)];

// === Shared Components ===
const ScoreBoard = ({ score }: { score: number }) => (
  <motion.div
    key={score}
    initial={{ scale: 1.5, y: -20, rotate: 10, color: '#facc15' }}
    animate={{ scale: 1, y: 0, rotate: 0, color: '#fff' }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    className="fixed top-6 right-6 glass p-4 rounded-full text-xl font-bold flex items-center gap-3 z-50 border border-purple-400"
  >
    <Trophy className="text-yellow-400 w-6 h-6" />
    <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🏆 试炼积分: <span className="text-yellow-400">{score}</span></span>
  </motion.div>
);

const PasswordGate = ({ expected, onUnlock }: { expected: string, onUnlock: () => void }) => {
  const [val, setVal] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val === expected) onUnlock();
    else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <motion.form 
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} 
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col items-center gap-3 glass p-6 rounded-2xl w-full max-w-sm border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
    >
      <div className="text-cyan-300 font-bold mb-2 flex items-center gap-2">
        <Key className="w-5 h-5"/> 输入通关密码解锁下一关
      </div>
      <input 
        type="password" 
        value={val} 
        onChange={e => setVal(e.target.value)}
        className="w-full bg-slate-900/80 border border-cyan-500/50 text-cyan-100 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-cyan-400"
        placeholder="••••"
      />
      <button type="submit" className="mt-4 w-full bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-lg py-3 font-bold flex justify-center items-center gap-2 transition-colors border border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]">
        <LockOpen className="w-5 h-5"/> 验证密码
      </button>
    </motion.form>
  );
};

// === Levels ===
function Level0({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 15 }} className="flex flex-col items-center justify-center p-10 glass rounded-3xl max-w-lg w-full relative group floating">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
      <div className="relative flex flex-col items-center w-full z-10">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          <Orbit className="w-24 h-24 text-cyan-400 mb-6 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]" />
        </motion.div>
        <h1 className="text-6xl font-black pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4 text-center neon-text glitch-effect cursor-crosshair">
          词云图试炼之旅
        </h1>
        
        <div className="w-full relative flex flex-col gap-5">
          <div className="relative group/input">
            <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-6 h-6 z-10" />
            <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="输入你的名字"
              className="w-full bg-slate-900/80 border border-purple-500/50 rounded-xl py-5 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] font-mono text-lg relative z-0"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStart(name || "匿名英雄")}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white flex items-center justify-center gap-3 py-5 rounded-xl font-black text-xl shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all overflow-hidden relative group/btn"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
            <Zap className="w-6 h-6 animate-pulse" /> 开启数据试炼
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function Level1({ addScore, onPass }: { addScore: (n: number) => void, onPass: () => void }) {
  const [votedFor, setVotedFor] = useState<'monkey' | 'tang' | null>(null);

  const handleVote = (char: 'monkey' | 'tang') => {
    if (votedFor) return; 
    setVotedFor(char);
    addScore(100);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl relative z-10">
      <h2 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-black mb-4 drop-shadow-[0_0_15px_rgba(216,180,254,0.6)] neon-text">Level 1: 争功风波</h2>
      <p className="text-cyan-100 mb-12 text-xl font-medium tracking-wide drop-shadow-md">取经团队谁的功劳最大？请做出你的唯一选择。</p>
      
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 w-full mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:flex">
          <motion.div 
            animate={votedFor ? {} : { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-20 h-20 rounded-full border-[3px] flex items-center justify-center italic font-black text-3xl pb-1 transition-colors duration-500 shadow-xl ${votedFor ? 'bg-slate-800/80 border-slate-600/50 text-slate-500/50 shadow-none' : 'bg-slate-900 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.8)] text-pink-400'}`}
          >
            VS
          </motion.div>
        </div>

        <motion.div 
          whileHover={votedFor ? {} : { scale: 1.05, boxShadow: '0 0 40px rgba(168,85,247,0.6)' }}
          whileTap={votedFor ? {} : { scale: 0.95 }}
          onClick={() => handleVote('monkey')}
          className={`flex-1 w-full p-12 rounded-[2.5rem] flex flex-col items-center justify-center border-[3px] cursor-pointer relative overflow-hidden transition-all duration-500 outline-none select-none ${
            votedFor === 'monkey' ? 'border-purple-400 bg-purple-900/40 shadow-[0_0_50px_rgba(168,85,247,0.6)] scale-105 z-10' : 
            votedFor === 'tang' ? 'border-slate-700/50 bg-slate-900/40 opacity-50 grayscale scale-95' : 
            'border-purple-500/30 bg-slate-800/60 glass hover:bg-slate-800/80'
          }`}
        >
          {votedFor === 'monkey' && <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent pointer-events-none" />}
          <motion.span animate={votedFor === 'monkey' ? { y: [0, -10, 0] } : {}} transition={votedFor === 'monkey' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}} className={`text-[7rem] mb-4 drop-shadow-2xl relative z-10 filter ${votedFor ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]'}`}>🐒</motion.span>
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 tracking-widest relative z-10 pt-2 pb-4">孙悟空</span>
        </motion.div>
        
        <motion.div 
          whileHover={votedFor ? {} : { scale: 1.05, boxShadow: '0 0 40px rgba(236,72,153,0.6)' }}
          whileTap={votedFor ? {} : { scale: 0.95 }}
          onClick={() => handleVote('tang')}
          className={`flex-1 w-full p-12 rounded-[2.5rem] flex flex-col items-center justify-center border-[3px] cursor-pointer relative overflow-hidden transition-all duration-500 outline-none select-none ${
            votedFor === 'tang' ? 'border-pink-400 bg-pink-900/40 shadow-[0_0_50px_rgba(236,72,153,0.6)] scale-105 z-10' : 
            votedFor === 'monkey' ? 'border-slate-700/50 bg-slate-900/40 opacity-50 grayscale scale-95' : 
            'border-pink-500/30 bg-slate-800/60 glass hover:bg-slate-800/80'
          }`}
        >
          {votedFor === 'tang' && <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/20 to-transparent pointer-events-none" />}
          <motion.span animate={votedFor === 'tang' ? { y: [0, -10, 0] } : {}} transition={votedFor === 'tang' ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : {}} className={`text-[7rem] mb-4 drop-shadow-2xl relative z-10 filter ${votedFor ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]'}`}>{"\uD83D\uDC68\u200D\uD83E\uDDB2"}</motion.span>
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-orange-200 tracking-widest relative z-10 pt-2 pb-4">唐僧</span>
        </motion.div>
      </div>

      <AnimatePresence>
        {votedFor && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex flex-col items-center w-full z-20 relative">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-green-300 px-8 py-4 rounded-2xl text-2xl font-black shadow-[0_0_30px_rgba(74,222,128,0.3)] mb-4 flex items-center gap-3">
               <motion.span animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}><Trophy className="w-8 h-8 text-yellow-400"/></motion.span>
               选择完毕！积分 +100！
            </div>
            <PasswordGate expected="8888" onUnlock={onPass} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const quizReqs = [
  { q: "比较具体数量多少，用什么图？", opts: ["A. 词云图", "B. 条形图", "C. 饼图"], ans: 1 },
  { q: "看各部分占总数百分比，用什么图？", opts: ["A. 饼图", "B. 条形图", "C. 词云图"], ans: 0 },
  { q: "在小说中快速找出出现频率最高关键词，用什么图？", opts: ["A. 饼图", "B. 词云图", "C. 条形图"], ans: 1 },
  { q: "词云图核心优势？", opts: ["A. 只能画方形", "B. 提炼文本高频关键词，字号越大词频越高"], ans: 1 },
];

function Level2({ addScore, onPass }: { addScore: (n: number) => void, onPass: () => void }) {
  const [selections, setSelections] = useState<number[]>([]);
  const [shakeIdx, setShakeIdx] = useState<number>(-1);
  const [passed, setPassed] = useState(false);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (passed || selections[qIdx] !== undefined) return;
    
    if (quizReqs[qIdx].ans === optIdx) {
      const newSel = [...selections];
      newSel[qIdx] = optIdx;
      setSelections(newSel);

      if (newSel.filter(x => x !== undefined).length === quizReqs.length) {
        addScore(200);
        setPassed(true);
      }
    } else {
      setShakeIdx(qIdx);
      setTimeout(() => setShakeIdx(-1), 500);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 font-bold mb-4 drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]">Level 2: 图表阵法</h2>
      <p className="text-slate-300 mb-8 text-lg">破解四大图表真理，获取通关密语。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {quizReqs.map((quiz, qIdx) => (
          <motion.div 
            key={qIdx}
            animate={shakeIdx === qIdx ? { x: [-10, 10, -10, 10, 0] } : {}}
            className={`glass p-6 rounded-2xl border ${selections[qIdx] !== undefined ? 'border-green-500/50 bg-green-500/10' : 'border-slate-600/50'}`}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-start gap-2">
              <span className="text-cyan-400 mt-1"><BrainCircuit className="w-5 h-5"/></span>
              {qIdx + 1}. {quiz.q}
            </h3>
            <div className="flex flex-col gap-3">
              {quiz.opts.map((opt, oIdx) => {
                const isSelected = selections[qIdx] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    disabled={selections[qIdx] !== undefined}
                    className={`text-left px-5 py-4 rounded-xl transition-all border relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-[1.02]' 
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/80 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-[1.02] hover:-translate-y-1 z-10'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    {opt}
                  </button>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {passed && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-full">
            <div className="bg-green-500/20 border border-green-400 text-green-300 px-6 py-3 rounded-xl text-xl font-bold animate-pulse shadow-[0_0_20px_rgba(74,222,128,0.2)]">
              🎉 连破四阵！积分 +200！
            </div>
            <PasswordGate expected="6666" onUnlock={onPass} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Level 3 Data
const l3TokensOriginal = ['悟空', '说', '呆子', '真', '的', '是', '个', '呆子', '也', '叫', '猪八戒'];
const l3Stops = ['说', '真', '的', '是', '个', '也', '叫'];
const l3QuizReqs = [
  { q: "剔除虚词的作用是什么？", opts: ["A. 缩小字体", "B. 去除无意义词汇，突出核心特征"], ans: 1 },
  { q: "合并同义词的作用？", opts: ["A. 减少图表准确性", "B. 避免同一个概念被分散，统计更精准"], ans: 1 }
];

const l3Chars = "悟空说呆子真的是个呆子也叫猪八戒".split('');
const targetCuts = [1, 2, 4, 5, 6, 7, 8, 10, 11, 12];

function Level3({ addScore, onPass }: { addScore: (n: number) => void, onPass: () => void }) {
  const [step, setStep] = useState(0); 
  const [activeCuts, setActiveCuts] = useState<number[]>([]);
  const [cutShake, setCutShake] = useState(false);
  const [cutSuccess, setCutSuccess] = useState(false);
  const [poppedIdxs, setPoppedIdxs] = useState<number[]>([]);
  const [counts, setCounts] = useState<{w:string, c:number}[]>([]);
  const [dragged, setDragged] = useState<string | null>(null);
  const [quizAns, setQuizAns] = useState<number[]>([]);
  const [shakeQ, setShakeQ] = useState(-1);
  const [wrongCut, setWrongCut] = useState<number | null>(null);
  const [wrongWord, setWrongWord] = useState<number | null>(null);

  const toggleCut = (i: number) => {
    if (targetCuts.includes(i)) {
      setActiveCuts(prev => prev.includes(i) ? prev.filter(c => c !== i) : [...prev, i]);
    } else {
      setCutShake(true);
      setWrongCut(i);
      setTimeout(() => {
        setCutShake(false);
        setWrongCut(null);
      }, 500);
    }
  };

  const checkCuts = () => {
    const sortedCuts = [...activeCuts].sort((a,b) => a-b);
    if (sortedCuts.length === targetCuts.length && sortedCuts.every((v, i) => v === targetCuts[i])) {
      setCutSuccess(true);
      setTimeout(() => setStep(1), 800);
    } else {
      setCutShake(true);
      setTimeout(() => setCutShake(false), 500);
    }
  };

  // Auto progression from step 1 to 2
  useEffect(() => {
    if (step === 1 && poppedIdxs.length === l3Stops.length) {
      setTimeout(() => setStep(2), 600);
    }
  }, [poppedIdxs, step]);

  const doFreq = () => {
    const remaining = l3TokensOriginal.filter((_, i) => !poppedIdxs.includes(i));
    const map: Record<string, number> = {};
    remaining.forEach(w => map[w] = (map[w] || 0) + 1);
    setCounts(Object.entries(map).map(([w, c]) => ({ w, c })));
    setStep(3);
  };

  const doMerge = () => {
    const dc = counts.find(x => x.w === '呆子')?.c || 0;
    const zc = counts.find(x => x.w === '猪八戒')?.c || 0;
    const rest = counts.filter(x => x.w !== '呆子' && x.w !== '猪八戒');
    setCounts([...rest, { w: '猪八戒', c: dc + zc }]);
    setStep(4);
  };

  const handleQuiz = (qIdx: number, optIdx: number) => {
    if (l3QuizReqs[qIdx].ans === optIdx) {
      const n = [...quizAns];
      n[qIdx] = optIdx;
      setQuizAns(n);
      if (n.filter(x => x !== undefined).length === l3QuizReqs.length) {
        addScore(300);
        setStep(5);
      }
    } else {
      setShakeQ(qIdx);
      setTimeout(() => setShakeQ(-1), 500);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400 font-bold mb-4 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Level 3: 西游加工厂</h2>
      <p className="text-slate-300 mb-8 text-lg">微观数据流体验，请亲自动手处理短文本！</p>
      
      <div className="glass p-8 rounded-3xl w-full border border-teal-500/30 mb-8 min-h-[300px] flex flex-col items-center">
        {step === 0 && (
          <div className="text-center flex flex-col items-center w-full">
            <h3 className="text-teal-400 text-center font-bold mb-6 text-xl flex items-center justify-center gap-2">
              <Zap className="w-6 h-6"/> 任务：手动注入能量分割线，切分出正确的词汇！
            </h3>
            <motion.div 
               animate={cutShake ? { x: [-10, 10, -10, 10, 0] } : (cutSuccess ? { scale: [1, 1.05, 1] } : {})} 
               className={`flex flex-wrap justify-center items-center text-4xl font-black bg-slate-900/80 px-8 py-10 rounded-3xl mb-8 border transition-colors duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] ${cutSuccess ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.5)]' : 'border-slate-700'}`}
            >
              {l3Chars.map((char, i) => (
                <React.Fragment key={i}>
                  <span className={`relative z-10 transition-colors ${cutSuccess ? 'text-green-300 drop-shadow-[0_0_15px_rgba(74,222,128,1)]' : 'text-white drop-shadow-md'}`}>{char}</span>
                  {i < l3Chars.length - 1 && (
                    <div
                      onClick={() => !cutSuccess && toggleCut(i)}
                      className={`w-4 h-12 flex items-center justify-center cursor-pointer group mx-[2px] relative z-20 rounded transition-colors ${wrongCut === i ? 'bg-red-500/40' : 'hover:bg-white/10'}`}
                    >
                      <div className={`w-[3px] rounded-full transition-all duration-300 ${
                         activeCuts.includes(i) 
                           ? (cutSuccess ? 'h-full bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] opacity-100' : 'h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] opacity-100') 
                           : 'h-0 opacity-0'
                      }`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
            {cutSuccess ? (
              <div className="text-green-400 font-bold text-2xl animate-pulse">✨ 完美分词！能量共振中...</div>
            ) : (
              <button 
                onClick={checkCuts}
                className="px-10 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(20,184,166,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                ✅ 验证能量切刀
              </button>
            )}
            {cutShake && <p className="text-red-400 mt-6 font-bold animate-pulse tracking-wide drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]">⚠️ 能量场紊乱：请仔细检查名词和虚词的边界！(提示: 的/是/个 要单切)</p>}
          </div>
        )}

        {step >= 1 && step < 3 && (
          <div className="w-full">
            <h3 className="text-teal-400 text-center font-bold mb-6 text-xl">
              {step === 1 ? '🎯 任务：请点击戳破所有多余的虚词！' : '✅ 虚词清理完毕！'}
            </h3>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <AnimatePresence>
                {l3TokensOriginal.map((w, i) => {
                  const isStop = l3Stops.includes(w);
                  if (poppedIdxs.includes(i)) return null;
                  
                  return (
                    <motion.div
                      key={i}
                      layout
                      animate={wrongWord === i ? { x: [-5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.3 }}
                      exit={{ scale: 0, opacity: 0, rotate: i % 2 === 0 ? 45 : -45 }}
                      onClick={() => { 
                        if(step === 1) {
                          if (isStop) {
                            setPoppedIdxs(prev => [...prev, i]);
                          } else {
                            setWrongWord(i);
                            setTimeout(() => setWrongWord(null), 500);
                          }
                        }
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-lg border-2 transition-all ${
                        wrongWord === i 
                          ? 'border-red-500/80 bg-red-500/40 text-red-200 cursor-default' 
                          : step === 1 
                            ? 'border-teal-500/30 bg-slate-800 text-teal-100 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] cursor-pointer'
                            : 'border-teal-500/30 bg-slate-800 text-teal-100 cursor-default'
                      }`}
                    >
                      {w}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            {step === 2 && (
              <div className="flex justify-center">
                 <motion.button initial={{scale:0}} animate={{scale:1}} onClick={doFreq} className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(20,184,166,0.4)] transition">
                    📊 统计词频
                 </motion.button>
              </div>
            )}
          </div>
        )}

        {step >= 3 && step < 5 && (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-teal-400 text-center font-bold mb-6 text-xl">
              {step === 3 ? '🔗 任务：点击或拖拽 【呆子】 至 【猪八戒】 上进行合义！' : '🎉 合并成功，准备进入词云渲染！'}
            </h3>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <AnimatePresence>
                {counts.map(item => (
                  <motion.div
                    key={item.w}
                    layout
                    draggable={item.w === '呆子' && step === 3}
                    onDragStart={(e: any) => { if (step === 3) e.dataTransfer.setData('word', item.w) }}
                    onClick={() => { if (step === 3 && item.w === '呆子') setDragged('呆子'); }}
                    onDragOver={(e: any) => e.preventDefault()}
                    onDrop={(e: any) => {
                      if (step === 3 && item.w === '猪八戒' && e.dataTransfer.getData('word') === '呆子') doMerge();
                    }}
                    className={`relative px-6 py-4 rounded-xl font-bold flex flex-col items-center border-2 transition-all ${
                      item.w === '呆子' && step === 3 
                        ? (dragged === '呆子' ? 'border-purple-400 bg-purple-900/50 shadow-[0_0_20px_rgba(192,132,252,0.8)] cursor-pointer' : 'border-indigo-400/50 bg-slate-800 hover:border-indigo-400 cursor-grab active:cursor-grabbing')
                        : item.w === '猪八戒' && step === 3
                          ? `border-pink-500/50 bg-slate-800 ${dragged === '呆子' ? 'animate-pulse shadow-[0_0_20px_rgba(236,72,153,0.8)] border-pink-500 cursor-pointer' : ''}`
                          : 'border-slate-600 bg-slate-800/80 cursor-default'
                    }`}
                    onClickCapture={() => {
                       if (step === 3 && item.w === '猪八戒' && dragged === '呆子') doMerge();
                    }}
                  >
                    <span className="text-2xl text-white">{item.w}</span>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-teal-500 border-2 border-slate-900 flex items-center justify-center text-white font-black text-sm">
                      x{item.c}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {step === 4 && (
              <motion.div initial={{scale:0}} animate={{scale:1}} className="flex flex-col w-full max-w-2xl gap-4 mt-4">
                {l3QuizReqs.map((q, i) => (
                  <div key={i} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                    <h4 className="text-teal-200 mb-3 font-bold">{i + 1}. {q.q}</h4>
                    <div className="flex flex-col gap-2">
                       {q.opts.map((opt, oIdx) => (
                          <motion.button 
                            key={oIdx}
                            animate={shakeQ === i ? {x:[-5,5,-5,5,0]} : {}}
                            disabled={quizAns[i] !== undefined}
                            onClick={() => handleQuiz(i, oIdx)}
                            className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${quizAns[i] === oIdx ? 'bg-green-500/30 border-green-500 text-green-100' : 'bg-slate-900/50 border-slate-600 hover:border-teal-400 text-slate-300'}`}
                          >
                            {opt}
                          </motion.button>
                       ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {step === 5 && (
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-full">
            <div className="bg-green-500/20 border border-green-400 text-green-300 px-6 py-3 rounded-xl text-xl font-bold animate-pulse shadow-[0_0_20px_rgba(74,222,128,0.2)]">
              🎉 通关加工厂！积分 +300！
            </div>
            <PasswordGate expected="9999" onUnlock={onPass} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Level4({ addScore, onPass, playerName }: { addScore: (n: number) => void, onPass: () => void, playerName?: string }) {
  const [themeKey, setThemeKey] = useState<string | null>(null);
  const [step, setStep] = useState(0); 
  const [words, setWords] = useState<string[]>([]);
  const [counts, setCounts] = useState<{w:string, c:number}[]>([]);
  const [poppedIdxs, setPoppedIdxs] = useState<number[]>([]);
  const [wrongWord, setWrongWord] = useState<number | null>(null);
  const [showAIButton, setShowAIButton] = useState(playerName === "教师测试账号");

  useEffect(() => {
    if (playerName !== "教师测试账号") {
      const timer = setTimeout(() => {
        setShowAIButton(true);
      }, 3 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [playerName]);

  const doTokenize = () => {
    if (!themeKey) return;
    const txt = themeData[themeKey].rawText;
    const cleanTokens = txt.replace(/[，。、！：？\n"]/g, " ").split(/\s+/).filter(Boolean);
    setWords(cleanTokens);
    setStep(1);
    setPoppedIdxs([]);
  };

  const handlePop = (idx: number, isStop: boolean) => {
    if (step !== 1) return;
    if (poppedIdxs.includes(idx)) return;
    
    if (isStop) {
      const newPopped = [...poppedIdxs, idx];
      setPoppedIdxs(newPopped);
      const totalStops = words.filter(w => dict.stopWords.includes(w)).length;
      if (newPopped.length === totalStops) {
         setTimeout(() => {
            const remaining = words.filter((_, i) => !newPopped.includes(i));
            setWords(remaining);
            setStep(2);
         }, 800);
      }
    } else {
      setWrongWord(idx);
      setTimeout(() => setWrongWord(null), 500);
    }
  };

  const doFreqCount = () => {
    const map: Record<string, number> = {};
    words.forEach(w => map[w] = (map[w]||0)+1);
    setCounts(Object.entries(map).map(([w, c]) => ({ w, c })));
    setStep(3);
  };

  const doMergeSynonyms = () => {
    const map: Record<string, number> = {};
    counts.forEach(({w, c}) => {
       const fw = dict.synonyms[w as keyof typeof dict.synonyms] || w;
       map[fw] = (map[fw]||0)+c;
    });
    setCounts(Object.entries(map).map(([w, c]) => ({ w, c })));
    setStep(4);
  };

  const doGenerateCloud = () => {
    setStep(5);
    addScore(400);
  };

  const aiGenerateCloud = () => {
    if (!themeKey) return;
    const txt = themeData[themeKey].rawText;
    const cleanTokens = txt.replace(/[，。、！：？\n"]/g, " ").split(/\s+/).filter(Boolean);
    const validWords = cleanTokens.filter(w => !dict.stopWords.includes(w));
    
    const map1: Record<string, number> = {};
    validWords.forEach(w => map1[w] = (map1[w]||0)+1);
    
    const map2: Record<string, number> = {};
    Object.entries(map1).forEach(([w, c]) => {
       const fw = dict.synonyms[w as keyof typeof dict.synonyms] || w;
       map2[fw] = (map2[fw]||0)+c;
    });
    
    setWords([]);
    setCounts(Object.entries(map2).map(([w, c]) => ({ w, c })));
    setStep(5);
    addScore(400);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl">
       <h2 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] neon-text py-2">
         终极创世炉
       </h2>
       <p className="text-slate-300 mb-8 text-xl font-medium tracking-wide">亲自动手完成词云生成，或开启AI一键生成模式</p>
       
       {!themeKey ? (
         <div className="glass p-10 rounded-3xl w-full border border-orange-500/40">
           <h3 className="text-2xl text-white font-bold mb-6 text-center">👇 选择注入创世炉的数据母源 👇</h3>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
             {Object.entries(themeData).map(([k, v]) => (
                <motion.button 
                  key={k} 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setThemeKey(k)}
                  className="bg-slate-800/80 hover:bg-slate-700 py-6 rounded-2xl border border-slate-600 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all font-bold text-xl text-orange-200"
                >
                  {v.title}
                </motion.button>
             ))}
           </div>
         </div>
       ) : (
         <div className="w-full flex items-stretch gap-6">
            
            {/* MANUAL PIPELINE */}
            <div className="flex-grow glass p-8 rounded-3xl border border-slate-600 w-full flex flex-col items-center">
               <div className="flex flex-wrap items-center justify-between w-full mb-6 gap-4">
                 <h3 className="text-2xl text-white font-bold flex items-center gap-2">
                   <CheckCircle2 className="text-blue-400" /> 手动流水线 (Manual)
                 </h3>
                 {step < 5 && showAIButton && (
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={aiGenerateCloud}
                     className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-2 px-6 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-white/30"
                   >
                     <Zap className="w-5 h-5" /> AI一键生成
                   </motion.button>
                 )}
               </div>
               
               <div className="flex flex-wrap gap-3 justify-center mb-10 border-b border-slate-700 pb-8 w-full">
                  {[
                    { s: 1, label: "🔪 1. 运行分词" },
                    { s: 2, label: "🗑️ 2. 剔除废词" },
                    { s: 3, label: "📊 3. 统计词频" },
                    { s: 4, label: "🔗 4. 合义词" },
                    { s: 5, label: "☁️ 5. 渲染词云" }
                  ].map(btn => {
                     const isCurrent = step === btn.s - 1;
                     const isDone = step >= btn.s;
                     return (
                       <div 
                         key={btn.s}
                         className={`px-5 py-3 rounded-xl font-bold transition-all border ${
                           isCurrent ? 'bg-blue-600/30 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse' :
                           isDone ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30' :
                           'bg-slate-800 text-slate-500 border-slate-700 opacity-50'
                         }`}
                       >
                         {btn.label}
                       </div>
                     )
                  })}
               </div>

               {/* Stage Area */}
               <div className="w-full min-h-[400px] bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6 overflow-hidden flex flex-col items-center justify-start gap-6 relative">
                 {step === 0 && (
                    <div className="flex flex-col items-center justify-center w-full h-full pt-12">
                      <p className="text-blue-300 mb-6 font-bold text-xl animate-pulse cursor-default">👇 亲自动手：点击下方文字开始【文本分词】 👇</p>
                      <motion.p 
                        initial={{opacity:0}} 
                        animate={{opacity:1}} 
                        whileHover={{ scale: 1.02, textShadow: "0 0 10px rgba(59,130,246,0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={doTokenize}
                        className="text-slate-200 text-lg leading-relaxed max-w-2xl text-justify cursor-crosshair p-6 bg-slate-800/50 rounded-xl border border-slate-600 hover:border-blue-400"
                      >
                        {themeData[themeKey].rawText}
                      </motion.p>
                    </div>
                 )}
                 {step === 1 && (
                    <div className="flex flex-col items-center justify-start w-full">
                      <p className="text-blue-300 mb-6 font-bold text-xl animate-pulse">👇 慧眼识珠：请仔细读词，点击戳破所有的无用『虚词』 👇</p>
                      <div className="flex flex-wrap gap-3 justify-center content-start">
                         <AnimatePresence>
                           {words.map((w, i) => {
                              const isStop = dict.stopWords.includes(w);
                              return (
                                !poppedIdxs.includes(i) && (
                                  <motion.span 
                                    key={`${w}-${i}`} 
                                    layout 
                                    animate={wrongWord === i ? { x: [-5, 5, -5, 5, 0] } : {}}
                                    transition={{ duration: 0.3 }}
                                    exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                    onClick={() => handlePop(i, isStop)}
                                    className={`px-4 py-2 bg-slate-800 rounded font-bold text-lg select-none transition-colors border-2 ${
                                      wrongWord === i 
                                        ? 'border-red-500/80 bg-red-500/40 text-red-200 cursor-default' 
                                        : 'border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] cursor-pointer'
                                    }`}
                                  >
                                    {w}
                                  </motion.span>
                                )
                              );
                           })}
                         </AnimatePresence>
                      </div>
                    </div>
                 )}
                 {step === 2 && (
                    <div className="flex flex-col items-center justify-start w-full h-full">
                      <div className="flex flex-wrap gap-3 justify-center content-start mb-10 opacity-70">
                         {words.map((w, i) => (
                            <span key={`${w}-${i}`} className="px-4 py-2 bg-slate-800 border border-slate-600 rounded font-bold text-lg text-slate-200">
                              {w}
                            </span>
                         ))}
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={doFreqCount}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl px-10 py-5 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.6)] border-2 border-blue-400 absolute bottom-10"
                      >
                        🧮 亲自动手：统计上方词频
                      </motion.button>
                    </div>
                 )}
                 {step === 3 && (
                    <div className="flex flex-col items-center justify-start w-full h-full pt-4">
                      <div className="flex flex-wrap items-center justify-center gap-4 mb-20 max-w-4xl">
                         <AnimatePresence>
                           {counts.map((item) => (
                             <motion.div
                               key={item.w}
                               layout
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               className="px-4 py-2 bg-slate-800 border-2 border-indigo-500/50 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                             >
                               <span className="text-indigo-200 font-black text-lg">{item.w}</span>
                               <span className="bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-sm font-bold">x{item.c}</span>
                             </motion.div>
                           ))}
                         </AnimatePresence>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={doMergeSynonyms}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-2xl px-10 py-5 rounded-3xl shadow-[0_0_30px_rgba(79,70,229,0.6)] border-2 border-indigo-400 absolute bottom-10"
                      >
                        🔗 亲自动手：一键合并同义词
                      </motion.button>
                    </div>
                 )}
                 {step === 4 && (
                    <div className="flex flex-col items-center justify-start w-full h-full pt-4">
                      <div className="flex flex-wrap items-center justify-center gap-4 mb-20 max-w-4xl">
                           {counts.map((item) => (
                             <div key={item.w} className="px-4 py-2 bg-slate-800 border-2 border-purple-500/50 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                               <span className="text-purple-200 font-black text-lg">{item.w}</span>
                               <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm font-bold">x{item.c}</span>
                             </div>
                           ))}
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05, rotate: [-2, 2, -2, 0] }}
                        whileTap={{ scale: 0.95 }}
                        onClick={doGenerateCloud}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black text-2xl px-10 py-5 rounded-3xl shadow-[0_0_40px_rgba(236,72,153,0.8)] border-2 border-white/50 absolute bottom-10 flex items-center gap-3"
                      >
                        <Sparkles className="w-8 h-8"/> 挥动魔法棒：生成最终词云！
                      </motion.button>
                    </div>
                 )}
                 {step === 5 && (
                    <>
                    <div className="flex items-center justify-center w-full h-[350px] relative">
                       <AnimatePresence>
                          {[...counts].sort((a,b) => b.c - a.c).map((item, idx) => {
                             const color = getRandomColor();
                             const phi = idx * 2.39996; // 黄金角度
                             const r = Math.sqrt(idx) * 35; // 螺旋半径，控制疏密
                             const dx = Math.cos(phi) * r;
                             const dy = Math.sin(phi) * r;
                             return (
                             <motion.span
                               key={item.w}
                               initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
                               animate={{ 
                                 scale: 1, 
                                 opacity: 1, 
                                 x: "-50%", 
                                 y: "-50%", 
                                 rotate: (Math.random() - 0.5) * 15 
                               }}
                               transition={{ type: 'spring', damping: 8, mass: 0.6, delay: idx * 0.05 + Math.random() * 0.1 }}
                               style={{ 
                                 position: 'absolute',
                                 left: `calc(50% + ${dx}px)`,
                                 top: `calc(50% + ${dy}px)`,
                                 fontSize: `${Math.min(64, Math.max(14, item.c * 12 + 10))}px`, 
                                 color,
                                 lineHeight: 1,
                                 whiteSpace: 'nowrap',
                                 textShadow: `0 0 15px ${color}80, 0 5px 10px rgba(0,0,0,0.8)`,
                                 zIndex: 100 - idx
                               }}
                               className="font-black hover:scale-125 hover:!z-[200] transition-all cursor-crosshair"
                             >
                               {item.w}
                             </motion.span>
                             )})}
                       </AnimatePresence>
                    </div>
                    <motion.button 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onPass}
                      className="absolute bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-2 rounded-full border border-white/50 font-bold text-lg shadow-[0_0_15px_rgba(236,72,153,0.5)] z-10 whitespace-nowrap"
                    >
                       ✨ 下一步 ✨
                    </motion.button>
                    </>
                 )}
               </div>
            </div>
         </div>
       )}
    </div>
  )
}

function Certificate({ name, score, reset }: { name: string, score: number, reset: () => void }) {
  const confettis = Array.from({ length: 60 });
  
  useEffect(() => {
    if (name !== '教师测试账号') {
      fetch('https://quickform.cn/api/y9jvjcpvyo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, score })
      }).catch(console.error);
    }
  }, [name, score]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 overflow-hidden z-[100]">
      {/* Particle System internal to component */}
      {confettis.map((_, i) => (
        <motion.div
           key={i}
           className="absolute w-4 h-4 rounded-sm"
           style={{ backgroundColor: getRandomColor() }}
           initial={{ x: 0, y: -200, scale: 0, opacity: 1 }}
           animate={{ 
              x: (Math.random() - 0.5) * window.innerWidth * 1.5, 
              y: (Math.random() - 0.5) * window.innerHeight * 1.5 + 500, 
              rotate: Math.random() * 720,
              opacity: [1, 1, 0] 
           }}
           transition={{ duration: 3 + Math.random() * 3, ease: "easeOut" }}
        />
      ))}
      {confettis.map((_, i) => (
        <motion.div
           key={`sec-${i}`}
           className="absolute w-3 h-3 rounded-full"
           style={{ backgroundColor: '#facc15' }}
           initial={{ x: 0, y: window.innerHeight/2, scale: 0, opacity: 1 }}
           animate={{ 
              x: (Math.random() - 0.5) * window.innerWidth, 
              y: (Math.random() - 1) * window.innerHeight * 1.5, 
              rotate: Math.random() * 720,
              opacity: [1, 1, 0] 
           }}
           transition={{ duration: 2 + Math.random() * 2, ease: "easeOut", delay: 0.5 }}
        />
      ))}

      <motion.div 
         initial={{ scale: 0, opacity: 0, rotate: -10 }} 
         animate={{ scale: 1, opacity: 1, rotate: 0 }} 
         transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
         className="relative p-2 rounded-[2.5rem] bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-600 shadow-[0_0_100px_rgba(250,204,21,0.6)] overflow-hidden"
      >
         {/* Rotating border effect inside the border area */}
         <div className="absolute -inset-[150%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#facc15_0%,transparent_20%,#facc15_50%,transparent_70%,#facc15_100%)] opacity-80 mix-blend-screen" />
         
         <div className="bg-slate-900 rounded-[2.2rem] p-16 flex flex-col items-center relative overflow-hidden z-10">
            {/* Gloss reflection effect */}
            <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            
            <motion.div animate={{ rotateY: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} style={{ transformStyle: 'preserve-3d' }}>
               <Trophy className="text-yellow-400 w-32 h-32 mb-10 drop-shadow-[0_0_25px_rgba(250,204,21,1)]" />
            </motion.div>
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-600 mb-6 text-center neon-text tracking-wider glitch-effect py-2">
               终极通关
            </h1>
            <h2 className="text-4xl text-purple-200 font-black mb-8 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] neon-text">首席跨学科数据架构师</h2>
            
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50 mb-8 rounded-full" />
            
            <div className="text-2xl text-slate-300 mb-12 text-center leading-relaxed">
               试炼者 <span className="text-yellow-400 font-bold px-2 text-3xl neon-text">{name}</span><br/>
               你已拔剑斩破数据洪流，铸就绝美云图真知！<br/>
               <motion.span 
                 animate={{ scale: [1, 1.05, 1], color: ['#ffffff', '#facc15', '#ffffff'] }} 
                 transition={{ duration: 2, repeat: Infinity }}
                 className="text-5xl block mt-8 font-black text-white text-shadow-xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3"
               >
                 满载荣光：🏆 {score} / 1000
               </motion.span>
            </div>
            
            <button 
              onClick={reset} 
              className="px-12 py-5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-400 text-white rounded-full font-black text-2xl flex items-center gap-3 transition-transform hover:scale-110 shadow-[0_0_30px_rgba(219,39,119,0.8)] z-20 group"
            >
               <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" /> 重新启程
            </button>
         </div>
      </motion.div>
    </div>
  );
}

// === Admin Panel Component ===
function AdminPanel({ 
  setLevel, 
  setPlayerName,
  onClose 
}: { 
  setLevel: (l: number) => void, 
  setPlayerName: (n: string) => void,
  onClose: () => void 
}) {
  const [pwd, setPwd] = useState("");
  const [auth, setAuth] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === "405") setAuth(true);
    else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const jump = (l: number) => {
    setPlayerName("教师测试账号");
    setLevel(l);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-[200] flex items-center justify-center backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass p-8 rounded-3xl border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white px-2 rounded-full hover:bg-slate-800 transition-colors">✕</button>
        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 flex items-center gap-2 justify-center">
          <Key className="w-6 h-6 text-pink-400" /> 控制台 (教师专用)
        </h3>
        
        {!auth ? (
          <motion.form animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={pwd} 
              onChange={e => setPwd(e.target.value)} 
              placeholder="请输入密码" 
              className="bg-slate-900/80 border border-pink-500/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-400 text-center tracking-widest font-mono" 
              autoFocus
            />
            <button type="submit" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black py-3 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all transform active:scale-95">
              解锁面板
            </button>
          </motion.form>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3, 4, 5].map(l => (
              <button 
                key={l} 
                onClick={() => jump(l)} 
                className="bg-slate-800/80 border border-slate-600 hover:bg-pink-600 hover:border-pink-400 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95"
              >
                跳转 第{l}关
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// === Main App Component ===
export default function App() {
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  const handleStart = (name: string) => {
    setPlayerName(name);
    setLevel(1);
  };

  const addScore = (pts: number) => {
    setScore(s => s + pts);
  };

  const handleReset = () => {
    setLevel(0);
    setScore(0);
    setPlayerName("");
  };

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden text-slate-200 font-sans relative perspective-1000">
      {/* Absolute standalone minimal CSS to enforce Single File requirement styling constraints */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes breathing {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glitch {
          0% { text-shadow: 0.05em 0 0 #ff00c1, -0.05em -0.025em 0 #00fff9, -0.025em 0.05em 0 #ffea00; }
          14% { text-shadow: 0.05em 0 0 #ff00c1, -0.05em -0.025em 0 #00fff9, -0.025em 0.05em 0 #ffea00; }
          15% { text-shadow: -0.05em -0.025em 0 #ff00c1, 0.025em 0.025em 0 #00fff9, -0.05em -0.05em 0 #ffea00; }
          49% { text-shadow: -0.05em -0.025em 0 #ff00c1, 0.025em 0.025em 0 #00fff9, -0.05em -0.05em 0 #ffea00; }
          50% { text-shadow: 0.025em 0.05em 0 #ff00c1, 0.05em 0 0 #00fff9, 0 -0.05em 0 #ffea00; }
          99% { text-shadow: 0.025em 0.05em 0 #ff00c1, 0.05em 0 0 #00fff9, 0 -0.05em 0 #ffea00; }
          100% { text-shadow: -0.025em 0 0 #ff00c1, -0.025em -0.025em 0 #00fff9, -0.025em -0.05em 0 #ffea00; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .bg-cyber {
          background: linear-gradient(-45deg, #020617, #2e1065, #000000, #4c1d95, #082f49);
          background-size: 400% 400%;
          animation: breathing 15s ease infinite;
        }
        .glass {
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        .neon-text {
          text-shadow: 0 0 8px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;
        }
        .glitch-effect:hover {
          animation: glitch 0.3s infinite;
        }
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        /* Grid Ground */
        .cyber-grid {
          position: absolute;
          width: 200%;
          height: 200%;
          top: 0; left: -50%;
          background-image: 
            linear-gradient(rgba(56, 189, 248, 0.15) 2px, transparent 2px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.15) 2px, transparent 2px);
          background-size: 50px 50px;
          transform: perspective(600px) rotateX(60deg) translateY(-100px) translateZ(-200px);
          pointer-events: none;
        }
        .translate-z-10 {
          transform: translateZ(30px);
        }
      `}} />

      {/* Cyber Breathing Background */}
      <div className="fixed inset-0 bg-cyber -z-20 pointer-events-none" />
      
      {/* 3D Cyber Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40 mix-blend-screen">
         <div className="cyber-grid animate-[breathing_10s_linear_infinite]" />
      </div>

      {/* Laser Scanline */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-20 mix-blend-overlay">
        <div className="w-full h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_50px_rgba(34,211,238,0.5)]" style={{ animation: 'scanline 8s linear infinite' }} />
      </div>

      {/* Global Score Board */}
      {level > 0 && level < 5 && <ScoreBoard score={score} />}

      {/* Main Content Area */}
      <main className="w-full min-h-screen flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {level === 0 && (
            <motion.div key="l0" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.1, filter:"blur(10px)"}} className="w-full flex justify-center">
              <Level0 onStart={handleStart} />
            </motion.div>
          )}
          {level === 1 && (
            <motion.div key="l1" initial={{opacity:0, x:100}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-100}} className="w-full flex justify-center">
              <Level1 addScore={addScore} onPass={() => setLevel(2)} />
            </motion.div>
          )}
          {level === 2 && (
            <motion.div key="l2" initial={{opacity:0, x:100}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-100}} className="w-full flex justify-center">
              <Level2 addScore={addScore} onPass={() => setLevel(3)} />
            </motion.div>
          )}
          {level === 3 && (
            <motion.div key="l3" initial={{opacity:0, x:100}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-100}} className="w-full flex justify-center">
              <Level3 addScore={addScore} onPass={() => setLevel(4)} />
            </motion.div>
          )}
          {level === 4 && (
            <motion.div key="l4" initial={{opacity:0, x:100}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-100}} className="w-full flex justify-center">
              <Level4 addScore={addScore} onPass={() => setLevel(5)} playerName={playerName} />
            </motion.div>
          )}
          {level === 5 && (
            <motion.div key="l5" className="w-full h-full">
              <Certificate name={playerName} score={score} reset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Admin Panel Toggle Trigger */}
      <button 
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-pink-400 hover:bg-slate-800/50 transition-colors z-[150] opacity-30 hover:opacity-100"
        title="教师控制台"
      >
        <Key className="w-5 h-5 opacity-80" />
      </button>

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPanel 
            setLevel={setLevel} 
            setPlayerName={setPlayerName} 
            onClose={() => setShowAdmin(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

