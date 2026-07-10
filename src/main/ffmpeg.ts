import { spawn, type ChildProcess } from 'child_process'
import { access } from 'fs/promises'
import { join, win32 } from 'path'

export function platformFfmpegCandidates(
  platform: NodeJS.Platform = process.platform,
  env: NodeJS.ProcessEnv = process.env
): string[] {
  if (platform === 'darwin') {
    return ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/usr/bin/ffmpeg']
  }
  if (platform === 'win32') {
    return [
      env.ProgramFiles ? win32.join(env.ProgramFiles, 'ffmpeg', 'bin', 'ffmpeg.exe') : '',
      env['ProgramFiles(x86)'] ? win32.join(env['ProgramFiles(x86)'], 'ffmpeg', 'bin', 'ffmpeg.exe') : '',
      env.ChocolateyInstall ? win32.join(env.ChocolateyInstall, 'bin', 'ffmpeg.exe') : '',
      'C:\\ffmpeg\\bin\\ffmpeg.exe'
    ].filter(Boolean)
  }
  return ['/usr/local/bin/ffmpeg', '/usr/bin/ffmpeg']
}

export async function resolveFfmpeg(): Promise<string> {
  if (process.env.BLOCKOUT_FFMPEG?.trim()) return process.env.BLOCKOUT_FFMPEG.trim()
  if ((process.platform === 'win32' || process.platform === 'darwin') && process.resourcesPath) {
    const executable = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
    const packagedPath = join(process.resourcesPath, 'ffmpeg', executable)
    try {
      await access(packagedPath)
      return packagedPath
    } catch {
      // Development/source run; continue through the fallback chain.
    }
  }
  for (const candidate of platformFfmpegCandidates()) {
    try {
      await access(candidate)
      return candidate
    } catch {
      // Continue to the next platform candidate.
    }
  }
  return process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
}

export function friendlyFfmpegError(error: unknown): string {
  if (/ENOENT/i.test(String(error))) {
    return 'FFmpeg is unavailable. Reinstall Blockout or set BLOCKOUT_FFMPEG to a valid executable.'
  }
  return error instanceof Error ? error.message : String(error)
}

function waitForClose(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve()
  return new Promise((resolve) => child.once('close', () => resolve()))
}

/** Terminate the complete encoder process tree and wait for file handles to close. */
export async function terminateProcessTree(child: ChildProcess): Promise<void> {
  const closed = waitForClose(child)
  if (child.exitCode === null && child.signalCode === null && process.platform === 'win32' && child.pid) {
    await new Promise<void>((resolve) => {
      const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true
      })
      killer.once('close', () => resolve())
      killer.once('error', () => {
        child.kill('SIGKILL')
        resolve()
      })
    })
  } else if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL')
  }
  await closed
}
