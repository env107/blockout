export const uiZhCN = {
  app: {
    name: 'BLOCKOUT',
    logoAlt: 'Blockout',
    modes: {
      stage: '布置',
      shoot: '拍摄',
      deliver: '交付'
    },
    save: '保存',
    help: '? 帮助',
    helpTitle: '帮助：快速入门、操作指南、快捷键（?）',
    credits: {
      createdBy: 'Created by Sam Wasserman',
      openSource: '基于 Apache-2.0 开源 — 使用或 fork 时请保留此署名。'
    }
  },
  welcome: {
    tagline:
      '布置场景，用标记编排镜头与角色走位，并导出供 AI 视频生成器使用的动作参考包。',
    newProject: '新建项目',
    openProject: '打开项目…',
    tutorial: '? 教程'
  },
  help: {
    tabs: {
      quickStart: '快速入门',
      tasks: '如何…？',
      shortcuts: '快捷键'
    },
    done: '完成',
    intro: {
      quickStart:
        '整个应用就是三个动词：<b>布置</b>场景、<b>拍摄</b>动作、<b>交付</b>参考包给你的 AI 生成器。下面是全貌一览。',
      shortcuts: '键盘快捷键 — 每个操作都可撤销。'
    },
    cards: {
      stageYourSet: {
        emoji: '🏗',
        title: '布置场景',
        body: '从素材库拖入环境和人物，然后点击地面放置。',
        then: '然后：给主角加标签并设置灯光。'
      },
      oneClickSequences: {
        emoji: '🎬',
        title: '一键序列',
        body: '整段舞蹈、打斗、追逐，已编排好。点击地面放置演员。',
        then: '然后：每位表演者仍可单独编辑。'
      },
      makeThemMove: {
        emoji: '🚶',
        title: '让他们动起来',
        body: '选中某人，按 M 并点击标记。或按 ● 录制，用光标操控他们。',
        then: '然后：在时间轴上调整标记药丸的时间。'
      },
      animateTab: {
        emoji: '✨',
        title: '动画标签页',
        body: '打斗、舞蹈、坐/喝/跳等任意角色动作。一键放置。',
        then: '然后：像其他标记一样微调姿态标记。'
      },
      frameAndMoveCamera: {
        emoji: '🎥',
        title: '构图与运镜',
        body: '选择构图，从 27 种镜头运动中选择，或跟踪主体使瞄准锁定。',
        then: '然后：▶ 播放镜头查看实际导出画面。'
      },
      deliver: {
        emoji: '📦',
        title: '交付',
        body: '选择生成器并导出包：视频、深度通道、静帧和文字提示词。',
        then: '然后：将提示词直接粘贴到生成器中。'
      }
    },
    search: {
      placeholder: '搜索任务 — 例如「打斗」「跟踪飞机」「720p」…',
      empty: '没有匹配「{{query}}」的任务。'
    },
    tasks: {
      stage: {
        area: '布置',
        items: {
          q1: '如何在场景中添加布景和人物？',
          a1: '在<b>布置</b>模式下，点击素材库中的项目（人物、道具或整套环境），然后点击地面。按住 <kbd>{{alt}}</kbd> 可连续放置多个；<kbd>Esc</kbd> 取消。',
          q2: '如何移动、旋转或复制物体？',
          a2: '点击选中，然后拖动箭头移动。按 <kbd>R</kbd> 旋转，<kbd>G</kbd> 切回移动，<kbd>{{mod}}D</kbd> 复制，<kbd>⌫</kbd> 删除。',
          q3: '如何为 AI 生成器命名角色？',
          a3: '选中人物，在检查器中输入如 <b>HERO</b> 的标签并选择颜色。标签悬浮在头顶、给模型上色，并告诉生成器谁是谁。',
          q4: '如何让人物摆姿势而不做动画？',
          a4: '使用检查器的<b>姿态</b>区 — 站立、坐、蹲、躺、说话、倒地。打开<b>肢体姿态</b>，用 14 个滑块构建打斗或舞蹈造型。',
          q5: '如何让骑手与自行车一起移动？',
          a5: '放置人物，然后在检查器中选择<b>绑定到…</b>自行车。拖动自行车，骑手跟随；<b>解除绑定</b>可分开。',
          q6: '如何移动已放置的整群人群？',
          a6: '将所有表演者绑定到一个领头者，然后移动领头者 — 群组跟随。或 <kbd>⇧</kbd>-点击全选后拖动，多选会作为整体移动。',
          q7: '如何设置灯光？',
          a7: '未选中任何物体时，检查器显示场景：选择预设（白天、黄金时刻、夜晚、俱乐部…），拖动太阳，添加雾。生成器从参考中读取光线方向。',
          q8: '如何根据照片布置场景？',
          a8: '素材库底部的<b>从参考填充…</b>会根据图片布置人物、姿态、灯光和匹配的摄像机。需要 Claude API 密钥；一次 <kbd>{{mod}}Z</kbd> 可全部撤销。',
          q9: '如何导入自己的 3D 模型？',
          a9: '素材库中的<b>导入 3D 模型…</b>可加载 GLB/glTF 并复制到项目中。',
          q10: '如何让某物不出现在渲染中但在编辑时可见？',
          a10: '选中它并在检查器中勾选<b>导出时隐藏</b>。编辑时仍可见，但所有渲染通道中都会排除。'
        }
      },
      shoot: {
        area: '拍摄',
        items: {
          q1: '如何让某人沿路径行走？',
          a1: '在<b>拍摄</b>中选中他们，按 <kbd>M</kbd>，点击地面放置标记。他们在时间轴上的标记间行走；选中标记可设置步态或停留。',
          q2: '如何用鼠标操控某人？',
          a2: '选中角色或载具，按<b>● 录制表演者</b> — 用光标操控，步态匹配速度。<b>■ 停止</b>保存；重新录制可替换。',
          q3: '如何让两人打斗？',
          a3: '选中一人，打开<b>动画</b>标签页，应用打斗动作 — 在播放头处放置可编辑的姿态标记。对对手做同样操作以交替出拳。',
          q4: '如何让角色跳舞？',
          a4: '选中他们并从<b>动画</b>标签页应用舞蹈（嘻哈、萨尔萨、月球漫步、霹雳舞…）。或在布置模式下一次性放置整段<b>舞蹈序列</b>。',
          q5: '如何让盘子飞过房间？',
          a5: '选中任意实体并从<b>动作预设</b>应用飞行，或<b>● 录制</b>并用<b>滚轮控制高度</b>。之后可手动设置标记的<b>高度</b>。',
          q6: '如何让飞机降落或建筑物倒塌？',
          a6: '先对准实体，然后从<b>动作预设</b>应用 — 起飞/降落/飞越、直升机环绕、汽车追逐、坠落碎片、建筑倒塌。路径从当前位置开始。',
          q7: '如何让某人上公交或下飞机？',
          a7: '选中演员最后一个标记，设置<b>到达后登车 → 公交车</b>。要下车，将他们绑定到停放的飞机，然后给出在着陆后的标记。',
          q8: '如何在时间轴上调整时间或删除动作？',
          a8: '拖动药丸调整时间，拖动右边缘添加停留。单击<b>摄像机</b>药丸可编辑参数，或按 <kbd>Delete</kbd> 删除选中标记。<kbd>⇧</kbd>-点击可多选药丸。',
          q9: '如何一次性创建整群编排？',
          a9: '在布置模式下，<b>序列</b>框可布置完整阵容：舞蹈、打斗、步行追逐或汽车追逐。设置数量和风格，即可放置已编排好的群组。'
        }
      },
      camera: {
        area: '摄像机',
        items: {
          q1: '如何构图？',
          a1: '选中摄像机并按 <kbd>C</kbd> 透视，然后选择景别（WS/MS/CU）自动构图，或选择构图（<b>双人/过肩/反打/俯拍/低角/荷兰角</b>）。',
          q2: '如何在拍摄中移动摄像机？',
          a2: '构图后放置<b>+ 镜头标记</b>，移动并重新构图，再放置另一个 — 标记间移动。选择<b>稳定器</b>（轨道、斯坦尼康、手持、摇臂、无人机）控制运动感觉。',
          q3: '如何使用现成的镜头运动？',
          a3: '摄像机检查器有<b>27 种运动</b> — 环绕、摇臂、无人机跟随、甩镜、眩晕推拉。一键在主体周围放置可编辑标记。',
          q4: '如何用摄像机跟踪飞机？',
          a4: '在摄像机检查器中开启<b>跟踪主体</b>并选择主体 — 无论它如何移动，瞄准都会锁定，对焦也会跟随。',
          q5: '如何像操作员一样操控摄像机？',
          a5: '选中摄像机并按<b>● 录制摄像机</b> — 走位回放时你环绕、平移、缩放视图，你的飞行成为与动作同步的运动。',
          q6: '如何添加第二台摄像机？',
          a6: '摄像机检查器顶部的<b>摄像机 (A/B/C)</b>：<b>+</b>添加摄像机 B，有独立标记和稳定器。芯片切换；导出使用当前激活的。',
          q7: '如何精确查看导出内容？',
          a7: '<b>▶ 播放镜头</b>通过镜头摄像机播放 — 即实际导出画面。<b>镜头预览</b>框实时显示；<kbd>Space</kbd> 播放，<kbd>1–9</kbd> 跳转到镜头标记。',
          q8: '如何匹配现有镜头？',
          a8: '<b>🎞 参考</b>将任意视频（包括深度图视频）叠加在视口上，与时间轴同步 — 凭肉眼重现走位并调整透明度和偏移。',
          q9: '如何尝试冒险版本而不丢失镜头？',
          a9: '在左侧栏悬停镜头并点击<b>+ 草稿</b> — 快照为「1A v1」。草稿可播放和导出；<b>▲</b>将其提升为正式镜头。'
        }
      },
      deliver: {
        area: '交付',
        items: {
          q1: '如何为生成器导出包？',
          a1: '在<b>交付</b>中选择目标（Seedance、Veo、Kling、LTX、Wan…）并点击<b>导出镜头包</b> — 干净 MP4、深度通道、静帧、俯视图和文字提示词。',
          q2: '如何获得 Seedance 的 720p 文件？',
          a2: '在交付中将<b>分辨率</b>设为 720p — 这是 Seedance 接受的参考文件格式。适用于视频、静帧和动画样片。',
          q3: '如何只导出单帧？',
          a3: '拖动到精确时刻并点击<b>📸 导出此帧</b> — 将该帧保存为全质量 PNG。',
          q4: '如何控制标签是否出现在导出中？',
          a4: '选择标签是否烧录进视频、仅出现在静帧（默认）或完全隐藏 — 在交付面板中设置。',
          q5: '如何将所有镜头拼接为一个视频？',
          a5: '<b>动画样片</b>将场景中每个镜头拼接为一个视频；<b>联系表</b>制作故事板网格。',
          q6: '如何将走位导入 Blender？',
          a6: '<b>导出到 Blender</b>写入带动画摄像机和走位的 .glb，以及一键导入脚本。'
        }
      },
      projects: {
        area: '项目',
        items: {
          q1: '如何保存布景以便在其他项目中复用？',
          a1: '<b>场景预设</b>全局保存当前布置（布景 + 角色 + 走位）。在任何项目中作为新场景布置；原预设不变。',
          q2: '如何从另一角度拍摄同一动作？',
          a2: '场景拥有走位，每个镜头拥有独立摄像机，因此<b>新建镜头</b>并重新构图即可 — 无需重做动作。',
          q3: '崩溃后如何恢复工作？',
          a3: '每分钟自动备份；崩溃后<b>打开项目</b>恢复未保存的工作。项目只是可读 JSON 文件夹，可安全备份或 git。',
          q4: '如何让 AI 代理驱动应用？',
          a4: '向 Claude Code、Codex 或 Hermes 注册 <b>mcp/blockout-mcp.mjs</b> — 代理可布置场景、构图并截图视口。见 AGENTS.md。'
        }
      }
    },
    shortcuts: {
      space: { keys: 'Space', description: '播放 / 暂停镜头' },
      m: { keys: 'M', description: '为选中项放置标记（点击地面）' },
      c: { keys: 'C', description: '透视镜头摄像机' },
      gR: { keys: 'G / R', description: 'Gizmo：移动 / 旋转' },
      shiftClick: { keys: '⇧-点击', description: '多选实体，或时间轴上的标记' },
      modA: { keys: '{{mod}}A / ⇧{{mod}}A', description: '选中镜头中所有标记 / 当前轨道中所有标记' },
      modD: { keys: '{{mod}}D', description: '复制选中项' },
      delete: { keys: '⌫', description: '删除选中项（多选全部删除）' },
      undoRedo: { keys: '{{mod}}Z / ⇧{{mod}}Z', description: '撤销 / 重做 — 每个操作都可撤销' },
      modS: { keys: '{{mod}}S', description: '保存项目' },
      jumpMarks: { keys: '1–9', description: '跳转到镜头标记 N' },
      altClick: { keys: '{{alt}}-点击', description: '布置时放置多个副本' },
      esc: { keys: 'Esc', description: '取消放置 / 标记放置 / 选择' },
      help: { keys: '?', description: '打开此帮助' }
    }
  },
  library: {
    stagePresets: {
      title: '场景预设',
      emptyHint: '保存可复用的布置 — 晚餐场景、驾驶设置 — 在任何项目中从此开始。',
      presetMeta: '{{count}} 项 · 保存于 {{date}}',
      stage: '布置',
      stageTitle: '将此预设布置为新场景 — 预设本身不会被修改',
      deleteTitle: '删除此预设',
      namePlaceholder: '预设名称… 例如：晚餐场景',
      save: '保存',
      saveCurrentTitle: '将当前场景的布置（布景、角色、走位）保存为可在任意项目中复用的预设',
      saveCurrent: '＋ 将当前布置保存为预设'
    },
    sequences: {
      title: '序列',
      type: '类型',
      types: {
        dance: '💃 舞蹈',
        fight: '🥊 打斗',
        footChase: '🏃 步行追逐',
        carChase: '🚗 汽车追逐'
      },
      performers: '表演者',
      style: '风格',
      placing: '⟳ 点击地面放置…（Esc 取消）',
      stagePerformers: '🎬 布置 {{count}} 名表演者',
      stageTitle:
        '进入放置模式 — 然后精确点击地面放置群组。面向摄像机布置。Esc 取消。一步撤销；每位表演者仍可单独编辑。'
    },
    searchPlaceholder: '搜索素材…',
    allCategories: '所有分类',
    showOneCategoryTitle: '一次显示一个分类',
    placeFromList: '从列表放置…',
    placeFromListTitle: '从完整列表选择 — 然后点击地面放置',
    categories: {
      people: '人物',
      animals: '动物',
      vehicles: '载具',
      furniture: '家具',
      props: '道具',
      environment: '环境',
      primitives: '基础体'
    },
    expand: '展开',
    collapse: '折叠',
    populateFromReference: '✨ 从参考填充…',
    populateFromReferenceTitle:
      '给 Claude 一张参考照片或视频帧 — 它会匹配布置场景：人物、家具、姿态、灯光和匹配构图的摄像机',
    importModel: '导入 3D 模型…'
  },
  inspector: {
    tabs: {
      selection: '选中',
      selectionTitle: '显示当前选中内容',
      camera: '🎥 摄像机',
      cameraTitle: '固定摄像机控制：镜头、位置、瞄准、稳定器、运动、跟踪 — 始终在此，无论选中什么',
      animate: '✨ 动画',
      animateTitle: '让选中项表演：打斗、舞蹈、坐/喝/跳、飞行和驾驶 — 或一次性重塑整组选中项'
    },
    entityNotFound: '未找到实体。',
    markNotFound: '未找到标记。',
    animate: {
      title: '✨ 动画',
      animating: '正在动画：{{name}}',
      presetsHint: '预设在播放头放置可编辑标记 — 应用后按 ▶，然后微调任意标记。',
      emptyHint:
        '选中<b>角色</b>给予打斗、舞蹈、坐下、喝酒 — 或选中<b>载具/道具</b>进行起飞、追逐和坠落。<br/><br/>⇧-点击<b>多名表演者</b>（或从素材库布置序列），此标签页可一次性重塑整组 — 更换舞蹈风格，改变所有人的动作。',
      groupTitle: '同时动画 {{count}} 个',
      groupHint: '就地替换每位表演者的编排 — 已布置的序列只是起点。一步撤销。',
      everyonePerforms: '全员表演（{{count}} 人）',
      applyToAll: '应用到全部 {{count}} 人',
      everyoneTravels: '全员移动（{{count}}）',
      applyPathToAll: '应用路径到全部',
      applyPathToAllTitle: '每位选中表演者从各自位置和朝向获得此路径 — 同步起飞、同步追逐'
    },
    scene: {
      title: '场景',
      name: '名称',
      stageHint: '点击素材库项目，然后点击地面放置。',
      lighting: '灯光',
      lightingPresets: {
        day: '白天',
        goldenHour: '黄金',
        night: '夜晚',
        interiorWarm: '暖内',
        interiorCool: '冷内',
        club: '俱乐部'
      },
      sunAzimuth: '太阳方位角',
      sunElevation: '太阳高度角',
      fog: '雾'
    },
    shot: {
      title: '镜头',
      duration: '时长 (s)',
      aspect: '画幅',
      notes: '备注'
    },
    entity: {
      title: '实体',
      name: '名称',
      x: 'X',
      y: 'Y',
      z: 'Z',
      rotation: '旋转°',
      scale: '缩放 ({{value}})',
      height: '身高 ({{value}})',
      build: '体型 ({{value}})',
      hideInExports: '导出时隐藏',
      label: '标签',
      labelPlaceholder: '标签文字',
      blocking: '走位',
      dropMarks: '放置标记 (M)',
      markRow: '标记 {{index}} — {{time}}s — {{gait}}',
      dangerZone: '危险区',
      deleteEntity: '删除实体'
    },
    pose: {
      title: '姿态',
      stand: '站立',
      sit: '坐',
      crouch: '蹲',
      lie: '躺',
      talk: '说话',
      fallen: '倒地',
      hint: '演员无标记时应用姿态；标记会用自身步态覆盖。',
      limbsSummary: '肢体姿态（打斗 / 舞蹈走位）',
      resetLimbs: '重置肢体',
      joints: {
        shoulderLX: '左臂前',
        shoulderRX: '右臂前',
        shoulderLZ: '左臂外',
        shoulderRZ: '右臂外',
        elbowL: '左肘',
        elbowR: '右肘',
        hipLX: '左腿',
        hipRX: '右腿',
        kneeL: '左膝',
        kneeR: '右膝',
        torsoX: '躯干前倾',
        torsoY: '躯干扭转',
        headY: '头部转向',
        headX: '头部点头',
        degrees: '{{label}} ({{deg}}°)'
      }
    },
    marriage: {
      title: '绑定',
      marriedTo: '已绑定到 {{name}}',
      marriedHint: '随处跟随。拖动此实体调整骑乘偏移。',
      unmarry: '解除绑定',
      marryTo: '绑定到…',
      chooseAnchor: '— 选择锚点 —'
    },
    multiEntity: {
      selected: '已选 {{count}} 个',
      marry: '绑定',
      marryHint: '最后选中的是锚点 — 其他将跟随它。',
      marryTo: '绑定到 {{name}}',
      unmarrySelected: '解除选中项绑定',
      deleteEntities: '删除 {{count}} 个实体'
    },
    motionPresets: {
      title: '动作预设',
      categories: {
        fight: '打斗',
        dance: '舞蹈',
        gesture: '手势',
        stunt: '特技'
      },
      apply: '应用',
      applyTitle: '在播放头插入 {{name}} 动作作为可编辑姿态标记',
      durationSuffix: ' · {{duration}}s',
      toastApplied: '{{name}} 从 {{time}}s 开始（{{count}} 个姿态{{extendNote}}）。按 ▶ 观看。',
      toastExtendNote: ' — 延长镜头以播放剩余部分',
      toastNoRoom: '镜头末尾前没有空间 — 将播放头移早一些。'
    },
    actionPresets: {
      title: '动作预设',
      label: '飞行、驾驶和特技路径 — 从播放头开始',
      apply: '应用动作',
      toastNotEnoughRoom: '播放头后镜头剩余不足 — 将播放头移早一些。',
      toastApplied: '{{name}} 从 {{time}}s 开始 — ▶ 观看。每个标记仍可编辑。'
    },
    multiMark: {
      selected: '已选 {{count}} 个标记',
      shiftTimes: '偏移时间',
      offset: '偏移 (s)',
      apply: '应用',
      deleteMarks: '删除 {{count}} 个标记'
    },
    camera: {
      camerasTitle: '摄像机 (A/B/C)',
      addCamera: '+',
      addCameraTitle: '添加摄像机',
      title: '摄像机',
      sensor: '传感器',
      lens: '镜头',
      autoFrame: '自动构图主体',
      positionAim: '位置与瞄准',
      positionAimMark: '位置与瞄准 — 标记 {{index}}/{{total}}',
      noMarksYet: '尚无镜头标记 — 放置一个后这些字段可直接控制。',
      dropMarkAtView: '+ 在当前视图放置镜头标记',
      height: '高度',
      pan: '水平',
      tilt: '俯仰',
      roll: 'Roll',
      lensMm: '镜头',
      atTime: '时间',
      positionAimHint: '编辑播放头处/之前的标记 — 拖动时间轴切换到其他标记。',
      trackSubject: '跟踪主体',
      keepAimedAt: '保持摄像机瞄准…',
      aimByMarksOff: '— 按标记瞄准（关）—',
      trackSubjectTitle:
        '瞄准锁定：无论摄像机如何移动 — 标记、录制飞行、预设 — 始终指向此主体。无人机跟踪飞机，操作员跟随演员。',
      trackingOnHint:
        '跟踪开启：任意方式移动摄像机 — 放置标记、录制飞行、应用运动预设 — 镜头始终锁定主体。标记设置对焦距离时对焦也会跟随。',
      movesTitle: '镜头运动',
      movesLabel: '{{count}} 种经典运动 — 围绕 {{subject}} 构建',
      yourSubject: '你的主体',
      aimLocksSuffix: ' 瞄准锁定主体。',
      applyMove: '应用运动',
      applyMoveTitle:
        '用此运动替换当前摄像机的标记（一步撤销）。先选中实体以围绕其构建；否则使用第一个角色。',
      rig: '稳定器',
      intensity: '强度 ({{value}})',
      mountTo: '挂载到',
      none: '— 无 —',
      marks: '标记',
      dropMarkAtViewOrM: '在当前视图放置镜头标记（或 M）',
      cameraMarkRow: '标记 {{index}} — {{time}}s — {{focal}}mm',
      clearCameraMove: '清除镜头运动（删除所有标记）'
    },
    mark: {
      title: '标记 {{index}}',
      arrive: '到达 (s)',
      hold: '停留 (s)',
      easeOut: '缓出 ({{value}})',
      easeIn: '缓入 ({{value}})',
      gait: '步态',
      altitude: '高度 (m) — 0 为地面；提高以飞行',
      boardOnArrival: '到达后登车',
      boardAfterMark: '到达此标记后，骑乘…',
      boardTitle: '登车：走到此标记，然后附着到载具/道具并一起移动 — 走上公交车并离开',
      stayOnFoot: '— 保持步行 —',
      optics: '光学',
      focalLength: '焦距 (mm)',
      deepFocus: '∞ 深焦',
      focusDistance: '对焦距离 (m)',
      position: '位置',
      deleteMark: '删除标记',
      poseAtMark: '此标记处的姿态',
      poseAtMarkHint: '移动时肢体从上一标记姿态混合到此标记 — 在连续标记上设置不同姿态以编排动作。',
      jointKeyframes: '关节关键帧',
      resetPoseAtMark: '重置此标记姿态'
    }
  },
  cameraMarkDialog: {
    title: '摄像机关键帧 {{index}} — {{time}}s',
    close: '关闭',
    delete: '删除关键帧'
  },
  timeline: {
    resizeTitle: '拖动调整时间轴大小',
    camera: '🎥 摄像机',
    laneSelectTitle: '点击：选中此轨道所有标记（⌫ 一起删除）',
    dur: '时长',
    fps: 'fps',
    timeDisplay: 't={{time}}s / {{duration}}s',
    selectAll: '全选',
    selectAllTitle: '选中每条轨道的每个标记（{{mod}}A）— 然后 ⌫ 全部删除，或在检查器中一起偏移时间',
    lineCrossingTitle:
      '摄像机在这些标记间穿过 180° 线（两位主角之间的轴线）— 屏幕方向会翻转。有意 crossing 没问题；否则保持 coverage 在一侧。',
    lineCrossing: '🎬 180° 线穿越：镜头标记 {{from}} → {{to}}',
    speedWarning: '⚠ {{name}}：隐含 {{speed}} m/s — 尝试 {{suggestion}}',
    suggestionMoreTime: '更多时间',
    emptyHint: '选中摄像机或演员，按 M，然后点击地面放置标记。',
    rulerTick: '{{t}}s'
  },
  projectRail: {
    title: '场景与镜头',
    addScene: '+ 场景',
    sceneLabel: '场景 {{number}} — {{name}}',
    addShotTitle: '添加镜头',
    deleteSceneTitle: '删除场景',
    addDraft: '+ 草稿',
    addDraftTitle: '将当前镜头保存为草稿',
    duplicateShotTitle: '复制镜头',
    deleteShotTitle: '删除镜头',
    draftLabel: '└ {{name}}',
    promoteDraftTitle: '设为此镜头',
    deleteDraftTitle: '删除草稿',
    needOneScene: '项目至少需要一个场景。',
    needOneShot: '场景至少需要一个镜头。',
    shotDuration: '{{duration}}s'
  },
  deliver: {
    title: '交付',
    titleWithScene: '交付 — {{scene}} / 镜头 {{shot}}',
    selectShot: '选择要导出的镜头。',
    targetGenerator: '目标生成器',
    output: '输出 — {{width}}×{{height}} @ {{fps}}fps · {{aspect}}',
    passes: {
      clean: '干净',
      depth: '深度',
      normal: '法线'
    },
    resolution: '分辨率',
    resolutionAuto: '自动',
    resolutionAutoTitle: '配置文件的原生尺寸',
    resolution720p: '720p',
    resolution720pTitle: '720p — Seedance 接受的参考文件格式。适用于视频、静帧和动画样片。',
    resolution1080p: '1080p',
    resolution1080pTitle: '1080p',
    labels: '标签',
    labelsInVideo: '视频中',
    labelsStillsOnly: '仅静帧',
    labelsOff: '关',
    progress: '{{label}} {{frame}}/{{total}}',
    cancel: '取消',
    exportShotPackage: '导出镜头包',
    exportThisFrame: '📸 导出此帧（播放头处）',
    exportThisFrameTitle: '仅将播放头处的帧导出为全质量 PNG — 先拖动到精确时刻',
    revealLastExportMac: '在 Finder 中显示上次导出',
    showLastExport: '在文件夹中显示上次导出',
    promptFor: '{{name}} 的提示词',
    copyPrompt: '复制提示词',
    sceneTools: '场景工具',
    exportAnimatic: '导出场景动画样片（{{count}} 个镜头）',
    exportContactSheet: '导出联系表',
    exportBlender: '导出到 Blender (.glb)',
    durationWarning: '⚠ 镜头 {{duration}}s，但 {{profile}} 限制为 {{max}}s — 考虑缩短。',
    toastExportComplete: '导出完成。',
    toastExportFailed: '导出失败：{{error}}',
    toastFrameExported: '帧已导出。',
    toastFrameExportFailed: '帧导出失败：{{error}}',
    toastPromptCopied: '提示词已复制。',
    toastAnimaticExported: '动画样片已导出。',
    toastAnimaticFailed: '动画样片失败：{{error}}',
    toastContactSheetExported: '联系表已导出。',
    toastContactSheetFailed: '联系表失败：{{error}}',
    toastBlenderExported: 'Blender 包已导出（.glb + 导入脚本）。',
    toastGltfFailed: 'glTF 导出失败：{{error}}'
  },
  viewport: {
    hud: {
      lens: '镜头',
      lensTitle: '焦距（点击切换）',
      aspect: '画幅',
      aspectTitle: '宽高比（点击切换）',
      duration: '时长',
      durationTitle: '镜头时长 — 在时间轴中编辑',
      fps: 'FPS',
      fpsTitle: '帧率',
      marks: '标记',
      marksTitle: '此镜头中的摄像机标记',
      lensValue: '{{value}}mm'
    },
    shotSizes: {
      ws: 'WS',
      fs: 'FS',
      ms: 'MS',
      mcu: 'MCU',
      cu: 'CU',
      autoFrameTitle: '自动构图：{{name}}'
    },
    recordControl: {
      precise: '🎯 精确',
      normal: '✋ 正常',
      fast: '⚡ 快速',
      title:
        '录制控制：精确 = 重度平滑 + 速度上限（慢而精确），正常 = 平衡，快速 = 原始快速。适用于表演者操控和摄像机飞行。点击切换。'
    },
    flySpeed: {
      label: '移动速度',
      title: '视口飞行速度 — WASD 移动与滚轮推拉',
      value: '{{value}} m/s'
    },
    framing: {
      twoShot: '双人',
      twoShotTitle: '双人镜头：并排容纳两个角色（选 3–4 个为群镜头）',
      ots: '过肩',
      otsTitle: '过肩：在近处角色身后，看向对方',
      rev: '反打',
      revTitle: '反打：摄像机绕主体旋转 180°',
      top: '俯拍',
      topTitle: '俯拍：正上方，容纳所有人',
      low: '低角',
      lowTitle: '低角：膝高，仰视主体',
      dutch: '荷兰角',
      dutchTitle: '荷兰角：倾斜地平线（再点翻转，再点水平）'
    },
    gizmo: {
      move: '⇄ 移动',
      moveTitle: '用 Gizmo 箭头移动选中项 (G)',
      rotate: '⟳ 旋转',
      rotateTitle: '旋转选中项 — 旋转人物、汽车、道具、摄像机 (R)'
    },
    tools: {
      playShot: '▶ 播放镜头',
      playShotTitle: '观看镜头：从开头通过镜头摄像机播放（设计画面，与导出完全一致）',
      lookThrough: '🎥 透视',
      lookThroughTitle: '透视镜头摄像机 (C)',
      camMark: '+ 镜头标记',
      camMarkTitle: '在当前视图放置镜头标记',
      marks: '+ 标记',
      marksTitle: '点击地面为选中项放置标记 (M)',
      recordPerformer: '● 录制表演者',
      recordCamera: '● 录制摄像机',
      stop: '■ 停止',
      recordPerformerTitle: '录制此角色/载具：用光标操控；其他动作在下方回放',
      recordCameraTitle: '录制摄像机：操控视口；现有走位在录制时回放',
      ground: '⬇ 贴地',
      groundTitle: '将选中项放置在下方物体上 — 地面、桌子、卡车货箱'
    },
    hints: {
      placingSequence: '点击地面在此布置 {{count}} 名表演者（面向你）· Esc 取消',
      placingAsset: '点击地面放置 · {{alt}}-点击放置多个 · Esc 取消',
      droppingMarksEntity: '点击地面按顺序放置标记 · 完成后 Esc',
      droppingMarksCamera: '点击地面放置镜头标记 · 或使用「在当前视图放置镜头标记」',
      multiSelect: '已选 {{count}} 个 — 拖动移动整组 · 在检查器中绑定 · ⌫ 全部删除',
      recordingPerformer: '● 录制中 — 将光标移到地面上；表演者跟随。■ 停止保存表演。',
      recordingCamera:
        '● 录制中 — WASD 移动、左键拖拽环顾、滚轮推拉；这就是镜头。■ 停止保存运动。',
      navigation: 'WASD 移动 · QE 升降 · Shift 加速 · 左键拖拽环顾 · 滚轮推拉'
    },
    shotPreview: {
      label: '镜头预览',
      cycleSizeTitle: '切换预览大小',
      hideTitle: '隐藏预览',
      showTitle: '显示实时镜头预览',
      preview: '🎥 预览',
      sizes: {
        small: 'S',
        medium: 'M',
        large: 'L'
      }
    },
    empty: {
      stage: '点击素材库项目，然后点击地面放置。',
      shoot: '选中演员或摄像机，按 M，然后点击地面放置标记。'
    }
  },
  reference: {
    ref: '🎞 参考',
    refTitle: '参考视频叠加 — 凭肉眼匹配现有镜头',
    opacity: '透明度 ({{percent}}%)',
    mode: '模式',
    ghostOverlay: '幽灵叠加',
    pip: '画中画',
    timeOffset: '时间偏移 ({{offset}}s)',
    remove: '移除参考',
    toastAttached: '参考已附加 — 对照它匹配走位。'
  },
  platform: {
    primaryModifierMac: '⌘',
    primaryModifier: 'Ctrl',
    alternateModifierMac: '⌥',
    alternateModifier: 'Alt',
    showInFolderLabelMac: '在 Finder 中显示',
    showInFolderLabel: '在文件夹中显示'
  },
  localeSwitch: {
    label: '语言',
    en: 'English',
    zhCN: '中文（简体）'
  }
} as const
