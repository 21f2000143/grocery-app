# Musice Streaming V2 Web App Report

## Author:
- **Name:** Arv
- **Roll No:** 21f
- **Student Email ID:** 21f1003645@ds.study.iitm.ac.in
- **About:** Hey there! this is , a 26 year old Web Analyst specializing in Google Analytics, Adobe Analytics, Adobe Launch and Google Tag Manager. I am also an undergrad student at IIT Madras BS Degree (Programming and Data Science).


## Description
The Music Streaming Web App is a web-based application designed to display songs information to users also **creation**, **deletion**, and **deletion** of Albums, songs by the User. The purpose of this report is to provide an overview of the app, including its features, functionality, and potential areas for improvement.

## Frameworks used in the project
- ***Flask***:- for backend of the application
- ***VueJS2***:- for UI in the frontend of the application
- ***celery***:- Backend jobs
- ***Flask-sse***:- For server side event
- ***Flask-cache***:- for caching
- ***sqlite module***:- used to create database schema and tables using SQLAlchemy with Flask by
providing defaults and helpers.
## Tools and Technologies
These are tools and technologies to develop Music Streaming Web App. These include:

- ***CSS***:- for styling and aesthetics of the application
- ***MailHog***:- Testing mail feature

- ***redis***:- As brocker
- ***redis-cli***:- for interaction
- ***Git***:- Used local git repo for version control tool.
- ***requests***:- Requests is a popular Python library used for making HTTP requests to APIs, websites, and other web services.
- ***session***:- Flask extension supports Server-side session to our application.
- ***redirect***:-used to redirect a user to another endpoint using a specified URL and assign a specified
status code.
- ***request***:- used to handle HTTP requests and responses.
application's templates folder.
information provided by the user.


## Database Schema
1. ***Relations:*** There are ten tables in the database namely User, Creator, Owner, Playlist , PlaylistSong, Song, Album, Like, Comment, FlaggedContent. There are foreign keys to map tables like song with albums, playlistsong with playlist etc.

2. ***Foreign Keys & References :***
-  Table Playlist - FOREIGN KEY (user_id)  REFERENCES User(id),
                    FOREIGN KEY (creator_id) REFERENCES Creator(id)

- Table PlaylistSong - FOREIGN KEY (playlist_id) REFERENCES Playlist(playlist_id),
                       FOREIGN KEY (song_id) REFERENCES Song(song_id)

- Table Song - FOREIGN KEY (creator_id) REFERENCES Creator(creator_id),
               FOREIGN KEY (album_id) REFERENCES Album(album_id)

- Table Album - FOREIGN KEY (creator_id) REFERENCES Creator(creator_id)

- Table Like - FOREIGN KEY (user_id) REFERENCES User(user_id),
               FOREIGN KEY (creator_id) REFERENCES Creator(creator_id),
               FOREIGN KEY (song_id) REFERENCES Song(song_id)

- Table Comment - FOREIGN KEY (user_id) REFERENCES User(user_id),
                  FOREIGN KEY (song_id) REFERENCES Song(song_id)

- Table FlaggedContent - FOREIGN KEY (song_id) REFERENCES Song(song_id),
                         FOREIGN KEY (creator_id) REFERENCES Creator(id)

## Architecture and Features:
The project code is organised based on its utility in different files. I have named my project ticket-show.
Inside this folder there are four folder including application, db_directory, static, templates and files main.py, .gitignore and requirements.txt.
Images in static folder, templates in template forlder.
Report folder with the report.pdf file, demo video and one instruction.txt file to setup and run this project on windows.

## Routers used in admin.py
- @bp.route('/get/report/data')
- @bp.route('/api/users')
- @bp.route('/api/creators')
- @bp.route('/api/albums')
- @bp.route('/api/admin/songs')
- @bp.route('/api/flags')
- @bp.route('/api/report/content/<int:id>', methods=('GET', 'POST'))
- @bp.route('/report/creator/<int:id>', methods=('GET', 'POST'))
- @bp.route('/remove/flag/<int:id>', methods=('GET', 'POST'))


## Routers used in album.py
- @bp.route('/api/album')
- @bp.route('/api/<int:id>/songs/album')
- @bp.route('/api/create', methods=('GET', 'POST'))
- @bp.route('/api/<int:id>/delete/album', methods=('DELETE',))

## Routers used in auth.py
- @bp.route('/api/register', methods=('GET', 'POST'))
- @bp.route('/api/creator', methods=('GET', 'POST'))
- @bp.route('/api/switch/to/creator', methods=('GET', 'POST'))
- @bp.route('/api/creator/block/<int:id>')
- @bp.route('/api/creator/unblock/<int:id>')
- @bp.route('/api/user/block/<int:id>')
- @bp.route('/api/user/unblock/<int:id>')
- @bp.route('/api/login', methods=('GET', 'POST'))
- @bp.route('/api/admin/login', methods=('GET', 'POST'))
- @bp.before_app_request
- @bp.route('/logout')

## Routers used in playlist.py
- @bp.route('/playlist')
- @bp.route('/<int:id>/songs/playlist')
- @bp.route('/songs/<int:song_id>/add/here/<int:playlist_id>')
- @bp.route('/songs/<int:song_id>/remove/from/<int:playlist_id>')
- @bp.route('/create/playlist', methods=('GET', 'POST'))
- @bp.route('/<int:id>/update/playlist', methods=('GET', 'POST'))
- @bp.route('/<int:id>/delete/playlist', methods=('POST',))

## Routers used in song.py
- @bp.route('/')
- @bp.route('/create', methods=('GET', 'POST'))
- @bp.route('/current/song/<int:song_id>')
- @bp.route('/play/<int:song_id>')
- @bp.route('/<int:id>/update', methods=('GET', 'POST'))
- @bp.route('/<int:id>/delete', methods=('GET', 'POST'))
- @bp.route('/<int:id>/like')
- @bp.route('/<int:id>/add/to/playlist', methods=('GET',))



A short demo video link is here [ Video link ]().