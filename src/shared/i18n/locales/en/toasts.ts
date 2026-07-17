export const toastsEn = {
  couldNotOpenProject: 'Could not open project: {{message}}',
  marksDeleted: 'Mark deleted.',
  marksDeletedMany: 'Deleted {{count}} marks.',
  editingLockedDuringExport: 'Editing is locked while an export is running.',
  marriedToAnchor: 'Married {{count}} to the anchor — they now move together.',
  marriageCycleSkipped: 'Skipped a marriage that would loop back on itself.',
  unmarried: 'Unmarried — they move independently again.',
  cameraAdded:
    'Camera {{label}} added — frame it and drop marks. Switch cameras with the A/B chips.',
  cameraMoveCleared: 'Camera move cleared — record or drop new marks.',
  draftSaved: 'Saved as draft "{{name}}" — keep experimenting safely.',
  draftPromoted: 'Draft promoted — it is now the shot.',
  recordingStopped:
    'Recording stopped — {{count}} mark{{countSuffix}} saved. Scrub the timeline to review.',
  restyledPerformers: 'Restyled {{count}} performer{{countSuffix}} — ▶ to watch.',
  stylePeopleOnly: 'That style applies to people — select characters.',
  appliedPreset: 'Applied {{name}} to {{count}} performer{{countSuffix}}.',
  presetSaved: 'Preset "{{name}}" saved — reuse it from the Library in any project.',
  presetSaveFailed: 'Could not save preset: {{error}}',
  presetNotFound: 'Preset not found — it may have been deleted.',
  presetCorrupted: 'Preset file is corrupted.',
  presetStaged: 'Staged "{{name}}" as a new scene — the original preset is untouched.',
  noProjectJson: 'No project.json found in that folder.',
  restoredFromBackup: 'Restored unsaved work from the autosave backup — Save to keep it.',
  recoveredFromBackup: 'Recovered from autosave backup.',
  presetDeleted: 'Preset "{{name}}" deleted.',
  openProjectBeforeImport: 'Open or save a project before importing models.',
  importedModel: 'Imported {{name}}',
  importFailed: 'Import failed: {{message}}',
  couldNotLoadModel: 'Could not load model: {{message}}',
  stagedFromReference: 'Staged {{count}} elements from the reference.{{camNote}} {{notes}}',
  stagedFromReferenceCamNote:
    ' Camera Mark 1 set to match the reference framing — check the shot preview.',
  analyzingReference: 'Analyzing reference with Claude — this takes ~30–90 seconds…',
  performersStaged:
    '{{count}} performers staged and choreographed — ▶ to watch. Drag the group to reposition; every performer stays individually editable.',
  selectToSnapGround: 'Select something to snap to the ground first.',
  placeSubjectFirst: 'Place a subject first, then auto-frame.',
  placeCharacterFirst: 'Place at least one character first.',
  dutchHorizonLevel: 'Horizon level',
  dutchRight: 'Dutch right',
  dutchLeft: 'Dutch left',
  otsNeedsTwoCharacters: 'Over-the-shoulder needs two characters — select both.',
  twoShotNeedsTwo: 'A two-shot needs two characters — select them first.',
  placeSubjectForCameraMove: 'Place a subject first — camera moves are built around one.',
  cameraMoveApplied: '{{preset}} on {{subject}} — ▶ to watch, then drag any mark to adjust.',
  recordingCameraPlaybackSync:
    'Recording camera — the blocking replays while you fly the viewport. Stops at the end of the shot.',
  recordingCameraFree:
    'Recording — fly the viewport; the shot camera follows. Click ■ to stop.',
  recordingPerformerPlaybackSync:
    'Recording performance — steer with the cursor while the rest replays. Scroll = altitude.',
  recordingPerformerFree:
    'Recording performance — steer with the cursor; scroll wheel raises/lowers it (fly a plate, a plane, debris). Click ■ to stop.',
  recordingTooShort: 'Recording too short — nothing saved.',
  cameraRecorded:
    'Recorded {{length}}s — playing back your shot. Press C to exit the camera view.',
  performanceRecorded:
    'Performance recorded — {{count}} marks over {{length}}s. Now select the camera and ● Record to fly it while this replays.',
  motionApplied:
    '{{name}} from {{time}}s ({{count}} poses{{extendNote}}). Press ▶ to watch.',
  motionExtendNote: ' — extend the shot for the rest',
  motionNoRoom: 'No room before the end of the shot — move the playhead earlier.',
  actionNotEnoughRoom: 'Not enough shot left after the playhead — move it earlier.',
  actionApplied: '{{name}} from {{time}}s — ▶ to watch. Every mark stays editable.',
  unknownError: 'unknown error'
}
