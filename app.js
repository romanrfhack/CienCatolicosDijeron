const STORAGE_KEY = "catolicos_game_state_v1";
const AUDIO_FILES = {
  intro: "assets/audio/intro.mp3",
  correct: "assets/audio/correct.mp3",
  wrong: "assets/audio/wrong.mp3",
  reveal: "assets/audio/reveal.mp3",
  steal: "assets/audio/steal.mp3"
};

const DEFAULT_STATE = {
  currentQuestionIndex: 0,
  revealedAnswers: Array(5).fill(false),
  strikesA: 0,
  strikesB: 0,
  activeTeam: "A",
  roundPoints: 0,
  stealMode: false,
  roundOwnerTeam: "A",
  scores: { A: 0, B: 0 },
  teamNames: { A: "Equipo A", B: "Equipo B" },
  audio: { enabled: true, volume: 0.7 },
  started: false
};

const state = loadState();
const audioManager = createAudioManager();

const elements = {
  configScreen: document.getElementById("configScreen"),
  gameScreen: document.getElementById("gameScreen"),
  teamAInput: document.getElementById("teamAInput"),
  teamBInput: document.getElementById("teamBInput"),
  startGame: document.getElementById("startGame"),
  questionText: document.getElementById("questionText"),
  answersGrid: document.getElementById("answersGrid"),
  roundPoints: document.getElementById("roundPoints"),
  questionCounter: document.getElementById("questionCounter"),
  teamAName: document.getElementById("teamAName"),
  teamBName: document.getElementById("teamBName"),
  scoreA: document.getElementById("scoreA"),
  scoreB: document.getElementById("scoreB"),
  strikesA: document.getElementById("strikesA"),
  strikesB: document.getElementById("strikesB"),
  teamABox: document.getElementById("teamABox"),
  teamBBox: document.getElementById("teamBBox"),
  setTeamA: document.getElementById("setTeamA"),
  setTeamB: document.getElementById("setTeamB"),
  addStrike: document.getElementById("addStrike"),
  resetRound: document.getElementById("resetRound"),
  finishRoundA: document.getElementById("finishRoundA"),
  finishRoundB: document.getElementById("finishRoundB"),
  startSteal: document.getElementById("startSteal"),
  stealSuccess: document.getElementById("stealSuccess"),
  stealFail: document.getElementById("stealFail"),
  prevQuestion: document.getElementById("prevQuestion"),
  nextQuestion: document.getElementById("nextQuestion"),
  resetGame: document.getElementById("resetGame"),
  stealBanner: document.getElementById("stealBanner"),
  stealTeam: document.getElementById("stealTeam"),
  audioToggle: document.getElementById("audioToggle"),
  volumeSlider: document.getElementById("volumeSlider"),
  testSound: document.getElementById("testSound"),
  toggleAudio: document.getElementById("toggleAudio"),
  volumeSliderGame: document.getElementById("volumeSliderGame")
};

const questions = Array.isArray(QUESTIONS_DATA?.questions) ? QUESTIONS_DATA.questions : [];

init();

function init() {
  elements.teamAInput.value = state.teamNames.A;
  elements.teamBInput.value = state.teamNames.B;
  elements.audioToggle.checked = state.audio.enabled;
  elements.volumeSlider.value = Math.round(state.audio.volume * 100);
  elements.volumeSliderGame.value = Math.round(state.audio.volume * 100);

  elements.startGame.addEventListener("click", handleStart);
  elements.setTeamA.addEventListener("click", () => setActiveTeam("A"));
  elements.setTeamB.addEventListener("click", () => setActiveTeam("B"));
  elements.addStrike.addEventListener("click", addStrike);
  elements.resetRound.addEventListener("click", resetRoundWithConfirm);
  elements.finishRoundA.addEventListener("click", () => finishRound("A"));
  elements.finishRoundB.addEventListener("click", () => finishRound("B"));
  elements.startSteal.addEventListener("click", startSteal);
  elements.stealSuccess.addEventListener("click", () => resolveSteal(true));
  elements.stealFail.addEventListener("click", () => resolveSteal(false));
  elements.prevQuestion.addEventListener("click", () => changeQuestion(-1));
  elements.nextQuestion.addEventListener("click", () => changeQuestion(1));
  elements.resetGame.addEventListener("click", resetGame);
  elements.audioToggle.addEventListener("change", toggleAudio);
  elements.volumeSlider.addEventListener("input", handleVolumeChange);
  elements.volumeSliderGame.addEventListener("input", handleVolumeChange);
  elements.testSound.addEventListener("click", () => audioManager.play("correct"));
  elements.toggleAudio.addEventListener("click", () => {
    state.audio.enabled = !state.audio.enabled;
    syncAudioUI();
    saveState();
  });

  document.addEventListener("keydown", handleKeyDown);

  render();
}

function handleStart() {
  state.teamNames.A = elements.teamAInput.value.trim() || "Equipo A";
  state.teamNames.B = elements.teamBInput.value.trim() || "Equipo B";
  state.started = true;
  state.roundOwnerTeam = state.activeTeam;
  audioManager.play("intro", { once: true });
  saveState();
  render();
}

function render() {
  const question = questions[state.currentQuestionIndex];

  elements.configScreen.classList.toggle("hidden", state.started);
  elements.gameScreen.classList.toggle("hidden", !state.started);

  elements.teamAName.textContent = state.teamNames.A;
  elements.teamBName.textContent = state.teamNames.B;
  elements.scoreA.textContent = state.scores.A;
  elements.scoreB.textContent = state.scores.B;
  elements.strikesA.textContent = state.strikesA;
  elements.strikesB.textContent = state.strikesB;
  elements.roundPoints.textContent = state.roundPoints;

  elements.teamABox.classList.toggle("active", state.activeTeam === "A");
  elements.teamBBox.classList.toggle("active", state.activeTeam === "B");

  if (question) {
    elements.questionText.textContent = question.prompt;
    elements.questionCounter.textContent = `Pregunta ${state.currentQuestionIndex + 1} / ${questions.length}`;
    renderAnswers(question);
  } else {
    elements.questionText.textContent = "No hay preguntas cargadas.";
    elements.questionCounter.textContent = "Pregunta 0";
    elements.answersGrid.innerHTML = "";
  }

  const strikesActive = state.activeTeam === "A" ? state.strikesA : state.strikesB;
  const canSteal = strikesActive >= 3 && !state.stealMode;
  elements.startSteal.disabled = !canSteal;

  elements.stealSuccess.disabled = !state.stealMode;
  elements.stealFail.disabled = !state.stealMode;

  elements.addStrike.disabled = state.stealMode;
  elements.setTeamA.disabled = state.stealMode;
  elements.setTeamB.disabled = state.stealMode;
  elements.finishRoundA.disabled = state.stealMode;
  elements.finishRoundB.disabled = state.stealMode;

  elements.stealBanner.classList.toggle("hidden", !state.stealMode);
  elements.stealTeam.textContent = state.stealMode ? getOppositeTeam(state.roundOwnerTeam) : "";

  syncAudioUI();
}

function renderAnswers(question) {
  const answers = [...question.answers];
  while (answers.length < 5) {
    answers.push({ text: "", points: 0 });
  }

  elements.answersGrid.innerHTML = "";
  answers.slice(0, 5).forEach((answer, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "answer-card";
    if (state.revealedAnswers[index]) {
      card.classList.add("revealed");
    }
    card.addEventListener("click", () => toggleAnswer(index));

    const inner = document.createElement("div");
    inner.className = "answer-card__inner";

    const front = document.createElement("div");
    front.className = "answer-card__face answer-card__face--front";
    front.textContent = index + 1;

    const back = document.createElement("div");
    back.className = "answer-card__face answer-card__face--back";

    const text = document.createElement("div");
    text.className = "answer-card__text";
    text.textContent = answer.text || "Respuesta";

    const points = document.createElement("div");
    points.className = "answer-card__points";
    points.textContent = answer.points ? `${answer.points}` : "0";

    back.append(text, points);
    inner.append(front, back);
    card.append(inner);

    card.disabled = state.stealMode;

    elements.answersGrid.append(card);
  });
}

function toggleAnswer(index) {
  if (state.stealMode) {
    return;
  }

  const question = questions[state.currentQuestionIndex];
  if (!question) {
    return;
  }

  const answer = question.answers[index] || { points: 0 };
  const points = Math.max(0, Number(answer.points) || 0);

  if (state.revealedAnswers[index]) {
    state.revealedAnswers[index] = false;
    state.roundPoints = Math.max(0, state.roundPoints - points);
  } else {
    state.revealedAnswers[index] = true;
    state.roundPoints += points;
    audioManager.play("reveal");
    audioManager.play("correct");
  }

  saveState();
  render();
}

function setActiveTeam(team) {
  if (state.stealMode) {
    return;
  }
  state.activeTeam = team;
  if (state.roundPoints === 0 && !state.revealedAnswers.some(Boolean)) {
    state.roundOwnerTeam = team;
  }
  saveState();
  render();
}

function addStrike() {
  if (state.stealMode) {
    return;
  }
  if (state.activeTeam === "A") {
    state.strikesA = Math.min(3, state.strikesA + 1);
  } else {
    state.strikesB = Math.min(3, state.strikesB + 1);
  }
  audioManager.play("wrong");
  saveState();
  render();
}

function resetRound() {
  state.revealedAnswers = Array(5).fill(false);
  state.roundPoints = 0;
  state.strikesA = 0;
  state.strikesB = 0;
  state.stealMode = false;
  state.roundOwnerTeam = state.activeTeam;
}

function resetRoundWithConfirm() {
  const shouldReset = confirm("¿Reiniciar la ronda actual?");
  if (!shouldReset) {
    return;
  }
  resetRound();
  saveState();
  render();
}

function finishRound(team) {
  if (state.stealMode) {
    return;
  }
  state.scores[team] = Math.max(0, state.scores[team] + state.roundPoints);
  resetRound();
  saveState();
  render();
}

function startSteal() {
  const strikes = state.activeTeam === "A" ? state.strikesA : state.strikesB;
  if (strikes < 3 || state.stealMode) {
    return;
  }
  state.stealMode = true;
  audioManager.play("steal");
  saveState();
  render();
}

function resolveSteal(success) {
  if (!state.stealMode) {
    return;
  }
  const stealTeam = getOppositeTeam(state.roundOwnerTeam);
  const winner = success ? stealTeam : state.roundOwnerTeam;
  state.scores[winner] = Math.max(0, state.scores[winner] + state.roundPoints);
  resetRound();
  saveState();
  render();
}

function changeQuestion(delta) {
  const nextIndex = state.currentQuestionIndex + delta;
  if (nextIndex < 0 || nextIndex >= questions.length) {
    return;
  }
  const dirty = state.roundPoints > 0 || state.revealedAnswers.some(Boolean);
  if (dirty && !confirm("Cambiar de pregunta reiniciará la ronda. ¿Continuar?")) {
    return;
  }
  resetRound();
  state.currentQuestionIndex = nextIndex;
  saveState();
  render();
}

function resetGame() {
  if (!confirm("¿Seguro que deseas resetear todo el juego?")) {
    return;
  }
  const teamNames = { ...state.teamNames };
  const audio = { ...state.audio };
  Object.assign(state, JSON.parse(JSON.stringify(DEFAULT_STATE)));
  state.teamNames = teamNames;
  state.audio = audio;
  state.started = false;
  saveState();
  render();
}

function toggleAudio() {
  state.audio.enabled = elements.audioToggle.checked;
  syncAudioUI();
  saveState();
}

function handleVolumeChange(event) {
  const value = Number(event.target.value) / 100;
  state.audio.volume = value;
  syncAudioUI();
  saveState();
}

function syncAudioUI() {
  elements.audioToggle.checked = state.audio.enabled;
  elements.volumeSlider.value = Math.round(state.audio.volume * 100);
  elements.volumeSliderGame.value = Math.round(state.audio.volume * 100);
  elements.toggleAudio.textContent = state.audio.enabled ? "Audio ON" : "Audio OFF";
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();

  if (key >= "1" && key <= "5") {
    toggleAnswer(Number(key) - 1);
    return;
  }

  switch (key) {
    case "a":
      setActiveTeam("A");
      break;
    case "b":
      setActiveTeam("B");
      break;
    case "s":
      addStrike();
      break;
    case "n":
      changeQuestion(1);
      break;
    case "p":
      changeQuestion(-1);
      break;
    case "r":
      resetRoundWithConfirm();
      break;
    case "g":
      resetGame();
      break;
    case "t":
      startSteal();
      break;
    case "y":
      resolveSteal(true);
      break;
    case "u":
      resolveSteal(false);
      break;
    default:
      break;
  }
}

function getOppositeTeam(team) {
  return team === "A" ? "B" : "A";
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  try {
    const parsed = JSON.parse(stored);
    return {
      ...JSON.parse(JSON.stringify(DEFAULT_STATE)),
      ...parsed,
      audio: { ...DEFAULT_STATE.audio, ...(parsed.audio || {}) },
      scores: { ...DEFAULT_STATE.scores, ...(parsed.scores || {}) },
      teamNames: { ...DEFAULT_STATE.teamNames, ...(parsed.teamNames || {}) }
    };
  } catch (error) {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createAudioManager() {
  const audioContext = window.AudioContext ? new AudioContext() : null;
  const cache = {};
  const oncePlayed = new Set();

  const createAudio = (key) => {
    if (!cache[key]) {
      const audio = new Audio(AUDIO_FILES[key]);
      audio.preload = "auto";
      cache[key] = audio;
    }
    return cache[key];
  };

  const playBeep = () => {
    if (!audioContext) {
      return;
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.1 * state.audio.volume;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  return {
    play(key, options = {}) {
      if (!state.audio.enabled) {
        return;
      }
      if (options.once && oncePlayed.has(key)) {
        return;
      }
      const audio = createAudio(key);
      audio.volume = state.audio.volume;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          if (options.once) {
            oncePlayed.add(key);
          }
        })
        .catch(() => {
          if (key === "wrong" || key === "correct") {
            playBeep();
          }
        });
    }
  };
}
