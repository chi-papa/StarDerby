import "./index.css";
import {
  createIcons,
  Trophy,
  Calendar,
  Coins,
  Dna,
  Zap,
  Activity,
  ChevronRight,
  ChevronLeft,
  Play,
  Heart,
  TrendingUp,
  History,
  Star,
  Home,
  Sparkles,
  Flame,
  Wind,
  MessageSquare,
  Send,
} from "lucide";
import { STALLIONS, INITIAL_MARES } from "./constants/gameData.js";
import {
  checkBreeding,
  generateRandomHorse,
  generateHorseName,
} from "./logic/breeding.js";
import { calculateGrowth, getPhysicalState } from "./logic/growth.js";
import { simulateRace, generateEnemyHorses } from "./logic/raceSim.js";
import { generateFinishLineCommentary } from "./logic/commentary.js";
import { getBreedingAdvice } from "./services/geminiService.js";
import { mountPerformanceChart } from "./components/PerformanceChart.jsx";
import { mountRaceSimulation } from "./components/RaceSimulation.jsx";
import "./logic/hallOfFame.js";

// --- Global State ---
const SAVE_KEY = "stellar_breeder_save_v1";

window.state = {
  retiredMares: [],
  retiredStallions: [],
  showRetireBreedingModal: false,
  retireBreedingHorseId: null,

  screen: "title",
  horses: [],
  mares: [...INITIAL_MARES],
  money: 10000000,
  starShards: 0,
  useStarBlessing: false,
  raceTab: "regular",
  week: 1,
  month: 1,
  year: 1,
  selectedHorseId: null,
  selectedMareId: null,
  selectedStallionId: null,
  breedingResult: null,
  currentRace: null,
  raceResult: null,
  raceStep: 0,
  history: [],
  showSaveModal: false,
  scoutedHorse: null,
  showScoutModal: false,
  showPerformanceModal: false,
  viewingHorseId: null,
  stableRankFilter: "all",
  showSellModal: false,
  sellingHorseId: null,
  showTrainingModal: false,
  trainingHorseId: null,
  trainingStage: "select",
  trainingType: null,
  trainingResult: null,
  gaugePosition: 0,
  gaugeDirection: 1,
  hallOfFame: [],
  unlockedMilestones: [],
  dialog: null,
  renameHorseId: null,
  showRenameModal: false,
  renameTempName: "",
};

// --- Custom Sandbox-Safe Alerts & Confirms ---
window.safeAlert = (message, callback) => {
  window.setState({
    dialog: {
      type: "alert",
      title: "ALERT",
      message: message,
      onConfirm: () => {
        window.setState({ dialog: null });
        if (callback) callback();
      },
    },
  });
};

window.safeConfirm = (message, onConfirm, onCancel) => {
  window.setState({
    dialog: {
      type: "confirm",
      title: "CONFIRMATION",
      message: message,
      onConfirm: () => {
        window.setState({ dialog: null });
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        window.setState({ dialog: null });
        if (onCancel) onCancel();
      },
    },
  });
};

// Override default alert
window.alert = (message) => {
  window.safeAlert(message);
};

// --- Save & Load Implementation ---
export function saveGame() {
  try {
    const dataToSave = {
      retiredMares: window.state.retiredMares || [],
      retiredStallions: window.state.retiredStallions || [],

      horses: window.state.horses,
      mares: window.state.mares,
      money: window.state.money,
      starShards: window.state.starShards,
      week: window.state.week,
      month: window.state.month,
      year: window.state.year,
      history: window.state.history,
      hallOfFame: window.state.hallOfFame || [],
      unlockedMilestones: window.state.unlockedMilestones || [],
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error("Failed to auto-save:", e);
  }
}

export function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      window.state.horses = data.horses || [];
      window.state.mares = data.mares || [...INITIAL_MARES];
      window.state.money =
        typeof data.money === "number" ? data.money : 10000000;
      window.state.starShards =
        typeof data.starShards === "number" ? data.starShards : 0;
      window.state.week = data.week || 1;
      window.state.month = data.month || 1;
      window.state.year = data.year || 1;
      window.state.history = data.history || [];
      window.state.hallOfFame = data.hallOfFame || [];
      window.state.unlockedMilestones = data.unlockedMilestones || [];
      window.state.retiredMares = data.retiredMares || [];
      window.state.retiredStallions = data.retiredStallions || [];
      return true;
    }
  } catch (e) {
    console.error("Failed to load game:", e);
  }
  return false;
}

window.exportSaveData = () => {
  try {
    const dataToSave = {
      horses: window.state.horses,
      mares: window.state.mares,
      money: window.state.money,
      starShards: window.state.starShards,
      week: window.state.week,
      month: window.state.month,
      year: window.state.year,
      history: window.state.history,
      hallOfFame: window.state.hallOfFame || [],
      unlockedMilestones: window.state.unlockedMilestones || [],
    };
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stellar_breeder_save_y${window.state.year}_m${window.state.month}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("エラーが発生しました: " + e.message);
  }
};

window.importSaveData = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (typeof data.money === "undefined" || !Array.isArray(data.horses)) {
        throw new Error("無効なセーブデータファイル形式です。");
      }

      window.setState({
        horses: data.horses || [],
        mares: data.mares || [...INITIAL_MARES],
        money: data.money,
        starShards: typeof data.starShards === "number" ? data.starShards : 0,
        week: data.week || 1,
        month: data.month || 1,
        year: data.year || 1,
        history: data.history || [],
        hallOfFame: data.hallOfFame || [],
        unlockedMilestones: data.unlockedMilestones || [],
        screen: "stable",
        showSaveModal: false,
      });

      saveGame();
      alert("セーブデータを正常にインポートしました！ゲームを再開します。");
    } catch (err) {
      alert("セーブデータの読込に失敗しました: " + err.message);
    }
  };
  reader.readAsText(file);
};

window.setState = (updates) => {
  window.state = { ...window.state, ...updates };
  // Check and trigger milestones whenever state is set
  if (window.checkMilestones) {
    window.checkMilestones();
  }
  if (
    [
      "stable",
      "title",
      "breeding_mare",
      "breeding_stallion",
      "breeding_confirm",
      "race_select",
      "hall_of_fame",
    ].includes(window.state.screen)
  ) {
    saveGame();
  }
  render();
};

window.updateScoutName = (newName) => {
  if (window.state.scoutedHorse) {
    window.state.scoutedHorse.name = newName;
  }
};

window.generateRandomScoutName = () => {
  if (window.state.scoutedHorse) {
    window.state.scoutedHorse.name = generateHorseName();
    render();
  }
};

window.handleAction = (action, data) => {
  switch (action) {
    case "START_RACE":
      {
        const registeredIds = window.state.registeredHorseIds || [
          window.state.selectedHorseId,
        ];
        const playerHorses = window.state.horses.filter((h) =>
          registeredIds.includes(h.id),
        );
        const singleFee = data.fee || 0;
        const totalFee = singleFee * playerHorses.length;

        if (window.state.money < totalFee) {
          alert(
            "合計出走料が足りません。登録する所有馬を減らすか、別のレースを選ぶか、週をスキップして資金を得てください。",
          );
          return;
        }

        // Use forecasted weather if present, otherwise fallback to random
        const weatherOptions = ["Sunny", "Rainy", "Muddy"];
        const chosenWeather =
          data.weather ||
          weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        const raceWithConditions = {
          ...data,
          weather: chosenWeather,
          trackCondition:
            data.trackCondition ||
            (chosenWeather === "Sunny"
              ? "Good"
              : chosenWeather === "Rainy"
                ? "Heavy"
                : "Muddy"),
        };

        const enemiesCount = Math.max(1, 12 - playerHorses.length);
        const enemies = generateEnemyHorses(
          enemiesCount,
          raceWithConditions.grade,
        );
        const results = simulateRace(playerHorses, enemies, raceWithConditions);

        // Calculate total rewards and update histories for all registered player horses
        let totalEarnedPrize = 0;
        let totalEarnedShards = 0;

        const updatedHorsesForRace = window.state.horses.map((h) => {
          if (registeredIds.includes(h.id)) {
            const playerRes = results.find((r) => r.horseId === h.id);
            const pos = playerRes ? playerRes.position : 12;
            const isWin = pos === 1;
            const isGradedWin =
              [
                "G3",
                "G2",
                "G1",
                "G0",
                "G-ultra",
                "Event G1",
                "Event G2",
                "G-ULTRA",
              ].includes(raceWithConditions.grade) && pos === 1;

            let earnedPrize = 0;
            let earnedShards = 0;
            const basePrize = raceWithConditions.prize || 0;
            const baseShards = raceWithConditions.shards || 0;

            if (pos === 1) {
              earnedPrize = basePrize;
              earnedShards = baseShards;
            } else if (pos === 2) {
              earnedPrize = Math.round(basePrize * 0.4);
              earnedShards = Math.max(1, Math.round(baseShards * 0.5));
            } else if (pos === 3) {
              earnedPrize = Math.round(basePrize * 0.15);
              earnedShards = Math.max(1, Math.round(baseShards * 0.25));
            } else if (pos === 4 || pos === 5) {
              earnedPrize = Math.round(basePrize * 0.05);
              earnedShards = baseShards >= 4 ? 1 : 0;
            }

            totalEarnedPrize += earnedPrize;
            totalEarnedShards += earnedShards;

            const updatedHistory = h.raceHistory || [];
            const entry = {
              raceName: raceWithConditions.name,
              grade: raceWithConditions.grade,
              distance: raceWithConditions.distance,
              position: pos,
              time: playerRes ? playerRes.time : 999,
              speed: h.stats.speed,
              stamina: h.stats.stamina,
              guts: h.stats.guts || 550,
              year: window.state.year,
              month: window.state.month,
              week: window.state.week,
              earnedShards: earnedShards,
              earnedPrize: earnedPrize,
              weather: raceWithConditions.weather,
            };
            const currentStreak = isWin ? (h.consecutiveWins || 0) + 1 : 0;
            const maxStreak = Math.max(
              h.maxConsecutiveWins || 0,
              currentStreak,
            );
            return {
              ...h,
              winCount: (h.winCount || 0) + (isWin ? 1 : 0),
              totalRaces: (h.totalRaces || 0) + 1,
              consecutiveWins: currentStreak,
              maxConsecutiveWins: maxStreak,
              fatigue: Math.min(100, (h.fatigue || 0) + 30),
              gradedWins: isGradedWin
                ? [...(h.gradedWins || []), raceWithConditions.name]
                : h.gradedWins || [],
              raceHistory: [...updatedHistory, entry],
            };
          }
          return h;
        });

        window.setState({
          screen: "race_sim",
          currentRace: raceWithConditions,
          raceResult: results,
          raceStep: 0,
          money: window.state.money - totalFee + totalEarnedPrize,
          starShards: (window.state.starShards || 0) + totalEarnedShards,
          raceRewards: { prize: totalEarnedPrize, shards: totalEarnedShards },
          animatedResults: undefined,
          horses: updatedHorsesForRace,
        });
      }
      break;
    case "TOGGLE_RACE_REGISTRATION":
      {
        const id = data;
        const registered = window.state.registeredHorseIds || [
          window.state.selectedHorseId,
        ];
        let nextReg;
        if (registered.includes(id)) {
          nextReg = registered.filter((rid) => rid !== id);
        } else {
          nextReg = [...registered, id];
        }
        // Ensure primary selected remains
        if (!nextReg.includes(window.state.selectedHorseId)) {
          nextReg.unshift(window.state.selectedHorseId);
        }
        window.setState({ registeredHorseIds: nextReg });
      }
      break;
    case "TOGGLE_AUTO_TRAINING":
      {
        const id = data;
        const updatedHorses = window.state.horses.map((h) => {
          if (h.id === id) {
            return { ...h, isAutoTrained: !h.isAutoTrained };
          }
          return h;
        });
        window.setState({ horses: updatedHorses });
      }
      break;
    case "OPEN_PERFORMANCE_MODAL":
      window.setState({
        viewingHorseId: data,
        showPerformanceModal: true,
      });
      break;
    case "CLOSE_PERFORMANCE_MODAL":
      window.setState({
        viewingHorseId: null,
        showPerformanceModal: false,
      });
      break;
    case "CONFIRM_BREEDING":
      if (window.state.horses.length >= 8) {
        alert(
          "馬房がいっぱいです（最大8頭）。配合を行うには、既存の馬を「引退・売却」して空きを作ってください。",
        );
        return;
      }
      const {
        selectedMareId,
        selectedStallionId,
        selectedMareSource,
        selectedStallionSource,
      } = window.state;
      let mareObj, stallionObj;

      if (selectedMareSource === "stable") {
        mareObj = window.state.horses.find((h) => h.id === selectedMareId) || (window.state.retiredMares || []).find((h) => h.id === selectedMareId);
      } else {
        mareObj = window.state.mares.find((m) => m.id === selectedMareId);
      }

      if (selectedStallionSource === "stable") {
        stallionObj = window.state.horses.find(
          (h) => h.id === selectedStallionId,
        ) || (window.state.retiredStallions || []).find((h) => h.id === selectedStallionId);
      } else {
        stallionObj = STALLIONS.find((s) => s.id === selectedStallionId);
      }

      if (!mareObj || !stallionObj) {
        alert(
          "親馬を選択してください。または選択データがリセットされました。最初から選択し直してください。",
        );
        return;
      }

      // Calculate breeding fee
      let fee = 0;
      if (selectedStallionSource === "stable") {
        // Private owned stallion is free of rent, just ¥50万 labor & facility fee
        fee = 500000;
      } else {
        fee = window.getStallionPrice
          ? window.getStallionPrice(stallionObj)
          : stallionObj.price || stallionObj.fee || 0;
      }

      if (window.state.money < fee) {
        alert("資金が足りません");
        return;
      }

      const requiredShards = window.getBlessingCost
        ? window.getBlessingCost()
        : 5;
      const isBlessed =
        window.state.useStarBlessing &&
        window.state.starShards >= requiredShards;
      const res = checkBreeding(stallionObj, mareObj, isBlessed);

      window.setState({
        money: window.state.money - fee,
        starShards: isBlessed
          ? window.state.starShards - requiredShards
          : window.state.starShards,
        useStarBlessing: false,
        breedingResult: res,
        screen: "stable",
        horses: [...window.state.horses, res.horse],
      });

      if (res.isMutation) {
        alert(
          `🧬✨【血統突然変異 (MUTATION)】\n血統の奇跡が起きました！\n限界能力値が大きく底上げされた覚醒馬「${res.horse.name}」が誕生しました！\n（血統ランクがさらに上昇し、新たな金特性 【${res.horse.traits[res.horse.traits.length - 1] || "特性"}】 が獲得・追加されました！）`,
        );
      } else if (isBlessed) {
        alert(
          `🌟【星片の加護】神秘の光に包まれて、超強力な限界ステータスと2つの金特性を持つ仔馬「${res.horse.name}」が誕生しました！`,
        );
      } else {
        alert(`${res.horse.name}が誕生しました！`);
      }
      break;
    case "NEXT_WEEK":
      nextWeek();
      break;
    case "GENERATE_SCOUT_HORSE":
      if (window.state.horses.length >= 8) {
        alert(
          "馬房がいっぱいです（最大8頭）。新馬をスカウトするには、既存の馬を「引退・売却」して空きを作ってください。",
        );
        return;
      }
      const newScouted = generateRandomHorse();
      window.setState({
        scoutedHorse: newScouted,
        showScoutModal: true,
      });
      break;
    case "CONFIRM_SCOUT_HORSE":
      if (window.state.horses.length >= 8) {
        alert(
          "馬房がいっぱいです（最大8頭）。新馬をスカウト・所有するには、既存の馬を「引退・売却」して空きを作ってください。",
        );
        return;
      }
      if (window.state.money < 2000000) {
        alert("スカウト資金が足りません (必要経費: ¥200万)");
        return;
      }
      const acquiredHorse = { ...window.state.scoutedHorse };
      window.setState({
        money: window.state.money - 2000000,
        horses: [...window.state.horses, acquiredHorse],
        scoutedHorse: null,
        showScoutModal: false,
      });
      alert(`${acquiredHorse.name}をスカウトしました！`);
      break;
    case "CANCEL_SCOUT_HORSE":
      window.setState({
        scoutedHorse: null,
        showScoutModal: false,
      });
      break;
    case "OPEN_RETIRE_TO_BREEDING_MODAL":
      window.setState({
        retireBreedingHorseId: data,
        showRetireBreedingModal: true,
      });
      break;
    case "CONFIRM_RETIRE_TO_BREEDING":
      {
        const h = window.state.horses.find((item) => item.id === data);
        if (!h) return;
        if (h.age < 3) {
          alert("引退・転向させるには3歳以上である必要があります。");
          return;
        }
        
        const breedingHorse = {
          ...h,
          isRetired: true,
          isRetiredToBreeding: true,
          pedigree: {
            father: h.pedigree?.father || "?",
            mother: h.pedigree?.mother || "?",
            grandFathers: h.pedigree?.grandFathers || ["?", "?"],
            grandMothers: h.pedigree?.grandMothers || ["?", "?"],
          },
          stats: {
            speed: h.maxStats?.speed || h.stats.speed,
            stamina: h.maxStats?.stamina || h.stats.stamina,
            guts: h.maxStats?.guts || h.stats.guts,
            temperament: h.maxStats?.temperament || h.stats.temperament,
            health: h.maxStats?.health || h.stats.health,
            luck: h.maxStats?.luck || h.stats.luck,
            explosiveness: h.maxStats?.explosiveness || h.stats.explosiveness,
          },
          explosivePower: h.explosivePower || 100,
        };

        const isFilly = h.gender === "filly";
        let updatedRetiredMares = [...(window.state.retiredMares || [])];
        let updatedRetiredStallions = [...(window.state.retiredStallions || [])];

        if (isFilly) {
          updatedRetiredMares.push(breedingHorse);
        } else {
          updatedRetiredStallions.push(breedingHorse);
        }

        const remainingHorses = window.state.horses.filter((item) => item.id !== h.id);

        window.setState({
          horses: remainingHorses,
          retiredMares: updatedRetiredMares,
          retiredStallions: updatedRetiredStallions,
          showRetireBreedingModal: false,
          retireBreedingHorseId: null,
        });

        alert(
          `${h.name}は現役を引退し、自家所有の「${isFilly ? "繁殖牝馬" : "種牡馬"}」として登録されました！今後は配合料無料で配合に使用できます。`
        );
      }
      break;
    case "OPEN_SELL_MODAL":
      window.setState({
        sellingHorseId: data,
        showSellModal: true,
      });
      break;
    case "CONFIRM_SELL_HORSE":
      const targetHorse = window.state.horses.find((h) => h.id === data);
      if (!targetHorse) return;

      const value = getHorseSellValue(targetHorse);
      const remainingHorses = window.state.horses.filter(
        (h) => h.id !== targetHorse.id,
      );

      window.setState({
        horses: remainingHorses,
        money: window.state.money + value,
        showSellModal: false,
        sellingHorseId: null,
      });
      alert(
        `${targetHorse.name}が引退し、売却資金として¥${(value / 10000).toFixed(0)}万を受け取りました。`,
      );
      break;
    case "OPEN_RENAME_MODAL":
      {
        const horse = window.state.horses.find((h) => h.id === data);
        if (!horse) return;
        window.setState({
          renameHorseId: data,
          showRenameModal: true,
          renameTempName: horse.name,
        });
      }
      break;
    case "CONFIRM_RENAME_HORSE":
      {
        const newName = window.state.renameTempName.trim();
        if (!newName) {
          alert("馬名を入力してください。");
          return;
        }
        if (newName.length > 25) {
          alert("馬名が長すぎます。");
          return;
        }
        const updatedHorses = window.state.horses.map((h) => {
          if (h.id === window.state.renameHorseId) {
            return { ...h, name: newName };
          }
          return h;
        });
        window.setState({
          horses: updatedHorses,
          showRenameModal: false,
          renameHorseId: null,
        });
        alert(`馬名を「${newName}」に変更しました！`);
      }
      break;
    case "GENERATE_RENAME_NAME":
      window.setState({
        renameTempName: generateHorseName(),
      });
      break;
    case "REGISTER_HALL_OF_FAME":
      const horseToRegister = window.state.horses.find((h) => h.id === data);
      if (!horseToRegister) return;
      const isAlreadyHOF = (window.state.hallOfFame || []).some(
        (h) => h.id === horseToRegister.id,
      );
      if (isAlreadyHOF) {
        alert("すでに殿堂入り登録されています。");
        return;
      }
      const updatedHorsesReg = window.state.horses.map((h) => {
        if (h.id === horseToRegister.id) {
          return { ...h, isHallOfFameRegistered: true };
        }
        return h;
      });
      const hofCopy = { ...horseToRegister, isHallOfFameRegistered: true };
      window.setState({
        horses: updatedHorsesReg,
        hallOfFame: [...(window.state.hallOfFame || []), hofCopy],
      });
      alert(
        `🎉【殿堂登録完了】おめでとうございます！\n伝説 of 競走馬「${horseToRegister.name}」が永久に殿堂入り(Hall of Fame)へ刻まれました。`,
      );
      break;
    case "OPEN_TRAINING_MODAL":
      window.setState({
        trainingHorseId: data,
        showTrainingModal: true,
        trainingStage: "select",
        trainingType: null,
        trainingResult: null,
      });
      break;
    case "CLOSE_TRAINING_MODAL":
      if (window.trainingInterval) {
        clearInterval(window.trainingInterval);
      }
      window.setState({
        trainingHorseId: null,
        showTrainingModal: false,
        trainingStage: "select",
        trainingType: null,
        trainingResult: null,
      });
      break;
    case "PERFORM_NORMAL_TRAINING_SPEED":
      {
        const horseId = data;
        const horse = window.state.horses.find((h) => h.id === horseId);
        if (!horse) return;

        const cost = 300000;
        if (window.state.money < cost) {
          window.safeAlert(
            "資金が不足しています！（並・スピード調教には30万円必要です）",
          );
          return;
        }

        // --- Weekly Count Limit check ---
        const trainingCount = horse.weeklyTrainingCount || 0;
        if (trainingCount >= 2) {
          window.safeAlert(
            `「${horse.name}」は今週すでに2回調教（並調教）を行っています。\n翌週に進むとリフレッシュされ、再度調教可能になります。`,
          );
          return;
        }

        // --- Fatigue check ---
        const currentFatigue = horse.fatigue || 0;
        if (currentFatigue >= 80) {
          window.safeAlert(
            `「${horse.name}」は疲労が溜まりすぎています（疲労度: ${currentFatigue}%）。\nこの状態で調教を強行するとケガをする恐れがあるため実施できません。\n翌週へ進めて休ませてあげてください。`,
          );
          return;
        }

        const maxSpeed = horse.maxStats?.speed || 500;
        if (horse.stats.speed >= maxSpeed) {
          window.safeAlert(
            `「${horse.name}」のスピードは既に個体限界値（${maxSpeed}）に達しているため、これ以上普通調教では向上しません！`,
          );
          return;
        }

        const newSpeed = Math.min(maxSpeed, (horse.stats.speed || 300) + 10);
        const newFatigue = Math.min(100, currentFatigue + 35);
        const updatedHorses = window.state.horses.map((h) => {
          if (h.id === horseId) {
            return {
              ...h,
              stats: {
                ...h.stats,
                speed: newSpeed,
              },
              fatigue: newFatigue,
              weeklyTrainingCount: trainingCount + 1,
            };
          }
          return h;
        });

        window.setState({
          money: window.state.money - cost,
          horses: updatedHorses,
        });

        window.safeAlert(
          `🏋️【普通調教完了】\n「${horse.name}」の並・スピード調教を実施しました！\nスピードステータスが恒久的に【+10】（${horse.stats.speed} ➔ ${newSpeed}）アップしました！\n【疲労蓄積】疲労度が +35（現在: ${newFatigue}%）になりました。今週の調教回数: ${trainingCount + 1}/2回`,
        );
      }
      break;
    case "PERFORM_NORMAL_TRAINING_STAMINA":
      {
        const horseId = data;
        const horse = window.state.horses.find((h) => h.id === horseId);
        if (!horse) return;

        const cost = 300000;
        if (window.state.money < cost) {
          window.safeAlert(
            "資金が不足しています！（並・スタミナ調教には30万円必要です）",
          );
          return;
        }

        // --- Weekly Count Limit check ---
        const trainingCount = horse.weeklyTrainingCount || 0;
        if (trainingCount >= 2) {
          window.safeAlert(
            `「${horse.name}」は今週すでに2回調教（並調教）を行っています。\n翌週に進むとリフレッシュされ、再度調教可能になります。`,
          );
          return;
        }

        // --- Fatigue check ---
        const currentFatigue = horse.fatigue || 0;
        if (currentFatigue >= 80) {
          window.safeAlert(
            `「${horse.name}」は疲労が溜まりすぎています（疲労度: ${currentFatigue}%）。\nこの状態で調教を強行するとケガをする恐れがあるため実施できません。\n翌週へ進めて休ませてあげてください。`,
          );
          return;
        }

        const maxStamina = horse.maxStats?.stamina || 500;
        if (horse.stats.stamina >= maxStamina) {
          window.safeAlert(
            `「${horse.name}」のスタミナは既に個体限界値（${maxStamina}）に達しているため、これ以上普通調教では向上しません！`,
          );
          return;
        }

        const newStamina = Math.min(
          maxStamina,
          (horse.stats.stamina || 300) + 10,
        );
        const newFatigue = Math.min(100, currentFatigue + 35);
        const updatedHorses = window.state.horses.map((h) => {
          if (h.id === horseId) {
            return {
              ...h,
              stats: {
                ...h.stats,
                stamina: newStamina,
              },
              fatigue: newFatigue,
              weeklyTrainingCount: trainingCount + 1,
            };
          }
          return h;
        });

        window.setState({
          money: window.state.money - cost,
          horses: updatedHorses,
        });

        window.safeAlert(
          `🏋️【普通調教完了】\n「${horse.name}」の並・スタミナ調教を実施しました！\nスタミナステータスが恒久的に【+10】（${horse.stats.stamina} ➔ ${newStamina}）アップしました！\n【疲労蓄積】疲労度が +35（現在: ${newFatigue}%）になりました。今週の調教回数: ${trainingCount + 1}/2回`,
        );
      }
      break;
    case "START_TRAINING_GAME":
      {
        const currentShards = window.state.starShards || 0;
        if (currentShards < 3) {
          alert(
            "星片(Star Shards)が足りません！（特訓には3片必要です）\nレースに出走し、上位入賞（1〜3位など）で獲得してきてください。",
          );
          return;
        }
        const activeHorse = window.state.horses.find(
          (h) => h.id === window.state.trainingHorseId,
        );
        if (!activeHorse) return;

        if (activeHorse.training && activeHorse.training.cooldown > 0) {
          alert(
            "冷却期間（リカバー時間）中のため、トレーニングを開始できません。",
          );
          return;
        }

        window.setState({
          starShards: currentShards - 3,
          trainingType: data, // 'speed' or 'stamina'
          trainingStage: "game",
          gaugePosition: 0,
          gaugeDirection: 1,
          trainingResult: null,
        });

        if (window.trainingInterval) {
          clearInterval(window.trainingInterval);
        }
        window.trainingInterval = setInterval(() => {
          if (window.state.trainingStage !== "game") {
            clearInterval(window.trainingInterval);
            return;
          }
          let { gaugePosition, gaugeDirection } = window.state;
          gaugePosition += gaugeDirection * 6;
          if (gaugePosition >= 100) {
            gaugePosition = 100;
            gaugeDirection = -1;
          } else if (gaugePosition <= 0) {
            gaugePosition = 0;
            gaugeDirection = 1;
          }

          window.state.gaugePosition = gaugePosition;
          window.state.gaugeDirection = gaugeDirection;

          const pointerEl = document.getElementById("training-gauge-pointer");
          if (pointerEl) {
            pointerEl.style.left = `${gaugePosition}%`;
          }
        }, 22);
      }
      break;
    case "TRIGGER_TRAINING_HIT":
      {
        if (window.trainingInterval) {
          clearInterval(window.trainingInterval);
        }
        const { gaugePosition, trainingType, trainingHorseId } = window.state;
        const dist = Math.abs(gaugePosition - 50);

        let rating = "GOOD";
        let amount = 50;
        let color = "text-sky-450";
        let title = "星片の恩恵 (Good)";
        let desc =
          "まずまずのトレーニング効果です！選ばれたステータスが一定期間【+50】強化されます。";

        if (dist <= 6) {
          rating = "PERFECT";
          amount = 100;
          color =
            "text-amber-400 font-extrabold shadow-amber-400 animate-pulse";
          title = "🪐 神聖なる彗星光 (Perfect!)";
          desc =
            "極限のタイミング！神秘の彗星の力が愛馬に完全に宿り、ステータスが驚異の【+100】強化されます！";
        } else if (dist <= 18) {
          rating = "GREAT";
          amount = 75;
          color = "text-emerald-400 font-bold";
          title = "✨ 星霊の調和波動 (Great!)";
          desc =
            "素晴らしいコントロール！星の加護が高まり、ステータスが【+75】強化されます！";
        }

        const updatedHorsesWithTraining = window.state.horses.map((h) => {
          if (h.id === trainingHorseId) {
            return {
              ...h,
              training: {
                activeBoost: {
                  stat: trainingType,
                  amount: amount,
                  duration: 4,
                  maxDuration: 4,
                  rating: rating,
                },
                cooldown: 4,
              },
            };
          }
          return h;
        });

        window.setState({
          horses: updatedHorsesWithTraining,
          trainingStage: "result",
          trainingResult: {
            rating,
            amount,
            color,
            title,
            desc,
          },
        });
      }
      break;
    default:
      console.warn("Unknown action", action);
  }
};

function nextWeek() {
  let { week, month, year, horses, starShards = 0, money = 0 } = window.state;
  week++;
  if (week > 4) {
    week = 1;
    month++;
  }
  if (month > 12) {
    month = 1;
    year++;
  }

  let currentShards = starShards;
  let currentMoney = money;
  const autoTrainingLogs = [];

  // Update horses
  const updatedHorses = horses.map((h) => {
    if (h.isRetired) return h;

    // Retrieve or default training object
    let training = h.training
      ? { ...h.training }
      : { activeBoost: null, cooldown: 0 };
    if (training.cooldown > 0) {
      training.cooldown = Math.max(0, training.cooldown - 1);
    }

    if (training.activeBoost) {
      const remaining = training.activeBoost.duration - 1;
      if (remaining <= 0) {
        training.activeBoost = null;
      } else {
        training.activeBoost = { ...training.activeBoost, duration: remaining };
      }
    }

    // Auto-training ("お任せ調教") execution - Only Normal Training (並調教)
    let tempStats = { ...h.stats };
    let tempFatigue = h.fatigue || 0;
    let trainedInThisTurn = false;

    if (h.isAutoTrained) {
      if (tempFatigue >= 80) {
        autoTrainingLogs.push(
          `【お任せ調教警告】 ${h.name} は疲労度が高すぎる（${tempFatigue}%）ためお任せ調教をスキップしました。`,
        );
      } else if (currentMoney < 300000) {
        autoTrainingLogs.push(
          `【お任せ調教警告】 ${h.name} 資金不足のためお任せ並調教（30万）をスキップしました。`,
        );
      } else {
        const maxSpeed = h.maxStats?.speed || 500;
        const maxStamina = h.maxStats?.stamina || 500;
        
        let trainingType = null;
        if (tempStats.speed < maxSpeed && tempStats.stamina < maxStamina) {
          trainingType = tempStats.speed <= tempStats.stamina ? "speed" : "stamina";
        } else if (tempStats.speed < maxSpeed) {
          trainingType = "speed";
        } else if (tempStats.stamina < maxStamina) {
          trainingType = "stamina";
        }

        if (trainingType) {
          currentMoney -= 300000;
          tempFatigue = tempFatigue + 35;
          trainedInThisTurn = true;
          if (trainingType === "speed") {
            tempStats.speed = Math.min(maxSpeed, tempStats.speed + 10);
            autoTrainingLogs.push(
              `【お任せ調教】 ${h.name} の並・スピード調教を実施➔ スピード恒久+10 (費用30万・疲労+35)`,
            );
          } else {
            tempStats.stamina = Math.min(maxStamina, tempStats.stamina + 10);
            autoTrainingLogs.push(
              `【お任せ調教】 ${h.name} の並・スタミナ調教を実施➔ スタミナ恒久+10 (費用30万・疲労+35)`,
            );
          }
        } else {
          autoTrainingLogs.push(
            `【お任せ警告】 ${h.name} はスピード・スタミナ共に限界値に達しているためお任せ調教を行いませんでした。`,
          );
        }
      }
    }

    // New: Auto-Race Registration ("お任せレース登録＆自律出走") Action
    // Let's decide whether this horse should register for a race autonomously now
    let updatedHistory = h.raceHistory ? [...h.raceHistory] : [];
    let updatedConsecutiveWins = h.consecutiveWins || 0;
    let updatedMaxConsecutiveWins = h.maxConsecutiveWins || 0;
    let updatedWinCount = h.winCount || 0;
    let updatedTotalRaces = h.totalRaces || 0;
    let updatedGradedWins = h.gradedWins ? [...h.gradedWins] : [];

    if (h.isAutoTrained) {
      // The horse will consult its current health/fatigue.
      // Must have fatigue < 50% (after any potential training this turn)
      // and a randomized draw (~35% chance per week, preventing massive overlap/burnout, matching "かぶってもたまに程度")
      if (tempFatigue < 50) {
        if (Math.random() < 0.35) {
          // Select qualified races based on current horse parameters
          const score = tempStats.speed + tempStats.stamina;
          let allowed = [];
          if (score >= 1400) {
            allowed = [...regularRaces, ...themedRaces];
          } else if (score >= 1000) {
            allowed = regularRaces.slice(0, 4); // OP, G3, G2, G1 (Sirius)
          } else if (score >= 600) {
            allowed = regularRaces.slice(0, 3); // OP, G3, G2
          } else {
            allowed = [regularRaces[0]]; // OP
          }

          // Filter by required entry fee
          const affordable = allowed.filter(r => currentMoney >= r.fee);
          if (affordable.length > 0) {
            // Select a random matching race
            const chosenRace = affordable[Math.floor(Math.random() * affordable.length)];
            
            // Generate weather & track conditions
            const weatherOptions = ["Sunny", "Rainy", "Muddy"];
            const chosenWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
            const raceWithConditions = {
              ...chosenRace,
              weather: chosenWeather,
              trackCondition: chosenWeather === "Sunny" ? "Good" : (chosenWeather === "Rainy" ? "Heavy" : "Muddy")
            };

            // Run background simulation with 11 enemy horses of the correct tier
            const enemiesCount = 11;
            const enemies = generateEnemyHorses(enemiesCount, chosenRace.grade);
            
            const runningHorse = {
              ...h,
              stats: tempStats,
              fatigue: tempFatigue,
            };

            try {
              const results = simulateRace([runningHorse], enemies, raceWithConditions);
              const playerRes = results.find(r => r.horseId === h.id);
              const pos = playerRes ? playerRes.position : 12;
              
              // Handle rewards based on finish position
              const isWin = pos === 1;
              const isGradedWin = ["G3", "G2", "G1", "G0", "G-ultra", "Event G1", "Event G2", "G-ULTRA"].includes(raceWithConditions.grade) && pos === 1;
              
              let earnedPrize = 0;
              let earnedShards = 0;
              const basePrize = raceWithConditions.prize || 0;
              const baseShards = raceWithConditions.shards || 0;

              if (pos === 1) {
                earnedPrize = basePrize;
                earnedShards = baseShards;
              } else if (pos === 2) {
                earnedPrize = Math.round(basePrize * 0.4);
                earnedShards = Math.max(1, Math.round(baseShards * 0.5));
              } else if (pos === 3) {
                earnedPrize = Math.round(basePrize * 0.15);
                earnedShards = Math.max(1, Math.round(baseShards * 0.25));
              } else if (pos === 4 || pos === 5) {
                earnedPrize = Math.round(basePrize * 0.05);
                earnedShards = baseShards >= 4 ? 1 : 0;
              }

              currentMoney = currentMoney - chosenRace.fee + earnedPrize;
              currentShards = currentShards + earnedShards;
              
              // Record in race history
              const entry = {
                raceName: raceWithConditions.name,
                grade: raceWithConditions.grade,
                distance: raceWithConditions.distance,
                position: pos,
                time: playerRes ? playerRes.time : 999,
                speed: tempStats.speed,
                stamina: tempStats.stamina,
                guts: h.stats.guts || 550,
                year: year,
                month: month,
                week: week,
                earnedShards: earnedShards,
                earnedPrize: earnedPrize,
                weather: raceWithConditions.weather,
              };

              updatedConsecutiveWins = isWin ? updatedConsecutiveWins + 1 : 0;
              updatedMaxConsecutiveWins = Math.max(updatedMaxConsecutiveWins, updatedConsecutiveWins);
              updatedWinCount += (isWin ? 1 : 0);
              updatedTotalRaces += 1;
              if (isGradedWin) {
                updatedGradedWins.push(raceWithConditions.name);
              }
              updatedHistory.push(entry);

              // Add race entry fatigue (+30)
              tempFatigue = Math.min(100, tempFatigue + 30);
              
              // Log the success
              autoTrainingLogs.push(
                `【お任せレース】 ${h.name} が「${chosenRace.name} (${chosenRace.grade})」に自律出走➔ 見事 ${pos}着！ (費用: ${(chosenRace.fee / 10000).toFixed(0)}万、賞金: +${(earnedPrize / 10000).toFixed(0)}万、星片: +${earnedShards}、出走疲労+30)`
              );
            } catch (err) {
              console.error("Auto race simulation failed for " + h.name, err);
            }
          }
        }
      } else {
        autoTrainingLogs.push(
          `【お任せレーススキップ】 ${h.name} は疲労度が残っているため（${tempFatigue}%）、今週のレース出走を見送りました。`,
        );
      }
    }

    let nextStats = tempStats;
    if (week === 1) {
      nextStats = calculateGrowth({ ...h, stats: tempStats });
    }

    // Fatigue drops by 40 every week
    const finalFatigue = Math.max(0, tempFatigue - 40);

    return {
      ...h,
      stats: nextStats,
      training,
      weeklyTrainingCount: 0,
      fatigue: finalFatigue,
      consecutiveWins: updatedConsecutiveWins,
      maxConsecutiveWins: updatedMaxConsecutiveWins,
      winCount: updatedWinCount,
      totalRaces: updatedTotalRaces,
      gradedWins: updatedGradedWins,
      raceHistory: updatedHistory,
    };
  });

  window.setState({
    week,
    month,
    year,
    horses: updatedHorses,
    starShards: currentShards,
    money: currentMoney,
    autoTrainingLogs:
      autoTrainingLogs.length > 0 ? autoTrainingLogs : undefined,
  });
}

// --- Component Template Helpers ---
function Button({ children, onClick, className = "", variant = "primary" }) {
  const base =
    "px-5 py-2.5 rounded-xl font-extrabold transition-all duration-150 active:scale-95 cursor-pointer flex-shrink-0 whitespace-nowrap tracking-wide hover:-translate-y-0.5 select-none text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-black/40";
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-450 hover:to-indigo-550 text-white border border-indigo-400/40 hover:shadow-[0_4px_15px_rgba(99,102,241,0.4)]",
    secondary:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-100 border border-slate-500/30 hover:border-slate-400/40 hover:shadow-[0_4px_15px_rgba(30,41,59,0.4)]",
    outline:
      "border border-slate-500/80 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-350 hover:shadow-[0_2px_10px_rgba(255,255,255,0.05)]",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-650 hover:from-rose-500 hover:to-red-550 text-white border border-rose-500/30 hover:shadow-[0_4px_15px_rgba(244,63,94,0.35)]",
  };

  // Directly use string for simple cases, or window methods
  let clickAttr = "";
  if (typeof onClick === "string") clickAttr = `onclick="${onClick}"`;
  else {
    const id = `cb-${Math.random().toString(36).substr(2, 9)}`;
    window[id] = onClick;
    clickAttr = `onclick="window['${id}'](event)"`;
  }

  return `<button ${clickAttr} class="${base} ${variants[variant]} ${className}">${children}</button>`;
}

function getRankBadgeClass(rank) {
  switch (rank) {
    case "S":
      return "bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black tracking-widest animate-pulse border border-amber-300/30";
    case "A":
      return "bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold border border-orange-400/30";
    case "B":
      return "bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold border border-indigo-400/30";
    case "C":
      return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold border border-blue-400/30";
    default:
      return "bg-slate-600 text-slate-200 font-bold border border-slate-500/30";
  }
}

function HorseCard({ h }) {
  const getStrategyLabel = (strat) => {
    switch (strat) {
      case "escape":
        return "逃げ";
      case "pace":
        return "先行";
      case "last":
        return "差し";
      case "stay":
        return "追込";
      default:
        return "自在";
    }
  };

  const getLineageLabel = (lineage) => {
    switch (lineage) {
      case "speed":
        return "スピード型";
      case "stamina":
        return "スタミナ型";
      case "guts":
        return "勝負根性型";
      case "balance":
        return "バランス型";
      default:
        return "万能型";
    }
  };

  const speedBoost =
    h.training?.activeBoost?.stat === "speed"
      ? h.training.activeBoost.amount
      : 0;
  const staminaBoost =
    h.training?.activeBoost?.stat === "stamina"
      ? h.training.activeBoost.amount
      : 0;

  const displaySpeed = h.stats.speed + speedBoost;
  const displayStamina = h.stats.stamina + staminaBoost;

  const speedCurrentPct = Math.min(
    100,
    Math.max(0, (displaySpeed / 1000) * 100),
  );
  const speedMaxPct = Math.min(
    100,
    Math.max(0, ((h.maxStats?.speed || h.stats.speed) / 1000) * 100),
  );
  const staminaCurrentPct = Math.min(
    100,
    Math.max(0, (displayStamina / 1000) * 100),
  );
  const staminaMaxPct = Math.min(
    100,
    Math.max(0, ((h.maxStats?.stamina || h.stats.stamina) / 1000) * 100),
  );

  const trainingBadgeHtml = (() => {
    if (h.training?.activeBoost) {
      const b = h.training.activeBoost;
      const statLabel = b.stat === "speed" ? "SP" : "ST";
      return `<span class="px-2 py-0.5 bg-emerald-500/15 text-[9px] text-emerald-400 border border-emerald-500/20 rounded-md font-bold uppercase tracking-wider flex items-center gap-0.5 animate-pulse"><i data-lucide="zap" class="w-3 h-3 text-emerald-400"></i> ${statLabel} +${b.amount} (${b.duration}週)</span>`;
    }
    if (h.training?.cooldown > 0) {
      return `<span class="px-2 py-0.5 bg-rose-500/10 text-[9px] text-rose-405 border border-rose-500/25 rounded-md font-bold uppercase tracking-wider flex items-center gap-0.5"><i data-lucide="calendar" class="w-3 h-3 text-rose-450"></i> 回復中 (${h.training.cooldown}週)</span>`;
    }
    return "";
  })();

  return `
    <div class="bg-gradient-to-b ${h.isBlessed ? "from-slate-900 via-slate-950 to-amber-950/25 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.12)]" : "from-slate-900/90 to-slate-950/90 border-slate-850"} border rounded-3xl p-6 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transform hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between h-full">
      <!-- Ambient background decoration -->
      <div class="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
      
      <div class="relative z-10 h-full flex flex-col justify-between gap-5">
         <!-- Header / Core Info -->
         <div>
           <div class="flex justify-between items-start border-b border-white/5 pb-4">
              <div class="space-y-1.5 flex-1 min-w-0 pr-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${getRankBadgeClass(h.bloodlineRank || "C")}">RANK ${h.bloodlineRank || "C"}</span>
                  <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/40 px-2 py-0.5 rounded-md border border-white/5">${getLineageLabel(h.lineageId)}</span>
                  ${h.isBlessed ? `<span class="px-2 py-0.5 bg-amber-500/10 text-[9px] text-amber-400 border border-amber-500/20 rounded-md font-bold uppercase tracking-wider flex items-center gap-0.5"><i data-lucide="sparkles" class="w-3 h-3 text-amber-400"></i> BLESSED</span>` : ""}
                  ${trainingBadgeHtml}
                </div>
                <div class="flex items-center justify-between gap-2 mr-1 flex-wrap mb-1">
                  <h3 class="text-xl font-black italic tracking-tight uppercase text-white truncate group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                    ${h.name}
                    ${
                      !h.isRetired
                        ? `
                    <button onclick="event.stopPropagation(); window.handleAction('OPEN_RENAME_MODAL', '${h.id}')" 
                            class="p-1 text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors flex items-center justify-center rounded-md hover:bg-white/5" 
                            title="馬名を変更（自動生成可能）">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </button>
                    `
                        : ""
                    }
                  </h3>
                  ${
                    !h.isRetired
                      ? `
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                       <button onclick="event.stopPropagation(); window.handleAction('OPEN_TRAINING_MODAL', '${h.id}')"
                               class="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-[0_4px_10px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
                         <i data-lucide="zap" class="w-3 h-3 text-slate-950"></i>
                         <span>調教</span>
                       </button>
                       <button onclick="event.stopPropagation(); window.handleAction('NEXT_WEEK')"
                               class="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-550 text-white font-black text-[10px] uppercase tracking-wider shadow-[0_4px_10px_rgba(99,102,241,0.25)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
                         <i data-lucide="calendar" class="w-3 h-3 text-white"></i>
                         <span>翌週</span>
                       </button>
                    </div>
                  `
                      : ""
                  }
                </div>
                ${window.getHorseBadgesHtml ? window.getHorseBadgesHtml(h) : ""}
                <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <span class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full ${h.gender === "colt" ? "bg-sky-400" : "bg-rose-400"}"></span>
                    ${h.age}歳・${h.gender === "colt" ? "牡" : "牝"}
                  </span>
                  <span class="text-slate-600">|</span>
                  <span class="text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded">${getPhysicalState(h)}</span>
                  <button onclick="event.stopPropagation(); window.handleAction('TOGGLE_AUTO_TRAINING', '${h.id}');"
                          class="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black tracking-wider border select-none transition-all cursor-pointer ${
                            h.isAutoTrained
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.15)] animate-pulse"
                              : "bg-slate-950/60 border-white/5 text-slate-400 hover:text-white hover:border-slate-800"
                          }">
                    <i data-lucide="${h.isAutoTrained ? "refresh-cw" : "activity"}" class="w-2.5 h-2.5"></i>
                    ${h.isAutoTrained ? "お任せ(育成+出走):ON" : "お任せ(育成+出走):OFF"}
                  </button>
                </div>
              </div>
              
              <!-- Coat Color Badge -->
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800/50 border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]">
                 <div class="w-7 h-7 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.15)] ring-2 ring-white/10" style="background-color: ${h.color}"></div>
              </div>
           </div>

           ${
             !h.isRetired
               ? `
           <!-- Unified Training Control Panel (調教パネル) - Premium & Pinned to top -->
           <div class="p-3.5 my-3 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-teal-950/30 rounded-2xl border border-emerald-500/40 flex flex-col gap-2.5 shadow-[0_4px_20px_rgba(16,185,129,0.12)] relative overflow-hidden">
             <div class="absolute -right-6 -bottom-6 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
             <div class="flex justify-between items-center leading-none">
               <span class="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                 <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 🏋️ 調教コマンド (TRAINING CENTRE)
               </span>
               <span class="text-[11px] font-mono font-black text-emerald-405">費用: 各¥30万</span>
             </div>
             
             <div class="grid grid-cols-3 gap-1.5">
               <button onclick="event.stopPropagation(); window.handleAction('PERFORM_NORMAL_TRAINING_SPEED', '${h.id}')"
                       class="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/60 hover:border-emerald-400 hover:bg-slate-900 hover:text-emerald-300 text-white font-black transition-all duration-150 active:scale-95 cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_18px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 group/btn"
                       title="並・スピード調教 (+10、疲労+35)">
                 <span class="text-[11.5px] font-black tracking-tight flex items-center gap-0.5 text-emerald-400 leading-none">
                   ⚡ 並スピード
                 </span>
                 <span class="text-[10.5px] text-slate-500 group-hover/btn:text-slate-400 font-mono mt-0.5 leading-none">+10</span>
               </button>
               
               <button onclick="event.stopPropagation(); window.handleAction('PERFORM_NORMAL_TRAINING_STAMINA', '${h.id}')"
                       class="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-950 border border-teal-500/60 hover:border-teal-400 hover:bg-slate-900 hover:text-teal-300 text-white font-black transition-all duration-150 active:scale-95 cursor-pointer shadow-[0_4px_12px_rgba(20,184,166,0.15)] hover:shadow-[0_4px_18px_rgba(20,184,166,0.4)] hover:-translate-y-0.5 group/btn"
                       title="並・スタミナ調教 (+10、疲労+35)">
                 <span class="text-[11.5px] font-black tracking-tight flex items-center gap-0.5 text-emerald-400 leading-none">
                   🔋 並スタミナ
                 </span>
                 <span class="text-[10.5px] text-slate-500 group-hover/btn:text-slate-400 font-mono mt-0.5 leading-none">+10</span>
               </button>

               <button onclick="event.stopPropagation(); window.handleAction('OPEN_TRAINING_MODAL', '${h.id}')"
                       class="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 border border-amber-300/40 hover:-translate-y-0.5 text-slate-950 font-black transition-all duration-150 active:scale-95 cursor-pointer shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.45)]"
                       title="特別調教 (実力ゲームに挑戦！)">
                 <span class="text-[12px] font-black tracking-wider flex items-center gap-0.5 text-white leading-none">
                   🏆 特別調教
                 </span>
                 <span class="text-[10.5px] text-slate-900 font-extrabold mt-0.5 leading-none">ミニゲーム</span>
               </button>
             </div>
           </div>
           `
               : ""
           }

           <!-- Core Health-bar Style Stats (Speed & Stamina) -->
           <div class="space-y-4 my-5">
              <!-- Speed Stat Indicator -->
              <div class="space-y-1.5">
                <div class="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]"></span>SPEED (スピード)</span>
                  <div class="font-mono tracking-tight text-right">
                    <span class="text-white font-extrabold">${displaySpeed}${speedBoost ? `<span class="text-emerald-400 text-[10px] ml-1">▲+${speedBoost}</span>` : ""}</span>
                    <span class="text-slate-600 text-[9px]">/ ${h.maxStats?.speed || h.stats.speed}</span>
                  </div>
                </div>
                <!-- Health-bar Track -->
                <div class="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative p-[2px]">
                  <!-- Potential limit bar underlay -->
                  <div class="absolute top-[2px] bottom-[2px] left-[2px] rounded-full bg-slate-800/30 opacity-70" style="width: calc(${speedMaxPct}% - 4px)"></div>
                  <!-- Current active progress -->
                  <div class="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500" style="width: ${speedCurrentPct}%"></div>
                </div>
              </div>

              <!-- Stamina Stat Indicator -->
              <div class="space-y-1.5">
                <div class="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"></span>STAMINA (スタミナ)</span>
                  <div class="font-mono tracking-tight text-right">
                    <span class="text-white font-extrabold">${displayStamina}${staminaBoost ? `<span class="text-emerald-400 text-[10px] ml-1">▲+${staminaBoost}</span>` : ""}</span>
                    <span class="text-slate-600 text-[9px]">/ ${h.maxStats?.stamina || h.stats.stamina}</span>
                  </div>
                </div>
                <!-- Health-bar Track -->
                <div class="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative p-[2px]">
                  <!-- Potential limit bar underlay -->
                  <div class="absolute top-[2px] bottom-[2px] left-[2px] rounded-full bg-slate-800/30 opacity-70" style="width: calc(${staminaMaxPct}% - 4px)"></div>
                  <!-- Current active progress -->
                  <div class="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500" style="width: ${staminaCurrentPct}%"></div>
                </div>
              </div>

              <!-- Fatigue (疲労度) Stat Indicator -->
              <div class="space-y-1.5 border-t border-white/5 pt-2">
                <div class="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span class="flex items-center gap-1">
                    <i data-lucide="flame" class="w-3.5 h-3.5 text-amber-500 animate-pulse"></i>
                    <span>FATIGUE (疲労度・疲れ)</span>
                  </span>
                  <div class="font-mono tracking-tight text-right">
                    <span class="${(h.fatigue || 0) >= 70 ? "text-red-400 font-black animate-pulse" : (h.fatigue || 0) >= 40 ? "text-amber-400 font-bold" : "text-emerald-450 font-bold"}">${h.fatigue || 0}%</span>
                    <span class="text-slate-600 text-[9px]">/ 100%</span>
                  </div>
                </div>
                <!-- Fatigue bar Track -->
                <div class="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative p-[2px]">
                  <div class="h-full bg-gradient-to-r ${(h.fatigue || 0) >= 70 ? "from-red-650 to-red-500" : (h.fatigue || 0) >= 40 ? "from-amber-600 to-amber-400" : "from-emerald-600 to-emerald-400"} rounded-full transition-all duration-500" style="width: ${h.fatigue || 0}%"></div>
                </div>
              </div>

              <!-- Weekly Training Count Tracker -->
              <div class="flex items-center gap-1.5 flex-wrap bg-slate-950/60 px-3 py-2 rounded-xl border border-white/5">
                <span class="text-[9px] text-slate-400 font-black uppercase tracking-wider">今週の並調教回数 (Weekly Training):</span>
                <div class="flex gap-1 items-center">
                  <span class="w-2.5 h-2.5 rounded-full ${(h.weeklyTrainingCount || 0) >= 1 ? "bg-indigo-500 shadow-[0_0_6px_#6366f1]" : "bg-slate-800"}"></span>
                  <span class="w-2.5 h-2.5 rounded-full ${(h.weeklyTrainingCount || 0) >= 2 ? "bg-indigo-500 shadow-[0_0_6px_#6366f1]" : "bg-slate-800"}"></span>
                </div>
                <span class="text-[9.5px] font-mono font-black ${(h.weeklyTrainingCount || 0) >= 2 ? "text-amber-400" : "text-slate-400"} ml-auto">
                  ${h.weeklyTrainingCount || 0} / 2 回
                </span>
              </div>
           </div>

           <!-- Secondary Metrics Grid & Details -->
           <div class="grid grid-cols-2 gap-3 bg-slate-950/40 rounded-2xl p-3 border border-white/5">
              <div class="space-y-0.5">
                <span class="text-[8px] text-slate-500 font-extrabold uppercase">脚質 (Strategy)</span>
                <p class="text-sm font-bold text-slate-200">${getStrategyLabel(h.strategy)}</p>
              </div>
              <div class="space-y-0.5 border-l border-white/5 pl-3">
                <span class="text-[8px] text-slate-500 font-extrabold uppercase">勝負根性 (Guts)</span>
                <p class="text-sm font-bold text-emerald-400">${h.stats.guts || h.maxStats?.guts || 400}</p>
              </div>
              <div class="space-y-0.5 border-t border-white/5 pt-1.5">
                <span class="text-[8px] text-slate-500 font-extrabold uppercase">戦績 (Career)</span>
                <p class="text-sm font-bold text-slate-200">${h.winCount || 0}勝 / ${h.totalRaces || 0}戦</p>
              </div>
              <div class="space-y-0.5 border-t border-l border-white/5 pl-3 pt-1.5">
                <span class="text-[8px] text-slate-500 font-extrabold uppercase">気性 (Temp)</span>
                <div class="text-sm font-bold text-amber-500">${h.stats.temperament || h.maxStats?.temperament || 500}</div>
              </div>
           </div>
         </div>

         <!-- Direct Quick Ordinary Training Controls (並調教) -->
         <div class="hidden">
           <div class="absolute -right-6 -bottom-6 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
           <div class="flex justify-between items-center">
             <span class="text-[9.5px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
               <!-- HIDDEN SECTION -->
             </span>
             <span class="text-[10px] font-mono text-emerald-400 font-black">費用: ¥30万</span>
           </div>
           
           <div class="grid grid-cols-2 gap-2">
             <button onclick="event.stopPropagation(); window.handleAction('PERFORM_NORMAL_TRAINING_SPEED', '${h.id}')"
                     class="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-slate-950 text-white font-black hover:text-emerald-300 text-[10.5px] tracking-tight uppercase transition-all duration-150 active:scale-95 cursor-pointer shadow-md"
                     title="並・スピード調教 (+10)">
               <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap text-emerald-400 mr-0.5"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
               並・スピード
             </button>
             
             <button onclick="event.stopPropagation(); window.handleAction('PERFORM_NORMAL_TRAINING_STAMINA', '${h.id}')"
                     class="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-slate-950 text-white font-black hover:text-emerald-300 text-[10.5px] tracking-tight uppercase transition-all duration-150 active:scale-95 cursor-pointer shadow-md"
                     title="並・スタミナ調教 (+10)">
               <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-emerald-400 mr-0.5"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0L6.41 10.45A2 2 0 0 1 4.41 12H2"/></svg>
               並・スタミナ
             </button>
           </div>
         </div>

         <!-- Actions -->
         <div class="pt-3 border-t border-white/5 flex flex-col gap-2">
           <div class="flex gap-2">
             ${Button({
               children: "戦績・血統",
               onClick: () =>
                 window.handleAction("OPEN_PERFORMANCE_MODAL", h.id),
               variant: "outline",
               className:
                 "flex-1 text-[10px] py-2 px-0.5 rounded-xl border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 focus:ring-0 truncate",
             })}
             ${Button({
               children: "🏋️ 特別調教",
               onClick: () => window.handleAction("OPEN_TRAINING_MODAL", h.id),
               className:
                 "hidden flex-1 text-[10px] py-2 px-0.5 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 border-none rounded-xl font-bold truncate text-white",
             })}
             ${Button({
               children: "🏁 レース出走",
               onClick: () => {
                 window.setState({
                    screen: "race_select",
                    selectedHorseId: h.id,
                    registeredHorseIds: [h.id],
                  });
               },
               className:
                 "flex-1 text-[11px] font-black tracking-wider py-2.5 px-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 hover:from-indigo-400 hover:via-violet-400 hover:to-blue-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-150 shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.55)] border border-indigo-300/30 rounded-xl truncate text-white cursor-pointer",
             })}
           </div>
           <div class="flex gap-2">
              ${
                !h.isHallOfFameRegistered
                  ? `
                ${Button({
                  children: "🏆 殿堂登録",
                  onClick: () =>
                    window.handleAction("REGISTER_HALL_OF_FAME", h.id),
                  variant: "outline",
                  className:
                    "flex-1 text-[10px] py-1.5 rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10 focus:ring-0 font-extrabold",
                })}
              `
                  : `
                <span class="flex-1 text-[10px] py-1.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center gap-1 leading-none select-none">
                  🏛️ 殿堂登録済
                </span>
              `
              }
              ${Button({
                children:
                  "引退・売却 (¥" +
                  (getHorseSellValue(h) / 10000).toFixed(0) +
                  "万)",
                onClick: () => window.handleAction("OPEN_SELL_MODAL", h.id),
                variant: "outline",
                className:
                  "flex-1 text-[10px] py-1.5 px-2 rounded-xl border-rose-500/15 text-rose-450 hover:text-rose-400 hover:bg-rose-500/15 transition-all focus:ring-0 font-bold",
              })}
            ${Button({
              children: h.age >= 3 
                ? (h.gender === "filly" ? "🌸 繁殖牝馬に転向" : "⚡ 種牡馬に転向")
                : "※3歳以上で繁殖入り可能",
              onClick: () => {
                if (h.age >= 3) {
                  window.handleAction("OPEN_RETIRE_TO_BREEDING_MODAL", h.id);
                } else {
                  alert("繁殖馬に転向させるには3歳以上に成長させてください。");
                }
              },
              variant: "outline",
              className: "w-full text-[10px] py-1.5 mt-2 rounded-xl " + (h.age >= 3 ? "border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 font-black cursor-pointer animate-pulse-subtle" : "border-slate-800 text-slate-500 opacity-60 pointer-events-none font-bold"),
            })}
            </div>
         </div>
      </div>
    </div>
  `;
}

// --- Scenes ---

function getHorseSellValue(h) {
  let base = 200000;
  const rank = h.bloodlineRank || "C";
  if (rank === "S") base = 3000000;
  else if (rank === "A") base = 1800000;
  else if (rank === "B") base = 1000000;
  else if (rank === "C") base = 400000;

  const speed = h.stats?.speed || 400;
  const stamina = h.stats?.stamina || 400;
  const avgStats = (speed + stamina) / 2;
  base += Math.round(avgStats * 1500);

  const wins = h.winCount || 0;
  base += wins * 350000;

  return base;
}

// --- Utilities ---
const formatMoney = (amount) => `¥${(amount / 10000).toLocaleString()}万`;

function SceneTitle() {
  const hasSave = localStorage.getItem(SAVE_KEY) !== null;
  return `
    <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <div class="text-center space-y-8 max-w-2xl">
        <h1 class="text-7xl font-black italic tracking-tighter uppercase">
          <span class="block text-indigo-500">Stellar</span>
          <span class="block">Breeder</span>
        </h1>
        <p class="text-slate-400 font-medium tracking-widest uppercase text-sm">異次元のスピード、伝説の血統をその手に。</p>
        <div class="pt-8 flex flex-col sm:flex-row justify-center gap-4">
          ${
            hasSave
              ? Button({
                  children: "続きから始める",
                  onClick: () => {
                    loadGame();
                    window.setState({ screen: "stable" });
                  },
                  className: "text-lg px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 border border-emerald-400/40 hover:from-emerald-450 hover:to-teal-550 hover:shadow-[0_4px_15px_rgba(16,185,129,0.4)] animate-pulse-subtle",
                  variant: "primary",
                })
              : ""
          }
          ${Button({
            children: "最初から始める",
            onClick: () => {
              const runStart = () => {
                localStorage.removeItem(SAVE_KEY);
                window.setState({
                  screen: "stable",
                  horses: [],
                  mares: JSON.parse(JSON.stringify(INITIAL_MARES)),
                  money: 10000000,
                  starShards: 0,
                  useStarBlessing: false,
                  raceTab: "regular",
                  week: 1,
                  month: 1,
                  year: 1,
                  selectedHorseId: null,
                  selectedMareId: null,
                  selectedStallionId: null,
                  breedingResult: null,
                  currentRace: null,
                  raceResult: null,
                  raceStep: 0,
                  history: [],
                  showSaveModal: false,
                  scoutedHorse: null,
                  showScoutModal: false,
                  showPerformanceModal: false,
                  viewingHorseId: null,
                  stableRankFilter: "all",
                  showSellModal: false,
                  sellingHorseId: null,
                  showTrainingModal: false,
                  trainingHorseId: null,
                  trainingStage: "select",
                  trainingType: null,
                  trainingResult: null,
                  gaugePosition: 0,
                  gaugeDirection: 1,
                  hallOfFame: [],
                  unlockedMilestones: [],
                });
              };
              if (hasSave) {
                window.safeConfirm(
                  "保存されているデータを上書きして最初から始めますか？",
                  runStart,
                );
              } else {
                runStart();
              }
            },
            className: "text-lg px-8 py-4",
            variant: hasSave ? "outline" : "primary",
          })}
        </div>
      </div>
    </div>
  `;
}

function SceneStable() {
  const {
    horses,
    money,
    year,
    month,
    week,
    stableRankFilter = "all",
    autoTrainingLogs = [],
  } = window.state;

  // Calculate statistics
  const totalCount = horses.length;
  const avgSpeed = totalCount
    ? Math.round(horses.reduce((sum, h) => sum + h.stats.speed, 0) / totalCount)
    : 0;
  const avgStamina = totalCount
    ? Math.round(
        horses.reduce((sum, h) => sum + h.stats.stamina, 0) / totalCount,
      )
    : 0;
  const totalWins = horses.reduce((sum, h) => sum + (h.winCount || 0), 0);
  const totalRaces = horses.reduce((sum, h) => sum + (h.totalRaces || 0), 0);
  const sRankCount = horses.filter((h) => h.bloodlineRank === "S").length;
  const aRankCount = horses.filter((h) => h.bloodlineRank === "A").length;

  // Filter horses
  const filteredHorses = horses.filter((h) => {
    if (stableRankFilter === "all") return true;
    return (
      (h.bloodlineRank || "C").toUpperCase() === stableRankFilter.toUpperCase()
    );
  });

  // Calculate badge counts
  const countAll = horses.length;
  const countS = horses.filter((h) => h.bloodlineRank === "S").length;
  const countA = horses.filter((h) => h.bloodlineRank === "A").length;
  const countB = horses.filter((h) => h.bloodlineRank === "B").length;
  const countC = horses.filter((h) => h.bloodlineRank === "C").length;

  const filterTabClass = (active) =>
    active
      ? "px-4 py-2 rounded-xl text-xs font-black tracking-tight transition-all bg-indigo-600 border border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)] text-white hover:bg-indigo-500 scale-102"
      : "px-4 py-2 rounded-xl text-xs font-bold tracking-normal transition-all bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700/50";

  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col">
      <!-- Header -->
      <header class="p-6 border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div class="flex items-center gap-6 flex-wrap w-full xl:w-auto">
          <h2 class="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap">MY STABLE</h2>
          <div class="flex items-center gap-4 text-sm font-bold tracking-widest text-slate-400 flex-wrap">
             <span>YEAR ${year} / MON ${month} / WEEK ${week}</span>
             <span class="text-emerald-400">${formatMoney(money)}</span>
             <span class="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
               <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400 mr-0.5 animate-pulse"></i>
               ${window.state.starShards || 0} <span class="text-[9px] font-black text-slate-500 ml-0.5">SHARDS</span>
             </span>
          </div>
        </div>
        
        <!-- Scrollable Button Panel -->
        <div class="w-full xl:w-auto overflow-x-auto scrollbar-none py-1 select-none" style="-webkit-overflow-scrolling: touch;">
          <div class="flex gap-2 flex-nowrap">
            ${Button({
              children: "データ管理",
              onClick: () => window.setState({ showSaveModal: true }),
              variant: "outline",
              className: "px-4.5 py-2 text-slate-350 border border-slate-700/50 hover:bg-slate-800/80 hover:text-white rounded-xl flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.2)] active:scale-95 transition-all duration-150 cursor-pointer",
            })}
            ${Button({
              children: "🏆 殿堂入り実績",
              onClick: () => window.setState({ screen: "hall_of_fame" }),
              variant: "outline",
              className: "px-4.5 py-2 font-black text-amber-400 border border-amber-500/40 hover:bg-amber-500/20 px-4 flex items-center gap-1.5 hover:border-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_16px_rgba(245,158,11,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all duration-150 rounded-xl flex-shrink-0 cursor-pointer",
            })}
            ${Button({
              children: "🧬 新馬スカウト",
              onClick: () => window.handleAction("GENERATE_SCOUT_HORSE"),
              variant: "outline",
              className: "px-4.5 py-2 font-black text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20 hover:border-emerald-300 shadow-[0_2px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_16px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all duration-150 rounded-xl flex-shrink-0 cursor-pointer",
            })}
            ${Button({
              children: "💖 配合",
              onClick: () => {
                if (window.state.horses.length >= 8) {
                  alert(
                    "馬房がいっぱいです（最大8頭）。配合を行うには、既存の馬を「引退・売却」して空きを作ってください。",
                  );
                } else {
                  window.setState({ screen: "breeding_mare" });
                }
              },
              variant: "secondary",
              className: "px-5 py-2 font-black text-pink-400 border border-pink-500/40 hover:bg-pink-500/20 hover:border-pink-300 shadow-[0_2px_12px_rgba(236,72,153,0.15)] hover:shadow-[0_4px_16px_rgba(236,72,153,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-150 rounded-xl flex-shrink-0 cursor-pointer",
            })}
            ${Button({
              children: "⏩ 次週へ",
              onClick: () => window.handleAction("NEXT_WEEK"),
              variant: "primary",
              className: "px-6 py-2 font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:via-purple-400 hover:to-indigo-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-150 rounded-xl flex-shrink-0 text-white shadow-[0_4px_14px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_22px_rgba(99,102,241,0.6)] cursor-pointer border border-indigo-400/40",
            })}
          </div>
        </div>
      </header>

      ${
        autoTrainingLogs.length > 0
          ? `
      <div class="mx-6 mt-6 p-5 bg-amber-500/10 border border-amber-500/25 text-amber-300 rounded-[2rem] text-sm font-bold leading-relaxed space-y-1.5 relative shadow-[0_4px_25px_rgba(245,158,11,0.06)] animate-fade-in" id="auto-training-reports">
        <button onclick="window.setState({ autoTrainingLogs: [] })" class="absolute top-4 right-6 text-amber-500 hover:text-white font-black text-sm cursor-pointer select-none transition-colors">✕ 閉じる</button>
        <div class="font-extrabold flex items-center gap-2 text-amber-400 mb-2 uppercase tracking-wider text-[13px]">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          お任せ育成・自動完了のお知らせ (Auto-Training Report)
        </div>
        ${autoTrainingLogs
          .map(
            (log) => `
          <div class="flex items-center gap-2 text-[11px] text-amber-300/90 font-medium">
            <span class="w-1 h-1 rounded-full bg-amber-500/60 flex-shrink-0"></span>
            ${log}
          </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      <!-- Dashboard Statistics Row -->
      ${
        horses.length > 0
          ? `
      <div class="px-6 py-4 border-b border-indigo-500/10 bg-slate-950/20">
        <div class="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Stat Box 1: Total Horses -->
          <div class="bg-gradient-to-b from-slate-900/40 to-slate-950/60 border ${totalCount >= 8 ? "border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-pulse" : "border-slate-900"} rounded-3xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-indigo-500/10 transition-colors">
            <div>
              <span class="text-[9px] font-black ${totalCount >= 8 ? "text-rose-400" : "text-slate-500"} tracking-wider uppercase block">馬房空き状況 (Stable Status)</span>
              <span class="text-3xl font-black italic tracking-tighter ${totalCount >= 8 ? "text-rose-450" : "text-white"} font-mono leading-none">${totalCount} <span class="text-sm font-bold text-slate-500">/ 8頭</span></span>
            </div>
            <div class="w-10 h-10 rounded-2xl ${totalCount >= 8 ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-indigo-500/10 border border-indigo-500/10 text-indigo-400"} flex items-center justify-center">
              <i data-lucide="home" class="w-5 h-5"></i>
            </div>
          </div>

          <!-- Stat Box 2: Total Wins / Races -->
          <div class="bg-gradient-to-b from-slate-900/40 to-slate-950/60 border border-slate-900 rounded-3xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-indigo-500/10 transition-colors">
            <div>
              <span class="text-[9px] font-black text-slate-500 tracking-wider uppercase block">生涯成績 (Win Rate)</span>
              <span class="text-3xl font-black italic tracking-tighter text-amber-500 font-mono leading-none">${totalWins}<span class="text-[10px] font-bold text-slate-400 mx-0.5">勝</span><span class="text-[12px] text-slate-600 font-medium">/</span>${totalRaces}<span class="text-[10px] font-bold text-slate-400 ml-0.5">戦</span></span>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10 text-amber-400">
              <i data-lucide="trophy" class="w-5 h-5"></i>
            </div>
          </div>

          <!-- Stat Box 3: Average Abilities -->
          <div class="bg-gradient-to-b from-slate-900/40 to-slate-950/60 border border-slate-900 rounded-3xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-indigo-500/10 transition-colors">
            <div>
              <span class="text-[9px] font-black text-slate-500 tracking-wider uppercase block">平均走時能力 (Average Stats)</span>
              <span class="text-base font-black tracking-tight text-white block mt-1">
                <span class="text-indigo-400 font-mono">SP:${avgSpeed}</span> <span class="text-blue-400 font-mono ml-2">ST:${avgStamina}</span>
              </span>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10 text-blue-400">
              <i data-lucide="activity" class="w-5 h-5"></i>
            </div>
          </div>

          <!-- Stat Box 4: Premium Bloodlines -->
          <div class="bg-gradient-to-b from-slate-900/40 to-slate-950/60 border border-slate-900 rounded-3xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-indigo-500/10 transition-colors">
            <div>
              <span class="text-[9px] font-black text-slate-500 tracking-wider uppercase block">上位血統数 (S/A class)</span>
              <span class="text-3xl font-black italic tracking-tighter text-indigo-400 font-mono leading-none">${sRankCount}<span class="text-[10px] font-bold text-slate-400 mx-0.5">S</span> <span class="text-slate-600">/</span> ${aRankCount}<span class="text-[10px] font-bold text-slate-400 ml-0.5">A</span></span>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/10 text-purple-400">
              <i data-lucide="dna" class="w-5 h-5"></i>
            </div>
          </div>
        </div>
      </div>
      `
          : ""
      }

      <!-- Stable Filters Box & List Controls -->
      <div class="max-w-7xl mx-auto w-full px-6 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="space-y-1">
          <span class="text-[10px] font-black text-indigo-400 tracking-widest uppercase">STABLE SELECTION (所有馬一覧)</span>
          <h3 class="text-xl font-black italic text-white tracking-tight uppercase flex items-center gap-2">
            STABLE MANAGEMENT 
            ${
              horses.length > 0
                ? stableRankFilter !== "all"
                  ? `
              <span class="text-sm font-extrabold normal-case bg-indigo-950 text-indigo-400 px-3 py-1 rounded-full border border-indigo-900/30">
                ランク <strong>${stableRankFilter.toUpperCase()}</strong> のみ表示 (${filteredHorses.length}頭)
              </span>
            `
                  : `
              <span class="text-sm font-extrabold normal-case bg-slate-900 text-slate-400 px-3 py-1 rounded-full border border-slate-800">
                全馬表示 (${horses.length}頭)
              </span>
            `
                : ""
            }
          </h3>
        </div>

        ${
          horses.length > 0
            ? `
        <div class="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl shadow-inner">
          <button onclick="window.setState({ stableRankFilter: 'all' })" class="${filterTabClass(stableRankFilter === "all")}">
            すべて (${countAll})
          </button>
          <button onclick="window.setState({ stableRankFilter: 's' })" class="${filterTabClass(stableRankFilter === "s")}">
            RANK S (${countS})
          </button>
          <button onclick="window.setState({ stableRankFilter: 'a' })" class="${filterTabClass(stableRankFilter === "a")}">
            RANK A (${countA})
          </button>
          <button onclick="window.setState({ stableRankFilter: 'b' })" class="${filterTabClass(stableRankFilter === "b")}">
            RANK B (${countB})
          </button>
          <button onclick="window.setState({ stableRankFilter: 'c' })" class="${filterTabClass(stableRankFilter === "c")}">
            RANK C (${countC})
          </button>
        </div>
        `
            : ""
        }
      </div>

      <!-- Main Content -->
      <main class="flex-1 p-6 max-w-7xl mx-auto w-full">
        ${
          horses.length === 0
            ? `
          <div class="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 gap-4">
            <p class="font-bold">所有馬がいません</p>
            ${Button({
              children: "最初の配合を行う",
              onClick: () => window.setState({ screen: "breeding_mare" }),
              variant: "outline",
            })}
          </div>
        `
            : filteredHorses.length === 0
              ? `
          <div class="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 bg-slate-900/10 rounded-[2rem] text-slate-500 gap-4 p-8 text-center">
            <p class="font-bold text-sm text-slate-400">ランク「${stableRankFilter.toUpperCase()}」に該当する競走馬がいません。</p>
            <p class="text-[11px] text-slate-500 max-w-md">新しい配合を試すか、新馬をスカウトして強力な ${stableRankFilter.toUpperCase()} ランクの競走馬を血統に加えましょう！</p>
            <div class="flex gap-3 mt-2">
              ${Button({
                children: "フィルターを解除",
                onClick: () => window.setState({ stableRankFilter: "all" }),
                variant: "outline",
                className: "text-xs rounded-xl",
              })}
              ${Button({
                children: "新馬スカウトに行く",
                onClick: () => window.handleAction("GENERATE_SCOUT_HORSE"),
                variant: "primary",
                className: "text-xs rounded-xl",
              })}
            </div>
          </div>
        `
              : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filteredHorses.map((h) => HorseCard({ h })).join("")}
          </div>
        `
        }
      </main>

    </div>
  `;
}

function RenderBreedingProgress(step) {
  return `
    <div class="mb-8 w-fit mx-auto bg-slate-900/80 border border-slate-800/80 rounded-2xl px-6 py-3 flex flex-wrap items-center justify-center gap-4 text-[11px] font-black uppercase tracking-wider font-mono">
      <!-- Step 1 -->
      <div class="flex items-center gap-2 ${step === 1 ? "text-pink-400 font-extrabold scale-105" : "text-slate-500"} transition-all">
        <span class="w-6 h-6 rounded-full ${step === 1 ? "bg-gradient-to-br from-pink-400 to-rose-600 text-slate-950 font-black shadow-[0_0_12px_rgba(244,63,94,0.3)]" : "bg-slate-800 text-slate-600"} flex items-center justify-center font-bold text-[10.5px]">1</span>
        <span class="font-sans">🌸 牝馬(母)選択 (Dam)</span>
      </div>
      
      <span class="text-slate-800 select-none text-sm">➔</span>
      
      <!-- Step 2 -->
      <div class="flex items-center gap-2 ${step === 2 ? "text-sky-400 font-extrabold scale-105" : "text-slate-500"} transition-all">
        <span class="w-6 h-6 rounded-full ${step === 2 ? "bg-gradient-to-br from-sky-400 to-sky-600 text-slate-950 font-black shadow-[0_0_12px_rgba(14,165,233,0.3)]" : "bg-slate-800 text-slate-600"} flex items-center justify-center font-bold text-[10.5px]">2</span>
        <span class="font-sans">⚡ 種牡馬(父)選択 (Sire)</span>
      </div>
      
      <span class="text-slate-800 select-none text-sm">➔</span>
      
      <!-- Step 3 -->
      <div class="flex items-center gap-2 ${step === 3 ? "text-amber-400 font-extrabold scale-105" : "text-slate-500"} transition-all">
        <span class="w-6 h-6 rounded-full ${step === 3 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]" : "bg-slate-800 text-slate-600"} flex items-center justify-center font-bold text-[10.5px]">3</span>
        <span class="font-sans">🌟 配合確定 (Confirmation)</span>
      </div>
    </div>
  `;
}

function SceneBreedingMare() {
  const { mares, horses, breedingMareTab = "market" } = window.state;

  const isMarket = breedingMareTab === "market";

  // Available mares
  const currentMares = isMarket
    ? mares
    : [
        ...(window.state.retiredMares || []),
        ...(horses || []).filter((h) => h.gender === "filly")
      ];

  return `
    <div class="min-h-screen bg-starry-sky text-white flex flex-col p-6 animate-fade-in">
      <!-- Steps Progress -->
      ${RenderBreedingProgress(1)}

      <header class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-pink-500 text-sm">🌸</span>
            <span class="text-pink-400 text-[10px] font-black uppercase tracking-widest bg-pink-500/10 px-2.5 py-0.5 rounded border border-pink-500/10">STEP 1/3: 牝馬フェーズ</span>
          </div>
          <h2 class="text-3xl font-black italic uppercase tracking-tighter">SELECT DAM (繁殖牝馬選択)</h2>
          <p class="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">配合のベースとなる繁殖牝馬（母馬）を選んでください</p>
        </div>
        
        <!-- Navigation Tabs -->
        <div class="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
          <button class="px-5 py-2 rounded-xl font-bold text-sm transition-all uppercase tracking-wider ${isMarket ? "bg-pink-600 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"}" 
                  onclick="window.setState({ breedingMareTab: 'market' })">
            公認牝馬 (Rented dam)
          </button>
          <button class="px-5 py-2 rounded-xl font-bold text-sm transition-all uppercase tracking-wider ${!isMarket ? "bg-pink-600 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"}" 
                  onclick="window.setState({ breedingMareTab: 'stable' })">
            所有牝馬 (My Stable dam)
          </button>
        </div>
      </header>
      
      ${
        currentMares.length === 0
          ? `
        <div class="flex-1 flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-[2rem] text-center space-y-4">
          <div class="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-2xl font-black font-mono">?</div>
          <div class="space-y-1">
            <h3 class="text-lg font-bold text-slate-300">対象の繁殖牝馬がいません</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">馬房に牝馬（牝）を所有していません。新馬スカウトで牝馬を迎え入れるか、公認繁殖牝馬タブからレンタルして配合を行ってください。</p>
          </div>
          <button class="px-5 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 hover:bg-pink-600/30 font-bold rounded-xl text-sm transition-all uppercase" onclick="window.setState({ breedingMareTab: 'market' })">
            公認牝馬カタログを見る
          </button>
        </div>
      `
          : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          ${currentMares
            .map((m) => {
              const isStableDam = !isMarket;
              return `
              <div class="relative card-dam rounded-[2rem] p-6 hover:border-pink-500/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-pink-500/5" 
                   onclick="window.setState({ screen: 'breeding_stallion', selectedMareId: '${m.id}', selectedMareSource: '${isStableDam ? "stable" : "market"}' })">
                
                <!-- Stable / Rented badge -->
                <div class="absolute top-4 right-4 flex gap-1.5">
                  ${m.isMutation ? `<span class="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-[8px] px-2 py-0.5 rounded-full tracking-widest uppercase">MUTATION</span>` : ""}
                  <span class="font-bold text-[8px] px-2 py-0.5 rounded-full tracking-widest uppercase ${isStableDam ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" : "bg-slate-800 text-slate-400"}">
                    ${isStableDam ? "OWNED" : "RENTAL"}
                  </span>
                </div>

                <div class="mb-4">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-pink-400 font-extrabold text-[9px] bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/15">🌸 牝馬 (Dam)</span>
                    <span class="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${getRankBadgeClass(m.bloodlineRank || "C")}">RANK ${m.bloodlineRank || "C"}</span>
                  </div>
                  <h3 class="text-xl font-black italic tracking-tight uppercase group-hover:text-pink-400 transition-colors mt-2">${m.name}</h3>
                  ${
                    isStableDam
                      ? `
                    <div class="text-[10px] text-slate-500 font-bold mt-1">戦績: ${m.winCount || 0}勝 / ${m.totalRaces || 0}戦 ${m.isRetiredToBreeding ? " | 🏡 自家所有繁殖牝馬" : ""}` + (m.growthType ? " | 成長: " + (m.growthType === "early" ? "早熟" : m.growthType === "late" ? "晩成" : "普通") : "") + `</div>
                  `
                      : `
                    <div class="text-[10px] text-slate-500 font-bold mt-1">公認優秀繁殖牝馬 | 系統: ${m.lineageId || "Balance"}</div>
                  `
                  }
                </div>

                <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                   <div>
                     <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">SPEED</span>
                     <div class="flex items-center gap-1.5">
                       <div class="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                         <div class="h-full bg-indigo-500 rounded-full" style="width: ${Math.min(100, (m.stats.speed / 1000) * 100)}%"></div>
                       </div>
                       <span class="text-[10px] font-mono font-bold text-slate-300">${m.stats.speed}</span>
                     </div>
                   </div>
                   <div>
                     <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">STAMINA</span>
                     <div class="flex items-center gap-1.5">
                       <div class="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                         <div class="h-full bg-blue-500 rounded-full" style="width: ${Math.min(100, (m.stats.stamina / 1000) * 100)}%"></div>
                       </div>
                       <span class="text-[10px] font-mono font-bold text-slate-300">${m.stats.stamina}</span>
                     </div>
                   </div>
                </div>
                
                ${
                  m.traits && m.traits.length > 0
                    ? `
                  <div class="flex flex-wrap gap-1 mt-3.5 pt-3 border-t border-slate-800/40">
                    ${m.traits.map((t) => `<span class="bg-indigo-500/10 text-indigo-300 font-bold text-[8px] px-2 py-0.5 rounded">${t}</span>`).join("")}
                  </div>
                `
                    : ""
                }
              </div>
            `;
            })
            .join("")}
        </div>
      `
      }
      <div class="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/5 mt-8 z-30 flex items-center justify-between">
        ${Button({ children: "← タウンへ戻る", onClick: () => window.setState({ screen: "stable" }), variant: "outline" })}
        <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">STELLAR RACING BREEDING LAB</span>
      </div>
    </div>
  `;
}

function SceneBreedingStallion() {
  const {
    selectedMareId,
    selectedMareSource,
    breedingStallionTab = "market",
    horses,
  } = window.state;

  const selectedMare = (selectedMareSource === "stable"
    ? window.state.horses.find((h) => h.id === selectedMareId)
    : window.state.mares.find((m) => m.id === selectedMareId)) || {
    name: "選択中",
    stats: { speed: 500, stamina: 500 },
    bloodlineRank: "C",
    lineageId: "Balance",
  };

  const isMarket = breedingStallionTab === "market";

  // Available stallions
  const currentStallions = isMarket
    ? STALLIONS
    : [
        ...(window.state.retiredStallions || []),
        ...(horses || []).filter((h) => h.gender === "colt")
      ];

  const selectedMareLineage = selectedMare.lineageId || "Balance";
  const selectedMareRank = selectedMare.bloodlineRank || "C";
  const selectedMareStats = selectedMare.stats || { speed: 500, stamina: 500 };

  return `
    <div class="min-h-screen bg-starry-sky text-white flex flex-col p-6 animate-fade-in pb-32">
      <!-- Steps Progress -->
      ${RenderBreedingProgress(2)}

      <!-- Selected Dam Summary Card -->
      <div class="mb-4 p-6 card-dam rounded-[2rem] shadow-xl animate-fade-in">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-sm text-pink-400 font-black tracking-widest bg-pink-500/10 px-2.5 py-0.5 rounded border border-pink-500/20">SELECTED DAM (母馬確定済み)</span>
              <span class="text-[10px] text-slate-400 font-bold">➔ 次に以下の牝馬と配合する種牡馬(お父さん)を選んでください。</span>
            </div>
            <div class="flex items-center gap-3 mt-1.5 animate-pulse-subtle">
              <span class="px-2 py-0.5 rounded text-[10px] font-black tracking-wider ${getRankBadgeClass(selectedMareRank)}">RANK ${selectedMareRank}</span>
              <h3 class="text-xl font-extrabold text-white tracking-tight uppercase">${selectedMare.name}</h3>
              <span class="text-slate-400 text-sm font-mono">| 系統: ${selectedMareLineage}</span>
            </div>
          </div>
          
          <div class="w-full md:w-64 space-y-2 bg-slate-950/40 p-3 rounded-xl border border-white/5">
            <!-- stats comparison helper -->
            <div class="flex justify-between items-center text-[10px] text-slate-400">
              <span class="font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span> SPEED</span>
              <span class="font-mono text-white font-extrabold">${selectedMareStats.speed} Pts</span>
            </div>
            <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div class="h-full bg-pink-500" style="width: ${Math.min(100, (selectedMareStats.speed / 1000) * 100)}%"></div>
            </div>
            
            <div class="flex justify-between items-center text-[10px] text-slate-400">
              <span class="font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-blue-550 bg-blue-500"></span> STAMINA</span>
              <span class="font-mono text-white font-extrabold">${selectedMareStats.stamina} Pts</span>
            </div>
            <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 animate-pulse-subtle" style="width: ${Math.min(100, (selectedMareStats.stamina / 1000) * 100)}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Constellation-style visual process separator -->
      <div class="constellation-separator my-6">
        <div class="constellation-line"></div>
        <div class="constellation-node text-sm font-black tracking-widest text-amber-300 uppercase">
          <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          <span>DAM (牝馬確定)</span>
          <span class="text-slate-500 font-normal">✦ ✦ ✦</span>
          <span class="text-sky-400">SELECT SIRE (種牡馬選択)</span>
          <span class="w-2 h-2 rounded-full bg-sky-500 animate-star-twinkle-fast"></span>
        </div>
      </div>

      <header class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-sky-400 text-sm">⚡</span>
            <span class="text-sky-400 text-[10px] font-black uppercase tracking-widest bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/10">STEP 2/3: 牡馬フェーズ</span>
          </div>
          <h2 class="text-3xl font-black italic uppercase tracking-tighter">SELECT SIRE (種牡馬選択)</h2>
          <p class="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">配合する種牡馬（お父さん）を選んでください</p>
        </div>
        
        <!-- Navigation Tabs -->
        <div class="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
          <button class="px-5 py-2 rounded-xl font-bold text-sm transition-all uppercase tracking-wider ${isMarket ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20" : "text-slate-400 hover:text-white"}" 
                  onclick="window.setState({ breedingStallionTab: 'market' })">
            公認種牡馬 (Market Sire)
          </button>
          <button class="px-5 py-2 rounded-xl font-bold text-sm transition-all uppercase tracking-wider ${!isMarket ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20" : "text-slate-400 hover:text-white"}" 
                  onclick="window.setState({ breedingStallionTab: 'stable' })">
            所有牡馬 (My Stable Sire)
          </button>
        </div>
      </header>

      ${
        currentStallions.length === 0
          ? `
        <div class="flex-1 flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-4 rounded-[2rem]">
          <div class="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-2xl font-black font-mono">?</div>
          <div class="space-y-1">
            <h3 class="text-lg font-bold text-slate-300">対象の所有牡馬がいません</h3>
            <p class="text-sm text-slate-500 max-w-sm mx-auto">馬房に牡馬（牡）を所有していません。新馬スカウトで牡馬を迎え入れるか、公認種牡馬タブからレンタルして配合を行ってください。</p>
          </div>
          <button class="px-5 py-2 bg-sky-600/20 border border-sky-500/30 text-sky-400 hover:bg-sky-600/30 font-bold rounded-xl text-sm transition-all uppercase" onclick="window.setState({ breedingStallionTab: 'market' })">
            種牡馬カタログを見る
          </button>
        </div>
      `
          : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          ${currentStallions
            .map((s) => {
              const isStableSire = !isMarket;
              const finalPrice = isStableSire
                ? 500000
                : window.getStallionPrice
                  ? window.getStallionPrice(s)
                  : s.price || s.fee || 0;
              const hasDiscount =
                !isStableSire &&
                window.isMilestoneUnlocked &&
                window.isMilestoneUnlocked("emperor");

              return `
              <div class="relative card-sire rounded-[2rem] p-6 hover:border-sky-500/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-sky-500/5" 
                   onclick="window.setState({ screen: 'breeding_confirm', selectedStallionId: '${s.id}', selectedStallionSource: '${isStableSire ? "stable" : "market"}' })">
                
                <!-- Stable / Rented badge -->
                <div class="absolute top-4 right-4 flex gap-1.5">
                  ${s.isMutation ? `<span class="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-[8px] px-2 py-0.5 rounded-full tracking-widest uppercase animate-pulse-subtle">MUTATION</span>` : ""}
                  <span class="font-bold text-[8px] px-2 py-0.5 rounded-full tracking-widest uppercase ${isStableSire ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-slate-800 text-slate-400"}">
                    ${isStableSire ? "OWNED" : "RENTAL"}
                  </span>
                </div>

                <div class="mb-4">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-sky-400 font-extrabold text-[9px] bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/15">⚡ 種牡馬 (Sire)</span>
                    <span class="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${getRankBadgeClass(s.bloodlineRank || "B")}">RANK ${s.bloodlineRank || "B"}</span>
                  </div>
                  <h3 class="text-xl font-black italic tracking-tight uppercase group-hover:text-sky-400 transition-colors mt-2">${s.name}</h3>
                  <div class="text-[10px] text-emerald-400 font-extrabold font-mono mt-1">
                    ${
                      isStableSire
                        ? (s.isRetiredToBreeding ? `🏡 自家所有無償種付 (施設費用: ¥50万)` : `自家生産無償種付 (施設費用: ¥50万)`)
                        : hasDiscount
                          ? `<span class="line-through text-slate-600 mr-1 text-[10px] font-normal block">${formatMoney(s.price || s.fee)}</span><span class="text-amber-400 text-[10px] font-extrabold mr-1">15%OFF</span>${formatMoney(finalPrice)}`
                          : `種付料: ${formatMoney(s.price || s.fee)}`
                    }
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                   <div>
                     <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">SPEED</span>
                     <div class="flex items-center gap-1.5">
                       <div class="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                         <div class="h-full bg-indigo-500 rounded-full" style="width: ${Math.min(100, (s.stats.speed / 1000) * 100)}%"></div>
                       </div>
                       <span class="text-[10px] font-mono font-bold text-slate-300">${s.stats.speed}</span>
                     </div>
                   </div>
                   <div>
                     <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">STRENGTH / EXPL</span>
                     <div class="flex items-center gap-1.5">
                       <div class="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                         <div class="h-full bg-amber-500 rounded-full" style="width: ${Math.min(100, ((s.explosivePower || s.stats.explosiveness || 100) / 200) * 100)}%"></div>
                       </div>
                       <span class="text-[10px] font-mono font-bold text-slate-300">${s.explosivePower || s.stats.explosiveness || 100}</span>
                     </div>
                   </div>
                </div>
                
                ${
                  s.traits && s.traits.length > 0
                    ? `
                  <div class="flex flex-wrap gap-1 mt-3.5 pt-3 border-t border-slate-800/40">
                    ${s.traits.map((t) => `<span class="bg-indigo-500/10 text-indigo-300 font-bold text-[8px] px-2 py-0.5 rounded">${t}</span>`).join("")}
                  </div>
                `
                    : ""
                }
              </div>
            `;
            })
            .join("")}
        </div>
      `
      }
      <div class="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/5 mt-8 z-30 flex items-center justify-between">
        ${Button({ children: "← 牝馬を選び直す", onClick: () => window.setState({ screen: "breeding_mare" }), variant: "outline" })}
        <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">STELLAR RACING BREEDING LAB</span>
      </div>
    </div>
  `;
}

function SceneBreedingConfirm() {
  const {
    selectedMareId,
    selectedStallionId,
    selectedMareSource,
    selectedStallionSource,
    useStarBlessing,
  } = window.state;

  const mare = (selectedMareSource === "stable"
    ? (window.state.horses.find((h) => h.id === selectedMareId) || (window.state.retiredMares || []).find((h) => h.id === selectedMareId))
    : window.state.mares.find((m) => m.id === selectedMareId)) || {
    name: "選択中",
    stats: {
      speed: 500,
      stamina: 500,
      guts: 500,
      temperament: 500,
      health: 500,
      luck: 500,
      explosiveness: 500,
    },
    pedigree: {
      father: "?",
      mother: "?",
      grandFathers: ["?", "?"],
      grandMothers: ["?", "?"],
    },
  };

  const stallion = (selectedStallionSource === "stable"
    ? (window.state.horses.find((h) => h.id === selectedStallionId) || (window.state.retiredStallions || []).find((h) => h.id === selectedStallionId))
    : STALLIONS.find((s) => s.id === selectedStallionId)) || {
    name: "選択中",
    stats: {
      speed: 500,
      stamina: 500,
      guts: 500,
      temperament: 500,
      health: 500,
      luck: 500,
      explosiveness: 500,
    },
    pedigree: {
      father: "?",
      mother: "?",
      grandFathers: ["?", "?"],
      grandMothers: ["?", "?"],
    },
    explosivePower: 100,
  };

  const starShards = window.state.starShards || 0;
  const requiredShards = window.getBlessingCost ? window.getBlessingCost() : 5;
  const isStallionDiscounted =
    selectedStallionSource !== "stable" &&
    window.isMilestoneUnlocked &&
    window.isMilestoneUnlocked("emperor");

  // Calculates fee
  let breedingFee = 0;
  if (selectedStallionSource === "stable") {
    breedingFee = 500000;
  } else {
    breedingFee = isStallionDiscounted
      ? window.getStallionPrice(stallion)
      : stallion.price || stallion.fee || 0;
  }

  // Calculate mutation probability display
  const sireRank = stallion.bloodlineRank || "C";
  const damRank = mare.bloodlineRank || "C";
  const rankScores = { S: 5, A: 4, B: 3, C: 2, D: 1 };
  const sireScore = rankScores[sireRank] || 2;
  const damScore = rankScores[damRank] || 2;

  let baseMutationChance = 0.03;
  const maxScore = Math.max(sireScore, damScore);
  const avgScore = (sireScore + damScore) / 2;

  if (sireRank === "S" && damRank === "S") baseMutationChance = 0.35;
  else if (maxScore === 5 && avgScore >= 4.5) baseMutationChance = 0.28;
  else if (maxScore === 5) baseMutationChance = 0.2;
  else if (sireRank === "A" && damRank === "A") baseMutationChance = 0.22;
  else if (maxScore === 4 && avgScore >= 3.5) baseMutationChance = 0.16;
  else if (maxScore === 4) baseMutationChance = 0.12;
  else if (sireRank === "B" && damRank === "B") baseMutationChance = 0.1;
  else if (maxScore === 3) baseMutationChance = 0.06;
  else baseMutationChance = 0.03;

  const finalMutationChance = baseMutationChance + (useStarBlessing ? 0.15 : 0);

  // Inbreeding Character check for display
  const stallionAncestors = [
    stallion.name,
    stallion.pedigree.father,
    stallion.pedigree.mother,
    ...(stallion.pedigree.grandFathers || []),
    ...(stallion.pedigree.grandMothers || []),
  ];
  const mareAncestors = [
    mare.name,
    mare.pedigree.father,
    mare.pedigree.mother,
    ...(mare.pedigree.grandFathers || []),
    ...(mare.pedigree.grandMothers || []),
  ];

  const stallionChars = new Set(stallionAncestors.join("").split(""));
  const mareChars = new Set(mareAncestors.join("").split(""));

  const inbreedingChars = [];
  stallionChars.forEach((char) => {
    if (char !== "?" && mareChars.has(char)) {
      inbreedingChars.push(char);
    }
  });

  // Nick style check (3 diff name chars)
  const stallionNameChars = new Set(stallion.name.split(""));
  const mareNameChars = new Set(mare.name.split(""));
  let diffCount = 0;
  stallionNameChars.forEach((c) => {
    if (!mareNameChars.has(c)) diffCount++;
  });
  mareNameChars.forEach((c) => {
    if (!stallionNameChars.has(c)) diffCount++;
  });
  const isNick = diffCount >= 3 || useStarBlessing;

  return `
    <div class="min-h-screen bg-starry-sky text-white flex flex-col p-6 animate-fade-in animate-duration-300 pb-32">
      <!-- Steps Progress -->
      ${RenderBreedingProgress(3)}

      <header class="mb-8">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-amber-450 text-amber-400 text-sm">🌟</span>
          <span class="text-amber-400 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/10">STEP 3/3: 配合フェーズ終了</span>
        </div>
        <h2 class="text-3xl font-black italic uppercase tracking-tighter">BREEDING STUDIO (配合確定)</h2>
        <p class="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">選ばれた両親の血統シナジーと突然変異予測</p>
      </header>
      
      <div class="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        <!-- Male and Female Parent card row -->
        <div class="lg:col-span-7 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            <!-- Mother Card -->
            <div class="card-dam rounded-[2rem] p-6 relative overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
              <div class="text-[9px] font-bold text-rose-400 tracking-widest uppercase mb-1">DAM (繁殖牝馬・母)</div>
              <h3 class="text-2xl font-black italic tracking-tight uppercase text-rose-300 truncate">${mare.name}</h3>
              <div class="text-[10px] text-slate-500 font-mono mt-1">RANK ${mare.bloodlineRank || "C"} | ${selectedMareSource === "stable" ? "自家生産馬" : "公認レンタル馬"}</div>
              
              <div class="mt-6 space-y-3">
                <div>
                  <div class="flex justify-between text-[9px] font-bold text-slate-400 mb-1"><span>SPEED</span><span>${mare.stats.speed}</span></div>
                  <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden"><div class="h-full bg-rose-500" style="width: ${(mare.stats.speed / 1000) * 100}%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-[9px] font-bold text-slate-400 mb-1"><span>STAMINA</span><span>${mare.stats.stamina}</span></div>
                  <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden"><div class="h-full bg-blue-500" style="width: ${(mare.stats.stamina / 1000) * 100}%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-[9px] font-bold text-slate-400 mb-1"><span>GUTS</span><span>${mare.stats.guts || 500}</span></div>
                  <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden"><div class="h-full bg-emerald-500" style="width: ${((mare.stats.guts || 500) / 1000) * 100}%"></div></div>
                </div>
              </div>
            </div>

            <!-- Father Card -->
            <div class="card-sire rounded-[2rem] p-6 relative overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
              <div class="text-[9px] font-bold text-indigo-400 tracking-widest uppercase mb-1">SIRE (種牡馬・父)</div>
              <h3 class="text-2xl font-black italic tracking-tight uppercase text-indigo-300 truncate">${stallion.name}</h3>
              <div class="text-[10px] text-slate-500 font-mono mt-1">RANK ${stallion.bloodlineRank || "C"} | ${selectedStallionSource === "stable" ? "自家生産馬" : "公認レンタル馬"}</div>
              
              <div class="mt-6 space-y-3">
                <div>
                  <div class="flex justify-between text-[9px] font-bold text-slate-400 mb-1"><span>SPEED</span><span>${stallion.stats.speed}</span></div>
                  <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden"><div class="h-full bg-indigo-550 bg-indigo-500" style="width: ${(stallion.stats.speed / 1000) * 100}%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-[9px] font-bold text-slate-400 mb-1"><span>STAMINA</span><span>${stallion.stats.stamina}</span></div>
                  <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden"><div class="h-full bg-blue-500" style="width: ${(stallion.stats.stamina / 1000) * 100}%"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-[9px] font-bold text-slate-400 mb-1"><span>GUTS</span><span>${stallion.stats.guts || 500}</span></div>
                  <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden"><div class="h-full bg-emerald-500" style="width: ${((stallion.stats.guts || 500) / 1000) * 100}%"></div></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Legacy Pedigree Family Chart (3 generation diagram) -->
          <div class="bg-slate-900/60 border border-slate-850 p-6 rounded-[2rem] space-y-4 font-sans">
            <h4 class="text-sm font-black tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> 3代血統バックグラウンド (Pedigree Tree)
            </h4>
            <div class="grid grid-cols-3 gap-2 text-center text-[10px] font-bold font-mono">
              <!-- G1 Parents -->
              <div class="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                <span class="block text-[8px] text-slate-600 uppercase">1代祖先 (Parents)</span>
                <div class="text-indigo-400 truncate">${stallion.name}</div>
                <div class="text-rose-450 truncate">${mare.name}</div>
              </div>
              <!-- G2 Grandparents -->
              <div class="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                <span class="block text-[8px] text-slate-600 uppercase">2代祖先 (Grand)</span>
                <div class="text-slate-400 truncate">${stallion.pedigree?.father || "?"}</div>
                <div class="text-slate-550 truncate">${stallion.pedigree?.mother || "?"}</div>
                <div class="h-[1px] bg-white/5 my-1"></div>
                <div class="text-slate-400 truncate">${mare.pedigree?.father || "?"}</div>
                <div class="text-slate-550 truncate">${mare.pedigree?.mother || "?"}</div>
              </div>
              <!-- G3 Great Grandparents -->
              <div class="space-y-1 bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <span class="block text-[8px] text-slate-600 uppercase">3代祖先 (Great Grand)</span>
                <div class="text-slate-550 truncate text-[8px]">${stallion.pedigree?.grandFathers?.[0] || "?"}</div>
                <div class="text-slate-550 truncate text-[8px]">${stallion.pedigree?.grandMothers?.[0] || "?"}</div>
                <div class="text-slate-550 truncate text-[8px]">${mare.pedigree?.grandFathers?.[0] || "?"}</div>
                <div class="text-slate-550 truncate text-[8px]">${mare.pedigree?.grandMothers?.[0] || "?"}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Breeding Synergy and Confirm Module -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 font-sans">
            <h3 class="text-lg font-black italic tracking-tighter uppercase text-slate-200">COUPLE DIAGNOSTICS (配合診断)</h3>
            
            <div class="space-y-4">
              <!-- Bloodline Synergies -->
              <div class="p-4 rounded-3xl bg-slate-950/60 border border-white/5 space-y-2.5">
                <span class="block text-[8px] font-black text-slate-500 uppercase tracking-wider font-sans">血統適合度＆ニックス特性 (Bloodline Synergy)</span>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-400 font-bold font-sans">ニックス発生 (Special Nick):</span>
                  <span class="px-2 py-0.5 text-[9.5px] font-black rounded-lg ${isNick ? "bg-amber-500 text-slate-950 alert-pulse" : "bg-slate-800 text-slate-400"} font-sans">
                    ${isNick ? "★ EXCEL-NICK (発生)" : "適合なし"}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-400 font-bold font-sans">爆発力 (Explosiveness):</span>
                  <span class="text-sm font-mono font-bold text-amber-400">${stallion.explosivePower || 100} EP</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-400 font-bold font-sans">近親交配 (Inbreeding Factor):</span>
                  <span class="text-sm font-mono font-black ${inbreedingChars.length > 0 ? "text-red-400" : "text-slate-400"}">
                    ${inbreedingChars.length > 0 ? `⚠️ ${inbreedingChars.join(", ")} (インブリード発生)` : "なし (アウトブリード)"}
                  </span>
                </div>
              </div>

              <!-- Base stats forecasting -->
              <div class="p-4 rounded-3xl bg-indigo-950/15 border border-indigo-500/10 space-y-3">
                <span class="block text-[8px] font-black text-indigo-400 uppercase tracking-widest font-sans">🧬 INHERITED TRAIT PREDICTIONS (仔馬の遺伝パラメーター予測)</span>
                
                <div class="space-y-1.5 text-sm font-sans">
                  <div class="flex justify-between items-center bg-slate-950/40 p-2 rounded-xl border border-white/5">
                    <span class="text-slate-400 font-bold">想定スピード:</span>
                    <span class="font-mono font-bold text-white">${Math.floor(mare.stats.speed * 0.4 + stallion.stats.speed * 0.45)} - ${Math.floor(mare.stats.speed * 0.4 + stallion.stats.speed * 0.45 + (stallion.explosivePower || 100) * 0.8)}</span>
                  </div>
                  <div class="flex justify-between items-center bg-slate-950/40 p-2 rounded-xl border border-white/5 font-sans">
                    <span class="text-slate-400 font-bold">想定スタミナ:</span>
                    <span class="font-mono font-bold text-white">${Math.floor(mare.stats.stamina * 0.45 + stallion.stats.stamina * 0.4)} - ${Math.floor(mare.stats.stamina * 0.45 + stallion.stats.stamina * 0.4 + (stallion.explosivePower || 100) * 0.7)}</span>
                  </div>
                </div>
              </div>

              <!-- Mutation Chance Widget -->
              <div class="p-4 rounded-3xl border border-dashed border-indigo-500/30 bg-slate-950/60 space-y-2.5">
                <div class="flex items-center justify-between font-sans">
                  <span class="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider">🧬 突然変異発生率 (MUTATION CHANCE)</span>
                  <span class="text-sm font-black text-indigo-300 font-mono">${(finalMutationChance * 100).toFixed(0)}%</span>
                </div>
                <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div class="h-full bg-indigo-500" style="width: ${finalMutationChance * 100}%"></div>
                </div>
                <p class="text-[9px] text-slate-500 leading-normal font-sans">
                  突然変異が発生すると、仔馬は **覚醒ステータスボーナス**（特定パラメーターが極大アップ）と **強力な付加金特性** を持って誕生します。両親の血統能力ランクが高いほど、突然変異の発生確率が跳ね上がります。
                </p>
              </div>

              <!-- Star Blessing (Star Shards Option) -->
              <div class="p-4 rounded-3xl border border-dashed border-amber-500/30 bg-amber-950/10 space-y-3">
                <div class="flex items-center justify-between font-sans">
                  <div class="flex items-center gap-1.5 font-sans">
                    <span class="text-[10px] font-black text-amber-400 uppercase tracking-widest font-sans">🌟 星片の加護 (Star Blessing)</span>
                  </div>
                  <span class="text-[9px] text-slate-500 font-bold font-mono">所持星片: ${starShards}個</span>
                </div>
                <p class="text-[9px] text-slate-400 leading-relaxed font-sans font-sans">
                  星片を <span class="text-amber-400 font-bold">${requiredShards}個</span> 消費して生まれてくる仔馬に神秘 of 加護を与えます。<br/>
                  <span class="text-amber-300 font-semibold block mt-1">【効果】突然変異率がさらに <span class="text-amber-400 text-sm font-black">+15%</span> 底上げされ、2つの金特性と超限界パラメーターが確定します。</span>
                </p>
                <div class="flex pt-1 font-sans">
                  ${Button({
                    children: useStarBlessing
                      ? "★ 加護を適用中"
                      : `星片を ${requiredShards}個 消費して加護を適用する`,
                    onClick: () => {
                      if (starShards < requiredShards) {
                        alert(
                          "星片が足りません。テーマ別イベントで上位入賞して星片を集めてください。",
                        );
                        return;
                      }
                      window.setState({ useStarBlessing: !useStarBlessing });
                    },
                    variant: useStarBlessing ? "primary" : "outline",
                    className: useStarBlessing
                      ? "flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-none hover:from-amber-400 font-black text-xs py-2.5 rounded-xl shadow-lg shadow-amber-500/10"
                      : "flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs py-2.5 rounded-xl",
                  })}
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-800">
              <div class="flex justify-between items-center mb-5 font-sans">
                <span class="text-sm font-bold text-slate-400 uppercase font-sans">BREEDING FEE (配合費用/種付費用)</span>
                <span class="text-2xl font-mono text-emerald-400 font-black">${formatMoney(breedingFee)}</span>
              </div>
              
              <div class="flex gap-4">
                ${Button({
                  children: "配合を行う (BREED FOAL)",
                  onClick: () => window.handleAction("CONFIRM_BREEDING"),
                  className:
                    "flex-1 py-4 text-base font-black bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-xl shadow-indigo-600/15 border-none rounded-2xl",
                })}
                ${Button({
                  children: "キャンセル",
                  onClick: () =>
                    window.setState({ screen: "breeding_stallion" }),
                  variant: "outline",
                  className:
                    "px-6 border-slate-800 text-slate-400 hover:text-white rounded-2xl text-[11px] py-4",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const regularRaces = [
  {
    id: "reg_1",
    name: "ビギナーズダッシュ (Beginners Dash)",
    grade: "OP",
    distance: 1200,
    fee: 10000,
    prize: 3000000,
    shards: 1,
    desc: "新米の競走馬たちが集う、スピード重視の超短距離戦。",
  },
  {
    id: "reg_2",
    name: "ベガカップ (Vega Cup)",
    grade: "G3",
    distance: 1600,
    fee: 50000,
    prize: 8000000,
    shards: 2,
    desc: "スピードとマイル適性が問われる王道のG3競走。",
  },
  {
    id: "reg_3",
    name: "アルタイル大賞 (Altair Memorial)",
    grade: "G2",
    distance: 2000,
    fee: 150000,
    prize: 20000000,
    shards: 4,
    desc: "中距離での持続力とスタミナが求められる重要な前哨戦。",
  },
  {
    id: "reg_4",
    name: "シリウス大賞 (Sirius Grand Prix)",
    grade: "G1",
    distance: 2400,
    fee: 500000,
    prize: 80000000,
    shards: 8,
    desc: "全てのサラブレッドが憧れる伝統と格式に満ちたクラシックの頂点。",
  },
  {
    id: "reg_5",
    name: "銀河グランプリ (Galactic Grand Prix)",
    grade: "G1",
    distance: 3200,
    fee: 1000000,
    prize: 150000000,
    shards: 12,
    desc: "過酷な距離設定。無尽蔵のスタミナと卓越した精神力が試される長距離最高峰。",
  },
];

const themedRaces = [
  {
    id: "theme_1",
    name: "朱雀記念 (Suzaku Memorial)",
    grade: "Event G2",
    distance: 1400,
    fee: 100000,
    prize: 15000000,
    shards: 5,
    desc: "夏場の厳しい天候と高温多湿を想定した、過酷なスプリント戦。",
  },
  {
    id: "theme_2",
    name: "青龍大賞 (Seiryu Cup)",
    grade: "Event G1",
    distance: 1800,
    fee: 300000,
    prize: 50000000,
    shards: 10,
    desc: "伝説の聖獣の名を冠したテーマレース。スピード・タフネスの調和が必要。",
  },
  {
    id: "theme_3",
    name: "白虎ステークス (Byakko Stakes)",
    grade: "Event G1",
    distance: 2200,
    fee: 500000,
    prize: 75000000,
    shards: 15,
    desc: "泥濘や大雨など、悪コンディション下での適性を極限まで試すイベント。",
  },
  {
    id: "theme_4",
    name: "玄武カップ (Genbu Invitational)",
    grade: "Event G1",
    distance: 3000,
    fee: 800000,
    prize: 120000000,
    shards: 20,
    desc: "厳しい不良馬場と圧倒的タフさを勝ち抜いた者のみが戴冠するスタミナ頂上決戦。",
  },
];

export function evaluateWeatherSuitability(horse, weather) {
  if (!horse) {
    return {
      rating: "B",
      color: "bg-slate-850 text-slate-400 border border-white/5",
      ratingText: "良馬場適性",
    };
  }

  const lineage = horse.lineageId || "balance";
  const speed = horse.stats?.speed || 500;
  const stamina = horse.stats?.stamina || 500;

  if (weather === "Sunny") {
    if (lineage === "speed" || speed > 700) {
      return {
        rating: "S",
        color:
          "bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black",
        ratingText: "良馬場・快晴適性抜群",
      };
    }
    return {
      rating: "A",
      color: "bg-emerald-500 text-slate-950 font-bold",
      ratingText: "良馬場適性あり",
    };
  } else if (weather === "Rainy") {
    if (lineage === "guts" || stamina > 650) {
      return {
        rating: "A",
        color: "bg-emerald-500 text-slate-950 font-bold",
        ratingText: "重馬場適性あり",
      };
    }
    return {
      rating: "B",
      color: "bg-slate-800 text-slate-350 border border-slate-705/30",
      ratingText: "雨天標準",
    };
  } else {
    if (lineage === "stamina" || stamina > 750) {
      return {
        rating: "S",
        color:
          "bg-gradient-to-r from-indigo-505 to-blue-600 text-white font-black",
        ratingText: "不良馬場適性抜群",
      };
    }
    if (stamina > 550) {
      return {
        rating: "B",
        color: "bg-slate-800 text-slate-355 border border-slate-705/30",
        ratingText: "不良馬場適性あり",
      };
    }
    return {
      rating: "C",
      color: "bg-slate-950/60 text-slate-500 border border-white/5",
      ratingText: "重・泥濘苦手",
    };
  }
}

export function getRaceForecast(r) {
  const seed = r.id || "reg_1";
  if (seed.includes("1") || seed.includes("5")) {
    return {
      weather: "Sunny",
      name: "良馬場・快晴",
      icon: "☀️",
      probability: 90,
    };
  } else if (seed.includes("2")) {
    return {
      weather: "Rainy",
      name: "重馬場・小雨",
      icon: "🌧️",
      probability: 80,
    };
  } else {
    return {
      weather: "Muddy",
      name: "不良・豪雨",
      icon: "🌊",
      probability: 75,
    };
  }
}

export function calculateRaceSuitability(horse, race, forecast) {
  if (!horse)
    return { rating: "👌 標準 (B)", color: "bg-slate-800 text-slate-300" };

  const minDist = horse.distanceAptitude ? horse.distanceAptitude[0] : 1600;
  const maxDist = horse.distanceAptitude ? horse.distanceAptitude[1] : 2400;
  const dist = race.distance;

  let score = 2;
  if (dist >= minDist && dist <= maxDist) {
    score += 2;
  } else if (dist >= minDist - 200 && dist <= maxDist + 200) {
    score += 1;
  }

  const weatherRes = evaluateWeatherSuitability(horse, forecast.weather);
  if (weatherRes.rating === "S") score += 1;
  else if (weatherRes.rating === "C") score -= 1;

  if (score >= 4)
    return {
      rating: "🌟 特上 (EX)",
      color: "bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950",
    };
  if (score === 3)
    return { rating: "👍 優位 (A)", color: "bg-emerald-500 text-slate-950" };
  if (score === 2)
    return { rating: "👌 標準 (B)", color: "bg-slate-800 text-slate-300" };
  return {
    rating: "⚠️ 懸念 (C)",
    color: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };
}

function SceneRaceSelect() {
  const horse = window.state.horses.find(
    (h) => h.id === window.state.selectedHorseId,
  ) || { name: "所有馬", stats: { speed: 500, stamina: 500 } };
  const currentTab = window.state.raceTab || "regular";
  const races = currentTab === "regular" ? regularRaces : themedRaces;
  const registeredIds = window.state.registeredHorseIds || [
    window.state.selectedHorseId,
  ];

  // Map each horse to an HTML string without nested template literal issues
  const horseItemsHtml = window.state.horses
    .filter((o) => !o.isRetired)
    .map((o) => {
      const isChecked = registeredIds.includes(o.id);
      const isMainSelected = o.id === window.state.selectedHorseId;
      const borderClass = isChecked
        ? "border-indigo-500/50 bg-indigo-500/5"
        : "border-white/5";
      const checkedAttr = isMainSelected
        ? "disabled checked"
        : isChecked
          ? "checked"
          : "";
      const badgeLabel = isMainSelected
        ? "★ 主出走馬"
        : o.isAutoTrained
          ? ((o.fatigue || 0) >= 50
            ? "⚠️ お任せ除外中 (疲労高: " + (o.fatigue || 0) + "%)"
            : "🔄 お任せ出走中")
          : "選択可能";

      return (
        '<label class="flex items-center gap-3 bg-slate-950/40 border ' +
        borderClass +
        ' p-2.5 rounded-2xl cursor-pointer hover:border-slate-800 transition-all select-none">' +
        '<input type="checkbox" class="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-white/10" ' +
        checkedAttr +
        " onchange=\"window.handleAction('TOGGLE_RACE_REGISTRATION', '" +
        o.id +
        "')\" />" +
        '<div class="leading-none min-w-0 flex-1">' +
        '<span class="text-[11px] font-black text-slate-200 truncate block">' +
        o.name +
        "</span>" +
        '<span class="text-[8px] text-slate-500 font-bold block mt-1 uppercase">' +
        badgeLabel +
        "</span>" +
        "</div>" +
        "</label>"
      );
    })
    .join("");

  // Multiple registration checklist HTML
  const multiRegPanel = `
    <div class="bg-indigo-950/10 border border-indigo-500/10 rounded-3xl p-6 mb-8 max-w-3xl">
      <h4 class="text-sm font-black text-indigo-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
        👥 同厩舎より複数登録可能（出走枠12頭）
      </h4>
      <p class="text-[10px] text-slate-500 mb-4 font-bold leading-relaxed">
        同じレースに複数の所有馬を出走させることができます！登録すると出走料が加算されます。お任せ(育成+出走)状態の馬は、疲労が50%未満の場合のみ自動登録されます。
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        ${horseItemsHtml}
      </div>
    </div>
  `;

  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col p-6">
      <header class="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 class="text-3xl font-black italic uppercase tracking-tighter">RACE SELECTION</h2>
          <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            ${horse.name} を出走させるレースを選定してください（所持金: ${formatMoney(window.state.money)} / 星片: ${window.state.starShards || 0}個）
          </p>
        </div>
      </header>

      <!-- Tabs -->
      <div class="flex gap-4 border-b border-white/5 pb-4 mb-8">
        <button class="px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${
          currentTab === "regular"
            ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
        }" onclick="window.setState({ raceTab: 'regular' })">
          通常シリーズ (Regular Series)
        </button>
        <button class="px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${
          currentTab === "themed"
            ? "bg-amber-600 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.25)]"
            : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
        }" onclick="window.setState({ raceTab: 'themed' })">
          テーマ別特別競走 (Themed Events)
        </button>
      </div>

      ${multiRegPanel}

      <div class="space-y-4 max-w-3xl flex-1">
        ${races
          .map((r) => {
            const forecast = getRaceForecast(r);
            const suit = calculateRaceSuitability(horse, r, forecast);
            return `
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/50 transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.15)] animate-fade-in"
               onclick="window.handleAction('START_RACE', ${JSON.stringify({ ...r, weather: forecast.weather }).replace(/"/g, "&quot;")})">
            <div class="flex-1 space-y-2.5">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="px-2.5 py-1 bg-slate-800 rounded-lg text-[10px] uppercase font-black tracking-tight ${
                  currentTab === "themed"
                    ? "text-amber-400 border border-amber-500/10"
                    : "text-indigo-400"
                }">${r.grade}</span>
                <span class="text-sm text-slate-400 font-mono font-bold">${r.distance}m</span>
                <span class="text-[10px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded-md border border-emerald-500/10">出走料: ${formatMoney(r.fee)}</span>
                
                <!-- Weather forecast widget -->
                <span class="flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded-md border border-white/5 text-[9.5px] font-mono font-bold text-slate-300">
                  <span>${forecast.icon}</span> <span>${forecast.name} (確度 ${forecast.probability}%)</span>
                </span>
                
                <!-- Suitability rating -->
                <span class="px-2 py-0.5 text-[9.5px] font-black rounded-lg ${suit.color} leading-none">
                  適性: ${suit.rating}
                </span>
              </div>
              
              <h3 class="text-2xl font-black uppercase italic tracking-tight">${r.name}</h3>
              <p class="text-sm text-slate-400 leading-relaxed font-sans">${r.desc}</p>
            </div>
            
            <div class="flex md:flex-col justify-between items-end w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0 gap-3">
              <div class="text-right">
                <div class="text-[9px] font-black text-slate-500 uppercase leading-none">SHARDS REWARD</div>
                <div class="text-base font-black text-amber-400 flex items-center justify-end gap-1 mt-1">
                  <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
                  +${r.shards} SHARDS
                </div>
              </div>
              <div class="text-right font-sans">
                <div class="text-[9px] font-black text-slate-500 uppercase leading-none">1st PRIZE</div>
                <div class="text-xl font-black text-emerald-400 mt-1 font-mono">${formatMoney(r.prize)}</div>
              </div>
            </div>
          </div>
          `;
          })
          .join("")}
      </div>

      <div class="mt-8">
        ${Button({ children: "戻る", onClick: () => window.setState({ screen: "stable" }), variant: "outline", className: "px-6 py-2.5 text-xs rounded-xl" })}
      </div>
    </div>
  `;
}

function SceneRaceSim() {
  return `
    <div id="race-simulation-root" class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center"></div>
  `;
}

function SceneRaceResult() {
  const sortedResults = [...window.state.raceResult].sort(
    (a, b) => a.position - b.position,
  );
  const playerResult = sortedResults.find(
    (r) => r.horseId === window.state.selectedHorseId,
  );

  const rewards = window.state.raceRewards || { prize: 0, shards: 0 };

  // Trigger results animation sequence and commentary timer with a small delay
  if (
    window.state.screen === "race_result" &&
    window.state.animatedResults === false
  ) {
    if (window.commentaryTimeouts) {
      window.commentaryTimeouts.forEach(clearTimeout);
    }
    window.commentaryTimeouts = [];

    setTimeout(() => {
      window.setState({ animatedResults: true, replayCommentStep: 0 });

      const t1 = setTimeout(() => {
        if (
          window.state.screen === "race_result" &&
          window.state.animatedResults
        ) {
          window.setState({ replayCommentStep: 1 });
        }
      }, 750);

      const t2 = setTimeout(() => {
        if (
          window.state.screen === "race_result" &&
          window.state.animatedResults
        ) {
          window.setState({ replayCommentStep: 2 });
        }
      }, 1500);

      const t3 = setTimeout(() => {
        if (
          window.state.screen === "race_result" &&
          window.state.animatedResults
        ) {
          window.setState({ replayCommentStep: 3 });
        }
      }, 2250);

      window.commentaryTimeouts.push(t1, t2, t3);
    }, 150);
  }

  // Generate dynamic commentary based on horse stats
  const commentaryList = generateFinishLineCommentary(
    playerResult,
    sortedResults[0],
  );
  const currentCommentStep = Math.min(
    3,
    Math.max(0, window.state.replayCommentStep || 0),
  );
  const currentComment =
    commentaryList[currentCommentStep] ||
    "最後の勝負がここからはじまります！解説・実況にご注目ください。";

  // Combine top 5 and player's horse (if finished > 5th) so they can track their own horse
  const displayHorses = sortedResults.slice(0, 5);
  if (
    playerResult.position > 5 &&
    !displayHorses.some((h) => h.horseId === playerResult.horseId)
  ) {
    displayHorses.push(playerResult);
  }

  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,#1e1b4b_0%,#020617_60%)]">
      <div class="max-w-3xl w-full space-y-8">
        <header class="text-center space-y-2">
          <h2 class="text-5xl font-black italic tracking-tighter uppercase text-slate-100 flex items-center justify-center gap-2">
            <i data-lucide="trophy" class="w-10 h-10 text-amber-400 mr-1"></i>
            RACE RESULT
          </h2>
          <p class="text-indigo-400 font-bold text-xl uppercase tracking-widest">${playerResult.position}着 / ${playerResult.name}</p>
          <div class="flex items-center justify-center gap-1.5 flex-wrap justify-center mt-1">
            <span class="text-sm text-slate-500 font-bold">${window.state.currentRace?.name || ""} (${window.state.currentRace?.distance || 0}m)</span>
            ${window.state.currentRace?.weather === "Sunny" ? `<span class="bg-amber-500/10 text-amber-550 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-black">☀️ 晴れ (良馬場)</span>` : ""}
            ${window.state.currentRace?.weather === "Rainy" ? `<span class="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-black">🌧️ 雨 (重馬場)</span>` : ""}
            ${window.state.currentRace?.weather === "Muddy" ? `<span class="bg-orange-700/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-black">🏇💦 豪雨 (不良泥濘)</span>` : ""}
          </div>
        </header>

        <!-- Rewards Display Box -->
        <div class="bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-6 text-center space-y-3 shadow-[0_4px_30px_rgba(99,102,241,0.15)] backdrop-blur-sm">
          <div class="text-[10px] font-black uppercase tracking-widest text-indigo-400">獲得報酬 (Race Rewards)</div>
          <div class="flex justify-center items-center gap-12">
            <div>
              <div class="text-[8px] font-black text-slate-500 uppercase">PRIZE MONEY</div>
              <div class="text-2xl font-black text-emerald-450 font-mono mt-0.5">${rewards.prize > 0 ? `+${formatMoney(rewards.prize)}` : "¥0万"}</div>
            </div>
            ${
              rewards.shards > 0
                ? `
              <div class="w-[1px] h-8 bg-white/10"></div>
              <div>
                <div class="text-[8px] font-black text-slate-500 uppercase">STAR SHARDS</div>
                <div class="text-2xl font-black text-amber-400 flex items-center justify-center gap-1 font-mono mt-0.5 animate-bounce">
                  <i data-lucide="sparkles" class="w-5 h-5 text-amber-400 mr-0.5"></i>
                  +${rewards.shards} SHARDS
                </div>
              </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Finish Line Replay Tracks with Live Commentary Overlay -->
        <div class="space-y-4 relative p-8 bg-slate-900/60 border border-slate-800 rounded-[3rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)] select-none">
          <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <div class="flex items-center gap-2">
              <i data-lucide="activity" class="w-5 h-5 text-indigo-400"></i>
              <h3 class="text-sm font-black uppercase tracking-wider text-slate-300">ゴール直前リプレイ (Finish Line Replay)</h3>
            </div>
            <button onclick="window.setState({ animatedResults: false });" 
                    class="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-xl hover:bg-indigo-600/35 transition-all duration-250 active:scale-95 cursor-pointer">
              <i data-lucide="play" class="w-3.5 h-3.5 text-indigo-400"></i>
              REPLAY ANIMATION
            </button>
          </div>
          
          <div class="relative w-full h-[410px] bg-slate-950/90 rounded-2xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden shadow-inner font-sans">
            <!-- Checkered Finish Line flag/stripe (masked above commentary overlay area) -->
            <div class="absolute top-0 bottom-[80px] left-[80%] w-3 bg-[repeating-linear-gradient(45deg,#111,#111_6px,#fff_6px,#fff_12px)] opacity-60 z-0 border-l border-r border-white/10"></div>
            <!-- Goal Post Banner -->
            <div class="absolute right-[14%] top-2 text-[8px] font-black text-slate-400 uppercase tracking-widest pointer-events-none z-10 bg-slate-900 border border-white/10 px-2 py-0.5 rounded shadow-lg">GOAL</div>

            <!-- Lanes list (top-aligned, with padding bottom so lanes don't touch commentary overlay) -->
            <div class="flex-1 flex flex-col justify-start gap-2.5 pb-24 overflow-y-auto z-10">
              ${displayHorses
                .map((r, idx) => {
                  const isPlayer = r.horseId === window.state.selectedHorseId;
                  // Starting line is 5%, Goal is up to 88% depending on performance margin
                  const finalPct = window.state.animatedResults
                    ? Math.max(8, 85 - (r.position - 1) * 7.5)
                    : 5;
                  const rankColor =
                    r.position === 1
                      ? "bg-amber-500 text-slate-950 font-black"
                      : r.position === 2
                        ? "bg-slate-350 text-slate-950"
                        : r.position === 3
                          ? "bg-amber-700 text-white"
                          : "bg-slate-800 text-slate-400";
                  const delay = (r.position - 1) * 0.15; // 1st crosses first, then staggered delay

                  return `
                  <div class="relative h-11 w-full flex items-center bg-slate-900/40 rounded-xl px-2 border border-white/5 overflow-hidden">
                    <!-- Dashed track centerline decorative element -->
                    <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-white/5 pointer-events-none z-0"></div>
                    
                    <!-- Horseline dynamic glider -->
                    <div class="absolute flex items-center gap-2 z-10"
                         style="left: ${finalPct}%; transition: left 2.2s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s;">
                      
                      <div class="relative flex items-center">
                        <!-- Blessed custom aura visual effect -->
                        ${
                          r.isBlessed
                            ? `
                          <div class="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 opacity-60 blur-md animate-pulse"></div>
                        `
                            : ""
                        }
                        
                        <!-- Pod capsule container -->
                        <div class="flex items-center gap-2 p-1 px-3 rounded-full border shadow-2xl relative select-none transform transition-transform duration-300 ${
                          isPlayer
                            ? "bg-indigo-950/90 border-indigo-500 shadow-indigo-500/25 ring-2 ring-indigo-500/20"
                            : "bg-slate-900 border-slate-800"
                        }">
                          
                          <!-- Rank Circle Badge -->
                          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${rankColor}">
                            ${r.position}
                          </span>

                          <!-- Mini color indicator dot -->
                          <span class="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 shadow-inner flex items-center justify-center relative" 
                                style="background-color: ${r.color}">
                            ${isPlayer ? `<i data-lucide="star" class="w-2.5 h-2.5 text-white fill-white scale-75"></i>` : ""}
                          </span>

                          <!-- Mini Horse label metadata -->
                          <div class="flex flex-col text-left max-w-[140px]">
                            <span class="text-[10px] font-black tracking-tight flex items-center gap-1 uppercase truncate ${
                              isPlayer ? "text-indigo-300" : "text-slate-300"
                            }">
                              ${r.name}
                              ${isPlayer ? '<span class="text-[7px] bg-indigo-500/25 text-indigo-400 border border-indigo-500/30 px-1 py-0.2 rounded font-black">YOU</span>' : ""}
                            </span>
                            <span class="text-[8px] font-mono font-bold leading-none ${isPlayer ? "text-indigo-400/90" : "text-slate-500"}">
                              ${(r.time / 1).toFixed(2)}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>

            <!-- Commentary HUD Overlay -->
            <div class="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-indigo-500/30 rounded-2xl p-3.5 flex gap-3.5 items-center backdrop-blur-md shadow-2xl z-20 min-h-[72px] transition-all duration-300">
              <span class="flex h-2.5 w-2.5 shrink-0 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <div class="flex-1 text-left">
                <div class="text-[8px] font-black text-rose-450 uppercase tracking-widest leading-none mb-1">実況リプレイ (Live Commentary)</div>
                <p class="text-sm text-slate-100 font-bold leading-relaxed italic transition-all duration-300">
                  ${currentComment}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          <table class="w-full text-left">
            <thead class="bg-slate-800/50 text-[10px] font-black tracking-widest uppercase text-slate-500">
              <tr>
                <th class="px-8 py-4">POS</th>
                <th class="px-8 py-4">HORSE</th>
                <th class="px-8 py-4">TIME</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${sortedResults
                .slice(0, 5)
                .map(
                  (r) => `
                <tr class="${r.horseId === window.state.selectedHorseId ? "bg-indigo-500/10 font-bold" : ""}">
                  <td class="px-8 py-4 font-black italic text-2xl">${r.position}</td>
                  <td class="px-8 py-4 font-black uppercase tracking-tight">${r.name}</td>
                  <td class="px-8 py-4 font-mono text-sm">${(r.time / 1).toFixed(1)}s</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="flex justify-center">
           ${Button({
             children: "🏇 牧場へ戻る (Return to Stable)",
             onClick: () =>
               window.setState({
                 screen: "stable",
                 currentRace: null,
                 raceResult: null,
                 raceStep: 0,
                 raceRewards: null,
               }),
             className:
               "px-16 py-4 text-lg font-black tracking-wider bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-355 hover:via-teal-355 hover:to-emerald-450 hover:-translate-y-0.5 active:scale-95 transition-all duration-155 text-slate-950 rounded-2xl shadow-[0_6px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_35px_rgba(16,185,129,0.5)] cursor-pointer",
           })}
        </div>
      </div>
    </div>
  `;
}

function RenderSaveModal() {
  if (!window.state.showSaveModal) return "";

  return `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-lg w-full p-8 space-y-6 relative">
        <button class="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl" onclick="window.setState({ showSaveModal: false })">✕</button>
        
        <h3 class="text-2xl font-black italic tracking-tighter uppercase text-indigo-400">DATA MANAGEMENT</h3>
        <p class="text-slate-400 text-sm font-semibold">現在プレイ中のゲームデータを、ファイル出力してデバイスへ保存したり、お持ちのセーブデータファイルを読み込むことができます。</p>
        
        <div class="space-y-4 pt-4 border-t border-white/5 text-left text-white">
          <!-- Local Auto Save State -->
          <div class="bg-slate-800/40 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <div class="font-bold text-sm">ブラウザ自動保存</div>
              <div class="text-[10px] text-slate-500 mt-0.5">プレイ状況はブラウザへ自動的に適時セーブされています。</div>
            </div>
            <div class="text-emerald-400 font-bold text-sm flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> オートセーブON
            </div>
          </div>
          
          <!-- File Export -->
          <div class="border border-white/5 bg-slate-950 p-5 rounded-2xl flex flex-col gap-3">
            <div class="space-y-1">
              <div class="font-bold text-sm">💾 セーブデータのファイル保存 (ダウンロード)</div>
              <p class="text-[10px] text-slate-400 leading-relaxed">ゲーム進捗データをJSONファイルとしてデバイスにダウンロードします。スマホ等他の端末への引き継ぎやバックアップとして利用可能です。</p>
            </div>
            ${Button({
              children: "セーブデータをダウンロード",
              onClick: "window.exportSaveData()",
              variant: "primary",
              className: "w-full text-xs py-2.5",
            })}
          </div>

          <!-- File Import -->
          <div class="border border-white/5 bg-slate-950 p-5 rounded-2xl flex flex-col gap-3">
            <div class="space-y-1">
              <div class="font-bold text-sm">📂 セーブデータの読込 (アップロード)</div>
              <p class="text-[10px] text-slate-400 leading-relaxed">過去にエクスポートしたセーブデータを読み込み、プレイを再開します。<br><span class="text-amber-500 font-semibold">※現在プレイ中のデータは上書きしてロードされます。</span></p>
            </div>
            <label class="block w-full">
              <input type="file" accept=".json" onchange="window.importSaveData(event)" class="hidden" id="save-file-input">
              <div class="bg-slate-800 text-center hover:bg-slate-700 text-white font-bold text-sm py-2.5 px-4 rounded-lg cursor-pointer transition-all active:scale-95 border border-white/5">
                セーブデータファイルを選択する
              </div>
            </label>
          </div>
          
          <!-- Danger Zone: Reset -->
          <div class="pt-4 border-t border-white/5 flex gap-3">
            ${Button({
              children: "閉じる",
              onClick: () => window.setState({ showSaveModal: false }),
              variant: "secondary",
              className: "flex-1 text-xs py-2.5",
            })}
            ${Button({
              children: "データを完全初期化",
              onClick: () => {
                window.safeConfirm(
                  "本当に保存されているすべてのゲームデータをリセットしますか？この操作は取り消せません。",
                  () => {
                    localStorage.removeItem(SAVE_KEY);
                    window.setState({
                      screen: "title",
                      horses: [],
                      mares: [...INITIAL_MARES],
                      money: 10000000,
                      starShards: 0,
                      useStarBlessing: false,
                      raceTab: "regular",
                      week: 1,
                      month: 1,
                      year: 1,
                      history: [],
                      showSaveModal: false,
                    });
                    window.safeAlert(
                      "すべてのセーブデータを完全に初期化しました。",
                    );
                  },
                );
              },
              variant: "danger",
              className: "text-xs py-2.5",
            })}
          </div>
        </div>
      </div>
    </div>
  `;
}

function RenderScoutModal() {
  const { showScoutModal, scoutedHorse, money } = window.state;
  if (!showScoutModal || !scoutedHorse) return "";

  const h = scoutedHorse;
  const canAfford = money >= 2000000;

  // 各種パラメータのカラー設定
  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case "S":
        return "bg-amber-500 text-slate-950 border-amber-400 font-bold";
      case "A":
        return "bg-orange-500 text-white border-orange-400";
      case "B":
        return "bg-indigo-500 text-white border-indigo-400";
      case "C":
        return "bg-blue-500 text-white border-blue-400";
      default:
        return "bg-slate-600 text-slate-200 border-slate-500";
    }
  };

  const getStrategyLabel = (strat) => {
    switch (strat) {
      case "escape":
        return "逃げ";
      case "pace":
        return "先行";
      case "last":
        return "差し";
      case "stay":
        return "追込";
      default:
        return "自在";
    }
  };

  const getGrowthLabel = (growth) => {
    switch (growth) {
      case "early":
        return "早熟";
      case "normal":
        return "普通";
      case "late":
        return "晩成";
      default:
        return "普通";
    }
  };

  return `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-lg w-full p-8 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)]">
        <!-- Background accents -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <button class="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl transition-colors" onclick="window.handleAction('CANCEL_SCOUT_HORSE')">✕</button>
        
        <div class="space-y-1">
          <span class="text-[10px] font-black tracking-widest text-amber-500 uppercase flex items-center gap-1.5 animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> NEW BREED PROSPECT
          </span>
          <h3 class="text-2xl font-black italic tracking-tighter uppercase text-white">新馬スカウト (Scout Horse)</h3>
        </div>

        <!-- Horse visual info -->
        <div class="border border-white/5 bg-slate-950 rounded-2xl p-5 flex items-center gap-5">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10 relative shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] flex-shrink-0">
            <div class="w-2/3 h-2/3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]" style="background-color: ${h.color}"></div>
          </div>
          <div class="flex-1 space-y-2 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full text-sm font-black tracking-wider border ${getRankBadgeColor(h.bloodlineRank)} shadow-[0_0_12px_rgba(245,158,11,0.15)] flex-shrink-0">
                RANK ${h.bloodlineRank}
              </span>
            </div>
            <!-- Interactive name edit & generator -->
            <div class="flex flex-col gap-1.5 w-full">
              <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest pl-0.5">馬名 (Name) - 自由に入力または自動生成</span>
              <div class="flex gap-1.5 w-full">
                <input type="text" value="${h.name}" 
                       oninput="window.updateScoutName(this.value);" 
                       class="flex-1 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl font-black text-white italic text-sm placeholder-slate-700 focus:outline-none focus:border-indigo-550 shadow-inner min-w-0" />
                <button onclick="window.generateRandomScoutName();" 
                        class="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-[10px] text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95 flex-shrink-0">
                  🎲 馬名生成
                </button>
              </div>
            </div>
            <div class="flex gap-3 text-sm font-bold text-slate-400 border-t border-white/5 pt-1.5">
              <span class="flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-slate-500"></span>2歳 ${h.gender === "colt" ? "牡" : "牝"}</span>
              <span class="flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-slate-500"></span>脚質: ${getStrategyLabel(h.strategy)}</span>
              <span class="flex items-center gap-1"><span class="w-1 h-1 rounded-full bg-slate-500"></span>成長: ${getGrowthLabel(h.growthType)}</span>
            </div>
          </div>
        </div>

        <!-- Physical stats showcase -->
        <div class="space-y-4">
          <div class="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-1">能力ポテンシャル (POTENTIAL STATS)</div>
          
          <div class="grid grid-cols-2 gap-x-6 gap-y-3.5">
            <!-- Speed -->
            <div class="space-y-1 bg-slate-800/20 p-2.5 rounded-xl border border-white/5">
              <div class="flex justify-between items-center text-[10px] font-black text-slate-400">
                <span>SPEED (スピード)</span>
                <span class="text-indigo-400 font-bold">${h.maxStats.speed}</span>
              </div>
              <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div class="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" style="width: ${(h.maxStats.speed / 1000) * 100}%"></div>
              </div>
            </div>

            <!-- Stamina -->
            <div class="space-y-1 bg-slate-800/20 p-2.5 rounded-xl border border-white/5">
              <div class="flex justify-between items-center text-[10px] font-black text-slate-400">
                <span>STAMINA (スタミナ)</span>
                <span class="text-blue-400 font-bold">${h.maxStats.stamina}</span>
              </div>
              <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div class="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" style="width: ${(h.maxStats.stamina / 1000) * 100}%"></div>
              </div>
            </div>

            <!-- Guts -->
            <div class="space-y-1 bg-slate-800/20 p-2.5 rounded-xl border border-white/5">
              <div class="flex justify-between items-center text-[10px] font-black text-slate-400">
                <span>GUTS (根性)</span>
                <span class="text-emerald-400">${h.maxStats.guts}</span>
              </div>
              <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div class="h-full bg-emerald-500" style="width: ${(h.maxStats.guts / 1000) * 100}%"></div>
              </div>
            </div>

            <!-- Temperament -->
            <div class="space-y-1 bg-slate-800/20 p-2.5 rounded-xl border border-white/5">
              <div class="flex justify-between items-center text-[10px] font-black text-slate-400">
                <span>TEMPERAMENT (気性)</span>
                <span class="text-amber-400">${h.maxStats.temperament}</span>
              </div>
              <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div class="h-full bg-amber-500" style="width: ${(h.maxStats.temperament / 1000) * 100}%"></div>
              </div>
            </div>

            <!-- Health & Luck combined line -->
            <div class="col-span-2 grid grid-cols-2 gap-4 text-[10px] font-bold text-slate-400">
              <div class="flex justify-between border-t border-white/5 pt-2">
                <span>健康 (HEALTH): <span class="text-slate-200">${h.maxStats.health}</span></span>
              </div>
              <div class="flex justify-between border-t border-white/5 pt-2">
                <span>運気 (LUCK): <span class="text-slate-200">${h.maxStats.luck}</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to action footer -->
        <div class="pt-4 border-t border-white/5 flex flex-col gap-3">
          <div class="flex justify-between items-center text-sm font-bold text-slate-400 px-1">
            <span>必要なスカウト費用:</span>
            <span class="text-lg font-black text-emerald-400 leading-none">¥2,000,000 (200万)</span>
          </div>

          <div class="flex gap-3 mt-1.5">
            ${Button({
              children: "キャンセル",
              onClick: () => window.handleAction("CANCEL_SCOUT_HORSE"),
              variant: "secondary",
              className: "flex-1 font-bold text-xs py-3.5",
            })}
            ${Button({
              children: canAfford
                ? "スカウトする (¥200万)"
                : "資金が足りません",
              onClick: () => window.handleAction("CONFIRM_SCOUT_HORSE"),
              variant: "primary",
              className: `flex-1 font-black text-xs py-3.5 ${!canAfford ? "opacity-55 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-purple-600 border-none"}`,
            })}
          </div>

          <div class="flex justify-center">
            ${Button({
              children: "別の新馬をスカウトし直す",
              onClick: () => window.handleAction("GENERATE_SCOUT_HORSE"),
              variant: "outline",
              className:
                "text-[10px] text-slate-400 border-white/5 hover:border-slate-700/50 py-1.5 px-4 rounded-full mt-1.5",
            })}
          </div>
        </div>
      </div>
    </div>
  `;
}

function RenderRetireToBreedingModal() {
  const { showRetireBreedingModal, retireBreedingHorseId, horses } = window.state;
  if (!showRetireBreedingModal || !retireBreedingHorseId) return "";

  const h = horses.find((item) => item.id === retireBreedingHorseId);
  if (!h) return "";

  const isFilly = h.gender === "filly";

  return `
    <div class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full p-8 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)]">
        <!-- Background accents -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button class="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl transition-colors" onclick="window.setState({ showRetireBreedingModal: false, retireBreedingHorseId: null })">✕</button>
        
        <div class="space-y-1">
          <span class="text-[10px] font-black tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> RETIRE TO BREEDING / 繁殖転向
          </span>
          <h3 class="text-2xl font-black italic tracking-tighter uppercase text-white">繁殖馬としての引退・転向</h3>
        </div>

        <div class="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3">
          <p class="text-[11px] font-bold text-slate-400">対象の競走馬</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10">
              <div class="w-6 h-6 rounded-full" style="background-color: ${h.color}"></div>
            </div>
            <div>
              <div class="text-lg font-black text-white italic tracking-tight uppercase">${h.name}</div>
              <div class="text-[10px] font-medium text-slate-500">${h.age}歳・${isFilly ? "牝" : "牡"} | RANK ${h.bloodlineRank || "C"} | 戦績 ${h.winCount || 0}勝 / ${h.totalRaces || 0}戦</div>
            </div>
          </div>
        </div>

        <div class="p-5 bg-gradient-to-r from-indigo-950/20 to-slate-950/50 rounded-2xl border border-indigo-500/20 space-y-2 text-center">
          <p class="text-[11px] text-indigo-300 font-bold leading-normal">
            この競走馬を現役から引退させ、あなたの牧場の『自家所有の繁殖馬』として登録します。<br/>
            引退後はレースや調教はできなくなりますが、配合の際に<strong>出走枠（馬房上限8頭）にカウントされることなく、配合料無料</strong>で何度でも配合に使用できるようになります！
          </p>
        </div>

        <p class="text-xs text-rose-450 leading-relaxed font-bold bg-slate-950/30 p-4 border border-rose-950/30 rounded-xl text-center">
          ⚠️ 注意: 引退して繁殖馬になった競走馬は二度と現役に戻せません。
        </p>

        <div class="flex gap-3">
          ${Button({
            children: "キャンセル",
            onClick: () =>
              window.setState({ showRetireBreedingModal: false, retireBreedingHorseId: null }),
            variant: "outline",
            className: "flex-1 rounded-xl",
          })}
          ${Button({
            children: isFilly ? "🌸 繁殖牝馬に転向する" : "⚡ 種牡馬に転向する",
            onClick: () => window.handleAction("CONFIRM_RETIRE_TO_BREEDING", h.id),
            variant: "primary",
            className:
              "flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 border-none hover:from-indigo-500 hover:to-indigo-450 font-bold",
          })}
        </div>
      </div>
    </div>
  `;
}

function RenderSellModal() {
  const { showSellModal, sellingHorseId, horses } = window.state;
  if (!showSellModal || !sellingHorseId) return "";

  const h = horses.find((item) => item.id === sellingHorseId);
  if (!h) return "";

  const sellPrice = getHorseSellValue(h);

  return `
    <div class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full p-8 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.15)]">
        <!-- Background accents -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button class="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl transition-colors" onclick="window.setState({ showSellModal: false, sellingHorseId: null })">✕</button>
        
        <div class="space-y-1">
          <span class="text-[10px] font-black tracking-widest text-rose-500 uppercase flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> RETIREMENT / SALE
          </span>
          <h3 class="text-2xl font-black italic tracking-tighter uppercase text-white">競走馬の引退・売却</h3>
        </div>

        <div class="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3">
          <p class="text-[11px] font-bold text-slate-400">対象の競走馬</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10">
              <div class="w-6 h-6 rounded-full" style="background-color: ${h.color}"></div>
            </div>
            <div>
              <div class="text-lg font-black text-white italic tracking-tight uppercase">${h.name}</div>
              <div class="text-[10px] font-medium text-slate-500">${h.age}歳・${h.gender === "colt" ? "牡" : "牝"} | RANK ${h.bloodlineRank || "C"} | 戦績 ${h.winCount || 0}勝 / ${h.totalRaces || 0}戦</div>
            </div>
          </div>
        </div>

        <div class="p-5 bg-gradient-to-r from-rose-950/20 to-slate-950/50 rounded-2xl border border-rose-500/20 text-center space-y-2">
          <p class="text-sm text-slate-400 font-bold">受け取る引退保証・売却資金</p>
          <p class="text-3xl font-black italic tracking-tighter text-rose-400 font-mono">${formatMoney(sellPrice)}</p>
        </div>

        <p class="text-sm text-slate-400 leading-relaxed font-bold bg-slate-950/30 p-4 border border-slate-850 rounded-xl text-center">
          ⚠️ 注意: 引退した馬は二度と元には戻せません。<br/>配合やレースへの出走もできなくなります。
        </p>

        <div class="flex gap-3">
          ${Button({
            children: "キャンセル",
            onClick: () =>
              window.setState({ showSellModal: false, sellingHorseId: null }),
            variant: "outline",
            className: "flex-1 rounded-xl",
          })}
          ${Button({
            children: "引退・売却に同意する",
            onClick: () => window.handleAction("CONFIRM_SELL_HORSE", h.id),
            variant: "primary",
            className:
              "flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 border-none hover:from-rose-500 hover:to-rose-450 font-bold",
          })}
        </div>
      </div>
    </div>
  `;
}

function RenderTrainingModal() {
  const {
    showTrainingModal,
    trainingHorseId,
    horses,
    starShards,
    trainingStage,
    trainingType,
    trainingResult,
    gaugePosition,
  } = window.state;
  if (!showTrainingModal || !trainingHorseId) return "";

  const h = horses.find((item) => item.id === trainingHorseId);
  if (!h) return "";

  const rankPotentials = {
    S: 1000,
    A: 850,
    B: 730,
    C: 600,
    D: 450,
  };

  let modalContent = "";

  if (trainingStage === "select") {
    const isCooldown = h.training?.cooldown > 0;
    const canTrain = starShards >= 3 && !isCooldown;

    modalContent = `
      <div class="space-y-5 animate-fade-in">
        <p class="text-[11px] text-slate-405 leading-relaxed font-bold bg-slate-950 p-4 border border-white/5 rounded-2xl">
          🌌 「星片の恵み」を競走馬に宿す育成特訓です。<br/>
          特訓を受けると、一定期間ステータスが<span class="text-amber-400 font-extrabold">大幅に強化</span>され、レースで本領を発揮します！<br/>
          <span class="text-indigo-400">※特訓は4週間持続し、終了後に4週間の回復冷却（リカバー）期間が発生します。</span>
        </p>

        <!-- Current Horse Info -->
        <div class="p-3 bg-slate-950/60 rounded-2xl border border-white/5 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 border border-white/10 flex-shrink-0">
            <div class="w-5 h-5 rounded-full" style="background-color: ${h.color}"></div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm text-slate-500 font-bold uppercase">特訓対象</div>
            <div class="text-md font-black italic tracking-tight uppercase text-white truncate">${h.name}</div>
          </div>
          ${
            isCooldown
              ? `
            <div class="text-right px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-450 rounded-lg text-sm font-bold shrink-0">
              回復待ち: ${h.training.cooldown}週
            </div>
          `
              : `
            <div class="text-right px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm font-bold shrink-0">
              特訓可能
            </div>
          `
          }
        </div>

        <!-- Stat Potential Progress Bars -->
        <div class="space-y-3.5 bg-slate-950/80 p-4 rounded-2xl border border-white/5 font-sans">
          <div class="flex items-center justify-between">
            <span class="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">🧬 ランク別潜在能力達成度 (${h.bloodlineRank || "C"}級限界: ${rankPotentials[h.bloodlineRank || "C"] || 600} Pts)</span>
            <span class="px-2 py-0.5 rounded text-[8px] font-black tracking-widest bg-indigo-505/10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">POTENTIAL PROGRESS</span>
          </div>
          
          <!-- Speed bar -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center text-sm">
              <div class="flex items-center gap-1.5 font-bold text-slate-300">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-indigo-400"></i>
                <span>スピード (Speed)</span>
              </div>
              <div class="font-mono text-[10px] space-x-1">
                <span class="text-white font-black">${h.stats.speed}</span>
                <span class="text-slate-600">/</span>
                <span class="text-indigo-400 font-bold">${h.maxStats?.speed || 500}</span>
                <span class="text-slate-500 text-[9px]">(Max: ${rankPotentials[h.bloodlineRank || "C"] || 600})</span>
              </div>
            </div>
            <div class="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div class="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500" style="width: ${Math.min(100, (h.stats.speed / (rankPotentials[h.bloodlineRank || "C"] || 600)) * 100)}%"></div>
              ${
                h.maxStats?.speed
                  ? `
                <div class="absolute top-0 bottom-0 w-[2px] bg-amber-400" style="left: ${(h.maxStats.speed / (rankPotentials[h.bloodlineRank || "C"] || 600)) * 100}%" title="個人限界: ${h.maxStats.speed}"></div>
              `
                  : ""
              }
            </div>
          </div>

          <!-- Stamina bar -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center text-sm">
              <div class="flex items-center gap-1.5 font-bold text-slate-300">
                <i data-lucide="activity" class="w-3.5 h-3.5 text-sky-400"></i>
                <span>スタミナ (Stamina)</span>
              </div>
              <div class="font-mono text-[10px] space-x-1">
                <span class="text-white font-black">${h.stats.stamina}</span>
                <span class="text-slate-600">/</span>
                <span class="text-sky-450 font-bold">${h.maxStats?.stamina || 500}</span>
                <span class="text-slate-500 text-[9px]">(Max: ${rankPotentials[h.bloodlineRank || "C"] || 600})</span>
              </div>
            </div>
            <div class="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div class="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-500" style="width: ${Math.min(100, (h.stats.stamina / (rankPotentials[h.bloodlineRank || "C"] || 600)) * 100)}%"></div>
              ${
                h.maxStats?.stamina
                  ? `
                <div class="absolute top-0 bottom-0 w-[2px] bg-amber-400" style="left: ${(h.maxStats.stamina / (rankPotentials[h.bloodlineRank || "C"] || 600)) * 100}%" title="個人限界: ${h.maxStats.stamina}"></div>
              `
                  : ""
              }
            </div>
          </div>
          
          <div class="flex justify-between items-center text-[9px] text-slate-500 italic pt-1">
            <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 現在のステータス</span>
            <span class="flex items-center gap-1"><span class="w-1.5 h-[5px] bg-amber-400"></span> 自家馬の個体限界</span>
            <span>ランク上限 (100%)</span>
          </div>
        </div>

        <!-- Resources Block -->
        <div class="p-4 rounded-2xl border border-sky-500/20 bg-slate-950/40 text-center space-y-1">
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">現在の星片</p>
          <div class="flex items-center justify-center gap-1.5">
            <i data-lucide="star" class="w-5 h-5 text-amber-400"></i>
            <span class="text-2xl font-black italic tracking-tighter text-amber-400 font-mono">${starShards || 0}</span>
            <span class="text-slate-400 text-sm">個所持</span>
          </div>
          <p class="text-[9px] text-slate-500">※特訓を1回行うには、星片が <span class="text-white font-bold">3個</span> 必要です</p>
        </div>

        <!-- Training Selections -->
        <div class="space-y-3">
          <p class="text-sm text-slate-400 font-bold uppercase tracking-widest">彗星特訓メニューを選択 (星片消費)</p>
          <div class="grid grid-cols-2 gap-3">
            <button class="relative group p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border ${!isCooldown ? "border-indigo-500/20 hover:border-indigo-500/50 hover:bg-slate-950/80 cursor-pointer" : "border-slate-850 opacity-40"} transition-all text-left outline-none"
                    ${!isCooldown ? "onclick=\"window.setState({ trainingType: 'speed' })\"" : "disabled"} id="train-speed-opt">
              <div class="flex justify-between items-start">
                <div class="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <i data-lucide="zap" class="w-5 h-5"></i>
                </div>
                <input type="radio" name="train-type" value="speed" class="accent-indigo-500 pointer-events-none" ${trainingType === "speed" ? "checked" : ""} />
              </div>
              <div class="mt-4">
                <h4 class="text-sm font-black text-white">スピード猛特訓</h4>
                <p class="text-[9px] text-slate-400 mt-0.5">一定期間、走破速度を最大限に引き上げる彗星波動を付与します</p>
              </div>
            </button>

            <button class="relative group p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900 border ${!isCooldown ? "border-sky-500/20 hover:border-sky-500/50 hover:bg-slate-950/80 cursor-pointer" : "border-slate-850 opacity-40"} transition-all text-left outline-none"
                    ${!isCooldown ? "onclick=\"window.setState({ trainingType: 'stamina' })\"" : "disabled"} id="train-stamina-opt">
              <div class="flex justify-between items-start">
                <div class="p-2 bg-sky-500/10 rounded-xl text-sky-450 group-hover:bg-sky-500/20 transition-colors">
                  <i data-lucide="activity" class="w-5 h-5"></i>
                </div>
                <input type="radio" name="train-type" value="stamina" class="accent-sky-500 pointer-events-none" ${trainingType === "stamina" ? "checked" : ""} />
              </div>
              <div class="mt-4">
                <h4 class="text-sm font-black text-white">スタミナ特訓</h4>
                <p class="text-[9px] text-slate-400 mt-0.5">持久力・後半粘り強さを強化する天恵スタミナシールドを付与します</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Normal Training Options -->
        <div class="space-y-3 pt-2 border-t border-white/5">
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-400 font-bold uppercase tracking-widest">普通調教（恒久ステータス増量）</p>
            <span class="px-2 py-0.5 rounded text-[8px] font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">資金消費のみ</span>
          </div>
          <p class="text-[10px] text-slate-500 leading-normal">
            資金 <span class="text-white font-bold">30万円</span> を消費して、愛馬の能力を恒久的に <span class="text-emerald-450 font-bold">+10</span> 底上げします。（星片を消費しません）<br/>
            ※自家馬の「個体限界」に達するまで育成が可能です。
          </p>
          <div class="grid grid-cols-2 gap-3">
            <button class="relative group p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-slate-950/80 cursor-pointer transition-all text-left outline-none"
                    onclick="window.handleAction('PERFORM_NORMAL_TRAINING_SPEED', '${h.id}')" id="train-normal-speed">
              <div class="flex justify-between items-start">
                <div class="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <i data-lucide="zap" class="w-4 h-4"></i>
                </div>
                <div class="text-right">
                  <span class="text-[8.5px] font-mono block text-emerald-400 font-bold">費用: 30万</span>
                  <span class="text-[8.5px] font-mono block text-slate-500">上限: ${h.maxStats?.speed || 500}</span>
                </div>
              </div>
              <div class="mt-2 text-sm font-black text-white flex items-center gap-1">
                並・スピード調教 <span class="text-[10px] text-emerald-450 font-black">+10</span>
              </div>
            </button>

            <button class="relative group p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-slate-950/80 cursor-pointer transition-all text-left outline-none"
                    onclick="window.handleAction('PERFORM_NORMAL_TRAINING_STAMINA', '${h.id}')" id="train-normal-stamina">
              <div class="flex justify-between items-start">
                <div class="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <i data-lucide="activity" class="w-4 h-4"></i>
                </div>
                <div class="text-right">
                  <span class="text-[8.5px] font-mono block text-emerald-400 font-bold">費用: 30万</span>
                  <span class="text-[8.5px] font-mono block text-slate-500">上限: ${h.maxStats?.stamina || 500}</span>
                </div>
              </div>
              <div class="mt-2 text-sm font-black text-white flex items-center gap-1">
                並・スタミナ調教 <span class="text-[10px] text-emerald-450 font-black">+10</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Action triggers -->
        <div class="space-y-2">
          ${
            isCooldown
              ? `
            <div class="text-center text-sm text-rose-450 font-bold bg-rose-500/10 py-2.5 rounded-xl border border-rose-500/20">
              🚨 冷却回復中のため特訓できません（リカバー完了までお待ちください）
            </div>
          `
              : starShards < 3
                ? `
            <div class="text-center text-sm text-amber-500 font-bold bg-amber-500/10 py-2.5 rounded-xl border border-amber-500/20">
              ⚠️ 星片が足りません（彗星特訓には星片3個が必要です）
            </div>
          `
                : !trainingType
                  ? `
            <div class="text-center text-sm text-indigo-400 font-bold bg-indigo-500/10 py-2.5 rounded-xl border border-indigo-500/20">
              👉 特訓メニューを上から選択してください
            </div>
          `
                  : `
            <p class="text-[9px] text-slate-500 text-center">開始すると星片を3個消費し、タイミングゲーム画面へ移行します</p>
          `
          }

          <div class="flex gap-3 pt-1">
            ${Button({
              children: "閉じる",
              onClick: () => window.handleAction("CLOSE_TRAINING_MODAL"),
              variant: "outline",
              className: "flex-1 rounded-xl",
            })}
            ${Button({
              children: "特訓ミニゲーム開始！",
              onClick: () =>
                window.handleAction("START_TRAINING_GAME", trainingType),
              variant: "primary",
              className:
                "flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 border-none hover:from-indigo-600 hover:to-sky-600 font-bold shadow-[0_4px_15px_rgba(99,102,241,0.25)]",
              disabled: !canTrain || !trainingType,
            })}
          </div>
        </div>
      </div>
    `;
  } else if (trainingStage === "game") {
    modalContent = `
      <div class="space-y-6 animate-fade-in text-center">
        <div>
          <span class="text-[9px] font-black tracking-widest text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 rounded-full px-3 py-1 uppercase">
            ⚡ COSMIC TIMING CHALLENGE
          </span>
          <h4 class="text-lg font-black text-white mt-1.5">彗星波動のチャージ！</h4>
          <p class="text-sm text-slate-400">ポインターが中心のゴールド（50%付近）の時にタップしてください！</p>
        </div>

        <!-- The Gauge bar -->
        <div class="py-4 space-y-4">
          <div class="relative h-6 bg-slate-950 rounded-full border border-white/10 p-[2px] overflow-hidden flex items-center">
            
            <!-- Broad GREAT Area [35% - 65%] -->
            <div class="absolute top-[2px] bottom-[2px] left-[35%] w-[30%] bg-emerald-500/25 rounded-md border-x border-emerald-500/30"></div>
            
            <!-- Center SWEET PERFECT Area [45% - 55%] -->
            <div class="absolute top-[2px] bottom-[2px] left-[44%] w-[12%] bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse rounded-md border border-amber-300"></div>

            <!-- Absolute Center Marker -->
            <div class="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-white opacity-80 z-20"></div>

            <!-- Pointer cursor -->
            <div id="training-gauge-pointer" class="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-indigo-500 shadow-[0_0_15px_#ffffff] rounded-md z-30 transition-all pointer-events-none" style="left: ${gaugePosition}%"></div>
          </div>

          <!-- Color Legends -->
          <div class="flex justify-center items-center gap-4 text-[10px] text-slate-400 font-bold">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Perfect! (+100)</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Great! (+75)</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded bg-slate-800"></span> Good (+50)</span>
          </div>
        </div>

        <div class="pt-2 flex flex-col gap-2">
          ${Button({
            children: "🪐 波動を宿す！（タップ！）",
            onClick: () => window.handleAction("TRIGGER_TRAINING_HIT"),
            variant: "primary",
            className:
              "w-full py-4 text-md bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-none rounded-2xl font-black shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse",
          })}
          ${Button({
            children: "キャンセルして特訓をやめる (Cancel)",
            onClick: () => window.handleAction("CLOSE_TRAINING_MODAL"),
            variant: "outline",
            className:
              "w-full py-2.5 rounded-xl text-xs text-slate-400 border-slate-700 hover:bg-slate-850 hover:text-white",
          })}
        </div>
      </div>
    `;
  } else if (trainingStage === "result" && trainingResult) {
    const { rating, amount, color, title, desc } = trainingResult;
    modalContent = `
      <div class="space-y-6 animate-fade-in text-center pb-2">
        <div class="w-20 h-20 rounded-full bg-gradient-to-b from-indigo-900 to-slate-950 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <i data-lucide="sparkles" class="w-10 h-10 text-amber-400"></i>
        </div>

        <div class="space-y-1.5">
          <span class="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase">特訓診断</span>
          <h4 class="text-2xl font-black italic tracking-tighter ${color}">${title}</h4>
          <p class="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed pt-1.5">${desc}</p>
        </div>

        <!-- Stat Improvement Display -->
        <div class="p-5 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950 rounded-3xl border border-white/5 space-y-3">
          <div class="flex justify-between items-center px-4">
            <span class="text-sm text-slate-500 font-bold">特訓競走馬</span>
            <span class="text-sm font-black italic tracking-tight uppercase text-white">${h.name}</span>
          </div>
          <div class="h-[1px] bg-white/5"></div>
          <div class="flex justify-between items-center px-4">
            <span class="text-sm text-slate-500 font-bold">獲得特訓効果</span>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-sm text-slate-300">${trainingType === "speed" ? "スピード" : "スタミナ"}</span>
              <span class="font-black text-lg text-emerald-400 font-mono">+${amount} (4週間)</span>
            </div>
          </div>
          <div class="h-[1px] bg-white/5"></div>
          <div class="flex justify-between items-center px-4">
            <span class="text-sm text-slate-500 font-bold">回復リカバー時間</span>
            <span class="font-bold text-sm text-rose-450 font-mono">特訓終了後 4週間</span>
          </div>
        </div>

        <div class="pt-2">
          ${Button({
            children: "育成特訓を終了する",
            onClick: () => window.handleAction("CLOSE_TRAINING_MODAL"),
            variant: "primary",
            className:
              "w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 border-none font-bold",
          })}
        </div>
      </div>
    `;
  }

  return `
    <div class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="training-modal-backdrop">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-[0_0_50px_rgba(99,102,241,0.15)] scrollbar-thin">
        <!-- Background accents -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button class="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl transition-colors" onclick="window.handleAction('CLOSE_TRAINING_MODAL')">✕</button>
        
        <div class="space-y-1">
          <span class="text-[10px] font-black tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> STELLAR TRAINING
          </span>
          <h3 class="text-2xl font-black italic tracking-tighter uppercase text-white">星霊・育成猛特訓</h3>
        </div>

        ${modalContent}
      </div>
    </div>
  `;
}

// --- Render Logic ---
function RenderGameDialogModal() {
  const d = window.state.dialog;
  if (!d) return "";

  const isConfirm = d.type === "confirm";

  return `
    <div class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="game-dialog-modal" style="z-index: 10000;">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full p-8 space-y-6 relative overflow-hidden shadow-[0_0_70px_rgba(244,63,94,0.25)]">
        <!-- Background radial glow -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="space-y-1 relative">
          <span class="text-[10px] font-black tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span> SYSTEM MESSAGE
          </span>
          <h3 class="text-2xl font-black italic tracking-tighter uppercase text-white">${d.title || "STELLAR BREEDER"}</h3>
        </div>

        <p class="text-slate-200 text-sm font-semibold leading-relaxed whitespace-pre-wrap pl-1 relative">${d.message}</p>

        <div class="flex gap-4 pt-2 relative">
          ${
            isConfirm
              ? `
            <button class="flex-1 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-705 text-slate-300 font-bold text-sm transition-colors uppercase tracking-wider cursor-pointer active:scale-95" 
                    onclick="if (window.state.dialog && window.state.dialog.onCancel) window.state.dialog.onCancel();">
              キャンセル (Cancel)
            </button>
            <button class="flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-sm shadow-lg shadow-pink-500/20 transition-all uppercase tracking-widest cursor-pointer active:scale-95" 
                    onclick="if (window.state.dialog && window.state.dialog.onConfirm) window.state.dialog.onConfirm();">
              確認する (Confirm)
            </button>
          `
              : `
            <button class="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-505 hover:to-indigo-605 text-white font-black text-sm shadow-lg shadow-indigo-500/20 transition-all uppercase tracking-widest cursor-pointer active:scale-95" 
                    onclick="if (window.state.dialog && window.state.dialog.onConfirm) window.state.dialog.onConfirm();">
              OK 閉じる
            </button>
          `
          }
        </div>
      </div>
    </div>
  `;
}

function RenderRenameModal() {
  const { showRenameModal, renameTempName, horses, renameHorseId } =
    window.state;
  if (!showRenameModal) return "";

  const h = horses.find((item) => item.id === renameHorseId);
  if (!h) return "";

  return `
    <div class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" style="z-index: 9999;">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full p-8 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.25)]">
        <!-- Background accents -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button class="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl transition-colors" onclick="window.setState({ showRenameModal: false })">✕</button>
        
        <div class="space-y-1">
          <span class="text-[10px] font-black tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> NAME CHANGE
          </span>
          <h3 class="text-2xl font-black italic tracking-tighter uppercase text-white">競走馬の馬名変更 (Rename)</h3>
        </div>

        <div class="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-850 border border-white/10">
              <div class="w-6 h-6 rounded-full" style="background-color: ${h.color}"></div>
            </div>
            <div>
              <div class="text-[9px] font-bold text-slate-500 uppercase leading-none">現在の名称 (CURRENT NAME)</div>
              <div class="text-lg font-black text-white italic tracking-tight uppercase mt-1">${h.name}</div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black tracking-widest text-slate-400 uppercase">新しい名称を入力してください</label>
          <div class="flex gap-2">
            <input type="text" value="${renameTempName}" id="rename-horse-input" 
                   oninput="window.state.renameTempName = this.value;"
                   class="flex-1 bg-slate-950 border border-white/10 px-4 py-3 rounded-2xl font-black text-white italic text-sm placeholder-slate-700 focus:outline-none focus:border-indigo-505 shadow-inner" />
            <button onclick="window.handleAction('GENERATE_RENAME_NAME')" 
                    class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-black text-[11px] text-slate-950 transition-all cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95 flex items-center gap-1">
              🎲 自動生成
            </button>
          </div>
          <p class="text-[9px] text-slate-500 leading-relaxed pl-1">
            ※ ゲームに登場する由緒正しい prefix + suffix から、ランダムに美しい馬名を瞬時に組み合わせ・生成することが可能です。
          </p>
        </div>

        <div class="flex gap-3 pt-2">
          <button class="flex-1 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-755 text-slate-300 font-bold text-sm transition-colors uppercase tracking-wider cursor-pointer active:scale-95" 
                  onclick="window.setState({ showRenameModal: false })">
            キャンセル
          </button>
          <button class="flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 transition-all uppercase tracking-widest cursor-pointer active:scale-95" 
                  onclick="window.handleAction('CONFIRM_RENAME_HORSE')">
            登録・変更する
          </button>
        </div>
      </div>
    </div>
  `;
}

function render() {
  const app = document.getElementById("app");
  if (!app) return;

  let content = "";
  switch (window.state.screen) {
    case "title":
      content = SceneTitle();
      break;
    case "stable":
      content = SceneStable();
      break;
    case "breeding_mare":
      content = SceneBreedingMare();
      break;
    case "breeding_stallion":
      content = SceneBreedingStallion();
      break;
    case "breeding_confirm":
      content = SceneBreedingConfirm();
      break;
    case "race_select":
      content = SceneRaceSelect();
      break;
    case "race_sim":
      content = SceneRaceSim();
      break;
    case "race_result":
      content = SceneRaceResult();
      break;
    case "hall_of_fame":
      content = window.SceneHallOfFame ? window.SceneHallOfFame() : "";
      break;
    default:
      content = SceneTitle();
  }

  app.innerHTML =
    content +
    RenderSaveModal() +
    RenderScoutModal() +
    RenderSellModal() +
    RenderRetireToBreedingModal() +
    RenderTrainingModal() +
    RenderGameDialogModal() +
    RenderRenameModal() +
    '<div id="performance-chart-modal-root"></div>';

  createIcons({
    icons: {
      Trophy,
      Calendar,
      Coins,
      Dna,
      Zap,
      Activity,
      ChevronRight,
      ChevronLeft,
      Play,
      Heart,
      TrendingUp,
      History,
      Star,
      Home,
      Sparkles,
      Flame,
      Wind,
      MessageSquare,
      Send,
    },
  });

  if (window.state.showPerformanceModal && window.state.viewingHorseId) {
    setTimeout(() => {
      mountPerformanceChart(
        window.state.viewingHorseId,
        "performance-chart-modal-root",
        () => window.handleAction("CLOSE_PERFORMANCE_MODAL"),
      );
    }, 10);
  }

  if (window.state.screen === "race_sim") {
    setTimeout(() => {
      mountRaceSimulation("race-simulation-root");
    }, 10);
  }
}

// Start
document.addEventListener("DOMContentLoaded", () => {
  loadGame();
  render();
});
