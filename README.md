# EaseVent - event planning website
Event planning website with NodeJS, Express, AJAX and MySQL.

## Table of contents
* [Description](#description)
* [Setup](#setup)
* [Feature](#feature)
* [Sources](#sources)
* [License](#license)

## Description
This project EaseVent is a social web application that allows users plan events/gatherings and compare calendars to find a suitable time/date for that gathering.

## Setup
1. Nevigate to the directory you want to put the project.
2. Clone the project from Github to the directory you chose and navigate to the directory using the command:
```
# Clone the repository
$ git clone https://github.com/Zhibo2002/Web.git

# Go into the repository
$ cd Project
```
3. Install the dependency using the command:
```
# Install dependencies
$ npm install
```
4. Start the RDBMS using the command:
```
$ mysql --host=127.0.0.1 < easevent.sql
```


## Feature
 - Users
   - Sign up/log in.
   - Be able to log in with Google account.
   - Create a new event.?
   - Generate a link for people without accounts.
   - Specify their availability for an event.?

### To do:
 - See times when everyone is available for an event.
 - System Admins part.
 - Confirm/finalise an event time.

## Sources
This application is inspired by [Eventbrite](https://www.eventbrite.com/).

## License
[MIT](LICENSE)
