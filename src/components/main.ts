interface Player {
  nickname: string;
  car: string;
  key: string;
  position: number;
}

let players: Player[] = [];
let keysUsed: string[] = [];
const playerListDiv: HTMLDivElement = document.getElementById(
  "player-list"
) as HTMLDivElement;

let winners: Player[] = [];
const carTypes: string[] = ["rojo", "azul", "naranja", "verde", "negro"];

const makeCar = (color: string, key: string, nikeName: string): string => {
  return `<div class="car ${color}" id="car1">
                <p>${nikeName} - Tecla: ${key}</p>
                <div class="wheel left"></div>
                <div class="wheel right"></div>
            </div>`;
};

const startGame = (): void => {
  if (players.length < 2) {
    alert("Se requieren al menos 2 jugadores.");
    return;
  }

  // Cambiar a la pantalla de carrera
  document.getElementById("main-menu")!.style.display = "none";

  countdown();
};

const getUniqueKey = (): string => {
  let key;
  do {
    key = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  } while (keysUsed.includes(key));

  keysUsed.push(key);
  return key;
};

const addPlayer = (): void => {
  if (players.length >= 5) {
    alert("Máximo 5 jugadores permitidos.");
    return;
  }

  const nickname = prompt("Ingresa tu nickname:");
  if (!nickname) return;

  const availableCars: string[] = carTypes.filter(
    (car) => !players.find((player) => player.car === car)
  );

  if (availableCars.length === 0) {
    alert("No hay autos disponibles.");
    return;
  }

  const car: string | null = prompt(
    `Selecciona un auto:\n${availableCars.join("\n")}`
  );

  if (!car) return;
  if (!availableCars.includes(car)) {
    alert("Auto no válido.");
    return;
  }

  const key: string = getUniqueKey();
  const newPlayer: Player = { nickname, car, key, position: 0 };
  players.push(newPlayer);
  updatePlayerList();
};

const updatePlayerList = (): void => {
  playerListDiv.innerHTML = "";
  players.forEach((player) => {
    const playerDiv = document.createElement("div");
    playerDiv.className = "player";
    playerDiv.innerHTML = makeCar(player.car, player.key, player.nickname);

    playerListDiv.appendChild(playerDiv);
  });
};

const startRace = (): void => {
  const raceContainer = document.createElement("div");
  raceContainer.id = "race-track";
  document.body.appendChild(raceContainer);
  players.forEach((player) => {
    const playerRaceTrack = document.createElement("div");
    playerRaceTrack.className = "player-race-track";
    raceContainer.appendChild(playerRaceTrack);

    const playerDiv = document.createElement("div");
    playerDiv.className = "player";
    playerDiv.innerHTML = makeCar(player.car, player.key, player.nickname);
    playerDiv.style.position = "relative";
    playerDiv.style.margin = "10px";
    playerDiv.style.fontSize = "24px";
    playerRaceTrack.appendChild(playerDiv);

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === player.key) {
        player.position += 10;
        playerDiv.style.left = player.position + "px";
        checkWinCondition();
      }
    });
  });
};

const countdown = (): void => {
  let countdown = 10;
  const countdownInterval = setInterval(() => {
    if (countdown >= 0) {
      document.body.innerHTML = `
        <div id="app">  
        <h1 class="main-title">Juego de Carreras</h1>
            <div id="main-menu">
                ${
                  countdown === 0
                    ? `<p class="center">¡Carrera Iniciada!</p>`
                    : `<p class="center font-size"> ${countdown}</p>`
                }
            </div>  
        </div>`;
      countdown--;
    } else {
      clearInterval(countdownInterval);
      startRace();
    }
  }, 1000);
};

const checkWinCondition = (): void => {
  const finishLine = window.innerWidth - 450;
  players.forEach((player) => {
    if (player.position >= finishLine && !winners.includes(player)) {
      winners.push(player);

      if (winners.length === 3 || winners.length === players.length) {
        announceWinners();
        resetGame();
      }
    }
  });
};

const announceWinners = (): void => {
  alert(
    "¡Ganadores!\n" +
      winners.map((w, i) => `${i + 1}: ${w.nickname} - ${w.car}`).join("\n")
  );
};

const resetGame = (): void => {
  players = [];
  playerListDiv.innerHTML = "";
  document.body.innerHTML = `
  <h1 class="main-title">Juego de Carreras</h1>
  <div id="main-menu">
        <button id="start-game">Iniciar Juego</button>
        <button id="add-player">Agregar jugador</button>
        <div id="player-list"></div>
   </div>`;

  init();
};

// Inicializar
const init = (): void => {
  document.getElementById("start-game")!.addEventListener("click", startGame);
  document.getElementById("add-player")!.addEventListener("click", addPlayer);
};

init();
