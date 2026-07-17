export const uiEn = {
  app: {
    name: 'BLOCKOUT',
    logoAlt: 'Blockout',
    modes: {
      stage: 'STAGE',
      shoot: 'SHOOT',
      deliver: 'DELIVER'
    },
    save: 'Save',
    help: '? Help',
    helpTitle: 'Help: quick start, how-do-I answers, shortcuts (?)',
    credits: {
      createdBy: 'Created by Sam Wasserman',
      openSource: 'Open source under Apache-2.0 — keep this credit when using or forking.'
    }
  },
  welcome: {
    tagline:
      'Stage a scene, choreograph camera and character blocking with marks, and export motion-reference packages for AI video generators.',
    newProject: 'New Project',
    openProject: 'Open Project…',
    tutorial: '? Tutorial'
  },
  help: {
    tabs: {
      quickStart: 'Quick start',
      tasks: 'How do I…?',
      shortcuts: 'Shortcuts'
    },
    done: 'Done',
    intro: {
      quickStart:
        'The whole app is three verbs: <b>STAGE</b> the scene, <b>SHOOT</b> the motion, <b>DELIVER</b> the reference package to your AI generator. Here\'s the whole thing at a glance.',
      shortcuts: 'Keyboard shortcuts — every action is undoable.'
    },
    cards: {
      stageYourSet: {
        emoji: '🏗',
        title: 'Stage your set',
        body: 'Drop an environment and people from the Library, then click the floor to place them.',
        then: 'then: label your leads and set the light.'
      },
      oneClickSequences: {
        emoji: '🎬',
        title: 'One-click sequences',
        body: 'Whole dance numbers, fights, and chases, already choreographed. Click the floor to place the cast.',
        then: 'then: every performer stays editable on their own.'
      },
      makeThemMove: {
        emoji: '🚶',
        title: 'Make them move',
        body: 'Select someone, press M and click marks. Or hit ● Record to puppeteer them with your cursor.',
        then: 'then: retime the pills on the timeline.'
      },
      animateTab: {
        emoji: '✨',
        title: 'Animate tab',
        body: 'Fights, dances, and sit / drink / jump moves for any character. One click lays them down.',
        then: 'then: tweak the pose marks like any other.'
      },
      frameAndMoveCamera: {
        emoji: '🎥',
        title: 'Frame & move the camera',
        body: 'Pick a framing, choose from 27 camera moves, or Track a subject so the aim locks on.',
        then: 'then: ▶ Play shot to see the exact export frame.'
      },
      deliver: {
        emoji: '📦',
        title: 'Deliver',
        body: 'Pick your generator and export the package: video, depth pass, stills, and a written prompt.',
        then: 'then: paste the prompt straight into the generator.'
      }
    },
    search: {
      placeholder: 'Search tasks — e.g. “fight”, “track a plane”, “720p”…',
      empty: 'No tasks match “{{query}}”.'
    },
    tasks: {
      stage: {
        area: 'Stage',
        items: {
          q1: 'How do I put a set and people in the scene?',
          a1: 'In <b>STAGE</b> mode, click a Library item (a person, prop, or a whole environment kit), then click the floor. Hold <kbd>{{alt}}</kbd> to place several; <kbd>Esc</kbd> cancels.',
          q2: 'How do I move, rotate, or duplicate something?',
          a2: 'Click to select, then drag the arrows to move. Press <kbd>R</kbd> to rotate, <kbd>G</kbd> back to move, <kbd>{{mod}}D</kbd> to duplicate, <kbd>⌫</kbd> to delete.',
          q3: 'How do I name a character for the AI generator?',
          a3: 'Select the person and type a label like <b>HERO</b> in the inspector, then pick a color. It floats above them, tints the model, and tells the generator who is who.',
          q4: 'How do I pose someone without animating?',
          a4: 'Use the inspector\'s <b>Pose</b> section — Stand, Sit, Crouch, Lie, Talk, Fallen. Open <b>Pose limbs</b> for 14 sliders to build fight or dance stances.',
          q5: 'How do I put a rider on a bike so they move together?',
          a5: 'Place the person, then choose <b>Marry to…</b> the bike in their inspector. Drag the bike and the rider comes along; <b>Unmarry</b> separates them.',
          q6: 'How do I move a whole crowd I placed?',
          a6: 'Marry every performer to one lead, then move that lead — the group follows. Or <kbd>⇧</kbd>-click them all and drag, since a multi-selection moves as one.',
          q7: 'How do I set the lighting?',
          a7: 'With nothing selected, the inspector shows the scene: pick a preset (Day, Golden hour, Night, Club…), drag the sun, add fog. Generators read light direction from your reference.',
          q8: 'How do I stage a scene from a photo?',
          a8: '<b>Populate from reference…</b> at the bottom of the Library stages people, poses, lighting, and a matching camera from an image. Needs a Claude API key; one <kbd>{{mod}}Z</kbd> undoes it all.',
          q9: 'How do I bring in my own 3D model?',
          a9: '<b>Import 3D Model…</b> in the Library loads a GLB/glTF and copies it into the project.',
          q10: 'How do I keep something out of the render but visible while I work?',
          a10: 'Select it and tick <b>Hide in exports</b> in the inspector. It stays in the editor but drops out of every rendered pass.'
        }
      },
      shoot: {
        area: 'Shoot',
        items: {
          q1: 'How do I make someone walk a path?',
          a1: 'In <b>SHOOT</b>, select them, press <kbd>M</kbd>, and click the floor to drop marks. They walk between marks on the timeline; select a mark to set its gait or hold.',
          q2: 'How do I puppeteer someone with my mouse instead?',
          a2: 'Select a character or vehicle and press <b>● Record performer</b> — steer with the cursor and the gait matches your speed. <b>■ Stop</b> saves; re-record to replace it.',
          q3: 'How do I make two people fight?',
          a3: 'Select a person, open the <b>Animate</b> tab, and Apply a fight move — it lays down editable pose marks at the playhead. Do the same on their opponent to trade blows.',
          q4: 'How do I make a character dance?',
          a4: 'Select them and Apply a dance from the <b>Animate</b> tab (hip-hop, salsa, moonwalk, breakdance…). Or in Stage, drop a whole <b>Dance number</b> sequence at once.',
          q5: 'How do I fly a plate across the room?',
          a5: 'Select any entity and Apply a flight from <b>Action presets</b>, or <b>● Record</b> it and use the <b>scroll wheel for altitude</b>. Set a mark\'s <b>Altitude</b> by hand later.',
          q6: 'How do I land a plane or topple a building?',
          a6: 'Aim the entity first, then Apply from <b>Action presets</b> — plane takeoff / landing / flyby, heli orbit, car chase moves, falling debris, building topple. The path starts from where it stands.',
          q7: 'How do I have someone board a bus or get off a plane?',
          a7: 'Select an actor\'s last mark and set <b>Board on arrival → the Bus</b>. To alight, marry them to a parked plane, then give them marks that start after it lands.',
          q8: 'How do I retime or delete a move on the timeline?',
          a8: 'Drag a pill to retime it, drag its right edge to add a hold. Click a <b>camera</b> pill to edit its settings, or press <kbd>Delete</kbd> to remove selected marks. <kbd>⇧</kbd>-click to multi-select pills.',
          q9: 'How do I make a whole choreographed group at once?',
          a9: 'In Stage, the <b>Sequences</b> box stages a full cast: Dance number, Fight, Foot chase, or Car chase. Set the count and style, and it drops them already choreographed.'
        }
      },
      camera: {
        area: 'Camera',
        items: {
          q1: 'How do I frame a shot?',
          a1: 'Select the camera and press <kbd>C</kbd> to look through it, then pick a shot size (WS/MS/CU) to auto-frame, or a framing (<b>2-SHOT / OTS / REV / TOP / LOW / DUTCH</b>).',
          q2: 'How do I move the camera during a shot?',
          a2: 'Frame it, drop <b>+ Cam mark</b>, move and reframe, drop another — it travels between marks. Pick a <b>rig</b> (dolly, steadicam, handheld, crane, drone) for the motion feel.',
          q3: 'How do I use one of the ready-made camera moves?',
          a3: 'The camera inspector has <b>27 moves</b> — orbits, cranes, drone follows, whip pan, vertigo dolly-zoom. One click lays down editable marks around your subject.',
          q4: 'How do I track a plane with the camera?',
          a4: 'Turn on <b>Track subject</b> in the camera inspector and pick the subject — the aim locks on no matter how it moves, and focus follows too.',
          q5: 'How do I fly the camera like an operator?',
          a5: 'Select the camera and press <b>● Record camera</b> — your blocking replays while you orbit, pan, and zoom the view, and your flight becomes the move, synced to the action.',
          q6: 'How do I add a second camera?',
          a6: '<b>Cameras (A/B/C)</b> at the top of the camera inspector: <b>+</b> adds Camera B with its own marks and rig. The chips switch between them; the export uses the active one.',
          q7: 'How do I watch exactly what will export?',
          a7: '<b>▶ Play shot</b> plays through the shot camera — the exact export frame. The <b>SHOT PREVIEW</b> box shows it live; <kbd>Space</kbd> plays, <kbd>1–9</kbd> jump to camera marks.',
          q8: 'How do I match an existing shot?',
          a8: '<b>🎞 Ref</b> ghosts any video (even a depth-map video) over the viewport, synced to your timeline — recreate its blocking by eye and adjust opacity and offset.',
          q9: 'How do I try a risky version without losing my shot?',
          a9: 'Hover the shot in the left rail and click <b>+ Draft</b> — it snapshots as "1A v1". Drafts play and export like shots; <b>▲</b> promotes one back to the real shot.'
        }
      },
      deliver: {
        area: 'Deliver',
        items: {
          q1: 'How do I export the package for my generator?',
          a1: 'In <b>DELIVER</b>, pick your target (Seedance, Veo, Kling, LTX, Wan…) and hit <b>Export shot package</b> — clean MP4, depth pass, stills, top-down diagram, and a written prompt.',
          q2: 'How do I get a 720p file for Seedance?',
          a2: 'Set <b>Resolution</b> to 720p in Deliver — that\'s what Seedance accepts for reference files. It applies to videos, stills, and animatics.',
          q3: 'How do I export just one frame?',
          a3: 'Scrub to the exact moment and click <b>📸 Export this frame</b> — it saves that single frame as a full-quality PNG.',
          q4: 'How do I control whether labels show in the export?',
          a4: 'Choose whether labels burn into the video, appear only in stills (the default), or stay out entirely — right in the Deliver panel.',
          q5: 'How do I stitch all my shots into one video?',
          a5: '<b>Animatic</b> stitches every shot in the scene into one video; <b>Contact sheet</b> makes a storyboard grid.',
          q6: 'How do I take the blocking into Blender?',
          a6: '<b>Export to Blender</b> writes a .glb with the animated camera and blocking, plus a one-click import script.'
        }
      },
      projects: {
        area: 'Projects',
        items: {
          q1: 'How do I save a set to reuse in another project?',
          a1: '<b>Stage Presets</b> save the current staging (set + characters + blocking) globally. Stage it as a fresh scene in any project; the original never changes.',
          q2: 'How do I shoot the same action from another angle?',
          a2: 'The scene owns the blocking and each shot owns its own camera, so make a <b>new shot</b> and just reframe — no need to redo the moves.',
          q3: 'How do I recover work after a crash?',
          a3: 'A backup autosaves every minute; after a crash, <b>Open Project</b> restores the unsaved work. A project is just a folder of readable JSON, safe to back up or git.',
          q4: 'How do I let an AI agent drive the app?',
          a4: 'Register <b>mcp/blockout-mcp.mjs</b> with Claude Code, Codex, or Hermes — the agent can stage scenes, frame shots, and screenshot the viewport. See AGENTS.md.'
        }
      }
    },
    shortcuts: {
      space: { keys: 'Space', description: 'Play / pause the shot' },
      m: { keys: 'M', description: 'Drop marks for the selection (click the floor)' },
      c: { keys: 'C', description: 'Look through the shot camera' },
      gR: { keys: 'G / R', description: 'Gizmo: move / rotate' },
      shiftClick: { keys: '⇧-click', description: 'Multi-select entities, or marks on the timeline' },
      modA: { keys: '{{mod}}A / ⇧{{mod}}A', description: 'Select all marks in the shot / in the current lane' },
      modD: { keys: '{{mod}}D', description: 'Duplicate selection' },
      delete: { keys: '⌫', description: 'Delete selection (all of a multi-selection)' },
      undoRedo: { keys: '{{mod}}Z / ⇧{{mod}}Z', description: 'Undo / redo — every action is undoable' },
      modS: { keys: '{{mod}}S', description: 'Save project' },
      jumpMarks: { keys: '1–9', description: 'Jump to camera mark N' },
      altClick: { keys: '{{alt}}-click', description: 'Place multiple copies while staging' },
      esc: { keys: 'Esc', description: 'Cancel placement / mark-dropping / selection' },
      help: { keys: '?', description: 'Open this help' }
    }
  },
  library: {
    stagePresets: {
      title: 'Stage Presets',
      emptyHint:
        'Save a staging you\'ll reuse — a dinner scene, a driving setup — and start from it in any project.',
      presetMeta: '{{count}} items · saved {{date}}',
      stage: 'Stage',
      stageTitle: 'Stage this preset as a NEW scene — the preset itself stays untouched',
      deleteTitle: 'Delete this preset',
      namePlaceholder: 'Preset name… e.g. Dinner scene',
      save: 'Save',
      saveCurrentTitle:
        'Save this scene\'s staging (set, characters, blocking) as a reusable preset available in every project',
      saveCurrent: '＋ Save current staging as preset'
    },
    sequences: {
      title: 'Sequences',
      type: 'Type',
      types: {
        dance: '💃 Dance number',
        fight: '🥊 Fight',
        footChase: '🏃 Foot chase',
        carChase: '🚗 Car chase'
      },
      performers: 'Performers',
      style: 'Style',
      placing: '⟳ Click the floor to place… (Esc cancels)',
      stagePerformers: '🎬 Stage {{count}} performers',
      stageTitle:
        'Arms placement — then click the floor exactly where you want the group. It stages there, facing the camera. Esc cancels. One undo step; every performer stays individually editable.'
    },
    searchPlaceholder: 'Search assets…',
    allCategories: 'All categories',
    showOneCategoryTitle: 'Show one category at a time',
    placeFromList: 'Place from list…',
    placeFromListTitle: 'Pick from the full list — then click the floor to place it',
    categories: {
      people: 'People',
      animals: 'Animals',
      vehicles: 'Vehicles',
      furniture: 'Furniture',
      props: 'Props',
      environment: 'Environments',
      primitives: 'Primitives'
    },
    expand: 'Expand',
    collapse: 'Collapse',
    populateFromReference: '✨ Populate from reference…',
    populateFromReferenceTitle:
      'Give Claude a reference photo or video frame — it stages the scene to match: people, furniture, poses, lighting, and a camera to match the framing',
    importModel: 'Import 3D Model…'
  },
  inspector: {
    tabs: {
      selection: 'Selection',
      selectionTitle: 'Show whatever is selected',
      camera: '🎥 Camera',
      cameraTitle:
        'Pin the camera controls: lens, position, aim, rig, moves, tracking — always here, no matter what\'s selected',
      animate: '✨ Animate',
      animateTitle:
        'Make the selection perform: fights, dances, sit/drink/jump, flights and drives — or restyle a whole selected group at once'
    },
    entityNotFound: 'Entity not found.',
    markNotFound: 'Mark not found.',
    animate: {
      title: '✨ Animate',
      animating: 'Animating: {{name}}',
      presetsHint: 'Presets drop editable marks at the playhead — apply, press ▶, then tweak any mark.',
      emptyHint:
        'Select a <b>character</b> to give them a fight move, a dance, a sit-down, a drink — or a <b>vehicle/prop</b> for takeoffs, chases, and falls.<br/><br/>⇧-click <b>several performers</b> (or stage a Sequence from the Library) and this tab restyles the whole group at once — swap the dance style, change everyone\'s move.',
      groupTitle: 'Animate {{count}} together',
      groupHint:
        'Replaces each performer\'s choreography in place — a staged sequence is just a starting point. One undo step.',
      everyonePerforms: 'Everyone performs ({{count}} people)',
      applyToAll: 'Apply to all {{count}}',
      everyoneTravels: 'Everyone travels ({{count}})',
      applyPathToAll: 'Apply path to all',
      applyPathToAllTitle:
        'Every selected performer gets this path from its own spot and facing — a convoy of takeoffs, a synchronized chase'
    },
    scene: {
      title: 'Scene',
      name: 'Name',
      stageHint: 'Click a library item, then click the floor to place it.',
      lighting: 'Lighting',
      lightingPresets: {
        day: 'Day',
        goldenHour: 'Golden',
        night: 'Night',
        interiorWarm: 'Warm Int',
        interiorCool: 'Cool Int',
        club: 'Club'
      },
      sunAzimuth: 'Sun azimuth',
      sunElevation: 'Sun elevation',
      fog: 'Fog'
    },
    shot: {
      title: 'Shot',
      duration: 'Duration (s)',
      aspect: 'Aspect',
      notes: 'Notes'
    },
    entity: {
      title: 'Entity',
      name: 'Name',
      x: 'X',
      y: 'Y',
      z: 'Z',
      rotation: 'Rotation°',
      scale: 'Scale ({{value}})',
      height: 'Height ({{value}})',
      build: 'Build ({{value}})',
      hideInExports: 'Hide in exports',
      label: 'Label',
      labelPlaceholder: 'Label text',
      blocking: 'Blocking',
      dropMarks: 'Drop marks (M)',
      markRow: 'Mark {{index}} — {{time}}s — {{gait}}',
      dangerZone: 'Danger zone',
      deleteEntity: 'Delete entity'
    },
    pose: {
      title: 'Pose',
      stand: 'Stand',
      sit: 'Sit',
      crouch: 'Crouch',
      lie: 'Lie',
      talk: 'Talk',
      fallen: 'Fallen',
      hint: 'The pose applies while the actor has no marks; marks override it with their own gait.',
      limbsSummary: 'Pose limbs (fight / dance blocking)',
      resetLimbs: 'Reset limbs',
      joints: {
        shoulderLX: 'L arm fwd',
        shoulderRX: 'R arm fwd',
        shoulderLZ: 'L arm out',
        shoulderRZ: 'R arm out',
        elbowL: 'L elbow',
        elbowR: 'R elbow',
        hipLX: 'L leg',
        hipRX: 'R leg',
        kneeL: 'L knee',
        kneeR: 'R knee',
        torsoX: 'Torso lean',
        torsoY: 'Torso twist',
        headY: 'Head turn',
        headX: 'Head nod',
        degrees: '{{label}} ({{deg}}°)'
      }
    },
    marriage: {
      title: 'Marriage',
      marriedTo: 'Married to {{name}}',
      marriedHint: 'Follows it everywhere. Drag this entity to adjust its riding offset.',
      unmarry: 'Unmarry',
      marryTo: 'Marry to…',
      chooseAnchor: '— choose an anchor —'
    },
    multiEntity: {
      selected: '{{count}} selected',
      marry: 'Marry',
      marryHint: 'The LAST selected is the anchor — the others will follow it.',
      marryTo: 'Marry to {{name}}',
      unmarrySelected: 'Unmarry selected',
      deleteEntities: 'Delete {{count}} entities'
    },
    motionPresets: {
      title: 'Motion presets',
      categories: {
        fight: 'Fight',
        dance: 'Dance',
        gesture: 'Gesture',
        stunt: 'Stunt'
      },
      apply: 'Apply',
      applyTitle: 'Insert the {{name}} move at the playhead as editable pose marks',
      durationSuffix: ' · {{duration}}s',
      toastApplied:
        '{{name}} from {{time}}s ({{count}} poses{{extendNote}}). Press ▶ to watch.',
      toastExtendNote: ' — extend the shot for the rest',
      toastNoRoom: 'No room before the end of the shot — move the playhead earlier.'
    },
    actionPresets: {
      title: 'Action presets',
      label: 'Flight, drive & stunt paths — starts at the playhead',
      apply: 'Apply action',
      toastNotEnoughRoom: 'Not enough shot left after the playhead — move it earlier.',
      toastApplied: '{{name}} from {{time}}s — ▶ to watch. Every mark stays editable.'
    },
    multiMark: {
      selected: '{{count}} marks selected',
      shiftTimes: 'Shift times',
      offset: 'Offset (s)',
      apply: 'Apply',
      deleteMarks: 'Delete {{count}} marks'
    },
    camera: {
      camerasTitle: 'Cameras (A/B/C)',
      addCamera: '+',
      addCameraTitle: 'Add a camera',
      title: 'Camera',
      sensor: 'Sensor',
      lens: 'Lens',
      autoFrame: 'Auto-frame subject',
      positionAim: 'Position & aim',
      positionAimMark: 'Position & aim — mark {{index}}/{{total}}',
      noMarksYet: 'No camera marks yet — drop one and these fields control it directly.',
      dropMarkAtView: '+ Drop camera mark at current view',
      height: 'Height',
      pan: 'Pan',
      tilt: 'Tilt',
      roll: 'Roll',
      lensMm: 'Lens',
      atTime: 'At time',
      positionAimHint:
        'Edits the mark at/before the playhead — scrub the timeline to reach a different mark.',
      trackSubject: 'Track subject',
      keepAimedAt: 'Keep the camera aimed at…',
      aimByMarksOff: '— aim by marks (off) —',
      trackSubjectTitle:
        'Aim lock: no matter how the camera position moves — marks, a recorded flight, a preset — it stays pointed at this subject. Drone tracking a plane, operator following an actor.',
      trackingOnHint:
        'Tracking on: move the camera any way you like — drop marks, record a flight, apply a move preset — the lens stays glued to the subject. Focus follows it too when a mark sets a focus distance.',
      movesTitle: 'Camera moves',
      movesLabel: '{{count}} classic moves — built around {{subject}}',
      yourSubject: 'your subject',
      aimLocksSuffix: ' Aim-locks onto the subject.',
      applyMove: 'Apply move',
      applyMoveTitle:
        'Replaces this camera\'s marks with the move (one undo step). Select an entity first to build the move around it; otherwise the first character is used.',
      rig: 'Rig',
      intensity: 'Intensity ({{value}})',
      mountTo: 'Mount to',
      none: '— none —',
      marks: 'Marks',
      dropMarkAtViewOrM: 'Drop camera mark at view (or M)',
      cameraMarkRow: 'Mark {{index}} — {{time}}s — {{focal}}mm',
      clearCameraMove: 'Clear camera move (delete all marks)'
    },
    mark: {
      title: 'Mark {{index}}',
      arrive: 'Arrive (s)',
      hold: 'Hold (s)',
      easeOut: 'Ease out ({{value}})',
      easeIn: 'Ease in ({{value}})',
      gait: 'Gait',
      altitude: 'Altitude (m) — 0 is the ground; raise it to fly',
      boardOnArrival: 'Board on arrival',
      boardAfterMark: 'After reaching this mark, ride…',
      boardTitle:
        'Boarding: walk to this mark, then attach to a vehicle/prop and move with it — step onto a bus and ride away',
      stayOnFoot: '— stay on foot —',
      optics: 'Optics',
      focalLength: 'Focal length (mm)',
      deepFocus: '∞ deep focus',
      focusDistance: 'Focus distance (m)',
      position: 'Position',
      deleteMark: 'Delete mark',
      poseAtMark: 'Pose at this mark',
      poseAtMarkHint:
        'Limbs blend from the previous mark\'s pose to this one while travelling — set different poses on successive marks to choreograph a move.',
      jointKeyframes: 'Joint keyframes',
      resetPoseAtMark: 'Reset pose at this mark'
    }
  },
  cameraMarkDialog: {
    title: 'Camera keyframe {{index}} — {{time}}s',
    close: 'Close',
    delete: 'Delete keyframe'
  },
  timeline: {
    resizeTitle: 'Drag to resize the timeline',
    camera: '🎥 CAMERA',
    laneSelectTitle: 'Click: select ALL marks in this lane (⌫ deletes them together)',
    dur: 'Dur',
    fps: 'fps',
    timeDisplay: 't={{time}}s / {{duration}}s',
    selectAll: 'Select all',
    selectAllTitle:
      'Select every mark on every lane ({{mod}}A) — then ⌫ deletes them all, or shift times together in the inspector',
    lineCrossingTitle:
      'The camera crosses the 180° line (the axis between your two lead characters) between these marks — screen direction will flip. Intentional crossings are fine; otherwise keep coverage on one side.',
    lineCrossing: '🎬 180° line crossed: cam mark {{from}} → {{to}}',
    speedWarning: '⚠ {{name}}: implied {{speed}} m/s — try {{suggestion}}',
    suggestionMoreTime: 'more time',
    emptyHint: 'Select the camera or an actor and press M, then click the floor to drop marks.',
    rulerTick: '{{t}}s'
  },
  projectRail: {
    title: 'Scenes & Shots',
    addScene: '+ Scene',
    sceneLabel: 'Scene {{number}} — {{name}}',
    addShotTitle: 'Add shot',
    deleteSceneTitle: 'Delete scene',
    addDraft: '+ Draft',
    addDraftTitle: 'Save current shot as a draft',
    duplicateShotTitle: 'Duplicate shot',
    deleteShotTitle: 'Delete shot',
    draftLabel: '└ {{name}}',
    promoteDraftTitle: 'Make this the shot',
    deleteDraftTitle: 'Delete draft',
    needOneScene: 'A project needs at least one scene.',
    needOneShot: 'A scene needs at least one shot.',
    shotDuration: '{{duration}}s'
  },
  deliver: {
    title: 'Deliver',
    titleWithScene: 'Deliver — {{scene}} / Shot {{shot}}',
    selectShot: 'Select a shot to export.',
    targetGenerator: 'Target generator',
    output: 'Output — {{width}}×{{height}} @ {{fps}}fps · {{aspect}}',
    passes: {
      clean: 'Clean',
      depth: 'Depth',
      normal: 'Normal'
    },
    resolution: 'Resolution',
    resolutionAuto: 'Auto',
    resolutionAutoTitle: 'The profile\'s native size',
    resolution720p: '720p',
    resolution720pTitle:
      '720p — what Seedance accepts for reference files. Applies to videos, stills, and animatics.',
    resolution1080p: '1080p',
    resolution1080pTitle: '1080p',
    labels: 'Labels',
    labelsInVideo: 'In video',
    labelsStillsOnly: 'Stills only',
    labelsOff: 'Off',
    progress: '{{label}} {{frame}}/{{total}}',
    cancel: 'Cancel',
    exportShotPackage: 'Export shot package',
    exportThisFrame: '📸 Export this frame (at playhead)',
    exportThisFrameTitle:
      'Export ONLY the frame at the playhead as a full-quality PNG — scrub to the exact moment you want first',
    revealLastExportMac: 'Reveal last export in Finder',
    showLastExport: 'Show last export in Folder',
    promptFor: 'Prompt for {{name}}',
    copyPrompt: 'Copy prompt',
    sceneTools: 'Scene tools',
    exportAnimatic: 'Export scene animatic ({{count}} shots)',
    exportContactSheet: 'Export contact sheet',
    exportBlender: 'Export to Blender (.glb)',
    durationWarning:
      '⚠ Shot is {{duration}}s but {{profile}} caps clips at {{max}}s — consider shortening.',
    toastExportComplete: 'Export complete.',
    toastExportFailed: 'Export failed: {{error}}',
    toastFrameExported: 'Frame exported.',
    toastFrameExportFailed: 'Frame export failed: {{error}}',
    toastPromptCopied: 'Prompt copied.',
    toastAnimaticExported: 'Animatic exported.',
    toastAnimaticFailed: 'Animatic failed: {{error}}',
    toastContactSheetExported: 'Contact sheet exported.',
    toastContactSheetFailed: 'Contact sheet failed: {{error}}',
    toastBlenderExported: 'Blender package exported (.glb + import script).',
    toastGltfFailed: 'glTF export failed: {{error}}'
  },
  viewport: {
    hud: {
      lens: 'LENS',
      lensTitle: 'Focal length (click to cycle)',
      aspect: 'AR',
      aspectTitle: 'Aspect ratio (click to cycle)',
      duration: 'DUR',
      durationTitle: 'Shot duration — edit in the timeline',
      fps: 'FPS',
      fpsTitle: 'Frame rate',
      marks: 'MARKS',
      marksTitle: 'Camera marks in this shot',
      lensValue: '{{value}}mm'
    },
    shotSizes: {
      ws: 'WS',
      fs: 'FS',
      ms: 'MS',
      mcu: 'MCU',
      cu: 'CU',
      autoFrameTitle: 'Auto-frame: {{name}}'
    },
    recordControl: {
      precise: '🎯 Precise',
      normal: '✋ Normal',
      fast: '⚡ Fast',
      title:
        'Recording control: Precise = heavy smoothing + speed cap (slow, exact moves), Normal = balanced, Fast = raw and quick. Applies to performer puppeteering AND camera flying. Click to cycle.'
    },
    flySpeed: {
      label: 'Speed',
      title: 'Viewport fly speed — WASD movement and scroll-wheel dolly',
      value: '{{value}} m/s'
    },
    framing: {
      twoShot: '2-SHOT',
      twoShotTitle:
        'Two-shot: fit the two characters side by side (select 3–4 for a group shot)',
      ots: 'OTS',
      otsTitle: 'Over-the-shoulder: behind the near character, looking at the other',
      rev: 'REV',
      revTitle: 'Reverse angle: swing the camera 180° around the subjects',
      top: 'TOP',
      topTitle: 'Overhead: straight down, fitting everyone in frame',
      low: 'LOW',
      lowTitle: 'Low angle: knee height, looking up at the subject',
      dutch: 'DUTCH',
      dutchTitle: 'Dutch angle: tilt the horizon (click again to flip, again to level)'
    },
    gizmo: {
      move: '⇄ Move',
      moveTitle: 'Move the selection with the gizmo arrows (G)',
      rotate: '⟳ Rotate',
      rotateTitle: 'Rotate the selection — spin people, cars, props, the camera (R)'
    },
    tools: {
      playShot: '▶ Play shot',
      playShotTitle:
        'Watch the shot: plays from the top through the shot camera (the designed frame, exactly as it will export)',
      lookThrough: '🎥 Look through',
      lookThroughTitle: 'Look through the shot camera (C)',
      camMark: '+ Cam mark',
      camMarkTitle: 'Drop a camera mark at the current view',
      marks: '+ Marks',
      marksTitle: 'Drop marks for the selection by clicking the floor (M)',
      recordPerformer: '● Record performer',
      recordCamera: '● Record camera',
      stop: '■ Stop',
      recordPerformerTitle:
        'Record THIS character/vehicle: puppeteer it with the cursor; other motion replays underneath',
      recordCameraTitle:
        'Record the camera: fly the viewport; existing blocking replays while you record',
      ground: '⬇ Ground',
      groundTitle: 'Rest the selection on whatever is beneath it — floor, table, truck bed'
    },
    hints: {
      placingSequence:
        'Click the floor to stage {{count}} performers there (facing you) · Esc to cancel',
      placingAsset:
        'Click the floor to place · {{alt}}-click to place multiple · Esc to cancel',
      droppingMarksEntity: 'Click the floor to drop marks in order · Esc when done',
      droppingMarksCamera:
        'Click the floor to drop a camera mark · or use “Drop camera mark at view”',
      multiSelect:
        '{{count}} selected — drag moves the group · Marry in the inspector · ⌫ deletes all',
      recordingPerformer:
        '● REC — move the cursor over the floor; the performer chases it. ■ Stop saves the performance.',
      recordingCamera:
        '● REC — fly with WASD, look with LMB drag, dolly with wheel; this is the shot. ■ Stop saves the move.',
      navigation: 'WASD move · QE up/down · Shift faster · LMB drag look · wheel dolly'
    },
    shotPreview: {
      label: 'SHOT PREVIEW',
      cycleSizeTitle: 'Cycle preview size',
      hideTitle: 'Hide preview',
      showTitle: 'Show the live shot preview',
      preview: '🎥 Preview',
      sizes: {
        small: 'S',
        medium: 'M',
        large: 'L'
      }
    },
    empty: {
      stage: 'Click a library item, then click the floor to place it.',
      shoot: 'Select an actor or the camera, press M, then click the floor to drop marks.'
    }
  },
  reference: {
    ref: '🎞 Ref',
    refTitle: 'Reference video underlay — match an existing shot by eye',
    opacity: 'Opacity ({{percent}}%)',
    mode: 'Mode',
    ghostOverlay: 'Ghost overlay',
    pip: 'PiP',
    timeOffset: 'Time offset ({{offset}}s)',
    remove: 'Remove reference',
    toastAttached: 'Reference attached — match your blocking against it.'
  },
  platform: {
    primaryModifierMac: '⌘',
    primaryModifier: 'Ctrl',
    alternateModifierMac: '⌥',
    alternateModifier: 'Alt',
    showInFolderLabelMac: 'Reveal in Finder',
    showInFolderLabel: 'Show in Folder'
  },
  localeSwitch: {
    label: 'Language',
    en: 'English',
    zhCN: '中文（简体）'
  }
} as const
