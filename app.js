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
  started: false,
  viewMode: "normal"
};

const state = loadState();
const audioManager = createAudioManager();

const elements = {
  configScreen: document.getElementById("configScreen"),
  gameScreen: document.getElementById("gameScreen"),
  curtain: document.getElementById("curtain"),
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
  volumeSliderGame: document.getElementById("volumeSliderGame"),
  fullscreenOverlay: document.getElementById("fullscreenOverlay"),
  fullscreenIntro: document.getElementById("fullscreenIntro"),
  fullscreenQuestion: document.getElementById("fullscreenQuestion"),
  fullscreenHint: document.getElementById("fullscreenHint"),
  showQuestionMode: document.getElementById("showQuestionMode"),
  toggleBoardMode: document.getElementById("toggleBoardMode"),
  exitFullscreenMode: document.getElementById("exitFullscreenMode")
};

const questions = Array.isArray(QUESTIONS_DATA?.questions) ? QUESTIONS_DATA.questions : [];
let curtainTimer = null;

init();

function init() {
  elements.teamAInput.value = state.teamNames.A;
  elements.teamBInput.value = state.teamNames.B;
  elements.audioToggle.checked = state.audio.enabled;
  elements.volumeSlider.value = Math.round(state.audio.volume * 100);
  elements.volumeSliderGame.value = Math.round(state.audio.volume * 100);

  if (!state.started) {
    state.viewMode = "normal";
  }

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
  elements.showQuestionMode?.addEventListener("click", () => setViewMode("question"));
  elements.toggleBoardMode?.addEventListener("click", () => toggleBoardMode());
  elements.exitFullscreenMode?.addEventListener("click", () => setViewMode("normal"));
  elements.fullscreenOverlay?.addEventListener("click", () => {
    if (state.viewMode === "question") {
      setViewMode("board");
    }
  });

  document.addEventListener("keydown", handleKeyDown);

  setViewMode(state.viewMode, { skipSound: true });
  render();
}

function handleStart() {
  state.teamNames.A = elements.teamAInput.value.trim() || "Equipo A";
  state.teamNames.B = elements.teamBInput.value.trim() || "Equipo B";
  state.started = true;
  state.roundOwnerTeam = state.activeTeam;
  audioManager.play("intro", { once: true });
  showCurtain({ autoHide: true });
  saveState();
  render();
}

function setViewMode(mode, { skipSound = false } = {}) {
  const normalized = ["normal", "question", "board"].includes(mode) ? mode : "normal";
  const prevMode = state.viewMode;
  state.viewMode = state.started ? normalized : "normal";
  updateViewModeUI();
  if (!skipSound && state.viewMode === "board" && prevMode !== "board") {
    audioManager.play("reveal");
  }
  saveState();
  render();
}

function toggleBoardMode() {
  setViewMode(state.viewMode === "board" ? "normal" : "board");
}

function updateViewModeUI() {
  document.body.classList.toggle("mode-question", state.viewMode === "question");
  document.body.classList.toggle("mode-board", state.viewMode === "board");
  if (elements.fullscreenOverlay) {
    elements.fullscreenOverlay.hidden = state.viewMode !== "question";
  }
  updateFullscreenOverlay();
}

function updateFullscreenOverlay() {
  if (!elements.fullscreenOverlay || state.viewMode !== "question") {
    return;
  }
  const question = questions[state.currentQuestionIndex];
  elements.fullscreenIntro.textContent = "5 Respuestas en el tablero. Traten de darme la más popular";
  elements.fullscreenQuestion.textContent = question?.prompt || "Sin pregunta cargada.";
  elements.fullscreenHint.textContent = "Clic o ESPACIO/ENTER para ver el tablero";
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
  updateViewModeUI();
}

function renderAnswers(question) {
  const answers = [...(question.answers || [])];
  while (answers.length < 5) {
    answers.push({ text: "", points: 0 });
  }

  elements.answersGrid.innerHTML = "";
  answers.slice(0, 5).forEach((answer, index) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "answer-row";
    if (state.revealedAnswers[index]) {
      row.classList.add("revealed");
    }
    row.disabled = state.stealMode;
    row.addEventListener("click", () => toggleAnswer(index));

    const num = document.createElement("div");
    num.className = "answer-row__num";
    num.textContent = `${index + 1}.`;

    const content = document.createElement("div");
    content.className = "answer-row__content";

    const text = document.createElement("div");
    text.className = "answer-row__text";
    text.textContent = answer.text || "Respuesta";

    const fill = document.createElement("div");
    fill.className = "answer-row__fill";
    fill.setAttribute("aria-hidden", "true");

    const points = document.createElement("div");
    points.className = "answer-row__points";
    const safePoints = Math.max(0, Number(answer.points) || 0);
    points.textContent = String(safePoints);

    content.append(text, fill, points);
    row.append(num, content);

    elements.answersGrid.append(row);
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
  showCurtain({ autoHide: true });
  setViewMode("question");
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
  if (isEditableTarget(event.target)) {
    return;
  }

  const key = event.key.toLowerCase();

  if (key === "escape") {
    setViewMode("normal");
    return;
  }

  if (key === "q") {
    setViewMode(state.viewMode === "question" ? "board" : "question");
    return;
  }

  if (key === "v") {
    toggleBoardMode();
    return;
  }

  if ((event.code === "Space" || key === " ") && state.viewMode === "question") {
    event.preventDefault();
    setViewMode("board");
    return;
  }

  if (key === "enter" && state.viewMode === "question") {
    event.preventDefault();
    setViewMode("board");
    return;
  }

  if (state.viewMode === "question") {
    return;
  }

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
    case "i":
      toggleCurtain();
      break;
    default:
      break;
  }
}

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return target.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
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

function showCurtain({ autoHide = false } = {}) {
  if (!elements.curtain) {
    return;
  }
  elements.curtain.classList.add("curtain--visible");
  elements.curtain.setAttribute("aria-hidden", "false");
  clearTimeout(curtainTimer);
  if (autoHide) {
    curtainTimer = setTimeout(() => {
      hideCurtain();
    }, 5000);
  }
}

function hideCurtain() {
  if (!elements.curtain) {
    return;
  }
  elements.curtain.classList.remove("curtain--visible");
  elements.curtain.setAttribute("aria-hidden", "true");
}

function toggleCurtain() {
  if (!elements.curtain) {
    return;
  }
  if (elements.curtain.classList.contains("curtain--visible")) {
    hideCurtain();
  } else {
    showCurtain({ autoHide: false });
  }
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
