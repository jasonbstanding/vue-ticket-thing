<template>
  <div class="spinner" aria-label="Loading…">
    <div class="ring ring-1"></div>
    <div class="ring ring-2"></div>
    <div class="ring ring-3"></div>
    <div class="ring ring-4"></div>
    <div class="ring ring-5"></div>
  </div>
</template>

<style scoped>
.spinner {
  position: relative;
  width: 65px;
  height: 65px;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: spin linear infinite;
}

/* Concentric rings at increasing sizes, decreasing speeds — semipolar style */
.ring-1 { inset: 0;      border-top-color: #6366f1; animation-duration: 2.0s; }
.ring-2 { inset: 8px;    border-top-color: #818cf8; animation-duration: 1.7s; animation-direction: reverse; }
.ring-3 { inset: 16px;   border-top-color: #a5b4fc; animation-duration: 1.4s; }
.ring-4 { inset: 24px;   border-top-color: #c7d2fe; animation-duration: 1.1s; animation-direction: reverse; }
.ring-5 { inset: 32px;   border-top-color: #e0e7ff; animation-duration: 0.8s; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
