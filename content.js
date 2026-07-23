// ============================================================================
// content.js — TODA a isca mora aqui.
//
// Para reutilizar o site com outra pegadinha, basta trocar este arquivo:
// a narrativa (boot + log), os avisos, os textos do botão final e o vídeo.
// index.html / styles.css / script.js não precisam ser tocados.
//
// Tipos de linha aceitos em CONTENT.log:
//   cmd    → linha de comando (recebe o prompt user@qlab:~$)
//   out    → saída normal do log (verde)
//   dim    → comentário/metadata (cinza)
//   amber  → anomalia / valor estranho (âmbar)
//   pre    → bloco pré-formatado (histogramas ASCII etc. — use \n)
//   warn1..warn4 → avisos em escalada de urgência (vermelho)
//   blank  → linha em branco
//   hr     → divisor horizontal
// ============================================================================

const CONTENT = {
  // Vídeo-alvo. Pode ser sobrescrito via query string: ?v=OUTRO_ID
  videoId: "dQw4w9WgXcQ",

  // Texto de revelação piscando por cima do vídeo (desligue com enabled:false)
  reveal: {
    enabled: true,
    text: "Você caiu 🎣",
    durationMs: 2000,
  },

  // Sequência de boot (digitada linha a linha antes do log aparecer)
  boot: {
    lines: [
      "QOS bootloader v2.4.1 — rig quantic-computing",
      "[ OK ] controladores criogênicos online",
      "[ OK ] dilution refrigerator @ 14.8 mK",
      "[ OK ] link com QPU \"ARARA-27\" (27 qubits)",
      "[ OK ] qcli v0.9.3 · calib-daemon · syndrome-watch",
      "[ OK ] /var/log/qpu montado (ro)",
    ],
    command: "cat qpu-run-0x1F.log",
  },

  log: [
    { t: "hr" },
    { t: "pre", s: "run-id    : 0x1F\ndata      : 2026-07-19 03:07:58 UTC-3\noperador  : jvt@qlab\nbackend   : ARARA-27 (heavy-hex, 27q)\nobjetivo  : bell/GHZ + surface code d=3" },
    { t: "dim", s: "# log bruto, sem pós-processamento. leitura por conta e risco." },
    { t: "blank" },

    { t: "out", s: "[03:08:12.044] calib: iniciando varredura de qubits" },
    { t: "out", s: "[03:08:31.310] q0  T1=118.4µs  T2=96.2µs   ro_err=1.2%" },
    { t: "out", s: "[03:08:31.512] q1  T1=104.9µs  T2=88.7µs   ro_err=1.4%" },
    { t: "out", s: "[03:08:31.720] q2  T1=126.1µs  T2=101.3µs  ro_err=0.9%" },
    { t: "out", s: "[03:08:32.104] ... 24 qubits restantes OK (mediana T1=112µs)" },
    { t: "out", s: "[03:08:40.881] calib: fidelidade média 1q = 99.96%" },
    { t: "out", s: "[03:08:41.007] calib: fidelidade média 2q (CZ) = 99.31%" },
    { t: "out", s: "[03:08:41.008] calib: OK. janela de operação: 41 min" },
    { t: "dim", s: "# rig estável. temperatura segurando em 14.8 mK." },
    { t: "blank" },

    { t: "cmd", s: "qcli run --circuit bell_state.qasm --shots 1024" },
    { t: "out", s: "[03:09:02.331] transpilando: H q0; CNOT q0,q1; medir" },
    { t: "out", s: "[03:09:02.598] profundidade=3, portas={h:1, cx:1}" },
    { t: "out", s: "[03:09:04.112] executando 1024 shots..." },
    { t: "out", s: "[03:09:07.845] leitura concluída. histograma:" },
    { t: "pre", s: "|00⟩ ██████████████████  50.3%\n|11⟩ █████████████████▊  49.5%\n|01⟩ ▏                     0.1%\n|10⟩ ▏                     0.1%" },
    { t: "out", s: "[03:09:07.902] F(bell) = 0.9987 · dentro do esperado" },
    { t: "dim", s: "# estado de Bell limpinho. até aqui, rotina." },
    { t: "blank" },

    { t: "cmd", s: "qcli run --circuit ghz_5.qasm --shots 2048" },
    { t: "out", s: "[03:12:44.102] preparando GHZ de 5 qubits (H + 4×CNOT)" },
    { t: "out", s: "[03:12:47.590] executando 2048 shots..." },
    { t: "out", s: "[03:12:52.213] histograma:" },
    { t: "pre", s: "|00000⟩ █████████████████  49.1%\n|11111⟩ ████████████████▌  47.9%\noutros  █▏                  3.0%" },
    { t: "out", s: "[03:12:52.301] F(ghz5) = 0.9812" },
    { t: "out", s: "[03:12:52.302] paridade ok · correlações ok" },
    { t: "dim", s: "# ruído um pouco acima do baseline no q7. anotado." },
    { t: "blank" },

    { t: "warn1", s: "# NOTA: medições abaixo desse ponto ainda em pós-processamento. Recomendo não rolar além daqui." },
    { t: "blank" },

    { t: "cmd", s: "qcli run --circuit toffoli_test.qasm --shots 1024" },
    { t: "out", s: "[03:15:20.019] Toffoli decomposto em 6×CNOT + 7×T" },
    { t: "out", s: "[03:15:24.870] executando 1024 shots..." },
    { t: "out", s: "[03:15:28.114] tabela-verdade reproduzida em 98.9% dos shots" },
    { t: "out", s: "[03:15:28.115] F(toffoli) = 0.9891" },
    { t: "blank" },

    { t: "cmd", s: "qcli qec start --code surface --distance 3 --cycles 500" },
    { t: "out", s: "[03:18:09.415] síndrome rounds 001–100: 3 flips corrigidos" },
    { t: "out", s: "[03:19:33.870] síndrome rounds 101–200: 5 flips corrigidos" },
    { t: "out", s: "[03:20:58.112] síndrome rounds 201–300: 2 flips corrigidos" },
    { t: "out", s: "[03:21:02.009] erro lógico estimado: 4.1e-5 / ciclo" },
    { t: "dim", s: "# surface code segurando bonito. nada a reportar." },
    { t: "blank" },

    { t: "cmd", s: "qcli top" },
    { t: "pre", s: "PID  JOB                QUBITS  EST\n412  bell_state.qasm    2       done\n413  ghz_5.qasm         5       done\n414  toffoli_test.qasm  3       done\n415  surface_d3         17      run\n416  ???                27      ???" },
    { t: "amber", s: "[03:22:40.663] job 416 não foi submetido por nenhum operador" },
    { t: "dim", s: "# provavelmente resíduo de fila. matando por precaução." },
    { t: "cmd", s: "qcli kill 416" },
    { t: "amber", s: "[03:23:01.229] kill 416: processo não existe (mas segue na fila)" },
    { t: "blank" },

    { t: "out", s: "[03:24:17.660] síndrome rounds 301–400: 0 flips corrigidos" },
    { t: "amber", s: "[03:24:17.661] aviso: 0 flips em 100 rounds é estatisticamente improvável (p < 1e-9)" },
    { t: "out", s: "[03:25:40.023] síndrome rounds 401–500: -3 flips corrigidos" },
    { t: "amber", s: "[03:25:40.024] contagem negativa de correções não é um valor definido" },
    { t: "dim", s: "# deve ser bug no contador. recalibrando tudo." },
    { t: "blank" },

    { t: "cmd", s: "qcli calib --full --force" },
    { t: "out", s: "[03:27:02.114] recalibrando 27 qubits..." },
    { t: "amber", s: "[03:27:59.481] q7: T2 = 214.6µs com T1 = 118.1µs — razão fora do envelope físico do rig" },
    { t: "amber", s: "[03:28:04.712] q7: fidelidade de leitura = 1.0000" },
    { t: "dim", s: "# fidelidade perfeita não existe. sensor? cabo? checar amanhã." },
    { t: "blank" },

    { t: "warn2", s: "# AVISO: anomalia de decoerência detectada nos registros abaixo. Leitura não recomendada." },
    { t: "blank" },

    { t: "cmd", s: "qcli run --circuit bell_state.qasm --shots 1024 --seed 42" },
    { t: "out", s: "[03:31:11.940] executando 1024 shots..." },
    { t: "out", s: "[03:31:15.002] histograma:" },
    { t: "pre", s: "|00⟩ ██████████████████▌ 51.6%\n|11⟩ █████████████████▏  47.7%\n|ψ?⟩ ▍                    0.7%" },
    { t: "amber", s: "[03:31:15.003] rótulo de estado fora da base computacional: \"|ψ?⟩\"" },
    { t: "amber", s: "[03:31:15.004] Σ probabilidades = 1.0327" },
    { t: "dim", s: "# probabilidades somando mais que 1. isso não é arredondamento." },
    { t: "out", s: "[03:31:15.117] repetindo com a mesma seed..." },
    { t: "out", s: "[03:31:18.409] histograma divergiu da execução anterior (mesma seed, mesmo circuito)" },
    { t: "amber", s: "[03:31:18.410] determinismo do simulador de verificação: quebrado" },
    { t: "blank" },

    { t: "out", s: "[03:33:27.554] q7: estado pós-medição continua em superposição" },
    { t: "amber", s: "[03:33:27.555] colapso não registrado após leitura projetiva" },
    { t: "amber", s: "[03:33:29.812] repetindo medição... o valor anterior MUDOU no arquivo" },
    { t: "dim", s: "# o histograma gravado às 03:31 não é mais o mesmo. conferindo hash." },
    { t: "cmd", s: "md5sum runs/0x1F/hist_0331.dat" },
    { t: "out", s: "d41d8cd98f00b204e9800998ecf8427e  hist_0331.dat" },
    { t: "amber", s: "[03:34:02.771] md5 de arquivo não-vazio bate com o hash de arquivo VAZIO" },
    { t: "blank" },

    { t: "warn3", s: "## [ATENÇÃO] Estados não-colapsados no segmento final do log. Observar pode alterar o resultado. NÃO ROLE." },
    { t: "blank" },

    { t: "out", s: "[03:38:56.001] syndrome-watch: valores de síndrome fora do espaço de Hilbert" },
    { t: "out", s: "[03:38:56.002] decodificador retornou correção para um erro que ainda não ocorreu" },
    { t: "amber", s: "[03:39:41.220] T1(q7) = -9.3µs" },
    { t: "amber", s: "[03:39:41.221] tempo de coerência negativo · o qubit \"lembra\" do estado futuro" },
    { t: "out", s: "[03:41:22.847] leitura espontânea SEM pulso de medição no canal 7" },
    { t: "out", s: "[03:41:22.847] leitura espontânea SEM pulso de medição no canal 7" },
    { t: "dim", s: "# a linha acima se repetiu sozinha. eu registrei UMA vez." },
    { t: "amber", s: "[03:39:--.---] timestamp anterior ao registro anterior" },
    { t: "amber", s: "[--:--:--.---] relógio recusou sincronização NTP: \"drift não-causal\"" },
    { t: "blank" },

    { t: "dim", s: "# encerrando a execução manualmente. já deu." },
    { t: "cmd", s: "qcli abort --run 0x1F --hard" },
    { t: "out", s: "[03:44:19.336] abort enviado..." },
    { t: "amber", s: "[03:44:20.001] QPU respondeu: \"run 0x1F ainda não começou\"" },
    { t: "amber", s: "[03:44:23.518] q7 mantém emaranhamento com... (destino não identificado)" },
    { t: "dim", s: "# emaranhado com O QUÊ? não há outro qubit ativo." },
    { t: "out", s: "[03:45:00.000] gravando segmento final e selando o log." },
    { t: "dim", s: "# se você chegou até aqui: o segmento abaixo NÃO estava no arquivo quando eu o selei." },
    { t: "blank" },

    { t: "warn4", s: "⚠ PARE DE ROLAR. O que está no final desse log não deveria ter sido medido." },
    { t: "blank" },
  ],

  // Zona final: selo + botão + micro-copy
  finalZone: {
    sealTop: "╔═ SEGMENTO 0x1F·F — SELADO ═╗",
    sealLines: [
      "estado: NÃO MEDIDO · superposição ativa",
      "abrir = medir · medir = colapsar",
    ],
    buttonLabels: [
      "MEDIR SEGMENTO FINAL",
      "M3D1R S3GM3NT0 F1N4L",
      "MED̸IR SEG̷M̷ENTO F̶INAL",
      "M̷E̶D̴I̷R̶ ̸S̵E̶G̷M̸E̵N̶T̷O̸ ̶F̵I̶N̸A̷L̶",
      "N4O H4 V0LT4 D3P01S D1SS0",
    ],
    microcopy: "Isso é definitivamente uma má ideia.",
  },
};
