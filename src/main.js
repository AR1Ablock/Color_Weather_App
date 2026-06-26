import { createApp } from 'vue'
import App from './App.vue'
// Import your router, store, etc. if you have them

const app = createApp(App)

// ========================
// Global Vue Error Handler
// ========================
app.config.errorHandler = (err, vm, info) => {
    console.error('[Global Vue Error Handler]', {
        error: err,
        component: vm,
        info: info  // e.g. "setup", "render", "mounted", etc.
    });

    // Optional: Send to logging service (Sentry, LogRocket, etc.)
    // reportErrorToService(err, info);
};

// ========================
// Global Window Error Handler (for errors outside Vue)
// ========================
window.onerror = function (message, source, lineno, colno, error) {
    console.error('[Window Error Handler]', {
        message,
        source,
        line: lineno,
        column: colno,
        error
    });
};

// Optional: Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', {
        reason: event.reason,
        promise: event.promise
    });
});

// Mount the app
app.mount('#app')