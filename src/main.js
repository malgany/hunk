import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { defaultMapConfig } from "./map-config.js";

const sceneElement = document.querySelector("[data-scene]");
const statusElement = document.querySelector("#status");
const crosshairElement = document.querySelector("[data-crosshair]");
const startScreen = document.querySelector("#startScreen");
const startButton = document.querySelector("#startButton");
const mapCanvas = document.querySelector("#mapCanvas");
const mapViewport = document.querySelector("#mapViewport");
const mapStatus = document.querySelector("#mapStatus");
const mapFeedback = document.querySelector("#mapFeedback");
const mapHudElement = document.querySelector("[data-map-hud]");
const mapZoomOutButton = document.querySelector("#mapZoomOut");
const mapZoomResetButton = document.querySelector("#mapZoomReset");
const mapZoomInButton = document.querySelector("#mapZoomIn");
const applyMapButton = document.querySelector("#applyMapButton");
const showTileEdgesInput = document.querySelector("#showTileEdges");
const showTileEdgesValue = document.querySelector("#showTileEdgesValue");
const mapCoveredInput = document.querySelector("#mapCovered");
const mapCoveredValue = document.querySelector("#mapCoveredValue");
const cameraStatus = document.querySelector("#cameraStatus");
const freeCameraInput = document.querySelector("#freeCamera");
const freeCameraValue = document.querySelector("#freeCameraValue");
const cameraSideLeftInput = document.querySelector("#cameraSideLeft");
const cameraSideLeftValue = document.querySelector("#cameraSideLeftValue");
const cameraOrbitInput = document.querySelector("#cameraOrbit");
const cameraOffsetXInput = document.querySelector("#cameraOffsetX");
const cameraOffsetYInput = document.querySelector("#cameraOffsetY");
const cameraOffsetZInput = document.querySelector("#cameraOffsetZ");
const cameraOrbitValue = document.querySelector("#cameraOrbitValue");
const cameraOffsetXValue = document.querySelector("#cameraOffsetXValue");
const cameraOffsetYValue = document.querySelector("#cameraOffsetYValue");
const cameraOffsetZValue = document.querySelector("#cameraOffsetZValue");
const copyCameraButton = document.querySelector("#copyCameraButton");
const movementSelect = document.querySelector("#movementSelect");
const movementStatus = document.querySelector("#movementStatus");
const weaponSelect = document.querySelector("#weaponSelect");
const weaponStatus = document.querySelector("#weaponStatus");
const offsetXInput = document.querySelector("#offsetX");
const offsetYInput = document.querySelector("#offsetY");
const offsetZInput = document.querySelector("#offsetZ");
const weaponScaleInput = document.querySelector("#weaponScale");
const offsetXValue = document.querySelector("#offsetXValue");
const offsetYValue = document.querySelector("#offsetYValue");
const offsetZValue = document.querySelector("#offsetZValue");
const weaponScaleValue = document.querySelector("#weaponScaleValue");
const copyInfoButton = document.querySelector("#copyInfoButton");
const colorPanel = document.querySelector("#colorPanel");
const colorStatus = document.querySelector("#colorStatus");
const resetColorsButton = document.querySelector("#resetColorsButton");
const copyColorsButton = document.querySelector("#copyColorsButton");
const modelUrl = new URL("../assets/HUNK.glb", import.meta.url).href;
const gunPackPath = "../assets/Styloo Guns Asset Pack GLTF FBX V1.1/Normal version Color and NormalMap/GLB/";
const mapSize = 16;
const mapCenter = mapSize / 2;
const platformTileSize = 5;
const platformThickness = 0.18;
const platformTileGap = 0.04;
const platformWallTilesHigh = 3;
const platformWallHeight = platformTileSize * platformWallTilesHigh;
const platformWallThickness = 0.32;
const wallOcclusionOpacity = 0.16;
const cameraCollisionRadius = 1.05;
const cameraCollisionWallPadding = 0.42;
const cameraCollisionReturnDamping = 12;
const cameraCollisionSearchSteps = 14;
const cameraCollisionSearchIterations = 8;
const cameraCollisionProbeOffsets = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0.7071, 0.7071],
  [-0.7071, 0.7071],
  [0.7071, -0.7071],
  [-0.7071, -0.7071],
];
const mapZoomMin = 1;
const mapZoomMax = 3.5;
const mapZoomStep = 0.25;
const mapPlayerMagnetRadius = 0.16;
const anchoredCameraPreset = {
  baseOrbitDegrees: 178,
  cameraOffset: new THREE.Vector3(-4.445, 3.165, -9.843),
  targetOffset: new THREE.Vector3(0, 2.843, 2.373),
};
const defaultCameraOffset = {
  x: 0.2,
  y: 0.6,
  z: 0.2,
};
const defaultPlayerAimPitchRadians = THREE.MathUtils.degToRad(7.63);
const freeCameraMoveSpeed = 12;
const freeCameraWheelSpeed = 0.018;
const playerWalkSpeed = 4.2;
const playerRunSpeed = 7.2;
const playerCollisionRadius = 0.72;
const playerMouseYawSensitivity = 0.0028;
const playerMousePitchSensitivity = 0.0022;
const playerMousePitchLimit = THREE.MathUtils.degToRad(22);
const defaultMovementId = "Idle_A";
const defaultWeaponId = "pew";
const rogueTextureAtlas = {
  size: 1024,
  rows: 8,
  columns: 8,
  cellSize: 128,
};
const roguePaletteControls = [
  { label: "Pele", slots: ["r6c0", "r7c0"] },
  { label: "Cabelo", slots: ["r6c1", "r7c1", "r7c2"] },
  { label: "Roupas 1", slots: ["r4c1", "r5c1"] },
  { label: "Roupas 2", slots: ["r4c0", "r4c7", "r5c0"] },
  { label: "Roupas 3", slots: ["r2c3", "r2c7", "r3c3", "r3c7", "r6c5", "r6c6", "r7c5", "r7c6"] },
  { label: "Roupas 4", slots: ["r5c7", "r6c3", "r7c3"] },
];
const rogueDefaultSlots = {
  r2c3: "#212121",
  r2c7: "#212121",
  r3c3: "#212121",
  r3c7: "#212121",
  r4c0: "#343A4B",
  r4c1: "#212121",
  r4c7: "#343A4B",
  r5c0: "#343A4B",
  r5c1: "#212121",
  r5c7: "#343A4B",
  r6c0: "#212121",
  r6c1: "#343A4B",
  r6c3: "#343A4B",
  r6c5: "#212121",
  r6c6: "#212121",
  r7c0: "#212121",
  r7c1: "#343A4B",
  r7c2: "#343A4B",
  r7c3: "#343A4B",
  r7c5: "#212121",
  r7c6: "#212121",
};
const weaponOptions = [
  weapon("mac10", "MAC-10", "mac10.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("ak47", "AK-47", "ak47.glb", { position: [0.01, 0.02, 0.005], scale: 0.92 }),
  weapon("ak47variant", "AK-47 Variant", "ak47variant.glb", { position: [0.01, 0.02, 0.005], scale: 0.92 }),
  weapon("awp", "AWP", "awp.glb", { position: [0.01, 0.02, 0.005], scale: 0.62 }),
  weapon("shotgun", "Shotgun", "shotgun.glb", { position: [0.01, 0.02, 0.005], scale: 1.05 }),
  weapon("pew", "Pew pistol", "pew.glb", { position: [0.095, 0.07, 0.04], scale: 4 }),
  weapon("nade", "Grenade", "nade_low.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("nadevariant", "Grenade variant", "nadevariant_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.6 }),
  weapon("flashbang", "Flashbang", "flashbang_low.glb", { position: [0.01, 0.02, 0.005], scale: 3 }),
  weapon("smoke", "Smoke grenade", "smoke_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.7 }),
  weapon("incendiary", "Incendiary grenade", "incendiary_low.glb", { position: [0.01, 0.02, 0.005], scale: 2.7 }),
];
const weaponById = new Map(weaponOptions.map((option) => [option.id, option]));
const animationFiles = [
  "general.glb",
  "movement-basic.glb",
  "movement-advanced.glb",
  "combat-melee.glb",
  "combat-ranged.glb",
  "simulation.glb",
  "special.glb",
  "tools.glb",
];

const animationUrls = animationFiles.map(
  (fileName) => new URL(`../assets/animations/rig-medium/${fileName}`, import.meta.url).href,
);
const animationGroups = [
  {
    label: "Geral",
    options: [
      clip("Idle_A", true, { label: "Parado A" }),
      clip("Idle_B", true, { label: "Parado B" }),
      clip("Interact"),
      clip("PickUp"),
      clip("Use_Item"),
      clip("Throw"),
      clip("Hit_A"),
      clip("Hit_B"),
      clip("Death_A"),
      clip("Death_A_Pose", true),
      clip("Death_B"),
      clip("Death_B_Pose", true),
      clip("Spawn_Air"),
      clip("Spawn_Ground"),
      clip("T-Pose", true, { label: "T-Pose" }),
    ],
  },
  {
    label: "Movimento basico",
    options: [
      clip("Walking_A", true, { label: "Caminhada A" }),
      clip("Walking_B", true, { label: "Caminhada B" }),
      clip("Walking_C", true, { label: "Caminhada C" }),
      clip("Running_A", true, { label: "Corrida A", timeScale: 1.12 }),
      clip("Running_B", true, { label: "Corrida B", timeScale: 1.12 }),
      clip("Jump_Idle", true, { label: "Pulo parado" }),
      clip("Jump_Start", false, { label: "Comecar pulo" }),
      clip("Jump_Land", false, { label: "Pousar" }),
      clip("Jump_Full_Short", false, { label: "Pulo curto" }),
      clip("Jump_Full_Long", false, { label: "Pulo longo" }),
    ],
  },
  {
    label: "Movimento avancado",
    options: [
      clip("Walking_Backwards", true),
      clip("Running_Strafe_Left", true),
      clip("Running_Strafe_Right", true),
      clip("Running_HoldingBow", true),
      clip("Running_HoldingRifle", true),
      clip("Sneaking", true),
      clip("Crouching", true),
      clip("Crawling", true),
      clip("Dodge_Backward"),
      clip("Dodge_Forward"),
      clip("Dodge_Left"),
      clip("Dodge_Right"),
    ],
  },
  {
    label: "Combate melee",
    options: [
      clip("Melee_1H_Attack_Chop"),
      clip("Melee_1H_Attack_Jump_Chop"),
      clip("Melee_1H_Attack_Slice_Diagonal"),
      clip("Melee_1H_Attack_Slice_Horizontal"),
      clip("Melee_1H_Attack_Stab"),
      clip("Melee_2H_Attack_Chop"),
      clip("Melee_2H_Attack_Slice"),
      clip("Melee_2H_Attack_Spin"),
      clip("Melee_2H_Attack_Spinning"),
      clip("Melee_2H_Attack_Stab"),
      clip("Melee_2H_Idle", true),
      clip("Melee_Block"),
      clip("Melee_Block_Attack"),
      clip("Melee_Block_Hit"),
      clip("Melee_Blocking", true),
      clip("Melee_Dualwield_Attack_Chop"),
      clip("Melee_Dualwield_Attack_Slice"),
      clip("Melee_Dualwield_Attack_Stab"),
      clip("Melee_Unarmed_Attack_Kick"),
      clip("Melee_Unarmed_Attack_Punch_A"),
      clip("Melee_Unarmed_Idle", true),
    ],
  },
  {
    label: "Combate ranged",
    options: [
      clip("Ranged_1H_Aiming", true),
      clip("Ranged_1H_Reload"),
      clip("Ranged_1H_Shoot"),
      clip("Ranged_1H_Shooting", true),
      clip("Ranged_2H_Aiming", true),
      clip("Ranged_2H_Reload"),
      clip("Ranged_2H_Shoot"),
      clip("Ranged_2H_Shooting", true),
      clip("Ranged_Bow_Aiming_Idle", true),
      clip("Ranged_Bow_Draw"),
      clip("Ranged_Bow_Draw_Up"),
      clip("Ranged_Bow_Idle", true),
      clip("Ranged_Bow_Release"),
      clip("Ranged_Bow_Release_Up"),
      clip("Ranged_Magic_Raise"),
      clip("Ranged_Magic_Shoot"),
      clip("Ranged_Magic_Spellcasting", true),
      clip("Ranged_Magic_Spellcasting_Long"),
      clip("Ranged_Magic_Summon"),
    ],
  },
  {
    label: "Simulacao",
    options: [
      clip("Cheering"),
      clip("Lie_Down"),
      clip("Lie_Idle", true),
      clip("Lie_StandUp"),
      clip("Push_Ups", true),
      clip("Sit_Chair_Down"),
      clip("Sit_Chair_Idle", true),
      clip("Sit_Chair_StandUp"),
      clip("Sit_Floor_Down"),
      clip("Sit_Floor_Idle", true),
      clip("Sit_Floor_StandUp"),
      clip("Sit_Ups", true),
      clip("Waving"),
    ],
  },
  {
    label: "Ferramentas",
    options: [
      clip("Chop"),
      clip("Chopping", true),
      clip("Dig"),
      clip("Digging", true),
      clip("Fishing_Bite"),
      clip("Fishing_Cast"),
      clip("Fishing_Catch"),
      clip("Fishing_Idle", true),
      clip("Fishing_Reeling", true),
      clip("Fishing_Struggling", true),
      clip("Fishing_Tug"),
      clip("Hammer"),
      clip("Hammering", true),
      clip("Holding_A", true),
      clip("Holding_B", true),
      clip("Holding_C", true),
      clip("Lockpick"),
      clip("Lockpicking", true),
      clip("Pickaxe"),
      clip("Pickaxing", true),
      clip("Saw"),
      clip("Sawing", true),
      clip("Work_A"),
      clip("Work_B"),
      clip("Work_C"),
      clip("Working_A", true),
      clip("Working_B", true),
      clip("Working_C", true),
    ],
  },
  {
    label: "Especial",
    options: [
      clip("EXPERIMENTAL_Medium_Transform"),
      clip("Skeletons_Awaken_Floor"),
      clip("Skeletons_Awaken_Floor_Long"),
      clip("Skeletons_Awaken_Standing"),
      clip("Skeletons_Death"),
      clip("Skeletons_Death_Pose", true),
      clip("Skeletons_Death_Resurrect"),
      clip("Skeletons_Idle", true),
      clip("Skeletons_Inactive_Floor_Pose", true),
      clip("Skeletons_Inactive_Standing_Pose", true),
      clip("Skeletons_Spawn_Ground"),
      clip("Skeletons_Taunt"),
      clip("Skeletons_Taunt_Longer"),
      clip("Skeletons_Walking", true),
    ],
  },
  {
    label: "Combinacao",
    options: [
      clip("Combo_Walking_A_Ranged_1H_Shooting", true, {
        label: "Andar + tiro 1H",
        combo: {
          lower: "Walking_A",
          upper: "Ranged_1H_Shooting",
        },
      }),
      clip("Combo_Running_A_Ranged_1H_Shooting", true, {
        label: "Correr + tiro 1H",
        combo: {
          lower: "Running_A",
          upper: "Ranged_1H_Shooting",
        },
      }),
      clip("Combo_Running_B_Ranged_1H_Shooting", true, {
        label: "Correr B + tiro 1H",
        combo: {
          lower: "Running_B",
          upper: "Ranged_1H_Shooting",
        },
      }),
    ],
  },
];
const movementOptions = animationGroups.flatMap((group) =>
  group.options.map((option) => ({ ...option, group: group.label })),
);
const movementById = new Map(movementOptions.map((option) => [option.id, option]));
const animationActions = new Map();
const sourceAnimationClips = new Map();
const weaponCache = new Map();
const paletteMaterials = new Set();
const maskAtlasMaterials = new Set();

const lowerBodyBones = new Set([
  "upperleg.l",
  "upperleg.r",
  "lowerleg.l",
  "lowerleg.r",
  "foot.l",
  "foot.r",
  "toes.l",
  "toes.r",
]);
const upperBodyBones = new Set([
  "root",
  "hips",
  "spine",
  "chest",
  "head",
  "upperarm.l",
  "upperarm.r",
  "lowerarm.l",
  "lowerarm.r",
  "wrist.l",
  "wrist.r",
  "hand.l",
  "hand.r",
  "handslot.l",
  "handslot.r",
]);

let mixer = null;
let activeActions = [];
let activeMovementId = null;
let characterModel = null;
let heldSlot = null;
let currentHeldItem = null;
let activeWeapon = weaponById.get(defaultWeaponId) || weaponOptions[0];
let equipRequestId = 0;
let sourceCharacterTextureImage = null;
let sourceCharacterTextureSettings = null;
let activePaletteTexture = null;
let activeMaskPaletteTexture = null;
let paletteDraft = createRoguePaletteDraft();
let mapEditorState = createInitialMapEditorState();
let cameraControlState = createCameraControlState();
let playerControlState = createPlayerControlState();
let platformGroup = null;
const wallOcclusionRaycaster = new THREE.Raycaster();
const wallOcclusionTarget = new THREE.Vector3();
const wallOccluders = new Set();
const transparentWallOccluders = new Set();
const cameraCollisionRaycaster = new THREE.Raycaster();
const cameraCollisionDirection = new THREE.Vector3();
const cameraCollisionRayDirection = new THREE.Vector3();
const cameraCollisionResolvedPosition = new THREE.Vector3();
const cameraCollisionProbePosition = new THREE.Vector3();
const playerMoveVector = new THREE.Vector3();
const playerForwardVector = new THREE.Vector3();
const playerRightVector = new THREE.Vector3();
const playerAnchorBox = new THREE.Box3();
const playerAnchorSize = new THREE.Vector3();
const playerAnchorCenter = new THREE.Vector3();
let sceneLoadStarted = false;

function clip(id, loop = false, options = {}) {
  return { id, loop, ...options };
}

function weapon(id, label, file, options = {}) {
  return {
    id,
    label,
    file,
    slotName: "handslot.r",
    url: new URL(`${gunPackPath}${file}`, import.meta.url).href,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    ...options,
  };
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151515);
scene.fog = new THREE.Fog(0x151515, 15, 34);

const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 120);
camera.position.set(7, 5.2, 9.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
sceneElement.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.45;
controls.minDistance = 4;
controls.maxDistance = 22;
controls.target.set(0, 2.1, 0);
controls.addEventListener("start", () => {
  controls.autoRotate = false;
});

const ambientLight = new THREE.HemisphereLight(0xf7efd8, 0x24231f, 1.65);
const keyLight = new THREE.DirectionalLight(0xffedbd, 2.4);
keyLight.position.set(4.5, 8, 5.5);
const rimLight = new THREE.DirectionalLight(0xd6e6ff, 0.85);
rimLight.position.set(-5, 4, -4);
scene.add(ambientLight, keyLight, rimLight);

platformGroup = createPlatform(createAppliedMapSnapshot());
scene.add(platformGroup);
collectWallOccluders(platformGroup);

const loader = new GLTFLoader();
populateMovementSelect();
populateWeaponSelect();
setupMapEditor();
setupCameraControls();
setupAttachmentControls();
renderColorPanel();
setupColorControls();
setupStartScreen();

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(sceneElement);
resize();

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();

  if (!cameraControlState.freeCamera) {
    updatePlayerControls(delta);
  }

  if (mixer) {
    mixer.update(delta);
  }

  if (cameraControlState.freeCamera) {
    updateFreeCamera(delta);
  } else {
    controls.update(delta);
  }

  updateWallOcclusion();
  renderer.render(scene, camera);
});

function setupStartScreen() {
  if (!startScreen || !startButton) {
    startGame();
    return;
  }

  startButton.addEventListener("click", startGame, { once: true });
}

function startGame() {
  if (sceneLoadStarted) {
    return;
  }

  sceneLoadStarted = true;

  if (startButton) {
    startButton.disabled = true;
  }

  document.body.classList.add("has-started");

  if (startScreen) {
    startScreen.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      startScreen.hidden = true;
    }, 320);
  }

  loadScene();
}

async function loadScene() {
  try {
    setStatus("Carregando modelo e movimentos...");
    setMovementStatus("Carregando");
    setWeaponStatus("Arma: carregando");
    movementSelect.disabled = true;
    weaponSelect.disabled = true;
    setAttachmentControlsEnabled(false);

    const [modelGltf, ...animationGltfs] = await Promise.all([
      loadGltf(modelUrl),
      ...animationUrls.map((url) => loadGltf(url)),
    ]);

    characterModel = modelGltf.scene;
    prepareModel(characterModel);
    applyCharacterPalette();
    scene.add(characterModel);

    fitModelToPlatform(characterModel);
    positionCharacterOnMap(mapEditorState.appliedPlayerPosition);
    applyPlayerYaw();
    heldSlot = findObjectByName(characterModel, activeWeapon.slotName);
    await equipWeapon(activeWeapon.id);
    frameScene();
    setupAnimationMixer(characterModel, animationGltfs);
    movementSelect.disabled = false;
    weaponSelect.disabled = false;
    setAttachmentControlsEnabled(true);
    movementSelect.value = defaultMovementId;
    playMovement(defaultMovementId, { restart: true });

    setStatus("Carregado", "done");
    syncCrosshair();
    window.setTimeout(() => hideStatus(), 550);
  } catch (error) {
    console.error(error);
    setStatus("Nao foi possivel carregar o modelo", "error");
    setMovementStatus("Erro ao carregar");
    syncCrosshair();
  }
}

function loadGltf(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

async function equipWeapon(weaponId) {
  const nextWeapon = weaponById.get(weaponId) || weaponOptions[0];
  const requestId = ++equipRequestId;
  activeWeapon = nextWeapon;
  weaponSelect.value = nextWeapon.id;
  updateAttachmentControls();

  if (!heldSlot) {
    setWeaponStatus(`Slot ${nextWeapon.slotName} nao encontrado`);
    return null;
  }

  setWeaponStatus(`Carregando ${nextWeapon.label}`);

  try {
    const source = await loadWeapon(nextWeapon);
    if (requestId !== equipRequestId) {
      return null;
    }

    detachCurrentWeapon();
    currentHeldItem = source.clone(true);
    currentHeldItem.name = nextWeapon.label;
    prepareHeldItem(currentHeldItem);
    applyWeaponTransform();
    heldSlot.add(currentHeldItem);
    setWeaponStatus(`Arma: ${nextWeapon.label}`);
    return currentHeldItem;
  } catch (error) {
    console.error(error);
    setWeaponStatus(`Erro: ${nextWeapon.label}`);
    return null;
  }
}

async function loadWeapon(weaponOption) {
  if (!weaponCache.has(weaponOption.id)) {
    weaponCache.set(weaponOption.id, loadGltf(weaponOption.url).then((gltf) => gltf.scene));
  }

  return weaponCache.get(weaponOption.id);
}

function detachCurrentWeapon() {
  if (!currentHeldItem) {
    return;
  }

  currentHeldItem.removeFromParent();
  currentHeldItem = null;
}

function applyWeaponTransform() {
  if (!currentHeldItem || !activeWeapon) {
    return;
  }

  currentHeldItem.position.fromArray(activeWeapon.position);
  currentHeldItem.rotation.fromArray(activeWeapon.rotation);
  currentHeldItem.scale.setScalar(activeWeapon.scale);
}

function findObjectByName(root, objectName) {
  const names = new Set([
    objectName,
    objectName.replace(/\./g, "_"),
    objectName.replace(/\./g, ""),
  ]);
  let match = null;

  root.traverse((node) => {
    if (match || !node.name) {
      return;
    }

    if (names.has(node.name)) {
      match = node;
    }
  });

  return match;
}

function prepareHeldItem(item) {
  item.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.castShadow = false;
    node.receiveShadow = false;
    node.frustumCulled = true;

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (!material) {
        continue;
      }

      if ("metalness" in material) {
        material.metalness = 0;
      }

      if ("roughness" in material) {
        material.roughness = 1;
      }

      material.needsUpdate = true;
    }
  });
}

function populateMovementSelect() {
  let currentGroup = null;
  let currentGroupElement = movementSelect;

  for (const option of movementOptions) {
    if (option.group !== currentGroup) {
      currentGroup = option.group;
      currentGroupElement = document.createElement("optgroup");
      currentGroupElement.label = currentGroup;
      movementSelect.append(currentGroupElement);
    }

    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = labelForMovement(option.id);
    currentGroupElement.append(element);
  }

  movementSelect.value = defaultMovementId;
  movementSelect.addEventListener("change", () => {
    playMovement(movementSelect.value, { restart: true });
  });
}

function populateWeaponSelect() {
  for (const option of weaponOptions) {
    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = option.label;
    weaponSelect.append(element);
  }

  weaponSelect.value = activeWeapon.id;
  weaponSelect.addEventListener("change", () => {
    equipWeapon(weaponSelect.value);
  });
  updateAttachmentControls();
}

function setupAttachmentControls() {
  offsetXInput.addEventListener("input", () => {
    setWeaponOffset(0, offsetXInput.value);
  });

  offsetYInput.addEventListener("input", () => {
    setWeaponOffset(1, offsetYInput.value);
  });

  offsetZInput.addEventListener("input", () => {
    setWeaponOffset(2, offsetZInput.value);
  });

  weaponScaleInput.addEventListener("input", () => {
    setWeaponScale(weaponScaleInput.value);
  });

  copyInfoButton.addEventListener("click", () => {
    copyAttachmentInfo();
  });
}

function setupMapEditor() {
  if (!mapCanvas || !mapViewport) {
    return;
  }

  mapCanvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  mapCanvas.addEventListener("pointerdown", handleMapPointerDown);
  mapCanvas.addEventListener("pointermove", handleMapPointerMove);
  mapCanvas.addEventListener("pointerleave", handleMapPointerLeave);
  mapCanvas.addEventListener("pointerup", handleMapPointerUp);
  mapCanvas.addEventListener("pointercancel", handleMapPointerUp);
  mapCanvas.addEventListener("wheel", handleMapWheel, { passive: false });

  mapZoomOutButton.addEventListener("click", () => {
    setMapZoom(mapEditorState.zoom - mapZoomStep);
  });
  mapZoomResetButton.addEventListener("click", () => {
    setMapZoom(1);
    mapViewport.scrollLeft = 0;
    mapViewport.scrollTop = 0;
  });
  mapZoomInButton.addEventListener("click", () => {
    setMapZoom(mapEditorState.zoom + mapZoomStep);
  });
  applyMapButton.addEventListener("click", () => {
    applyMapEditorState();
  });
  showTileEdgesInput.addEventListener("change", () => {
    setMapBuildOption("showTileEdges", showTileEdgesInput.checked);
  });
  mapCoveredInput.addEventListener("change", () => {
    setMapBuildOption("isCovered", mapCoveredInput.checked);
  });

  const mapResizeObserver = new ResizeObserver(() => {
    resizeMapEditorCanvas();
  });
  mapResizeObserver.observe(mapViewport);

  resizeMapEditorCanvas();
  updateMapHud();
  updateMapEditorControls();
}

function setupCameraControls() {
  if (!freeCameraInput || !copyCameraButton) {
    return;
  }

  renderer.domElement.tabIndex = 0;
  renderer.domElement.addEventListener("pointerdown", () => {
    renderer.domElement.focus();
  });
  renderer.domElement.addEventListener("pointerdown", handlePlayerPointerDown);
  window.addEventListener("pointerup", handlePlayerPointerUp);
  document.addEventListener("mousemove", handlePlayerPointerMove);
  document.addEventListener("pointerlockchange", handlePlayerPointerLockChange);
  renderer.domElement.addEventListener("wheel", handleCameraWheel, { capture: true, passive: false });
  window.addEventListener("keydown", handleCameraKeyDown);
  window.addEventListener("keyup", handleCameraKeyUp);

  freeCameraInput.addEventListener("change", () => {
    setFreeCameraEnabled(freeCameraInput.checked);
  });
  cameraSideLeftInput.addEventListener("change", () => {
    setCameraSide(cameraSideLeftInput.checked ? "left" : "right");
  });
  cameraOrbitInput.addEventListener("input", () => {
    setCameraOrbit(cameraOrbitInput.value);
  });
  cameraOffsetXInput.addEventListener("input", () => {
    setCameraOffset("x", cameraOffsetXInput.value);
  });
  cameraOffsetYInput.addEventListener("input", () => {
    setCameraOffset("y", cameraOffsetYInput.value);
  });
  cameraOffsetZInput.addEventListener("input", () => {
    setCameraOffset("z", cameraOffsetZInput.value);
  });
  copyCameraButton.addEventListener("click", () => {
    copyCameraInfo();
  });

  syncCameraControlUI();
  controls.enabled = cameraControlState.freeCamera;
}

function createCameraControlState() {
  return {
    freeCamera: false,
    side: "right",
    orbitDegrees: anchoredCameraPreset.baseOrbitDegrees,
    offset: { ...defaultCameraOffset },
    anchorTarget: new THREE.Vector3(0, 2.1, 0),
    anchorDistance: anchoredCameraPreset.cameraOffset.distanceTo(anchoredCameraPreset.targetOffset),
    collisionRatio: 1,
    pressedKeys: new Set(),
  };
}

function createPlayerControlState() {
  return {
    pressedKeys: new Set(),
    shooting: false,
    yawRadians: 0,
    pitchRadians: defaultPlayerAimPitchRadians,
    pointerLocked: false,
  };
}

function setFreeCameraEnabled(enabled) {
  cameraControlState.freeCamera = enabled;
  cameraControlState.pressedKeys.clear();
  playerControlState.pressedKeys.clear();
  playerControlState.shooting = false;
  controls.autoRotate = false;
  controls.enabled = enabled;

  if (enabled && document.pointerLockElement === renderer.domElement) {
    document.exitPointerLock();
  }

  if (!enabled) {
    applyAnchoredCameraFrame();
  } else {
    renderer.domElement.focus();
  }

  syncCameraControlUI();
  syncCrosshair();
}

function setCameraSide(side) {
  cameraControlState.side = side === "left" ? "left" : "right";
  if (!cameraControlState.freeCamera) {
    applyAnchoredCameraFrame();
  }

  syncCameraControlUI();
}

function setCameraOrbit(value) {
  cameraControlState.orbitDegrees = normalizeDegrees(Number(value) || 0);
  if (!cameraControlState.freeCamera) {
    applyAnchoredCameraFrame();
  }

  syncCameraControlUI();
}

function setCameraOffset(axis, value) {
  const nextValue = Number(value) || 0;
  const previousValue = cameraControlState.offset[axis] || 0;
  const delta = nextValue - previousValue;
  cameraControlState.offset[axis] = nextValue;

  if (cameraControlState.freeCamera) {
    const movement = new THREE.Vector3(
      axis === "x" ? delta : 0,
      axis === "y" ? delta : 0,
      axis === "z" ? delta : 0,
    );
    moveFreeCamera(movement);
  } else {
    applyAnchoredCameraFrame();
  }

  syncCameraControlUI();
}

function applyAnchoredCameraFrame(delta = 1 / 60) {
  if (cameraControlState.freeCamera) {
    return;
  }

  const offset = new THREE.Vector3(
    cameraControlState.offset.x,
    cameraControlState.offset.y,
    cameraControlState.offset.z,
  );
  const cameraOffset = transformAnchoredCameraOffset(anchoredCameraPreset.cameraOffset).add(offset);
  const targetOffset = transformAnchoredCameraOffset(anchoredCameraPreset.targetOffset);
  const target = cameraControlState.anchorTarget.clone().add(targetOffset);
  const desiredPosition = cameraControlState.anchorTarget.clone().add(cameraOffset);
  const resolvedPosition = resolveAnchoredCameraPosition(cameraControlState.anchorTarget, desiredPosition, delta);

  controls.target.copy(target);
  camera.position.copy(resolvedPosition);
  camera.lookAt(target);
  cameraControlState.anchorDistance = camera.position.distanceTo(target);
  camera.updateProjectionMatrix();
  controls.update();
}

function resolveAnchoredCameraPosition(origin, desiredPosition, delta) {
  cameraCollisionDirection.copy(desiredPosition).sub(origin);
  const idealDistance = cameraCollisionDirection.length();

  if (idealDistance <= 0.001 || !mapEditorState.appliedIsCovered || mapEditorState.appliedTiles.size === 0) {
    cameraControlState.collisionRatio = 1;
    return cameraCollisionResolvedPosition.copy(desiredPosition);
  }

  const wallRatio = getWallCollisionCameraRatio(origin, idealDistance);
  const tileRatio = getAppliedTileCameraRatio(origin);
  const allowedRatio = Math.min(wallRatio, tileRatio);
  const currentRatio = Number.isFinite(cameraControlState.collisionRatio)
    ? cameraControlState.collisionRatio
    : 1;

  if (allowedRatio < currentRatio) {
    cameraControlState.collisionRatio = allowedRatio;
  } else {
    const smoothingDelta = Number.isFinite(delta) && delta > 0 ? delta : 1 / 60;
    cameraControlState.collisionRatio = THREE.MathUtils.damp(
      currentRatio,
      allowedRatio,
      cameraCollisionReturnDamping,
      smoothingDelta,
    );

    if (Math.abs(cameraControlState.collisionRatio - allowedRatio) < 0.001) {
      cameraControlState.collisionRatio = allowedRatio;
    }
  }

  return cameraCollisionResolvedPosition
    .copy(origin)
    .addScaledVector(cameraCollisionDirection, cameraControlState.collisionRatio);
}

function getWallCollisionCameraRatio(origin, idealDistance) {
  if (wallOccluders.size === 0) {
    return 1;
  }

  cameraCollisionRayDirection.copy(cameraCollisionDirection).normalize();
  cameraCollisionRaycaster.set(origin, cameraCollisionRayDirection);
  cameraCollisionRaycaster.near = 0.05;
  cameraCollisionRaycaster.far = idealDistance;

  const [firstHit] = cameraCollisionRaycaster.intersectObjects([...wallOccluders], false);
  if (!firstHit) {
    return 1;
  }

  return THREE.MathUtils.clamp(
    (firstHit.distance - cameraCollisionWallPadding) / idealDistance,
    0,
    1,
  );
}

function getAppliedTileCameraRatio(origin) {
  const paddedRatio = findLargestCameraTileRatio(origin, true);
  if (paddedRatio !== null) {
    return paddedRatio;
  }

  const centerOnlyRatio = findLargestCameraTileRatio(origin, false);
  return centerOnlyRatio ?? 0;
}

function findLargestCameraTileRatio(origin, useCollisionRadius) {
  if (isCameraRatioInsideAppliedTiles(origin, 1, useCollisionRadius)) {
    return 1;
  }

  let unsafeRatio = 1;
  let safeRatio = null;

  for (let step = cameraCollisionSearchSteps - 1; step >= 0; step -= 1) {
    const ratio = step / cameraCollisionSearchSteps;
    if (isCameraRatioInsideAppliedTiles(origin, ratio, useCollisionRadius)) {
      safeRatio = ratio;
      break;
    }

    unsafeRatio = ratio;
  }

  if (safeRatio === null) {
    return null;
  }

  for (let iteration = 0; iteration < cameraCollisionSearchIterations; iteration += 1) {
    const ratio = (safeRatio + unsafeRatio) / 2;
    if (isCameraRatioInsideAppliedTiles(origin, ratio, useCollisionRadius)) {
      safeRatio = ratio;
    } else {
      unsafeRatio = ratio;
    }
  }

  return safeRatio;
}

function isCameraRatioInsideAppliedTiles(origin, ratio, useCollisionRadius) {
  cameraCollisionProbePosition.copy(origin).addScaledVector(cameraCollisionDirection, ratio);
  return isCameraPositionInsideAppliedTiles(cameraCollisionProbePosition, useCollisionRadius);
}

function isCameraPositionInsideAppliedTiles(position, useCollisionRadius) {
  if (!isWorldPointOnAppliedTile(position.x, position.z)) {
    return false;
  }

  if (!useCollisionRadius) {
    return true;
  }

  for (const [offsetX, offsetZ] of cameraCollisionProbeOffsets) {
    if (!isWorldPointOnAppliedTile(
      position.x + offsetX * cameraCollisionRadius,
      position.z + offsetZ * cameraCollisionRadius,
    )) {
      return false;
    }
  }

  return true;
}

function transformAnchoredCameraOffset(offset) {
  const sideMultiplier = cameraControlState.side === "left" ? -1 : 1;
  const rotation = THREE.MathUtils.degToRad(
    cameraControlState.orbitDegrees - anchoredCameraPreset.baseOrbitDegrees,
  ) + playerControlState.yawRadians;
  const transformedOffset = new THREE.Vector3(offset.x * sideMultiplier, offset.y, offset.z).applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    rotation,
  );
  const pitchAxis = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);

  return transformedOffset.applyAxisAngle(pitchAxis, playerControlState.pitchRadians);
}

function handleCameraKeyDown(event) {
  if (isTypingTarget(event.target)) {
    return;
  }

  const key = event.key.toLowerCase();
  const isMovementKey = ["w", "a", "s", "d", "shift"].includes(key);
  if (!isMovementKey) {
    return;
  }

  event.preventDefault();

  if (cameraControlState.freeCamera) {
    if (key !== "shift") {
      cameraControlState.pressedKeys.add(key);
    }
    return;
  }

  playerControlState.pressedKeys.add(key);
}

function handleCameraKeyUp(event) {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d"].includes(key)) {
    cameraControlState.pressedKeys.delete(key);
    playerControlState.pressedKeys.delete(key);
  }

  if (key === "shift") {
    playerControlState.pressedKeys.delete(key);
  }
}

function handleCameraWheel(event) {
  if (!cameraControlState.freeCamera) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  const direction = getCameraForwardVector();
  moveFreeCamera(direction.multiplyScalar(-event.deltaY * freeCameraWheelSpeed));
}

function handlePlayerPointerMove(event) {
  if (cameraControlState.freeCamera) {
    return;
  }

  const isPointerLocked = document.pointerLockElement === renderer.domElement;
  if (!isPointerLocked && !isEventInsideRenderer(event)) {
    return;
  }

  const movementX = Number(event.movementX) || 0;
  const movementY = Number(event.movementY) || 0;
  if (!movementX && !movementY) {
    return;
  }

  if (movementX) {
    playerControlState.yawRadians = normalizeRadians(
      playerControlState.yawRadians - movementX * playerMouseYawSensitivity,
    );
  }

  if (movementY) {
    playerControlState.pitchRadians = THREE.MathUtils.clamp(
      playerControlState.pitchRadians + movementY * playerMousePitchSensitivity,
      -playerMousePitchLimit,
      playerMousePitchLimit,
    );
  }

  applyPlayerYaw();
  updateCameraAnchorFromCharacter();
  applyAnchoredCameraFrame();
}

function handlePlayerPointerDown(event) {
  renderer.domElement.focus();

  if (cameraControlState.freeCamera || event.button !== 0) {
    return;
  }

  event.preventDefault();
  requestPlayerPointerLock();
  playerControlState.shooting = true;
  syncCrosshair();
}

function handlePlayerPointerUp(event) {
  if (event.button === 0) {
    playerControlState.shooting = false;
    syncCrosshair();
  }
}

function handlePlayerPointerLockChange() {
  playerControlState.pointerLocked = document.pointerLockElement === renderer.domElement;
  if (!playerControlState.pointerLocked) {
    playerControlState.shooting = false;
  }
  syncCrosshair();
}

function requestPlayerPointerLock() {
  if (document.pointerLockElement === renderer.domElement || !renderer.domElement.requestPointerLock) {
    return;
  }

  try {
    const pointerLockRequest = renderer.domElement.requestPointerLock();
    if (pointerLockRequest?.catch) {
      pointerLockRequest.catch(() => {});
    }
  } catch {
    // Some embedded browsers block pointer lock; mouse deltas still work while over the canvas.
  }
}

function isEventInsideRenderer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

function updatePlayerControls(delta) {
  if (!characterModel) {
    return;
  }

  applyPlayerYaw();

  const movement = getPlayerMovementVector();
  const isMoving = movement.lengthSq() > 0.0001;
  const isRunning = playerControlState.pressedKeys.has("shift");

  if (isMoving) {
    const speed = isRunning ? playerRunSpeed : playerWalkSpeed;
    movement.normalize().multiplyScalar(speed * delta);
    moveCharacterWithCollision(movement);
    syncMapPlayerPositionFromCharacter();
  }

  updatePlayerAnimation(isMoving, isRunning, playerControlState.shooting);
  updateCameraAnchorFromCharacter();
  applyAnchoredCameraFrame(delta);
}

function getPlayerMovementVector() {
  playerMoveVector.set(0, 0, 0);
  getPlayerAimDirection(playerForwardVector);

  playerRightVector.crossVectors(camera.up, playerForwardVector).normalize();

  if (playerControlState.pressedKeys.has("w")) {
    playerMoveVector.add(playerForwardVector);
  }

  if (playerControlState.pressedKeys.has("s")) {
    playerMoveVector.sub(playerForwardVector);
  }

  if (playerControlState.pressedKeys.has("a")) {
    playerMoveVector.add(playerRightVector);
  }

  if (playerControlState.pressedKeys.has("d")) {
    playerMoveVector.sub(playerRightVector);
  }

  return playerMoveVector;
}

function moveCharacterWithCollision(displacement) {
  const nextX = characterModel.position.x + displacement.x;
  const nextZ = characterModel.position.z + displacement.z;

  if (canCharacterOccupyWorldPosition(nextX, nextZ)) {
    characterModel.position.x = nextX;
    characterModel.position.z = nextZ;
    return;
  }

  if (canCharacterOccupyWorldPosition(nextX, characterModel.position.z)) {
    characterModel.position.x = nextX;
  }

  if (canCharacterOccupyWorldPosition(characterModel.position.x, nextZ)) {
    characterModel.position.z = nextZ;
  }
}

function canCharacterOccupyWorldPosition(x, z) {
  const radius = playerCollisionRadius;
  const diagonal = radius * 0.7071;
  const sampleOffsets = [
    [0, 0],
    [radius, 0],
    [-radius, 0],
    [0, radius],
    [0, -radius],
    [diagonal, diagonal],
    [-diagonal, diagonal],
    [diagonal, -diagonal],
    [-diagonal, -diagonal],
  ];

  for (const [offsetX, offsetZ] of sampleOffsets) {
    if (!isWorldPointOnAppliedTile(x + offsetX, z + offsetZ)) {
      return false;
    }
  }

  return true;
}

function isWorldPointOnAppliedTile(x, z) {
  if (!mapEditorState.appliedTiles.size) {
    return false;
  }

  const point = worldToMapPoint({ x, z });
  const tileX = Math.floor(point.x);
  const tileZ = Math.floor(point.z);

  if (tileX < 0 || tileZ < 0 || tileX >= mapSize || tileZ >= mapSize) {
    return false;
  }

  return mapEditorState.appliedTiles.has(tileKey(tileX, tileZ));
}

function syncMapPlayerPositionFromCharacter() {
  const nextPosition = worldToMapPoint(characterModel.position);
  const previousPosition = mapEditorState.playerPosition;
  if (
    Math.abs(previousPosition.x - nextPosition.x) < 0.001 &&
    Math.abs(previousPosition.z - nextPosition.z) < 0.001
  ) {
    return;
  }

  mapEditorState.playerPosition = nextPosition;
  mapEditorState.appliedPlayerPosition = { ...nextPosition };
  renderMapEditor();
  updateMapEditorControls();
}

function applyPlayerYaw() {
  if (characterModel) {
    characterModel.rotation.y = yawFromDirection(getPlayerAimDirection(playerForwardVector));
  }
}

function getPlayerAimDirection(target) {
  camera.getWorldDirection(target);
  target.y = 0;

  if (target.lengthSq() <= 0.0001) {
    target.set(
      Math.sin(playerControlState.yawRadians),
      0,
      Math.cos(playerControlState.yawRadians),
    );
  }

  return target.normalize();
}

function yawFromDirection(direction) {
  return Math.atan2(direction.x, direction.z);
}

function updatePlayerAnimation(isMoving, isRunning, isShooting) {
  if (!mixer) {
    return;
  }

  let movementId = defaultMovementId;
  if (isMoving && isShooting && isRunning) {
    movementId = "Combo_Running_B_Ranged_1H_Shooting";
  } else if (isMoving && isShooting) {
    movementId = "Combo_Walking_A_Ranged_1H_Shooting";
  } else if (isMoving && isRunning) {
    movementId = "Running_B";
  } else if (isMoving) {
    movementId = "Walking_A";
  } else if (isShooting) {
    movementId = "Ranged_1H_Shooting";
  }

  playMovement(movementId);
}

function updateCameraAnchorFromCharacter() {
  if (!characterModel) {
    return;
  }

  playerAnchorBox.setFromObject(characterModel);

  if (playerAnchorBox.isEmpty()) {
    cameraControlState.anchorTarget.set(
      characterModel.position.x,
      2.34,
      characterModel.position.z,
    );
    return;
  }

  playerAnchorBox.getSize(playerAnchorSize);
  playerAnchorBox.getCenter(playerAnchorCenter);
  cameraControlState.anchorTarget.set(
    playerAnchorCenter.x,
    Math.max(1.45, Math.min(playerAnchorSize.y * 0.45, 2.7)),
    playerAnchorCenter.z,
  );
}

function updateFreeCamera(delta) {
  const movement = new THREE.Vector3();
  const forward = getCameraForwardVector();
  const right = new THREE.Vector3().crossVectors(camera.up, forward).normalize();

  if (cameraControlState.pressedKeys.has("w")) {
    movement.y += 1;
  }

  if (cameraControlState.pressedKeys.has("s")) {
    movement.y -= 1;
  }

  if (cameraControlState.pressedKeys.has("a")) {
    movement.addScaledVector(right, -1);
  }

  if (cameraControlState.pressedKeys.has("d")) {
    movement.add(right);
  }

  if (movement.lengthSq() > 0) {
    movement.normalize().multiplyScalar(freeCameraMoveSpeed * delta);
    moveFreeCamera(movement);
  }

  controls.update(delta);
}

function moveFreeCamera(movement) {
  camera.position.add(movement);
  controls.target.add(movement);
}

function getCameraForwardVector() {
  return camera.getWorldDirection(new THREE.Vector3()).normalize();
}

function syncCameraControlUI() {
  freeCameraInput.checked = cameraControlState.freeCamera;
  freeCameraValue.textContent = cameraControlState.freeCamera ? "Sim" : "Nao";
  cameraStatus.textContent = cameraControlState.freeCamera ? "Livre" : "Ancorada";
  cameraSideLeftInput.checked = cameraControlState.side === "left";
  cameraSideLeftValue.textContent = cameraControlState.side === "left" ? "Sim" : "Nao";

  cameraOrbitInput.value = Math.round(cameraControlState.orbitDegrees);
  cameraOrbitInput.disabled = cameraControlState.freeCamera;
  cameraOrbitValue.textContent = `${Math.round(cameraControlState.orbitDegrees)}`;
  cameraOffsetXInput.value = cameraControlState.offset.x.toFixed(1);
  cameraOffsetYInput.value = cameraControlState.offset.y.toFixed(1);
  cameraOffsetZInput.value = cameraControlState.offset.z.toFixed(1);
  cameraOffsetXValue.textContent = cameraControlState.offset.x.toFixed(1);
  cameraOffsetYValue.textContent = cameraControlState.offset.y.toFixed(1);
  cameraOffsetZValue.textContent = cameraControlState.offset.z.toFixed(1);
}

async function copyCameraInfo() {
  const forward = getCameraForwardVector();
  const text = JSON.stringify(
    {
      mode: cameraControlState.freeCamera ? "free" : "anchored",
      anchoredTo: characterModel ? "HUNK" : "platform",
      side: cameraControlState.side,
      anchor: vectorToPlainObject(cameraControlState.anchorTarget),
      orbitDegrees: Number(cameraControlState.orbitDegrees.toFixed(3)),
      aimPitchDegrees: Number(THREE.MathUtils.radToDeg(playerControlState.pitchRadians).toFixed(3)),
      distance: Number(cameraControlState.anchorDistance.toFixed(3)),
      preset: {
        cameraOffset: vectorToPlainObject(transformAnchoredCameraOffset(anchoredCameraPreset.cameraOffset)),
        targetOffset: vectorToPlainObject(transformAnchoredCameraOffset(anchoredCameraPreset.targetOffset)),
      },
      offset: {
        x: Number(cameraControlState.offset.x.toFixed(3)),
        y: Number(cameraControlState.offset.y.toFixed(3)),
        z: Number(cameraControlState.offset.z.toFixed(3)),
      },
      cameraPosition: vectorToPlainObject(camera.position),
      controlsTarget: vectorToPlainObject(controls.target),
      forward: vectorToPlainObject(forward),
      rotation: {
        x: Number(camera.rotation.x.toFixed(6)),
        y: Number(camera.rotation.y.toFixed(6)),
        z: Number(camera.rotation.z.toFixed(6)),
        order: camera.rotation.order,
      },
      fov: camera.fov,
      near: camera.near,
      far: Number(camera.far.toFixed(3)),
    },
    null,
    2,
  );

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    copyTextFallback(text);
  }

  cameraStatus.textContent = "Copiada";
  window.setTimeout(() => syncCameraControlUI(), 900);
}

function vectorToPlainObject(vector) {
  return {
    x: Number(vector.x.toFixed(3)),
    y: Number(vector.y.toFixed(3)),
    z: Number(vector.z.toFixed(3)),
  };
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function normalizeRadians(value) {
  const fullTurn = Math.PI * 2;
  return ((value % fullTurn) + fullTurn) % fullTurn;
}

function isTypingTarget(target) {
  return ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target?.tagName);
}

function createInitialMapEditorState() {
  const activeTiles = createDefaultMapTiles();
  const playerPosition = createDefaultMapPlayerPosition(activeTiles);
  const appliedShowTileEdges = false;
  const appliedIsCovered = true;

  return {
    activeTiles,
    appliedTiles: cloneTileSet(activeTiles),
    playerPosition,
    appliedPlayerPosition: { ...playerPosition },
    hoverTile: null,
    zoom: 1,
    baseCanvasSize: 256,
    interactionMode: null,
    pointerId: null,
    showTileEdges: appliedShowTileEdges,
    appliedShowTileEdges,
    isCovered: appliedIsCovered,
    appliedIsCovered,
    dirty: false,
    persisting: false,
    feedbackMessage: null,
    feedbackIsError: false,
  };
}

function createDefaultMapTiles() {
  const configuredTiles = normalizeMapConfigTiles(defaultMapConfig.tiles);
  if (configuredTiles.size > 0) {
    return configuredTiles;
  }

  const left = mapCenter - 1;
  const right = mapCenter;
  return new Set([
    tileKey(left, left),
    tileKey(right, left),
    tileKey(left, right),
    tileKey(right, right),
  ]);
}

function normalizeMapConfigTiles(tiles) {
  const normalized = new Set();
  if (!Array.isArray(tiles)) {
    return normalized;
  }

  for (const tile of tiles) {
    const source = Array.isArray(tile) ? { x: tile[0], z: tile[1] } : tile;
    const x = Number(source?.x);
    const z = Number(source?.z);

    if (Number.isInteger(x) && Number.isInteger(z) && x >= 0 && z >= 0 && x < mapSize && z < mapSize) {
      normalized.add(tileKey(x, z));
    }
  }

  return normalized;
}

function createDefaultMapPlayerPosition(activeTiles) {
  const configuredPosition = defaultMapConfig.playerPosition || {};
  const position = {
    x: Number(configuredPosition.x),
    z: Number(configuredPosition.z),
  };

  if (
    Number.isFinite(position.x) &&
    Number.isFinite(position.z) &&
    isMapPointInsideTiles(position, activeTiles)
  ) {
    return {
      x: THREE.MathUtils.clamp(position.x, 0, mapSize),
      z: THREE.MathUtils.clamp(position.z, 0, mapSize),
    };
  }

  const [firstTileKey] = activeTiles;
  if (firstTileKey) {
    const tile = parseTileKey(firstTileKey);
    return {
      x: tile.x + 0.5,
      z: tile.z + 0.5,
    };
  }

  return { x: mapCenter, z: mapCenter };
}

function cloneTileSet(source) {
  return new Set(source);
}

function createAppliedMapSnapshot() {
  return {
    activeTiles: cloneTileSet(mapEditorState.appliedTiles),
    playerPosition: { ...mapEditorState.appliedPlayerPosition },
    showTileEdges: mapEditorState.appliedShowTileEdges,
    isCovered: mapEditorState.appliedIsCovered,
  };
}

function setMapBuildOption(option, value) {
  if (mapEditorState[option] === value) {
    return;
  }

  mapEditorState[option] = value;
  mapEditorState.dirty = true;
  mapEditorState.feedbackMessage = null;
  mapEditorState.feedbackIsError = false;
  renderMapEditor();
  updateMapEditorControls();
}

function resizeMapEditorCanvas() {
  const nextBaseSize = Math.max(220, Math.floor(mapViewport.clientWidth || 256));
  if (nextBaseSize !== mapEditorState.baseCanvasSize) {
    mapEditorState.baseCanvasSize = nextBaseSize;
  }

  renderMapEditor();
}

function setMapZoom(nextZoom, anchorEvent = null) {
  const previousZoom = mapEditorState.zoom;
  const zoom = THREE.MathUtils.clamp(nextZoom, mapZoomMin, mapZoomMax);
  if (Math.abs(zoom - previousZoom) < 0.001) {
    return;
  }

  const previousSize = mapEditorState.baseCanvasSize * previousZoom;
  const viewportRect = mapViewport.getBoundingClientRect();
  const anchorX = anchorEvent ? anchorEvent.clientX - viewportRect.left : viewportRect.width / 2;
  const anchorY = anchorEvent ? anchorEvent.clientY - viewportRect.top : viewportRect.height / 2;
  const ratioX = (mapViewport.scrollLeft + anchorX) / Math.max(previousSize, 1);
  const ratioY = (mapViewport.scrollTop + anchorY) / Math.max(previousSize, 1);

  mapEditorState.zoom = zoom;
  renderMapEditor();

  const nextSize = mapEditorState.baseCanvasSize * zoom;
  mapViewport.scrollLeft = ratioX * nextSize - anchorX;
  mapViewport.scrollTop = ratioY * nextSize - anchorY;
  updateMapEditorControls();
}

function handleMapWheel(event) {
  event.preventDefault();
  const direction = event.deltaY > 0 ? -1 : 1;
  setMapZoom(mapEditorState.zoom + direction * mapZoomStep, event);
}

function handleMapPointerDown(event) {
  event.preventDefault();
  const point = mapPointFromEvent(event);
  const tile = tileFromMapPoint(point);

  mapCanvas.setPointerCapture(event.pointerId);
  mapEditorState.pointerId = event.pointerId;

  if (event.button === 2) {
    mapEditorState.interactionMode = "erase";
    setMapTileActive(tile, false);
    return;
  }

  if (event.button !== 0) {
    return;
  }

  if (isPointerOnMapPlayer(point)) {
    mapEditorState.interactionMode = "drag-player";
    mapCanvas.classList.add("is-dragging-player");
    moveMapPlayer(point);
    return;
  }

  mapEditorState.interactionMode = "paint";
  setMapTileActive(tile, true);
}

function handleMapPointerMove(event) {
  const point = mapPointFromEvent(event);
  const tile = tileFromMapPoint(point);
  setMapHoverTile(tile);

  if (mapEditorState.interactionMode === "drag-player") {
    moveMapPlayer(point);
    return;
  }

  if (mapEditorState.interactionMode === "paint") {
    setMapTileActive(tile, true);
    return;
  }

  if (mapEditorState.interactionMode === "erase") {
    setMapTileActive(tile, false);
    return;
  }

  mapCanvas.style.cursor = isPointerOnMapPlayer(point) ? "grab" : "crosshair";
}

function handleMapPointerLeave() {
  if (!mapEditorState.interactionMode) {
    setMapHoverTile(null);
  }
}

function handleMapPointerUp(event) {
  if (mapEditorState.pointerId !== null && mapCanvas.hasPointerCapture(mapEditorState.pointerId)) {
    mapCanvas.releasePointerCapture(mapEditorState.pointerId);
  }

  mapEditorState.pointerId = null;
  mapEditorState.interactionMode = null;
  mapCanvas.classList.remove("is-dragging-player");
  mapCanvas.style.cursor = "crosshair";
  updateMapEditorControls();
  renderMapEditor();
}

function mapPointFromEvent(event) {
  const rect = mapCanvas.getBoundingClientRect();
  return {
    x: THREE.MathUtils.clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * mapSize, 0, mapSize),
    z: THREE.MathUtils.clamp(((event.clientY - rect.top) / Math.max(rect.height, 1)) * mapSize, 0, mapSize),
  };
}

function tileFromMapPoint(point) {
  return {
    x: THREE.MathUtils.clamp(Math.floor(Math.min(point.x, mapSize - 0.0001)), 0, mapSize - 1),
    z: THREE.MathUtils.clamp(Math.floor(Math.min(point.z, mapSize - 0.0001)), 0, mapSize - 1),
  };
}

function setMapHoverTile(tile) {
  const nextKey = tile ? tileKey(tile.x, tile.z) : null;
  const currentKey = mapEditorState.hoverTile ? tileKey(mapEditorState.hoverTile.x, mapEditorState.hoverTile.z) : null;
  if (nextKey === currentKey) {
    return;
  }

  mapEditorState.hoverTile = tile;
  renderMapEditor();
}

function setMapTileActive(tile, active) {
  const key = tileKey(tile.x, tile.z);
  const hasTile = mapEditorState.activeTiles.has(key);
  if (active === hasTile) {
    return;
  }

  if (active) {
    mapEditorState.activeTiles.add(key);
  } else {
    mapEditorState.activeTiles.delete(key);
  }

  mapEditorState.dirty = true;
  mapEditorState.feedbackMessage = null;
  mapEditorState.feedbackIsError = false;
  renderMapEditor();
  updateMapEditorControls();
}

function moveMapPlayer(point) {
  const nextPosition = magnetizeMapPlayerPosition({
    x: THREE.MathUtils.clamp(point.x, 0, mapSize),
    z: THREE.MathUtils.clamp(point.z, 0, mapSize),
  });

  if (
    Math.abs(nextPosition.x - mapEditorState.playerPosition.x) < 0.001 &&
    Math.abs(nextPosition.z - mapEditorState.playerPosition.z) < 0.001
  ) {
    return;
  }

  mapEditorState.playerPosition = nextPosition;
  mapEditorState.dirty = true;
  mapEditorState.feedbackMessage = null;
  mapEditorState.feedbackIsError = false;
  renderMapEditor();
  updateMapEditorControls();
}

function magnetizeMapPlayerPosition(position) {
  const tile = tileFromMapPoint(position);
  const center = { x: tile.x + 0.5, z: tile.z + 0.5 };
  const distance = Math.hypot(position.x - center.x, position.z - center.z);
  if (distance <= mapPlayerMagnetRadius) {
    return center;
  }

  return position;
}

function isPointerOnMapPlayer(point) {
  return Math.hypot(point.x - mapEditorState.playerPosition.x, point.z - mapEditorState.playerPosition.z) <= 0.48;
}

function isMapPlayerPlacementValid(activeTiles = mapEditorState.activeTiles) {
  if (activeTiles.size === 0) {
    return false;
  }

  return isMapPointInsideTiles(mapEditorState.playerPosition, activeTiles);
}

function isMapPointInsideTiles(position, activeTiles) {
  for (const x of candidateMapIndices(position.x)) {
    for (const z of candidateMapIndices(position.z)) {
      if (activeTiles.has(tileKey(x, z))) {
        return true;
      }
    }
  }

  return false;
}

function candidateMapIndices(value) {
  const clamped = THREE.MathUtils.clamp(value, 0, mapSize);
  const base = Math.floor(Math.min(clamped, mapSize - 0.0001));
  const candidates = new Set([base]);
  const rounded = Math.round(clamped);
  if (Math.abs(clamped - rounded) < 0.0001) {
    candidates.add(rounded);
    candidates.add(rounded - 1);
  }

  return [...candidates].filter((index) => index >= 0 && index < mapSize);
}

function renderMapEditor() {
  if (!mapCanvas) {
    return;
  }

  const cssSize = Math.max(1, Math.round(mapEditorState.baseCanvasSize * mapEditorState.zoom));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelSize = Math.round(cssSize * pixelRatio);

  if (mapCanvas.width !== pixelSize || mapCanvas.height !== pixelSize) {
    mapCanvas.width = pixelSize;
    mapCanvas.height = pixelSize;
  }

  mapCanvas.style.width = `${cssSize}px`;
  mapCanvas.style.height = `${cssSize}px`;

  const ctx = mapCanvas.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawMapEditor(ctx, cssSize);
}

function drawMapEditor(ctx, size) {
  const cellSize = size / mapSize;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#0d0e0c";
  ctx.fillRect(0, 0, size, size);

  for (let z = 0; z < mapSize; z += 1) {
    for (let x = 0; x < mapSize; x += 1) {
      const isActive = mapEditorState.activeTiles.has(tileKey(x, z));
      const px = x * cellSize;
      const py = z * cellSize;

      ctx.fillStyle = isActive ? "#5d5a46" : (x + z) % 2 === 0 ? "#151711" : "#12140f";
      ctx.fillRect(px, py, cellSize, cellSize);

      if (!isActive) {
        ctx.fillStyle = "rgba(224, 208, 133, 0.08)";
        ctx.fillRect(px + cellSize * 0.42, py + cellSize * 0.42, cellSize * 0.16, cellSize * 0.16);
      }
    }
  }

  drawMapLines(ctx, size, cellSize);
  drawMapWallPreview(ctx, cellSize);
  drawMapHover(ctx, cellSize);
  drawMapPlayer(ctx, cellSize);
}

function drawMapLines(ctx, size, cellSize) {
  ctx.lineWidth = 1;
  for (let index = 0; index <= mapSize; index += 1) {
    const coordinate = Math.round(index * cellSize) + 0.5;
    ctx.strokeStyle = index === mapCenter ? "rgba(230, 208, 120, 0.72)" : "rgba(224, 208, 133, 0.18)";
    ctx.beginPath();
    ctx.moveTo(coordinate, 0);
    ctx.lineTo(coordinate, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, coordinate);
    ctx.lineTo(size, coordinate);
    ctx.stroke();
  }
}

function drawMapWallPreview(ctx, cellSize) {
  if (!mapEditorState.isCovered) {
    return;
  }

  ctx.lineWidth = Math.max(2, cellSize * 0.08);
  ctx.strokeStyle = "rgba(228, 211, 131, 0.72)";

  for (const key of mapEditorState.activeTiles) {
    const tile = parseTileKey(key);
    const x = tile.x * cellSize;
    const z = tile.z * cellSize;

    if (!mapEditorState.activeTiles.has(tileKey(tile.x, tile.z - 1))) {
      ctx.beginPath();
      ctx.moveTo(x, z);
      ctx.lineTo(x + cellSize, z);
      ctx.stroke();
    }

    if (!mapEditorState.activeTiles.has(tileKey(tile.x + 1, tile.z))) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, z);
      ctx.lineTo(x + cellSize, z + cellSize);
      ctx.stroke();
    }

    if (!mapEditorState.activeTiles.has(tileKey(tile.x, tile.z + 1))) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, z + cellSize);
      ctx.lineTo(x, z + cellSize);
      ctx.stroke();
    }

    if (!mapEditorState.activeTiles.has(tileKey(tile.x - 1, tile.z))) {
      ctx.beginPath();
      ctx.moveTo(x, z + cellSize);
      ctx.lineTo(x, z);
      ctx.stroke();
    }
  }
}

function drawMapHover(ctx, cellSize) {
  if (!mapEditorState.hoverTile) {
    return;
  }

  const { x, z } = mapEditorState.hoverTile;
  ctx.lineWidth = 2;
  ctx.strokeStyle = mapEditorState.activeTiles.has(tileKey(x, z))
    ? "rgba(255, 211, 111, 0.92)"
    : "rgba(224, 208, 133, 0.62)";
  ctx.strokeRect(x * cellSize + 1, z * cellSize + 1, cellSize - 2, cellSize - 2);
}

function drawMapPlayer(ctx, cellSize) {
  const px = mapEditorState.playerPosition.x * cellSize;
  const py = mapEditorState.playerPosition.z * cellSize;
  const radius = THREE.MathUtils.clamp(cellSize * 0.28, 6, 14);
  const valid = isMapPlayerPlacementValid();

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.62)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = valid ? "#e31925" : "#6c1f1f";
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = valid ? 2 : 3;
  ctx.strokeStyle = valid ? "#ffd8a1" : "#ffd2c8";
  ctx.stroke();
  ctx.restore();
}

async function applyMapEditorState() {
  if (!isMapPlayerPlacementValid()) {
    updateMapEditorControls();
    return;
  }

  mapEditorState.appliedTiles = cloneTileSet(mapEditorState.activeTiles);
  mapEditorState.appliedPlayerPosition = { ...mapEditorState.playerPosition };
  mapEditorState.appliedShowTileEdges = mapEditorState.showTileEdges;
  mapEditorState.appliedIsCovered = mapEditorState.isCovered;
  mapEditorState.dirty = false;
  mapEditorState.persisting = true;
  mapEditorState.feedbackMessage = "Salvando mapa...";
  mapEditorState.feedbackIsError = false;

  rebuildPlatformFromAppliedMap();
  positionCharacterOnMap(mapEditorState.appliedPlayerPosition);
  frameScene();
  updateMapHud();
  renderMapEditor();
  updateMapEditorControls();

  try {
    await persistAppliedMapConfig();
    mapEditorState.feedbackMessage = "Mapa aplicado e salvo";
    mapEditorState.feedbackIsError = false;
  } catch (error) {
    console.error("Falha ao salvar mapa aplicado.", error);
    mapEditorState.feedbackMessage = "Mapa aplicado; codigo nao salvo";
    mapEditorState.feedbackIsError = true;
  } finally {
    mapEditorState.persisting = false;
    updateMapEditorControls();
  }
}

async function persistAppliedMapConfig() {
  const response = await fetch("/api/map-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createAppliedMapConfigPayload()),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

function createAppliedMapConfigPayload() {
  return {
    tiles: [...mapEditorState.appliedTiles]
      .map((key) => {
        const tile = parseTileKey(key);
        return [tile.x, tile.z];
      })
      .sort((a, b) => a[1] - b[1] || a[0] - b[0]),
    playerPosition: {
      x: roundMapCoordinate(mapEditorState.appliedPlayerPosition.x),
      z: roundMapCoordinate(mapEditorState.appliedPlayerPosition.z),
    },
    showTileEdges: false,
    isCovered: true,
  };
}

function roundMapCoordinate(value) {
  return Number(Number(value).toFixed(3));
}

function rebuildPlatformFromAppliedMap() {
  const nextPlatform = createPlatform(createAppliedMapSnapshot());

  clearWallOcclusionState();

  if (platformGroup) {
    scene.remove(platformGroup);
    disposeObject3D(platformGroup);
  }

  platformGroup = nextPlatform;
  scene.add(platformGroup);
  collectWallOccluders(platformGroup);
}

function updateMapEditorControls() {
  if (!mapStatus || !mapFeedback || !applyMapButton) {
    return;
  }

  const hasTiles = mapEditorState.activeTiles.size > 0;
  const validPlacement = isMapPlayerPlacementValid();
  mapStatus.textContent = `${mapEditorState.activeTiles.size} tiles`;
  applyMapButton.disabled = mapEditorState.persisting || !hasTiles || !validPlacement;
  mapFeedback.classList.toggle("is-error", !hasTiles || !validPlacement || mapEditorState.feedbackIsError);
  showTileEdgesInput.checked = mapEditorState.showTileEdges;
  showTileEdgesValue.textContent = mapEditorState.showTileEdges ? "Sim" : "Nao";
  mapCoveredInput.checked = mapEditorState.isCovered;
  mapCoveredValue.textContent = mapEditorState.isCovered ? "Sim" : "Nao";

  if (!hasTiles) {
    mapFeedback.textContent = "Sem tiles";
  } else if (!validPlacement) {
    mapFeedback.textContent = "Posicao fora dos tiles";
  } else if (mapEditorState.feedbackMessage) {
    mapFeedback.textContent = mapEditorState.feedbackMessage;
  } else {
    mapFeedback.textContent = mapEditorState.dirty ? "Alteracoes pendentes" : "Mapa aplicado";
  }

  mapZoomOutButton.disabled = mapEditorState.zoom <= mapZoomMin + 0.001;
  mapZoomInButton.disabled = mapEditorState.zoom >= mapZoomMax - 0.001;
}

function updateMapHud() {
  if (mapHudElement) {
    mapHudElement.textContent = `${mapSize} x ${mapSize} / ${mapEditorState.appliedTiles.size} tiles`;
  }
}

function tileKey(x, z) {
  return `${x},${z}`;
}

function parseTileKey(key) {
  const [x, z] = key.split(",").map((value) => Number(value));
  return { x, z };
}

function mapPointToWorld(position) {
  return {
    x: (position.x - mapCenter) * platformTileSize,
    z: (position.z - mapCenter) * platformTileSize,
  };
}

function worldToMapPoint(position) {
  return {
    x: position.x / platformTileSize + mapCenter,
    z: position.z / platformTileSize + mapCenter,
  };
}

function mapTileCenterToWorld(tile) {
  return {
    x: (tile.x + 0.5 - mapCenter) * platformTileSize,
    z: (tile.z + 0.5 - mapCenter) * platformTileSize,
  };
}

function positionCharacterOnMap(position) {
  if (!characterModel) {
    return;
  }

  const worldPosition = mapPointToWorld(position);
  characterModel.position.x = worldPosition.x;
  characterModel.position.z = worldPosition.z;
}

function disposeObject3D(object) {
  const materials = new Set();
  const geometries = new Set();

  object.traverse((node) => {
    if (node.geometry) {
      geometries.add(node.geometry);
    }

    const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of nodeMaterials) {
      if (material) {
        materials.add(material);
      }
    }
  });

  for (const geometry of geometries) {
    geometry.dispose();
  }

  for (const material of materials) {
    material.dispose();
  }
}

function collectWallOccluders(object) {
  wallOccluders.clear();

  object.traverse((node) => {
    if (node.userData?.occludesCharacter) {
      wallOccluders.add(node);
    }
  });
}

function clearWallOcclusionState() {
  for (const wall of transparentWallOccluders) {
    setWallOcclusionVisible(wall, false);
  }

  transparentWallOccluders.clear();
  wallOccluders.clear();
}

function updateWallOcclusion() {
  if (!characterModel || wallOccluders.size === 0) {
    clearTransientWallOcclusion();
    return;
  }

  getCharacterOcclusionTarget(wallOcclusionTarget);
  const rayDirection = wallOcclusionTarget.clone().sub(camera.position);
  const rayDistance = rayDirection.length();

  if (rayDistance <= 0.001) {
    clearTransientWallOcclusion();
    return;
  }

  rayDirection.normalize();
  wallOcclusionRaycaster.set(camera.position, rayDirection);
  wallOcclusionRaycaster.near = 0;
  wallOcclusionRaycaster.far = rayDistance;

  const occludedWalls = new Set(
    wallOcclusionRaycaster.intersectObjects([...wallOccluders], false).map((hit) => hit.object),
  );

  for (const wall of transparentWallOccluders) {
    if (!occludedWalls.has(wall)) {
      setWallOcclusionVisible(wall, false);
    }
  }

  for (const wall of occludedWalls) {
    setWallOcclusionVisible(wall, true);
  }

  transparentWallOccluders.clear();
  for (const wall of occludedWalls) {
    transparentWallOccluders.add(wall);
  }
}

function clearTransientWallOcclusion() {
  for (const wall of transparentWallOccluders) {
    setWallOcclusionVisible(wall, false);
  }

  transparentWallOccluders.clear();
}

function getCharacterOcclusionTarget(target) {
  const characterBox = new THREE.Box3().setFromObject(characterModel);
  if (characterBox.isEmpty()) {
    target.copy(cameraControlState.anchorTarget);
    return target;
  }

  characterBox.getCenter(target);
  target.y = characterBox.min.y + characterBox.getSize(new THREE.Vector3()).y * 0.62;
  return target;
}

function setWallOcclusionVisible(wall, occluded) {
  const material = wall.material;
  if (!material) {
    return;
  }

  material.transparent = occluded;
  material.opacity = occluded ? wallOcclusionOpacity : 1;
  material.depthWrite = !occluded;
  material.needsUpdate = true;
}

function setupColorControls() {
  colorPanel.addEventListener("input", (event) => {
    const target = event.target;
    if (!target?.matches?.("[data-palette-color-input], [data-palette-hex-input]")) {
      return;
    }

    const slotId = target.dataset.controlId || target.dataset.slotId;
    const normalized = normalizeHexColor(target.value);

    if (!normalized) {
      target.classList.add("is-invalid");
      return;
    }

    target.classList.remove("is-invalid");
    setPaletteControlColor(slotId, normalized);
  });

  resetColorsButton.addEventListener("click", () => {
    paletteDraft = createRoguePaletteDraft();
    renderColorPanel();
    applyCharacterPalette();
    setColorStatus("Padrao");
  });

  copyColorsButton.addEventListener("click", () => {
    copyPaletteInfo();
  });
}

function renderColorPanel() {
  colorPanel.textContent = "";

  for (const control of roguePaletteControls) {
    const controlId = paletteControlId(control);
    const color = colorForPaletteControl(control);
    const row = document.createElement("label");
    row.className = "palette-row";
    row.dataset.controlId = controlId;
    if (control.slots) {
      row.dataset.slotId = control.slots[0];
      row.dataset.slotIds = control.slots.join(",");
    }
    row.style.setProperty("--swatch", color);

    const label = document.createElement("span");
    label.textContent = control.label;

    const controls = document.createElement("span");
    controls.className = "palette-controls";

    const colorInput = document.createElement("input");
    colorInput.className = "palette-color-input";
    colorInput.type = "color";
    colorInput.value = color.toLowerCase();
    colorInput.dataset.paletteColorInput = "";
    colorInput.dataset.controlId = controlId;
    colorInput.setAttribute("aria-label", control.label);

    const hexInput = document.createElement("input");
    hexInput.className = "palette-hex-input";
    hexInput.value = color;
    hexInput.maxLength = 7;
    hexInput.spellcheck = false;
    hexInput.autocomplete = "off";
    hexInput.dataset.paletteHexInput = "";
    hexInput.dataset.controlId = controlId;
    hexInput.setAttribute("aria-label", `Hex ${control.label}`);

    controls.append(colorInput, hexInput);
    row.append(label, controls);
    colorPanel.append(row);
  }
}

function setPaletteControlColor(slotId, color) {
  const control = roguePaletteControls.find((candidate) => {
    return paletteControlId(candidate) === slotId || candidate.slots?.includes(slotId);
  });
  const normalized = normalizeHexColor(color);
  if (!control || !normalized) {
    return false;
  }

  if (control.slots) {
    for (const groupedSlotId of control.slots) {
      paletteDraft[groupedSlotId] = normalized;
    }

    applyCharacterPalette();
  }

  syncPaletteControl(control, normalized);
  return true;
}

function syncPaletteControl(control, color) {
  const row = colorPanel.querySelector(`[data-control-id="${paletteControlId(control)}"]`);
  if (!row) {
    return;
  }

  row.style.setProperty("--swatch", color);
  const colorInput = row.querySelector("[data-palette-color-input]");
  const hexInput = row.querySelector("[data-palette-hex-input]");

  if (colorInput) {
    colorInput.value = color.toLowerCase();
    colorInput.classList.remove("is-invalid");
  }

  if (hexInput) {
    hexInput.value = color;
    hexInput.classList.remove("is-invalid");
  }
}

function createRoguePaletteDraft() {
  return {
    ...rogueDefaultSlots,
  };
}

function paletteControlId(control) {
  if (control.id) {
    return control.id;
  }

  if (control.slots?.length) {
    return control.slots[0];
  }

  return control.label.toLowerCase().replace(/\s+/gu, "-");
}

function colorForPaletteControl(control) {
  if (control.slots?.length) {
    return normalizeHexColor(paletteDraft[control.slots[0]]) || "#FFFFFF";
  }

  return "#FFFFFF";
}

function applyCharacterPalette() {
  if (!sourceCharacterTextureImage || paletteMaterials.size === 0) {
    setColorStatus("Aguardando");
    return false;
  }

  const nextTexture = createRoguePaletteTexture(sourceCharacterTextureImage, {
    ...rogueDefaultSlots,
    ...paletteDraft,
  });
  if (!nextTexture) {
    setColorStatus("Canvas indisponivel");
    return false;
  }

  for (const material of paletteMaterials) {
    material.map = nextTexture;
    material.needsUpdate = true;
  }

  if (activePaletteTexture) {
    activePaletteTexture.dispose();
  }

  activePaletteTexture = nextTexture;
  applyMaskAtlasPalette();
  setColorStatus("Aplicada");
  return true;
}

function applyMaskAtlasPalette() {
  if (!sourceCharacterTextureImage || maskAtlasMaterials.size === 0) {
    return false;
  }

  const nextTexture = createRoguePaletteTexture(sourceCharacterTextureImage, {
    ...rogueDefaultSlots,
    ...paletteDraft,
  });
  if (!nextTexture) {
    return false;
  }

  for (const material of maskAtlasMaterials) {
    material.map = nextTexture;
    material.needsUpdate = true;
  }

  if (activeMaskPaletteTexture) {
    activeMaskPaletteTexture.dispose();
  }

  activeMaskPaletteTexture = nextTexture;
  return true;
}

function createRoguePaletteTexture(sourceImage, slots) {
  const canvas = document.createElement("canvas");
  canvas.width = sourceImage.naturalWidth || sourceImage.width || rogueTextureAtlas.size;
  canvas.height = sourceImage.naturalHeight || sourceImage.height || rogueTextureAtlas.size;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return null;
  }

  ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

  for (const [slotId, color] of Object.entries(slots)) {
    recolorPaletteSlot(ctx, canvas, slotId, color);
  }

  const texture = new THREE.CanvasTexture(canvas);
  configureRoguePaletteTexture(texture);
  return texture;
}

function configureRoguePaletteTexture(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 1;
  // The One RPG palette slot rows are authored for canvas textures with the default Y flip.
  texture.flipY = true;

  if (sourceCharacterTextureSettings) {
    texture.wrapS = sourceCharacterTextureSettings.wrapS;
    texture.wrapT = sourceCharacterTextureSettings.wrapT;
    texture.offset.copy(sourceCharacterTextureSettings.offset);
    texture.repeat.copy(sourceCharacterTextureSettings.repeat);
    texture.center.copy(sourceCharacterTextureSettings.center);
    texture.rotation = sourceCharacterTextureSettings.rotation;
  }

  texture.needsUpdate = true;
}

function recolorPaletteSlot(ctx, canvas, slotId, targetHex) {
  const slot = parsePaletteSlotId(slotId);
  const normalized = normalizeHexColor(targetHex);
  if (!slot || !normalized) {
    return;
  }

  const target = hexToRgb(normalized);
  const cellWidth = Math.round(canvas.width / rogueTextureAtlas.columns);
  const cellHeight = Math.round(canvas.height / rogueTextureAtlas.rows);
  const x = slot.column * cellWidth;
  const y = slot.row * cellHeight;
  const imageData = ctx.getImageData(x, y, cellWidth, cellHeight);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      continue;
    }

    data[index] = target.r;
    data[index + 1] = target.g;
    data[index + 2] = target.b;
  }

  ctx.putImageData(imageData, x, y);
}

function parsePaletteSlotId(slotId) {
  if (typeof slotId !== "string") {
    return null;
  }

  const match = slotId.match(/^r([0-7])c([0-7])$/u);
  if (!match) {
    return null;
  }

  return {
    row: Number(match[1]),
    column: Number(match[2]),
  };
}

function normalizeHexColor(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const shortMatch = trimmed.match(/^#?([0-9a-f]{3})$/iu);
  if (shortMatch) {
    return `#${shortMatch[1].split("").map((char) => `${char}${char}`).join("")}`.toUpperCase();
  }

  const fullMatch = trimmed.match(/^#?([0-9a-f]{6})$/iu);
  return fullMatch ? `#${fullMatch[1].toUpperCase()}` : null;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

async function copyPaletteInfo() {
  const controls = Object.fromEntries(
    roguePaletteControls.map((control) => [control.label, colorForPaletteControl(control)]),
  );
  const slots = Object.fromEntries(
    roguePaletteControls.flatMap((control) =>
      (control.slots || []).map((slotId) => [slotId, paletteDraft[slotId]]),
    ),
  );
  const text = JSON.stringify(
    {
      type: "hunk",
      controls,
      slots,
    },
    null,
    2,
  );

  try {
    await navigator.clipboard.writeText(text);
    setColorStatus("Copiada");
  } catch {
    copyTextFallback(text);
    setColorStatus("Copiada");
  }
}

function setColorStatus(message) {
  colorStatus.textContent = message;
}

function setWeaponOffset(axis, value) {
  activeWeapon.position[axis] = Number(value);
  updateAttachmentControls();
  applyWeaponTransform();
  setWeaponStatus(`Arma: ${activeWeapon.label}`);
}

function setWeaponScale(value) {
  activeWeapon.scale = Number(value);
  updateAttachmentControls();
  applyWeaponTransform();
  setWeaponStatus(`Arma: ${activeWeapon.label}`);
}

function updateAttachmentControls() {
  offsetXInput.value = String(activeWeapon.position[0]);
  offsetYInput.value = String(activeWeapon.position[1]);
  offsetZInput.value = String(activeWeapon.position[2]);
  weaponScaleInput.value = String(activeWeapon.scale);
  offsetXValue.value = formatOffset(activeWeapon.position[0]);
  offsetYValue.value = formatOffset(activeWeapon.position[1]);
  offsetZValue.value = formatOffset(activeWeapon.position[2]);
  weaponScaleValue.value = formatScale(activeWeapon.scale);
  offsetXValue.textContent = formatOffset(activeWeapon.position[0]);
  offsetYValue.textContent = formatOffset(activeWeapon.position[1]);
  offsetZValue.textContent = formatOffset(activeWeapon.position[2]);
  weaponScaleValue.textContent = formatScale(activeWeapon.scale);
}

function setAttachmentControlsEnabled(enabled) {
  offsetXInput.disabled = !enabled;
  offsetYInput.disabled = !enabled;
  offsetZInput.disabled = !enabled;
  weaponScaleInput.disabled = !enabled;
  copyInfoButton.disabled = !enabled;
}

async function copyAttachmentInfo() {
  const movementId = activeMovementId || movementSelect.value;
  const info = {
    movement: {
      id: movementId,
      label: labelForMovement(movementId),
    },
    weapon: {
      id: activeWeapon.id,
      label: activeWeapon.label,
      file: activeWeapon.file,
    },
    slot: activeWeapon.slotName,
    position: {
      x: roundValue(activeWeapon.position[0]),
      y: roundValue(activeWeapon.position[1]),
      z: roundValue(activeWeapon.position[2]),
    },
    rotation: {
      x: roundValue(activeWeapon.rotation[0]),
      y: roundValue(activeWeapon.rotation[1]),
      z: roundValue(activeWeapon.rotation[2]),
    },
    scale: roundValue(activeWeapon.scale),
  };
  const text = JSON.stringify(info, null, 2);

  try {
    await navigator.clipboard.writeText(text);
    setWeaponStatus("Informacoes copiadas");
  } catch {
    copyTextFallback(text);
    setWeaponStatus("Informacoes copiadas");
  }
}

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function formatOffset(value) {
  return Number(value).toFixed(3);
}

function formatScale(value) {
  return Number(value).toFixed(2);
}

function roundValue(value) {
  return Number(Number(value).toFixed(4));
}

function setupAnimationMixer(model, animationGltfs) {
  mixer = new THREE.AnimationMixer(model);

  for (const gltf of animationGltfs) {
    for (const clip of gltf.animations || []) {
      sourceAnimationClips.set(clip.name, clip);
      const option = movementById.get(clip.name);
      if (!option) {
        continue;
      }

      const action = mixer.clipAction(clip);
      configureAction(action, option);
      animationActions.set(clip.name, { actions: [action] });
    }
  }

  setupCombinationActions();

  mixer.addEventListener("finished", (event) => {
    const clipName = event.action?._clip?.name || null;
    if (clipName === activeMovementId) {
      setMovementStatus(`Finalizado: ${labelForMovement(clipName)}`);
    }
  });
}

function setupCombinationActions() {
  for (const option of movementOptions) {
    if (!option.combo) {
      continue;
    }

    const lowerSource = sourceAnimationClips.get(option.combo.lower);
    const upperSource = sourceAnimationClips.get(option.combo.upper);
    if (!lowerSource || !upperSource) {
      console.warn(`Combinacao incompleta: ${option.id}`);
      continue;
    }

    const lowerClip = createMaskedClip(lowerSource, lowerBodyBones, `${option.id}_lower`);
    const upperClip = createMaskedClip(upperSource, upperBodyBones, `${option.id}_upper`);
    if (!lowerClip.tracks.length || !upperClip.tracks.length) {
      console.warn(`Combinacao sem tracks suficientes: ${option.id}`);
      continue;
    }

    const lowerAction = mixer.clipAction(lowerClip);
    const upperAction = mixer.clipAction(upperClip);
    configureAction(lowerAction, option);
    configureAction(upperAction, option);
    animationActions.set(option.id, { actions: [lowerAction, upperAction] });
  }
}

function configureAction(action, option) {
  action.enabled = true;

  if (option.loop) {
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  } else {
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }

  action.timeScale = option.timeScale || 1;
}

function createMaskedClip(sourceClip, allowedBones, clipName) {
  const tracks = sourceClip.tracks
    .filter((track) => allowedBones.has(normalizeTrackNodeName(track.name)))
    .map((track) => track.clone());

  return new THREE.AnimationClip(clipName, sourceClip.duration, tracks);
}

function normalizeTrackNodeName(trackName) {
  const nodeName = trackName.replace(/\.(position|quaternion|scale|morphTargetInfluences)$/u, "");
  return nodeName
    .replace(/_/g, ".")
    .toLowerCase()
    .replace(/^(upperleg|lowerleg|foot|toes|upperarm|lowerarm|wrist|hand|handslot)([lr])$/u, "$1.$2");
}

function playMovement(clipName, { restart = false } = {}) {
  const nextEntry = animationActions.get(clipName);
  if (!nextEntry) {
    setMovementStatus(`Sem clipe: ${clipName}`);
    return false;
  }

  if (!restart && activeMovementId === clipName) {
    return true;
  }

  const nextActions = nextEntry.actions;

  for (const action of nextActions) {
    action.enabled = true;
    action.paused = false;
    action.setEffectiveWeight(1);
    action.reset().fadeIn(0.12).play();
  }

  for (const previousAction of activeActions) {
    if (!nextActions.includes(previousAction)) {
      previousAction.fadeOut(0.12);
    }
  }

  activeActions = nextActions;
  activeMovementId = clipName;
  if (movementSelect.value !== clipName) {
    movementSelect.value = clipName;
  }
  setMovementStatus(`Ativo: ${labelForMovement(clipName)}`);
  return true;
}

function labelForMovement(clipName) {
  return movementById.get(clipName)?.label || formatClipLabel(clipName);
}

function formatClipLabel(clipName) {
  return clipName.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
}

function createPlatform(mapSnapshot) {
  const platform = new THREE.Group();
  platform.name = "TileMapPlatform";
  const tileSize = mapSnapshot.showTileEdges ? platformTileSize - platformTileGap : platformTileSize;
  const tileGeometry = new THREE.BoxGeometry(
    tileSize,
    platformThickness,
    tileSize,
  );
  const tileMaterial = new THREE.MeshStandardMaterial({
    color: 0x5d5a46,
    roughness: 0.86,
    metalness: 0.02,
  });

  for (const key of mapSnapshot.activeTiles) {
    const tile = parseTileKey(key);
    const worldCenter = mapTileCenterToWorld(tile);
    const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
    tileMesh.position.set(worldCenter.x, -platformThickness / 2, worldCenter.z);
    platform.add(tileMesh);
  }

  const seams = mapSnapshot.showTileEdges ? createPlatformSeamLines(mapSnapshot.activeTiles) : null;
  const walls = mapSnapshot.isCovered ? createPlatformWalls(mapSnapshot.activeTiles) : null;

  if (seams) {
    platform.add(seams);
  }

  if (walls) {
    platform.add(walls);
  }

  return platform;
}

function createPlatformSeamLines(activeTiles) {
  const positions = [];

  for (const key of activeTiles) {
    const tile = parseTileKey(key);
    const center = mapTileCenterToWorld(tile);
    const minX = center.x - platformTileSize / 2;
    const maxX = center.x + platformTileSize / 2;
    const minZ = center.z - platformTileSize / 2;
    const maxZ = center.z + platformTileSize / 2;

    positions.push(minX, 0.014, minZ, maxX, 0.014, minZ);
    positions.push(maxX, 0.014, minZ, maxX, 0.014, maxZ);
    positions.push(maxX, 0.014, maxZ, minX, 0.014, maxZ);
    positions.push(minX, 0.014, maxZ, minX, 0.014, minZ);
  }

  if (positions.length === 0) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0xe6d078 }));
}

function createPlatformWalls(activeTiles) {
  const walls = new THREE.Group();
  walls.name = "PerimeterWalls";
  const horizontalWallMaterial = new THREE.MeshStandardMaterial({
    color: 0x343228,
    roughness: 0.9,
    metalness: 0.01,
  });
  const verticalWallMaterial = horizontalWallMaterial.clone();
  const horizontalWallGeometry = new THREE.BoxGeometry(
    platformTileSize,
    platformWallHeight,
    platformWallThickness,
  );
  const verticalWallGeometry = new THREE.BoxGeometry(
    platformWallThickness,
    platformWallHeight,
    platformTileSize,
  );

  for (const key of activeTiles) {
    const tile = parseTileKey(key);
    const center = mapTileCenterToWorld(tile);
    const minX = center.x - platformTileSize / 2;
    const maxX = center.x + platformTileSize / 2;
    const minZ = center.z - platformTileSize / 2;
    const maxZ = center.z + platformTileSize / 2;
    const y = platformWallHeight / 2;

    if (!activeTiles.has(tileKey(tile.x, tile.z - 1))) {
      const wall = new THREE.Mesh(horizontalWallGeometry, horizontalWallMaterial.clone());
      wall.userData.occludesCharacter = true;
      wall.position.set(center.x, y, minZ);
      walls.add(wall);
    }

    if (!activeTiles.has(tileKey(tile.x + 1, tile.z))) {
      const wall = new THREE.Mesh(verticalWallGeometry, verticalWallMaterial.clone());
      wall.userData.occludesCharacter = true;
      wall.position.set(maxX, y, center.z);
      walls.add(wall);
    }

    if (!activeTiles.has(tileKey(tile.x, tile.z + 1))) {
      const wall = new THREE.Mesh(horizontalWallGeometry, horizontalWallMaterial.clone());
      wall.userData.occludesCharacter = true;
      wall.position.set(center.x, y, maxZ);
      walls.add(wall);
    }

    if (!activeTiles.has(tileKey(tile.x - 1, tile.z))) {
      const wall = new THREE.Mesh(verticalWallGeometry, verticalWallMaterial.clone());
      wall.userData.occludesCharacter = true;
      wall.position.set(minX, y, center.z);
      walls.add(wall);
    }
  }

  if (walls.children.length === 0) {
    horizontalWallGeometry.dispose();
    verticalWallGeometry.dispose();
    horizontalWallMaterial.dispose();
    verticalWallMaterial.dispose();
    return null;
  }

  horizontalWallMaterial.dispose();
  verticalWallMaterial.dispose();

  return walls;
}

function prepareModel(model) {
  model.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.castShadow = false;
    node.receiveShadow = false;
    node.frustumCulled = true;

    const maskAtlasTarget = isMaskAtlasTarget(node);
    if (maskAtlasTarget) {
      node.material = cloneMaterialCollection(node.material);
    }

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (material) {
        if (material.map?.image) {
          if (maskAtlasTarget) {
            maskAtlasMaterials.add(material);
          } else {
            paletteMaterials.add(material);
          }
        }

        if (!sourceCharacterTextureImage && material.map?.image) {
          sourceCharacterTextureImage = material.map.image;
          sourceCharacterTextureSettings = snapshotTextureSettings(material.map);
        }

        material.needsUpdate = true;
      }
    }
  });
}

function cloneMaterialCollection(material) {
  if (Array.isArray(material)) {
    return material.map((entry) => entry?.clone?.() || entry);
  }

  return material?.clone?.() || material;
}

function isMaskAtlasTarget(node) {
  const name = `${node.name || ""} ${node.geometry?.name || ""}`.toLowerCase();
  return name.includes("roguehooded_mask");
}

function snapshotTextureSettings(texture) {
  return {
    wrapS: texture.wrapS,
    wrapT: texture.wrapT,
    offset: texture.offset.clone(),
    repeat: texture.repeat.clone(),
    center: texture.center.clone(),
    rotation: texture.rotation,
  };
}

function fitModelToPlatform(model) {
  const sourceBox = new THREE.Box3().setFromObject(model);
  const sourceSize = sourceBox.getSize(new THREE.Vector3());
  const maxDimension = Math.max(sourceSize.x, sourceSize.y, sourceSize.z);

  if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
    return sourceBox;
  }

  const targetHeight = 5.2;
  const maxFootprint = Math.max(sourceSize.x, sourceSize.z);
  let scale = targetHeight / Math.max(sourceSize.y, 0.001);

  if (maxFootprint * scale > 8.2) {
    scale = 8.2 / maxFootprint;
  }

  model.scale.setScalar(THREE.MathUtils.clamp(scale, 0.001, 1000));

  const fittedBox = new THREE.Box3().setFromObject(model);
  const fittedCenter = fittedBox.getCenter(new THREE.Vector3());
  model.position.x -= fittedCenter.x;
  model.position.z -= fittedCenter.z;
  model.position.y -= fittedBox.min.y;

  return new THREE.Box3().setFromObject(model);
}

function frameScene() {
  if (characterModel) {
    const characterBox = new THREE.Box3().setFromObject(characterModel);
    if (!characterBox.isEmpty()) {
      frameModel(characterBox);
      return;
    }
  }

  if (platformGroup) {
    const platformBox = new THREE.Box3().setFromObject(platformGroup);
    if (!platformBox.isEmpty()) {
      frameModel(platformBox);
    }
  }
}

function frameModel(modelBox) {
  const size = modelBox.getSize(new THREE.Vector3());
  const center = modelBox.getCenter(new THREE.Vector3());
  const target = new THREE.Vector3(center.x, Math.max(1.45, Math.min(size.y * 0.45, 2.7)), center.z);
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const viewHeight = Math.max(size.y * 1.22, 7.2);
  const viewWidth = Math.max(Math.max(size.x, size.z) * 1.2, platformTileSize * 2.4);
  const distanceForHeight = viewHeight / (2 * Math.tan(verticalFov / 2));
  const distanceForWidth = viewWidth / (2 * Math.tan(verticalFov / 2) * Math.max(camera.aspect, 0.32));
  const distance = Math.max(distanceForHeight, distanceForWidth);
  cameraControlState.anchorTarget.copy(target);
  cameraControlState.anchorDistance = distance;

  camera.far = Math.max(120, distance * 2.6);
  camera.updateProjectionMatrix();

  if (scene.fog) {
    scene.fog.near = Math.max(15, distance * 0.55);
    scene.fog.far = Math.max(34, distance * 1.7);
  }

  controls.minDistance = Math.max(3.5, Math.min(distance * 0.2, 12));
  controls.maxDistance = Math.max(18, distance * 1.7);
  applyAnchoredCameraFrame();
  syncCameraControlUI();
}

function resize() {
  const width = Math.max(sceneElement.clientWidth, 1);
  const height = Math.max(sceneElement.clientHeight, 1);

  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function setStatus(message, state = "loading") {
  statusElement.textContent = message;
  statusElement.classList.toggle("is-error", state === "error");
  statusElement.classList.remove("is-hidden");
}

function setMovementStatus(message) {
  movementStatus.textContent = message;
}

function setWeaponStatus(message) {
  weaponStatus.textContent = message;
}

function hideStatus() {
  statusElement.classList.add("is-hidden");
}

function syncCrosshair() {
  if (!crosshairElement) {
    return;
  }

  const isVisible = Boolean(characterModel && !cameraControlState.freeCamera);
  crosshairElement.classList.toggle("is-visible", isVisible);
  crosshairElement.classList.toggle("is-firing", isVisible && playerControlState.shooting);
}
