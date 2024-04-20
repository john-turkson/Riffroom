export const usePlaylistStore = defineStore("playlist", {
  state: () => ({
    loading: Boolean,
    userPlaylists: [],
    selectedPlaylist: {},
    playlistSongs: [],
    playlistEditId: Number,
  }),

  actions: {
    async fetchPlaylists() {
      const loggedInUserInfo = JSON.parse(localStorage.getItem("userData"));

      try {
        const { data, pending, refresh } = await useFetch(
          `http://localhost:5000/user/${loggedInUserInfo.user_id}/playlists`,
          {
            server: false,
          }
        );

        this.userPlaylists = data.value.playlists;
        this.loading = pending.value;
      } catch (error) {
        console.error("Error: ", error);
        this.loading = false;
      }
    },

    async searchUserPlaylist(id) {
      const loggedInUserInfo = JSON.parse(localStorage.getItem("userData"));

      try {
        const { data, pending } = await useFetch(
          `http://localhost:5000/playlists/${loggedInUserInfo.user_id}/${id}`,
          {
            server: false,
          }
        );

        console.log(data);

        this.selectedPlaylist = data.value.playlist;
        this.loading = pending.value;
      } catch (error) {
        console.error("Error: ", error);
      }
    },

    async getPlaylistSongs(id) {
      try {
        const { data, pending } = await useFetch(
          `http://localhost:5000/playlist/${id}/music`,
          {
            server: false,
          }
        );

        console.log(data);

        this.playlistSongs = data.value.playlistMusic;
        this.loading = pending.value;
      } catch (error) {
        console.error("Error: ", error);
      }
    },

    searchPlaylistForAudio(id) {
      for (let i = 0; i < this.playlistSongs.length; i++) {
        if (this.playlistSongs[i].id === id) {
          return this.playlistSongs[i].id;
        }
        break;
      }
    },

    removeSongFromPlaylist(songId) {
      try {
        this.loading = true;

        const indexToRemove = this.playlistSongs.findIndex(song => song.id === songId);
        if (indexToRemove !== -1) {
          this.playlistSongs.splice(indexToRemove, 1);
        }
      } catch (error) {
        console.error('Error removing song from playlist:', error);
        // Handle error if needed
      } finally {
        this.loading = false;
      }
    },

  },
});
