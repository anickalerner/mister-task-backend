module.exports = {
    execute
}

function execute() { 
    return new Promise((resolve, reject) => { 
        setTimeout(() => { 
            var rand = Math.random();
            console.log('random:', rand);
            if ( rand > 0.5){
                resolve('ok');
            }
            else {
                reject('error'); 
            }
        }, 0);
    }) 
}