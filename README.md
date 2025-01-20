<img src="https://i.ibb.co/5hwnwJC/diagram-export-1-20-2025-9-49-40-PM.png" alt="Diagram" width="500" height="300">
# Authentication System with Dictionary Attack Prevention
## Overview

This repository contains an authentication system designed to protect against dictionary attacks. 
The system limits the number of login attempts to three, after which the user must wait for 15 minutes before attempting to log in again. 
This is achieved by using Redis to store the login attempt data.

## Features
1. Limits login attempts to three per user.
2. Implements a cooldown period of 15 minutes after three failed attempts.
3. Utilizes Redis for efficient storage and retrieval of attempt data.
4. Enhances security by preventing brute-force attacks.

## Prerequisites
1. Node.js
2. Redis server
3. ioredis library for Node.js

```
const client = require('./client');

// Store user's failed attempts
exports.loginFails = async (username) => {
    let attempts = await client.get(`usersLogin:${username}`);
    attempts = attempts ? parseInt(attempts) + 1 : 1;
    await client.set(`usersLogin:${username}`, attempts, 'EX', 60*15);
    return true;
};

// Check if the account is frozen (user can log in)
exports.isAccountFreeze = async (username) => {
    let attempts = await client.get(`usersLogin:${username}`);
    attempts = attempts ? parseInt(attempts) : 0;
    console.log(attempts);
    if (attempts > 2) return true;
    return false;
};
```
