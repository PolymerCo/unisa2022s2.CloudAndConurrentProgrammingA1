<script setup>
  import { 
    Authenticator,
    AuthenticatorSignUpFormFields
  } from '@aws-amplify/ui-vue';

  import { reactive } from 'vue';
  import { Auth } from 'aws-amplify';
  import '@aws-amplify/ui-vue/styles.css';
  import UserView from './components/UserView.vue';

  const state = reactive({
    isDriver: false
  })

  const fieldConfig = {
    signIn: {
      username: {
        labelHidden: false,
        label: "Email",
        placeholder: 'Enter your email',
      }
    },
    signUp: {
      name: {
        order: -1
      },
      email: {
        required: false,
        hidden: true
      },
      password: {
        labelHidden: false,
        label: "Password"
      }
    }
  }

  const services = {
    async handleSignUp(formData) {
      let { username, password, attributes } = formData;
      
      username = username.toLowerCase();
      attributes['custom:is_driver'] = state.isDriver ? '1' : '0';

      return Auth.signUp({
        username,
        password,
        attributes,
      });
    },
  };
</script>

<style>

  .amplify-heading {
    text-align: center;
    padding: 1em 0 0;
    font-size: 2em;
  }

  .nuber-em {
    color: #ff1616;
  }

  .amplify-image {
    height: 10em;
  }

</style>

<template>
  <header>
    
  </header>
  <authenticator :services="services" :form-fields="fieldConfig">
    <template v-slot="{ user, signOut }">
      <UserView :user="user" :signOut="signOut" />
    </template>

    <template v-slot:header>
      <div style="padding: var(--amplify-space-large); text-align: center">
        <img
          class="amplify-image"
          alt="Nüber logo"
          src="./assets/nuber-light.svg"
        />
      </div>
    </template>

    <template v-slot:sign-up-fields>
      <authenticator-sign-up-form-fields />
      <div class="custom-input-field">
        <label for="isDriverCheck">Are you signing up as a driver?</label>
        <input type="checkbox" v-model="state.isDriver" id="isDriverCheck"/>
      </div>
    </template>

    <template v-slot:sign-in-header>
      <h3 class="amplify-heading">
        Sign in to <span class='nuber-em'>Nüber</span>
      </h3>
    </template>

    <template v-slot:sign-up-header>
      <h3 class="amplify-heading">
        Sign up to <span class='nuber-em'>Nüber</span>
      </h3>
    </template>
  </authenticator>
  <footer>

  </footer>
</template>