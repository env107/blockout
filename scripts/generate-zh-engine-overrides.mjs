#!/usr/bin/env node
/**
 * Generates src/shared/i18n/locales/zh-engine-overrides.ts from engine catalogs.
 * Run: node scripts/generate-zh-engine-overrides.mjs
 * Uses vitest's vite resolver to import TypeScript engine modules.
 */
import { createServer } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { writeFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const ZH_ASSET_NAMES = {
  'person.man': '男人',
  'person.woman': '女人',
  'person.child': '儿童',
  'person.elderly': '老人',
  'animal.dog': '狗',
  'animal.cat': '猫',
  'animal.horse': '马',
  'animal.bird': '鸟',
  'vehicle.sedan': '轿车',
  'vehicle.suv': 'SUV',
  'vehicle.pickup': '皮卡',
  'vehicle.van': '面包车',
  'vehicle.bus': '公交车',
  'vehicle.truck': '半挂卡车',
  'vehicle.tank': '坦克',
  'vehicle.train': '火车车厢',
  'vehicle.motorcycle': '摩托车',
  'vehicle.bicycle': '自行车',
  'vehicle.plane': '飞机',
  'vehicle.boat': '船',
  'furniture.bed': '床',
  'furniture.couch': '沙发',
  'furniture.armchair': '扶手椅',
  'furniture.diningTable': '餐桌',
  'furniture.kitchenTable': '厨房餐桌',
  'furniture.desk': '书桌',
  'furniture.sideTable': '边桌',
  'furniture.lamp': '落地灯',
  'furniture.chair': '椅子',
  'furniture.stool': '凳子',
  'furniture.bar': '吧台',
  'furniture.counter': '厨房操作台',
  'furniture.shelf': '置物架',
  'furniture.tv': '电视',
  'furniture.tableSetting': '餐桌摆盘',
  'furniture.door': '门',
  'furniture.window': '窗户',
  'furniture.fridge': '冰箱',
  'furniture.stove': '炉灶',
  'furniture.sinkCounter': '水槽台',
  'furniture.toilet': '马桶',
  'furniture.bathtub': '浴缸',
  'furniture.showerStall': '淋浴间',
  'furniture.officeChair': '办公椅',
  'furniture.filingCabinet': '文件柜',
  'furniture.whiteboard': '白板',
  'furniture.podium': '讲台',
  'furniture.monitor': '显示器',
  'furniture.pianoUpright': '立式钢琴',
  'furniture.poolTable': '台球桌',
  'furniture.hospitalBed': '病床',
  'furniture.wheelchair': '轮椅',
  'furniture.crib': '婴儿床',
  'furniture.fireplace': '壁炉',
  'furniture.chandelier': '吊灯',
  'furniture.rug': '地毯',
  'furniture.curtain': '窗帘',
  'furniture.bookshelfFull': '书架',
  'furniture.doorOpen': '敞开的门',
  'prop.phone': '手机',
  'prop.laptop': '笔记本电脑',
  'prop.cup': '杯子',
  'prop.mug': '马克杯',
  'prop.bowl': '碗',
  'prop.plate': '盘子',
  'prop.bottle': '瓶子',
  'prop.wineglass': '酒杯',
  'prop.book': '书',
  'prop.newspaper': '报纸',
  'prop.briefcase': '公文包',
  'prop.suitcase': '行李箱',
  'prop.backpack': '背包',
  'prop.umbrella': '雨伞',
  'prop.hat': '帽子',
  'prop.baseballBat': '棒球棒',
  'prop.sword': '剑',
  'prop.torch': '手电筒',
  'prop.candle': '蜡烛',
  'prop.lantern': '灯笼',
  'prop.pictureFrame': '相框',
  'prop.poster': '海报',
  'prop.mirror': '镜子',
  'prop.clock': '时钟',
  'prop.ball': '球',
  'prop.balloon': '气球',
  'prop.microphone': '麦克风',
  'prop.guitar': '吉他',
  'prop.camera': '摄影机',
  'prop.tripod': '三脚架',
  'prop.tree': '树',
  'prop.bush': '灌木',
  'prop.rock': '岩石',
  'prop.streetlightSingle': '路灯',
  'prop.trafficLight': '红绿灯',
  'prop.stopSign': '停车标志',
  'prop.fireHydrant': '消防栓',
  'prop.mailbox': '邮箱',
  'prop.trashcan': '垃圾桶',
  'prop.dumpster': '大型垃圾箱',
  'prop.trafficCone': '交通锥',
  'prop.barrier': '路障',
  'prop.fence': '围栏',
  'prop.bench': '公园长椅',
  'prop.phoneBooth': '电话亭',
  'prop.atm': 'ATM',
  'prop.vendingMachine': '自动售货机',
  'prop.shoppingCart': '购物车',
  'prop.ladder': '梯子',
  'prop.scaffold': '脚手架',
  'prop.crate': '木箱',
  'prop.barrel': '桶',
  'prop.pallet': '托盘',
  'prop.tent': '帐篷',
  'prop.campfire': '营火',
  'prop.poolWater': '水池',
  'prop.fountain': '喷泉',
  'prop.flagpole': '旗杆',
  'prop.helicopter': '直升机',
  'prop.hotTub': '热水浴缸',
  'prop.bbqGrill': '烧烤架',
  'prop.firepit': '火坑',
  'prop.poolLounger': '泳池躺椅',
  'prop.patioUmbrellaTable': '庭院遮阳桌',
  'prop.picnicTable': '野餐桌',
  'prop.swingSet': '秋千架',
  'prop.slide': '滑梯',
  'prop.seesaw': '跷跷板',
  'prop.sandbox': '沙坑',
  'prop.trampoline': '蹦床',
  'prop.kiddiePool': '儿童戏水池',
  'prop.basketballHoop': '篮球架',
  'prop.soccerGoal': '足球门',
  'prop.doghouse': '狗屋',
  'prop.shed': '花园储物棚',
  'prop.gazebo': '凉亭',
  'prop.hammock': '吊床',
  'prop.lawnmower': '割草机',
  'prop.cashRegister': '收银机',
  'prop.kiosk': '售货亭',
  'prop.gasPump': '加油泵',
  'prop.parkingMeter': '停车计时器',
  'prop.busShelter': '公交候车亭',
  'prop.slotMachine': '老虎机',
  'prop.cloud': '云',
  'prop.squirtGun': '玩具水枪',
  'env.houseInterior': '房屋室内',
  'env.houseExterior': '房屋外观',
  'env.cityStreet': '城市街道',
  'env.store': '商店',
  'env.nightclub': '夜店',
  'env.office': '办公室',
  'env.warehouse': '仓库',
  'env.carInterior': '汽车内部',
  'env.busInterior': '公交车内部',
  'env.planeCabin': '飞机客舱',
  'env.field': '开阔田野',
  'env.desert': '沙漠',
  'env.parkingLot': '停车场',
  'env.alley': '小巷',
  'env.rooftop': '屋顶',
  'env.restaurant': '餐厅',
  'env.hospitalRoom': '医院病房',
  'env.classroom': '教室',
  'env.gym': '健身房',
  'env.courtroom': '法庭',
  'env.subwayPlatform': '地铁站台',
  'env.beach': '海滩',
  'env.forest': '森林',
  'env.bar': '酒吧',
  'env.stage': '舞台',
  'env.trainInterior': '火车车厢内部',
  'env.boatInterior': '船舱',
  'env.postOffice': '邮局',
  'env.supermarket': '超市',
  'env.movieTheater': '电影院',
  'env.indoorMall': '室内商场',
  'env.hotelLobby': '酒店大堂',
  'env.hotelRoom': '酒店房间',
  'env.diner': '小餐馆',
  'env.coffeeShop': '咖啡店',
  'env.policeStation': '警察局',
  'env.church': '教堂',
  'env.schoolHallway': '学校走廊',
  'env.airportTerminal': '机场航站楼',
  'env.casino': '赌场',
  'env.parkingGarage': '停车库',
  'env.stripMall': '沿街商业区',
  'env.outdoorMall': '户外步行街',
  'env.residentialStreet': '住宅街道',
  'env.downtown': '市中心',
  'env.trainStation': '火车站台',
  'env.gasStation': '加油站',
  'env.park': '城市公园',
  'env.playgroundPark': '游乐场',
  'env.backyard': '带泳池的后院',
  'env.constructionSite': '建筑工地',
  'env.cemetery': '墓地',
  'env.stadium': '体育场看台',
  'env.sky': '天空（航拍）',
  'env.houseFull': '完整房屋室内（多房间）',
  'prim.cube': '立方体',
  'prim.cylinder': '圆柱体',
  'prim.ramp': '坡道',
  'prim.wall': '墙段',
  'prim.stairs': '楼梯'
}

function idToSlug(id) {
  return id.replace(/\./g, '_')
}

async function loadEngine() {
  const server = await createServer({
    configFile: resolve(root, 'vitest.config.ts'),
    root
  })
  await server.pluginContainer.buildStart({})
  const mod = (p) =>
    server.ssrLoadModule(p).then((m) => {
      server.close()
      return m
    })
  const assets = await server.ssrLoadModule(resolve(root, 'src/engine/assets.ts'))
  const gaits = await server.ssrLoadModule(resolve(root, 'src/engine/gaits.ts'))
  const camera = await server.ssrLoadModule(resolve(root, 'src/engine/camera-moves.ts'))
  const motions = await server.ssrLoadModule(resolve(root, 'src/engine/motions.ts'))
  const actions = await server.ssrLoadModule(resolve(root, 'src/engine/action-presets.ts'))
  const profiles = await server.ssrLoadModule(resolve(root, 'src/engine/profiles.ts'))
  await server.close()
  return { assets, gaits, camera, motions, actions, profiles }
}

function categoryToSlug(category) {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

/** @param {Record<string, Record<string, string>>} zhCameraMoves descriptions keyed by slug */
function buildFile(data) {
  const lines = []
  lines.push('/** Auto-generated Chinese engine UI strings. Run: node scripts/generate-zh-engine-overrides.mjs */')
  lines.push('export const zhEngineOverrides = {')
  lines.push('  assetCategories: ' + JSON.stringify(data.assetCategories, null, 2).replace(/\n/g, '\n  ') + ',')
  lines.push('  assets: {')
  for (const [slug, name] of Object.entries(data.assets)) {
    lines.push(`    ${JSON.stringify(slug)}: { name: ${JSON.stringify(name)} },`)
  }
  lines.push('  },')
  lines.push('  gaits: {')
  for (const [key, name] of Object.entries(data.gaits)) {
    lines.push(`    ${JSON.stringify(key)}: { name: ${JSON.stringify(name)} },`)
  }
  lines.push('  },')
  lines.push('  cameraMoveCategories: ' + JSON.stringify(data.cameraMoveCategories, null, 2).replace(/\n/g, '\n  ') + ',')
  lines.push('  cameraMoves: {')
  for (const [slug, v] of Object.entries(data.cameraMoves)) {
    lines.push(
      `    ${JSON.stringify(slug)}: { name: ${JSON.stringify(v.name)}, description: ${JSON.stringify(v.description)} },`
    )
  }
  lines.push('  },')
  lines.push('  motionCategories: ' + JSON.stringify(data.motionCategories, null, 2).replace(/\n/g, '\n  ') + ',')
  lines.push('  motions: {')
  for (const [slug, name] of Object.entries(data.motions)) {
    lines.push(`    ${JSON.stringify(slug)}: { name: ${JSON.stringify(name)} },`)
  }
  lines.push('  },')
  lines.push('  actionCategories: ' + JSON.stringify(data.actionCategories, null, 2).replace(/\n/g, '\n  ') + ',')
  lines.push('  actions: {')
  for (const [slug, v] of Object.entries(data.actions)) {
    lines.push(
      `    ${JSON.stringify(slug)}: { name: ${JSON.stringify(v.name)}, description: ${JSON.stringify(v.description)} },`
    )
  }
  lines.push('  },')
  lines.push('  profiles: {')
  for (const [slug, v] of Object.entries(data.profiles)) {
    lines.push(
      `    ${JSON.stringify(slug)}: { name: ${JSON.stringify(v.name)}, attachHint: ${JSON.stringify(v.attachHint)} },`
    )
  }
  lines.push('  }')
  lines.push('} as const')
  lines.push('')
  return lines.join('\n')
}

// Chinese translations for camera moves, motions, actions, profiles - embedded below
const ZH = {
  assetCategories: {
    people: '人物',
    animals: '动物',
    vehicles: '载具',
    furniture: '家具',
    props: '道具',
    environment: '环境',
    primitives: '基础体',
    custom: '自定义'
  },
  gaits: {
    stand: '站立',
    walk: '行走',
    jog: '慢跑',
    run: '奔跑',
    sit: '坐下',
    lie: '躺下',
    crouch: '蹲伏',
    gesture: '说话/手势',
    fall: '跌倒'
  },
  cameraMoveCategories: {
    push_and_pull: '推拉',
    orbit_and_arc: '环绕与弧线',
    crane_and_boom: '升降与摇臂',
    aerial: '航拍',
    follow: '跟随',
    pan_and_scan: '摇移与扫描',
    stylized: '风格化'
  },
  motionCategories: {
    fight: '打斗',
    dance: '舞蹈',
    gesture: '手势',
    stunt: '特技'
  },
  actionCategories: {
    aircraft: '飞机',
    helicopter: '直升机',
    bird: '鸟类',
    vehicle: '车辆',
    destruction: '破坏',
    object: '物体',
    person: '人物'
  }
}

// Camera move zh - will be filled from a dict in the script body after load
const ZH_CAMERA = {
  'slow-push-in': { name: '缓慢推近', description: '从当前机位 gently 向主体推近约 2 米——营造安静的压迫感。' },
  'crash-in': { name: '急推', description: '快速推近，大部分位移发生在最后三分之一——突然扑向主体。' },
  'pull-back-reveal': { name: '后拉揭示', description: '后退并略微上升，揭示周围环境——经典开场或收尾。' },
  'creep-in-low': { name: '低位 creeping 推近', description: '膝部高度的缓慢推近，让主体显得压迫——威胁感低角度接近。' },
  'orbit-90-left': { name: '左环绕 90°', description: '以当前半径逆时针环绕主体四分之一圈——展示新侧面。' },
  'orbit-90-right': { name: '右环绕 90°', description: '以当前半径顺时针环绕主体四分之一圈——展示另一侧。' },
  'orbit-180': { name: '环绕 180°', description: '环绕主体半圈，落到对面——视角大幅转换。' },
  'orbit-360': { name: '环绕 360°', description: '完整环绕主体一圈，回到起始方位——英雄揭示旋转。' },
  'arc-and-push': { name: '弧线推近', description: '四分之一弧线环绕同时半径缩小约 40%——边绕边收紧。' },
  'crane-up-reveal': { name: '升 crane 揭示', description: '从眼平高度直升约 8 米俯视——世界在主体脚下展开。' },
  'crane-down-intro': { name: '降 crane 引入', description: '从约 8 米俯视降至眼平高度——优雅进入场景。' },
  'pedestal-up': { name: '垂直上升', description: '垂直上升约 3 米并保持瞄准主体——全身 reframe 无 dolly。' },
  'boom-over': { name: '越过摇臂', description: '上升并直接越过主体到对面——戏剧性跨越。' },
  'drone-rise-pullback': { name: '无人机上升后拉', description: '爬升至约 15 米同时后撤约 20 米——经典无人机结尾。' },
  flyover: { name: '飞越', description: '约 12 米高度从主体前方飞越到后方——航拍穿越。' },
  'drone-orbit-high': { name: '高位无人机环绕', description: '约 10 米高度 270° 宽环绕俯视——环绕巡视。' },
  'top-down-descend': { name: '顶视下降', description: '从约 20 米垂直降至约 6 米正俯视——上帝视角下降。' },
  'follow-behind': { name: '后方跟随', description: '约 1.8 米高度、4 米后方跟随主体朝向——追飞机式镜头。' },
  'lead-the-subject': { name: '前方引导', description: '在主体前方约 4 米回拍——引导运动并呈现面部。' },
  'side-track-left': { name: '左侧横移', description: '沿主体左侧约 4 米平行横移——侧向 tracking。' },
  'side-track-right': { name: '右侧横移', description: '沿主体右侧约 4 米平行横移——侧向 tracking。' },
  'static-pan-across': { name: '固定机位横摇', description: '机位不动，从主体左侧 25° 摇至右侧 25°——扫视动作线。' },
  'whip-pan': { name: '甩摇', description: '锁定主体后约 0.4 秒内 violent 90° 甩摇再稳住——快速切场感。' },
  'slow-tilt-reveal': { name: '缓慢 tilt 揭示', description: '从主体前方地面开始，tilt 上抬至双眼——从脚到头揭示。' },
  'vertigo-dolly-zoom': { name: '眩晕 dolly-zoom', description: '推近同时 widen 镜头使主体大小不变——眩晕效果。' },
  'dutch-orbit': { name: '荷兰角环绕', description: '90° 环绕同时 horizon roll 至 ±0.3rad 荷兰 tilt——不安定风格。' },
  'snap-zoom-punch': { name: '急 snap 变焦', description: '固定机位；镜头在三个紧 mark 间从 35mm snap 至 85mm—— punch-in 强调。' }
}

const ZH_MOTIONS = {
  'jab-cross': '刺拳/直拳',
  'uppercut': '上勾拳',
  'high-kick': '高踢',
  'block-and-dodge': '格挡与闪避',
  haymaker: '大摆拳',
  'knocked-down': '被击倒',
  'roundhouse-kick': '回旋踢',
  'front-kick-combo': '前踢/刺拳',
  'spinning-backfist': '旋转背拳',
  'double-jab-body-shot': '双刺拳/ body shot',
  'guard-up-advance': '举 guard 前进',
  'dodge-weave': '闪躲与摇摆',
  'grapple-shove': '擒抱推搡',
  'takedown-lunge': '扑倒冲刺',
  'boxing-combo': '拳击组合',
  'groove-loop': '律动循环',
  'arms-up-party': '举手派对',
  'disco-point': '迪斯科指向',
  robot: '机器人舞',
  'hip-hop-bounce': '嘻哈 bounce',
  'salsa-step': '萨尔萨舞步',
  'moonwalk-lean': '月球漫步 lean',
  'breakdance-freeze': 'Breaking 定格',
  macarena: ' Macarena',
  'mosh-jump': ' mosh 跳跃',
  'slow-sway': '慢摇',
  twist: '扭扭舞',
  'vogue-pose-chain': 'Vogue  pose 链',
  charleston: '查尔斯顿',
  headbang: '甩头',
  'c-walk': 'C-Walk',
  'freestyle-dance': ' freestyle 舞蹈',
  wave: '波浪手',
  clap: '鼓掌',
  'point-ahead': '指向前方',
  bow: '鞠躬',
  'cheer-jump': ' cheer 跳跃',
  'argue-point': '争论与指点',
  salute: '敬礼',
  'look-around-paranoid': ' paranoid 环顾',
  'playing-cards': '打牌',
  'shoot-squirt-gun': '玩水枪',
  'open-door': '开门',
  'close-door': '关门',
  'lie-down-sleep': '躺下睡觉',
  'sit-down': '坐下',
  'stand-up': '站起',
  'drink-seated': '坐着喝',
  'drink-standing': '站着喝',
  'basketball-dribble': '篮球运球',
  'soccer-kicks': '踢球',
  'tennis-swings': '网球挥拍',
  'kiss-lean': '亲吻 lean',
  'dive-dodge': '扑躲',
  'hit-reaction-head': '头部受击反应',
  'hit-reaction-body': '身体受击反应',
  'stumble-back-fall': '踉跄后退跌倒',
  'shield-block': ' shield 格挡',
  'roll-dodge': '翻滚闪避',
  'dazed-wobble': '眩晕摇晃',
  'fall-backwards': '向后跌倒',
  'freefall-flail': '自由落体挣扎',
  crawl: '爬行',
  jump: '跳跃'
}

const ZH_ACTIONS = {
  'plane-takeoff': { name: '飞机起飞', description: '跑道加速滑跑、抬轮，然后爬升至高度。' },
  'plane-landing': { name: '飞机降落', description: '从当前高度进近下降、接地并滑跑至完全停止。' },
  'plane-flyby': { name: '飞机飞越', description: '在当前高度快速平飞掠过——过低时 clamp 至安全最低高度。' },
  'plane-banked-circle': { name: '飞机倾斜盘旋', description: '在高空完成一次倾斜满圆，回到起点附近。' },
  'plane-crash-dive': { name: '飞机俯冲坠毁', description: '从高度 steep 俯冲至地面接触，然后短距离滑停。' },
  'heli-takeoff': { name: '直升机起飞', description: '垂直爬升至约 12 米，爬升时略微前漂。' },
  'heli-landing': { name: '直升机降落', description: '从当前高度下降、接地并减速至停止。' },
  'heli-orbit': { name: '直升机环绕', description: '在当前高度环绕兴趣点——经典新闻直升机盘旋。' },
  'heli-hover-hold': { name: '直升机悬停', description: '保持位置并轻微 drift—— rotor 旋转的 standby 悬停。' },
  'bird-circle-soar': { name: '鸟类盘旋 soar', description: '在 thermal 上 lazy 盘旋并 gently 上升—— hawk 乘风。' },
  'bird-swoop': { name: '鸟类俯冲', description: '向前俯冲、低掠然后爬升——捕猎 stoop。' },
  'bird-flock-pass': { name: '鸟群掠过', description: '快速 gently 波浪 S 形路径横穿画面—— flock 切过。' },
  'car-chase-weave': { name: '汽车追逐 weaving', description: '快速前进并 hard S 形 weaving—— chase 中 dodging 车流。' },
  'car-drift-turn': { name: '汽车 drift 转弯', description: '快速接近后以 wide drift 弧完成 90° 急转。' },
  'car-screech-stop': { name: '汽车急刹', description: '快速接近后 hard 制动停止——轮胎 screech，dead stop。' },
  'car-pull-up-park': { name: '汽车靠边停车', description: ' moderate 接近、侧向 curving 并 ease 至 curb 停车。' },
  'car-reverse-escape': { name: '汽车倒车 escape', description: '静止 beat 后 hard 倒车并 180° J-turn getaway。' },
  'debris-fall': { name: ' debris 坠落', description: ' chunk 略向外弧坠落、 bounce 一次并 settle。' },
  'building-topple': { name: '建筑倒塌', description: '墙或柱 outward lean、加速并沿弧 crash 至地面。' },
  'object-thrown-arc': { name: '物体抛物线', description: ' forward 弹道弧、 peak 高于起点、 landing bounce 后 stop。' },
  'object-tornado-spiral': { name: '物体 tornado 螺旋', description: '上升 expanding 螺旋—— whirlwind 卷起的 paper/debris。' },
  'walk-forward': { name: '向前走', description: '沿 heading  steady 行走约 1.4 m/s。' },
  'run-forward': { name: '向前跑', description: '沿 heading  fast 跑约 5 m/s。' },
  'walk-up-stairs': { name: '上楼梯', description: ' climbing 楼梯：八级均匀台阶，约 6m 前进 1.4m  rise，顶部 level hold。' },
  'jump-forward': { name: '向前跳', description: '三次 forward hop——每次 arc 约 0.5m 高、前进约 1.2m。' }
}

const ZH_PROFILES = {
  'seedance-2': {
    name: 'Seedance 2.0',
    attachHint: '将参考 MP4 作为 motion/video 参考，首帧 still 作为 image 参考。'
  },
  'veo-3.1': {
    name: 'Veo 3.1',
    attachHint: '使用首帧 still 作为 image 输入；在 prompt 中描述镜头运动。'
  },
  'kling-2': {
    name: 'Kling 2.x',
    attachHint: '使用首帧与末帧 still 作为 start/end frame；参考 video 在支持时引导 motion。'
  },
  'ltx-2.3': {
    name: 'LTX 2.3',
    attachHint: '使用 depth-pass MP4 作为 depth/structure conditioning video（导出含 ComfyUI workflow）。'
  },
  'wan-2.2': {
    name: 'Wan 2.2',
    attachHint: '在 ComfyUI 中将 depth 或 reference video 作为 VACE/control 输入（导出含 workflow）。'
  },
  'gpt-image-2': {
    name: 'GPT Image 2',
    attachHint: '将 mark stills 与 top-down diagram 作为构图 image 参考。'
  },
  'nano-banana': {
    name: 'Nano Banana',
    attachHint: '附加一张 mark still 作为构图参考。'
  },
  ideogram: {
    name: 'Ideogram',
    attachHint: '附加一张 mark still 作为 style/构图参考。'
  },
  'krea-2': {
    name: 'Krea 2',
    attachHint: '使用 mark still 作为 image 参考并设高 adherence strength。'
  }
}

async function main() {
  const { assets, gaits, camera, motions, actions, profiles } = await loadEngine()

  const assetOut = {}
  for (const a of assets.ASSET_CATALOG) {
    const slug = idToSlug(a.id)
    const zh = ZH_ASSET_NAMES[a.id]
    if (!zh) throw new Error(`Missing ZH_ASSET_NAMES for ${a.id}`)
    assetOut[slug] = zh
  }

  const gaitOut = {}
  for (const [key, spec] of Object.entries(gaits.GAITS)) {
    gaitOut[key] = ZH.gaits[key]
    if (!gaitOut[key]) throw new Error(`Missing ZH gait ${key}`)
  }

  const cameraOut = {}
  for (const p of camera.CAMERA_MOVE_PRESETS) {
    const slug = idToSlug(p.id)
    const zh = ZH_CAMERA[p.id]
    if (!zh) throw new Error(`Missing ZH_CAMERA for ${p.id}`)
    cameraOut[slug] = zh
  }

  const motionOut = {}
  for (const p of motions.MOTION_PRESETS) {
    const slug = idToSlug(p.id)
    const zh = ZH_MOTIONS[p.id]
    if (!zh) throw new Error(`Missing ZH_MOTIONS for ${p.id}`)
    motionOut[slug] = zh
  }

  const actionOut = {}
  for (const p of actions.ACTION_PRESETS) {
    const slug = idToSlug(p.id)
    const zh = ZH_ACTIONS[p.id]
    if (!zh) throw new Error(`Missing ZH_ACTIONS for ${p.id}`)
    actionOut[slug] = zh
  }

  const profileOut = {}
  for (const p of profiles.BUILTIN_PROFILES) {
    const slug = idToSlug(p.id)
    const zh = ZH_PROFILES[p.id]
    if (!zh) throw new Error(`Missing ZH_PROFILES for ${p.id}`)
    profileOut[slug] = zh
  }

  const content = buildFile({
    assetCategories: ZH.assetCategories,
    assets: assetOut,
    gaits: gaitOut,
    cameraMoveCategories: ZH.cameraMoveCategories,
    cameraMoves: cameraOut,
    motionCategories: ZH.motionCategories,
    motions: motionOut,
    actionCategories: ZH.actionCategories,
    actions: actionOut,
    profiles: profileOut
  })

  const outPath = resolve(root, 'src/shared/i18n/locales/zh-engine-overrides.ts')
  writeFileSync(outPath, content, 'utf-8')
  console.log('Wrote', outPath)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
