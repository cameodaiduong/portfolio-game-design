(function () {
  const TILE = {
    FLOOR: 0,
    WALL: 1,
    PLAYER: 2,
    GOAL: 3,
    BOX: 4,
    PIPE_H: 5,
    PIPE_V: 6,
    CONNECTOR: 7,
  };

  const DIRS = {
    ArrowUp: { r: -1, c: 0, name: "up" },
    ArrowDown: { r: 1, c: 0, name: "down" },
    ArrowLeft: { r: 0, c: -1, name: "left" },
    ArrowRight: { r: 0, c: 1, name: "right" },
    KeyW: { r: -1, c: 0, name: "up" },
    KeyS: { r: 1, c: 0, name: "down" },
    KeyA: { r: 0, c: -1, name: "left" },
    KeyD: { r: 0, c: 1, name: "right" },
  };

  const levels = window.SOKO_PIPE_LEVELS;
  const viewportEl = document.getElementById("viewport");
  const levelListEl = document.getElementById("levelList");
  const levelTitleEl = document.getElementById("levelTitle");
  const levelMetaEl = document.getElementById("levelMeta");
  const statusTextEl = document.getElementById("statusText");
  const undoBtn = document.getElementById("undoBtn");
  const resetBtn = document.getElementById("resetBtn");
  const panelUndoBtn = document.getElementById("panelUndoBtn");
  const panelResetBtn = document.getElementById("panelResetBtn");
  const upBtn = document.getElementById("upBtn");
  const downBtn = document.getElementById("downBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const moveLogEl = document.getElementById("moveLog");
  const moveCountTextEl = document.getElementById("moveCountText");
  const exportStepsBtn = document.getElementById("exportStepsBtn");
  const clearPopupEl = document.getElementById("clearPopup");
  const clearSummaryEl = document.getElementById("clearSummary");
  const clearCountdownEl = document.getElementById("clearCountdown");
  const clearExportBtn = document.getElementById("clearExportBtn");
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  const degToRad = (degree) => (degree * Math.PI) / 180;

  let levelIndex = 0;
  let terrain = [];
  let objects = new Map();
  let player = { r: 0, c: 0 };
  let moves = 0;
  let moveLog = [];
  let history = [];
  let won = false;
  let nextLevelTimer = null;
  let nextLevelInterval = null;
  let nextLevelRemaining = 0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x17122f);

  const camera = new THREE.OrthographicCamera(-7, 7, 5, -5, 0.1, 100);
  const cameraState = {
    yaw: 0,
    pitch: degToRad(69),
    distance: 12,
    viewHeight: 10,
  };

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 0.82;
  renderer.outputEncoding = THREE.sRGBEncoding;
  viewportEl.appendChild(renderer.domElement);

  const boardGroup = new THREE.Group();
  scene.add(boardGroup);

  scene.fog = new THREE.Fog(0x17122f, 18, 34);

  const ambient = new THREE.HemisphereLight(0xd9d6ff, 0x1b173f, 1.28);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffd5f3, 0.66);
  sun.position.set(-4, 10, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  scene.add(sun);

  function makeMaterial(color, roughness = 0.86) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0,
      flatShading: true,
    });
  }

  const materials = {
    ground: makeMaterial(0x59679b, 0.92),
    floor: makeMaterial(0xc8d6f1, 0.88),
    goal: makeMaterial(0xffcf64, 0.76),
    wall: makeMaterial(0x8793bd, 0.88),
    box: makeMaterial(0xd58aab, 0.82),
    pipeH: makeMaterial(0x49d3d0, 0.78),
    pipeV: makeMaterial(0x6aa7ff, 0.78),
    connector: makeMaterial(0xb06bea, 0.78),
    player: makeMaterial(0xff6b3d, 0.74),
    playerInside: makeMaterial(0xffb2a5, 0.7),
    bridge: makeMaterial(0x79e66f, 0.74),
    connected: makeMaterial(0x79e66f, 0.72),
    goalInvalid: makeMaterial(0xff435f, 0.76),
    rim: makeMaterial(0xf2edff, 0.66),
    shadow: makeMaterial(0x312953, 0.95),
  };

  function makeRoundedBoxGeometry(width, height, depth, radius, segments = 4) {
    const r = Math.min(radius, width / 2 - 0.001, depth / 2 - 0.001);
    const x = -width / 2;
    const z = -depth / 2;
    const shape = new THREE.Shape();

    shape.moveTo(x + r, z);
    shape.lineTo(x + width - r, z);
    shape.quadraticCurveTo(x + width, z, x + width, z + r);
    shape.lineTo(x + width, z + depth - r);
    shape.quadraticCurveTo(x + width, z + depth, x + width - r, z + depth);
    shape.lineTo(x + r, z + depth);
    shape.quadraticCurveTo(x, z + depth, x, z + depth - r);
    shape.lineTo(x, z + r);
    shape.quadraticCurveTo(x, z, x + r, z);

    const bevel = Math.min(r * 0.45, height * 0.25);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelSegments: segments,
      bevelSize: bevel,
      bevelThickness: bevel,
      curveSegments: segments,
    });

    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, height / 2, 0);
    geometry.computeVertexNormals();
    return geometry;
  }

  const geometries = {
    floor: makeRoundedBoxGeometry(0.98, 0.16, 0.98, 0.045, 3),
    ground: makeRoundedBoxGeometry(1, 0.16, 1, 0.035, 3),
    wall: makeRoundedBoxGeometry(0.98, 0.42, 0.98, 0.055, 4),
    box: makeRoundedBoxGeometry(0.72, 0.68, 0.72, 0.085, 5),
    markerH: makeRoundedBoxGeometry(0.58, 0.055, 0.16, 0.035, 3),
    markerV: makeRoundedBoxGeometry(0.16, 0.055, 0.58, 0.035, 3),
    markerDot: makeRoundedBoxGeometry(0.26, 0.06, 0.26, 0.04, 4),
    player: makeRoundedBoxGeometry(0.52, 0.76, 0.52, 0.095, 5),
    playerTunnelH: makeRoundedBoxGeometry(0.34, 0.07, 0.13, 0.035, 3),
    playerTunnelV: makeRoundedBoxGeometry(0.13, 0.07, 0.34, 0.035, 3),
    playerUBar: makeRoundedBoxGeometry(0.09, 0.055, 0.34, 0.025, 3),
    playerUBase: makeRoundedBoxGeometry(0.34, 0.055, 0.09, 0.025, 3),
    goalBlock: makeRoundedBoxGeometry(0.72, 0.68, 0.72, 0.085, 5),
  };

  function key(pos) {
    return `${pos.r},${pos.c}`;
  }

  function cloneObjects(source) {
    return new Map(Array.from(source.entries()).map(([k, value]) => [k, value]));
  }

  function snapshot() {
    return { player: { ...player }, objects: cloneObjects(objects), moves, moveLog: [...moveLog], won };
  }

  function restore(state) {
    clearNextLevelTimer();
    player = { ...state.player };
    objects = cloneObjects(state.objects);
    moves = state.moves;
    moveLog = [...state.moveLog];
    won = state.won;
    render();
  }

  function loadLevel(index) {
    clearNextLevelTimer();
    levelIndex = index;
    const source = levels[index].grid;
    objects = new Map();
    terrain = source.map((row, r) =>
      row.map((cell, c) => {
        if (cell === TILE.PLAYER) {
          player = { r, c };
          return TILE.FLOOR;
        }
        if (isObject(cell)) {
          objects.set(`${r},${c}`, cell);
          return TILE.FLOOR;
        }
        return cell;
      })
    );
    moves = 0;
    moveLog = [];
    history = [];
    won = false;
    statusTextEl.textContent = "Arrow keys or WASD to move.";
    render();
  }

  function isObject(cell) {
    return cell === TILE.BOX || cell === TILE.PIPE_H || cell === TILE.PIPE_V || cell === TILE.CONNECTOR;
  }

  function isTunnelObject(cell) {
    return cell === TILE.PIPE_H || cell === TILE.PIPE_V || cell === TILE.CONNECTOR;
  }

  function inBounds(pos) {
    return pos.r >= 0 && pos.r < terrain.length && pos.c >= 0 && pos.c < terrain[pos.r].length;
  }

  function terrainAt(pos) {
    if (!inBounds(pos)) return TILE.WALL;
    return terrain[pos.r][pos.c];
  }

  function objectAt(pos) {
    return objects.get(key(pos));
  }

  function isWalkableTerrain(pos) {
    return terrainAt(pos) === TILE.FLOOR;
  }

  function canHoldObject(pos) {
    return terrainAt(pos) === TILE.FLOOR && !objectAt(pos);
  }

  function shouldRenderWall(pos) {
    const neighbors = [
      { r: -1, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
      { r: -1, c: -1 },
      { r: -1, c: 1 },
      { r: 1, c: -1 },
      { r: 1, c: 1 },
    ];

    return neighbors.some((dir) => terrainAt(add(pos, dir)) !== TILE.WALL);
  }

  function shouldRenderGround(pos) {
    const tile = terrainAt(pos);
    if (tile === TILE.FLOOR || tile === TILE.GOAL) return true;
    return tile === TILE.WALL && shouldRenderWall(pos);
  }

  function add(pos, dir) {
    return { r: pos.r + dir.r, c: pos.c + dir.c };
  }

  function isHorizontal(dir) {
    return dir.c !== 0;
  }

  function isVertical(dir) {
    return dir.r !== 0;
  }

  function isPipeCompatible(type, dir) {
    if (type === TILE.PIPE_H) return isHorizontal(dir);
    if (type === TILE.PIPE_V) return isVertical(dir);
    if (type === TILE.CONNECTOR) return true;
    return false;
  }

  function isTunnelEndpoint(pos) {
    const terrain = terrainAt(pos);
    return (terrain === TILE.FLOOR || terrain === TILE.GOAL) && !objectAt(pos);
  }

  function isConnectedTunnelStep(from, dir) {
    const fromType = objectAt(from);
    if (!isTunnelObject(fromType) || !isPipeCompatible(fromType, dir)) return false;

    const next = add(from, dir);
    const nextObj = objectAt(next);
    if (!nextObj) return terrainAt(next) === TILE.GOAL;
    return isTunnelObject(nextObj) && isPipeCompatible(nextObj, dir);
  }

  function connectorHasRoute(connectorPos, incomingDir, visited) {
    const directions = [
      { r: -1, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
    ];

    for (const dir of directions) {
      if (dir.r === -incomingDir.r && dir.c === -incomingDir.c) continue;

      if (hasTunnelRoute(connectorPos, dir, new Set(visited))) return true;
    }

    return false;
  }

  function hasTunnelRoute(entry, dir, visited = new Set()) {
    const entryKey = key(entry);
    if (visited.has(entryKey)) return false;
    visited.add(entryKey);

    const entryType = objectAt(entry);
    if (!isTunnelObject(entryType) || !isPipeCompatible(entryType, dir)) return false;

    const next = add(entry, dir);
    if (terrainAt(next) === TILE.WALL) return false;

    const nextObj = objectAt(next);
    if (!nextObj) {
      return terrainAt(next) === TILE.GOAL;
    }

    if (nextObj === TILE.BOX) return false;
    if (nextObj === TILE.CONNECTOR) return connectorHasRoute(next, dir, visited);
    if (isTunnelObject(nextObj)) return isPipeCompatible(nextObj, dir);

    return false;
  }

  function canStartTunnel(entry, dir) {
    const entryType = objectAt(entry);
    if (entryType !== TILE.PIPE_H && entryType !== TILE.PIPE_V) return false;
    return hasTunnelRoute(entry, dir);
  }

  function canTraverseTunnel(from, dir) {
    const fromType = objectAt(from);
    if (!isTunnelObject(fromType) || !isPipeCompatible(fromType, dir)) return false;
    const next = add(from, dir);
    if (isTunnelEndpoint(next)) return true;
    return isConnectedTunnelStep(from, dir);
  }

  function move(dir) {
    if (won) return;

    const next = add(player, dir);
    if (terrainAt(next) === TILE.WALL) return;

    const currentObj = objectAt(player);
    const nextObj = objectAt(next);
    const before = snapshot();

    if (currentObj) {
      if (!canTraverseTunnel(player, dir)) return;
      player = next;
      commitMove(before, dir);
      return;
    }

    if (!nextObj) {
      if (!isWalkableTerrain(next)) return;
      player = next;
      commitMove(before, dir);
      return;
    }

    if (canStartTunnel(next, dir)) {
      player = next;
      commitMove(before, dir);
      return;
    }

    const pushTarget = add(next, dir);
    if (!canHoldObject(pushTarget)) return;

    objects.delete(key(next));
    objects.set(key(pushTarget), nextObj);
    player = next;
    commitMove(before, dir);
  }

  function commitMove(before, dir) {
    history.push(before);
    moves += 1;
    moveLog.push(dir.name);
    if (terrainAt(player) === TILE.GOAL) {
      won = true;
      statusTextEl.textContent = nextLevelText();
      scheduleNextLevel();
    } else {
      statusTextEl.textContent = "Arrow keys or WASD to move.";
    }
    render();
  }

  function undo() {
    const previous = history.pop();
    if (previous) restore(previous);
  }

  function reset() {
    loadLevel(levelIndex);
  }

  function clearNextLevelTimer() {
    if (nextLevelTimer) clearTimeout(nextLevelTimer);
    if (nextLevelInterval) clearInterval(nextLevelInterval);
    nextLevelTimer = null;
    nextLevelInterval = null;
    nextLevelRemaining = 0;
    clearPopupEl.classList.add("hidden");
  }

  function nextLevelText() {
    if (levelIndex >= levels.length - 1) return "MVP clear.";
    return "Level clear. Next level in 5s.";
  }

  function scheduleNextLevel() {
    clearNextLevelTimer();
    showClearPopup();
    if (levelIndex >= levels.length - 1) return;
    nextLevelRemaining = 5;
    updateClearCountdown();
    nextLevelInterval = setInterval(() => {
      nextLevelRemaining -= 1;
      updateClearCountdown();
      if (nextLevelRemaining <= 0 && nextLevelInterval) {
        clearInterval(nextLevelInterval);
        nextLevelInterval = null;
      }
    }, 1000);
    nextLevelTimer = setTimeout(() => {
      loadLevel(levelIndex + 1);
    }, 5000);
  }

  function showClearPopup() {
    clearSummaryEl.textContent = `Level ${levelIndex + 1} clear · ${moves} moves`;
    clearPopupEl.classList.remove("hidden");
    updateClearCountdown();
  }

  function updateClearCountdown() {
    if (levelIndex >= levels.length - 1) {
      clearCountdownEl.textContent = "MVP complete.";
      nextLevelBtn.textContent = "Replay Level";
      return;
    }
    clearCountdownEl.textContent = `Next level in ${nextLevelRemaining || 5}s`;
    nextLevelBtn.textContent = "Next Level";
  }

  function goNextLevelNow() {
    if (levelIndex >= levels.length - 1) {
      reset();
      return;
    }
    loadLevel(levelIndex + 1);
  }

  function moveSymbol(name) {
    if (name === "up") return "↑";
    if (name === "down") return "↓";
    if (name === "left") return "←";
    if (name === "right") return "→";
    return name;
  }

  function renderMoveLog() {
    moveCountTextEl.textContent = String(moves);
    moveLogEl.innerHTML = "";
    moveLog.forEach((name) => {
      const item = document.createElement("li");
      item.textContent = moveSymbol(name);
      moveLogEl.appendChild(item);
    });
    moveLogEl.scrollTop = moveLogEl.scrollHeight;
  }

  function exportStepText() {
    const arrows = moveLog.map(moveSymbol);
    return [
      `Level ${levelIndex + 1}: ${levels[levelIndex].title}`,
      `Moves: ${moves}`,
      `Solution: ${arrows.join(", ")}`,
      `Raw: ${moveLog.join(", ")}`,
    ].join("\n");
  }

  function downloadStepText(text) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sokopipe-level-${levelIndex + 1}-steps.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function exportSteps() {
    const text = exportStepText();
    try {
      await navigator.clipboard.writeText(text);
      statusTextEl.textContent = "Steps copied to clipboard.";
    } catch (_) {
      downloadStepText(text);
      statusTextEl.textContent = "Steps exported as text file.";
    }
  }

  function posToWorld(pos, cols, rows) {
    return {
      x: pos.c - (cols - 1) / 2,
      z: pos.r - (rows - 1) / 2,
    };
  }

  function clearBoardGroup() {
    while (boardGroup.children.length) {
      boardGroup.remove(boardGroup.children[0]);
    }
  }

  function addMesh(mesh, castShadow) {
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    boardGroup.add(mesh);
  }

  function materialWithOpacity(material, opacity) {
    if (opacity >= 1) return material;
    const clone = material.clone();
    clone.transparent = true;
    clone.opacity = opacity;
    clone.depthWrite = false;
    return clone;
  }

  function makeTextPlate(text, width, height, color = "#2d285f") {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.font = "900 46px Inter, system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = 20;
    return mesh;
  }

  function addPlayerU(group) {
    const left = new THREE.Mesh(geometries.playerUBar, materials.rim);
    const right = new THREE.Mesh(geometries.playerUBar, materials.rim);
    const base = new THREE.Mesh(geometries.playerUBase, materials.rim);
    left.position.set(-0.15, 0.425, 0);
    right.position.set(0.15, 0.425, 0);
    base.position.set(0, 0.425, 0.13);
    group.add(left, right, base);
  }

  function makeCubeBlock(material) {
    const mesh = new THREE.Mesh(geometries.box, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function makeMarkedCube(material, markers) {
    const group = new THREE.Group();
    const body = makeCubeBlock(material);
    group.add(body);

    markers.forEach((geometry) => {
      const marker = new THREE.Mesh(geometry, materials.rim);
      marker.position.y = 0.385;
      marker.castShadow = true;
      marker.receiveShadow = true;
      group.add(marker);
    });
    return group;
  }

  function makeObject(type, materialOverride) {
    if (type === TILE.BOX) return makeMarkedCube(materialOverride || materials.box, [geometries.markerDot]);
    if (type === TILE.PIPE_H) return makeMarkedCube(materialOverride || materials.pipeH, [geometries.markerH]);
    if (type === TILE.PIPE_V) return makeMarkedCube(materialOverride || materials.pipeV, [geometries.markerV]);
    if (type === TILE.CONNECTOR) return makeMarkedCube(materialOverride || materials.connector, [geometries.markerH, geometries.markerV]);
    return null;
  }

  function getRouteState() {
    const directions = [
      { r: -1, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
    ];
    const nodes = new Map();
    const edges = [];

    objects.forEach((type, posKey) => {
      if (isTunnelObject(type)) nodes.set(posKey, { type, pos: parseKey(posKey), links: new Set() });
    });

    nodes.forEach((node, posKey) => {
      directions.forEach((dir) => {
        if (!isPipeCompatible(node.type, dir)) return;
        const next = add(node.pos, dir);
        const nextKey = key(next);
        const nextType = objectAt(next);

        if (isTunnelObject(nextType) && isPipeCompatible(nextType, { r: -dir.r, c: -dir.c })) {
          node.links.add(nextKey);
          nodes.get(nextKey)?.links.add(posKey);
          edges.push({ from: node.pos, to: next, dir });
          return;
        }

        if (terrainAt(next) === TILE.GOAL && !nextType) {
          const goalKey = `g:${nextKey}`;
          if (!nodes.has(goalKey)) nodes.set(goalKey, { type: TILE.GOAL, pos: next, links: new Set() });
          node.links.add(goalKey);
          nodes.get(goalKey).links.add(posKey);
          edges.push({ from: node.pos, to: next, dir });
        }
      });
    });

    const connectedKeys = new Set();
    const goalKeys = new Set();
    const connectedEdges = [];
    const components = [];
    const visited = new Set();

    nodes.forEach((_, startKey) => {
      if (visited.has(startKey)) return;
      const stack = [startKey];
      const component = [];
      visited.add(startKey);

      while (stack.length) {
        const currentKey = stack.pop();
        const current = nodes.get(currentKey);
        component.push(currentKey);
        current.links.forEach((nextKey) => {
          if (visited.has(nextKey)) return;
          visited.add(nextKey);
          stack.push(nextKey);
        });
      }

      const hasEntryPipe = component.some((nodeKey) => {
        const type = nodes.get(nodeKey).type;
        return type === TILE.PIPE_H || type === TILE.PIPE_V;
      });
      const straightPipeCount = component.filter((nodeKey) => {
        const type = nodes.get(nodeKey).type;
        return type === TILE.PIPE_H || type === TILE.PIPE_V;
      }).length;
      const hasGoal = component.some((nodeKey) => nodes.get(nodeKey).type === TILE.GOAL);
      if (!hasEntryPipe || (!hasGoal && straightPipeCount < 2)) return;

      component.forEach((nodeKey) => {
        if (nodeKey.startsWith("g:")) goalKeys.add(nodeKey.slice(2));
        else connectedKeys.add(nodeKey);
      });
      components.push(component.map((nodeKey) => nodes.get(nodeKey)));
    });

    edges.forEach((edge) => {
      const fromKey = key(edge.from);
      const toKey = key(edge.to);
      if (connectedKeys.has(fromKey) && (connectedKeys.has(toKey) || goalKeys.has(toKey))) {
        connectedEdges.push(edge);
      }
    });

    return {
      connectedKeys,
      goalKeys,
      connectedEdges,
      components,
      active: connectedKeys.has(key(player)) || goalKeys.has(key(player)),
    };
  }

  function parseKey(posKey) {
    const [r, c] = posKey.split(",").map(Number);
    return { r, c };
  }

  function renderWalls(cols, rows) {
    const mask = terrain.map((row, r) => row.map((tile, c) => tile === TILE.WALL && shouldRenderWall({ r, c })));
    const visited = terrain.map((row) => row.map(() => false));

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < terrain[r].length; c += 1) {
        if (!mask[r][c] || visited[r][c]) continue;

        let width = 1;
        while (c + width < terrain[r].length && mask[r][c + width] && !visited[r][c + width]) {
          width += 1;
        }

        let height = 1;
        let canGrow = true;
        while (r + height < rows && canGrow) {
          for (let x = c; x < c + width; x += 1) {
            if (!mask[r + height][x] || visited[r + height][x]) {
              canGrow = false;
              break;
            }
          }
          if (canGrow) height += 1;
        }

        for (let y = r; y < r + height; y += 1) {
          for (let x = c; x < c + width; x += 1) {
            visited[y][x] = true;
          }
        }

        const start = posToWorld({ r, c }, cols, rows);
        const end = posToWorld({ r: r + height - 1, c: c + width - 1 }, cols, rows);
        const wall = new THREE.Mesh(
          makeRoundedBoxGeometry(width - 0.02, 0.42, height - 0.02, 0.09, 5),
          materials.wall
        );
        wall.position.set((start.x + end.x) / 2, 0.21, (start.z + end.z) / 2);
        addMesh(wall, true);
      }
    }
  }

  function addTunnelBridge(from, to, dir, cols, rows, routeState) {
    const fromWorld = posToWorld(from, cols, rows);
    const toWorld = posToWorld(to, cols, rows);
    const horizontal = isHorizontal(dir);
    const bridge = new THREE.Mesh(
      makeRoundedBoxGeometry(horizontal ? 1.06 : 0.72, 0.68, horizontal ? 0.72 : 1.06, 0.085, 5),
      materialWithOpacity(materials.connected, routeState.active ? 0.42 : 1)
    );
    bridge.position.set((fromWorld.x + toWorld.x) / 2, 0.34, (fromWorld.z + toWorld.z) / 2);
    addMesh(bridge, false);
  }

  function renderTunnelBridges(cols, rows, routeState) {
    const rendered = new Set();
    routeState.connectedEdges.forEach((edge) => {
      const edgeKey = [key(edge.from), key(edge.to)].sort().join("|");
      if (rendered.has(edgeKey)) return;
      rendered.add(edgeKey);
      addTunnelBridge(edge.from, edge.to, edge.dir, cols, rows, routeState);
    });
  }

  function renderConnectedRoutes(cols, rows, routeState) {
    routeState.components.forEach((component) => {
      const componentKeys = new Set(component.map((node) => node.type === TILE.GOAL ? `g:${key(node.pos)}` : key(node.pos)));
      const routeMaterial = materialWithOpacity(materials.connected, routeState.active ? 0.42 : 1);

      routeState.connectedEdges.forEach((edge) => {
        const fromKey = key(edge.from);
        const toGridKey = key(edge.to);
        const toKey = routeState.goalKeys.has(toGridKey) ? `g:${toGridKey}` : toGridKey;
        if (!componentKeys.has(fromKey) || !componentKeys.has(toKey)) return;
        addTunnelBridge(edge.from, edge.to, edge.dir, cols, rows, routeState);
      });

      component.forEach((node) => {
        const world = posToWorld(node.pos, cols, rows);
        const body = new THREE.Mesh(geometries.goalBlock, routeMaterial);
        body.position.set(world.x, 0.34, world.z);
        addMesh(body, true);

        if (node.type === TILE.GOAL) {
          return;
        }

        const markers =
          node.type === TILE.PIPE_H ? [geometries.markerH] :
          node.type === TILE.PIPE_V ? [geometries.markerV] :
          [geometries.markerH, geometries.markerV];
        markers.forEach((geometry) => {
          const marker = new THREE.Mesh(geometry, materialWithOpacity(materials.rim, routeState.active ? 0.5 : 1));
          marker.position.set(world.x, 0.725, world.z);
          addMesh(marker, false);
        });
      });
    });
  }

  function renderGoalLabels(cols, rows, routeState) {
    terrain.forEach((row, r) => {
      row.forEach((tile, c) => {
        if (tile !== TILE.GOAL) return;
        const pos = { r, c };
        const world = posToWorld(pos, cols, rows);
        const connected = routeState.goalKeys.has(key(pos));
        const label = makeTextPlate("GOAL", 0.68, 0.26, connected ? "#12391e" : "#fff6fb");
        label.position.set(world.x, 0.92, world.z);
        boardGroup.add(label);
      });
    });
  }

  function render() {
    const rows = terrain.length;
    const cols = Math.max(...terrain.map((row) => row.length));
    const routeState = getRouteState();
    clearBoardGroup();

    terrain.forEach((row, r) => {
      row.forEach((_, c) => {
        if (!shouldRenderGround({ r, c })) return;
        const world = posToWorld({ r, c }, cols, rows);
        const ground = new THREE.Mesh(geometries.ground, materials.ground);
        ground.position.set(world.x, -0.13, world.z);
        addMesh(ground, false);
      });
    });

    renderWalls(cols, rows);

    terrain.forEach((row, r) => {
      row.forEach((tile, c) => {
        const world = posToWorld({ r, c }, cols, rows);
        if (tile === TILE.WALL) return;

        if (tile !== TILE.GOAL) return;

        const goalConnected = routeState.goalKeys.has(key({ r, c }));
        if (goalConnected) return;

        const goalMaterial = materials.goalInvalid;
        const goal = new THREE.Mesh(
          geometries.goalBlock,
          goalMaterial
        );
        goal.position.set(world.x, 0.34, world.z);
        addMesh(goal, true);

      });
    });

    renderConnectedRoutes(cols, rows, routeState);

    objects.forEach((type, posKey) => {
      if (routeState.connectedKeys.has(posKey)) return;
      const [r, c] = posKey.split(",").map(Number);
      const world = posToWorld({ r, c }, cols, rows);
      const obj = makeObject(type);
      obj.position.set(world.x, 0.34, world.z);
      addMesh(obj, true);
    });

    const pWorld = posToWorld(player, cols, rows);
    const playerTunnelType = objectAt(player);
    const playerOnRoute = playerTunnelType || routeState.goalKeys.has(key(player));
    const playerMesh = new THREE.Mesh(geometries.player, materials.player);
    const playerGroup = new THREE.Group();
    playerMesh.position.set(0, 0, 0);
    playerMesh.castShadow = true;
    playerMesh.receiveShadow = true;
    playerGroup.add(playerMesh);
    addPlayerU(playerGroup);
    playerGroup.position.set(pWorld.x, playerOnRoute ? 0.8 : 0.38, pWorld.z);
    boardGroup.add(playerGroup);

    renderGoalLabels(cols, rows, routeState);

    boardGroup.rotation.y = 0;
    cameraState.viewHeight = Math.max(rows + 2.4, (cols + 2.4) / Math.max(viewportEl.clientWidth / Math.max(viewportEl.clientHeight, 1), 1));
    cameraState.distance = Math.max(10, Math.max(rows, cols) * 1.08);
    levelTitleEl.textContent = `Level ${levelIndex + 1}: ${levels[levelIndex].title}`;
    levelMetaEl.textContent = `Moves ${moves}`;
    renderMoveLog();
    renderLevelList();
    updateCamera();
    resizeRenderer();
  }

  function renderLevelList() {
    levelListEl.innerHTML = "";
    levels.forEach((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-button";
      if (index === levelIndex) button.classList.add("active");
      button.textContent = String(index + 1);
      button.addEventListener("click", () => loadLevel(index));
      levelListEl.appendChild(button);
    });
  }

  function resizeRenderer() {
    const width = viewportEl.clientWidth;
    const height = viewportEl.clientHeight;
    if (!width || !height) return;

    renderer.setSize(width, height, false);
    const aspect = width / height;
    const viewHeight = cameraState.viewHeight;
    camera.left = (-viewHeight * aspect) / 2;
    camera.right = (viewHeight * aspect) / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
  }

  function updateCamera() {
    const horizontalDistance = Math.cos(cameraState.pitch) * cameraState.distance;
    camera.position.set(
      Math.sin(cameraState.yaw) * horizontalDistance,
      Math.sin(cameraState.pitch) * cameraState.distance,
      Math.cos(cameraState.yaw) * horizontalDistance
    );
    camera.lookAt(0, 0, 0);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  document.addEventListener("keydown", (event) => {
    const dir = DIRS[event.code];
    if (!dir) return;
    event.preventDefault();
    move(dir);
  });

  window.addEventListener("resize", resizeRenderer);
  undoBtn.addEventListener("click", undo);
  resetBtn.addEventListener("click", reset);
  panelUndoBtn.addEventListener("click", undo);
  panelResetBtn.addEventListener("click", reset);
  upBtn.addEventListener("click", () => move(DIRS.ArrowUp));
  downBtn.addEventListener("click", () => move(DIRS.ArrowDown));
  leftBtn.addEventListener("click", () => move(DIRS.ArrowLeft));
  rightBtn.addEventListener("click", () => move(DIRS.ArrowRight));
  exportStepsBtn.addEventListener("click", exportSteps);
  clearExportBtn.addEventListener("click", exportSteps);
  nextLevelBtn.addEventListener("click", goNextLevelNow);

  window.SOKO_PIPE_DEBUG = {
    loadLevel,
    moveByKey(code) {
      const dir = DIRS[code];
      if (dir) move(dir);
    },
    getState() {
      return {
        levelIndex,
        player: { ...player },
        objects: Array.from(objects.entries()),
        moves,
        moveLog: [...moveLog],
        won,
      };
    },
  };

  loadLevel(0);
  animate();
})();
