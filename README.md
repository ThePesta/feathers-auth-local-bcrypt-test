# Feathers Authentication Local Bcrypt vs Bcryptjs Test


## Results:
*All tests were run from within docker to allow for max cpu core limits*
- CPU: Intel 3770k (hyperthreading disabled)
- OS: Fedora 27

| - | Bcryptjs | Bcrypt (1 core) | Bcrypt (2 core) | Bcrypt (4 core) |
| --- | --- | --- | --- | --- |
| Max signups | 7 | 10 | 20 | 35 |
| Avg time (ms) | 4527 | 3419 | 2934 | 2737 |
| Min time (ms) | 4524 | 1915 | 951 | 658 |
| Max time (ms) | 4531 | 4707 | 4834 | 4878 |

*max signups is number of clients before a single timeout occurs*


## Setup
```
npm install
```

## Run server with bcryptjs

```
npm start
```

## Run server with bcrypt

```
npm run start:bcrypt
```

## Run client

```
npm run client // OPTIONAL NUMBER_OF_USERS=# BCRYPT=1 OR 0
// allows env variables
// NUMBER OF USERS=# (default: 5)
// BCRYPT=1 OR 0 (1 = bcrypt, 2 = bcryptjs)
```

## Run server with bcrypt in docker

```
docker build --network=host --cpuset-cpus=0,1,2,3 -f Dockerfile.bcrypt -t feathers-auth-local-bcrypt .
// change --cpuset-cpus=0 for single core
```
