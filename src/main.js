import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { clone as cloneSkeleton } from "three/addons/utils/SkeletonUtils.js";
import { defaultMapConfig } from "./map-config.js";

const sceneElement = document.querySelector("[data-scene]");
const statusElement = document.querySelector("#status");
const crosshairElement = document.querySelector("[data-crosshair]");
const phoneShellElement = document.querySelector(".phone-shell");
const healthHudElement = document.querySelector("[data-health-hud]");
const damageFlashElement = document.querySelector("[data-damage-flash]");
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
const mapToolButtons = document.querySelectorAll("[data-map-tool]");
const floorMaterialSelect = document.querySelector("#floorMaterialSelect");
const wallMaterialSelect = document.querySelector("#wallMaterialSelect");
const ceilingMaterialSelect = document.querySelector("#ceilingMaterialSelect");
const floorMaterialPreview = document.querySelector("#floorMaterialPreview");
const wallMaterialPreview = document.querySelector("#wallMaterialPreview");
const ceilingMaterialPreview = document.querySelector("#ceilingMaterialPreview");
const materialPreviewPopover = document.querySelector("#materialPreviewPopover");
const materialPreviewPopoverImage = document.querySelector("#materialPreviewPopoverImage");
const materialPreviewPopoverLabel = document.querySelector("#materialPreviewPopoverLabel");
const devTabButtons = document.querySelectorAll("[data-dev-tab]");
const devTabPanels = document.querySelectorAll("[data-dev-panel]");
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
const minionUrl = new URL("../assets/minion.glb", import.meta.url).href;
const runtimeHost = window.location.hostname;
const runtimeIsLocal = window.location.protocol === "file:"
  || runtimeHost === "localhost"
  || runtimeHost === "127.0.0.1"
  || runtimeHost === "::1";
const runtimeIsGithubPages = runtimeHost.endsWith("github.io");
const runtimeIsStaticHosted = !runtimeIsLocal && runtimeIsGithubPages;
const gunPackPath = "../assets/Styloo Guns Asset Pack GLTF FBX V1.1/Normal version Color and NormalMap/GLB/";
const sewerTextureUrls = {
  floor: [
    { id: "concrete-base", label: "Concreto base", url: new URL("../assets/Sewer/Textures/concrete_base.png", import.meta.url).href, repeatX: 1.5, repeatY: 1.5, color: 0x8f8974 },
    { id: "concrete-base-02", label: "Concreto claro", url: new URL("../assets/Sewer/Textures/concrete_base_02.jpg", import.meta.url).href, repeatX: 1.45, repeatY: 1.45, color: 0x86836f },
    { id: "debris-02", label: "Entulho", url: new URL("../assets/Sewer/Textures/debris_02.jpg", import.meta.url).href, repeatX: 1.35, repeatY: 1.35, color: 0x7d7966 },
    { id: "soil-mud", label: "Lama", url: new URL("../assets/Sewer/Textures/soil_mud.jpg", import.meta.url).href, repeatX: 1.75, repeatY: 1.75, color: 0x716b58 },
    { id: "concrete-dirty-2", label: "Concreto sujo", url: new URL("../assets/Sewer/Textures/concrete_dirty_2.jpg", import.meta.url).href, repeatX: 1.65, repeatY: 1.65, color: 0x8a8368 },
  ],
  wall: [
    { id: "brick-modern-01", label: "Tijolo moderno", url: new URL("../assets/Sewer/Textures/brick_modern_01.jpg", import.meta.url).href, repeatX: 2.4, repeatY: 3.6, color: 0x7d7a68 },
    { id: "concrete-dirty", label: "Concreto manchado", url: new URL("../assets/Sewer/Textures/concrete_dirty.jpg", import.meta.url).href, repeatX: 1.7, repeatY: 2.6, color: 0x79776b },
    { id: "concrete-dirty-2", label: "Concreto escuro", url: new URL("../assets/Sewer/Textures/concrete_dirty_2.jpg", import.meta.url).href, repeatX: 1.35, repeatY: 2.2, color: 0x747164 },
    { id: "metal", label: "Metal", url: new URL("../assets/Sewer/Textures/Metal.jpg", import.meta.url).href, repeatX: 1.6, repeatY: 2.2, color: 0x8b8a82, metalness: 0.18, roughness: 0.82 },
  ],
  ceiling: [
    { id: "bricks", label: "Tijolos", url: new URL("../assets/Sewer/Textures/bricks.jpg", import.meta.url).href, repeatX: 2.1, repeatY: 2.1, color: 0x777465 },
    { id: "concrete-dirty-2", label: "Concreto escuro", url: new URL("../assets/Sewer/Textures/concrete_dirty_2.jpg", import.meta.url).href, repeatX: 1.45, repeatY: 1.45, color: 0x777263 },
  ],
};
const defaultMapMaterials = {
  floor: sewerTextureUrls.floor[0].id,
  wall: sewerTextureUrls.wall[0].id,
  ceiling: sewerTextureUrls.ceiling[0].id,
};
const materialControls = {
  floor: { select: floorMaterialSelect, preview: floorMaterialPreview },
  wall: { select: wallMaterialSelect, preview: wallMaterialPreview },
  ceiling: { select: ceilingMaterialSelect, preview: ceilingMaterialPreview },
};
const mapTools = new Set(["tile", "light", "enemy"]);
const mapDirectionOptions = [
  { id: "east", x: 1, z: 0 },
  { id: "southeast", x: 1, z: 1 },
  { id: "south", x: 0, z: 1 },
  { id: "southwest", x: -1, z: 1 },
  { id: "west", x: -1, z: 0 },
  { id: "northwest", x: -1, z: -1 },
  { id: "north", x: 0, z: -1 },
  { id: "northeast", x: 1, z: -1 },
];
const defaultMapDirection = "south";
const mapSize = 16;
const mapCenter = mapSize / 2;
const platformTileSize = 5;
const platformThickness = 0.18;
const platformTileGap = 0.04;
const platformWallTilesHigh = 2;
const platformWallHeight = platformTileSize * platformWallTilesHigh;
const platformWallThickness = 0.32;
const platformCeilingThickness = 0.2;
const sewerLightCableLength = 0.68;
const sewerStageLightColors = [0xffd591, 0xb8ffd6, 0xffc46f, 0xdce7ff, 0xf0ffad, 0xffa985];
const sewerFillLightDistance = platformTileSize * 3.1;
const sewerDownLightDistance = platformTileSize * 4.6;
const sewerFillLightIntensity = 72;
const sewerDownLightIntensity = 255;
const sewerMaxShadowCastingSpotLights = 6;
const sewerReservedFragmentTextureUnits = 6;
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
  targetOffset: new THREE.Vector3(-2.05, 2.843, 2.373),
};
const defaultCameraOffset = {
  x: 0.2,
  y: 1.2,
  z: 0.2,
};
const defaultPlayerAimPitchRadians = THREE.MathUtils.degToRad(7.63);
const freeCameraMoveSpeed = 12;
const freeCameraWheelSpeed = 0.018;
const playerWalkSpeed = 5.4;
const playerRunSpeed = 9.4;
const playerAimMoveSpeedMultiplier = 0.62;
const playerCollisionRadius = 0.72;
const playerWallCollisionPadding = platformWallThickness / 2 + 0.18;
const playerMouseYawSensitivity = 0.0028;
const playerMousePitchSensitivity = 0.0022;
const playerAimMouseSensitivityMultiplier = 0.68;
const playerMousePitchLimit = THREE.MathUtils.degToRad(22);
const playerMaxHealth = 50;
const playerFireInterval = 0.11;
const projectileMaxDistance = 80;
const projectileBodyDamage = 2;
const projectileHeadDamage = 10;
const impactEffectDuration = 0.22;
const impactLightIntensity = 5.6;
const enemyHitReactDuration = 0.18;
const enemyMaxHealth = 20;
const enemyVisionDistance = platformTileSize * 7.2;
const enemyWalkSpeed = 1.35;
const enemyCollisionRadius = 0.75;
const enemyAttackRange = 1.65;
const enemyAttackDamage = 6;
const enemyAttackCooldown = 1.25;
const enemyAttackHitTime = 0.42;
const enemySpawnGroundChance = 0.05;
const enemyAwakenFloorLongChance = 0.07;
const enemyAwakenFloorChance = 0.18;
const enemyHalfHealthFallChance = 0.3;
const enemyDownedSecondsMin = 1.8;
const enemyDownedSecondsMax = 3.2;
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
      clip("Ranged_1H_Aiming", false),
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
      clip("Combo_Walking_A_Ranged_1H_Aiming", true, {
        label: "Andar + mirar 1H",
        combo: {
          lower: "Walking_A",
          upper: "Ranged_1H_Aiming",
          upperLoop: false,
        },
      }),
      clip("Combo_Running_B_Ranged_1H_Aiming", true, {
        label: "Correr B + mirar 1H",
        combo: {
          lower: "Running_B",
          upper: "Ranged_1H_Aiming",
          upperLoop: false,
        },
      }),
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
const enemyAnimationIds = [
  "Skeletons_Idle",
  "Skeletons_Walking",
  "Skeletons_Awaken_Floor",
  "Skeletons_Awaken_Floor_Long",
  "Skeletons_Spawn_Ground",
  "Skeletons_Death",
  "Skeletons_Death_Pose",
  "Skeletons_Death_Resurrect",
  "EXPERIMENTAL_Medium_Transform",
  "Melee_Unarmed_Attack_Punch_A",
  "Melee_1H_Attack_Chop",
];
const enemyLoopingAnimations = new Set([
  "Skeletons_Idle",
  "Skeletons_Walking",
  "Skeletons_Death_Pose",
]);
const enemyPrimaryAttackAnimation = "Melee_Unarmed_Attack_Punch_A";
const enemyFallbackAttackAnimation = "Melee_1H_Attack_Chop";

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
let enemySourceModel = null;
let enemyGroup = null;
let activeEnemies = [];
let activeImpactEffects = [];
const wallOcclusionRaycaster = new THREE.Raycaster();
const wallOcclusionTarget = new THREE.Vector3();
const wallOccluders = new Set();
const transparentWallOccluders = new Set();
const enemyLineOfSightRaycaster = new THREE.Raycaster();
const enemyBoundsBox = new THREE.Box3();
const enemyBoundsSize = new THREE.Vector3();
const enemyEyePosition = new THREE.Vector3();
const enemyMoveDirection = new THREE.Vector3();
const enemyNextPosition = new THREE.Vector3();
const enemyPlayerTarget = new THREE.Vector3();
const enemyProjectileRaycaster = new THREE.Raycaster();
const projectileDirection = new THREE.Vector3();
const shotImpactPoint = new THREE.Vector3();
const shotImpactNormal = new THREE.Vector3();
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

const impactGeometry = new THREE.SphereGeometry(0.075, 10, 6);
const impactMaterial = new THREE.MeshBasicMaterial({
  color: 0xfff1c1,
  transparent: true,
  opacity: 0.92,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

const baseAmbientLight = new THREE.HemisphereLight(0xf7efd8, 0x24231f, 0.62);
scene.add(baseAmbientLight);

const textureLoader = new THREE.TextureLoader();
const sewerSurfaceVariants = {
  floor: sewerTextureUrls.floor.map(loadSewerSurfaceVariant),
  wall: sewerTextureUrls.wall.map(loadSewerSurfaceVariant),
  ceiling: sewerTextureUrls.ceiling.map(loadSewerSurfaceVariant),
};

document.body.classList.toggle("is-runtime-local", runtimeIsLocal);
document.body.classList.toggle("is-runtime-static", runtimeIsStaticHosted);

platformGroup = createPlatform(createAppliedMapSnapshot());
scene.add(platformGroup);
collectWallOccluders(platformGroup);

const loader = new GLTFLoader();
populateMovementSelect();
populateWeaponSelect();
setupMapEditor();
setupDevPanelTabs();
setupCameraControls();
setupAttachmentControls();
renderColorPanel();
setupColorControls();
setupStartScreen();
syncPlayerHealthHud();

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(sceneElement);
resize();

function loadSewerSurfaceVariant(config) {
  return {
    ...config,
    texture: loadSewerTexture(config.url, config.repeatX, config.repeatY),
  };
}

function loadSewerTexture(url, repeatX = 1, repeatY = 1) {
  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = 4;
  return texture;
}

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();

  if (!cameraControlState.freeCamera) {
    updatePlayerControls(delta);
  }

  if (mixer) {
    mixer.update(delta);
  }

  updateImpactEffects(delta);
  updateEnemies(delta);

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

    const [modelGltf, minionGltf, ...animationGltfs] = await Promise.all([
      loadGltf(modelUrl),
      loadGltf(minionUrl),
      ...animationUrls.map((url) => loadGltf(url)),
    ]);

    characterModel = modelGltf.scene;
    prepareModel(characterModel);
    applyCharacterPalette();
    scene.add(characterModel);

    fitModelToPlatform(characterModel);
    positionCharacterOnMap(mapEditorState.appliedPlayerPosition, mapEditorState.appliedPlayerDirection);
    heldSlot = findObjectByName(characterModel, activeWeapon.slotName);
    await equipWeapon(activeWeapon.id);
    enemySourceModel = minionGltf.scene;
    prepareStaticModel(enemySourceModel);
    fitEnemyModelToTile(enemySourceModel);
    frameScene();
    setupAnimationMixer(characterModel, animationGltfs);
    renderAppliedEnemies();
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

function setupDevPanelTabs() {
  if (!devTabButtons.length || !devTabPanels.length) {
    return;
  }

  for (const button of devTabButtons) {
    button.addEventListener("click", () => {
      setActiveDevPanel(button.dataset.devTab, { focusTab: false });
    });
    button.addEventListener("keydown", handleDevTabKeydown);
  }

  const selectedTab = [...devTabButtons].find((button) => button.getAttribute("aria-selected") === "true")
    || devTabButtons[0];
  setActiveDevPanel(selectedTab?.dataset.devTab || "map", { focusTab: false });
}

function handleDevTabKeydown(event) {
  const tabs = [...devTabButtons];
  const currentIndex = tabs.indexOf(event.currentTarget);
  if (currentIndex < 0) {
    return;
  }

  const keyOffsets = {
    ArrowLeft: -1,
    ArrowUp: -1,
    ArrowRight: 1,
    ArrowDown: 1,
  };
  let nextIndex = currentIndex;

  if (event.key in keyOffsets) {
    event.preventDefault();
    nextIndex = (currentIndex + keyOffsets[event.key] + tabs.length) % tabs.length;
  } else if (event.key === "Home") {
    event.preventDefault();
    nextIndex = 0;
  } else if (event.key === "End") {
    event.preventDefault();
    nextIndex = tabs.length - 1;
  } else {
    return;
  }

  setActiveDevPanel(tabs[nextIndex].dataset.devTab, { focusTab: true });
}

function setActiveDevPanel(tabId, { focusTab = false } = {}) {
  for (const button of devTabButtons) {
    const isActive = button.dataset.devTab === tabId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
    if (isActive && focusTab) {
      button.focus();
    }
  }

  for (const panel of devTabPanels) {
    const isActive = panel.dataset.devPanel === tabId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  }

  if (tabId === "map") {
    window.requestAnimationFrame(() => {
      resizeMapEditorCanvas();
      renderMapEditor();
    });
  }
}

function setupMapEditor() {
  if (!mapCanvas || !mapViewport) {
    return;
  }

  populateMapMaterialControls();

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
  for (const button of mapToolButtons) {
    button.addEventListener("click", () => {
      setMapActiveTool(button.dataset.mapTool);
    });
  }
  for (const [surface, control] of Object.entries(materialControls)) {
    control.select?.addEventListener("change", () => {
      setMapMaterial(surface, control.select.value);
    });
    control.select?.addEventListener("pointerenter", (event) => {
      showMaterialPreviewPopover(surface, event.currentTarget);
    });
    control.select?.addEventListener("focus", (event) => {
      showMaterialPreviewPopover(surface, event.currentTarget);
    });
    control.select?.addEventListener("pointerleave", hideMaterialPreviewPopover);
    control.select?.addEventListener("blur", hideMaterialPreviewPopover);
    control.preview?.addEventListener("pointerenter", (event) => {
      showMaterialPreviewPopover(surface, event.currentTarget);
    });
    control.preview?.addEventListener("pointerleave", hideMaterialPreviewPopover);
  }

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
  renderer.domElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  renderer.domElement.addEventListener("pointerdown", handlePlayerPointerDown);
  window.addEventListener("pointerup", handlePlayerPointerUp);
  window.addEventListener("mouseup", handlePlayerMouseButtonChange);
  window.addEventListener("blur", clearPlayerMouseButtons);
  document.addEventListener("visibilitychange", handlePlayerVisibilityChange);
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
    aiming: false,
    yawRadians: 0,
    pitchRadians: defaultPlayerAimPitchRadians,
    pointerLocked: false,
    maxHealth: playerMaxHealth,
    health: playerMaxHealth,
    dead: false,
    fireCooldown: 0,
    hitReactTimer: 0,
  };
}

function setFreeCameraEnabled(enabled) {
  cameraControlState.freeCamera = enabled;
  cameraControlState.pressedKeys.clear();
  playerControlState.pressedKeys.clear();
  playerControlState.shooting = false;
  playerControlState.aiming = false;
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

  const sensitivityMultiplier = playerControlState.aiming ? playerAimMouseSensitivityMultiplier : 1;
  if (movementX) {
    playerControlState.yawRadians = normalizeRadians(
      playerControlState.yawRadians - movementX * playerMouseYawSensitivity * sensitivityMultiplier,
    );
  }

  if (movementY) {
    playerControlState.pitchRadians = THREE.MathUtils.clamp(
      playerControlState.pitchRadians + movementY * playerMousePitchSensitivity * sensitivityMultiplier,
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

  if (cameraControlState.freeCamera || playerControlState.dead || (event.button !== 0 && event.button !== 2)) {
    return;
  }

  event.preventDefault();
  requestPlayerPointerLock();
  syncPlayerMouseButtons(event);
}

function handlePlayerPointerUp(event) {
  if (event.button !== 0 && event.button !== 2) {
    return;
  }

  syncPlayerMouseButtons(event);
}

function handlePlayerMouseButtonChange(event) {
  if (event.button !== 0 && event.button !== 2) {
    return;
  }

  syncPlayerMouseButtons(event);
}

function handlePlayerVisibilityChange() {
  if (document.visibilityState === "hidden") {
    clearPlayerMouseButtons();
  }
}

function handlePlayerPointerLockChange() {
  playerControlState.pointerLocked = document.pointerLockElement === renderer.domElement;
  if (!playerControlState.pointerLocked) {
    clearPlayerMouseButtons();
    return;
  }

  syncCrosshair();
}

function syncPlayerMouseButtons(event) {
  const buttons = Number.isInteger(event.buttons) ? event.buttons : mouseButtonMaskFromEvent(event);
  const nextShooting = Boolean(buttons & 1);
  const nextAiming = Boolean(buttons & 2);
  const changed = playerControlState.shooting !== nextShooting || playerControlState.aiming !== nextAiming;

  playerControlState.shooting = nextShooting;
  playerControlState.aiming = nextAiming;

  if (changed) {
    syncCrosshair();
  }
}

function clearPlayerMouseButtons() {
  const changed = playerControlState.shooting || playerControlState.aiming;
  playerControlState.shooting = false;
  playerControlState.aiming = false;

  if (changed) {
    syncCrosshair();
  }
}

function mouseButtonMaskFromEvent(event) {
  if (event.type.endsWith("down")) {
    if (event.button === 0) {
      return 1;
    }

    if (event.button === 2) {
      return 2;
    }
  }

  return 0;
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

  if (playerControlState.dead) {
    updateCameraAnchorFromCharacter();
    applyAnchoredCameraFrame(delta);
    return;
  }

  applyPlayerYaw();

  const movement = getPlayerMovementVector();
  const isMoving = movement.lengthSq() > 0.0001;
  const isRunning = !playerControlState.aiming && playerControlState.pressedKeys.has("shift");

  if (isMoving) {
    const baseSpeed = isRunning ? playerRunSpeed : playerWalkSpeed;
    const speed = playerControlState.aiming ? baseSpeed * playerAimMoveSpeedMultiplier : baseSpeed;
    movement.normalize().multiplyScalar(speed * delta);
    moveCharacterWithCollision(movement);
    syncMapPlayerPositionFromCharacter();
  }

  playerControlState.hitReactTimer = Math.max(0, playerControlState.hitReactTimer - delta);
  if (playerControlState.hitReactTimer <= 0) {
    updatePlayerAnimation(isMoving, isRunning, playerControlState.shooting, playerControlState.aiming);
  }

  updatePlayerWeaponFire(delta);
  updateCameraAnchorFromCharacter();
  applyAnchoredCameraFrame(delta);
}

function updatePlayerWeaponFire(delta) {
  playerControlState.fireCooldown = Math.max(0, playerControlState.fireCooldown - delta);

  if (!playerControlState.shooting || playerControlState.fireCooldown > 0 || cameraControlState.freeCamera) {
    return;
  }

  firePlayerProjectile();
  playerControlState.fireCooldown = playerFireInterval;
}

function firePlayerProjectile() {
  if (!characterModel || playerControlState.dead) {
    return;
  }

  camera.getWorldDirection(projectileDirection).normalize();
  enemyProjectileRaycaster.set(camera.position, projectileDirection);
  enemyProjectileRaycaster.near = 0;
  enemyProjectileRaycaster.far = projectileMaxDistance;

  const wallHits = wallOccluders.size
    ? enemyProjectileRaycaster.intersectObjects([...wallOccluders], false)
    : [];
  const closestWallDistance = wallHits[0]?.distance ?? Infinity;
  const enemyHit = getClosestProjectileEnemyHit(closestWallDistance);

  if (enemyHit) {
    getShotImpactNormal(enemyHit, shotImpactNormal);
    const damage = isProjectileHeadshot(enemyHit.enemy, enemyHit.point, enemyHit.object)
      ? projectileHeadDamage
      : projectileBodyDamage;
    createImpactEffect(enemyHit.point, shotImpactNormal, { hitEnemy: true });
    damageEnemy(enemyHit.enemy, damage, { source: "shot" });
    return;
  }

  if (closestWallDistance < Infinity) {
    const wallHit = wallHits[0];
    getShotImpactNormal(wallHit, shotImpactNormal);
    createImpactEffect(wallHit.point, shotImpactNormal, { hitEnemy: false });
  }
}

function getClosestProjectileEnemyHit(maxDistance) {
  let closestHit = null;
  let closestDistance = maxDistance;

  for (const enemy of activeEnemies) {
    if (!isEnemyTargetable(enemy)) {
      continue;
    }

    const hits = enemyProjectileRaycaster.intersectObject(enemy.model, true);
    const [hit] = hits;
    if (hit && hit.distance < closestDistance) {
      closestDistance = hit.distance;
      closestHit = {
        enemy,
        object: hit.object,
        point: hit.point,
        distance: hit.distance,
      };
    }
  }

  return closestHit;
}

function getShotImpactNormal(hit, target) {
  if (hit.face?.normal && hit.object?.matrixWorld) {
    target.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).normalize();
    return target;
  }

  return target.copy(projectileDirection).multiplyScalar(-1).normalize();
}

function createImpactEffect(point, normal, { hitEnemy = false } = {}) {
  const material = impactMaterial.clone();
  const mesh = new THREE.Mesh(impactGeometry, material);
  const light = new THREE.PointLight(hitEnemy ? 0xffd0a8 : 0xfff1c1, impactLightIntensity, 3.2, 2);
  const scale = hitEnemy ? 1.35 : 1;

  mesh.name = hitEnemy ? "EnemyImpact" : "WorldImpact";
  mesh.position.copy(point).addScaledVector(normal, 0.04);
  mesh.scale.setScalar(scale);
  light.position.copy(mesh.position).addScaledVector(normal, 0.04);
  scene.add(mesh, light);
  activeImpactEffects.push({
    mesh,
    light,
    age: 0,
    duration: impactEffectDuration,
    baseScale: scale,
  });
}

function updateImpactEffects(delta) {
  if (!activeImpactEffects.length) {
    return;
  }

  for (let index = activeImpactEffects.length - 1; index >= 0; index -= 1) {
    const effect = activeImpactEffects[index];
    effect.age += delta;
    const progress = THREE.MathUtils.clamp(effect.age / effect.duration, 0, 1);
    const fade = 1 - progress;

    effect.mesh.scale.setScalar(effect.baseScale * (1 + progress * 2.8));
    effect.mesh.material.opacity = 0.92 * fade;
    effect.light.intensity = impactLightIntensity * fade;

    if (progress >= 1) {
      effect.mesh.removeFromParent();
      effect.light.removeFromParent();
      effect.mesh.material.dispose();
      activeImpactEffects.splice(index, 1);
    }
  }
}

function isProjectileHeadshot(enemy, hitPoint, hitObject) {
  let object = hitObject;
  while (object) {
    if ((object.name || "").toLowerCase().includes("head")) {
      return true;
    }
    object = object.parent;
  }

  enemyBoundsBox.setFromObject(enemy.model);
  if (enemyBoundsBox.isEmpty()) {
    return false;
  }

  enemyBoundsBox.getSize(enemyBoundsSize);
  const headLine = enemyBoundsBox.min.y + enemyBoundsSize.y * 0.72;
  return hitPoint.y >= headLine;
}

function clearImpactEffects() {
  for (const effect of activeImpactEffects) {
    effect.mesh.removeFromParent();
    effect.light.removeFromParent();
    effect.mesh.material.dispose();
  }

  activeImpactEffects = [];
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
  const radius = playerCollisionRadius + playerWallCollisionPadding;
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
  mapEditorState.playerDirection = directionFromYaw(playerControlState.yawRadians);
  mapEditorState.appliedPlayerDirection = mapEditorState.playerDirection;
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

function updatePlayerAnimation(isMoving, isRunning, isShooting, isAiming) {
  if (!mixer) {
    return;
  }

  let movementId = defaultMovementId;
  if (isMoving && isShooting && isRunning) {
    movementId = "Combo_Running_B_Ranged_1H_Shooting";
  } else if (isMoving && isShooting) {
    movementId = "Combo_Walking_A_Ranged_1H_Shooting";
  } else if (isMoving && isAiming && isRunning) {
    movementId = "Combo_Running_B_Ranged_1H_Aiming";
  } else if (isMoving && isAiming) {
    movementId = "Combo_Walking_A_Ranged_1H_Aiming";
  } else if (isMoving && isRunning) {
    movementId = "Running_B";
  } else if (isMoving) {
    movementId = "Walking_A";
  } else if (isShooting) {
    movementId = "Ranged_1H_Shooting";
  } else if (isAiming) {
    movementId = "Ranged_1H_Aiming";
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
  const playerDirection = normalizeMapDirection(defaultMapConfig.playerDirection);
  const lights = createDefaultMapLights(activeTiles);
  const enemies = createDefaultMapEnemies(activeTiles);
  const materials = createDefaultMapMaterials();
  const appliedShowTileEdges = false;
  const appliedIsCovered = true;

  return {
    activeTiles,
    appliedTiles: cloneTileSet(activeTiles),
    playerPosition,
    appliedPlayerPosition: { ...playerPosition },
    playerDirection,
    appliedPlayerDirection: playerDirection,
    lights,
    appliedLights: cloneTileSet(lights),
    enemies,
    appliedEnemies: cloneMapEnemies(enemies),
    materials,
    appliedMaterials: { ...materials },
    activeTool: "tile",
    pendingDirection: null,
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

function createDefaultMapLights(activeTiles) {
  const normalized = new Set();
  if (!Array.isArray(defaultMapConfig.lights)) {
    return normalized;
  }

  for (const light of defaultMapConfig.lights) {
    const tile = normalizeMapTilePoint(light);
    if (tile && activeTiles.has(tileKey(tile.x, tile.z))) {
      normalized.add(tileKey(tile.x, tile.z));
    }
  }

  return normalized;
}

function createDefaultMapEnemies(activeTiles) {
  if (!Array.isArray(defaultMapConfig.enemies)) {
    return [];
  }

  return defaultMapConfig.enemies
    .map((enemy) => normalizeMapEnemy(enemy, activeTiles))
    .filter(Boolean);
}

function createDefaultMapMaterials() {
  const configuredMaterials = defaultMapConfig.materials || {};
  return {
    floor: normalizeMapMaterialId("floor", configuredMaterials.floor),
    wall: normalizeMapMaterialId("wall", configuredMaterials.wall),
    ceiling: normalizeMapMaterialId("ceiling", configuredMaterials.ceiling),
  };
}

function normalizeMapTilePoint(source) {
  const point = Array.isArray(source) ? { x: source[0], z: source[1] } : source;
  const x = Number(point?.x);
  const z = Number(point?.z);

  if (!Number.isFinite(x) || !Number.isFinite(z)) {
    return null;
  }

  return tileFromMapPoint({
    x: THREE.MathUtils.clamp(x, 0, mapSize - 0.001),
    z: THREE.MathUtils.clamp(z, 0, mapSize - 0.001),
  });
}

function normalizeMapEnemy(enemy, activeTiles = mapEditorState?.activeTiles) {
  const position = Array.isArray(enemy) ? { x: enemy[0], z: enemy[1] } : enemy;
  const x = Number(position?.x);
  const z = Number(position?.z);

  if (!Number.isFinite(x) || !Number.isFinite(z)) {
    return null;
  }

  const normalizedPosition = {
    x: roundMapCoordinate(THREE.MathUtils.clamp(x, 0, mapSize)),
    z: roundMapCoordinate(THREE.MathUtils.clamp(z, 0, mapSize)),
  };

  if (activeTiles && !isMapPointInsideTiles(normalizedPosition, activeTiles)) {
    return null;
  }

  return {
    x: normalizedPosition.x,
    z: normalizedPosition.z,
    direction: normalizeMapDirection(position?.direction),
  };
}

function normalizeMapMaterialId(surface, value) {
  const variants = sewerTextureUrls[surface] || [];
  return variants.some((variant) => variant.id === value) ? value : defaultMapMaterials[surface];
}

function normalizeMapDirection(value) {
  return mapDirectionOptions.some((direction) => direction.id === value) ? value : defaultMapDirection;
}

function cloneTileSet(source) {
  return new Set(source);
}

function cloneMapEnemies(enemies) {
  return enemies.map((enemy) => ({ ...enemy }));
}

function createAppliedMapSnapshot() {
  return {
    activeTiles: cloneTileSet(mapEditorState.appliedTiles),
    playerPosition: { ...mapEditorState.appliedPlayerPosition },
    playerDirection: mapEditorState.appliedPlayerDirection,
    lights: cloneTileSet(mapEditorState.appliedLights),
    enemies: cloneMapEnemies(mapEditorState.appliedEnemies),
    materials: { ...mapEditorState.appliedMaterials },
    showTileEdges: mapEditorState.appliedShowTileEdges,
    isCovered: mapEditorState.appliedIsCovered,
  };
}

function setMapBuildOption(option, value) {
  if (mapEditorState[option] === value) {
    return;
  }

  mapEditorState[option] = value;
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function markMapDirty() {
  mapEditorState.dirty = true;
  mapEditorState.feedbackMessage = null;
  mapEditorState.feedbackIsError = false;
}

function populateMapMaterialControls() {
  for (const [surface, control] of Object.entries(materialControls)) {
    if (!control.select) {
      continue;
    }

    control.select.replaceChildren();
    for (const variant of sewerTextureUrls[surface] || []) {
      const option = document.createElement("option");
      option.value = variant.id;
      option.textContent = variant.label;
      control.select.append(option);
    }
  }

  syncMapMaterialControls();
}

function setMapActiveTool(tool) {
  if (!mapTools.has(tool) || mapEditorState.activeTool === tool) {
    return;
  }

  mapEditorState.activeTool = tool;
  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  syncMapToolControls();
  renderMapEditor();
}

function setMapMaterial(surface, materialId) {
  const nextMaterialId = normalizeMapMaterialId(surface, materialId);
  if (mapEditorState.materials[surface] === nextMaterialId) {
    syncMapMaterialControls();
    return;
  }

  mapEditorState.materials[surface] = nextMaterialId;
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function syncMapToolControls() {
  for (const button of mapToolButtons) {
    const isActive = button.dataset.mapTool === mapEditorState.activeTool;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function syncMapMaterialControls() {
  for (const [surface, control] of Object.entries(materialControls)) {
    const materialId = normalizeMapMaterialId(surface, mapEditorState.materials[surface]);
    const variant = getSewerSurfaceVariant(surface, materialId);
    if (control.select) {
      control.select.value = materialId;
    }

    if (control.preview && variant) {
      control.preview.style.backgroundImage = `url("${variant.url}")`;
      control.preview.style.backgroundColor = `#${(variant.color ?? 0x555555).toString(16).padStart(6, "0")}`;
    }
  }
}

function showMaterialPreviewPopover(surface, anchor) {
  if (!materialPreviewPopover || !materialPreviewPopoverImage || !materialPreviewPopoverLabel) {
    return;
  }

  const variant = getSewerSurfaceVariant(surface, mapEditorState.materials[surface]);
  if (!variant) {
    return;
  }

  const rect = anchor.getBoundingClientRect();
  materialPreviewPopoverImage.style.backgroundImage = `url("${variant.url}")`;
  materialPreviewPopoverImage.style.backgroundColor = `#${(variant.color ?? 0x555555).toString(16).padStart(6, "0")}`;
  materialPreviewPopoverLabel.textContent = variant.label;
  materialPreviewPopover.style.left = `${Math.min(rect.right + 10, window.innerWidth - 148)}px`;
  materialPreviewPopover.style.top = `${Math.min(rect.top, window.innerHeight - 112)}px`;
  materialPreviewPopover.classList.add("is-visible");
  materialPreviewPopover.setAttribute("aria-hidden", "false");
}

function hideMaterialPreviewPopover() {
  if (!materialPreviewPopover) {
    return;
  }

  materialPreviewPopover.classList.remove("is-visible");
  materialPreviewPopover.setAttribute("aria-hidden", "true");
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

  if (mapEditorState.pendingDirection) {
    if (event.button === 2) {
      cancelMapPendingDirection();
    } else if (event.button === 0) {
      commitMapPendingDirection(point);
    }

    return;
  }

  if (event.button === 0 && isPointerOnMapPlayer(point)) {
    mapCanvas.setPointerCapture(event.pointerId);
    mapEditorState.pointerId = event.pointerId;
    mapEditorState.interactionMode = "drag-player";
    mapCanvas.classList.add("is-dragging-player");
    moveMapPlayer(point);
    return;
  }

  if (mapEditorState.activeTool === "light") {
    if (event.button === 2) {
      setMapLightActive(tile, false);
    } else if (event.button === 0) {
      setMapLightActive(tile, true);
    }

    return;
  }

  if (mapEditorState.activeTool === "enemy") {
    if (event.button === 2) {
      removeMapEnemyAtPoint(point);
    } else if (event.button === 0) {
      beginMapEnemyPlacement(tile, point);
    }

    return;
  }

  if (event.button === 2) {
    mapCanvas.setPointerCapture(event.pointerId);
    mapEditorState.pointerId = event.pointerId;
    mapEditorState.interactionMode = "erase";
    setMapTileActive(tile, false);
    return;
  }

  if (event.button !== 0) {
    return;
  }

  mapCanvas.setPointerCapture(event.pointerId);
  mapEditorState.pointerId = event.pointerId;
  mapEditorState.interactionMode = "paint";
  setMapTileActive(tile, true);
}

function handleMapPointerMove(event) {
  const point = mapPointFromEvent(event);
  const tile = tileFromMapPoint(point);
  setMapHoverTile(tile);

  if (mapEditorState.pendingDirection) {
    updateMapPendingDirection(point);
    return;
  }

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

  mapCanvas.style.cursor = isPointerOnMapPlayer(point) ? "grab" : cursorForMapTool();
}

function handleMapPointerLeave() {
  if (!mapEditorState.interactionMode && !mapEditorState.pendingDirection) {
    setMapHoverTile(null);
  }
}

function handleMapPointerUp(event) {
  const completedInteractionMode = mapEditorState.interactionMode;
  const point = mapPointFromEvent(event);

  if (mapEditorState.pointerId !== null && mapCanvas.hasPointerCapture(mapEditorState.pointerId)) {
    mapCanvas.releasePointerCapture(mapEditorState.pointerId);
  }

  mapEditorState.pointerId = null;
  mapEditorState.interactionMode = null;
  mapCanvas.classList.remove("is-dragging-player");
  mapCanvas.style.cursor = cursorForMapTool();

  if (completedInteractionMode === "drag-player") {
    beginMapPlayerDirectionPick(point);
  }

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
    mapEditorState.lights.delete(key);
    mapEditorState.enemies = mapEditorState.enemies.filter((enemy) => tileKeyFromMapPoint(enemy) !== key);
  }

  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function setMapLightActive(tile, active) {
  const key = tileKey(tile.x, tile.z);
  if (!mapEditorState.activeTiles.has(key)) {
    return;
  }

  const hasLight = mapEditorState.lights.has(key);
  if (active === hasLight) {
    return;
  }

  if (active) {
    mapEditorState.lights.add(key);
  } else {
    mapEditorState.lights.delete(key);
  }

  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function beginMapEnemyPlacement(tile, point) {
  const key = tileKey(tile.x, tile.z);
  if (!mapEditorState.activeTiles.has(key)) {
    return;
  }

  const position = { x: tile.x + 0.5, z: tile.z + 0.5 };
  mapEditorState.pendingDirection = {
    kind: "enemy",
    position,
    direction: directionFromMapPoints(position, point, defaultMapDirection),
    mousePoint: point,
  };
  mapCanvas.classList.add("is-picking-direction");
  renderMapEditor();
  updateMapEditorControls();
}

function beginMapPlayerDirectionPick(point) {
  mapEditorState.pendingDirection = {
    kind: "player",
    position: { ...mapEditorState.playerPosition },
    direction: directionFromMapPoints(mapEditorState.playerPosition, point, mapEditorState.playerDirection),
    mousePoint: point,
  };
  mapCanvas.classList.add("is-picking-direction");
  renderMapEditor();
}

function updateMapPendingDirection(point) {
  const pending = mapEditorState.pendingDirection;
  if (!pending) {
    return;
  }

  pending.mousePoint = point;
  pending.direction = directionFromMapPoints(pending.position, point, pending.direction);
  renderMapEditor();
}

function commitMapPendingDirection(point) {
  const pending = mapEditorState.pendingDirection;
  if (!pending) {
    return;
  }

  const direction = directionFromMapPoints(pending.position, point, pending.direction);
  if (pending.kind === "player") {
    mapEditorState.playerDirection = direction;
  } else if (pending.kind === "enemy") {
    mapEditorState.enemies.push({
      x: roundMapCoordinate(pending.position.x),
      z: roundMapCoordinate(pending.position.z),
      direction,
    });
  }

  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function cancelMapPendingDirection() {
  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  renderMapEditor();
  updateMapEditorControls();
}

function removeMapEnemyAtPoint(point) {
  const enemyIndex = findMapEnemyIndexAtPoint(point);
  if (enemyIndex < 0) {
    return;
  }

  mapEditorState.enemies.splice(enemyIndex, 1);
  markMapDirty();
  renderMapEditor();
  updateMapEditorControls();
}

function findMapEnemyIndexAtPoint(point) {
  for (let index = mapEditorState.enemies.length - 1; index >= 0; index -= 1) {
    const enemy = mapEditorState.enemies[index];
    if (Math.hypot(point.x - enemy.x, point.z - enemy.z) <= 0.48) {
      return index;
    }
  }

  return -1;
}

function tileKeyFromMapPoint(point) {
  const tile = tileFromMapPoint(point);
  return tileKey(tile.x, tile.z);
}

function cursorForMapTool() {
  if (mapEditorState.pendingDirection) {
    return "alias";
  }

  if (mapEditorState.activeTool === "light") {
    return "copy";
  }

  if (mapEditorState.activeTool === "enemy") {
    return "cell";
  }

  return "crosshair";
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
  markMapDirty();
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

function directionFromMapPoints(origin, target, fallback = defaultMapDirection) {
  const dx = target.x - origin.x;
  const dz = target.z - origin.z;
  const length = Math.hypot(dx, dz);
  if (length < 0.05) {
    return normalizeMapDirection(fallback);
  }

  let bestDirection = mapDirectionOptions[0];
  let bestScore = -Infinity;
  for (const direction of mapDirectionOptions) {
    const directionLength = Math.hypot(direction.x, direction.z) || 1;
    const score = (dx / length) * (direction.x / directionLength) + (dz / length) * (direction.z / directionLength);
    if (score > bestScore) {
      bestDirection = direction;
      bestScore = score;
    }
  }

  return bestDirection.id;
}

function getMapDirectionVector(directionId) {
  return mapDirectionOptions.find((direction) => direction.id === directionId)
    || mapDirectionOptions.find((direction) => direction.id === defaultMapDirection);
}

function directionToYaw(directionId) {
  const direction = getMapDirectionVector(directionId);
  return Math.atan2(direction.x, direction.z);
}

function directionFromYaw(yawRadians) {
  const point = {
    x: Math.sin(yawRadians),
    z: Math.cos(yawRadians),
  };
  return directionFromMapPoints({ x: 0, z: 0 }, point, defaultMapDirection);
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
  drawMapLights(ctx, cellSize);
  drawMapEnemies(ctx, cellSize);
  drawMapHover(ctx, cellSize);
  drawMapPendingDirection(ctx, cellSize);
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

function drawMapLights(ctx, cellSize) {
  for (const key of mapEditorState.lights) {
    const tile = parseTileKey(key);
    const px = (tile.x + 0.5) * cellSize;
    const py = (tile.z + 0.5) * cellSize;
    const radius = THREE.MathUtils.clamp(cellSize * 0.18, 4, 10);

    ctx.save();
    ctx.shadowColor = "rgba(255, 218, 107, 0.72)";
    ctx.shadowBlur = Math.max(8, cellSize * 0.42);
    ctx.fillStyle = "#f2cf62";
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff5bd";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#735d25";
    ctx.fillRect(px - radius * 0.35, py + radius * 0.78, radius * 0.7, radius * 0.42);
    ctx.restore();
  }
}

function drawMapEnemies(ctx, cellSize) {
  for (const enemy of mapEditorState.enemies) {
    drawMapActor(ctx, cellSize, enemy, {
      fill: "#38b66b",
      stroke: "#c8ffd8",
      line: "#153d24",
      radiusScale: 0.24,
    });
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

function drawMapPendingDirection(ctx, cellSize) {
  const pending = mapEditorState.pendingDirection;
  if (!pending) {
    return;
  }

  const originX = pending.position.x * cellSize;
  const originY = pending.position.z * cellSize;
  const targetX = pending.mousePoint.x * cellSize;
  const targetY = pending.mousePoint.z * cellSize;

  ctx.save();
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = pending.kind === "enemy" ? "rgba(128, 255, 170, 0.8)" : "rgba(255, 216, 161, 0.85)";
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();
  ctx.setLineDash([]);
  drawFacingMarker(ctx, cellSize, pending.position, pending.direction, {
    color: pending.kind === "enemy" ? "#c8ffd8" : "#ffd8a1",
    lengthScale: 0.56,
    width: 3,
  });
  ctx.restore();
}

function drawMapPlayer(ctx, cellSize) {
  const valid = isMapPlayerPlacementValid();
  drawMapActor(ctx, cellSize, { ...mapEditorState.playerPosition, direction: mapEditorState.playerDirection }, {
    fill: valid ? "#e31925" : "#6c1f1f",
    stroke: valid ? "#ffd8a1" : "#ffd2c8",
    line: "#1a0b0c",
    radiusScale: 0.28,
    invalid: !valid,
  });
}

function drawMapActor(ctx, cellSize, actor, style) {
  const px = actor.x * cellSize;
  const py = actor.z * cellSize;
  const radius = THREE.MathUtils.clamp(cellSize * style.radiusScale, 5, 14);

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.62)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = style.fill;
  ctx.beginPath();
  ctx.arc(px, py, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = style.invalid ? 3 : 2;
  ctx.strokeStyle = style.stroke;
  ctx.stroke();
  drawFacingMarker(ctx, cellSize, actor, actor.direction, {
    color: style.line,
    lengthScale: 0.42,
    width: Math.max(2, radius * 0.22),
  });
  ctx.restore();
}

function drawFacingMarker(ctx, cellSize, position, directionId, style) {
  const direction = getMapDirectionVector(directionId);
  const length = cellSize * style.lengthScale;
  const directionLength = Math.hypot(direction.x, direction.z) || 1;
  const startX = position.x * cellSize;
  const startY = position.z * cellSize;
  const endX = startX + (direction.x / directionLength) * length;
  const endY = startY + (direction.z / directionLength) * length;

  ctx.lineCap = "round";
  ctx.lineWidth = style.width;
  ctx.strokeStyle = style.color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

async function applyMapEditorState() {
  if (!isMapPlayerPlacementValid()) {
    updateMapEditorControls();
    return;
  }

  mapEditorState.appliedTiles = cloneTileSet(mapEditorState.activeTiles);
  mapEditorState.appliedPlayerPosition = { ...mapEditorState.playerPosition };
  mapEditorState.appliedPlayerDirection = mapEditorState.playerDirection;
  mapEditorState.appliedLights = cloneTileSet(mapEditorState.lights);
  mapEditorState.appliedEnemies = cloneMapEnemies(mapEditorState.enemies);
  mapEditorState.appliedMaterials = { ...mapEditorState.materials };
  mapEditorState.appliedShowTileEdges = mapEditorState.showTileEdges;
  mapEditorState.appliedIsCovered = mapEditorState.isCovered;
  mapEditorState.pendingDirection = null;
  mapCanvas.classList.remove("is-picking-direction");
  mapEditorState.dirty = false;
  mapEditorState.persisting = true;
  mapEditorState.feedbackMessage = "Salvando mapa...";
  mapEditorState.feedbackIsError = false;

  rebuildPlatformFromAppliedMap();
  positionCharacterOnMap(mapEditorState.appliedPlayerPosition, mapEditorState.appliedPlayerDirection);
  renderAppliedEnemies();
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
  if (runtimeIsStaticHosted) {
    return;
  }

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
    playerDirection: mapEditorState.appliedPlayerDirection,
    lights: [...mapEditorState.appliedLights]
      .map((key) => {
        const tile = parseTileKey(key);
        return [tile.x, tile.z];
      })
      .sort((a, b) => a[1] - b[1] || a[0] - b[0]),
    enemies: cloneMapEnemies(mapEditorState.appliedEnemies)
      .sort((a, b) => a.z - b.z || a.x - b.x)
      .map((enemy) => ({
        x: roundMapCoordinate(enemy.x),
        z: roundMapCoordinate(enemy.z),
        direction: normalizeMapDirection(enemy.direction),
      })),
    materials: { ...mapEditorState.appliedMaterials },
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
  applyMapButton.disabled = mapEditorState.persisting || !hasTiles || !validPlacement || Boolean(mapEditorState.pendingDirection);
  mapFeedback.classList.toggle("is-error", !hasTiles || !validPlacement || mapEditorState.feedbackIsError);
  showTileEdgesInput.checked = mapEditorState.showTileEdges;
  showTileEdgesValue.textContent = mapEditorState.showTileEdges ? "Sim" : "Nao";
  mapCoveredInput.checked = mapEditorState.isCovered;
  mapCoveredValue.textContent = mapEditorState.isCovered ? "Sim" : "Nao";
  syncMapToolControls();
  syncMapMaterialControls();

  if (!hasTiles) {
    mapFeedback.textContent = "Sem tiles";
  } else if (!validPlacement) {
    mapFeedback.textContent = "Posicao fora dos tiles";
  } else if (mapEditorState.pendingDirection) {
    mapFeedback.textContent = "Clique a direcao";
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

function positionCharacterOnMap(position, direction = mapEditorState.appliedPlayerDirection) {
  if (!characterModel) {
    return;
  }

  const worldPosition = mapPointToWorld(position);
  characterModel.position.x = worldPosition.x;
  characterModel.position.z = worldPosition.z;
  playerControlState.yawRadians = directionToYaw(direction);
  characterModel.rotation.y = playerControlState.yawRadians;
}

function renderAppliedEnemies() {
  clearAppliedEnemies();
  clearImpactEffects();

  if (!enemySourceModel || mapEditorState.appliedEnemies.length === 0) {
    return;
  }

  enemyGroup = new THREE.Group();
  enemyGroup.name = "MapEnemies";

  for (const [index, enemy] of mapEditorState.appliedEnemies.entries()) {
    const enemyModel = cloneSkeleton(enemySourceModel);
    const worldPosition = mapPointToWorld(enemy);
    enemyModel.position.x += worldPosition.x;
    enemyModel.position.z += worldPosition.z;
    enemyModel.rotation.y = directionToYaw(enemy.direction);
    enemyModel.name = "Skeleton";
    prepareStaticModel(enemyModel);
    const enemyRuntime = createEnemyRuntime(enemyModel, enemy, index);
    enemyModel.traverse((node) => {
      node.userData.enemyRuntime = enemyRuntime;
    });
    activeEnemies.push(enemyRuntime);
    enemyGroup.add(enemyModel);
  }

  scene.add(enemyGroup);
}

function clearAppliedEnemies() {
  for (const enemy of activeEnemies) {
    enemy.mixer?.stopAllAction();
  }

  activeEnemies = [];

  if (enemyGroup) {
    scene.remove(enemyGroup);
    enemyGroup = null;
  }
}

function createEnemyRuntime(model, mapEnemy, index) {
  const spawnKind = pickEnemySpawnKind();
  const enemy = {
    id: index,
    model,
    mapEnemy,
    mixer: new THREE.AnimationMixer(model),
    actions: new Map(),
    activeAction: null,
    activeClipName: null,
    state: "idle",
    stateTimer: 0,
    stateElapsed: 0,
    health: enemyMaxHealth,
    maxHealth: enemyMaxHealth,
    halfHealthHandled: false,
    canHalfHealthFall: Math.random() < enemyHalfHealthFallChance,
    spawnKind,
    specialSpawnGround: spawnKind === "spawn-ground",
    transformed: false,
    attackDamage: enemyAttackDamage,
    attackCooldown: Math.random() * 0.65,
    attackHitApplied: false,
    hitReactTimer: 0,
    hitReactPhase: Math.random() * Math.PI * 2,
    active: true,
  };

  setupEnemyAnimationActions(enemy);
  startEnemySpawnAnimation(enemy);
  enemy.mixer.update(0.001);
  return enemy;
}

function pickEnemySpawnKind() {
  const roll = Math.random();
  if (roll < enemySpawnGroundChance) {
    return "spawn-ground";
  }

  if (roll < enemySpawnGroundChance + enemyAwakenFloorLongChance) {
    return "awaken-floor-long";
  }

  if (roll < enemySpawnGroundChance + enemyAwakenFloorLongChance + enemyAwakenFloorChance) {
    return "awaken-floor";
  }

  return "idle";
}

function setupEnemyAnimationActions(enemy) {
  for (const clipName of enemyAnimationIds) {
    const sourceClip = sourceAnimationClips.get(clipName);
    if (!sourceClip) {
      continue;
    }

    const action = enemy.mixer.clipAction(sourceClip);
    configureEnemyAction(action, clipName);
    enemy.actions.set(clipName, action);
  }
}

function configureEnemyAction(action, clipName) {
  action.enabled = true;
  action.timeScale = 1;

  if (enemyLoopingAnimations.has(clipName)) {
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  } else {
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }
}

function startEnemySpawnAnimation(enemy) {
  if (enemy.spawnKind === "spawn-ground") {
    startEnemyTimedState(enemy, "awakening", "Skeletons_Spawn_Ground", 1.6);
    return;
  }

  if (enemy.spawnKind === "awaken-floor-long") {
    startEnemyTimedState(enemy, "awakening", "Skeletons_Awaken_Floor_Long", 2.2);
    return;
  }

  if (enemy.spawnKind === "awaken-floor") {
    startEnemyTimedState(enemy, "awakening", "Skeletons_Awaken_Floor", 1.5);
    return;
  }

  setEnemyLoopState(enemy, "idle", "Skeletons_Idle");
}

function updateEnemies(delta) {
  if (!activeEnemies.length) {
    return;
  }

  for (const enemy of activeEnemies) {
    enemy.mixer?.update(delta);

    if (enemy.state === "dead") {
      updateEnemyHitFeedback(enemy, delta);
      continue;
    }

    updateEnemyState(enemy, delta);
    updateEnemyHitFeedback(enemy, delta);
  }
}

function updateEnemyState(enemy, delta) {
  if (isEnemyTimedState(enemy.state)) {
    updateEnemyTimedState(enemy, delta);
    return;
  }

  if (!characterModel || playerControlState.dead) {
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle");
    return;
  }

  enemy.attackCooldown = Math.max(0, enemy.attackCooldown - delta);

  if (enemy.state === "attacking") {
    updateEnemyAttack(enemy, delta);
    return;
  }

  const canSeePlayer = canEnemySeePlayer(enemy);
  if (!canSeePlayer) {
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle");
    return;
  }

  const distanceToPlayer = getEnemyDistanceToPlayer(enemy);
  faceEnemyTowardPlayer(enemy);

  if (distanceToPlayer <= enemyAttackRange && enemy.attackCooldown <= 0) {
    startEnemyAttack(enemy);
    return;
  }

  if (distanceToPlayer > enemyAttackRange * 0.82) {
    setEnemyLoopState(enemy, "chasing", "Skeletons_Walking");
    moveEnemyTowardPlayer(enemy, delta, distanceToPlayer);
  } else {
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle");
  }
}

function updateEnemyHitFeedback(enemy, delta) {
  if (enemy.hitReactTimer <= 0) {
    enemy.model.rotation.z = 0;
    return;
  }

  enemy.hitReactTimer = Math.max(0, enemy.hitReactTimer - delta);
  const progress = enemy.hitReactTimer / enemyHitReactDuration;
  enemy.model.rotation.z = Math.sin((1 - progress) * Math.PI * 8 + enemy.hitReactPhase) * 0.055 * progress;
}

function isEnemyTimedState(state) {
  return state === "awakening"
    || state === "falling"
    || state === "downed"
    || state === "resurrecting"
    || state === "transforming"
    || state === "dying";
}

function updateEnemyTimedState(enemy, delta) {
  enemy.stateElapsed += delta;
  enemy.stateTimer -= delta;

  if (enemy.state === "falling" && enemy.stateTimer <= 0) {
    startEnemyDownedState(enemy);
    return;
  }

  if (enemy.state === "downed" && enemy.stateTimer <= 0) {
    startEnemyTimedState(enemy, "resurrecting", "Skeletons_Death_Resurrect", 1.35);
    return;
  }

  if (enemy.state === "dying" && enemy.stateTimer <= 0) {
    enemy.state = "dead";
    playEnemyAnimation(enemy, "Skeletons_Death_Pose", { loop: true });
    return;
  }

  if (
    (enemy.state === "awakening" || enemy.state === "resurrecting" || enemy.state === "transforming") &&
    enemy.stateTimer <= 0
  ) {
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle", { restart: true });
  }
}

function startEnemyDownedState(enemy) {
  enemy.state = "downed";
  enemy.stateElapsed = 0;
  enemy.stateTimer = THREE.MathUtils.lerp(enemyDownedSecondsMin, enemyDownedSecondsMax, Math.random());
  playEnemyAnimation(enemy, "Skeletons_Death_Pose", { loop: true, restart: true });
}

function setEnemyLoopState(enemy, state, clipName, options = {}) {
  if (enemy.state === state && !options.restart) {
    return;
  }

  enemy.state = state;
  enemy.stateTimer = 0;
  enemy.stateElapsed = 0;
  enemy.attackHitApplied = false;
  playEnemyAnimation(enemy, clipName, { loop: true, restart: options.restart });
}

function startEnemyTimedState(enemy, state, clipName, fallbackDuration) {
  enemy.state = state;
  enemy.stateTimer = getEnemyAnimationDuration(enemy, clipName, fallbackDuration);
  enemy.stateElapsed = 0;
  enemy.attackHitApplied = false;
  playEnemyAnimation(enemy, clipName, { loop: false, restart: true });
}

function playEnemyAnimation(enemy, clipName, { loop = false, restart = false } = {}) {
  const action = enemy.actions.get(clipName);
  if (!action) {
    return false;
  }

  if (!restart && enemy.activeClipName === clipName) {
    return true;
  }

  if (loop) {
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
  } else {
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
  }

  action.enabled = true;
  action.paused = false;
  action.reset().setEffectiveWeight(1).fadeIn(0.12).play();

  if (enemy.activeAction && enemy.activeAction !== action) {
    enemy.activeAction.fadeOut(0.12);
  }

  enemy.activeAction = action;
  enemy.activeClipName = clipName;
  return true;
}

function getEnemyAnimationDuration(enemy, clipName, fallbackDuration = 1) {
  const action = enemy.actions.get(clipName);
  const duration = action?.getClip?.().duration;
  return Number.isFinite(duration) && duration > 0 ? duration / Math.max(action.timeScale || 1, 0.001) : fallbackDuration;
}

function startEnemyAttack(enemy) {
  const clipName = enemy.actions.has(enemyPrimaryAttackAnimation)
    ? enemyPrimaryAttackAnimation
    : enemyFallbackAttackAnimation;
  const duration = getEnemyAnimationDuration(enemy, clipName, 0.85);

  enemy.state = "attacking";
  enemy.stateTimer = Math.max(duration, enemyAttackHitTime + 0.12);
  enemy.stateElapsed = 0;
  enemy.attackHitApplied = false;
  faceEnemyTowardPlayer(enemy);
  playEnemyAnimation(enemy, clipName, { loop: false, restart: true });
}

function updateEnemyAttack(enemy, delta) {
  enemy.stateElapsed += delta;
  enemy.stateTimer -= delta;
  faceEnemyTowardPlayer(enemy);

  if (!enemy.attackHitApplied && enemy.stateElapsed >= enemyAttackHitTime) {
    enemy.attackHitApplied = true;
    if (isPlayerInEnemyAttackReach(enemy)) {
      damagePlayer(enemy.attackDamage);
    }
  }

  if (enemy.stateTimer <= 0) {
    enemy.attackCooldown = enemyAttackCooldown + Math.random() * 0.35;
    setEnemyLoopState(enemy, "idle", "Skeletons_Idle", { restart: true });
  }
}

function damagePlayer(amount) {
  if (playerControlState.dead) {
    return;
  }

  playerControlState.health = Math.max(0, playerControlState.health - amount);
  syncPlayerHealthHud();
  triggerPlayerDamageFeedback();

  if (playerControlState.health > 0) {
    playerControlState.hitReactTimer = 0.42;
    playMovement(Math.random() < 0.5 ? "Hit_A" : "Hit_B", { restart: true });
    return;
  }

  playerControlState.dead = true;
  clearPlayerMouseButtons();
  playMovement("Death_A", { restart: true });
  setStatus("Voce morreu", "error");
}

function damageEnemy(enemy, amount, { source = "generic" } = {}) {
  if (!isEnemyTargetable(enemy)) {
    return false;
  }

  const previousHealth = enemy.health;
  enemy.health = Math.max(0, enemy.health - amount);
  enemy.hitReactTimer = enemyHitReactDuration;
  enemy.hitReactPhase = Math.random() * Math.PI * 2;

  if (enemy.health <= 0) {
    killEnemy(enemy);
    return true;
  }

  if (source === "shot") {
    handleEnemyShotDamageThreshold(enemy, previousHealth);
  }

  return true;
}

function handleEnemyShotDamageThreshold(enemy, previousHealth) {
  const halfHealth = enemy.maxHealth * 0.5;
  if (enemy.halfHealthHandled || previousHealth <= halfHealth || enemy.health > halfHealth) {
    return;
  }

  enemy.halfHealthHandled = true;

  if (enemy.specialSpawnGround && !enemy.transformed) {
    transformEnemy(enemy);
    return;
  }

  if (enemy.canHalfHealthFall) {
    knockDownEnemy(enemy);
  }
}

function transformEnemy(enemy) {
  enemy.transformed = true;
  enemy.health = enemy.maxHealth;
  enemy.attackDamage = enemyAttackDamage * 2;
  startEnemyTimedState(enemy, "transforming", "EXPERIMENTAL_Medium_Transform", 1.4);
}

function knockDownEnemy(enemy) {
  startEnemyTimedState(enemy, "falling", "Skeletons_Death", 1.1);
}

function killEnemy(enemy) {
  enemy.health = 0;
  enemy.active = false;
  startEnemyTimedState(enemy, "dying", "Skeletons_Death", 1.1);
}

function isEnemyTargetable(enemy) {
  return Boolean(enemy?.active && enemy.state !== "dead" && enemy.state !== "dying");
}

function canEnemySeePlayer(enemy) {
  const distanceToPlayer = getEnemyDistanceToPlayer(enemy);
  if (distanceToPlayer > enemyVisionDistance) {
    return false;
  }

  getEnemyEyePosition(enemy, enemyEyePosition);
  getPlayerTargetPosition(enemyPlayerTarget);
  const direction = enemyMoveDirection.copy(enemyPlayerTarget).sub(enemyEyePosition);
  const distance = direction.length();
  if (distance <= 0.001) {
    return true;
  }

  direction.normalize();
  enemyLineOfSightRaycaster.set(enemyEyePosition, direction);
  enemyLineOfSightRaycaster.near = 0.05;
  enemyLineOfSightRaycaster.far = Math.max(0, distance - 0.25);

  const hits = wallOccluders.size
    ? enemyLineOfSightRaycaster.intersectObjects([...wallOccluders], false)
    : [];
  return hits.length === 0;
}

function getEnemyEyePosition(enemy, target) {
  enemyBoundsBox.setFromObject(enemy.model);
  if (enemyBoundsBox.isEmpty()) {
    target.copy(enemy.model.position);
    target.y += 1.6;
    return target;
  }

  enemyBoundsBox.getSize(enemyBoundsSize);
  enemyBoundsBox.getCenter(target);
  target.y = enemyBoundsBox.min.y + enemyBoundsSize.y * 0.68;
  return target;
}

function getPlayerTargetPosition(target) {
  if (!characterModel) {
    target.set(0, 0, 0);
    return target;
  }

  playerAnchorBox.setFromObject(characterModel);
  if (playerAnchorBox.isEmpty()) {
    target.copy(characterModel.position);
    target.y += 2.2;
    return target;
  }

  playerAnchorBox.getSize(playerAnchorSize);
  playerAnchorBox.getCenter(target);
  target.y = playerAnchorBox.min.y + playerAnchorSize.y * 0.55;
  return target;
}

function getEnemyDistanceToPlayer(enemy) {
  if (!characterModel) {
    return Infinity;
  }

  return Math.hypot(
    characterModel.position.x - enemy.model.position.x,
    characterModel.position.z - enemy.model.position.z,
  );
}

function faceEnemyTowardPlayer(enemy) {
  if (!characterModel) {
    return;
  }

  enemyMoveDirection.set(
    characterModel.position.x - enemy.model.position.x,
    0,
    characterModel.position.z - enemy.model.position.z,
  );

  if (enemyMoveDirection.lengthSq() > 0.0001) {
    enemy.model.rotation.y = yawFromDirection(enemyMoveDirection.normalize());
  }
}

function moveEnemyTowardPlayer(enemy, delta, distanceToPlayer) {
  enemyMoveDirection.set(
    characterModel.position.x - enemy.model.position.x,
    0,
    characterModel.position.z - enemy.model.position.z,
  );

  if (enemyMoveDirection.lengthSq() <= 0.0001) {
    return;
  }

  enemyMoveDirection.normalize();
  const step = Math.min(enemyWalkSpeed * delta, Math.max(0, distanceToPlayer - enemyAttackRange * 0.78));
  enemyNextPosition.copy(enemy.model.position).addScaledVector(enemyMoveDirection, step);
  moveEnemyWithCollision(enemy, enemyNextPosition.x, enemyNextPosition.z);
}

function moveEnemyWithCollision(enemy, nextX, nextZ) {
  if (canEnemyOccupyWorldPosition(nextX, nextZ)) {
    enemy.model.position.x = nextX;
    enemy.model.position.z = nextZ;
    return;
  }

  if (canEnemyOccupyWorldPosition(nextX, enemy.model.position.z)) {
    enemy.model.position.x = nextX;
  }

  if (canEnemyOccupyWorldPosition(enemy.model.position.x, nextZ)) {
    enemy.model.position.z = nextZ;
  }
}

function canEnemyOccupyWorldPosition(x, z) {
  const radius = enemyCollisionRadius + playerWallCollisionPadding;
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

function isPlayerInEnemyAttackReach(enemy) {
  return getEnemyDistanceToPlayer(enemy) <= enemyAttackRange && canEnemySeePlayer(enemy);
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
    configureAction(lowerAction, { ...option, loop: option.combo.lowerLoop ?? option.loop });
    configureAction(upperAction, { ...option, loop: option.combo.upperLoop ?? option.loop });
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
  const materialSelection = {
    floor: normalizeMapMaterialId("floor", mapSnapshot.materials?.floor),
    wall: normalizeMapMaterialId("wall", mapSnapshot.materials?.wall),
    ceiling: normalizeMapMaterialId("ceiling", mapSnapshot.materials?.ceiling),
  };
  const tileSize = mapSnapshot.showTileEdges ? platformTileSize - platformTileGap : platformTileSize;
  const tileGeometry = new THREE.BoxGeometry(
    tileSize,
    platformThickness,
    tileSize,
  );

  for (const key of mapSnapshot.activeTiles) {
    const tile = parseTileKey(key);
    const worldCenter = mapTileCenterToWorld(tile);
    const tileMaterial = createSewerSurfaceMaterial("floor", materialSelection.floor);
    const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
    tileMesh.position.set(worldCenter.x, -platformThickness / 2, worldCenter.z);
    configureShadowMesh(tileMesh, { cast: false, receive: true });
    platform.add(tileMesh);
  }

  const seams = mapSnapshot.showTileEdges ? createPlatformSeamLines(mapSnapshot.activeTiles) : null;
  const walls = mapSnapshot.isCovered ? createPlatformWalls(mapSnapshot.activeTiles, materialSelection.wall) : null;
  const ceiling = mapSnapshot.isCovered ? createPlatformCeiling(mapSnapshot.activeTiles, materialSelection.ceiling) : null;
  const lights = mapSnapshot.isCovered ? createSewerStageLights(mapSnapshot) : null;

  if (seams) {
    platform.add(seams);
  }

  if (walls) {
    platform.add(walls);
  }

  if (ceiling) {
    platform.add(ceiling);
  }

  if (lights) {
    platform.add(lights);
  }

  return platform;
}

function createSewerSurfacePlan(activeTiles) {
  return {
    floorAreaSeeds: createFloorAreaSeeds(activeTiles),
  };
}

function createFloorAreaSeeds(activeTiles) {
  const areaSeeds = new Map();
  const visited = new Set();
  const sortedKeys = [...activeTiles].sort((a, b) => {
    const tileA = parseTileKey(a);
    const tileB = parseTileKey(b);
    return tileA.z - tileB.z || tileA.x - tileB.x;
  });

  for (const key of sortedKeys) {
    if (visited.has(key)) {
      continue;
    }

    const startTile = parseTileKey(key);
    const zoneKind = getFloorZoneKind(activeTiles, startTile);
    const queue = [startTile];
    const areaKeys = [];
    const bounds = {
      minX: startTile.x,
      maxX: startTile.x,
      minZ: startTile.z,
      maxZ: startTile.z,
    };
    visited.add(key);

    while (queue.length > 0) {
      const tile = queue.shift();
      const currentKey = tileKey(tile.x, tile.z);
      areaKeys.push(currentKey);
      bounds.minX = Math.min(bounds.minX, tile.x);
      bounds.maxX = Math.max(bounds.maxX, tile.x);
      bounds.minZ = Math.min(bounds.minZ, tile.z);
      bounds.maxZ = Math.max(bounds.maxZ, tile.z);

      for (const neighbor of getCardinalNeighborTiles(tile)) {
        const neighborKey = tileKey(neighbor.x, neighbor.z);
        if (
          visited.has(neighborKey) ||
          !activeTiles.has(neighborKey) ||
          getFloorZoneKind(activeTiles, neighbor) !== zoneKind
        ) {
          continue;
        }

        visited.add(neighborKey);
        queue.push(neighbor);
      }
    }

    const seed = [
      "floor-area",
      zoneKind,
      bounds.minX,
      bounds.maxX,
      bounds.minZ,
      bounds.maxZ,
      areaKeys.length,
    ].join(":");

    for (const areaKey of areaKeys) {
      areaSeeds.set(areaKey, seed);
    }
  }

  return areaSeeds;
}

function getFloorZoneKind(activeTiles, tile) {
  const north = activeTiles.has(tileKey(tile.x, tile.z - 1));
  const east = activeTiles.has(tileKey(tile.x + 1, tile.z));
  const south = activeTiles.has(tileKey(tile.x, tile.z + 1));
  const west = activeTiles.has(tileKey(tile.x - 1, tile.z));
  const neighborCount = Number(north) + Number(east) + Number(south) + Number(west);
  const horizontalRun = countTileRun(activeTiles, tile, "x");
  const verticalRun = countTileRun(activeTiles, tile, "z");

  if (neighborCount <= 2) {
    return horizontalRun >= verticalRun ? "corridor-x" : "corridor-z";
  }

  if (
    neighborCount === 3 &&
    Math.max(horizontalRun, verticalRun) >= 4 &&
    Math.abs(horizontalRun - verticalRun) >= 2
  ) {
    return horizontalRun > verticalRun ? "corridor-x" : "corridor-z";
  }

  return "room";
}

function countTileRun(activeTiles, tile, axis) {
  const step = axis === "x" ? { x: 1, z: 0 } : { x: 0, z: 1 };
  let count = 1;

  for (const direction of [-1, 1]) {
    let x = tile.x + step.x * direction;
    let z = tile.z + step.z * direction;
    while (activeTiles.has(tileKey(x, z))) {
      count += 1;
      x += step.x * direction;
      z += step.z * direction;
    }
  }

  return count;
}

function getCardinalNeighborTiles(tile) {
  return [
    { x: tile.x, z: tile.z - 1 },
    { x: tile.x + 1, z: tile.z },
    { x: tile.x, z: tile.z + 1 },
    { x: tile.x - 1, z: tile.z },
  ];
}

function createSewerSurfaceMaterial(surface, materialId) {
  const variant = getSewerSurfaceVariant(surface, materialId);
  return new THREE.MeshStandardMaterial({
    color: variant.color ?? 0xffffff,
    map: variant.texture,
    roughness: variant.roughness ?? 0.94,
    metalness: variant.metalness ?? 0.02,
  });
}

function configureShadowMesh(mesh, { cast = true, receive = true } = {}) {
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

function configureSewerLightShadow(light, {
  mapSize = 1024,
  near = 0.2,
  far = sewerDownLightDistance,
  bias = -0.0002,
  normalBias = 0.035,
} = {}) {
  light.castShadow = true;
  light.shadow.mapSize.set(mapSize, mapSize);
  light.shadow.camera.near = near;
  light.shadow.camera.far = far;
  light.shadow.bias = bias;
  light.shadow.normalBias = normalBias;
  light.shadow.camera.updateProjectionMatrix?.();
  return light;
}

function getSewerShadowLightLimit() {
  const maxTextureUnits = renderer.capabilities?.maxTextures ?? 16;
  const availableShadowUnits = maxTextureUnits - sewerReservedFragmentTextureUnits;
  return Math.max(0, Math.min(sewerMaxShadowCastingSpotLights, availableShadowUnits));
}

function createSewerShadowLightIndexSet(lightTiles, focalPoint = null) {
  const shadowLightLimit = getSewerShadowLightLimit();
  if (shadowLightLimit <= 0 || lightTiles.length === 0) {
    return new Set();
  }

  const focalX = Number.isFinite(focalPoint?.x) ? focalPoint.x : mapCenter;
  const focalZ = Number.isFinite(focalPoint?.z) ? focalPoint.z : mapCenter;
  return new Set(
    lightTiles
      .map((tile, index) => ({
        index,
        distance: (tile.x + 0.5 - focalX) ** 2 + (tile.z + 0.5 - focalZ) ** 2,
      }))
      .sort((a, b) => a.distance - b.distance || a.index - b.index)
      .slice(0, shadowLightLimit)
      .map(({ index }) => index),
  );
}

function getSewerSurfaceVariant(surface, materialId) {
  const variants = sewerSurfaceVariants[surface] || sewerSurfaceVariants.floor;
  return variants.find((variant) => variant.id === materialId) || variants[0];
}

function pickSewerSurfaceVariant(surface, seed) {
  const variants = sewerSurfaceVariants[surface] || sewerSurfaceVariants.floor;
  const hash = hashSurfaceSeed(seed);
  return variants[hash % variants.length];
}

function hashSurfaceSeed(seed) {
  const text = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
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

function createPlatformCeiling(activeTiles, materialId) {
  const ceiling = new THREE.Group();
  ceiling.name = "SewerCeiling";
  const ceilingGeometry = new THREE.BoxGeometry(
    platformTileSize,
    platformCeilingThickness,
    platformTileSize,
  );

  for (const key of activeTiles) {
    const tile = parseTileKey(key);
    const center = mapTileCenterToWorld(tile);
    const ceilingMaterial = createSewerSurfaceMaterial("ceiling", materialId);
    const ceilingTile = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceilingTile.position.set(center.x, platformWallHeight + platformCeilingThickness / 2, center.z);
    configureShadowMesh(ceilingTile);
    ceiling.add(ceilingTile);
  }

  return ceiling;
}

function createPlatformWalls(activeTiles, materialId) {
  const walls = new THREE.Group();
  walls.name = "PerimeterWalls";
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
      const wall = createPlatformWallMesh(horizontalWallGeometry, materialId);
      wall.userData.occludesCharacter = true;
      wall.position.set(center.x, y, minZ);
      walls.add(wall);
    }

    if (!activeTiles.has(tileKey(tile.x + 1, tile.z))) {
      const wall = createPlatformWallMesh(verticalWallGeometry, materialId);
      wall.userData.occludesCharacter = true;
      wall.position.set(maxX, y, center.z);
      walls.add(wall);
    }

    if (!activeTiles.has(tileKey(tile.x, tile.z + 1))) {
      const wall = createPlatformWallMesh(horizontalWallGeometry, materialId);
      wall.userData.occludesCharacter = true;
      wall.position.set(center.x, y, maxZ);
      walls.add(wall);
    }

    if (!activeTiles.has(tileKey(tile.x - 1, tile.z))) {
      const wall = createPlatformWallMesh(verticalWallGeometry, materialId);
      wall.userData.occludesCharacter = true;
      wall.position.set(minX, y, center.z);
      walls.add(wall);
    }
  }

  if (walls.children.length === 0) {
    horizontalWallGeometry.dispose();
    verticalWallGeometry.dispose();
    return null;
  }

  return walls;
}

function createPlatformWallMesh(geometry, materialId) {
  return configureShadowMesh(
    new THREE.Mesh(geometry, createSewerSurfaceMaterial("wall", materialId)),
  );
}

function getWallRunSeed(activeTiles, tile, side) {
  if (side === "north" || side === "south") {
    let startX = tile.x;
    let endX = tile.x;

    while (hasBoundaryWall(activeTiles, { x: startX - 1, z: tile.z }, side)) {
      startX -= 1;
    }

    while (hasBoundaryWall(activeTiles, { x: endX + 1, z: tile.z }, side)) {
      endX += 1;
    }

    const boundaryZ = side === "north" ? tile.z : tile.z + 1;
    return ["wall-run-x", side, boundaryZ, startX, endX].join(":");
  }

  let startZ = tile.z;
  let endZ = tile.z;

  while (hasBoundaryWall(activeTiles, { x: tile.x, z: startZ - 1 }, side)) {
    startZ -= 1;
  }

  while (hasBoundaryWall(activeTiles, { x: tile.x, z: endZ + 1 }, side)) {
    endZ += 1;
  }

  const boundaryX = side === "west" ? tile.x : tile.x + 1;
  return ["wall-run-z", side, boundaryX, startZ, endZ].join(":");
}

function hasBoundaryWall(activeTiles, tile, side) {
  if (!activeTiles.has(tileKey(tile.x, tile.z))) {
    return false;
  }

  const neighbor = {
    north: { x: tile.x, z: tile.z - 1 },
    east: { x: tile.x + 1, z: tile.z },
    south: { x: tile.x, z: tile.z + 1 },
    west: { x: tile.x - 1, z: tile.z },
  }[side];

  return !activeTiles.has(tileKey(neighbor.x, neighbor.z));
}

function createSewerStageLights(mapSnapshot) {
  const lightTiles = resolveSewerLightTiles(mapSnapshot);
  if (!lightTiles.length) {
    return null;
  }

  const group = new THREE.Group();
  group.name = "SewerStageLights";
  const shadowLightIndexes = createSewerShadowLightIndexSet(lightTiles, mapSnapshot.playerPosition);
  const fixtureGeometry = new THREE.CylinderGeometry(0.2, 0.26, 0.14, 14);
  const bulbGeometry = new THREE.SphereGeometry(0.16, 14, 10);
  const cableGeometry = new THREE.CylinderGeometry(0.025, 0.025, sewerLightCableLength, 8);
  const cableMaterial = new THREE.MeshStandardMaterial({
    color: 0x11100e,
    roughness: 0.72,
    metalness: 0.28,
  });

  lightTiles.forEach((tile, index) => {
    const center = mapTileCenterToWorld(tile);
    const color = sewerStageLightColors[index % sewerStageLightColors.length];
    const fixtureHeight = platformWallHeight - sewerLightCableLength - 0.14;
    const lightHeight = fixtureHeight - 0.22;
    const fixtureMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b2922,
      roughness: 0.62,
      metalness: 0.34,
      emissive: color,
      emissiveIntensity: 0.2,
    });
    const bulbMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.92,
    });
    const light = new THREE.PointLight(color, sewerFillLightIntensity, sewerFillLightDistance, 1.7);
    const downLight = new THREE.SpotLight(
      color,
      sewerDownLightIntensity,
      sewerDownLightDistance,
      Math.PI / 4.05,
      0.68,
      1.35,
    );
    const downLightTarget = new THREE.Object3D();
    const cable = new THREE.Mesh(cableGeometry, cableMaterial);
    const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);

    light.position.set(center.x, lightHeight, center.z);
    downLight.position.copy(light.position);
    downLightTarget.position.set(center.x, 0.2, center.z);
    downLight.target = downLightTarget;
    cable.position.set(center.x, platformWallHeight - sewerLightCableLength / 2, center.z);
    fixture.position.set(center.x, fixtureHeight, center.z);
    bulb.position.copy(light.position);
    if (shadowLightIndexes.has(index)) {
      configureSewerLightShadow(downLight, {
        mapSize: 1024,
        far: sewerDownLightDistance,
        bias: -0.00018,
        normalBias: 0.035,
      });
    }
    configureShadowMesh(cable);
    configureShadowMesh(fixture);
    configureShadowMesh(bulb, { cast: false, receive: false });
    group.add(light, downLight, downLightTarget, cable, fixture, bulb);
  });

  return group;
}

function resolveSewerLightTiles(mapSnapshot) {
  const placedLightTiles = [...(mapSnapshot.lights || [])]
    .map(parseTileKey)
    .filter((tile) => mapSnapshot.activeTiles.has(tileKey(tile.x, tile.z)))
    .sort((a, b) => a.z - b.z || a.x - b.x);

  if (placedLightTiles.length) {
    return placedLightTiles;
  }

  return selectSewerLightTiles(mapSnapshot.activeTiles, mapSnapshot.playerPosition);
}

function selectSewerLightTiles(activeTiles, focalPoint = null) {
  const tiles = [...activeTiles].map(parseTileKey);
  if (!tiles.length) {
    return [];
  }

  const bounds = tiles.reduce(
    (current, tile) => ({
      minX: Math.min(current.minX, tile.x),
      maxX: Math.max(current.maxX, tile.x),
      minZ: Math.min(current.minZ, tile.z),
      maxZ: Math.max(current.maxZ, tile.z),
    }),
    { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity },
  );
  const center = {
    x: (bounds.minX + bounds.maxX) / 2,
    z: (bounds.minZ + bounds.maxZ) / 2,
  };
  const focalTile = focalPoint ? tileFromMapPoint(focalPoint) : null;
  const desiredCount = Math.min(7, Math.max(3, Math.ceil(tiles.length / 28)));
  const candidatePoints = [
    focalTile,
    { x: bounds.minX + 1, z: bounds.minZ + 1 },
    { x: bounds.maxX - 1, z: bounds.minZ + 1 },
    { x: bounds.maxX - 1, z: bounds.maxZ - 1 },
    { x: bounds.minX + 1, z: bounds.maxZ - 1 },
    center,
    { x: center.x, z: bounds.minZ + 2 },
  ].filter(Boolean);
  const selected = [];
  const selectedKeys = new Set();

  for (const point of candidatePoints) {
    const tile = findNearestUnselectedTile(tiles, point, selectedKeys);
    if (!tile) {
      continue;
    }

    selected.push(tile);
    selectedKeys.add(tileKey(tile.x, tile.z));
    if (selected.length >= desiredCount) {
      return selected;
    }
  }

  const sortedTiles = [...tiles].sort((a, b) => a.z - b.z || a.x - b.x);
  const step = Math.max(1, Math.floor(sortedTiles.length / desiredCount));
  for (let index = 0; index < sortedTiles.length && selected.length < desiredCount; index += step) {
    const tile = sortedTiles[index];
    const key = tileKey(tile.x, tile.z);
    if (selectedKeys.has(key)) {
      continue;
    }

    selected.push(tile);
    selectedKeys.add(key);
  }

  return selected;
}

function findNearestUnselectedTile(tiles, point, selectedKeys) {
  let nearestTile = null;
  let nearestDistance = Infinity;

  for (const tile of tiles) {
    const key = tileKey(tile.x, tile.z);
    if (selectedKeys.has(key)) {
      continue;
    }

    const distance = (tile.x - point.x) ** 2 + (tile.z - point.z) ** 2;
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestTile = tile;
    }
  }

  return nearestTile;
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

function prepareStaticModel(model) {
  model.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    node.castShadow = false;
    node.receiveShadow = false;
    node.frustumCulled = true;

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (material) {
        material.needsUpdate = true;
      }
    }
  });
}

function fitEnemyModelToTile(model) {
  const sourceBox = new THREE.Box3().setFromObject(model);
  const sourceSize = sourceBox.getSize(new THREE.Vector3());

  if (!Number.isFinite(sourceSize.y) || sourceSize.y <= 0) {
    return;
  }

  const targetHeight = 4.68;
  const maxFootprint = Math.max(sourceSize.x, sourceSize.z);
  let scale = targetHeight / Math.max(sourceSize.y, 0.001);
  if (maxFootprint * scale > platformTileSize * 0.9) {
    scale = (platformTileSize * 0.9) / maxFootprint;
  }

  model.scale.setScalar(THREE.MathUtils.clamp(scale, 0.001, 1000));

  const fittedBox = new THREE.Box3().setFromObject(model);
  const fittedCenter = fittedBox.getCenter(new THREE.Vector3());
  model.position.x -= fittedCenter.x;
  model.position.z -= fittedCenter.z;
  model.position.y -= fittedBox.min.y;
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

function syncPlayerHealthHud() {
  if (!healthHudElement) {
    return;
  }

  healthHudElement.textContent = `Vida ${Math.ceil(playerControlState.health)}`;
}

function triggerPlayerDamageFeedback() {
  if (!phoneShellElement || !damageFlashElement) {
    return;
  }

  phoneShellElement.classList.remove("is-player-hit");
  window.requestAnimationFrame(() => {
    phoneShellElement.classList.add("is-player-hit");
    window.setTimeout(() => {
      phoneShellElement.classList.remove("is-player-hit");
    }, 120);
  });
}

function hideStatus() {
  statusElement.classList.add("is-hidden");
}

function syncCrosshair() {
  if (!crosshairElement) {
    return;
  }

  const isVisible = Boolean(
    characterModel && !cameraControlState.freeCamera && playerControlState.aiming && !playerControlState.dead,
  );
  crosshairElement.classList.toggle("is-visible", isVisible);
  crosshairElement.classList.toggle("is-firing", isVisible && playerControlState.shooting);
}
