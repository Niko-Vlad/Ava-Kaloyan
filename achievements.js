// achievements.js - Achievement system for Sasha & Lou's game
// Browser-compatible version (uses window.Storage and assigns to window object)

// Achievement definitions
const ACHIEVEMENTS = {
  first_steps: {
    id: 'first_steps',
    emoji: '🌟',
    name: 'Първи стъпки',
    description: 'Отговори правилно на 10 въпроса',
    requirement: (stats) => stats.totalCorrect >= 10
  },
  on_fire: {
    id: 'on_fire',
    emoji: '🔥',
    name: 'На вълна',
    description: 'Направи серия от 5 верни отговора',
    requirement: (stats) => stats.bestStreak >= 5
  },
  lightning: {
    id: 'lightning',
    emoji: '⚡',
    name: 'Мълния',
    description: 'Направи серия от 10 верни отговора',
    requirement: (stats) => stats.bestStreak >= 10
  },
  champion: {
    id: 'champion',
    emoji: '🏆',
    name: 'Шампион',
    description: 'Спечели 5 игри',
    requirement: (stats) => stats.gamesWon >= 5
  },
  royalty: {
    id: 'royalty',
    emoji: '👑',
    name: 'Крал/Кралица', // Will be personalized in display
    description: 'Спечели 10 игри',
    requirement: (stats) => stats.gamesWon >= 10
  },
  animal_expert: {
    id: 'animal_expert',
    emoji: '🦁',
    name: 'Познавач на животни',
    description: 'Отговори правилно на 20 въпроса за животни',
    requirement: (stats, playerData) => {
      const animalCategories = ['Диви', 'Ферма', 'Морски', 'Птици', 'Насекоми', 'Влечуги', 'Животни'];
      let total = 0;
      for (const cat of animalCategories) {
        total += playerData.categoryStats?.[cat]?.correct || 0;
      }
      return total >= 20;
    }
  },
  foodie: {
    id: 'foodie',
    emoji: '🍎',
    name: 'Гурме',
    description: 'Отговори правилно на 20 въпроса за храна',
    requirement: (stats, playerData) => {
      const foodCategories = ['Храна', 'Плодове', 'Зеленчуци', 'Десерт', 'Напитки', 'Закуска', 'Снак'];
      let total = 0;
      for (const cat of foodCategories) {
        total += playerData.categoryStats?.[cat]?.correct || 0;
      }
      return total >= 20;
    }
  },
  family_expert: {
    id: 'family_expert',
    emoji: '👨‍👩‍👧',
    name: 'Семеен експерт',
    description: 'Отговори правилно на 15 въпроса за семейството',
    requirement: (stats, playerData) => {
      const familyCorrect = playerData.categoryStats?.['Семейство']?.correct || 0;
      return familyCorrect >= 15;
    }
  },
  color_master: {
    id: 'color_master',
    emoji: '🌈',
    name: 'Цветен майстор',
    description: 'Отговори правилно на 15 въпроса за цветове',
    requirement: (stats, playerData) => {
      const colorCorrect = playerData.categoryStats?.['Цветове']?.correct || 0;
      return colorCorrect >= 15;
    }
  },
  perfect_game: {
    id: 'perfect_game',
    emoji: '🎯',
    name: 'Перфектна игра',
    description: 'Спечели игра без нито една грешка',
    requirement: (stats) => stats.perfectGames >= 1
  },
  bookworm: {
    id: 'bookworm',
    emoji: '📚',
    name: 'Книжен червей',
    description: 'Разгледай 100 карти в упражнение',
    requirement: (stats) => stats.flashcardsSeen >= 100
  },
  marathon: {
    id: 'marathon',
    emoji: '🎮',
    name: 'Маратонец',
    description: 'Изиграй 20 игри',
    requirement: (stats) => stats.gamesPlayed >= 20
  }
};

// Get list of all achievement IDs
const getAllAchievementIds = () => Object.keys(ACHIEVEMENTS);

// Get achievement by ID
const getAchievement = (id) => ACHIEVEMENTS[id];

// Check all achievements for a player and unlock any new ones
const checkAndUnlockAchievements = (playerName) => {
  const stats = window.Storage.getPlayerStats(playerName);
  const playerData = window.Storage.getPlayerData(playerName);
  const newlyUnlocked = [];
  
  for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
    // Skip if already has this achievement
    if (window.Storage.hasAchievement(playerName, id)) {
      continue;
    }
    
    // Check if requirement is met
    if (achievement.requirement(stats, playerData)) {
      const wasNew = window.Storage.unlockAchievement(playerName, id);
      if (wasNew) {
        newlyUnlocked.push(achievement);
      }
    }
  }
  
  return newlyUnlocked;
};

// Get all achievements with unlock status for a player
const getAchievementsWithStatus = (playerName) => {
  const stats = window.Storage.getPlayerStats(playerName);
  const playerData = window.Storage.getPlayerData(playerName);
  const playerAchievements = playerData.achievements || [];
  
  return Object.values(ACHIEVEMENTS).map(achievement => ({
    ...achievement,
    unlocked: playerAchievements.includes(achievement.id),
    // For royalty achievement, personalize the name
    displayName: achievement.id === 'royalty' 
      ? (playerName === 'Саша' ? 'Крал' : 'Кралица')
      : achievement.name
  }));
};

// Get progress towards each achievement (for display)
const getAchievementProgress = (playerName) => {
  const stats = window.Storage.getPlayerStats(playerName);
  const playerData = window.Storage.getPlayerData(playerName);
  
  // Calculate animal questions correct
  const animalCategories = ['Диви', 'Ферма', 'Морски', 'Птици', 'Насекоми', 'Влечуги', 'Животни'];
  let animalTotal = 0;
  for (const cat of animalCategories) {
    animalTotal += playerData.categoryStats?.[cat]?.correct || 0;
  }
  
  // Calculate food questions correct
  const foodCategories = ['Храна', 'Плодове', 'Зеленчуци', 'Десерт', 'Напитки', 'Закуска', 'Снак'];
  let foodTotal = 0;
  for (const cat of foodCategories) {
    foodTotal += playerData.categoryStats?.[cat]?.correct || 0;
  }
  
  return {
    first_steps: { current: stats.totalCorrect, target: 10 },
    on_fire: { current: stats.bestStreak, target: 5 },
    lightning: { current: stats.bestStreak, target: 10 },
    champion: { current: stats.gamesWon, target: 5 },
    royalty: { current: stats.gamesWon, target: 10 },
    animal_expert: { current: animalTotal, target: 20 },
    foodie: { current: foodTotal, target: 20 },
    family_expert: { current: playerData.categoryStats?.['Семейство']?.correct || 0, target: 15 },
    color_master: { current: playerData.categoryStats?.['Цветове']?.correct || 0, target: 15 },
    perfect_game: { current: stats.perfectGames, target: 1 },
    bookworm: { current: stats.flashcardsSeen, target: 100 },
    marathon: { current: stats.gamesPlayed, target: 20 }
  };
};

// Calculate combo multiplier based on current streak
const getComboMultiplier = (streak) => {
  if (streak >= 10) return 3;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
};

// Get streak emoji/text display
const getStreakDisplay = (streak) => {
  if (streak >= 10) return { emoji: '⚡', text: 'МЪЛНИЯ!', color: 'text-purple-500' };
  if (streak >= 5) return { emoji: '🔥', text: 'На вълна!', color: 'text-orange-500' };
  if (streak >= 3) return { emoji: '✨', text: 'Супер!', color: 'text-yellow-500' };
  return null;
};

// Export to window object for browser use
window.Achievements = {
  ACHIEVEMENTS,
  getAllAchievementIds,
  getAchievement,
  checkAndUnlockAchievements,
  getAchievementsWithStatus,
  getAchievementProgress,
  getComboMultiplier,
  getStreakDisplay
};
