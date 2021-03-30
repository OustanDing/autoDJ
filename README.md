# autoDJ

A custom Spotify playlist generator for your party or friends that combines everyone's music tastes

Current build: https://autodj.party/

<img style="display: inline" src="https://drive.google.com/uc?export=view&id=1INVYI2KX51ELuGBVJWN85R1eMwredeRx" alt="autoDJ Landing Page" width="70%">
<img style="display: inline" src="https://drive.google.com/uc?export=view&id=1ePwyvwOs6aruOyxuRGIcIfhRJCVf97pw" alt="Playlist Settings page" width="70%">
<img style="display: inline" src="https://drive.google.com/uc?export=view&id=1v6t4J6qCCZrb3n0RE1GQkosiMQ0ncrjV" alt="Playlist room page" width="70%">

## How it works

- A host creates a party and invites guests to log in to autoDJ with their Spotify accounts
- autoDJ analyzes Spotify profiles for top tracks, and decides which songs will be most popular for the given crowd
- The host chooses any combination of music genres and a playlist maximum duration, and autoDJ saves the generated playlist directly to the host's Spotify library
- Following playlist creation, the host can manage guests in the autoDJ party and change genres - creating a new playlist or updating the existing one. The party will automatically update

## Tech stack

- Backend: Express.js + MongoDB
- Frontend: React Hooks + Redux
- External APIs: Spotify API, socket.io

Your [feedback](https://forms.gle/MUPs3p9AnL5Xwg6U8) is greatly appreciated!
