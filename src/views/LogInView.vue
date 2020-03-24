<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
      class="text-center mx-auto"
    >
      <v-col>
        <v-card
          class="pa-5 ma-0 mx-auto"
          max-width="500"
        >
          <v-stepper
            v-model="loginStep"
            class="elevation-0"
          >
            <v-stepper-items>
              <LoadingStep />
              <WelcomeStep @send-login-link="$emit('send-login-link', $event)" />
              <EmailSentStep/>
              <SetUpProfileStep  @set-up-profile="$emit('set-up-profile', $event)" :user-node="userNode"/>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingStep from '../components/LogInView/LoadingStep'
import WelcomeStep from '../components/LogInView/WelcomeStep'
import EmailSentStep from '../components/LogInView/EmailSentStep'
import SetUpProfileStep from '../components/LogInView/SetUpProfileStep'

export default {
  name: "LogInView",
  components:{
    LoadingStep,
    WelcomeStep,
    EmailSentStep,
    SetUpProfileStep
  },
  props: ["loginStep","userNode"],
};
</script>
