
# Collaborative ToDo WebApp with Famo.us &amp; PubNub

## Introduction
This is a demo ToDo application which is built using the Famo.us javascript UI framework and supports realtime collaboration
via PubNub data stream network. 

##App URL
The application can be accessed from the following URL. It works best under Google Chrome
http://shyampurk.github.io/famous-basic-todo/

##USAGE
1. The App allows the user to login as one of the three predefined usernames (Peter, Sam or Eric). Launch the app from two or three different browser windows by logging in with one of the predefined users. There is no password required for this app.

2. Once logged in, the user can see the general statistics on all the tasks. The user can click on the "Tasks 0/0" button to see the task list view.

3. Once inside the task list view, the user can start adding tasks by clicking on the new task (+) icon on the top. All tasks are added to a predefined project. To modify the task, user needs to click on the task to be modified. Only the owner of task can modify it.

4. All tasks added or modified by any one of the users will be updated on the other users' app window to allow seamless collaboration.

5. Users can add tasks, modify a task's information or mark a task as complete. All operations on tasks are automatically synced up across all logged in users.

#TODO
1. This is a demo app so the usernames and project is predefined and hard coded in the app.
2. All users must have logged in and opened task list view to get the task updates from other users.The app does not support data sync for users who log in at a later point of time.
3. The App does not support data persistence. Refreshing the browser window will take the user to the login screen and upon relogin the user will not see the tasks added earlier.
