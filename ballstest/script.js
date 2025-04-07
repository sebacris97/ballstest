    let currentStep = 0;
    let stepStates = [];
    let movesList = [];
    let playInterval = null;
    let inputHistory = [];

    function getMoves(s) {
      const bPositions = [];
      for (let i = 0; i < s.length; i++) {
        if (s[i] === 'B') bPositions.push(i);
      }

      const total = bPositions.length;
      if (total <= 1) return { moves: 0, steps: [] };

      const requiredSpan = 2 * total - 1;
      const length = s.length;
      let bestSteps = [];
      let minMoves = Infinity;

      for (let start = 0; start <= length - requiredSpan; start++) {
        const target = Array.from({ length: total }, (_, i) => start + 2 * i);
        let conflict = false;
        for (const pos of target) {
          if (s[pos] === 'B' && !bPositions.includes(pos)) {
            conflict = true;
            break;
          }
        }
        if (conflict) continue;

        const used = new Set();
        const steps = [];
        let moves = 0;

        for (const t of target) {
          if (bPositions.includes(t)) used.add(t);
        }

        for (const t of target) {
          if (!bPositions.includes(t)) {
            let best = null, bestDist = Infinity;
            for (const b of bPositions) {
              if (!used.has(b)) {
                const dist = Math.abs(b - t);
                if (dist < bestDist) {
                  best = b;
                  bestDist = dist;
                }
              }
            }
            if (best !== null) {
              steps.push({ from: best, to: t });
              used.add(best);
              moves++;
            }
          }
        }

        if (moves < minMoves) {
          minMoves = moves;
          bestSteps = steps;
        }
      }

      return minMoves === Infinity ? -1 : { moves: minMoves, steps: bestSteps };
    }

    function visualizar(inputStr = null) {
      const input = inputStr || document.getElementById('inputStr').value;
      if (!inputHistory.includes(input)) {
        inputHistory.push(input);
        renderHistory();
      }

      const result = getMoves(input);
      const resultado = document.getElementById('resultado');
      const output = document.getElementById('output');
      const allSteps = document.getElementById('allSteps');
      allSteps.innerHTML = "";

      if (playInterval) togglePlay(true);

      if (result === -1) {
        resultado.innerText = "❌ No es posible reubicar las B con separación.";
        output.innerHTML = "";
        return;
      }

      resultado.innerText = `✅ Movimientos necesarios: ${result.moves}`;
      currentStep = 0;
      stepStates = [];
      movesList = result.steps;

      let state = input.split('');
      stepStates.push([...state]);
      for (const move of result.steps) {
        state = [...state];
        state[move.from] = '.';
        state[move.to] = 'B';
        stepStates.push([...state]);
      }

      renderStep(0);
    }

    function renderStep(index) {
      const output = document.getElementById('output');
      const stepInfo = document.getElementById('stepInfo');
      const chars = stepStates[index];
      const move = movesList[index - 1];
      output.innerHTML = chars.map((c, i) => {
        let classes = "char";
        if (c === 'B') classes += " b";
        if (move && i === move.to) classes += " target";
        if (move && i === move.from && stepStates[index - 1][i] === 'B') {
          classes += " moving";
        }
        return `<span class="${classes}">${c}</span>`;
      }).join('');
      stepInfo.innerText = index === 0
        ? "Estado inicial"
        : `Paso ${index}: mover 'B' de ${move.from} a ${move.to}`;
    }

    function nextStep() {
      if (currentStep < stepStates.length - 1) {
        currentStep++;
        renderStep(currentStep);
      } else {
        togglePlay(true);
      }
    }

    function prevStep() {
      if (currentStep > 0) {
        currentStep--;
        renderStep(currentStep);
      }
    }

    function togglePlay(forceStop = false) {
      const btn = document.getElementById('playBtn');
      if (playInterval || forceStop) {
        clearInterval(playInterval);
        playInterval = null;
        btn.innerText = "▶️ Play";
      } else {
        btn.innerText = "⏸ Pausa";
        playInterval = setInterval(() => {
          if (currentStep < stepStates.length - 1) {
            nextStep();
          } else {
            togglePlay(true);
          }
        }, 800);
      }
    }

function verTodosLosPasos() {
  const allSteps = document.getElementById('allSteps');
  const btn = document.querySelector('button[onclick="verTodosLosPasos()"]');

  const mostrando = allSteps.style.display === "block";

  if (mostrando) {
    allSteps.style.display = "none";
    btn.innerText = "🧾 Mostrar pasos";
  } else {
    if (!allSteps.innerHTML.trim()) {
      allSteps.innerHTML = "<h4>Todos los pasos:</h4>";
      stepStates.forEach((state, idx) => {
        const move = movesList[idx - 1];
        const info = idx === 0 ? "Inicio" : `Paso ${idx}: mover B de ${move.from} a ${move.to}`;
        const row = state.map((c, i) => {
          let classes = "char";
          if (c === 'B') classes += " b";
          if (move && i === move.to) classes += " target";
          if (move && i === move.from && stepStates[idx - 1][i] === 'B') {
            classes += " moving";
          }
          return `<span class="${classes}">${c}</span>`;
        }).join('');
        allSteps.innerHTML += `<div class="step-container"><strong>${info}</strong><br>${row}</div>`;
      });
    }

    allSteps.style.display = "block";
    btn.innerText = "❌ Ocultar pasos";
  }
}


    function renderHistory() {
      const history = document.getElementById('history');
      history.innerHTML = "";
      inputHistory.forEach(str => {
        history.innerHTML += `<div onclick="visualizar('${str}')">📌 ${str}</div>`;
      });
    }