import Vue from 'vue';
import Vuex from 'vuex';
import Auth from './modules/Auth';
import Data from './modules/Data';
import UI from './modules/UI';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: 'Social Media helper',
  },

  modules: {
    Auth,
    Data,
    UI
  },
});
