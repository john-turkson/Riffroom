export const useAudioStore = defineStore("audio", {
  state: () => ({
    usersUploads: [],
    loading: Boolean,
    selectedAudio: {
      artist: "",
      title: "",
      id: Number,
      image: "",
      audioFile: null,
      duration: Number,
      currentTime: 0,
      volume: 100,
    },
    isPlaying: false,
    isMuted: false,
    previousVolume: Number,
    toBeDeleted: false,
    audioEditId: Number,
  }),

  actions: {
    async fetchUploads() {
      const loggedInUserInfo = JSON.parse(localStorage.getItem("userData"));

      try {
        const { data, pending, refresh } = await useFetch(
          `http://localhost:5000/user/${loggedInUserInfo.user_id}/music`,
          {
            server: false,
          }
        );

        this.loading = pending.value;
        this.usersUploads = data.value.music;
      } catch (error) {
        console.error("Error: ", error);
        this.loading = false;
      }
    },

    setSelectedAudio(audioID) {
      this.selectedAudio = audioID;
    },

    searchForSelectedAudio(id) {
      for (let i = 0; i < this.usersUploads.length; i++) {
        if (this.usersUploads[i].id === id) {
          this.selectedAudio.artist = this.usersUploads[i].artist;
          this.selectedAudio.title = this.usersUploads[i].title;
          this.selectedAudio.id = this.usersUploads[i].id;
          this.selectedAudio.image = this.usersUploads[i].image;
          this.selectedAudio.audioFile = new Audio(this.usersUploads[i].audio);

          this.selectedAudio.audioFile.addEventListener(
            "loadedmetadata",
            () => {
              this.selectedAudio.duration =
                this.selectedAudio.audioFile.duration;
            }
          );

          if (this.isPlaying) {
            this.selectedAudio.audioFile.addEventListener("timeupdate", () => {
              this.selectedAudio.currentTime =
                this.selectedAudio.audioFile.currentTime;
            });
          }

          break;
        }
      }
      return null; // If no object with the provided ID is found
    },

    async addAudio(formData) {
      try {
        const { data } = await useFetch(musicRoute, {
          method: "POST",
          body: formData,
        });

        this.loading = true;

        if (data.value) {
          this.fetchUploads();
          console.log(data.value);
          // refreshNuxtData(musicStore.usersUploads);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    },

    nextSong(songID) {
      for (let i = 0; i < this.usersUploads.length; i++) {
        if (this.usersUploads[i].id === songID) {
          if (i < this.usersUploads.length - 1) {
            this.stopAudio();
            this.playOtherAudio(this.usersUploads[i + 1].id);
          }
          break;
        }
      }
    },

    previousSong(songID) {
      for (let i = 0; i < this.usersUploads.length; i++) {
        if (this.usersUploads[i].id === songID) {
          if (i > 0) {
            this.playOtherAudio(this.usersUploads[i - 1].id);
          }
          break;
        }
      }
    },

    togglePlay() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.selectedAudio.audioFile.play();
      } else {
        this.selectedAudio.audioFile.pause();
      }
    },

    stopAudio() {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.selectedAudio.audioFile.pause();
        this.selectedAudio.audioFile.currentTime = 0; // Reset the audio to the beginning
      }
    },

    updateVolume() {
      this.selectedAudio.audioFile.volume = this.selectedAudio.volume / 100;
    },

    muteVolume() {
      if (!this.isMuted) {
        this.isMuted = true;
        this.previousVolume = this.selectedAudio.volume;
        this.selectedAudio.volume = 0;
        this.updateVolume();
      } else {
        this.isMuted = false;
        this.selectedAudio.volume = this.previousVolume;
        this.updateVolume();
      }
    },

    updateCurrentTime() {
      this.selectedAudio.audioFile.currentTime = this.selectedAudio.currentTime;
    },

    startAudio(songID) {
      this.isPlaying = true;
      this.searchForSelectedAudio(songID);
      this.selectedAudio.audioFile.play();
    },

    playOtherAudio(songID) {
      this.stopAudio();
      this.isPlaying = true;
      this.searchForSelectedAudio(songID);
      this.updateVolume();
      this.selectedAudio.audioFile.play();
    },

    playAudio() {
      this.isPlaying = true;
      this.selectedAudio.audioFile.play();
    },

    pauseAudio() {
      this.isPlaying = false;
      this.selectedAudio.audioFile.pause();
    },
  },
});
