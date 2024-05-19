<template>
    <div class="modal" @click.self="close">
      <div class="modal-content">
        <img :src="gig.image_lg" alt="Gig Image" />
        <button @click="close">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ModalComponent',
    props: {
      gig: Object
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    max-width: 80%;
    max-height: 80%;
  }
  .modal-content img {
    width: 100%;
    height: auto;
  }
  </style>
  