import { defineStore } from 'pinia';

const useActivityStore = defineStore('activity', {
  state: () => ({
    currentActivityId: null as number | null,
  }),
  actions: {
    setCurrentActivityId(id: number) {
      this.currentActivityId = id;
    },
    clearCurrentActivityId() {
      this.currentActivityId = null;
    },
  },
  persist: true
}); 

export default useActivityStore;

