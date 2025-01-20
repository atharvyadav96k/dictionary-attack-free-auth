const client = require('./client');

// store users failed attempts 
exports.loginFails = async (username) => {
    let attempts = await client.get(`usersLogin:${username}`);
    attempts = attempts ? parseInt(attempts) + 1 : 1;
    await client.set(`usersLogin:${username}`, attempts, 'EX', 60*15);
    return true;
}
// check if account is freezed ( user ca login in account )
exports.isAccountFreeze = async (username)=>{
    let attempts = await client.get(`usersLogin:${username}`);
    attempts = attempts ? parseInt(attempts) : 0;
    console.log(attempts)
    if(attempts > 2) return true;
    return false;
}