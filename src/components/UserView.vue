
<script setup>

  import { computed, defineProps, reactive } from 'vue';
  import { Storage } from 'aws-amplify';
  
  const props = defineProps(['user', 'signOut'])

  const state = reactive({
    isUploading: false,
    notificationText: ''
  })

  const isDriver = computed(() => {
    return props.user.attributes['custom:is_driver'] == '1'
  })

  const userType = computed(() => {
    return isDriver.value ? 'Driver' : 'Customer'
  })

  const hasNotification = computed(() => {
    return state.notificationText != ''
  })

  const pushNotification = (text) => {
    state.notificationText = text

    setTimeout(() => {
      state.notificationText = ''
    }, 3000)
  }

  async function onChange(e) {
    const file = e.target.files[0];
    var uuid = require("uuid");
    var id = uuid.v4();

    try {
      state.isUploading = true

      const filenameComponents = file.name.split(/\.(?=[^.]+$)/);
      const filename = filenameComponents.length > 1 ? filenameComponents[0] : 'no_filename'
      const extension = filenameComponents[filenameComponents.length - 1]

      await Storage.put(`${filename}_${id}.${extension}`, file);

      pushNotification('File uploaded successfully.')
    } catch (error) {
      pushNotification('There was an error uploading your file. Try again later.')
      throw error
    } finally {
      state.isUploading = false
    }
  }

</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');

.user-box {
  margin: 0 auto;
  max-width: 20em;
  width: calc(100vw - 4em);
  border-radius: 0.2em;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  text-align: center;
  padding: 2em;
  font-family: 'Varela Round', sans-serif;
  color: #383844;
}

.user-box[loading='true'] {
  pointer-events: none;
  opacity: 0.7;
  filter: saturate(0);
}

.user-box .user-type {
  margin: 0;
  font-weight: normal;
}

.user-box .buttons {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.user-box h1 {
  margin: 0;
}

.user-box hr {
  margin: 2em auto;
  width: 80%;
  border-bottom: 0;
}

.user-box button,
.user-box .button {
  border: none;
  padding: 0.5em 2em;
  border-radius: 0.5em;
  background-color: #f9d9d970;
  color: #7b3f3f;
  font-weight: bold;
  font-family: 'Varela Round', sans-serif;
  cursor: pointer;
  user-select: none;

  transition: 100ms background-color, 100ms color;
}

.user-box button:hover,
.user-box .button:hover {
  color: #6f2525;
  background-color: #ff5e5ea1;
}

.user-box input[type='file'] {
  display: none;
}

.notification-box {
  display: block;
  width: 20em;
  margin: 2em auto;
  background: white;
  padding: 1em;
  border-radius: 0.5em;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  background: #8ecaff;
  color: #33628a;
  text-align: center;
  font-weight: bold;
}

</style>

<template>
  <div style="padding: var(--amplify-space-large); text-align: center">
    <img class="amplify-image" alt="Nüber logo" src="../assets/nuber-light.svg" />
  </div>
  <div class="user-box" :loading="state.isUploading">
    <h3 class="user-type">{{ userType }}</h3>
    <h1>Welcome back, {{ props.user.attributes.name }}!</h1>
    <hr>
    <div class="buttons">
      <label class='button' for="file-upload" v-if="isDriver">Upload File</label>
      <input type="file" id="file-upload" v-if="isDriver" @change="onChange"/>
      <button @click="props.signOut">Sign Out</button>
    </div>
  </div>
  <div class='notification-box' v-if="hasNotification">
    {{ state.notificationText }}
  </div>
</template>
