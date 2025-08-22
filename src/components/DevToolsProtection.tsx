import React, { useEffect } from 'react';

const DevToolsProtection: React.FC = () => {
  useEffect(() => {
    let devToolsDetected = false;
    let detectionInterval: NodeJS.Timeout;
    let resizeTimeout: NodeJS.Timeout;
    let initialLoadComplete = false;

    // Allow initial page load without interference
    const initialLoadTimer = setTimeout(() => {
      initialLoadComplete = true;
    }, 3000); // Give 3 seconds for normal page load

    // Immediate website closure function
    const closeWebsiteImmediately = () => {
      if (devToolsDetected || !initialLoadComplete) return; // Prevent multiple closures and during initial load
      devToolsDetected = true;

      try {
        // Show warning message briefly
        document.body.innerHTML = '<div style="background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; font-size: 24px; flex-direction: column;"><div>🚫 Developer Tools Detected</div><div style="font-size: 16px; margin-top: 20px;">Redirecting...</div></div>';
        
        // Try to close the tab first
        setTimeout(() => {
          window.close();
        }, 500);
        
        // If close doesn't work, reload to homepage
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        
        // If redirect doesn't work, try reload
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
        // Final fallback - redirect to blank page
        setTimeout(() => {
          window.location.replace('about:blank');
        }, 2000);
        
        // Ultimate fallback - clear page
        setTimeout(() => {
          document.documentElement.innerHTML = '<html><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;">🚫 Access Denied</body></html>';
        }, 2500);
      } catch (e) {
        // If all else fails, try basic reload
        try {
          window.location.reload();
        } catch (err) {
          document.documentElement.innerHTML = '';
        }
      }
    };

    // Method 1: Console detection using element inspection (less aggressive)
    const detectConsoleOpen = () => {
      if (!initialLoadComplete) return false;
      
      const element = document.createElement('div');
      let consoleOpen = false;

      Object.defineProperty(element, 'id', {
        get: function() {
          consoleOpen = true;
          return 'console-detected';
        }
      });

      // This will trigger the getter if console is open and inspecting
      try {
        console.log('%c', element);
        console.clear(); // Clear evidence
      } catch (e) {
        // Ignore errors during detection
      }
      
      return consoleOpen;
    };

    // Method 2: Window size detection for dev tools panel (more lenient)
    const detectDevToolsPanel = () => {
      if (!initialLoadComplete) return false;
      
      const widthThreshold = 200; // Increased threshold to avoid false positives
      const heightThreshold = 200; // Increased threshold to avoid false positives
      
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      // Check if there's a significant difference indicating dev tools panel
      // Also check if window is reasonably sized (not minimized or very small)
      return (widthDiff > widthThreshold || heightDiff > heightThreshold) && 
             window.innerWidth > 300 && window.innerHeight > 300;
    };

    // Method 3: Debugger statement detection (more careful)
    const detectDebuggerOpen = () => {
      if (!initialLoadComplete) return false;
      
      const start = performance.now();
      
      try {
        // This will pause execution if dev tools are open
        debugger;
      } catch (e) {
        // Ignore errors
      }
      
      const end = performance.now();
      
      // If dev tools are open, this will take much longer
      // Increased threshold to avoid false positives
      return (end - start) > 200;
    };

    // Method 4: Function toString inspection detection (safer)
    const detectFunctionInspection = () => {
      if (!initialLoadComplete) return false;
      
      let inspectionDetected = false;
      
      const testFunction = function() { return 'test'; };
      const originalToString = testFunction.toString;
      
      testFunction.toString = function() {
        inspectionDetected = true;
        return originalToString.call(this);
      };
      
      // Trigger inspection
      try {
        console.log(testFunction);
        console.clear();
      } catch (e) {
        // Ignore errors
      }
      
      // Restore original
      testFunction.toString = originalToString;
      
      return inspectionDetected;
    };

    // Method 5: DevTools object detection (safe)
    const detectDevToolsObject = () => {
      if (!initialLoadComplete) return false;
      
      // Check for common dev tools objects/properties
      return !!(
        window.devtools ||
        window.chrome?.devtools ||
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__
      );
    };

    // Main detection function (more conservative)
    const runDevToolsDetection = () => {
      if (devToolsDetected || !initialLoadComplete) return;

      let detectionScore = 0;
      const detectionMethods = [
        detectConsoleOpen,
        detectDevToolsPanel,
        detectDebuggerOpen,
        detectFunctionInspection,
        detectDevToolsObject
      ];

      // Run all detection methods
      detectionMethods.forEach(method => {
        try {
          if (method()) {
            detectionScore++;
          }
        } catch (e) {
          // If method fails, it might indicate dev tools interference
          detectionScore += 0.3; // Reduced penalty for errors
        }
      });

      // Require higher confidence before closing (at least 3 methods must detect)
      if (detectionScore >= 3) {
        closeWebsiteImmediately();
      }
    };

    // Keyboard shortcut detection (immediate response)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (devToolsDetected || !initialLoadComplete) return;

      const isDevToolsShortcut = (
        e.key === 'F12' ||
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.metaKey && e.shiftKey && e.keyCode === 73) || // Cmd+Shift+I (Mac)
        (e.metaKey && e.shiftKey && e.keyCode === 74) || // Cmd+Shift+J (Mac)
        (e.metaKey && e.shiftKey && e.keyCode === 67) || // Cmd+Shift+C (Mac)
        (e.metaKey && e.keyCode === 85) // Cmd+U (Mac)
      );

      if (isDevToolsShortcut) {
        e.preventDefault();
        e.stopPropagation();
        
        // Immediately trigger closure when dev tools shortcut is pressed
        console.warn('🚫 Developer tools shortcut detected');
        setTimeout(() => {
          closeWebsiteImmediately();
        }, 200); // Quick response to shortcuts
        
        return false;
      }
    };

    // Right-click detection (less aggressive)
    const handleRightClick = (e: MouseEvent) => {
      if (!initialLoadComplete) return true;
      
      e.preventDefault();
      
      // Check if dev tools might be opened via right-click after a longer delay
      setTimeout(() => {
        runDevToolsDetection();
      }, 1000); // Longer delay for right-click detection
      
      return false;
    };

    // Window resize detection (more lenient)
    const handleResize = () => {
      if (devToolsDetected || !initialLoadComplete) return;
      
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        runDevToolsDetection();
      }, 1000); // Longer delay for resize detection
    };

    // Window focus detection (less frequent)
    const handleFocus = () => {
      if (devToolsDetected || !initialLoadComplete) return;
      
      setTimeout(() => {
        runDevToolsDetection();
      }, 800); // Longer delay for focus detection
    };

    // Disable text selection and drag (keep this for protection)
    const addProtectionStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          -webkit-touch-callout: none !important;
        }
        
        input, textarea, [contenteditable="true"] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `;
      document.head.appendChild(style);
      return style;
    };

    // Set up all event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleRightClick, true);
    window.addEventListener('resize', handleResize);
    window.addEventListener('focus', handleFocus);

    // Add protection styles
    const styleElement = addProtectionStyles();

    // Start continuous detection (less frequent and only after initial load)
    detectionInterval = setInterval(() => {
      if (!devToolsDetected && initialLoadComplete) {
        runDevToolsDetection();
      }
    }, 2000); // Check every 2 seconds for better detection
    
    // Add visibility change detection (when user switches tabs)
    const handleVisibilityChange = () => {
      if (devToolsDetected || !initialLoadComplete) return;
      
      if (!document.hidden) {
        // When user comes back to tab, check for dev tools
        setTimeout(() => {
          runDevToolsDetection();
        }, 500);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Don't run initial detection immediately - wait for page to load
    // Remove the immediate detection that was causing issues

    // Detect if running in iframe (keep this check)
    if (window.self !== window.top) {
      setTimeout(() => {
        if (initialLoadComplete) {
          closeWebsiteImmediately();
        }
      }, 2000);
    }

    // Cleanup function
    return () => {
      clearTimeout(initialLoadTimer);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleRightClick, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focus', handleFocus);
      
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
      
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  return null;
};

export default DevToolsProtection;