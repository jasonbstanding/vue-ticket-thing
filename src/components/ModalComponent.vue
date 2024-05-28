<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <button class="close-button" @click="close">×</button>
      <img :src="gig.image_lg" alt="Gig Image" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GigModal',
  props: {
    gig: {
      type: Object,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 80%;
  max-height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
