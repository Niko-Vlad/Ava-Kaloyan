// storage.js - localStorage utilities for Kayo & Ava's game progress

const STORAGE_KEY = 'bulgarianAdventure';

// Default player data structure
const createDefaultPlayerData = () => ({
  gamesPlayed: 0,
  gamesWon: 0,
  totalCorrect: 0,
  totalWrong: 0,
  currentStreak: 0,
  bestStreak: 0,
  wordsCorrect: {}, // { "Куче": 3, "Котка": 2, ... } - count per word
  achievements: [], // ["first_steps", "on_fire", ...]
  categoryStats: {}, // { "Животни": { correct: 5, wrong: 1 }, ... }
  lastPlayed: null,
  totalPlayTime: 0, // in seconds
  perfectGames: 0, // games won with no wrong answers
  flashcardsSeen: 0
});

// Get all game data
export const getGameData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return createDefaultGameData();
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading game data:', e);
    return createDefaultGameData();
  }
};

// Create default game data structure
const createDefaultGameData = () => ({
  Kayo: createDefaultPlayerData(),
  Ava: createDefaultPlayerData(),
  lastStarter: 'Кайо',
  totalGamesPlayed: 0
});

// Save all game data
export const saveGameData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving game data:', e);
  }
};

// Get player data by name
export const getPlayerData = (playerName) => {
  const data = getGameData();
  const key = playerName === 'Кайо' ? 'Kayo' : 'Ava';
  return data[key] || createDefaultPlayerData();
};

// Update player data
export const updatePlayerData = (playerName, updates) => {
  const data = getGameData();
  const key = playerName === 'Кайо' ? 'Kayo' : 'Ava';
  data[key] = { ...data[key], ...updates };
  saveGameData(data);
  return data[key];
};

// Record a correct answer
export const recordCorrectAnswer = (playerName, word, category) => {
  const data = getGameData();
  const key = playerName === 'Кайо' ? 'Kayo' : 'Ava';
  const player = data[key];
  
  // Update total correct
  player.totalCorrect = (player.totalCorrect || 0) + 1;
  
  // Update streak
  player.currentStreak = (player.currentStreak || 0) + 1;
  if (player.currentStreak > (player.bestStreak || 0)) {
    player.bestStreak = player.currentStreak;
  }
  
  // Update word count
  if (!player.wordsCorrect) player.wordsCorrect = {};
  player.wordsCorrect[word] = (player.wordsCorrect[word] || 0) + 1;
  
  // Update category stats
  if (!player.categoryStats) player.categoryStats = {};
  if (!player.categoryStats[category]) {
    player.categoryStats[category] = { correct: 0, wrong: 0 };
  }
  player.categoryStats[category].correct += 1;
  
  player.lastPlayed = new Date().toISOString();
  
  saveGameData(data);
  return player;
};

// Record a wrong answer
export const recordWrongAnswer = (playerName, word, category) => {
  const data = getGameData();
  const key = playerName === 'Кайо' ? 'Kayo' : 'Ava';
  const player = data[key];
  
  // Update total wrong
  player.totalWrong = (player.totalWrong || 0) + 1;
  
  // Reset streak
  player.currentStreak = 0;
  
  // Update category stats
  if (!player.categoryStats) player.categoryStats = {};
  if (!player.categoryStats[category]) {
    player.categoryStats[category] = { correct: 0, wrong: 0 };
  }
  player.categoryStats[category].wrong += 1;
  
  player.lastPlayed = new Date().toISOString();
  
  saveGameData(data);
  return player;
};

// Record game completion
export const recordGameEnd = (playerName, won, hadPerfectGame = false) => {
  const data = getGameData();
  const key = playerName === 'Кайо' ? 'Kayo' : 'Ava';
  const player = data[key];
  
  player.gamesPlayed = (player.gamesPlayed || 0) + 1;
  
  if (won) {
    player.gamesWon = (player.gamesWon || 0) + 1;
  }
  
  if (hadPerfectGame) {
    player.perfectGames = (player.perfectGames || 0) + 1;
  }
  
  data.totalGamesPlayed = (data.totalGamesPlayed || 0) + 1;
  player.lastPlayed = new Date().toISOString();
  
  saveGameData(data);
  return player;
};

// Record flashcard viewed
export const recordFlashcardSeen = (playerName) => {
  const data = getGameData();
  const key = playerName === 'Кайо' ? 'Kayo' : 'Ava';
  data[key].flashcardsSeen = (data[key].flashcardsSeen || 0) + 1;
  saveGameData(data);
};

// Get words that have been answered correctly 3+ times (mastered)
export const getMasteredWords = (playerName) => {
  const player = getPlayerData(playerName);
  const mastered = [];
  for (const [word, count] of Object.entries(player.wordsCorrect || {})) {
    if (count >= 3) {
      mastered.push(word);
    }
  }
  return mastered;
};

// Get head-to-head record
export const getHeadToHead = () => {
  const data = getGameData();
  return {
    kayoWins: data.Kayo?.gamesWon || 0,
    avaWins: data.Ava?.gamesWon || 0
  };
};

// Unlock achievement for player
export const unlockAchievement = (playerName, achievementId) => {
  const data = getGameData();
  const key = playerName === 'Кайо' ? 'Kayo' : 'Ava';
  
  if (!data[key].achievements) {
    data[key].achievements = [];
  }
  
  if (!data[key].achievements.includes(achievementId)) {
    data[key].achievements.push(achievementId);
    saveGameData(data);
    return true; // Achievement was newly unlocked
  }
  
  return false; // Already had this achievement
};

// Check if player has achievement
export const hasAchievement = (playerName, achievementId) => {
  const player = getPlayerData(playerName);
  return (player.achievements || []).includes(achievementId);
};

// Get all achievements for player
export const getPlayerAchievements = (playerName) => {
  const player = getPlayerData(playerName);
  return player.achievements || [];
};

// Reset all progress (for parent dashboard)
export const resetAllProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Reset progress for specific player
export const resetPlayerProgress = (playerName) => {
  const data = getGameData();
  const key = playerName === 'Кайо' ? 'Kayo' : 'Ava';
  data[key] = createDefaultPlayerData();
  saveGameData(data);
};

// Get category performance (for parent dashboard)
export const getCategoryPerformance = (playerName) => {
  const player = getPlayerData(playerName);
  const stats = player.categoryStats || {};
  
  const performance = [];
  for (const [category, data] of Object.entries(stats)) {
    const total = data.correct + data.wrong;
    const accuracy = total > 0 ? Math.round((data.correct / total) * 100) : 0;
    performance.push({
      category,
      correct: data.correct,
      wrong: data.wrong,
      total,
      accuracy
    });
  }
  
  // Sort by total attempts
  return performance.sort((a, b) => b.total - a.total);
};

// Get overall stats for a player
export const getPlayerStats = (playerName) => {
  const player = getPlayerData(playerName);
  const totalAnswers = (player.totalCorrect || 0) + (player.totalWrong || 0);
  const accuracy = totalAnswers > 0 
    ? Math.round((player.totalCorrect / totalAnswers) * 100) 
    : 0;
  
  const masteredWords = getMasteredWords(playerName);
  
  return {
    gamesPlayed: player.gamesPlayed || 0,
    gamesWon: player.gamesWon || 0,
    totalCorrect: player.totalCorrect || 0,
    totalWrong: player.totalWrong || 0,
    accuracy,
    currentStreak: player.currentStreak || 0,
    bestStreak: player.bestStreak || 0,
    masteredWordsCount: masteredWords.length,
    masteredWords,
    perfectGames: player.perfectGames || 0,
    flashcardsSeen: player.flashcardsSeen || 0,
    achievementsCount: (player.achievements || []).length
  };
};
