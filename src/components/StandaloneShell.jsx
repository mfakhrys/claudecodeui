import React, { useState, useCallback } from 'react';
import Shell from './Shell.jsx';

/**
 * Generic Shell wrapper that can be used in tabs, modals, and other contexts.
 * Provides a flexible API for both standalone and session-based usage.
 *
 * @param {Object} project - Project object with name, fullPath/path, displayName
 * @param {Object} session - Session object (optional, for tab usage)
 * @param {string} command - Initial command to run (optional)
 * @param {boolean} isPlainShell - Use plain shell mode vs Claude CLI (default: auto-detect)
 * @param {boolean} autoConnect - Whether to auto-connect when mounted (default: true)
 * @param {function} onComplete - Callback when process completes (receives exitCode)
 * @param {function} onClose - Callback for close button (optional)
 * @param {string} title - Custom header title (optional)
 * @param {string} className - Additional CSS classes
 * @param {boolean} showHeader - Whether to show custom header (default: true)
 * @param {boolean} compact - Use compact layout (default: false)
 * @param {boolean} minimal - Use minimal mode: no header, no overlays, auto-connect (default: false)
 */
function StandaloneShell({
  project,
  session = null,
  command = null,
  isPlainShell = null,
  autoConnect = true,
  onComplete = null,
  onClose = null,
  title = null,
  className = "",
  showHeader = true,
  compact = false,
  minimal = false
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  const shouldUsePlainShell = isPlainShell !== null ? isPlainShell : (command !== null);

  const handleProcessComplete = useCallback((exitCode) => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete(exitCode);
    }
  }, [onComplete]);

  // Validate project has a valid path
  const projectPath = project?.fullPath || project?.path;
  if (!project) {
    return (
      <div className={`h-full flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-center text-gray-400 dark:text-gray-500">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-800 dark:bg-gray-950 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-300">No Project Selected</h3>
          <p className="mb-6 text-gray-500">Please select a project from the sidebar to use the terminal</p>
          <div className="inline-block px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-400">
            Click on a project name in the left sidebar to get started
          </div>
        </div>
      </div>
    );
  }

  if (!projectPath) {
    return (
      <div className={`h-full flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-center text-gray-400">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-red-400">Invalid Project Path</h3>
          <p className="mb-2 text-gray-500">The selected project "{project.name || project.displayName || 'Unknown'}" has no valid path configured.</p>
          <p className="text-sm text-gray-600">Please reconfigure this project in Settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full flex flex-col ${className}`}>
      {/* Optional custom header */}
      {!minimal && showHeader && title && (
        <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-200">{title}</h3>
              {isCompleted && (
                <span className="text-xs text-green-400">(Completed)</span>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Shell component wrapper */}
      <div className="flex-1 w-full min-h-0">
        <Shell
          selectedProject={project}
          selectedSession={session}
          initialCommand={command}
          isPlainShell={shouldUsePlainShell}
          onProcessComplete={handleProcessComplete}
          minimal={minimal}
          autoConnect={minimal ? true : autoConnect}
        />
      </div>
    </div>
  );
}

export default StandaloneShell;